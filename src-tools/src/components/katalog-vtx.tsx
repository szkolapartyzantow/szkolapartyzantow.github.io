import * as React from "react";
import { ChevronLeft, ChevronRight, ExternalLink, FileText, Search, Settings } from "lucide-react";
import catalogCsvUrl from "@/assets/vtx-catalog/catalog.csv?url";
import { PageContainer } from "./page-container";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";

const DEFAULT_VTX_CATALOG_DATA_URL =
  "https://docs.google.com/spreadsheets/d/1NKE5B1u5A8hL-Flh942pD51NE_eiRQ-5NaSDGjM0-LM/export?format=csv";
const VTX_CATALOG_DATA_URL =
  import.meta.env.VITE_VTX_CATALOG_DATA_URL ?? DEFAULT_VTX_CATALOG_DATA_URL;
const RUNTIME_DATA_CACHE_NAME = "szkolapartyzantow-tools-data-v1";
const PHOTO_COLUMNS = ["Zdjęcie", "Zdjęcie2", "Zdjęcie3"];
const LINK_COLUMNS = ["Strona producenta"];
const CONFIG_GENERATOR_COLUMN = "Wygeneruj konfigurację";

interface VtxCatalogItem {
  row: number;
  title: string;
  fields: Record<string, string>;
}

const photoAssets = import.meta.glob<string>(
  "../assets/vtx-catalog/photos/**/*.webp",
  {
    eager: true,
    import: "default",
    query: "?url",
  },
);

const manualAssets = import.meta.glob<string>(
  "../assets/vtx-catalog/manuals/**/*.{pdf,webp,jpg,jpeg}",
  {
    eager: true,
    import: "default",
    query: "?url",
  },
);

function parseCsvRows(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let inQuote = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuote) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++;
      } else if (char === '"') {
        inQuote = false;
      } else {
        currentField += char;
      }
    } else if (char === '"') {
      inQuote = true;
    } else if (char === ",") {
      currentRow.push(currentField);
      currentField = "";
    } else if (char === "\n" || char === "\r") {
      if (char === "\r" && nextChar === "\n") {
        i++;
      }
      if (currentRow.length > 0 || currentField.length > 0) {
        currentRow.push(currentField);
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = "";
    } else {
      currentField += char;
    }
  }

  if (currentRow.length > 0 || currentField.length > 0) {
    currentRow.push(currentField);
    rows.push(currentRow);
  }

  return rows;
}

function parseCatalogCsv(text: string): VtxCatalogItem[] {
  const [headers, ...dataRows] = parseCsvRows(text);
  if (!headers) {
    return [];
  }

  return dataRows
    .map((row, index) => {
      const fields = Object.fromEntries(
        headers.map((header, fieldIndex) => [header, row[fieldIndex]?.trim() ?? ""]),
      );
      const title = [fields["Producent"], fields["Nazwa"], fields["Moc"]]
        .filter(Boolean)
        .join(" ");

      if (!title) {
        return null;
      }

      return {
        row: index + 1,
        title,
        fields,
      };
    })
    .filter((item): item is VtxCatalogItem => item !== null);
}

async function fetchCatalogCsv() {
  const dataUrl = VTX_CATALOG_DATA_URL.trim();

  if (dataUrl) {
    const request = new Request(dataUrl);
    try {
      const response = await fetch(request);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      if ("caches" in window) {
        const cache = await caches.open(RUNTIME_DATA_CACHE_NAME);
        await cache.put(request, response.clone());
      }

      return response.text();
    } catch (err) {
      if ("caches" in window) {
        const cachedResponse = await caches.match(request, { cacheName: RUNTIME_DATA_CACHE_NAME });
        if (cachedResponse) {
          return cachedResponse.text();
        }
      }

      console.warn("Failed to fetch remote VTX catalog CSV", err);
    }
  }

  const bundledResponse = await fetch(catalogCsvUrl);
  if (!bundledResponse.ok) {
    throw new Error(`Bundled VTX catalog HTTP ${bundledResponse.status}`);
  }

  return bundledResponse.text();
}

function getField(item: VtxCatalogItem, field: string) {
  const value = item.fields[field];
  return value && value.trim() ? value : null;
}

function getSearchText(item: VtxCatalogItem) {
  return [
    item.title,
    getField(item, "Producent"),
    getField(item, "Nazwa"),
    getField(item, "Pasmo"),
    getField(item, "Moc"),
  ]
    .filter(Boolean)
    .join(" ")
    .toLocaleLowerCase("pl");
}

function getPhotoFolder(item: VtxCatalogItem) {
  return `${String(item.row).padStart(3, "0")}-${item.title}`;
}

function getPhotoUrl(item: VtxCatalogItem, photoNumber: number) {
  const folder = getPhotoFolder(item);
  const preferred = `../assets/vtx-catalog/photos/${folder}/photo-${photoNumber}-2.webp`;
  const fallback = `../assets/vtx-catalog/photos/${folder}/photo-${photoNumber}.webp`;
  return photoAssets[preferred] ?? photoAssets[fallback] ?? null;
}

function getPhotos(item: VtxCatalogItem) {
  return PHOTO_COLUMNS.map((column, index) =>
    getField(item, column) ? getPhotoUrl(item, index + 1) : null,
  ).filter((photo): photo is string => Boolean(photo));
}

function getManual(item: VtxCatalogItem) {
  const instructionUrl = getField(item, "Instrukcja");
  if (!instructionUrl) {
    return null;
  }

  const fileName = decodeURIComponent(
    instructionUrl.startsWith("http://") || instructionUrl.startsWith("https://")
      ? new URL(instructionUrl).pathname.split("/").pop() ?? ""
      : instructionUrl.split("/").pop() ?? "",
  );
  return manualAssets[`../assets/vtx-catalog/manuals/${fileName}`] ?? instructionUrl;
}

function CatalogMetric({ label, value }: { label: string; value: string | null }) {
  if (!value) {
    return null;
  }

  return (
    <div className="min-w-0">
      <dt className="text-muted-foreground text-xs">{label}</dt>
      <dd className="truncate text-sm font-medium">{value}</dd>
    </div>
  );
}

function VtxPhotoGallery({
  title,
  photos,
  activePhotoIndex,
  onActivePhotoIndexChange,
}: {
  title: string;
  photos: string[];
  activePhotoIndex: number;
  onActivePhotoIndexChange: (index: number) => void;
}) {
  const activePhoto = photos[activePhotoIndex];
  const hasMultiplePhotos = photos.length > 1;

  if (!activePhoto) {
    return null;
  }

  const showPreviousPhoto = () => {
    onActivePhotoIndexChange((activePhotoIndex - 1 + photos.length) % photos.length);
  };

  const showNextPhoto = () => {
    onActivePhotoIndexChange((activePhotoIndex + 1) % photos.length);
  };

  return (
    <DialogContent className="max-h-[92vh] max-w-[96vw] gap-3 border-0 bg-black p-3 text-white sm:rounded-lg">
      <DialogTitle className="sr-only">{title}</DialogTitle>
      <div className="flex min-h-0 flex-col gap-3">
        <div className="relative flex min-h-0 items-center justify-center">
          <img
            src={activePhoto}
            alt={`${title} ${activePhotoIndex + 1}`}
            className="max-h-[76vh] w-auto max-w-full object-contain"
          />
          {hasMultiplePhotos ? (
            <>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/55 text-white hover:bg-black/75 hover:text-white"
                onClick={showPreviousPhoto}
                aria-label="Poprzednie zdjęcie"
              >
                <ChevronLeft />
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/55 text-white hover:bg-black/75 hover:text-white"
                onClick={showNextPhoto}
                aria-label="Następne zdjęcie"
              >
                <ChevronRight />
              </Button>
            </>
          ) : null}
        </div>

        {hasMultiplePhotos ? (
          <div className="flex items-center justify-center gap-2 overflow-x-auto px-8 pb-1">
            {photos.map((photo, index) => (
              <button
                type="button"
                className="h-14 w-14 shrink-0 overflow-hidden rounded-md border border-white/20 bg-white/10 data-[active=true]:border-white"
                data-active={index === activePhotoIndex}
                onClick={() => onActivePhotoIndexChange(index)}
                aria-label={`Pokaż zdjęcie ${index + 1}`}
                key={`${title}-gallery-photo-${index}`}
              >
                <img
                  src={photo}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </DialogContent>
  );
}

function VtxCard({ item }: { item: VtxCatalogItem }) {
  const photos = getPhotos(item);
  const primaryPhoto = photos[0];
  const manual = getManual(item);
  const configGeneratorUrl = getField(item, CONFIG_GENERATOR_COLUMN);
  const [activePhotoIndex, setActivePhotoIndex] = React.useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const links = LINK_COLUMNS.map((column) => ({ label: column, url: getField(item, column) })).filter(
    (link): link is { label: string; url: string } => Boolean(link.url),
  );

  const openGallery = (photoIndex: number) => {
    setActivePhotoIndex(photoIndex);
    setIsGalleryOpen(true);
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden py-0">
      <button
        type="button"
        className="bg-muted flex aspect-[4/3] w-full items-center justify-center overflow-hidden"
        onClick={() => {
          if (primaryPhoto) {
            openGallery(0);
          }
        }}
        disabled={!primaryPhoto}
        aria-label={primaryPhoto ? `Otwórz galerię ${item.title}` : undefined}
      >
        {primaryPhoto ? (
          <img
            src={primaryPhoto}
            alt={item.title}
            className="h-full w-full object-contain"
            loading="lazy"
          />
        ) : (
          <span className="text-muted-foreground text-sm">Brak zdjęcia</span>
        )}
      </button>
      <CardContent className="flex flex-1 flex-col gap-4 p-4">
        {photos.length > 1 ? (
          <div className="grid grid-cols-4 gap-2">
            {photos.slice(1, 5).map((photo, index) => (
              <button
                type="button"
                className="bg-muted block aspect-square overflow-hidden rounded-md border"
                onClick={() => openGallery(index + 1)}
                aria-label={`Otwórz zdjęcie ${index + 2} w galerii ${item.title}`}
                key={`${item.row}-photo-${index}`}
              >
                <img
                  src={photo}
                  alt={`${item.title} ${index + 2}`}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        ) : null}

        <div className="space-y-1">
          <p className="text-muted-foreground text-xs">#{String(item.row).padStart(3, "0")}</p>
          <h2 className="text-lg leading-tight font-semibold">{item.title}</h2>
        </div>

        <dl className="grid grid-cols-2 gap-3">
          <CatalogMetric label="Producent" value={getField(item, "Producent")} />
          <CatalogMetric label="Moc" value={getField(item, "Moc")} />
          <CatalogMetric label="Pasmo" value={getField(item, "Pasmo")} />
          <CatalogMetric label="Protokół" value={getField(item, "Protokół")} />
          <CatalogMetric label="Kanały" value={getField(item, "Kanały")} />
          <CatalogMetric label="Złącze" value={getField(item, "Złącze")} />
        </dl>

        {getField(item, "Dodatkowo:") ? (
          <div className="border-border text-muted-foreground border-t pt-3 text-sm">
            <p>
              <span className="text-foreground font-medium">Dodatkowo:</span>{" "}
              {getField(item, "Dodatkowo:")}
            </p>
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap gap-2">
          {configGeneratorUrl ? (
            <Button asChild variant="default" size="sm">
              <a href={configGeneratorUrl} target="_blank" rel="noreferrer">
                <Settings />
                Wygeneruj konfigurację
              </a>
            </Button>
          ) : null}
          {manual ? (
            <Button asChild variant="outline" size="sm">
              <a href={manual} target="_blank" rel="noreferrer">
                <FileText />
                Instrukcja
              </a>
            </Button>
          ) : null}
          {links.slice(0, 2).map((link) => (
            <Button asChild variant="ghost" size="sm" key={`${item.row}-${link.label}`}>
              <a href={link.url} target="_blank" rel="noreferrer">
                <ExternalLink />
                {link.label}
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
      <Dialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
        <VtxPhotoGallery
          title={item.title}
          photos={photos}
          activePhotoIndex={activePhotoIndex}
          onActivePhotoIndexChange={setActivePhotoIndex}
        />
      </Dialog>
    </Card>
  );
}

export function KatalogVTX() {
  const [query, setQuery] = React.useState("");
  const [items, setItems] = React.useState<VtxCatalogItem[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let ignore = false;

    fetchCatalogCsv()
      .then((csv) => {
        if (!ignore) {
          setItems(parseCatalogCsv(csv));
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Nie udało się wczytać katalogu.");
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const normalizedQuery = query.trim().toLocaleLowerCase("pl");
  const filteredItems = React.useMemo(() => {
    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => getSearchText(item).includes(normalizedQuery));
  }, [items, normalizedQuery]);

  return (
    <PageContainer title="Katalog VTX">
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-muted-foreground text-sm">
            {filteredItems.length} z {items.length} nadajników
          </div>
          <div className="flex w-full flex-col gap-2 sm:max-w-xl sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Szukaj po nazwie, producencie, paśmie..."
                className="pl-9"
                type="search"
              />
            </div>
          </div>
        </div>

        {error ? (
          <div className="border-destructive text-destructive rounded-md border p-8 text-center">
            {error}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <VtxCard key={item.row} item={item} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="border-border text-muted-foreground rounded-md border p-8 text-center">
            Wczytywanie katalogu...
          </div>
        ) : (
          <div className="border-border text-muted-foreground rounded-md border p-8 text-center">
            Brak wyników dla podanej frazy.
          </div>
        )}
      </div>
    </PageContainer>
  );
}

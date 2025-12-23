export enum DragTableId {
  G1 = "G1",
  G2 = "G2",
  G5 = "G5",
  G6 = "G6",
  G7 = "G7",
  G8 = "G8",
  GI = "GI",
  GS = "GS",
  GC = "GC",
}

export interface DragTableDataPoint {
  mach: number;
  drag_coefficient: number;
}

export class DragTableNode {
  constructor(
    public mach: number,
    public drag_coefficient: number,
    public a: number,
    public b: number,
    public c: number
  ) {}

  calculate_drag(mach: number): number {
    return this.c + mach * (this.b + this.a * mach);
  }
}

export class DragTable {
  public id: DragTableId;
  public nodes: DragTableNode[];

  constructor(id: DragTableId, data: DragTableDataPoint[]) {
    this.id = id;
    this.nodes = [];

    if (data.length < 2) {
      throw new Error("DragTable requires at least 2 data points");
    }

    const size = data.length;

    // First node
    const rate =
      (data[1].drag_coefficient - data[0].drag_coefficient) / (data[1].mach - data[0].mach);
    this.nodes.push(
      new DragTableNode(
        data[0].mach,
        data[0].drag_coefficient,
        0.0,
        rate,
        data[0].drag_coefficient - data[0].mach * rate
      )
    );

    // Middle nodes
    for (let i = 1; i < size - 1; i++) {
      const x1 = data[i - 1].mach;
      const x2 = data[i].mach;
      const x3 = data[i + 1].mach;

      const y1 = data[i - 1].drag_coefficient;
      const y2 = data[i].drag_coefficient;
      const y3 = data[i + 1].drag_coefficient;

      const a =
        ((y3 - y1) * (x2 - x1) - (y2 - y1) * (x3 - x1)) /
        ((x3 * x3 - x1 * x1) * (x2 - x1) - (x2 * x2 - x1 * x1) * (x3 - x1));
      const b = (y2 - y1 - a * (x2 * x2 - x1 * x1)) / (x2 - x1);
      const c = y1 - (a * x1 * x1 + b * x1);

      this.nodes.push(new DragTableNode(data[i].mach, data[i].drag_coefficient, a, b, c));
    }

    // Last node
    this.nodes.push(
      new DragTableNode(
        data[size - 1].mach,
        data[size - 1].drag_coefficient,
        0.0,
        0.0,
        data[size - 1].drag_coefficient
      )
    );
  }

  get_node(index: number): DragTableNode {
    return this.nodes[index];
  }

  find_node(mach: number): { node: DragTableNode; index: number } {
    let low = 0;
    let high = this.nodes.length - 1;

    while (high - low > 1) {
      const mid = Math.floor((high + low) / 2.0);
      if (this.nodes[mid].mach < mach) {
        low = mid;
      } else {
        high = mid;
      }
    }

    if (this.nodes[high].mach - mach > mach - this.nodes[low].mach) {
      return { node: this.nodes[low], index: low };
    } else {
      return { node: this.nodes[high], index: high };
    }
  }
}

export class DragTableStorage {
  private static table_id_to_table: Map<DragTableId, DragTable> = new Map();

  private static readonly G1_DATA_POINTS: DragTableDataPoint[] = [
    { mach: 0.0, drag_coefficient: 0.2629 },
    { mach: 0.05, drag_coefficient: 0.2558 },
    { mach: 0.1, drag_coefficient: 0.2487 },
    { mach: 0.15, drag_coefficient: 0.2413 },
    { mach: 0.2, drag_coefficient: 0.2344 },
    { mach: 0.25, drag_coefficient: 0.2278 },
    { mach: 0.3, drag_coefficient: 0.2214 },
    { mach: 0.35, drag_coefficient: 0.2155 },
    { mach: 0.4, drag_coefficient: 0.2104 },
    { mach: 0.45, drag_coefficient: 0.2061 },
    { mach: 0.5, drag_coefficient: 0.2032 },
    { mach: 0.55, drag_coefficient: 0.202 },
    { mach: 0.6, drag_coefficient: 0.2034 },
    { mach: 0.7, drag_coefficient: 0.2165 },
    { mach: 0.725, drag_coefficient: 0.223 },
    { mach: 0.75, drag_coefficient: 0.2313 },
    { mach: 0.775, drag_coefficient: 0.2417 },
    { mach: 0.8, drag_coefficient: 0.2546 },
    { mach: 0.825, drag_coefficient: 0.2706 },
    { mach: 0.85, drag_coefficient: 0.2901 },
    { mach: 0.875, drag_coefficient: 0.3136 },
    { mach: 0.9, drag_coefficient: 0.3415 },
    { mach: 0.925, drag_coefficient: 0.3734 },
    { mach: 0.95, drag_coefficient: 0.4084 },
    { mach: 0.975, drag_coefficient: 0.4448 },
    { mach: 1.0, drag_coefficient: 0.4805 },
    { mach: 1.025, drag_coefficient: 0.5136 },
    { mach: 1.05, drag_coefficient: 0.5427 },
    { mach: 1.075, drag_coefficient: 0.5677 },
    { mach: 1.1, drag_coefficient: 0.5883 },
    { mach: 1.125, drag_coefficient: 0.6053 },
    { mach: 1.15, drag_coefficient: 0.6191 },
    { mach: 1.2, drag_coefficient: 0.6393 },
    { mach: 1.25, drag_coefficient: 0.6518 },
    { mach: 1.3, drag_coefficient: 0.6589 },
    { mach: 1.35, drag_coefficient: 0.6621 },
    { mach: 1.4, drag_coefficient: 0.6625 },
    { mach: 1.45, drag_coefficient: 0.6607 },
    { mach: 1.5, drag_coefficient: 0.6573 },
    { mach: 1.55, drag_coefficient: 0.6528 },
    { mach: 1.6, drag_coefficient: 0.6474 },
    { mach: 1.65, drag_coefficient: 0.6413 },
    { mach: 1.7, drag_coefficient: 0.6347 },
    { mach: 1.75, drag_coefficient: 0.628 },
    { mach: 1.8, drag_coefficient: 0.621 },
    { mach: 1.85, drag_coefficient: 0.6141 },
    { mach: 1.9, drag_coefficient: 0.6072 },
    { mach: 1.95, drag_coefficient: 0.6003 },
    { mach: 2.0, drag_coefficient: 0.5934 },
    { mach: 2.05, drag_coefficient: 0.5867 },
    { mach: 2.1, drag_coefficient: 0.5804 },
    { mach: 2.15, drag_coefficient: 0.5743 },
    { mach: 2.2, drag_coefficient: 0.5685 },
    { mach: 2.25, drag_coefficient: 0.563 },
    { mach: 2.3, drag_coefficient: 0.5577 },
    { mach: 2.35, drag_coefficient: 0.5527 },
    { mach: 2.4, drag_coefficient: 0.5481 },
    { mach: 2.45, drag_coefficient: 0.5438 },
    { mach: 2.5, drag_coefficient: 0.5397 },
    { mach: 2.6, drag_coefficient: 0.5325 },
    { mach: 2.7, drag_coefficient: 0.5264 },
    { mach: 2.8, drag_coefficient: 0.5211 },
    { mach: 2.9, drag_coefficient: 0.5168 },
    { mach: 3.0, drag_coefficient: 0.5133 },
    { mach: 3.1, drag_coefficient: 0.5105 },
    { mach: 3.2, drag_coefficient: 0.5084 },
    { mach: 3.3, drag_coefficient: 0.5067 },
    { mach: 3.4, drag_coefficient: 0.5054 },
    { mach: 3.5, drag_coefficient: 0.504 },
    { mach: 3.6, drag_coefficient: 0.503 },
    { mach: 3.7, drag_coefficient: 0.5022 },
    { mach: 3.8, drag_coefficient: 0.5016 },
    { mach: 3.9, drag_coefficient: 0.501 },
    { mach: 4.0, drag_coefficient: 0.5006 },
    { mach: 4.2, drag_coefficient: 0.4998 },
    { mach: 4.4, drag_coefficient: 0.4995 },
    { mach: 4.6, drag_coefficient: 0.4992 },
    { mach: 4.8, drag_coefficient: 0.499 },
    { mach: 5.0, drag_coefficient: 0.4988 },
  ];

  static {
    // Initialize G1 table
    const g1DragTable = new DragTable(DragTableId.G1, DragTableStorage.G1_DATA_POINTS);
    DragTableStorage.table_id_to_table.set(DragTableId.G1, g1DragTable);
  }

  static get_drag_table(id: DragTableId): DragTable {
    const table = DragTableStorage.table_id_to_table.get(id);
    if (!table) {
      throw new Error(`No drag table found for given id: ${id}`);
    }
    return table;
  }
}

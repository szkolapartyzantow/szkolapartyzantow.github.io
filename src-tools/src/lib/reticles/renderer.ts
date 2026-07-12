import { drawSixDotsMildotCenterpoint } from "./6-dots-mildot-centerpoint";
import { drawNineDotsMildotCenterpoint } from "./9-dots-mildot-centerpoint";
import { draw618V2Shepherd } from "./618-v2-shepherd";
import { drawAccuRangeRedfield } from "./accu-range-redfield";
import { drawA8VarmintSchmidtBender } from "./a8varmint-schmidt-bender";
import { drawA1Optic } from "./a1optic";
import { drawBallisticLeica25, drawBallisticLeica35 } from "./ballistic-leica";
import {
  drawBallisticPlex27Burris,
  drawBallisticPlex312Burris,
} from "./ballistic-plex-burris-variants";
import { drawBdaDocter25, drawBdaDocter3 } from "./bda-docter";
import { drawBallisticBushnell } from "./ballistic-bushnell";
import { drawBallisticCq556Burris } from "./ballistic-cq-556-burris";
import { drawBallisticPlexBurris } from "./ballistic-plex-burris";
import { drawBdc600Nikon } from "./bdc-600-nikon";
import { drawBdc150Nikon, drawBdc200Nikon } from "./bdc-nikon-variants";
import { drawBdcPredatorNikon } from "./bdc-predator-nikon";
import { drawBdcStandardNikon } from "./bdc-standard-nikon";
import { drawBdc05001Minox10, drawBdc05001Minox20 } from "./bdc-minox";
import { drawBrSwarovski } from "./br-swarovski";
import { drawBrtSwarovski } from "./brt-swarovski";
import { drawBrxBrhSwarovski } from "./brx-brh-swarovski";
import { drawBallisticMildotBurris, drawXtrBallisticMildotBurris } from "./burris-ballistic-mildot";
import { drawBooneCrockettLeupold } from "./boone-crockett-leupold";
import { drawCabelasAlaskanGuide } from "./cabelas-alaskan-guide";
import { drawCmrLeatherwood } from "./cmr-leatherwood";
import { drawDeadHoldBdcDotsVortex } from "./dead-hold-bdc-dots-vortex";
import { drawDeadHoldBdcHashesVortex } from "./dead-hold-bdc-hashes-vortex";
import { drawDoa600Bushnell } from "./doa-600-bushnell";
import { drawEbr1MoaF1Vortex } from "./ebr-1-moa-f1-vortex";
import { drawEbr1MoaS1Vortex } from "./ebr-1-moa-s1-vortex";
import { drawEbr1MradF1Vortex } from "./ebr-1-mrad-f1-vortex";
import { drawEbr1MradS1Vortex } from "./ebr-1-mrad-s1-vortex";
import { drawEbr2bMradVortex } from "./ebr-2b-mrad-vortex";
import { drawEbxWeaver } from "./ebx-weaver";
import { drawEmdrWeaver } from "./emdr-weaver";
import { drawEnhancedMildotFalcon } from "./enhanced-mildot-falcon";
import { drawFiredotLeupold } from "./firedot-leupold";
import { drawGen2MildotPremier } from "./gen2-mildot-premier";
import { drawGen2XrPremier } from "./gen2-xr-premier";
import { drawHorusRemoved } from "./horus-removed";
import { drawKahles4dC25, drawKahles4dC3 } from "./kahles-4d";
import { drawLrDuplexLeupold } from "./lr-duplex-leupold";
import { drawLrvDuplexLeupold } from "./lrv-duplex-leupold";
import { drawLrmoaSightron } from "./lrmoa-sightron";
import { drawLrxNikkoStirling } from "./lrx-nikko-stirling";
import { drawMczDelta } from "./mcz-delta";
import { drawMilDotUsmc } from "./mildot-usmc";
import { drawMilQuadSwfa } from "./mil-quad-swfa";
import { drawMilScaleGapUsOptics } from "./mil-scale-gap-us-optics";
import { drawMildotbarHalfMilMillet } from "./mildotbar-half-mil-millet";
import { drawMildotbar1MilMillet } from "./mildotbar-1-mil-millet";
import { drawMlrNightforce } from "./mlr-nightforce";
import { drawMl16Falcon } from "./ml16-falcon";
import { drawMtr1March } from "./mtr-1-march";
import { drawMoaErPremier } from "./moa-er-premier";
import { drawMsrMaksnipe } from "./msr-maksnipe";
import { drawMp8DotIor } from "./mp8-dot-ior";
import { drawMp20Falcon } from "./mp20-falcon";
import { drawNpR1Nightforce } from "./np-r1-nightforce";
import { drawNpR2Nightforce } from "./np-r2-nightforce";
import { drawNp1rrNightforce } from "./np-1rr-nightforce";
import { drawNp2ddNightforce } from "./np-2dd-nightforce";
import { drawP4lSchmidtBender } from "./p4l-schmidt-bender";
import { drawPso1Russia } from "./pso-1-russia";
import { drawRapidZ1000Zeiss } from "./rapid-z-1000-zeiss";
import { drawRapidZ5Zeiss } from "./rapid-z-5-zeiss";
import { drawRapidZ600Zeiss } from "./rapid-z-600-zeiss";
import { drawRapidZ7Zeiss } from "./rapid-z-7-zeiss";
import { drawRapidZ800Zeiss } from "./rapid-z-800-zeiss";
import { drawRapidZVarmintZeiss } from "./rapid-z-varmint-zeiss";
import { drawRangeFinderBarska, drawRangeFinderNcStar, drawRfLynx } from "./rangefinder-simple";
import { drawSmartReticleSimmons } from "./smart-reticle-simmons";
import { drawSprLeupold } from "./spr-leupold";
import { drawSs14DonutSwfa } from "./ss1-4-donut-swfa";
import { drawTds4Swarovski } from "./tds-4-swarovski";
import {
  draw4a300Swarovski,
  drawAmdMtcOptics,
  drawArtHolland,
  drawBallisticPlex3510Burris,
  drawBdc05112Minox,
  drawBrabant20Falcon,
  drawChevronTrijicon,
  drawContenderBsa,
  drawContenderMildotBsa,
  drawEbr1Moa2510Vortex,
  drawEbr1Mrad2510Vortex,
  drawEpbMilsWotac,
  drawEpbMoaWotac,
  drawFml1March3,
  drawFml1March5,
  drawG2DmrBushnell,
  drawMoarNightforce,
  drawMp8DotModifiedIor,
  drawMp8XtremeIor,
  drawMsrSchmidtBender,
  drawMvVelocity600Nightforce,
  drawPosp8x42Russia,
  drawPrecisionPlexPentax,
  drawRangeFinderOsprey,
  drawRapidReticle221Pfi,
  drawTbxWeaver,
  drawTmdBsa,
  drawVelocity600LvNightforce,
  drawVelocity1000HvNightforce,
  drawVelocity1000UhvNightforce,
  drawWbdcAlpen,
} from "./tail-reticles";
import { drawTmcqMoaVortex, drawTmcqMradVortex } from "./tmcq-vortex";
import { drawTmrLeupold } from "./tmr-leupold";
import { drawVarmintHuntersLeupold } from "./varmint-hunters-leupold";
import { drawVelocity1000Lv5Nightforce } from "./velocity-1000-lv5-nightforce";
import { drawXtrBallistic556Burris, drawXtrBallistic762Burris } from "./xtr-ballistic-burris";
import { drawLp20Falcon } from "./lp20-falcon";
import { drawK556Meopta } from "./k-556-meopta";
import { DEFAULT_RETICLE_ID } from "./names";
import type { ReticleCanvas, ReticleRenderInput } from "./types";

export function drawReticle(canvas: ReticleCanvas, input: ReticleRenderInput): void {
  switch (input.reticleId ?? DEFAULT_RETICLE_ID) {
    case 0:
      drawMilDotUsmc(canvas, input);
      return;
    case 1:
      drawNpR2Nightforce(canvas, input);
      return;
    case 2:
      drawTmrLeupold(canvas, input);
      return;
    case 3:
      drawNpR1Nightforce(canvas, input);
      return;
    case 4:
      drawBallisticMildotBurris(canvas, input);
      return;
    case 5:
      drawXtrBallisticMildotBurris(canvas, input);
      return;
    case 6:
      drawMlrNightforce(canvas, input);
      return;
    case 7:
      drawSprLeupold(canvas, input);
      return;
    case 8:
      drawKahles4dC25(canvas, input);
      return;
    case 9:
      drawKahles4dC3(canvas, input);
      return;
    case 10:
      drawBallisticPlexBurris(canvas, input);
      return;
    case 11:
      drawBdcStandardNikon(canvas, input);
      return;
    case 12:
      drawLrDuplexLeupold(canvas, input);
      return;
    case 13:
      drawBdc600Nikon(canvas, input);
      return;
    case 14:
      drawEbr1MoaF1Vortex(canvas, input);
      return;
    case 15:
      drawMildotbarHalfMilMillet(canvas, input);
      return;
    case 16:
      drawP4lSchmidtBender(canvas, input);
      return;
    case 17:
      drawMtr1March(canvas, input);
      return;
    case 18:
      drawBrSwarovski(canvas, input);
      return;
    case 19:
      drawPso1Russia(canvas, input);
      return;
    case 20:
      drawBdcPredatorNikon(canvas, input);
      return;
    case 21:
      drawA1Optic(canvas, input);
      return;
    case 22:
      drawBallisticBushnell(canvas, input);
      return;
    case 23:
      drawMp8DotIor(canvas, input);
      return;
    case 24:
      drawGen2MildotPremier(canvas, input);
      return;
    case 25:
      drawVarmintHuntersLeupold(canvas, input);
      return;
    case 26:
      drawAccuRangeRedfield(canvas, input);
      return;
    case 27:
      drawCabelasAlaskanGuide(canvas, input);
      return;
    case 28:
      drawEbr1MradF1Vortex(canvas, input);
      return;
    case 29:
      drawDeadHoldBdcDotsVortex(canvas, input);
      return;
    case 30:
      drawMp20Falcon(canvas, input);
      return;
    case 31:
      drawEbr1MradS1Vortex(canvas, input);
      return;
    case 32:
      drawEbr1MoaS1Vortex(canvas, input);
      return;
    case 33:
      drawEnhancedMildotFalcon(canvas, input);
      return;
    case 34:
      drawRapidZ1000Zeiss(canvas, input);
      return;
    case 35:
      drawMildotbar1MilMillet(canvas, input);
      return;
    case 36:
      drawSmartReticleSimmons(canvas, input);
      return;
    case 37:
      drawNp1rrNightforce(canvas, input);
      return;
    case 38:
      drawSixDotsMildotCenterpoint(canvas, input);
      return;
    case 39:
      drawRapidZ5Zeiss(canvas, input);
      return;
    case 40:
      drawTds4Swarovski(canvas, input);
      return;
    case 41:
      drawBooneCrockettLeupold(canvas, input);
      return;
    case 42:
      drawBallisticLeica25(canvas, input);
      return;
    case 43:
      drawBallisticLeica35(canvas, input);
      return;
    case 44:
      drawRapidZ7Zeiss(canvas, input);
      return;
    case 45:
      drawNineDotsMildotCenterpoint(canvas, input);
      return;
    case 46:
      drawGen2XrPremier(canvas, input);
      return;
    case 47:
      drawVelocity1000Lv5Nightforce(canvas, input);
      return;
    case 48:
      drawMsrMaksnipe(canvas, input);
      return;
    case 49:
      drawBdaDocter25(canvas, input);
      return;
    case 50:
      drawBdaDocter3(canvas, input);
      return;
    case 51:
      drawLrmoaSightron(canvas, input);
      return;
    case 52:
      drawLrxNikkoStirling(canvas, input);
      return;
    case 53:
      drawSs14DonutSwfa(canvas, input);
      return;
    case 54:
      draw618V2Shepherd(canvas, input);
      return;
    case 55:
      drawMilQuadSwfa(canvas, input);
      return;
    case 56:
      drawNp2ddNightforce(canvas, input);
      return;
    case 57:
      drawRapidZ600Zeiss(canvas, input);
      return;
    case 58:
      drawMczDelta(canvas, input);
      return;
    case 59:
      drawBallisticCq556Burris(canvas, input);
      return;
    case 60:
      drawEmdrWeaver(canvas, input);
      return;
    case 61:
      drawEbr1MoaS1Vortex(canvas, input);
      return;
    case 62:
      drawMilScaleGapUsOptics(canvas, input);
      return;
    case 63:
      drawBrxBrhSwarovski(canvas, input);
      return;
    case 64:
      drawXtrBallistic556Burris(canvas, input);
      return;
    case 65:
      drawXtrBallistic762Burris(canvas, input);
      return;
    case 66:
      drawRapidZ800Zeiss(canvas, input);
      return;
    case 67:
      drawTmcqMoaVortex(canvas, input);
      return;
    case 68:
      drawDoa600Bushnell(canvas, input);
      return;
    case 69:
      drawDeadHoldBdcHashesVortex(canvas, input);
      return;
    case 70:
      drawTmcqMradVortex(canvas, input);
      return;
    case 71:
      drawMl16Falcon(canvas, input);
      return;
    case 72:
      drawCmrLeatherwood(canvas, input);
      return;
    case 73:
      drawLp20Falcon(canvas, input);
      return;
    case 74:
      drawK556Meopta(canvas, input);
      return;
    case 75:
      drawBallisticPlex27Burris(canvas, input);
      return;
    case 76:
      drawBallisticPlex312Burris(canvas, input);
      return;
    case 77:
      drawNp1rrNightforce(canvas, input);
      return;
    case 78:
      drawSabrLeupold(canvas, input);
      return;
    case 79:
      drawEbxWeaver(canvas, input);
      return;
    case 80:
      drawScbMtcOptics(canvas, input);
      return;
    case 81:
      drawA8VarmintSchmidtBender(canvas, input);
      return;
    case 82:
      drawHorusRemoved(canvas, input);
      return;
    case 83:
      drawBdc200Nikon(canvas, input);
      return;
    case 84:
      drawBdc150Nikon(canvas, input);
      return;
    case 85:
      drawBdc05001Minox20(canvas, input);
      return;
    case 86:
      drawLrvDuplexLeupold(canvas, input);
      return;
    case 87:
      drawEbr1MradS1Vortex(canvas, input);
      return;
    case 88:
      drawBrtSwarovski(canvas, input);
      return;
    case 89:
      drawRangeFinderNcStar(canvas, input);
      return;
    case 90:
      drawRangeFinderBarska(canvas, input);
      return;
    case 91:
      drawRapidZVarmintZeiss(canvas, input);
      return;
    case 92:
      drawBdc05001Minox10(canvas, input);
      return;
    case 93:
      drawMilDotUsmc(canvas, input);
      return;
    case 94:
      drawEbr2bMradVortex(canvas, input);
      return;
    case 95:
      drawRfLynx(canvas, input);
      return;
    case 96:
      drawMoaErPremier(canvas, input);
      return;
    case 97:
      drawVelocity1000HvNightforce(canvas, input);
      return;
    case 98:
      drawBdc05112Minox(canvas, input);
      return;
    case 99:
      drawVelocity600LvNightforce(canvas, input);
      return;
    case 100:
      drawTmdBsa(canvas, input);
      return;
    case 101:
      drawContenderBsa(canvas, input);
      return;
    case 102:
      drawContenderMildotBsa(canvas, input);
      return;
    case 103:
      drawMvVelocity600Nightforce(canvas, input);
      return;
    case 104:
      drawMp8DotModifiedIor(canvas, input);
      return;
    case 105:
      drawRangeFinderOsprey(canvas, input);
      return;
    case 106:
      drawArtHolland(canvas, input);
      return;
    case 107:
      drawWbdcAlpen(canvas, input);
      return;
    case 108:
      drawHorusRemoved(canvas, input);
      return;
    case 109:
      drawTbxWeaver(canvas, input);
      return;
    case 110:
      drawEbr1Moa2510Vortex(canvas, input);
      return;
    case 111:
      drawHorusRemoved(canvas, input);
      return;
    case 112:
      drawHorusRemoved(canvas, input);
      return;
    case 113:
      drawMp8XtremeIor(canvas, input);
      return;
    case 114:
      drawEpbMilsWotac(canvas, input);
      return;
    case 115:
      drawEpbMoaWotac(canvas, input);
      return;
    case 116:
      drawAmdMtcOptics(canvas, input);
      return;
    case 117:
      drawPrecisionPlexPentax(canvas, input);
      return;
    case 118:
      drawBallisticPlex3510Burris(canvas, input);
      return;
    case 119:
      drawVelocity1000UhvNightforce(canvas, input);
      return;
    case 120:
      drawFml1March3(canvas, input);
      return;
    case 121:
      drawFml1March5(canvas, input);
      return;
    case 122:
      drawMsrSchmidtBender(canvas, input);
      return;
    case 123:
      drawMoarNightforce(canvas, input);
      return;
    case 124:
      drawBrabant20Falcon(canvas, input);
      return;
    case 125:
      drawEbr1Mrad2510Vortex(canvas, input);
      return;
    case 126:
      drawRapidReticle221Pfi(canvas, input);
      return;
    case 127:
      draw4a300Swarovski(canvas, input);
      return;
    case 128:
      drawChevronTrijicon(canvas, input);
      return;
    case 129:
      drawPosp8x42Russia(canvas, input);
      return;
    case 130:
      drawFiredotLeupold(canvas, input);
      return;
    case 131:
      drawG2DmrBushnell(canvas, input);
      return;
  }
}
import { drawSabrLeupold } from "./sabr-leupold";
import { drawScbMtcOptics } from "./scb-mtc-optics";

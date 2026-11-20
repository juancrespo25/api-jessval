import bwipjs from 'bwip-js';

export function generarCodigoBarra(idGuia: number): Promise<Buffer> {
  return bwipjs.toBuffer({
    bcid: 'code128',
    text: String(idGuia),
    scale: 3,
    height: 7,
    paddingwidth: 10,
    backgroundcolor: 'FFFFFF',
  });
}

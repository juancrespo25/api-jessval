import PDFDocument from 'pdfkit';
import { GuiaImpresion } from '../../ports/orden';
import { generarCodigoBarra } from './codigo-barra';

const mm = (value: number) => value * 72 / 25.4;

async function dibujarEtiqueta(doc: PDFKit.PDFDocument, guia: GuiaImpresion, columna: number): Promise<void> {
  const x = columna === 0 ? 4 : 63;
  const width = columna === 0 ? 46 : 44;
  const texto = (value: string, dx: number, y: number, ancho: number, size = 6, alto = 2.7, font = 'Helvetica') => {
    doc.font(font).fontSize(size).text(value, mm(dx), mm(y), {
      width: mm(ancho),
      height: mm(alto),
      ellipsis: true,
    });
  };

  texto('JESSVAL OPERADOR LOGISTICO', x, 0.5, 27, 4.5, 2.7, 'Helvetica-Bold');
  const referencia = `${guia.numero}-${guia.item}`;
  doc.font('Helvetica').fontSize(7);
  const tamanoReferencia = Math.min(7, 0.99 * 7 * mm(16) / doc.widthOfString(referencia));
  texto(referencia, x + 29, 0.5, 16, tamanoReferencia, 3.2);
  const barcode = await generarCodigoBarra(guia.id_guia);
  doc.image(barcode, mm(columna === 0 ? 5 : 63), mm(4.5) - 2, {
    width: mm(45),
    height: mm(5),
  });

  texto(guia.cliente, x, 10, width);
  texto((guia.empresa ?? '').toUpperCase(), x, 12.7, width);
  texto((guia.destinatario ?? '').toUpperCase(), x, 15.4, width);
  texto([guia.provincia, guia.distrito].filter(Boolean).join(' - '), x, 18.1, width);
  texto(guia.direccion.toUpperCase(), x, 20.8, width);
  texto(`CONT: ${guia.contenido ?? ''}   PESO: ${guia.peso}   BLT: ${guia.bultos}`, x, 23.5, width);
  texto(`OBS: ${guia.observaciones ?? ''}`, x, 26.2, width);
}

export async function generarEtiquetasBarraPdf(guias: GuiaImpresion[]): Promise<Buffer> {
  const doc = new PDFDocument({ size: [mm(110), mm(30)], margin: 0, autoFirstPage: false });
  const chunks: Buffer[] = [];
  const completed = new Promise<Buffer>((resolve, reject) => {
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  for (let index = 0; index < guias.length; index++) {
    if (index % 2 === 0) doc.addPage();
    await dibujarEtiqueta(doc, guias[index], index % 2);
  }

  doc.end();
  return completed;
}

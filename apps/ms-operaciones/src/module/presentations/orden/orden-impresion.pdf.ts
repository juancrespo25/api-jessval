import PDFDocument from 'pdfkit';
import path from 'node:path';
import { GuiaImpresion } from '../../ports/orden';
import { generarCodigoBarra } from './codigo-barra';

const mm = (value: number) => value * 72 / 25.4;
const cellWidth = mm(97);
const cellHeight = mm(97);
const logo = path.resolve(__dirname, '../../../../images/jessval.png');

type DetalleExtendido = { guia: GuiaImpresion; campos: string[] };

function fecha(value: Date | string): string {
  if (typeof value === 'string') {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value);
    if (match) return `${match[3]}/${match[2]}/${match[1]}`;
  }
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error('Invalid fecha_registro');
  return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
}

async function dibujarGuia(doc: PDFKit.PDFDocument, guia: GuiaImpresion, index: number): Promise<DetalleExtendido | null> {
  const x = mm(5 + (index % 2) * 103);
  const y = mm(3 + Math.floor(index / 2) * 97);
  const campos: string[] = [];

  doc.rect(x, y, cellWidth, cellHeight).lineWidth(0.35).stroke();

  const texto = (label: string, value: string | number | null, dx: number, dy: number, width: number, height: number, size = 6, font = 'Helvetica', detalleLabel = label) => {
    const content = `${label}${value ?? ''}`;
    const options = { width: mm(width), height: mm(height), ellipsis: '... (ver detalle)' };
    doc.font(font).fontSize(size);
    if (doc.heightOfString(content, { width: options.width }) > options.height) {
      campos.push(`${detalleLabel}${value ?? ''}`);
    }
    doc.text(content, x + mm(dx), y + mm(dy), options);
  };

  doc.image(logo, x + mm(3), y + mm(2), { fit: [mm(40), mm(7)] });
  texto('Central 614 6848', '', 65, 3, 29, 4, 6);

  const barcode = await generarCodigoBarra(guia.id_guia);
  doc.image(barcode, x + mm(63), y + mm(9), { width: mm(29), height: mm(7) });
  texto('FECHA: ', fecha(guia.fecha_registro), 3, 15, 55, 4);
  doc.font('Helvetica-Bold').fontSize(9).text(`${guia.numero}-${guia.item}`, x + mm(63), y + mm(17), {
    width: mm(30), height: mm(5), align: 'center',
  });

  texto('CLIENTE: ', guia.cliente, 3, 21, 91, 4);
  texto('EMPRESA: ', guia.empresa, 3, 25, 59, 4);
  texto('', guia.provincia_padre, 70, 25, 24, 4.2, 10, 'Helvetica-Bold', 'PROVINCIA PADRE: ');
  texto('DESTINATARIO: ', guia.destinatario, 3, 29, 91, 4);
  texto('DIRECCION: ', guia.direccion, 3, 33, 91, 8);
  texto('CIUDAD: ', [guia.departamento, guia.provincia, guia.distrito].filter(Boolean).join(' - '), 3, 41, 91, 4);
  texto('CONTENIDO: ', guia.contenido, 3, 45, 91, 4);
  texto('BULTOS: ', guia.bultos, 3, 49, 26, 4);
  texto('UNIDADES: ', guia.unidades, 31, 49, 29, 4);
  texto('PESO: ', guia.peso, 62, 49, 32, 4);
  texto('DOC. ADJUNTOS: ', guia.documentos, 3, 53, 91, 8);
  texto('OBSERVACION: ', guia.observaciones, 3, 61, 91, 8);
  texto('RECIBIO: ', '................................................................................', 3, 70, 91, 4);
  texto('DNI: ', '........................................................................................', 3, 74, 91, 4);
  texto('FECHA: ', '...... / ...... / ........', 3, 78, 35, 4);
  texto('HORA: ', '..............', 40, 78, 22, 4);
  texto('FIRMA: ', '..........................', 64, 78, 30, 4);
  texto('1- DIRECCION INCORRECTA     2- SE MUDO', '', 3, 82, 91, 4);
  texto('3- AUSENTE / NO UBICADO     4- NO QUIERE RECIBIR', '', 3, 86, 91, 4);
  texto('', 'El remitente declara no enviar joyas, valores, dinero en efectivo ni mercaderia peligrosa y asume total responsabilidad por lo no declarado ante JESSVAL OPERADOR LOGISTICO y/o terceros.', 3, 90, 91, 6, 5);

  return campos.length ? { guia, campos } : null;
}

export async function generarGuiasPdf(guias: GuiaImpresion[]): Promise<Buffer> {
  const doc = new PDFDocument({ size: 'A4', margin: 0, autoFirstPage: false });
  const chunks: Buffer[] = [];
  const completed = new Promise<Buffer>((resolve, reject) => {
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
  });

  const detalles: DetalleExtendido[] = [];
  for (let index = 0; index < guias.length; index++) {
    if (index % 6 === 0) doc.addPage();
    const detalle = await dibujarGuia(doc, guias[index], index % 6);
    if (detalle) detalles.push(detalle);
  }

  if (detalles.length > 0) {
    doc.addPage({ margin: mm(10) });
    doc.font('Helvetica-Bold').fontSize(12).text('DETALLE COMPLETO DE LOS CAMPOS EXTENDIDOS');
    for (const { guia, campos } of detalles) {
      doc.moveDown().font('Helvetica-Bold').fontSize(10).text(`Orden ${guia.numero} - Item ${guia.item} - Guia ${guia.id_guia}`);
      doc.font('Helvetica').fontSize(9);
      for (const campo of campos) doc.text(campo);
    }
  }

  doc.end();
  return completed;
}

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const { inflateSync } = require('node:zlib');
const bwipjs = require('bwip-js');
const PDFDocument = require('pdfkit');

require('ts-node').register({ project: path.join(__dirname, '..', 'tsconfig.json') });
require('reflect-metadata');

const app = require('../src/app').default;
const { DataBaseBootstrapp } = require('../src/bootstrapp');
const logo = fs.readFileSync(path.join(__dirname, '..', 'images', 'jessval.png'));
const isLogo = ({ width, height }) => width === logo.readUInt32BE(16) && height === logo.readUInt32BE(20);

async function leerPdf(response, nombre = 'guias', numero = 344444) {
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^application\/pdf/);
  assert.equal(response.headers.get('content-disposition'), `inline; filename="${nombre}-orden-${numero}.pdf"`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const pdf = buffer.toString('latin1');
  assert.ok(pdf.startsWith('%PDF-'));
  assert.match(pdf, /%%EOF\s*$/);

  let text = '';
  const textRuns = [];
  const imageTransforms = [];
  for (const stream of pdf.matchAll(/stream\r?\n([\s\S]*?)\r?\nendstream/g)) {
    let content;
    try {
      content = inflateSync(Buffer.from(stream[1], 'latin1')).toString('latin1');
    } catch {
      continue;
    }
    for (const match of content.matchAll(/([\d.]+)\s+0\s+0\s+-([\d.]+)\s+([\d.]+)\s+([\d.]+)\s+cm\s+\/I\d+\s+Do/g)) {
      imageTransforms.push({ height: Number(match[2]), x: Number(match[3]), bottom: Number(match[4]) });
    }
    for (const match of content.matchAll(/\[([^\]]*)\]\s*TJ/g)) {
      for (const part of match[1].matchAll(/<([0-9a-f]+)>/gi)) {
        text += Buffer.from(part[1], 'hex').toString('latin1');
      }
      text += '\n';
    }
    for (const match of content.matchAll(/BT([\s\S]*?)ET/g)) {
      const position = /1 0 0 1\s+([\d.]+)\s+([\d.]+)\s+Tm/.exec(match[1]);
      const font = /\/(F\d+)\s+([\d.]+)\s+Tf/.exec(match[1]);
      if (!position || !font) continue;
      const value = [...match[1].matchAll(/<([0-9a-f]+)>/gi)]
        .map((part) => Buffer.from(part[1], 'hex').toString('latin1')).join('');
      textRuns.push({ text: value, x: Number(position[1]), y: Number(position[2]), font: font[1], size: Number(font[2]) });
    }
  }
  const fonts = {};
  for (const match of pdf.matchAll(/\/(F\d+)\s+(\d+)\s+0\s+R/g)) {
    const font = new RegExp(`\\b${match[2]} 0 obj\\s*<<(?:(?!endobj)[\\s\\S])*?/BaseFont\\s+/([^\\s]+)`).exec(pdf);
    if (font) fonts[match[1]] = font[1];
  }
  return {
    text,
    textRuns,
    imageTransforms,
    fonts,
    pages: [...pdf.matchAll(/\/Type\s*\/Page\b/g)].length,
    mediaBoxes: [...pdf.matchAll(/\/MediaBox\s*\[\s*0\s+0\s+([\d.]+)\s+([\d.]+)\s*\]/g)]
      .map((match) => [Number(match[1]), Number(match[2])]),
    imageSizes: [...pdf.matchAll(/\d+ 0 obj\s*<<((?:(?!endobj)[\s\S])*?)>>\s*stream\r?\n/g)]
      .map((match) => match[1])
      .filter((dictionary) => /\/Subtype\s*\/Image\b/.test(dictionary))
      .map((dictionary) => ({
        width: Number(/\/Width\s+(\d+)/.exec(dictionary)?.[1]),
        height: Number(/\/Height\s+(\d+)/.exec(dictionary)?.[1]),
      })),
  };
}

test('GET /ordenes/:numero/guias/impresion validates and queries the requested range', async (t) => {
  const originalDataSource = DataBaseBootstrapp.dataSource;
  const originalToBuffer = bwipjs.toBuffer;
  const barcodes = [];
  bwipjs.toBuffer = async (options) => {
    barcodes.push({ bcid: options.bcid, text: options.text });
    return originalToBuffer(options);
  };
  const calls = [];
  let rows = [{
    numero: 344444,
    item: 2,
    id_guia: 123456,
    fecha_registro: '2026-01-01',
    cliente: 'Cliente',
    empresa: 'Empresa',
    destinatario: null,
    direccion: 'Direccion',
    departamento: 'Lima',
    provincia: 'Lima Provincia',
    provincia_padre: 'CALLAO',
    distrito: 'Miraflores',
    contenido: null,
    bultos: 1,
    unidades: 2,
    peso: 3,
    observaciones: null,
    documentos: 'Factura: F001 | Guia Remision: G001',
  }];
  let fail = false;
  DataBaseBootstrapp.dataSource = {
    getRepository() {
      return {
        async query(sql, parameters) {
          calls.push({ sql, parameters });
          if (fail) throw new Error('Database error');
          return rows;
        },
      };
    },
  };

  const server = await new Promise((resolve) => {
    const listening = app.listen(0, '127.0.0.1', () => resolve(listening));
  });
  t.after(async () => {
    await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
    DataBaseBootstrapp.dataSource = originalDataSource;
    bwipjs.toBuffer = originalToBuffer;
  });

  const base = `http://127.0.0.1:${server.address().port}/ordenes`;
  const response = await fetch(`${base}/344444/guias/impresion?itemDesde=2&itemHasta=5`);
  const pdf = await leerPdf(response);
  assert.equal(pdf.pages, 1);
  assert.ok(pdf.imageSizes.some(isLogo));
  assert.ok(pdf.imageSizes.some((size) => !isLogo(size)));
  assert.deepEqual(barcodes[0], { bcid: 'code128', text: '123456' });
  assert.match(pdf.text, /344444-2/);
  assert.doesNotMatch(pdf.text, /GUIA: 123456/);
  assert.match(pdf.text, /CLIENTE: Cliente/);
  assert.match(pdf.text, /EMPRESA: Empresa/);
  assert.match(pdf.text, /CALLAO/);
  const empresa = pdf.textRuns.find((run) => run.text === 'EMPRESA: Empresa');
  const provinciaPadre = pdf.textRuns.find((run) => run.text === 'CALLAO');
  assert.ok(empresa && provinciaPadre);
  assert.equal(pdf.fonts[provinciaPadre.font], 'Helvetica-Bold');
  assert.equal(provinciaPadre.size, 10);
  assert.ok(Math.abs(provinciaPadre.y - empresa.y) < 3);
  assert.ok(Math.abs(provinciaPadre.x - (5 + 70) * 72 / 25.4) < 0.01);
  assert.match(pdf.text, /CIUDAD: Lima - Lima Provincia - Miraflores/);
  assert.match(pdf.text, /DIRECCION: Direccion/);
  assert.match(pdf.text, /Factura: F001/);
  assert.deepEqual(calls[0].parameters, [344444, 2, 5]);
  assert.match(calls[0].sql, /g\.id_guia/);
  assert.match(calls[0].sql, /g\.empresa/);
  assert.match(calls[0].sql, /p\.descripcion\s+AS provincia_padre/i);
  assert.match(calls[0].sql, /ud\.provincia\s+AS provincia/i);
  assert.match(calls[0].sql, /WHERE o\.numero = \$1 AND g\.item BETWEEN \$2 AND \$3/);
  assert.match(calls[0].sql, /ORDER BY g\.item ASC/);
  assert.match(calls[0].sql, /WHERE da\."idGuiaId" = g\.id/);
  assert.match(calls[0].sql, /ORDER BY da\.tipo, da\.numero/);

  const all = await fetch(`${base}/344444/guias/impresion`);
  assert.equal((await leerPdf(all)).pages, 1);
  assert.deepEqual(calls[1].parameters, [344444]);
  assert.match(calls[1].sql, /WHERE o\.numero = \$1\s+ORDER BY g\.item ASC/);
  assert.doesNotMatch(calls[1].sql, /g\.item BETWEEN/);

  rows = [];
  const empty = await fetch(`${base}/344444/guias/impresion?itemDesde=2&itemHasta=2`);
  assert.equal(empty.status, 404);
  assert.equal((await empty.json()).success, false);
  assert.deepEqual(calls[2].parameters, [344444, 2, 2]);

  for (const url of [
    `${base}/abc/guias/impresion?itemDesde=1&itemHasta=2`,
    `${base}/1/guias/impresion?itemDesde=1`,
    `${base}/1/guias/impresion?itemHasta=2`,
    `${base}/1/guias/impresion?itemDesde=&itemHasta=2`,
    `${base}/1/guias/impresion?itemDesde=-1&itemHasta=2`,
    `${base}/1/guias/impresion?itemDesde=1.5&itemHasta=2`,
    `${base}/1/guias/impresion?itemDesde=1e2&itemHasta=200`,
    `${base}/1/guias/impresion?itemDesde=0x1&itemHasta=2`,
    `${base}/1/guias/impresion?itemDesde=2147483648&itemHasta=2147483648`,
    `${base}/1/guias/impresion?itemDesde=3&itemHasta=2`,
    `${base}/1/guias/impresion?itemDesde=1&itemDesde=2&itemHasta=3`,
  ]) {
    const invalid = await fetch(url);
    assert.equal(invalid.status, 400, url);
    assert.equal((await invalid.json()).success, false);
  }
  assert.equal(calls.length, 3);

  rows = Array.from({ length: 7 }, (_, index) => ({
    numero: 344444,
    item: index + 1,
    id_guia: 100000 + index,
    fecha_registro: '2026-01-01',
    cliente: 'Cliente',
    empresa: null,
    destinatario: 'Destinatario',
    direccion: 'Direccion',
    departamento: 'Lima',
    provincia: 'Lima',
    provincia_padre: null,
    distrito: 'Lima',
    contenido: 'Contenido',
    bultos: 1,
    unidades: 2,
    peso: 3,
    observaciones: null,
    documentos: null,
  }));
  const multiple = await leerPdf(await fetch(`${base}/344444/guias/impresion`));
  assert.equal(multiple.pages, 2);
  assert.ok(multiple.imageSizes.filter((size) => !isLogo(size)).length >= 7);
  assert.deepEqual(barcodes.slice(-7), rows.map(({ id_guia }) => ({ bcid: 'code128', text: String(id_guia) })));
  for (let item = 1; item <= 7; item++) assert.match(multiple.text, new RegExp(`344444-${item}`));

  rows = [{
    ...rows[0],
    provincia_padre: 'Provincia extensa '.repeat(15) + 'FIN PROVINCIA',
    observaciones: 'Observacion extensa '.repeat(30) + 'FIN DEL DETALLE',
  }];
  const extended = await leerPdf(await fetch(`${base}/344444/guias/impresion`));
  assert.equal(extended.pages, 2);
  assert.match(extended.text, /ver detalle/);
  assert.match(extended.text, /DETALLE COMPLETO DE LOS CAMPOS EXTENDIDOS/);
  assert.match(extended.text, /FIN DEL DETALLE/);
  assert.match(extended.text, /PROVINCIA PADRE:/);
  assert.match(extended.text, /FIN PROVINCIA/);

  rows = Array.from({ length: 3 }, (_, index) => ({
    numero: 344444,
    item: index + 1,
    id_guia: 765430 + index,
    fecha_registro: '2026-01-01',
    cliente: `Cliente ${index + 1}`,
    empresa: index === 1 ? null : 'Empresa',
    destinatario: 'Destinatario',
    direccion: 'Avenida Central',
    departamento: 'Lima',
    provincia: 'Lima',
    provincia_padre: null,
    distrito: 'Miraflores',
    contenido: 'Documentos',
    bultos: 2,
    unidades: 3,
    peso: 4,
    observaciones: index === 2 ? 'Observacion larga '.repeat(20) : null,
    documentos: null,
  }));
  const beforeEtiquetas = calls.length;
  const etiquetas = await leerPdf(
    await fetch(`${base}/344444/guias/etiquetas-barra?itemDesde=1&itemHasta=3`),
    'etiquetas',
  );
  assert.equal(etiquetas.pages, 2);
  assert.equal(etiquetas.mediaBoxes.length, 2);
  for (const [width, height] of etiquetas.mediaBoxes) {
    assert.ok(Math.abs(width - 110 * 72 / 25.4) < 0.01);
    assert.ok(Math.abs(height - 30 * 72 / 25.4) < 0.01);
  }
  assert.ok(etiquetas.imageSizes.length >= 3);
  assert.deepEqual(barcodes.slice(-3), rows.map(({ id_guia }) => ({ bcid: 'code128', text: String(id_guia) })));
  assert.deepEqual(calls[beforeEtiquetas].parameters, [344444, 1, 3]);
  for (let item = 1; item <= 3; item++) assert.match(etiquetas.text, new RegExp(`344444-${item}`));
  assert.match(etiquetas.text, /JESSVAL OPERADOR LOGISTICO/);
  const encabezados = etiquetas.textRuns.filter((run) => run.text === 'JESSVAL OPERADOR LOGISTICO');
  assert.equal(encabezados.length, 3);
  for (const encabezado of encabezados) assert.equal(etiquetas.fonts[encabezado.font], 'Helvetica-Bold');
  const referencias = etiquetas.textRuns.filter((run) => /^344444-\d$/.test(run.text));
  assert.equal(referencias.length, 3);
  const medicion = new PDFDocument({ size: [110 * 72 / 25.4, 30 * 72 / 25.4], margin: 0 });
  for (let i = 0; i < encabezados.length; i++) {
    const ancho = medicion.font('Helvetica-Bold').fontSize(encabezados[i].size).widthOfString(encabezados[i].text);
    assert.ok(referencias[i].x - (encabezados[i].x + ancho) >= 2 * 72 / 25.4);
    const alto = medicion.font('Helvetica').fontSize(referencias[i].size)
      .heightOfString(referencias[i].text, { width: 16 * 72 / 25.4 });
    assert.ok(0.5 * 72 / 25.4 + alto <= 4.5 * 72 / 25.4 - 2);
  }
  medicion.end();
  assert.equal(etiquetas.imageTransforms.length, 3);
  for (const image of etiquetas.imageTransforms) {
    assert.ok(Math.abs((image.bottom - image.height) - (4.5 * 72 / 25.4 - 2)) < 0.01);
  }
  assert.match(etiquetas.text, /EMPRESA/);
  assert.match(etiquetas.text, /DESTINATARIO/);
  assert.match(etiquetas.text, /Lima - Miraflores/);
  assert.match(etiquetas.text, /AVENIDA CENTRAL/);
  assert.match(etiquetas.text, /CONT: Documentos\s+PESO: 4\s+BLT: 2/);
  assert.match(etiquetas.text, /OBS: Observacion/);
  assert.doesNotMatch(etiquetas.text, /undefined|null/);
  const clientes = etiquetas.textRuns.filter((run) => /^Cliente [12]$/.test(run.text));
  assert.equal(clientes.length, 2);
  assert.ok(Math.abs(clientes[0].x - 4 * 72 / 25.4) < 0.01);
  assert.ok(Math.abs(clientes[1].x - 63 * 72 / 25.4) < 0.01);

  const todasEtiquetas = await leerPdf(await fetch(`${base}/344444/guias/etiquetas-barra`), 'etiquetas');
  assert.equal(todasEtiquetas.pages, 2);
  assert.deepEqual(calls[beforeEtiquetas + 1].parameters, [344444]);
  const invalidEtiqueta = await fetch(`${base}/344444/guias/etiquetas-barra?itemDesde=1`);
  assert.equal(invalidEtiqueta.status, 400);
  rows = [{ ...rows[0], numero: 2147483647, item: 2147483647 }];
  const maximaReferencia = await leerPdf(
    await fetch(`${base}/2147483647/guias/etiquetas-barra`), 'etiquetas', 2147483647,
  );
  assert.equal(maximaReferencia.pages, 1);
  assert.match(maximaReferencia.text, /2147483647-2147483647/);
  rows = [];
  const sinEtiquetas = await fetch(`${base}/344444/guias/etiquetas-barra`);
  assert.equal(sinEtiquetas.status, 404);

  fail = true;
  const failed = await fetch(`${base}/1/guias/impresion?itemDesde=1&itemHasta=2`);
  assert.equal(failed.status, 500);
  const failedEtiquetas = await fetch(`${base}/1/guias/etiquetas-barra`);
  assert.equal(failedEtiquetas.status, 500);
});

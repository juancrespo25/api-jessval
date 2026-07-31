import express from 'express';
import cors from 'cors';
import { ordenRoutes } from './module/presentations/orden';
import { guiaRoutes } from './module/presentations/guia';
import { destinatarioRoutes } from './module/presentations/destinatario/destinatario.routes';
import { contenidoRoutes } from './module/presentations/contenido/contenido.routes';
import { lineaRoutes } from './module/presentations/linea/linea.routes';
import { tipoEnvioRoutes } from './module/presentations/tipoenvio/tipoenvio.routes';
import { manifiestoRoutes } from './module/presentations/manifiesto/manifiesto.routes';
import { guiaManifiestoRoutes } from './module/presentations/guiamanifiesto/guiamanifiesto.routes';
import { zonasRoutes } from './module/presentations/zonas/zonas.routes';
import { parentescoRoutes } from './module/presentations/parentesco';
import { motivoRoutes } from './module/presentations/motivos/motivo.routes';
import { agenteRoutes } from './module/presentations/agentes';
import { empresaTransporteRoutes } from './module/presentations/empresatransporte';
import { despachoRoutes } from './module/presentations/despacho';
import { guiaDespachoRoutes } from './module/presentations/guiadespacho';

class App {
  readonly app = express();

  constructor() {
    this.mountMiddlewaresCommon();
    this.mountRoutes();
  }

  private mountMiddlewaresCommon() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private mountRoutes() {
    this.app.get('/health', (req, res) => {
      res.status(200).json({ status: 'ok' });
    });

    this.app.get('/', (req, res) => {
      res.status(200).json('Welcome to the Area Service API');
    });

    this.app.use('/ordenes', ordenRoutes);
    this.app.use('/guias', guiaRoutes);
    this.app.use('/destinatarios', destinatarioRoutes);
    this.app.use('/contenidos', contenidoRoutes);
    this.app.use('/lineas', lineaRoutes);
    this.app.use('/tipoenvios', tipoEnvioRoutes);
    this.app.use('/manifiestos', manifiestoRoutes);
    this.app.use('/guiamanifiestos', guiaManifiestoRoutes);
    this.app.use('/zonas', zonasRoutes);
    this.app.use('/parentescos', parentescoRoutes);
    this.app.use('/motivos', motivoRoutes);
    this.app.use('/agentes', agenteRoutes);
    this.app.use('/empresas-transporte', empresaTransporteRoutes);
    this.app.use('/despacho', despachoRoutes)
    this.app.use('/guiadespacho', guiaDespachoRoutes);
  }
}

export default new App().app;

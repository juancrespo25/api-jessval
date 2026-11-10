import { IDocAdjuntoPort } from '../../ports/docadjunto';
import { DocAdjunto } from './docadjunto';

export class DocAdjuntoApplication {
  constructor(private readonly docAdjuntoPort: IDocAdjuntoPort) {}

  async save(docAdjunto: DocAdjunto): Promise<DocAdjunto> {
    return this.docAdjuntoPort.save(docAdjunto);
  }
}
import { Orden } from '../../applications/orden';

export interface GuiaImpresion {
  numero: number;
  item: number;
  id_guia: number;
  fecha_registro: Date | string;
  cliente: string;
  empresa: string | null;
  destinatario: string | null;
  direccion: string;
  departamento: string | null;
  provincia: string | null;
  provincia_padre: string | null;
  distrito: string | null;
  contenido: string | null;
  bultos: number;
  unidades: number;
  peso: number;
  observaciones: string | null;
  documentos: string | null;
}

export interface EnvioOrden {
  id_guia: number;
  nombres: string;
  direccion: string;
  destino: string;
  estado: string;
}

export interface OrdenDetalle {
  numero: number;
  cliente: string;
  centrocosto: string;
  origen: string;
  provincia_cubierta: string;
  fecha_registro: Date | string;
  usuario: string;
  envios: EnvioOrden[];
}

export interface FiltrosQueryOrden {
  fecha_inicial: string;
  fecha_final: string;
  numero?: number;
  estado?: string;
  destino?: string;
  origen?: string;
  customer?: string;
  ccosto?: string;
  nombre?: string;
  numero_documento?: string;
}

export interface ResultadoQueryOrden {
  id_guia: number;
  cliente: string;
  ccosto: string;
  nombres: string;
  direccion: string;
  destino: string;
  fecha_registro: Date | string;
  estado: string;
  total_documentos: number;
}

export interface IOrdenPort {
  findById(numero: number): Promise<Orden | null>;
  getOrdenByCode(numero: number): Promise<OrdenDetalle | null>;
  queryOrden(filtros: FiltrosQueryOrden): Promise<ResultadoQueryOrden[]>;
  getOrdenToday(): Promise<Orden[]>;
  save(orden: Orden): Promise<Orden>;
  getGuiasImpresion(numero: number, itemDesde?: number, itemHasta?: number): Promise<GuiaImpresion[]>;
}

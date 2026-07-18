import { DataBaseBootstrapp } from "../../../bootstrapp";
import { IUbigeoPort } from "../../ports/ubigeo";
import { Ubigeo } from "../../applications/ubigeo";
import { UbigeoEntity } from "./entities";
import { Repository } from "typeorm";

export class UbigeoAdapter implements IUbigeoPort {

  private repository: Repository<UbigeoEntity> | null = null;

  private getRepository(): Repository<UbigeoEntity> {
    if (!this.repository) {
      if (!DataBaseBootstrapp.dataSource) {
        throw new Error("Database connection not initialized");
      }
      this.repository = DataBaseBootstrapp.dataSource.getRepository(UbigeoEntity);
    }
    return this.repository;
  }
    async findByName(name: string): Promise<Ubigeo[]> {
        const ubigeos = await this.getRepository()
                        .createQueryBuilder("ubigeo")
                        .select(["ubigeo.codigo","ubigeo.departamento", "ubigeo.provincia", "ubigeo.distrito"])
                        .where("UPPER(ubigeo.provincia) LIKE :name or UPPER(ubigeo.distrito) LIKE :name", {
        name: `${name.toUpperCase()}%`,
      })
                        .getMany();

        if (!ubigeos || ubigeos.length === 0) return [];
        return ubigeos.map(ubigeo => new Ubigeo({
            codigo: ubigeo.codigo,
            departamento: ubigeo.departamento,
            provincia: ubigeo.provincia,
            distrito: ubigeo.distrito
        }));
    }

    async findByCode(code: string): Promise<Ubigeo | null> {
        const ubigeo = await this.getRepository()
                        .createQueryBuilder("ubigeo")
                        .select(["ubigeo.codigo","ubigeo.departamento", "ubigeo.provincia", "ubigeo.distrito"])
                        .where("ubigeo.codigo = :code", { code })
                        .getOne();

        if (!ubigeo) return null;
        return new Ubigeo({
            codigo: ubigeo.codigo,
            departamento: ubigeo.departamento,
            provincia: ubigeo.provincia,
            distrito: ubigeo.distrito
        });
    }

}
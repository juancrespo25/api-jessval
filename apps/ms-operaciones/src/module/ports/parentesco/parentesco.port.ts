import { Parentesco } from "../../applications/parentesco";

export interface IParentescoPort {
  findAll(estado?: boolean): Promise<Parentesco[]>;
  save(parentesco: Parentesco): Promise<Parentesco>;
}
import { env } from "../../../env";
import { UbigeoGatewayPort } from "../../ports/ubigeo-gateway";

export class UbigeoGatewayAdapter implements UbigeoGatewayPort {
  async findByName(name: string): Promise<any> {
    try {

      const response = await fetch(`${env.URL_UBIGEO}/name/${name}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      return await response.json();
    } catch (error) {
      console.error("Error connecting to ubigeo service:", error);
      throw new Error("Failed to connect to ubigeo service");
    }
  }

  async findByCode(code: string): Promise<any> {
    try {
      const response = await fetch(`${env.URL_UBIGEO}/code/${code}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      return await response.json();
    } catch (error) {
      console.error("Error connecting to ubigeo service:", error);
      throw new Error("Failed to connect to ubigeo service");
    }
  }
}

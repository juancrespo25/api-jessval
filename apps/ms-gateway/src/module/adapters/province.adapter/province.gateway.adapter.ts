import { env } from "../../../env";
import { ProvinceGatewayPort } from "../../ports/province.port";

export class ProvinceGatewayAdapter implements ProvinceGatewayPort {
  async findByAll(status: string): Promise<any> {
    try {
        const url = new URL(env.URL_PROVINCE);
        url.searchParams.append('status', status.toString());
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();

    } catch (error) {
      console.error("Error connecting to province service:", error);
      throw new Error("Failed to connect to province service");
    } 
}
}
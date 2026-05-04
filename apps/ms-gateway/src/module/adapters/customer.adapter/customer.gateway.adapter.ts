import { env } from "../../../env";
import { CustomerGatewayPort } from "../../ports/customer-gateway";

export class CustomerGatewayAdapter implements CustomerGatewayPort {
  async create(
    descripcion: string,
    ruc: string,
    direccion: string,
    ubigeo: string,
    contacto: string,
    email: string,
    telefono: string,
    status: boolean,
    userCreated: string,
  ): Promise<any> {
    try {
      const response = await fetch(`${env.URL_CUSTOMER}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          descripcion,
          ruc,
          direccion,
          ubigeo,
          contacto,
          email,
          telefono,
          status,
          userCreated,
        }),
      });
      return await response.json();
    } catch (error) {
      console.error("Error connecting to customer service:", error);
      throw new Error("Failed to connect to customer service");
    }
  }

  async findAll(status: boolean): Promise<any> {
    try {
        const url = new URL(env.URL_CUSTOMER);
        url.searchParams.append('status', status.toString());
        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
      console.error("Error connecting to user service:", error);
      throw new Error("Failed to connect to customer service");
    }
  }
  async findById(code: string): Promise<any> {
    try {
        const responde = await fetch(`${env.URL_CUSTOMER}/${code}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        return await responde.json();
    } catch (error) {
      console.error("Error connecting to user service:", error);
      throw new Error("Failed to connect to customer service");
    }
  }
  async findByName(name: string): Promise<any> {
    try {
        const response = await fetch(`${env.URL_CUSTOMER}/name/${name}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return await response.json();
    } catch (error) {
      console.error("Error connecting to user service:", error);
      throw new Error("Failed to connect to customer service");
    }
  }
  async update(
    codigo: string,
    descripcion: string,
    ruc: string,
    direccion: string,
    ubigeo: string,
    contacto: string,
    email: string,
    telefono: string,
    status: boolean,
    userUpdated: string,
  ): Promise<any> {
    console.log(env.URL_CUSTOMER)
    try {

        const response = await fetch(`${env.URL_CUSTOMER}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ codigo, descripcion, ruc, direccion, ubigeo, contacto, email, telefono, status, userUpdated }),
        });

        return await response.json();
    } catch (error) {
      console.error("Error connecting to user service:", error);
      throw new Error("Failed to connect to customer service");
    }
  }
  async delete(code: string, userUpdated: string): Promise<any> {
    try {
        const response = await fetch(`${env.URL_CUSTOMER}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code, userUpdated }),
        });

        return await response.json();
    } catch (error) {
      console.error("Error connecting to user service:", error);
      throw new Error("Failed to connect to customer service");
    }
  }
}

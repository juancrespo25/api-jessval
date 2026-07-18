import { Application } from 'express';
import http from 'node:http';
import { Bootstrapp } from './bootstrapp';
import { env } from '../env';

export class ServerBootstrap extends Bootstrapp {
    constructor(private readonly app: Application) {
        super();
    }

    initialize(): Promise<string | NodeJS.ErrnoException> {

        return new Promise((resolve, reject) => {
            const server = http.createServer(this.app)
            const PORT = Number(env.PORT) || 4001
            const HOST = env.HOST ?? "0.0.0.0"
            server.listen(PORT, HOST)
                .on("listening", () => resolve(`Server is running on port ${PORT}`))
                .on("error", (error: NodeJS.ErrnoException) => {
                    if (error.syscall != "listen") {
                        return reject(error)
                    }

                    switch (error.code) {
                        case "EACCES":
                            reject(new Error(`Port ${PORT} requires elevated privileges`))
                            break
                        case "EADDRINUSE":
                            reject(new Error(`Port ${PORT} is already in use`))
                            break
                        default:
                            reject(error)
                            break
                    }
                }
                )
        })
    }
}
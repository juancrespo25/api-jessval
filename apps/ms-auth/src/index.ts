import "reflect-metadata";
import app from "./app";
import { type Bootstrapp, ServerBootstrap } from "./bootstrapp"


(async () => {

    try {

        const serverBootstrap: Bootstrapp = new ServerBootstrap(app)

        const promises = [
            serverBootstrap.initialize()
        ]

        const results = await Promise.all(promises)

        for (const msg of results) {
            console.log(msg)
        }
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
})()

process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception: ", error);
    process.exit(1);
})

process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection: ", promise, "reason:", reason);
    process.exit(1);
})

process.on("exit", (code) => {
    console.log("Process is existing");
    gratefulShutdown()
})

process.on("SIGINT", () => {
    console.log("Received SIGINT. Exiting...")
    process.exit(0)
})

process.on("SIGTERM", () => {
    console.log("Received SIGTERM. Exiting...")
    process.exit(0)
})


function gratefulShutdown() {
    console.log("Graceful shutting down...")
    process.exit(0)
}
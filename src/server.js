import express from "express";
import morgan from "morgan";
import cors from "cors";
import { createRoles } from "./libs/initialSetup";
import { dbConnection } from "./db/config";
import productsRoutes from "./routes/products.routes";
import authRoutes from "./routes/auth.routes";

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    //Init DB
    this.dbConnectionStart();

    //Middlewares
    this.middlewares();

    //Routes
    this.routes();
  }

  async dbConnectionStart() {
    await dbConnection();
    await createRoles();
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    //Directorio publico del servidor
    this.app.use(express.static("public"));
    this.app.use(morgan("dev"));
  }

  routes() {
    const basePath = "/api";
    this.app.use(`${basePath}/products`, productsRoutes);
    this.app.use(`${basePath}/auth`, authRoutes);
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Example app listening on port ", this.port);
    });
  }
}

export default Server;

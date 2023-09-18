import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import logger from "morgan";
import helmet from "helmet";
import passport from "passport";
import "reflect-metadata";

dotenv.config();
import ApiRoutes from "./routes";

const origins = ["http://localhost:4200", "https://orbitplus.xyz", "https://customer.orbitplus.xyz"];

class App {
  express: express.Application;

  constructor() {
    this.express = express();
    this.setMiddlewares();
    this.mountRoutes();
    this.setRoutes();
  }

  setMiddlewares() {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));
    this.express.use(logger("dev"));
    this.express.use(compression());
    this.express.use(helmet());
    this.express.use(
      cors({
        origin: (origin: any, callback) => {
          console.log("origin", origin);
          if (!origin) return callback(null, true);
          if (origins.indexOf(origin) === -1) {
            const msg = `The CORS policy for this site does not allow access from ${origin} Origin.`;
            return callback(new Error(msg), false);
          }
          return callback(null, true);
        },
      })
    );
  }

  private mountRoutes(): void {
    const router = express.Router();
    router.get("/", (req, res) => {
      res.json({
        message: "Hello World!",
      });
    });
    this.express.use("/", router);
  }

  setRoutes() {
    require("./passport/index")(passport);
    this.express.use("/api/", ApiRoutes);
  }
}

export default new App().express;

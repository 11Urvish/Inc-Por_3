import * as http from "http";
// import "./config/data-source";
import App from "./app";

import { AppDataSource } from "./database/data-source";

// const port = process.env.PORT || 8085;
const port = 8085;

App.set("port", port);

const server = http.createServer(App);

AppDataSource.initialize().then(async () => {
  console.log("Database connected");
  server.listen(port);
});

server.on("listening", () => {
  console.log(`Listening on port ${port}`);
});

server.on("error", (error: NodeJS.ErrnoException) => {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

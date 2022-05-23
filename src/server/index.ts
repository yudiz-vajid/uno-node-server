import helmet from 'helmet';
import compression from 'compression';
import express, { Express } from 'express';
import http, { Server as HttpServer } from 'http';
import router from '../app/routers';

class Server {
  public app!: Express;

  public httpServer!: HttpServer;

  async initialize() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.setupMiddleware();
    this.setupServer();
    global.app = this.app;
  }

  private setupMiddleware() {
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json({ limit: '100kb' }));
    this.app.use(express.urlencoded({ extended: true }));

    this.app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
      next();
    });

    this.app.use('/', router);
  }

  private setupServer() {
    this.httpServer.timeout = 10000;
    this.httpServer.listen(process.env.PORT, () => log.info(`Spinning on ${process.env.PORT} 🌀`));
  }
}

const server = new Server();
export default server;

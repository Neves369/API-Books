import 'express-async-errors';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import authController from './app/controllers/authController';
import userController from './app/controllers/userController';
import bookController from './app/controllers/bookController';

const app = express();
 
app.use(morgan('tiny')); 
app.use(helmet());
app.use(express.urlencoded({ extended: false }));
app.use(express.json({limit: '50mb'}));
app.use(express.json({ type: 'application/vnd.api+json' }));
app.use(cors());


authController(app);
userController(app);
bookController(app);
 
app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500).send(error.message);
})

const port = process.env.PORT || 3000;

app.listen(port, () =>{
    console.log("Aplicação rodando na porta ", port);
});
 
export default app;
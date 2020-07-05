import 'reflect-metadata';
import 'express-async-errors';
import express from 'express';
import cors from 'cors';

import { Request, Response, NextFunction } from 'express';


import uploadConfig from './config/uploadConfig';
import routes from './routes';
import './database';
import AppError from './errors/AppError';

const app = express();
app.use(express.json());
app.use(routes);

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use((err:Error, request:Request, response:Response, _:NextFunction) => {
    if(err instanceof AppError){
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
    }
});

app.use('/files', express.static(uploadConfig.directory));

app.listen(3333, ()=>{
    console.log('Server started on port 3333');
});

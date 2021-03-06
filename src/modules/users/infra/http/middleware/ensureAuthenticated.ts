import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '@shared/errors/AppError';

import authConfig from '@config/auth';

interface TokenPayload {
    int: number;
    exp: number;
    sub: string;
}

export default function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction
): void {
    const authHeader = request.headers.authorization;
    if(!authHeader){
        throw new AppError('JWT token is missing', 401);
    }
    // Bearer Token
    const [,token] = authHeader.split(' ');

    const decoded = verify(token, authConfig.jwt.secret);
    const { sub } = decoded as TokenPayload;

    // O id do user fica disponivel para todas as rotas
    request.user = {
        id: sub,
        };
        return next();
}

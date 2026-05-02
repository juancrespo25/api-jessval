import { NextFunction, Request, Response } from 'express';
import { env } from '../../env';

export class AuthMiddleware {

    static async canActivate(req: Request, res: Response, next: NextFunction) {

        const {authorization} = req.headers;

        if(!authorization){
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const token = authorization.split(' ')[1];

        if(!token){
            res.status(401).json({message: 'Unauthorized'});
            return;
        }

        const response = await fetch(`${env.URL_AUTH}/verify-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({token}),
        });

        const status = await response.json();

        if (status.isValid){
            next();
        } else {
            res.status(401).json({message: 'Unauthorized'});
        }

    }
}


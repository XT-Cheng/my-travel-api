import { NextFunction, Request, Response, Router } from 'express';

import { asyncMiddleware } from '../utils/utility';
import { UserModel } from '../data-model/user.model';

export class UserRoute {
    public static create(router: Router) {
        console.log('User route create');

        //Load Users
        router.get('/users', asyncMiddleware(async(req: Request, res: Response, next: NextFunction) => {
            UserRoute.load(req, res, next);
        }));

        //Insert Users
        router.post('/users', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await UserRoute.insert(req, res, next);
        }));
    }

    private static async load(req: Request, res: Response, next: NextFunction) {
        let ret = await UserModel.findUsers();
        res.json(ret);
    }

    private static async insert(req: Request, res: Response, next: NextFunction) {
        await UserModel.createUser(req.body);
        res.json(true);
    }
}
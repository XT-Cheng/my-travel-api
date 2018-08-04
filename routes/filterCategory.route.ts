import { NextFunction, Request, Response, Router } from 'express';

import { FilterCategoryModel } from '../data-model/filterCateogry.model';
import { asyncMiddleware } from '../utils/utility';

export class FilterCategoryRoute {
    public static create(router: Router) {
        console.log('FilterCategory route create');

        //Load Filter Categories
        router.get('/filterCategories', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await FilterCategoryRoute.load(req, res, next);
        }));

        //Insert Filter Categories
        router.post('/filterCategories', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await FilterCategoryRoute.insert(req, res, next);
        }));
    }

    private static async load(req: Request, res: Response, next: NextFunction) {
        let ret = await FilterCategoryModel.findFilterCategories();
        res.json(ret);
    }

    private static async insert(req: Request, res: Response, next: NextFunction) {
        await FilterCategoryModel.createFilterCategory(req.body);
        res.json(true);
    }
}
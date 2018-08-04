import { NextFunction, Request, Response, Router } from 'express';
import * as multer from 'multer';

import { CityModel } from '../data-model/city.model';
import { asyncMiddleware } from '../utils/utility';

var upload = multer({ dest: './uploads/' })

export class CityRoute {
    public static create(router: Router) {
        console.log('City route create');

        //Load Cities
        router.get('/cities', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            CityRoute.load(req, res, next);
        }));

        //Insert City
        router.post('/cities', upload.any(), asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await CityRoute.insert(req, res, next);
        }));

        //Update City
        router.put('/cities', upload.any(), asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await CityRoute.update(req, res, next);
        }));

        //Delete City
        router.delete('/cities/:id', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await CityRoute.delete(req, res, next);
        }));
    }

    private static async update(req: Request, res: Response, next: NextFunction) {
        let city: any;
        if (req.is('application/json')) {
            city = req.body;
        }
        else {
            city = JSON.parse(req.body.cities)[0];
            if (req.files[0])
                city.thumbnail = `assets/img/${req.files[0].filename}`;
        }

        await CityModel.updateCity(city);
        res.json([city]);
    }

    private static async load(req: Request, res: Response, next: NextFunction) {
        let ret = await CityModel.findCities();
        res.json(ret);
    }

    private static async insert(req: Request, res: Response, next: NextFunction) {
        let city = JSON.parse(req.body.cities)[0];
        city.thumbnail = `assets/img/${req.files[0].filename}`;
        await CityModel.createCities(city);
        res.json([city]);
    }

    private static async delete(req: Request, res: Response, next: NextFunction) {
        let city = await CityModel.findById(req.params.id);
        await CityModel.deleteCity(req.params.id);
        res.json([city]);
    }

}
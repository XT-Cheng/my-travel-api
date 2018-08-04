import { NextFunction, Request, Response, Router } from 'express';

import { TravelAgendaModel } from '../data-model/travelAgenda.model';
import { asyncMiddleware } from '../utils/utility';

export class TravelAgendaRoute {
    public static create(router: Router) {
        console.log('Travel Agenda route create');

        //Insert Travel Agenda
        router.post('/travelAgendas', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await TravelAgendaRoute.insert(req, res, next);
        }));
        //Update Travel Agenda
        router.put('/travelAgendas', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await TravelAgendaRoute.update(req, res, next);
        }));
        //Load Travel Agendas
        router.get('/travelAgendas', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await TravelAgendaRoute.load(req, res, next);
        }));
        //Delete Travel Agendas
        router.delete('/travelAgendas/:id', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await TravelAgendaRoute.delete(req, res, next);
        }));
    }

    private static async delete(req: Request, res: Response, next: NextFunction) {
        await TravelAgendaModel.deleteTravelAgenda(req.params.id);
        res.json(true);
    }

    private static async update(req: Request, res: Response, next: NextFunction) {
        await TravelAgendaModel.updateTravelAgenda(req.body);
        res.json(true);
    }

    private static async insert(req: Request, res: Response, next: NextFunction) {
        await TravelAgendaModel.createTravelAgenda(req.body);
        res.json(true);
    }

    private static async load(req: Request, res: Response, next: NextFunction) {
        let ret = await TravelAgendaModel.findTravelAgendas();
        res.json(ret);
    }
}
import { NextFunction, Request, Response, Router } from 'express';
import * as multer from 'multer';

import { ViewPointModel } from '../data-model/viewPoint.model';
import { asyncMiddleware } from '../utils/utility';

var upload = multer({ dest: './uploads/' })

export class ViewPointRoute {
    public static create(router: Router) {
        console.log('ViewPoint route create');

        //Load ViewPoint comments (pagination) by ViewPoint id
        router.get('/viewPoints/:id/comments', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            ViewPointRoute.loadComments(req, res, next);
        }));

        //Load ViewPoint with some comments retrieved
        router.get('/viewPoints', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await ViewPointRoute.load(req, res, next);
        }));

        //Load ViewPoint by City with some comments retrieved
        router.get('/:cityId/viewPoints', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await ViewPointRoute.loadByCity(req, res, next);
        }));

        //Insert ViewPoint comment by ViewPoint id
        router.post('/viewPoints/:id/comment', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await ViewPointRoute.addComment(req, res, next);
        }));

        //Insert ViewPoint
        router.post('/viewPoints', upload.any(), asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await ViewPointRoute.insert(req, res, next);
        }));

        //Update ViewPoint
        router.put('/viewPoints', upload.any(), asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await ViewPointRoute.update(req, res, next);
        }));

        //Delete ViewPoint
        router.delete('/viewPoints/:id', asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            await ViewPointRoute.delete(req, res, next);
        }));
    }

    private static async delete(req: Request, res: Response, next: NextFunction) {
        await ViewPointModel.deleteViewPoint(req.params.id);
        res.json(true);
    }

    private static async insert(req: Request, res: Response, next: NextFunction) {
        let viewPoint = JSON.parse(req.body.viewPoints)[0];
        viewPoint.images = [];
        (req.files as Express.Multer.File[]).forEach(file => {
            if (file.fieldname.startsWith('thumbnail')) {
                viewPoint.thumbnail = `assets/img/${file.filename}`;
            }
            else {
                viewPoint.images.push(`assets/img/${file.filename}`);
            }
        });
        await ViewPointModel.createViewPoint(viewPoint);
        res.json([viewPoint]);
    }

    private static async addComment(req: Request, res: Response, next: NextFunction) {
        let viewPoint = await ViewPointModel.findById(req.params.id)
        if (viewPoint == null) throw new Error("ViewPoint Id " + req.params.id + " not exist");
        await viewPoint.addComment(req.body);

        res.json(true);
    }

    private static async loadComments(req: Request, res: Response, next: NextFunction) {
        var vp = await ViewPointModel.loadComments(req.params.id, parseInt(req.query['skip']), parseInt(req.query['limit']));
        res.json(vp);
    }

    private static async load(req: Request, res: Response, next: NextFunction) {
        let ret = await ViewPointModel.findViewPoints();
        res.json(ret);
    }

    private static async loadByCity(req: Request, res: Response, next: NextFunction) {
        let ret = await ViewPointModel.findViewPointsByCity(req.params.cityId);
        res.json(ret);
    }

    private static async update(req: Request, res: Response, next: NextFunction) {
        let viewPoint: any;
        if (req.is('application/json')) {
            viewPoint = req.body;
        }
        else {
            viewPoint = JSON.parse(req.body.viewPoints)[0];
            (req.files as Express.Multer.File[]).forEach(file => {
                if (file.fieldname.startsWith('thumbnail')) {
                    viewPoint.thumbnail = `assets/img/${file.filename}`;
                }
                else {
                    viewPoint.images.push(`assets/img/${file.filename}`);
                }
            })
        }

        await ViewPointModel.updateViewPoint(viewPoint);
        res.json([viewPoint]);
    }
}
import { NextFunction, Request, Response, Router } from 'express';
import * as multer from 'multer';

import { asyncMiddleware } from '../utils/utility';

var upload = multer({ dest: './uploads/' })

export class FileUploadRoute {
    public static create(router: Router) {
        console.log('File Upload route create');

        router.post('/fileUpload', upload.any(), asyncMiddleware(async (req: Request, res: Response, next: NextFunction) => {
            FileUploadRoute.upload(req, res, next);
        }));
    }

    private static async upload(req: Request, res: Response, next: NextFunction) {
        console.log('upload()');
        res.json(true);
    }
}
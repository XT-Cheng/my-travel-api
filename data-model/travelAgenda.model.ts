import { arrayProp, ModelType, prop, Ref, staticMethod, Typegoose } from '../typegoose/typegoose';
import { ViewPoint } from './viewPoint.model';
import { TransportationCategory } from './transportationCategory.model';

export class TravelViewPoint extends Typegoose{
    @prop()
    _id: string;
    @prop()
    get id() : string {
        return this._id
    };
    set id(value) {
        this._id = value;
    }
    @prop({ref: TransportationCategory,idType: 'String'})
    transportationToNext: Ref<TransportationCategory>;
    @prop({ref: ViewPoint,idType: 'String'})
    viewPoint: Ref<ViewPoint>;
}

new TravelViewPoint().getModelForClass(TravelViewPoint, {
    schemaOptions: {
        toJSON: {
            virtuals: true,
            transform: (doc, ret, options) => {
                delete ret._id;
                return ret;
            }
        }
    }
});

export class DailyTrip extends Typegoose{
    @prop()
    _id: string;
    @prop()
    get id() : string {
        return this._id
    };
    set id(value) {
        this._id = value;
    }
    @arrayProp({items: TravelViewPoint})
    travelViewPoints : TravelViewPoint[];
}

new DailyTrip().getModelForClass(DailyTrip, {
    schemaOptions: {
        toJSON: {
            virtuals: true,
            transform: (doc, ret, options) => {
                delete ret._id;
                return ret;
            }
        }
    }
});

export class TravelAgenda extends Typegoose {
    @prop()
    _id: string;
    @prop()
    get id() : string {
        return this._id
    };
    set id(value) {
        this._id = value;
    }
    @prop()
    name: string;
    @prop()
    user: string;
    @prop()
    cover: string;
    @arrayProp({items: DailyTrip})
    dailyTrips:  DailyTrip[];
    @staticMethod
    static createTravelAgenda(this: ModelType<TravelAgenda> & typeof TravelAgenda,create: any) {
        return this.create(create);
    }
    @staticMethod
    static updateTravelAgenda(this: ModelType<TravelAgenda> & typeof TravelAgenda,update: any) {
        return  this.findByIdAndUpdate(update.id,update);
    }
    @staticMethod
    static deleteTravelAgenda(this: ModelType<TravelAgenda> & typeof TravelAgenda,id: string) {
        return this.findByIdAndRemove(id);
    }

    @staticMethod
    static findTravelAgendas(this: ModelType<TravelAgenda> & typeof TravelAgenda) {
        return this.find().populate({
            path: 'dailyTrips.travelViewPoints.viewPoint',
            options: { 
                slice: {
                    'comments': [0,ViewPoint.commentsFirstLoad],
                }
             }
        }).exec();
    }
};

export var TravelAgendaModel = new TravelAgenda().getModelForClass(TravelAgenda, {
    schemaOptions: {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret, options) => {
                ret.dailyTrips.forEach(dt => {
                    dt.travelViewPoints.forEach(tvp => {
                        tvp.dailyTrip = dt.id;
                    });
                    dt.travelAgenda = ret.id;
                });
                delete ret.__v;
                delete ret._id;
                return ret;
            }
        }
    }
});

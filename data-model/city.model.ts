import { ModelType, prop, staticMethod, Typegoose } from '../typegoose/typegoose';

export class City extends Typegoose {
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
    adressCode: string;
    @prop()
    thumbnail: string;
    @staticMethod
    static findCities(this: ModelType<City> & typeof City) {
        return this.find();
    }
    @staticMethod
    static createCities(this: ModelType<City> & typeof City,create: any) {
        return this.create(create);
    }
    @staticMethod
    static updateCity(this: ModelType<City> & typeof City,update: any) {
        return  this.findByIdAndUpdate(update.id,update);
    }
    @staticMethod
    static deleteCity(this: ModelType<City> & typeof City,id: string) {
        return this.findByIdAndRemove(id);
    }
}

export var CityModel = new City().getModelForClass(City, {
    schemaOptions: {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret, options) => {
                delete ret.__v;
                delete ret._id;
                return ret;
            }
        }
    }
});

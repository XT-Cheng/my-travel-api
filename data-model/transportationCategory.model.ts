import { ModelType, prop, staticMethod, Typegoose } from '../typegoose/typegoose';

export class TransportationCategory extends Typegoose {
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
    isDefault : boolean;
    @staticMethod
    static findCategories(this: ModelType<TransportationCategory> & typeof TransportationCategory) {
        return this.find();
    }
}

export var TransportationCategoryModel = new TransportationCategory().getModelForClass(TransportationCategory, {
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

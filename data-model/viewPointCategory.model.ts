import { ModelType, prop, staticMethod, Typegoose } from '../typegoose/typegoose';

export class ViewPointCategory extends Typegoose {
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
    @staticMethod
    static findCategories(this: ModelType<ViewPointCategory> & typeof ViewPointCategory) {
        return this.find();
    }
}

export var ViewPointCategoryModel = new ViewPointCategory().getModelForClass(ViewPointCategory, {
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

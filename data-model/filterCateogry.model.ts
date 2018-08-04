import { arrayProp, ModelType, prop, staticMethod, Typegoose } from '../typegoose/typegoose';

export class FilterCriteria extends Typegoose {
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
    criteria: string;
}

new FilterCriteria().getModelForClass(FilterCriteria, {
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

export class FilterCategory extends Typegoose {
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
    filterFunction: string;
    @arrayProp({ items: FilterCriteria })
    criteries: FilterCriteria[];
    @staticMethod
    static findFilterCategories(this: ModelType<FilterCategory> & typeof FilterCategory) {
        return this.find();
    }
    @staticMethod
    static createFilterCategory(this: ModelType<FilterCategory> & typeof FilterCategory,create: any) {
        return this.create(create);
    }
}

export var FilterCategoryModel = new FilterCategory().getModelForClass(FilterCategory, {
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

import {
  arrayProp,
  instanceMethod,
  InstanceType,
  ModelType,
  prop,
  Ref,
  staticMethod,
  Typegoose,
} from '../typegoose/typegoose';
import { City } from './city.model';
import { ViewPointCategory } from './viewPointCategory.model';

export class ViewPointComment extends Typegoose {
    @prop()
    _id: string;
    @prop()
    get id(): string {
        return this._id
    };
    set id(value) {
        this._id = value;
    }
    @prop()
    detail: string;
    @prop()
    user: string;
    @prop()
    avatar: string;
    @prop({ default: Date.now })
    publishedAt: Date;
    @arrayProp({ items: String })
    images: string[];
    @prop()
    rate: number;
}

new ViewPointComment().getModelForClass(ViewPointComment, {
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

export class ViewPoint extends Typegoose {
    public static readonly commentsFirstLoad = 2;
    @prop()
    _id: string;
    @prop()
    get id(): string {
        return this._id
    };
    set id(value) {
        this._id = value;
    }
    @prop()
    name: string;
    @prop({ ref: City, idType: 'String' })
    city: Ref<City>;
    @prop()
    description: string;
    @prop()
    tips: string;
    @prop()
    timeNeeded: string;
    @prop()
    thumbnail: string;
    @prop()
    address: string;
    @prop()
    latitude: number;
    @prop()
    longtitude: number;
    @prop({ ref: ViewPointCategory, idType: 'String' })
    category: Ref<ViewPointCategory>;
    @prop()
    rank: number;
    @arrayProp({ items: String })
    images: string[];
    @arrayProp({ items: String })
    tags: string[];
    @prop({ default: 0 })
    countOfComments: number;
    @arrayProp({ items: ViewPointComment })
    comments: ViewPointComment[];
    @instanceMethod
    addComment(this: InstanceType<ViewPoint>, comment: ViewPointComment) {
        this.comments.push(comment);
        this.countOfComments++;
        return this.save();
    }
    @staticMethod
    static loadComments(this: ModelType<ViewPoint> & typeof ViewPoint, id: string, skip: number, limit: number) {
        //NOTE: https://stackoverflow.com/questions/7670073/how-to-combine-both-slice-and-select-returned-keys-operation-in-function-update
        return this.findById(id).slice('comments', [skip, limit])
            .select({
                name: 0,
                city: 0,
                updatedAt: 0,
                createdAt: 0,
                description: 0,
                tips: 0,
                timeNeeded: 0,
                thumbnail: 0,
                address: 0,
                latitude: 0,
                longtitude: 0,
                category: 0,
                rank: 0,
                tags: 0,
                images: 0,
                countOfComments: 0
            });
    }
    @staticMethod
    static findViewPoints(this: ModelType<ViewPoint> & typeof ViewPoint) {
        return this.find().slice('comments', [0, ViewPoint.commentsFirstLoad]);
    }
    @staticMethod
    static findViewPointsByCity(this: ModelType<ViewPoint> & typeof ViewPoint, cityId: string) {
        return this.find({ city: cityId }).slice('comments', [0, ViewPoint.commentsFirstLoad]);
    }
    @staticMethod
    static updateViewPoint(this: ModelType<ViewPoint> & typeof ViewPoint, update: any) {
        return this.findByIdAndUpdate(update.id, update);
    }
    @staticMethod
    static deleteViewPoint(this: ModelType<ViewPoint> & typeof ViewPoint, id: string) {
        return this.findByIdAndRemove(id);
    }
    @staticMethod
    static createViewPoint(this: ModelType<ViewPoint> & typeof ViewPoint, create: any) {
        return this.create(create);
    }
}

export var ViewPointModel = new ViewPoint().getModelForClass(ViewPoint, {
    schemaOptions: {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret, options) => {
                delete ret._id;
                delete ret.__v;
                return ret;
            }
        }
    }
});

//#region Classic mongoose
// var childSchma = new Schema({
//     user : String
// },{timestamps: true});
// childSchma.pre('save',(next)=> {
//     console.log('pre save child');
//     next();
// })

// var blogSchema = new Schema({
//     title:  String,
//     author: String,
//     users : [childSchma]
//   },{timestamps: true});

// blogSchema.pre('save',(next)=> {
//     console.log('pre save blog');
//     next();
// })

// export var blogModel = model('blog',blogSchema);
//#endregion

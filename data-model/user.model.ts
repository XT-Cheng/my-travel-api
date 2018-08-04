import { ModelType, prop, staticMethod, Typegoose } from '../typegoose/typegoose';

export class User extends Typegoose {
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
    nick: string;
    @prop()
    picture: string;
    @prop()
    password: string;
    @staticMethod
    static findUsers(this: ModelType<User> & typeof User) {
        return this.find();
    }
    @staticMethod
    static findByName(this: ModelType<User> & typeof User, name : string) {
        return this.findOne({name: name});
    }
    @staticMethod
    static createUser(this: ModelType<User> & typeof User,create: any) {
        return this.create(create);
    }
}

export var UserModel = new User().getModelForClass(User, {
    schemaOptions: {
        timestamps: true,
        toJSON: {
            virtuals: true,
            transform: (doc, ret, options) => {
                delete ret.__v;
                delete ret._id;
                delete ret.password;
                return ret;
            }
        }
    }
});

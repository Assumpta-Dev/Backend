import mongoose, { Document } from "mongoose";
export interface Users extends Document {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: "user" | "admin";
    createdAt: Date;
    isActive: boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export declare const userModel: mongoose.Model<Users, {}, {}, {}, mongoose.Document<unknown, {}, Users, {}, mongoose.DefaultSchemaOptions> & Users & Required<{
    _id: mongoose.Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, Users>;
//# sourceMappingURL=users.d.ts.map
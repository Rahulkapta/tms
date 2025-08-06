import { Schema, model, Document } from 'mongoose';

export interface IRole extends Document {
    name: 'SUPER ADMIN' | 'ADMIN' | 'EMPLOYEE' | 'CUSTOMER';
    permissions: string[];
    createdAt: Date;
    updatedAt: Date;
}

const roleSchema = new Schema<IRole>({
    name: {
        type: String,
        enum: ['SUPER ADMIN', 'ADMIN', 'EMPLOYEE', 'CUSTOMER'],
        required: true,
        unique: true,
    },
    permissions: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

roleSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export const Role = model<IRole>('Role', roleSchema); 
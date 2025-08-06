import { Schema, model, Document, Types } from 'mongoose';

export interface ILabel extends Document {
    name: string;
    color: string;
    createdBy: Types.ObjectId;
    updatedBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const labelSchema = new Schema<ILabel>({
    name: { type: String, required: true },
    color: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

labelSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

export const Label = model<ILabel>('Label', labelSchema); 
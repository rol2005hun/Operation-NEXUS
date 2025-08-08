import mongoose from 'mongoose';

export interface IPendingEmailChange {
    _id: string;
    userId: string;
    currentEmail: string;
    newEmail: string;
    token: string;
    createdAt: Date;
    updatedAt: Date;
}

const pendingEmailChangeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    currentEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    newEmail: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

pendingEmailChangeSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

export const PendingEmailChange = mongoose.models.PendingEmailChange as mongoose.Model<IPendingEmailChange> || mongoose.model<IPendingEmailChange>('PendingEmailChange', pendingEmailChangeSchema);
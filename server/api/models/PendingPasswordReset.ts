import mongoose from 'mongoose';

export interface IPendingPasswordReset {
    _id: string;
    userId: string;
    email: string;
    token: string;
    createdAt: Date;
    updatedAt: Date;
}

const pendingPasswordResetSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    email: {
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

pendingPasswordResetSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

export const PendingPasswordReset = mongoose.models.PendingPasswordReset as mongoose.Model<IPendingPasswordReset> || mongoose.model<IPendingPasswordReset>('PendingPasswordReset', pendingPasswordResetSchema);
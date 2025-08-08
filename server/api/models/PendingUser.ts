import mongoose from 'mongoose';

export interface IPendingUser {
    _id: string;
    username: string;
    email: string;
    password: string;
    agentName: string;
    verificationToken: string;
    createdAt: Date;
    updatedAt: Date;
}

const pendingUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    agentName: {
        type: String,
        required: true
    },
    verificationToken: {
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps: true
});

pendingUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

export const PendingUser = mongoose.models.PendingUser as mongoose.Model<IPendingUser> || mongoose.model<IPendingUser>('PendingUser', pendingUserSchema);
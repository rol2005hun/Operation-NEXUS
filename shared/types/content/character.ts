export interface Character extends BaseEntity {
    id: string;
    name: string;
    role: string;
    department: string;
    background: string;
    avatar: string;
    isSuspect?: boolean; // default: false
    personality?: string; // default: ' '
    alibi?: string; // default: ' '
    motive?: string; // default: ' '
    lastSeen?: Date; // default: ' '
}
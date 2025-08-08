export interface Objective extends BaseEntity {
    id: string;
    title: string;
    description: string;
    hints?: string[]; // default: []
}

export interface MissionEvent extends BaseEntity {
    id: string;
    timestamp: Date;
    title: string;
    description: string;
    participants: string[];
    revealedBy: string[];
    location?: string; // default: 'Unknown'
}

export interface EvidenceItem {
    id: string;
    title: string;
    description: string;
    type: string;
    icon: string;
    discoveredAt: Date;
}
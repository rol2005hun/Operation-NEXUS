export interface Mission extends BaseEntity {
    id: string;
    title: string;
    description: string;
    briefing: string;
    thumbnail: string;
    difficulty: DifficultyLevel;
    estimatedTime: string;
    securityClearance: SecurityClearanceLevel;
    icon: string;
    price?: number; // default: 0
    available?: boolean; // default: true
}
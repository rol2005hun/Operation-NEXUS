export interface MissionContent extends BaseEntity {
    setting: MissionSetting;
    characters: Character[];
    emails: Email[];
    chats: Chat[];
    files: FileDocument[];
    availableApps: string[];
    objectives: Objective[];
    timeline: MissionEvent[];
    evidenceItems: string[];
    cryptoMessages: CryptoMessage[];
    customApps?: MissionApp[]; // default: []
}

export interface MissionSetting {
    location: string;
    organization: string;
    department: string;
    timeframe: string;
    context: string;
    backgroundInfo: string;
    playerEmailDomain: string;
}
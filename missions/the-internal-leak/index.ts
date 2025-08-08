import { setting } from './settings';
import { characters } from './characters';
import { emails } from './emails';
import { chats } from './chats';
import { files } from './files';
import { missionMetadata } from './metadata';
import { availableApps } from './apps';
import { timeline } from './timeline';
import { objectives } from './objectives';
import { evidenceItems } from './evidences';
import { cryptoMessages } from './cryptos';
import type { MissionContent } from '../../shared/types';

export const missionContent: MissionContent = {
    setting,
    characters,
    emails,
    chats: chats,
    files,
    availableApps,
    objectives,
    timeline,
    evidenceItems,
    cryptoMessages
};

export { missionMetadata };
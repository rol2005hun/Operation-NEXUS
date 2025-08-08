# Mission Creation Guide

This comprehensive guide shows how to create new investigation missions for NEXUS - Digital### 4. `characters.ts` - Investigation Participants
```typescript
import type { Character } from '../../shared/types';

export const characters: Character[] = [
    {
        id: 'character_001',
        name: 'John Doe',
        role: 'Position Title',
        department: 'Department Name',
        background: 'Detailed background, history, motivations, and relevant information',
        avatar: '👨‍💼',
        isSuspect: false,
        personality: 'Personality traits and behavioral patterns',
        alibi: 'Their claimed whereabouts (for suspects)',
        motive: 'Potential motive for crime (for suspects)',
        lastSeen: new Date('2025-07-15T16:30:00')
    }
];ncy.

## Mission Structure Overview

Each mission consists of **12 required files** that work together to create a complete investigation experience. All files must be present and properly configured for the mission to function correctly.

## Quick Start

1. **Create mission folder**: `missions/your-mission-id/`
2. **Create all 12 required files** (see detailed structure below)
3. **Register mission** in `utils/registerMission.ts`
4. **Test mission** from the main menu

## Complete File Structure

### Required Files (All 12 Must Be Present)

```
missions/your-mission-id/
├── index.ts          # Main mission export
├── metadata.ts       # Mission metadata and briefing
├── settings.ts       # Mission environment settings
├── characters.ts     # People involved in investigation
├── emails.ts         # Email communications
├── chats.ts          # Chat conversations
├── files.ts          # Documents and file evidence
├── evidences.ts      # Collectible evidence items list
├── cryptos.ts        # Encrypted messages for CryptoCracker
├── apps.ts           # Available applications for this mission
├── objectives.ts     # Mission objectives and goals
└── timeline.ts       # Chronological events timeline
```

## Detailed File Documentation

### 1. `index.ts` - Mission Export Hub
```typescript
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
  chats,
  files,
  availableApps,
  objectives,
  timeline,
  evidenceItems,
  cryptoMessages
};

export { missionMetadata };
```

### 2. `metadata.ts` - Mission Information
```typescript
import type { Mission } from '../../shared/types';

export const missionMetadata: Mission = {
    id: 'your-mission-id',
    title: 'Your Mission Title',
    description: 'Brief compelling description of the investigation case',
    briefing: `
{classified-tag}CLASSIFIED{/}
{classified-tag}DIGITAL INVESTIGATION AGENCY{/}

### 🕵️‍♂️ OPERATION: YOUR OPERATION NAME

#### 📋 Mission Overview
Detailed briefing about the case, what happened, and why DIA was contacted.

#### 🎭 Your Cover
Description of the player's cover identity and role in the investigation.

#### 🔐 Access Granted
- List of systems player has access to
- Email servers, chat systems, files, etc.

#### 🎯 Objective
Clear statement of what the player needs to accomplish.
    `,
    thumbnail: 'mission-thumbnail.jpg',
    difficulty: 'Medium',
    estimatedTime: '45 minutes',
    securityClearance: 'Level 2',
    icon: '🕵️',
    price: 1
};
```

### 3. `settings.ts` - Mission Environment
```typescript
import type { MissionSetting } from '../../shared/types';

export const setting: MissionSetting = {
    location: 'City, State/Country',
    organization: 'Organization Name',
    department: 'Relevant Department',
    timeframe: 'Month Year',
    context: 'Brief context of the investigation',
    backgroundInfo: 'Detailed background information about the case',
    playerEmailDomain: 'organization.com'
};
```

### 4. `characters.ts` - Investigation Participants
```typescript
import type { Character } from '../../shared/types';

export const characters: Character[] = [
    {
        id: 'character_001',
        name: 'John Doe',
        role: 'Position Title',
        department: 'Department Name',
        background: 'Detailed background, history, motivations, and relevant information',
        avatar: '�‍💼',
        personality: 'Personality traits and behavioral patterns',
        isSuspect: false, // true for suspects
        alibi: 'Their claimed whereabouts (for suspects)',
        motive: 'Potential motive for crime (for suspects)'
    }
];
```

### 5. `emails.ts` - Email Communications
```typescript
import type { Email } from '../../shared/types';

export const emails: Email[] = [
    {
        id: 'email_001',
        from: 'sender@organization.com',
        to: 'recipient@organization.com',
        subject: 'Email Subject Line',
        body: 'Email content with evidence or suspicious activity',
        timestamp: new Date('2025-07-15T10:30:00'),
        cc: ['cc@organization.com'],
        folder: 'inbox',
        attachments: ['file_001']
    }
];
```

### 6. `chats.ts` - Chat Conversations
```typescript
import type { Chat } from '../../shared/types';

export const chats: Chat[] = [
    {
        id: 'chat_001',
        participants: ['character_001', 'character_002'],
        messages: [
            {
                id: 'chat_001_message_001',
                sender: 'character_001',
                content: 'Message content',
                timestamp: new Date('2025-07-15T14:00:00'),
                attachments: ['file_001']
            }
        ],
        image: '💬',
        name: 'Chat Room Name',
        status: 'online'
    }
];
```

### 7. `files.ts` - Documents and Evidence Files
```typescript
import type { FileDocument } from '../../shared/types';

export const files: FileDocument[] = [
    {
        id: 'file_001',
        name: 'document_name.pdf',
        type: 'document',
        size: '2.0 MB',
        lastModified: new Date('2025-07-15T11:30:00'),
        author: 'John Doe',
        content: 'File content that players can read and analyze'
    }
];
  }
];
```

### 8. `evidences.ts` - Collectible Evidence List
```typescript
export const evidenceItems: string[] = [
    'email_001',
    'email_005',
    'chat_003',
    'file_001',
    'file_007',
    'crypto_001'
];
```

### 9. `cryptos.ts` - Encrypted Messages
```typescript
import type { CryptoMessage } from '../../shared/types';

export const cryptoMessages: CryptoMessage[] = [
  {
    id: 'crypto_001',
    encryptedText: 'Jr arrq gb znxr n qrny',
    decryptedText: 'We need to make a deal',
    cipher: 'ROT13'
  },
  {
    id: 'crypto_002',
    encryptedText: 'ZRRG NG PRAGENY CNEX',
    decryptedText: 'MEET AT CENTRAL PARK',
    cipher: 'ROT13'
  }
];
```

### 10. `apps.ts` - Available Applications
```typescript
export const availableApps: string[] = [
    'secureMail',
    'cipherChat',
    'cryptoCracker',
    'fileReader'
];
```

### 11. `objectives.ts` - Mission Goals
```typescript
import type { Objective } from '../../shared/types';

export const objectives: Objective[] = [
    {
        id: 'obj_001',
        title: 'Objective Title',
        description: 'Clear description of what the player needs to accomplish',
        hints: [
            'Helpful hint about how to approach this objective',
            'Another clue to guide the player'
        ]
    }
];
```

### 12. `timeline.ts` - Event Chronology
```typescript
import type { MissionEvent } from '../../shared/types';

export const timeline: MissionEvent[] = [
    {
        id: 'event_001',
        timestamp: new Date('2025-07-01T10:00:00'),
        title: 'Event Title',
        description: 'What happened at this point in time',
        participants: ['character_001', 'character_002'],
        revealedBy: ['email_001', 'file_003'],
        location: 'Where the event took place'
    }
];
```

## Mission Registration

Add your mission to `utils/registerMission.ts`:

```typescript
import { missionContent as theInternalLeak, missionMetadata as theInternalLeakMetadata } from '@/missions/the-internal-leak';
import { missionContent as yourMission, missionMetadata as yourMissionMetadata } from '@/missions/your-mission-id';

export const missionRegistry = {
    'the-internal-leak': {
        content: theInternalLeak,
        metadata: theInternalLeakMetadata
    },
    'your-mission-id': {
        content: yourMission,
        metadata: yourMissionMetadata
    }
};
```

## Mission ID Rules

- **Must be unique** across all missions
- **Must match folder name** exactly
- **Use kebab-case** (lowercase with hyphens)
- **Be descriptive** of the investigation type
- Examples: `the-internal-leak`, `banking-fraud-investigation`, `cyber-espionage-case`

## Evidence System (2025 Architecture)

### SOLID Principles Implementation
- **Centralized Evidence**: All evidence defined in `evidences.ts`
- **Clean Interfaces**: No evidence properties in Email/Chat/File interfaces
- **Dynamic Evidence**: CryptoCracker can add evidence during gameplay

### Evidence Workflow
1. **Define Evidence**: List all collectible evidence IDs in `evidences.ts`
2. **Reference Evidence**: Import `evidenceItems` in mission's `index.ts`
3. **Check Evidence**: Game store validates evidence with `isRealEvidence(id)`
4. **Collect Evidence**: Players collect evidence through EvidenceLocker app

## Testing Your Mission

1. **Start Development Server**: Run the "Start Development Server" task
2. **Select Mission**: Choose your mission from the main menu
3. **Test Completeness**: Verify all files load without errors
4. **Test Evidence**: Ensure evidence items are collectible
5. **Test Applications**: Verify all listed apps work correctly
6. **Test Objectives**: Confirm objectives are achievable

## Mission Development Best Practices

### Content Guidelines
- **Realistic Communication**: Make emails and chats feel authentic
- **Compelling Narrative**: Create engaging storylines with clear motives
- **Balanced Difficulty**: Provide enough clues without making it too obvious
- **Consistent Timeline**: Ensure events happen in logical chronological order

### Technical Guidelines
- **Follow TypeScript Interfaces**: Use exact interface definitions
- **Unique IDs**: Every entity needs a unique identifier
- **Proper Timestamps**: Use realistic dates and times
- **Complete Characters**: Include background, personality, and motivations

### Evidence Guidelines
- **Clear Evidence Trail**: Each objective should have discoverable evidence
- **Multiple Evidence Types**: Use emails, chats, files, and crypto messages
- **Logical Connections**: Evidence should logically connect to reveal the story
- **Red Herrings**: Include some misleading evidence for complexity

## Reference Mission

The `the-internal-leak` mission serves as the complete reference implementation. Study its structure and content organization to understand best practices for mission creation.

## Common Pitfalls

- **Missing Files**: All 12 files must be present
- **ID Mismatches**: Mission ID must match everywhere
- **Broken Evidence**: Evidence IDs must reference actual content
- **Invalid Timestamps**: Use proper Date objects
- **Missing Registration**: Mission must be registered in utils
- **App Availability**: Only list apps that exist in the system

## Mission Types & Themes

### Corporate Investigations
- Internal data breaches
- Insider threats
- Corporate espionage
- Fraud investigations

### Law Enforcement Cases
- Digital forensics
- Cybercrime investigations
- Financial crimes
- Identity theft cases

### Security Incidents
- Network intrusions
- Malware investigations
- Social engineering attacks
- State-sponsored threats

## Interface Summary & Field Notes

### Required Fields Only
All interfaces use **only required fields** - optional fields are handled with default values in code:

#### Mission Interface
- `id`, `title`, `description`, `briefing`, `thumbnail`, `difficulty`, `estimatedTime`, `securityClearance`, `icon`, `price`

#### Character Interface
- Required: `id`, `name`, `role`, `department`, `background`, `avatar`
- Optional: `isSuspect`, `personality`, `alibi`, `motive`, `lastSeen` (all have defaults)

#### Email Interface
- Required: `id`, `from`, `to`, `subject`, `body`, `timestamp`
- Optional: `cc`, `folder`, `attachments` (defaults: `[]`, `'inbox'`, `[]`)

#### Chat Interface
- Required: `id`, `participants`, `messages`, `image`
- Optional: `name`, `status` (defaults: participant names, `'offline'`)

#### ChatMessage Interface
- Required: `id`, `sender`, `content`, `timestamp`
- Optional: `attachments` (default: `[]`)

#### FileDocument Interface
- Required: `id`, `name`, `type`, `size`, `lastModified`, `author`, `content`

#### Objective Interface
- Required: `id`, `title`, `description`
- Optional: `hints` (default: `[]`)

#### MissionEvent Interface
- Required: `id`, `timestamp`, `title`, `description`, `participants`, `revealedBy`
- Optional: `location` (default: `'Unknown'`)

#### CryptoMessage Interface
- Required: `id`, `encryptedText`, `decryptedText`, `cipher`
- Optional: `key` (only for ciphers that need keys)
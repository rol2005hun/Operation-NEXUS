import type { Mission } from '../../shared/types';

export const missionMetadata: Mission = {
    id: 'the-internal-leak',
    title: 'The Internal Leak',
    description: 'Nexus-Corp hired the DIA to investigate a suspected data breach. Working undercover as a new employee, discover who is leaking classified defense project information.',
    briefing: `
{classified-tag}CLASSIFIED{/}
{classified-tag}DIGITAL INVESTIGATION AGENCY{/}

### 🕵️‍♂️ OPERATION: CORPORATE INFILTRATION

#### 📋 Mission Overview

{company}Nexus-Corp Industries{/}, a major defense contractor, contacted the DIA after discovering suspicious network activity suggesting internal data theft of their classified **Sentinel-X project**.

#### 🎭 Your Cover

You are now employed as a **junior analyst** at {company}Nexus-Corp{/}. Management believes you are a legitimate new hire. ::span{danger}Only the CEO knows your true identity.::

#### 🔐 Access Granted

- All internal corporate email servers
- Company-wide chat systems and communications
- File access logs and security monitoring data

#### 🎯 Objective

Analyze intercepted communications, identify the leak, and gather evidence of corporate espionage. The stolen data is worth {money}$47M{/} and contains classified defense technology.

#### ⚠️ Remember

::div{warning}Maintain your cover. **Nobody can know you're DIA.**::
    `,
    thumbnail: '/missions/leak.jpg',
    difficulty: 'Rookie',
    estimatedTime: '30-50 mins',
    available: true,
    securityClearance: 1,
    icon: '🕵️‍♂️'
};
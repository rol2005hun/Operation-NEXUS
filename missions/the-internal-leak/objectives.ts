import type { Objective } from '../../shared/types';

export const objectives: Objective[] = [
    {
        id: 'obj_001',
        title: 'Establish Cover Identity',
        description: 'Successfully integrate into Nexus-Corp as a junior analyst after the security breach discovery',
        hints: ['Review your mission briefing sent after Irene Walker contacted DIA', 'Understand your cover mission']
    },
    {
        id: 'obj_002',
        title: 'Analyze Corporate Communications',
        description: 'Monitor and analyze all intercepted communications for suspicious activity',
        hints: ['Look for technical discussions about bypassing security', 'Watch for unusual working hours']
    },
    {
        id: 'obj_003',
        title: 'Trace External Contacts',
        description: 'Analyze intercepted communications to identify competitor connections',
        hints: ['Review intercepted external communications', 'Follow the payment trail']
    },
    {
        id: 'obj_004',
        title: 'Build Prosecution Case',
        description: 'Gather sufficient evidence to identify the insider and their methods',
        hints: ['Connect all communications to one suspect', 'Establish timeline of the data theft']
    },
    {
        id: 'obj_005',
        title: 'Maintain Operational Security',
        description: 'Complete investigation without revealing your true identity to anyone except CEO',
        hints: ['Only the CEO knows your real identity', 'Maintain cover as new employee']
    }
];
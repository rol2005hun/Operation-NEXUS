import type { MissionEvent } from '../../shared/types';

export const timeline: MissionEvent[] = [
    {
        id: 'event_001',
        timestamp: new Date('2025-06-15T14:20:00'),
        title: 'Psychological Evaluation Red Flags',
        description: 'HR psychologist identifies Aaron Cole as high-risk employee due to financial stress',
        participants: ['Aaron Cole', 'Dr. Sarah Chen'],
        location: 'Nexus-Corp HR Department',
        revealedBy: ['file_013']
    },
    {
        id: 'event_002',
        timestamp: new Date('2025-06-30T22:30:00'),
        title: 'Initial Contact',
        description: 'Unknown contact reaches out to Aaron Cole via secure messaging',
        participants: ['Aaron Cole', 'Alex Thompson'],
        location: 'Personal Chat',
        revealedBy: ['chat_006']
    },
    {
        id: 'event_003',
        timestamp: new Date('2025-07-01T22:30:00'),
        title: 'VPN Intrusion Detected',
        description: 'Suspicious VPN connection from TOR exit node attempts system access',
        participants: ['Unknown Attacker'],
        location: 'External Network',
        revealedBy: ['file_012']
    },
    {
        id: 'event_004',
        timestamp: new Date('2025-07-01T23:15:00'),
        title: 'Credential Compromise',
        description: 'Aaron Cole\'s credentials successfully used for unauthorized system access',
        participants: ['Aaron Cole', 'Alex Thompson'],
        location: 'Nexus-Corp Network',
        revealedBy: ['file_012', 'email_030']
    },
    {
        id: 'event_005',
        timestamp: new Date('2025-07-02T03:35:00'),
        title: 'After-hours Building Access',
        description: 'Aaron Cole enters building at 3:35 AM using badge NC-2847',
        participants: ['Aaron Cole'],
        location: 'Nexus-Corp Main Building',
        revealedBy: ['file_003']
    },
    {
        id: 'event_006',
        timestamp: new Date('2025-07-02T03:47:00'),
        title: 'Data Theft Executed',
        description: 'USB device connected to workstation WS-457, 2.3GB of Sentinel-X files copied',
        participants: ['Aaron Cole'],
        location: 'Nexus-Corp Development Floor',
        revealedBy: ['file_003', 'file_006']
    },
    {
        id: 'event_007',
        timestamp: new Date('2025-07-02T04:00:00'),
        title: 'Payment Confirmation',
        description: 'Payment of $75,000 confirmed via offshore transfer to Aaron Cole',
        participants: ['Aaron Cole', 'Alex Thompson'],
        location: 'Personal Chat',
        revealedBy: ['chat_006', 'file_002', 'file_011']
    },
    {
        id: 'event_008',
        timestamp: new Date('2025-07-02T08:45:00'),
        title: 'Security Breach Discovered',
        description: 'Irene Walker discovers suspicious network activity and alerts security',
        participants: ['Irene Walker', 'Security Team', 'CEO'],
        location: 'Nexus-Corp Security Operations',
        revealedBy: ['email_002']
    },
    {
        id: 'event_009',
        timestamp: new Date('2025-07-02T14:30:00'),
        title: 'Forensic Evidence Found',
        description: 'Liam Rivera completes forensic analysis confirming USB data theft',
        participants: ['Liam Rivera', 'Irene Walker'],
        location: 'Nexus-Corp IT Department',
        revealedBy: ['email_007', 'file_007']
    },
    {
        id: 'event_010',
        timestamp: new Date('2025-07-02T16:30:00'),
        title: 'Financial Analysis Complete',
        description: 'Automated systems flag suspicious financial transactions in Aaron\'s account',
        participants: ['Financial Monitoring System'],
        location: 'Nexus-Corp Financial Department',
        revealedBy: ['file_011']
    },
    {
        id: 'event_011',
        timestamp: new Date('2025-07-02T18:45:00'),
        title: 'Network Intrusion Analysis',
        description: 'Comprehensive analysis reveals coordinated attack with external threat actors',
        participants: ['Liam Rivera', 'Cybersecurity Team'],
        location: 'Nexus-Corp Security Operations',
        revealedBy: ['file_012']
    },
    {
        id: 'event_012',
        timestamp: new Date('2025-07-02T20:15:00'),
        title: 'Competitor Intelligence Leak',
        description: 'CyberShield Industries receives stolen Sentinel-X specifications',
        participants: ['Marcus Webb', 'CyberShield Team'],
        location: 'CyberShield Industries',
        revealedBy: ['email_018']
    },
    {
        id: 'event_013',
        timestamp: new Date('2025-07-02T21:30:00'),
        title: 'Phase 2 Operation Planning',
        description: 'Aaron Cole and external contact plan additional data theft phases',
        participants: ['Aaron Cole', 'Unknown Contact'],
        location: 'Anonymous Secure Channel',
        revealedBy: ['chat_018']
    }
];
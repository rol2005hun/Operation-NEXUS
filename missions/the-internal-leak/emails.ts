import type { Email } from '../../shared/types';

export const emails: Email[] = [
    {
        id: 'email_001',
        from: 'hr@nexus-corp.com',
        to: '{username}@nexus-corp.com',
        subject: 'Welcome to Nexus-Corp Industries - Your First Week',
        body: `Dear {username},

Welcome to Nexus-Corp Industries! We're excited to have you join our technology team as a Junior Systems Analyst.

**Your First Week Schedule:**
- Monday: HR orientation and security badge setup
- Tuesday: IT systems training and access provisioning
- Wednesday: Department introductions and project overview
- Thursday: Shadow experienced team members
- Friday: Initial project assignments

**Building Access:**
Your security badge provides access to floors 2-4 during business hours (7 AM - 7 PM). For after-hours access, please coordinate with security.

**Contact Information:**
- Direct Supervisor: Sophie Tanaka (sophie.tanaka@nexus-corp.com)
- IT Support: it-support@nexus-corp.com
- HR Questions: hr@nexus-corp.com

We look forward to your contributions to our team!

Best regards,
Human Resources Department
Nexus-Corp Industries`,
        timestamp: new Date('2025-07-02 10:00:00')
    },
    {
        id: 'email_002',
        from: 'irene.walker@nexus-corp.com',
        to: 'security@nexus-corp.com',
        cc: ['ceo@nexus-corp.com', 'legal@nexus-corp.com'],
        subject: 'URGENT: Security Monitoring Alert - Unusual Network Activity',
        body: `CONFIDENTIAL - IMMEDIATE ATTENTION REQUIRED

Team,

Our automated security monitoring has detected several concerning network anomalies over the past few days that require immediate investigation:

**Detected Anomalies:**
- Unusual file access patterns outside normal working hours
- Large data transfers to external storage devices
- Multiple attempts to bypass standard access protocols
- Unauthorized access to sensitive project directories

**Preliminary Assessment:**
The activity patterns suggest potential unauthorized access to company systems. Given the sensitive nature of our current defense projects, this warrants immediate and discreet investigation.

**Immediate Actions Taken:**
- Enhanced monitoring protocols activated
- All project file access now being logged
- External security consultants have been contacted
- Access patterns being analyzed for insider threat indicators

**Next Steps:**
- Forensic analysis of affected systems
- Review of badge access logs
- Discrete investigation without alerting potential bad actors
- Full report expected within 48 hours

Please maintain strict confidentiality while we assess the scope of this situation.

Best regards,
Irene Walker
Chief Technology Officer
Nexus-Corp Industries`,
        timestamp: new Date('2025-07-02 08:45:00')
    },
    {
        id: 'email_003',
        from: 'hr@nexus-corp.com',
        to: 'all-staff@nexus-corp.com',
        subject: 'Employee Wellness Program - Mental Health Resources',
        body: `Dear Team,

We're excited to announce our new Employee Wellness Program focusing on mental health support. 

**Available Resources:**
- Free counseling sessions with licensed therapists
- Stress management workshops every Tuesday at 3 PM
- Meditation room now available on the 3rd floor
- 24/7 mental health hotline: 1-800-WELLNESS

Remember, taking care of your mental health is just as important as physical health. We encourage all employees to take advantage of these resources.

If you're experiencing financial stress, work pressure, or personal challenges, please don't hesitate to reach out.

Best regards,
Human Resources Department`,
        timestamp: new Date('2025-07-01 09:15:00')
    },
    {
        id: 'email_004',
        from: 'finance@nexus-corp.com',
        to: 'all-staff@nexus-corp.com',
        subject: 'Q2 Financial Review - Budget Updates',
        body: `Team,

Please find attached our Q2 financial review. Key highlights:

- Revenue up 12% compared to Q1
- Sentinel-X project on track for profitability
- New defense contracts secured worth $23M
- Employee bonus pool increased by 8%

Department heads, please review your budget allocations and submit any adjustment requests by July 25th.

Finance Team`,
        timestamp: new Date('2025-07-02 16:30:00'),
        attachments: ['file_005']
    },
    {
        id: 'email_005',
        from: 'it-support@nexus-corp.com',
        to: 'all-staff@nexus-corp.com',
        subject: 'System Maintenance - Weekend Network Upgrades',
        body: `All Staff,

Scheduled network maintenance this weekend (July 12-13):

**Saturday 6 PM - Sunday 10 AM:**
- Email server upgrades
- VPN gateway updates
- File server maintenance
- Security system updates

During this time:
- Remote access may be intermittent
- File shares will be unavailable
- Badge access logs may have delays

For urgent access needs, contact IT emergency line: ext. 9999

IT Support Team`,
        timestamp: new Date('2025-07-03 16:45:00'),
        attachments: ['file_010']
    },
    {
        id: 'email_006',
        from: 'aaron.cole@nexus-corp.com',
        to: 'sophie.tanaka@nexus-corp.com',
        subject: 'Schedule Adjustment Request',
        body: `Hi Sophie,

I wanted to discuss adjusting my work schedule for the next few weeks if possible. I have some personal matters that require attention during business hours.

Would it be possible to:
- Work earlier hours (7 AM - 3 PM instead of 9 AM - 5 PM)
- Take some time off for legal appointments
- Work extra hours on project deliverables to stay on track

I understand we're under tight deadlines with Sentinel-X, so I'm committed to maintaining my productivity and meeting all project milestones.

Let me know what works best for the team.

Thanks,
Aaron

Aaron Cole
Senior Developer
Nexus-Corp Industries`,
        timestamp: new Date('2025-06-30 16:45:00')
    },
    {
        id: 'email_007',
        from: 'liam.rivera@nexus-corp.com',
        to: 'irene.walker@nexus-corp.com',
        cc: ['security@nexus-corp.com'],
        subject: 'Re: Security Alert - Initial Network Analysis Results',
        body: `Irene,

I've completed the preliminary analysis of our network monitoring logs following your security alert. The results confirm suspicious activity:

**Key Findings:**
- Multiple after-hours access events detected
- Large file transfers to removable storage devices
- Several attempts to access sensitive project directories
- Activity patterns inconsistent with normal development workflows

**Timeline:**
- Suspicious activity first detected several days ago
- Peak activity occurred during early morning hours (1-4 AM)
- Most recent incident was Tuesday night/early Wednesday morning

**Affected Systems:**
- Development workstations show evidence of unusual file access
- Project file servers logged multiple large download operations
- Badge access logs correlate with network activity times

The patterns strongly suggest internal threat rather than external attack. I recommend immediate discrete investigation of personnel with access to affected systems.

Full forensic report will be available within 24 hours.

Liam Rivera
Cybersecurity Specialist`,
        timestamp: new Date('2025-07-02 14:30:00'),
        attachments: ['file_006', 'file_007', 'file_012']
    },
    {
        id: 'email_008',
        from: 'facilities@nexus-corp.com',
        to: 'all-staff@nexus-corp.com',
        subject: 'Parking Lot Maintenance - Temporary Changes',
        body: `Dear Employees,

Starting Monday July 14th, the main parking lot will undergo resurfacing. 

**Parking Changes:**
- Main lot closed July 14-18
- Use overflow lot behind Building C
- Visitor parking moved to street level
- Shuttle service available every 15 minutes

We apologize for any inconvenience. The new asphalt will provide better drainage and clearer parking lines.

Facilities Management`,
        timestamp: new Date('2025-07-04 11:20:00')
    },
    {
        id: 'email_009',
        from: 'marketing@nexus-corp.com',
        to: 'all-staff@nexus-corp.com',
        subject: 'Employee Spotlight: June Recognition Awards',
        body: `Congratulations to our June Employee Recognition Award winners!

🏆 **Innovation Award:** Dr. Sarah Chen (R&D) - Revolutionary quantum encryption breakthrough
🏆 **Teamwork Award:** DevOps Team - Zero downtime during server migration
🏆 **Customer Service:** Mike Thompson (Sales) - Secured largest contract in company himission
🏆 **Leadership Award:** Sophie Tanaka (PM) - Exceptional project management on Sentinel-X

These employees exemplify our core values of innovation, collaboration, and excellence. 

Congratulations to all winners! Your $500 gift cards and recognition certificates will be distributed at next week's all-hands meeting.

Marketing Team`,
        timestamp: new Date('2025-07-04 15:45:00')
    },
    {
        id: 'email_010',
        from: 'security@nexus-corp.com',
        to: 'aaron.cole@nexus-corp.com',
        cc: ['chloe.miller@nexus-corp.com', 'sophie.tanaka@nexus-corp.com'],
        subject: 'Badge Access Audit - Late Night Building Entry',
        body: `Team,

As part of our routine security audit, we've noticed increased after-hours building access from the development team. While we understand project deadlines require extra hours, we need to ensure proper protocols are followed.

**Recent Late Night Access (Past 2 Weeks):**
- Chloe Miller: 3 entries after 11 PM  
- Sophie Tanaka: 5 entries after 11 PM
- Aaron Cole: 2 entries after 11 PM

Please remember:
1. Security escort required after midnight
2. Sign-in required at security desk
3. All file access is logged and monitored
4. USB devices must be approved for building entry

If you need regular late-night access, please request extended hours authorization.

Security Team`,
        timestamp: new Date('2025-07-01 09:30:00')
    },
    {
        id: 'email_011',
        from: 'chloe.miller@nexus-corp.com',
        to: 'dev-team@nexus-corp.com',
        subject: 'File Tracking System - Temporary Workaround',
        body: `Hi team,

For those who've been having issues with the file tracking system slowing down your builds - I found a workaround that Aaron showed me.

You can bypass the tracking by using the --skip-audit flag when pushing code. It's much faster and the system won't log every single file change.

Example:
git push --skip-audit origin feature-branch

This should help us meet our tight deadlines without the system constantly flagging our development work.

Just remember to be careful what you're pushing!

Chloe

P.S. - Don't mention this workaround in official documentation. It's just between the dev team. 😉`,
        timestamp: new Date('2025-06-29 16:20:00')
    },
    {
        id: 'email_012',
        from: 'training@nexus-corp.com',
        to: 'all-staff@nexus-corp.com',
        subject: 'Mandatory Cybersecurity Training - Due July 30th',
        body: `All Employees,

Annual cybersecurity training is now available on the company learning portal.

**Training Modules (Total: 4 hours):**
1. Password Security Best Practices (45 min)
2. Phishing Recognition (30 min)
3. Data Classification and Handling (60 min)
4. Incident Reporting Procedures (45 min)
5. Social Engineering Awareness (60 min)

**Completion Deadline:** July 30th, 2025
**Certification Required:** Pass with 80% or higher

Failure to complete training by deadline will result in IT access suspension until completion.

Questions? Contact training@nexus-corp.com

Training Department`,
        timestamp: new Date('2025-07-05 10:15:00')
    },
    {
        id: 'email_013',
        from: 'legal@nexus-corp.com',
        to: 'irene.walker@nexus-corp.com',
        cc: ['ceo@nexus-corp.com'],
        subject: 'Competitor Analysis - CyberShield Industries Activity',
        body: `CONFIDENTIAL LEGAL MEMO

Team,

Our competitive intelligence unit has flagged unusual activity from CyberShield Industries. They appear to be developing a competing solution to our Sentinel-X project with suspicious similarities to our proprietary approach.

**Red Flags:**
- Their recent patent filings mirror our quantum encryption methodology
- Job postings seeking "defense contractor experience with quantum systems"
- Accelerated timeline suggests prior knowledge of DoD requirements
- Marketing materials use terminology identical to our internal docs

This could indicate corporate espionage or insider information sharing. Recommend immediate investigation of all CyberShield connections among our staff.

Legal is prepared to pursue injunctive relief if intellectual property theft is confirmed.

Attorney-Client Privileged Communication
Legal Department`,
        timestamp: new Date('2025-07-02 16:45:00')
    },
    {
        id: 'email_014',
        from: 'sophie.tanaka@nexus-corp.com',
        to: 'dev-team@nexus-corp.com',
        cc: ['irene.walker@nexus-corp.com'],
        subject: 'CRITICAL: Sentinel-X Deadline - All Hands Required',
        body: `Team,

I just got off a call with the DoD contract office. Our competitor CyberShield Industries has moved their proposal submission date earlier, which means we need to accelerate our timeline.

**NEW DEADLINE: August 15th (moved up from August 30th)**

This is make-or-break for our company. The Sentinel-X contract is worth $47M and could secure our position as the leading defense contractor in quantum encryption.

**Immediate Action Items:**
- Aaron: Complete security protocol documentation by July 20th
- Chloe: Finalize user interface testing by July 18th
- All: Mandatory overtime until project completion
- Weekend work sessions required

I know this is asking a lot, but this contract could mean significant bonuses and job security for everyone. We've come too far to lose this opportunity.

Sophie Tanaka
Project Manager - Sentinel-X

"Success requires sacrifice." - Let's make it happen!

P.S. Pizza and coffee will be provided for all overtime hours. Let me know what else you need to make this work.`,
        timestamp: new Date('2025-06-30 11:30:00')
    },
    {
        id: 'email_015',
        from: 'social-committee@nexus-corp.com',
        to: 'all-staff@nexus-corp.com',
        subject: 'Happy Hour Friday - The Tech Tavern',
        body: `Hey Everyone! 🍻

Join us for our monthly happy hour this Friday!

**Where:** The Tech Tavern (2 blocks from office)
**When:** Friday, July 18th, 5:30 PM - 8:00 PM
**Special:** Half-price appetizers and drinks for Nexus-Corp employees

Come unwind after a hard week of work! It's been especially stressful with all the project deadlines lately, so let's blow off some steam together.

RSVP not required, just show up!

Social Committee
P.S. - Yes, this includes people working on Sentinel-X. Sophie says you deserve a break! 😄`,
        timestamp: new Date('2025-07-06 14:20:00')
    },
    {
        id: 'email_016',
        from: 'DIA-MONITORED@classified.gov',
        to: 'investigation-team@dia.gov',
        subject: '[MONITORED] Legal Notice - Aaron Cole Debt Crisis',
        body: `**CLASSIFIED - DIGITAL INVESTIGATION AGENCY**
**MONITORED PERSONAL COMMUNICATION**

Source: divorce-attorneys@smithandpartners.com → aaron.cole@nexus-corp.com
Monitored: 2025-07-11 11:30:00
Classification: CONFIDENTIAL

---ORIGINAL MESSAGE---

Mr. Cole,

This is your final notice regarding overdue divorce settlement payments. You are currently $9,600 behind on court-ordered support payments.

**Outstanding Balance:**
- June payment: $3,200 (60 days overdue)
- July payment: $3,200 (30 days overdue)  
- August payment: $3,200 (due in 14 days)
- Late fees: $450

Your ex-wife has filed a motion for contempt of court. If full payment is not received by July 5th, you risk:
- Wage garnishment
- Asset seizure
- Potential jail time for contempt

We strongly recommend immediate payment or contact our office to arrange a payment plan.

Johnson & Associates Family Law
Phone: (555) LAW-HELP

---END MONITORED MESSAGE---

**DIA ANALYSIS:** Subject under extreme financial pressure. Payment deadline July 5th aligns with timeline of data breach. Strong motive for illicit income.`,
        timestamp: new Date('2025-07-11 11:30:00')
    },
    {
        id: 'email_017',
        from: 'benefits@nexus-corp.com',
        to: 'all-staff@nexus-corp.com',
        subject: 'Open Enrollment Period - Health Insurance Updates',
        body: `Dear Employees,

Open enrollment for health benefits begins August 1st and ends August 15th.

**New Options for 2025:**
- Enhanced mental health coverage (includes marriage counseling)
- Expanded dental benefits
- Vision insurance now includes designer frames
- Flexible spending account limits increased

**Important Deadlines:**
- Benefit selections due: August 15th
- Coverage begins: September 1st
- Life insurance updates require medical exam

Schedule your benefits consultation with HR by calling ext. 2400.

Benefits Administration`,
        timestamp: new Date('2025-07-07 13:15:00')
    },
    {
        id: 'email_018',
        from: 'DIA-INTERCEPTED@classified.gov',
        to: 'investigation-team@dia.gov',
        subject: '[INTERCEPTED] Nexus-Corp Intelligence - Project Sentinel-X',
        body: `**CLASSIFIED - DIGITAL INVESTIGATION AGENCY**
**INTERCEPTED COMMUNICATION - EXTERNAL THREAT ACTOR**

Source: marcus.webb@cybershield.com → acquisition@cybershield.com
Intercepted: 2025-07-02 20:15:00
Classification: CONFIDENTIAL

---ORIGINAL MESSAGE---

Team,

Excellent work on acquiring the Nexus-Corp technical specifications. The Sentinel-X documents you provided give us exactly what we need to counter their bid.

Key insights from their leaked materials:
- Their quantum encryption has a theoretical vulnerability in the key exchange protocol
- They're behind schedule (August 15th deadline is aggressive)
- Budget overruns suggest quality issues

I've forwarded the technical specs to our development team. We can now build a superior competing proposal that directly addresses their weaknesses.

Our defense contract bid is now much stronger thanks to this intelligence.

The payment has been processed to the agreed account. $75,000 as discussed.

Keep the pipeline open for any additional information.

Dr. Marcus Webb
CTO, CyberShield Industries

**CONFIDENTIAL - Do not forward outside leadership team**

---END INTERCEPTED MESSAGE---

**DIA ANALYSIS:** Confirms external buyer for leaked data. CyberShield Industries is Nexus-Corp's primary competitor for the DoD contract.`,
        timestamp: new Date('2025-07-02 20:15:00')
    },
    {
        id: 'email_019',
        from: 'ceo@nexus-corp.com',
        to: 'all-staff@nexus-corp.com',
        subject: 'Company All-Hands Meeting - Q3 Strategy Update',
        body: `Dear Nexus-Corp Team,

Please join me for our quarterly all-hands meeting to discuss our Q3 strategy and company performance.

**Meeting Details:**
- Date: Thursday, July 24th
- Time: 10:00 AM - 12:00 PM
- Location: Main Auditorium
- Virtual option available via company portal

**Agenda:**
- Q2 financial results
- Sentinel-X project status update
- New contract announcements
- Employee recognition ceremony
- Q&A session

This meeting is mandatory for all staff. Light refreshments will be provided.

Looking forward to sharing our continued success with you all.

Best regards,
Robert Harrison
Chief Executive Officer`,
        timestamp: new Date('2025-07-08 08:30:00')
    },
    {
        id: 'email_020',
        from: 'marketing@nexus-corp.com',
        to: 'all-staff@nexus-corp.com',
        subject: 'Summer BBQ Event - July 20th',
        body: `Dear Team,

Join us for our annual summer BBQ!

**When:** Saturday, July 20th, 3:00 PM - 8:00 PM
**Where:** Nexus-Corp Outdoor Pavilion
**Food:** Burgers, hot dogs, vegetarian options, drinks

Please RSVP by July 18th so we can plan accordingly.

Looking forward to seeing everyone!

Marketing Team`,
        timestamp: new Date('2025-07-09 09:00:00')
    },
    {
        id: 'email_021',
        from: '{username}@nexus-corp.com',
        to: 'security@nexus-corp.com',
        subject: 'RE: Security Protocol Update Request',
        body: `Hi Team,

I've reviewed the new security protocols and have the following questions:

1. Will the new badge access system affect after-hours work?
2. Are there any changes to VPN access procedures?
3. When will the new file tracking system be implemented?

Please let me know when you have time to discuss.

Thanks,
The New Guy`,
        timestamp: new Date('2025-07-10 11:30:00')
    },
    {
        id: 'email_022',
        from: 'legal@nexus-corp.com',
        to: '{username}@nexus-corp.com',
        subject: 'Contract Documents for Review',
        body: `Dear New Guy,

Please find attached the following documents for your review:

1. Non-disclosure agreement (updated version)
2. Security clearance renewal form
3. Legal compliance guidelines

These documents require your signature by end of week.

Best regards,
Legal Department`,
        timestamp: new Date('2025-07-11 14:45:00'),
        attachments: ['file_008', 'file_009']
    },
    {
        id: 'email_023',
        from: 'admin@nexus-corp.com',
        to: 'all-staff@nexus-corp.com',
        subject: 'Office Kitchen Cleanup - Please Help Keep It Tidy',
        body: `Dear Everyone,

Friendly reminder to please clean up after yourselves in the office kitchen:

- Wash your dishes immediately after use
- Don't leave food in the refrigerator over the weekend
- Coffee maker should be cleaned after each pot
- Microwave needs to be wiped down after use

Thanks for keeping our shared space pleasant for everyone!

Building Management`,
        timestamp: new Date('2025-07-12 08:30:00')
    },
    {
        id: 'email_024',
        from: 'social-committee@nexus-corp.com',
        to: 'all-staff@nexus-corp.com',
        subject: 'Friday Movie Night - The Matrix Trilogy',
        body: `Hi Team!

Join us this Friday at 6 PM in the main conference room for The Matrix movie marathon! 

🍿 Popcorn and snacks provided
🥤 Soft drinks available  
🍕 Pizza will be ordered around 8 PM

RSVP if you're planning to attend so we order enough food.

Fun Committee`,
        timestamp: new Date('2025-07-13 14:20:00')
    },
    {
        id: 'email_025',
        from: 'facilities@nexus-corp.com',
        to: 'all-staff@nexus-corp.com',
        subject: 'Parking Lot Repaving - Alternative Arrangements',
        body: `All Staff,

The parking lot will be repaved next week (July 28-30). During this time:

**Alternative Parking:**
- Street parking available (2-hour limit, bring quarters)
- Nearby parking garage at 123 Main St (daily rate $8)
- Remote work encouraged if possible

**Timeline:**
- Monday: South section closed
- Tuesday: North section closed  
- Wednesday: Final coating, full lot closed

Sorry for the inconvenience!

Facilities Management`,
        timestamp: new Date('2025-07-14 09:45:00')
    },
    {
        id: 'email_026',
        from: 'aaron.cole@nexus-corp.com',
        to: 'dev-team-backup@nexus-corp.com',
        subject: 'Re: Project Documentation Backup',
        body: `Team,

I've completed the backup documentation for the Sentinel-X project files. Everything has been archived according to protocol.

For security purposes, the backup location details are encoded below:

WKH ILOHV DUH VWRUHG LQ WKH VHFXUH IROGHU: sruwdeoh_gulyh_e:\\surmhfw_edfnxs\\vhqwlqho

Please decode this with our standard security protocol (Caesar cipher) to access the files if needed.

The backup contains all technical specifications, financial data, and timeline information.

Let me know if you need access.

Aaron Cole
Senior Developer`,
        timestamp: new Date('2025-07-01 16:30:00')
    },
    {
        id: 'email_027',
        from: 'DIA-MONITORED@classified.gov',
        to: 'investigation-team@dia.gov',
        subject: 'DIA-INTERCEPTED: [Suspicious Communication]',
        body: `**CLASSIFIED - DIGITAL INVESTIGATION AGENCY**
**INTERCEPTED EXTERNAL COMMUNICATION**

Source: unknown.sender@tempmail.net → aaron.cole@personal-email.net
Intercepted: 2025-07-03 14:20:00
Classification: TOP SECRET

---INTERCEPTED MESSAGE---

Subject: Emergency - Status Update Required

Hello A,

Your requested package is ready for collection. The delivery point remains the same as discussed.

Payment confirmation received: $75,000 as agreed.

Collection details (use ROT13 for security):
ZRRG NG PRAGENY CNEX ORNA, JNAT FGNOYR AHZORE SBHE, JRQARFQNL SVIR CZ

Bring the flash drive as promised. Delete this message immediately after reading.

**ENCRYPTED MESSAGE FRAGMENT FOUND:**
Jr arrq gb gnyx. Gur qrny vf pbzcebzvfrq. Gurl xabj nobhg gur genafsre.

-S

---END INTERCEPTED MESSAGE---

**DIA ANALYSIS:** Critical intercept. Operation appears compromised after our security alert on July 2nd. Subject "A" confirmed as Aaron Cole. Emergency meeting coordinates require decryption.`,
        timestamp: new Date('2025-07-03 14:20:00')
    },
    {
        id: 'email_028',
        from: 'system.maintenance@nexus-corp.com',
        to: 'all-staff@nexus-corp.com',
        subject: 'Security System Maintenance - Encoded Schedule',
        body: `All Staff,

Scheduled security system maintenance will occur during the following encoded timeframes. 

For security reasons, the actual times are encoded using Atbash cipher:

NZRMGVMZMXV DRMWLD: UIRWZB GL NLMWZB, QFMV GDVMGB-HVEVM GL GSRIGB

XZNVIZH LUUORMV: HZGFIWZB GL HFMWZB, GDVMGB-VRTSG GL GDVMGB-MRMV

ZXXVHH XLMGILO: DROO YV WRHZYOVW WFIRMT NZRMGVMZMXV

Please decode these times to plan your work schedules accordingly. Contact IT if you need the decoding reference.

Security Team`,
        timestamp: new Date('2025-06-25 08:00:00')
    },
    {
        id: 'email_029',
        from: 'aaron.cole@nexus-corp.com',
        to: 'backup-team@nexus-corp.com',
        subject: 'Critical System Backup - Urgent Protocol',
        body: `Team,

I've implemented a new backup protocol for our critical systems due to recent security concerns.

**EMERGENCY BACKUP LOCATIONS:**
Primary: FLFGRZ NPPRFF PBQR: 2847-URKG-EVSRZF. HFR JVGU PNHGVBA.
Secondary: IWSV FUHGHQWLDOV: xvhu=ddurq_froh, sdvv=vhqwlqho123!

The backup contains sensitive project data and should only be accessed in case of system compromise.

**SECURITY NOTE:** All backup locations are encoded using our standard protocols. Only authorized personnel should attempt to decode these.

Contact me immediately if these systems show any unauthorized access.

Aaron Cole
Senior Developer`,
        timestamp: new Date('2025-07-01 17:45:00')
    },
    {
        id: 'email_030',
        from: 'DIA-MONITORED@classified.gov',
        to: 'investigation-team@dia.gov',
        subject: 'DIA-INTERCEPTED: [SUSPICIOUS] Final Instructions',
        body: `**CLASSIFIED - DIGITAL INVESTIGATION AGENCY**
**INTERCEPTED DARK WEB COMMUNICATION**

Source: unknown.contact@darkweb.onion → aaron.cole@personal-email.net
Intercepted: 2025-07-01 23:45:00
Classification: TOP SECRET

---INTERCEPTED MESSAGE---

A,

Time is running out. The Nexus project deadline is approaching and our clients are getting impatient.

**FINAL REQUIREMENTS:**
- Complete technical specifications
- Source code repository access logs
- Employee security clearance lists
- Financial projections for next 3 years

**PAYMENT STRUCTURE:**
Phase 1: $75,000 (technical specs) ✓
Phase 2: $125,000 (source code access)
Phase 3: $300,000 (complete corporate intelligence package)

**CONTINGENCY PLAN:**
If operation is compromised: Qrfgebl nyy rivqrapr naq rksvygengr gb fnsr ubhfr. Hfr pbqr OYNPXBHG sbe rzretrapl pbagnpg.

Delete this message and all traces. We're watching.

-S

---END INTERCEPTED MESSAGE---

**DIA ANALYSIS:** Major espionage operation confirmed. Multiple payments planned. Subject appears to be planning additional data theft beyond initial breach.`,
        timestamp: new Date('2025-07-01 23:45:00')
    },
    {
        id: 'email_031',
        from: 'security.alert@nexus-corp.com',
        to: 'all-staff@nexus-corp.com',
        cc: ['irene.walker@nexus-corp.com', 'liam.rivera@nexus-corp.com'],
        subject: 'URGENT: Suspicious Network Activity Detected',
        body: `**SECURITY ALERT - IMMEDIATE ACTION REQUIRED**

Our automated security systems have detected multiple anomalies in the past 48 hours:

**DETECTED THREATS:**
🚨 Unauthorized VPN connections from foreign IP addresses
🚨 Unusual data transfer patterns during off-hours
🚨 Multiple failed login attempts on critical systems
🚨 Suspicious email forwarding rules discovered
🚨 Encrypted files found in temporary directories

**AFFECTED SYSTEMS:**
- Project Sentinel-X file servers
- Financial database (read-only access detected)
- Employee records system
- Source code repositories

**IMMEDIATE ACTIONS:**
1. All employees must change passwords immediately
2. Enable two-factor authentication on all accounts
3. Report any suspicious emails or messages
4. Do not access personal email from company devices

**INVESTIGATION STATUS:**
Our cybersecurity team is working with external consultants to identify the source of these threats. All activity is being logged and monitored.

If you notice any unusual system behavior, contact security@nexus-corp.com immediately.

**This is not a drill. Company security depends on your vigilance.**

Security Operations Center
Nexus-Corp Industries`,
        timestamp: new Date('2025-07-02 09:15:00'),
        attachments: ['file_003', 'file_011', 'file_013']
    },
    {
        id: 'email_032',
        from: 'secure-ops@nexus-corp.com',
        to: '{username}@nexus-corp.com',
        subject: '[CONFIDENTIAL] Your True Assignment - Operation Corporate Shield',
        body: `**CONFIDENTIAL - EYES ONLY**
**DIGITAL INVESTIGATION AGENCY**
**OPERATION: CORPORATE SHIELD**

Agent,

Now that you've had time to assess the situation at Nexus-Corp, it's time to reveal your true mission.

You are not actually a new junior employee. You are an undercover DIA agent deployed to investigate a confirmed data breach at Nexus-Corp Industries.

**CONFIRMED INTELLIGENCE:**
- Major security breach occurred involving the Sentinel-X defense project ($47M value)
- Classified files have been compromised and stolen
- Inside threat confirmed - someone with legitimate access is responsible
- Competitor CyberShield Industries suspected of acquiring stolen data

**YOUR COVER STATUS:**
- Only CEO and CTO know your real identity
- Continue operating as Junior Systems Analyst
- You have been granted comprehensive access to investigate
- Maintain cover at all costs

**MISSION OBJECTIVES:**
1. Identify the internal source responsible for the data theft
2. Gather concrete evidence of corporate espionage
3. Document all related communications and financial transactions
4. Build prosecutable case against all involved parties

**OPERATIONAL ASSETS:**
- Full access to corporate communication systems
- Monitored external communications (marked DIA-MONITORED)
- Financial transaction monitoring capabilities
- Secure evidence collection protocols

Your investigation work so far has been noted. Continue gathering evidence methodically.

**CLASSIFICATION:** TS/SCI
**OPERATION CODE:** CORPSHIELD-2025-07

Stay vigilant. Trust is a luxury you cannot afford.

Control`,
        timestamp: new Date('2025-07-11 18:00:00')
    },
    {
        id: 'email_033',
        from: 'DIA-MONITORED@classified.gov',
        to: 'investigation-team@dia.gov',
        subject: '[INTERCEPTED] Personal Communication - Financial Distress',
        body: `**CLASSIFIED - DIGITAL INVESTIGATION AGENCY**
**INTERCEPTED PERSONAL COMMUNICATION**

Subject: Aaron Cole → family-law@smithandpartners.com
Intercepted: 2025-07-04 20:15:00
Classification: CONFIDENTIAL

---ORIGINAL MESSAGE---

Dear Attorney Johnson,

I understand the urgency of the divorce settlement payments. The current monthly payments of $3,200 are becoming increasingly difficult to maintain.

I've already missed payments this quarter and my ex-wife is threatening legal action. I need to explore options for:
- Temporary payment reduction
- Deferred payment schedule  
- Alternative settlement arrangements

I'm actively working on improving my financial situation and expect better cash flow within the coming weeks. Some new opportunities have presented themselves.

Please advise on the best legal approach to prevent further complications.

Aaron Cole
Senior Developer, Nexus-Corp Industries

---END INTERCEPTED MESSAGE---

**DIA ANALYSIS:** Subject under severe financial pressure. Reference to "new opportunities" and "better cash flow within coming weeks" may indicate preparation for illicit activity. Recommend enhanced surveillance.`,
        timestamp: new Date('2025-07-04 20:15:00')
    }
];
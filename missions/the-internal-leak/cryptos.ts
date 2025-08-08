import type { CryptoMessage } from '../../shared/types';

export const cryptoMessages: CryptoMessage[] = [
    {
        id: 'crypto_001',
        encryptedText: 'Jr arrq gb gnyx. Gur qrny vf pbzcebzvfrq. Gurl xabj nobhg gur genafsre.',
        decryptedText: 'We need to talk. The deal is compromised. They know about the transfer.',
        cipher: 'ROT13'
    },
    {
        id: 'crypto_002',
        encryptedText: 'Qrfgebl nyy rivqrapr naq rksvygengr gb fnsr ubhfr. Hfr pbqr OYNPXBHG sbe rzretrapl pbagnpg.',
        decryptedText: 'Destroy all evidence and exfiltrate to safe house. Use code BLACKOUT for emergency contact.',
        cipher: 'ROT13'
    },
    {
        id: 'crypto_003',
        encryptedText: 'ZRRG NG PRAGENY CNEX ORNA, JNAT FGNOYR AHZORE SBHE, JRQARFQNL SVIR CZ',
        decryptedText: 'MEET AT CENTRAL PARK BEAN, WANG STABLE NUMBER FOUR, WEDNESDAY FIVE PM',
        cipher: 'ROT13'
    },
    {
        id: 'crypto_004',
        encryptedText: 'RIIVKRUH DFFRXQW: 4521-8901-2345 | DPRXQW: $2.5P | VWDWXV: DFWLYH',
        decryptedText: 'OFFSHORE ACCOUNT: 4521-8901-2345 | AMOUNT: $2.5M | STATUS: ACTIVE',
        cipher: 'Caesar',
        key: '3'
    },
    {
        id: 'crypto_005',
        encryptedText: 'WKH ILOHV DUH VWRUHG LQ WKH VHFXUH IROGHU: sruwdeoh_gulyh_e:\\surmhfw_edfnxs\\vhqwlqho',
        decryptedText: 'THE FILES ARE STORED IN THE SECURE FOLDER: portable_drive_b:\\project_backup\\sentinel',
        cipher: 'Caesar',
        key: '3'
    },
    {
        id: 'crypto_006',
        encryptedText: 'IWSV FUHGHQWLDOV: xvhu=ddurq_froh, sdvv=vhqwlqho123!',
        decryptedText: 'FTPS CREDENTIALS: user=aaron_cole, pass=sentinel123!',
        cipher: 'Caesar',
        key: '3'
    },
    {
        id: 'crypto_007',
        encryptedText: 'FLFGRZ NPPRFF PBQR: 2847-URKG-EVSRZF. HFR JVGU PNHGVBA.',
        decryptedText: 'SYSTEM ACCESS CODE: 2847-HEXT-RIFEMS. USE WITH CAUTION.',
        cipher: 'ROT13'
    },
    {
        id: 'crypto_008',
        encryptedText: 'RZRETRAPL CEBGBPBY: Va pnfr bs pbzcebzvfr, npgvingr Fvatyr Cbvag bs Snvyher. Qryrgr nyy ybpny qngn.',
        decryptedText: 'EMERGENCY PROTOCOL: In case of compromise, activate Single Point of Failure. Delete all local data.',
        cipher: 'ROT13'
    },
    {
        id: 'crypto_009',
        encryptedText: 'Gur cnpxntr vf ernql sbe qryvirel. Zrrg ng gur hfhny cynpr.',
        decryptedText: 'The package is ready for delivery. Meet at the usual place.',
        cipher: 'ROT13'
    },
    {
        id: 'crypto_010',
        encryptedText: 'QIIYLR JLFVRV LH KRVSYJF PLWSGIA CF OYFFVVRD',
        decryptedText: 'DELETE FOLDER ON SERVERS LOCATED IN BUILDING',
        cipher: 'Vigenère',
        key: 'NEXUS'
    },
    {
        id: 'crypto_011',
        encryptedText: 'NZRMGVMZMXV DRMWLD: UIRWZB GL NLMWZB, QFMV GDVMGB-HVEVM GL GSRIGB',
        decryptedText: 'MAINTENANCE WINDOW: FRIDAY TO MONDAY, JUNE TWENTY-SEVEN TO THIRTY',
        cipher: 'Atbash'
    },
    {
        id: 'crypto_012',
        encryptedText: 'XZNVIZH LUUORMV: HZGFIWZB GL HFMWZB, GDVMGB-VRTSG GL GDVMGB-MRMV',
        decryptedText: 'CAMERAS OFFLINE: SATURDAY TO SUNDAY, TWENTY-EIGHT TO TWENTY-NINE',
        cipher: 'Atbash'
    },
    {
        id: 'crypto_013',
        encryptedText: 'ZXXVHH XLMGILO: DROO YV WRHZYOVW WFIRMT NZRMGVMZMXV',
        decryptedText: 'ACCESS CONTROL: WILL BE DISABLED DURING MAINTENANCE',
        cipher: 'Atbash'
    },
    {
        id: 'crypto_014',
        encryptedText: 'KLSLAL HSS AYHJL MPSLZ PU /ZLJBYPAF/ZLUAPULS-E/',
        decryptedText: 'DELETE ALL TRACE FILES IN /SECURITY/SENTINEL-X/',
        cipher: 'Caesar',
        key: '7'
    },
    {
        id: 'crypto_015',
        encryptedText: 'Zhpua Thypl Zaylla, Ibpskpun 12, Yvvt 305',
        decryptedText: 'Saint Marie Street, Building 12, Room 305',
        cipher: 'Caesar',
        key: '7'
    },
    {
        id: 'crypto_016',
        encryptedText: 'c29waGllLnRhbmFrYUBuZXh1cy1jb3JwLmNvbQ==',
        decryptedText: 'sophie.tanaka@nexus-corp.com',
        cipher: 'Base64'
    },
];
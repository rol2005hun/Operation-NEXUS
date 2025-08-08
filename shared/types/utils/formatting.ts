/**
 * TypeScript interfaces for markdown formatting and parsing tokens
 */

export interface UniversalClassToken {
    type: 'universalClass';
    raw: string;
    element: string;
    className: string;
    text: string;
}

export interface ShortClassToken {
    type: 'shortClass';
    raw: string;
    className: string;
    text: string;
}

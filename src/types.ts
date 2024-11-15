export interface Candidate {
    ID: string;
    NAME: string;
    EMAIL: string;
    INSTITUTE: string;
    COUNTRY: string;
    COUNTRYOFORIGIN: string;
    GENDER: string;
    LEVEL: string;
    EXPERTISE: string;
    DBLP: string;
    ITERATION: number;
    DECISION: string;
    coauthor_hist: JSON;
    years_of_pub: JSON;
    coauthors: JSON;
    isSelected: boolean;
}

export interface SancusDB {
    id: string;
    name: string;
    country: string;
    countryoforigin: string;
    email: string;
    organization: string;
    dblp: string;
}


export interface ExchangeProgramQuery {
  preferredCountries?: string[];
  educationLevel?: 'undergraduate' | 'graduate' | 'postgraduate' | 'any';
  programType?: 'semester' | 'summer' | 'year' | 'internship' | 'research';
  fieldOfStudy?: string;
  duration?: string;
  budgetRange?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  startDate?: string;
  specialInterests?: string[];
  languageRequirements?: string[];
  freeTextQuery?: string;
  clientId?: string;
}

export interface ProgramCard {
  programName: string;
  institution: string;
  location: string;
  duration: string;
  cost?: string;
  applicationDeadline?: string;
  eligibility: string;
  highlights: string[];
  description: string;
  programUrl: string;
  matchScore?: number;
  extractedAt: string;
}

export interface ExchangeProgramResponse {
  success: boolean;
  programs?: ProgramCard[];
  totalFound?: number;
  searchQuery?: string;
  usage?: {
    searchTime: number;
    aiTokensUsed: number;
    sourcesSearched: number;
  };
  timestamp: string;
  error?: string;
  errorType?: string;
}

export type SearchProgressStep = 
  | 'general' 
  | 'education_sites' 
  | 'program_specific' 
  | 'extracting_programs' 
  | 'ranking_programs';

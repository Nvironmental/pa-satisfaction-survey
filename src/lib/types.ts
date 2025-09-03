// Survey Question Types (existing)
export interface SurveyQuestion {
  id: number;
  question: string;
  options?: string[];
  type: "radio" | "input" | "text";
  parentId?: number;
  parentValue?: string;
  parentType?: string;
  isSubQuestion?: boolean;
  subQuestion?: SurveyQuestion;
  placeholder?: string;
  weight?: number;
  score_qualifiers?: string[];
}

export interface FormData {
  [key: string]: string;
}

export interface QuestionWithSubQuestion {
  mainQuestion: SurveyQuestion;
  subQuestion?: SurveyQuestion;
  shouldShowSubQuestion: boolean;
}

// Client Types
export interface Client {
  id: string;
  clientName: string;
  clientLogo?: string | null;
  representativeName: string;
  representativeEmail: string;
  representativeMobile: string;
  surveySchema?: Record<string, unknown> | null;
  createdBy: string;
  createdAt: Date;
  updatedBy?: string | null;
  updatedAt: Date;
  surveyEmailSent: boolean;
  surveyEmailSentAt?: Date | null;
  surveyEmailSentBy?: string | null;
  surveyCompleted: boolean;
  surveyCompletedAt?: Date | null;
  score?: number | null;
  creator?: {
    name: string;
    id: string;
  };
}

export interface CreateClientInput {
  clientName: string;
  clientLogo?: string;
  representativeName: string;
  representativeEmail: string;
  representativeMobile: string;
  surveySchema?: Record<string, unknown>;
  createdBy: string;
}

export interface UpdateClientInput extends Partial<CreateClientInput> {
  id: string;
}

// Candidate Types
export interface Candidate {
  id: string;
  candidateName: string;
  candidateEmail: string;
  candidateMobile: string;
  surveySchema?: Record<string, unknown> | null;
  createdBy: string;
  updatedBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
  surveyEmailSent: boolean;
  surveyEmailSentAt?: Date | null;
  surveyEmailSentBy?: string | null;
  surveyCompleted: boolean;
  surveyCompletedAt?: Date | null;
  score?: number | null;
  creator?: {
    name: string;
    id: string;
  };
}

export interface CreateCandidateInput {
  candidateName: string;
  candidateEmail: string;
  candidateMobile: string;
  surveySchema?: Record<string, unknown>;
  surveyCompleted?: boolean;
  surveyCompletedAt?: Date;
  createdBy: string;
}

export interface UpdateCandidateInput extends Partial<CreateCandidateInput> {
  id: string;
}

// Survey Answer Types
export interface ClientSurveyAnswer {
  id: string;
  clientId: string;
  questionId: string;
  answer: string;
  answeredAt: Date;
}

export interface CandidateSurveyAnswer {
  id: string;
  candidateId: string;
  questionId: string;
  answer: string;
  answeredAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

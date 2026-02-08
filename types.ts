
export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface FactCheckResponse {
  reportText: string;
  sources: GroundingChunk[];
}

export enum VerificationStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export interface VerificationStep {
  id: string;
  label: string;
  active: boolean;
  completed: boolean;
}

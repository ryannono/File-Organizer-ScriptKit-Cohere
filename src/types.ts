type Classification = {
  id: string;
  input: string;
  prediction: string;
  confidence: number;
  labels: {
    [key: string]: {
      confidence: number;
    };
  };
};

export type ClassificationAPIResponse = {
  id: string;
  classifications: Classification[];
};

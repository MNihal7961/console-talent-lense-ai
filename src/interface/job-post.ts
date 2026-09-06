export interface JobPost {
  _id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  education: {
    required: boolean;
    degree: string;
    field: string;
  };
  experience: {
    minimumYears: number;
    maximumYears: number;
  };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

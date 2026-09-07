export interface ResumeUser {
  firstName: string;
  lastName: string | null;
}

export interface ResumeContactInfo {
  email: string | null;
  phoneNumber: string | null;
}

export interface ResumeLinks {
  linkedInUrl: string | null;
  githubUrl: string | null;
  portfolioUrl: string | null;
}

export interface ResumeProject {
  title: string;
  skills: string[];
  description: string | null;
  githubUrl: string | null;
  liveUrl: string | null;
}

export interface ResumeExperience {
  companyName: string;
  role: string;
  startDate: string | null;
  endDate: string | null;
  description: string;
}

export interface ResumeEducation {
  university: string;
  degree: string;
  completedYear: string | null;
  location: string | null;
  description: string | null;
}

export interface ResumeCertification {
  title: string;
  issuer: string | null;
  year: string | null;
}

export interface Resume {
  _id: string;
  user: ResumeUser;
  contactInfo: ResumeContactInfo;
  links: ResumeLinks;
  profileSummary: string;
  skills: string[];
  projects: ResumeProject[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  certifications: ResumeCertification[];
  achievements: string[];
  languages: string[];
  otherInfo: string | null;
  totalYearsOfExperience: number;
  recentRole: string | null;
  fileName: string;
  rawFileLink: string;
  uploadedBy: string;
  jobApplicationId: string;
  createdAt: string;
  updatedAt: string;
}

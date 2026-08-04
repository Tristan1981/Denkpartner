export interface PricingItem {
  title: string;
  price: string;
  description: string;
  subtext?: string;
}

export interface EducationItem {
  year: string;
  title: string;
  institution: string;
}

export interface FormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  role: string;
  contactMethod: 'email' | 'phone' | 'whatsapp';
  message: string;
  investmentUnderstanding: boolean;
  // Intake specific
  intakeQ1: string;
  intakeQ2: string;
  intakeQ3: string;
}
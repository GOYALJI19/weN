/**
 * Arogya Core Domain Models
 * Clean, structured for Supabase relational schema and customer workflows
 */

export type Role = 'patient' | 'family_member' | 'doctor' | 'diagnostic_provider' | 'care_companion' | 'operations' | 'admin';

export interface User {
  id: string;
  email: string;
  phone: string;
  fullName: string;
  role: Role;
  avatarUrl?: string;
  createdAt: string;
}

export interface HealthcarePerson {
  id: string;
  userId: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'Female' | 'Male' | 'Other';
  bloodGroup: string;
  relationship: 'Self' | 'Mother' | 'Father' | 'Spouse' | 'Child' | 'Dependent';
  knownAllergies: string[];
  chronicConditions: string[];
  permissionLevel: 'Full Care Management' | 'View Records & Appointments' | 'Emergency Contact Only';
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
}

export interface Doctor {
  id: string;
  fullName: string;
  degrees: string[];
  specialty: string;
  subSpecialty?: string;
  experienceYears: number;
  languages: string[];
  clinicHospitalAffiliation: string;
  location: string;
  aboutBio: string;
  avatarUrl: string;
  consultationFee: number;
  availableModes: ('In-Person Clinic' | 'Telehealth Video')[];
  rating: number;
  reviewCount: number;
  nextAvailableSlot: string;
  education: string[];
  clinicalFocus: string[];
}

export interface DiagnosticInvestigationGroup {
  groupName: string;
  description?: string;
  parameters: {
    name: string;
    clinicalRelevance?: string;
  }[];
}

export type PackageCategoryType = 'Essential Health' | 'Women’s Health' | 'Healthy Ageing' | 'Family Health';

export interface HealthPackageCategory {
  id: 'essential' | 'womens' | 'ageing' | 'family';
  name: PackageCategoryType;
  tagline: string;
  description: string;
  badge: string;
  imageUrl: string;
  packagesCount: number;
}

export interface DiagnosticTest {
  id: string;
  code: string;
  name: string;
  category: 'Cardiac & Lipid' | 'Diabetes & Metabolic' | 'Thyroid' | 'Liver & Kidney' | 'Hematology' | 'Comprehensive Panel' | 'Joint & Bone' | 'Senior Care' | 'Women Health';
  packageCategory?: PackageCategoryType;
  tagline: string;
  description: string;
  sampleType: 'Blood' | 'Urine' | 'Saliva' | 'Imaging';
  sampleContainer?: string;
  fastingRequiredHours: number;
  turnaroundTime: string;
  price: number;
  originalPrice?: number;
  isIllustrativePrice?: boolean;
  homeCollectionAvailable: boolean;
  centreVisitAvailable: boolean;
  includedTestsCount?: number;
  totalParametersCount?: number;
  biomarkersCovered: string[];
  investigationGroups?: DiagnosticInvestigationGroup[];
  clinicalIndications?: string[];
  preTestInstructions: string[];
  accreditedLabPartner: string;
  partnerLabAccreditation?: string;
  imageUrl?: string;
  recommendedFor?: string;
}

export type JourneyStatus = 'active' | 'completed' | 'paused' | 'delayed';
export type StepStatus = 'completed' | 'in_progress' | 'upcoming' | 'action_required';

export interface JourneyStep {
  id: string;
  stepNumber: number;
  title: string;
  serviceType: 'doctor_consult' | 'diagnostic_booking' | 'home_collection' | 'lab_processing' | 'report_ready' | 'doctor_followup' | 'care_assistance';
  status: StepStatus;
  statusLabel: string;
  scheduledTime?: string;
  completedTime?: string;
  responsibleEntity?: string;
  actionRequiredText?: string;
  actionCtaLabel?: string;
  actionPayload?: string;
  notes?: string;
}

export interface HealthcareJourney {
  id: string;
  personId: string;
  personName: string;
  title: string;
  category: 'Cardiovascular Care' | 'Endocrine & Diabetes' | 'Annual Preventive Health' | 'Post-Surgical Follow-up' | 'General Consultation' | 'Orthopaedics & Joint Care';
  startedAt: string;
  status: JourneyStatus;
  currentStepIndex: number;
  steps: JourneyStep[];
  nextActionPrompt?: {
    headline: string;
    detail: string;
    ctaLabel: string;
    ctaActionType: string;
  };
}

export interface BiomarkerDetail {
  name: string;
  value: string;
  numericValue: number;
  unit: string;
  referenceLow: number;
  referenceHigh: number;
  status: 'low' | 'normal' | 'high';
  clinicalMeaning: string;
  previousValue?: string;
  previousDate?: string;
  trend: 'improving' | 'stable' | 'worsening';
  historicalPoints?: {
    date: string;
    value: number;
  }[];
}

export interface HealthRecordDocument {
  id: string;
  personId: string;
  personName: string;
  title: string;
  category: 'Diagnostic Lab Report' | 'Prescription' | 'Consultation Summary' | 'Discharge Summary';
  date: string;
  doctorOrLabName: string;
  fileUrl: string;
  fileType: 'pdf' | 'image';
  fileSize: string;
  hasVisualUnderstanding: boolean;
  overallImpression?: string;
  keyBiomarkers?: BiomarkerDetail[];
  doctorDiscussionPrompt?: string;
  recommendedFollowUpSpecialty?: string;
}

export interface UpcomingCareItem {
  id: string;
  personId: string;
  personName: string;
  serviceName: string;
  type: 'Doctor Consultation' | 'Home Sample Collection' | 'Lab Report Review' | 'Care Companion Visit';
  date: string;
  time: string;
  providerName: string;
  location: string;
  status: 'Confirmed' | 'Collector Dispatched' | 'Scheduled';
  instructions?: string;
  journeyId?: string;
}

export interface DoctorAppointment {
  id: string;
  journeyId?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  personId: string;
  personName: string;
  consultationMode: 'In-Person Clinic' | 'Telehealth Video';
  clinicLocation: string;
  date: string;
  timeSlot: string;
  consultationFee: number;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  chiefComplaint: string;
  bookedAt: string;
}

export interface DiagnosticBooking {
  id: string;
  journeyId?: string;
  testId: string;
  testName: string;
  category: string;
  personId: string;
  personName: string;
  collectionMode: 'Home Sample Collection' | 'Diagnostic Centre Visit';
  address: string;
  date: string;
  timeSlot: string;
  price: number;
  status: 'Confirmed' | 'Sample Dispatched' | 'Completed';
  fastingHours: number;
  bookedAt: string;
}

export interface CareAssistanceRequest {
  id: string;
  personId: string;
  personName: string;
  serviceType: 'Accompanied Doctor Visit' | 'Diagnostic Centre Support' | 'Elderly Mobility Assistance';
  destination: string;
  date: string;
  time: string;
  specialNeeds: string[];
  assignedCompanion?: {
    name: string;
    phone: string;
    rating: number;
  };
  status: 'Assigned' | 'Requested' | 'Completed';
  notes: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'journey' | 'collection' | 'report' | 'appointment' | 'care_assist';
  read: boolean;
  actionTab?: string;
  actionId?: string;
}

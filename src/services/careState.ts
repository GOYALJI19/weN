import { useState, useEffect } from 'react';
import { 
  HealthcarePerson, 
  HealthcareJourney, 
  Doctor, 
  DiagnosticTest, 
  HealthRecordDocument, 
  UpcomingCareItem,
  DoctorAppointment,
  DiagnosticBooking,
  CareAssistanceRequest,
  NotificationItem,
  User
} from '../core/types/domain';
import { 
  primaryUser, 
  familyMembers as initialFamilyMembers, 
  initialHealthcareJourney, 
  initialUpcomingCareItems, 
  featuredDoctors, 
  featuredDiagnosticPackages, 
  sampleHealthRecords,
  initialNotifications
} from '../core/data/mockDomainData';

class CareStateManager {
  private user: User = primaryUser;
  private activePersonId: string = initialFamilyMembers[0].id;
  private familyMembers: HealthcarePerson[] = initialFamilyMembers;
  private journeys: HealthcareJourney[] = [initialHealthcareJourney];
  private upcomingCareItems: UpcomingCareItem[] = initialUpcomingCareItems;
  private doctors: Doctor[] = featuredDoctors;
  private diagnosticTests: DiagnosticTest[] = featuredDiagnosticPackages;
  private records: HealthRecordDocument[] = sampleHealthRecords;
  private notifications: NotificationItem[] = initialNotifications;
  private appointments: DoctorAppointment[] = [];
  private diagnosticBookings: DiagnosticBooking[] = [];
  private careAssistanceRequests: CareAssistanceRequest[] = [];
  private listeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn());
  }

  // User & Family
  getUser() { return this.user; }
  getFamilyMembers() { return this.familyMembers; }
  getActivePerson(): HealthcarePerson {
    return this.familyMembers.find(p => p.id === this.activePersonId) || this.familyMembers[0];
  }
  setActivePerson(personId: string) {
    this.activePersonId = personId;
    this.notify();
  }

  // Journeys
  getActiveJourney(): HealthcareJourney {
    // Return journey for active person or default
    return this.journeys.find(j => j.personId === this.activePersonId) || this.journeys[0];
  }
  getAllJourneys() { return this.journeys; }
  
  advanceJourneyStep(journeyId: string) {
    const journey = this.journeys.find(j => j.id === journeyId);
    if (journey && journey.currentStepIndex < journey.steps.length - 1) {
      journey.steps[journey.currentStepIndex].status = 'completed';
      journey.steps[journey.currentStepIndex].completedTime = 'Just now';
      journey.currentStepIndex += 1;
      journey.steps[journey.currentStepIndex].status = 'in_progress';
      this.notify();
    }
  }

  // Upcoming Care
  getUpcomingCareItems() {
    return this.upcomingCareItems.filter(item => 
      this.activePersonId === item.personId || item.personName.includes(this.getActivePerson().fullName)
    );
  }
  getAllUpcomingCareItems() { return this.upcomingCareItems; }

  // Doctors & Appointments
  getDoctors() { return this.doctors; }
  getDoctorById(id: string) { return this.doctors.find(d => d.id === id); }
  
  bookDoctorAppointment(params: {
    doctorId: string;
    personId: string;
    mode: 'In-Person Clinic' | 'Telehealth Video';
    date: string;
    slot: string;
    chiefComplaint: string;
  }): DoctorAppointment {
    const doctor = this.getDoctorById(params.doctorId);
    const person = this.familyMembers.find(p => p.id === params.personId) || this.getActivePerson();
    
    const newAppointment: DoctorAppointment = {
      id: `apt_${Date.now()}`,
      doctorId: params.doctorId,
      doctorName: doctor?.fullName || 'Verified Clinician',
      doctorSpecialty: doctor?.specialty || 'General Care',
      doctorAvatar: doctor?.avatarUrl || '',
      personId: params.personId,
      personName: person.fullName,
      consultationMode: params.mode,
      clinicLocation: doctor?.location || 'Arogya Medical Center',
      date: params.date,
      timeSlot: params.slot,
      consultationFee: doctor?.consultationFee || 750,
      status: 'Confirmed',
      chiefComplaint: params.chiefComplaint,
      bookedAt: new Date().toISOString(),
    };

    this.appointments.unshift(newAppointment);

    // Add to upcoming care items
    this.upcomingCareItems.unshift({
      id: `up_${Date.now()}`,
      personId: person.id,
      personName: `${person.fullName} (${person.relationship})`,
      serviceName: `${doctor?.specialty} Consultation with ${doctor?.fullName}`,
      type: 'Doctor Consultation',
      date: params.date,
      time: params.slot,
      providerName: doctor?.fullName || 'Arogya Doctor Panel',
      location: params.mode === 'Telehealth Video' ? 'Virtual Video Consult (Arogya Telehealth Room)' : (doctor?.location || 'Clinic'),
      status: 'Confirmed',
      instructions: 'Please arrive 10 mins early or test video connection prior to start.',
    });

    // Add notification
    this.notifications.unshift({
      id: `notif_${Date.now()}`,
      title: 'Consultation Confirmed',
      description: `Appointment confirmed with ${doctor?.fullName} on ${params.date} at ${params.slot} for ${person.fullName}.`,
      timestamp: 'Just now',
      type: 'appointment',
      read: false,
      actionTab: 'doctors',
    });

    this.notify();
    return newAppointment;
  }

  // Diagnostics & Bookings
  getDiagnosticTests() { return this.diagnosticTests; }
  getTestById(id: string) { return this.diagnosticTests.find(t => t.id === id); }
  
  bookDiagnosticTest(params: {
    testId: string;
    personId: string;
    collectionMode: 'Home Sample Collection' | 'Diagnostic Centre Visit';
    address: string;
    date: string;
    timeSlot: string;
  }): DiagnosticBooking {
    const test = this.getTestById(params.testId);
    const person = this.familyMembers.find(p => p.id === params.personId) || this.getActivePerson();

    const newBooking: DiagnosticBooking = {
      id: `diag_${Date.now()}`,
      testId: params.testId,
      testName: test?.name || 'Diagnostic Blood Panel',
      category: test?.category || 'Clinical Panel',
      personId: params.personId,
      personName: person.fullName,
      collectionMode: params.collectionMode,
      address: params.address,
      date: params.date,
      timeSlot: params.timeSlot,
      price: test?.price || 999,
      status: 'Confirmed',
      fastingHours: test?.fastingRequiredHours || 0,
      bookedAt: new Date().toISOString(),
    };

    this.diagnosticBookings.unshift(newBooking);

    // Add to upcoming items
    this.upcomingCareItems.unshift({
      id: `up_diag_${Date.now()}`,
      personId: person.id,
      personName: `${person.fullName} (${person.relationship})`,
      serviceName: test?.name || 'Diagnostic Panel',
      type: 'Home Sample Collection',
      date: params.date,
      time: params.timeSlot,
      providerName: test?.accreditedLabPartner || 'NABL Reference Lab Partner',
      location: params.collectionMode === 'Home Sample Collection' ? `Home: ${params.address}` : 'Arogya Diagnostic Centre Hub',
      status: 'Scheduled',
      instructions: test?.fastingRequiredHours ? `${test.fastingRequiredHours}-hour fasting strictly required. Plain water allowed.` : 'No fasting required.',
    });

    // Add notification
    this.notifications.unshift({
      id: `notif_diag_${Date.now()}`,
      title: 'Diagnostic Collection Scheduled',
      description: `${test?.name} booked for ${person.fullName}. Scheduled for ${params.date} (${params.timeSlot}).`,
      timestamp: 'Just now',
      type: 'collection',
      read: false,
      actionTab: 'diagnostics',
    });

    this.notify();
    return newBooking;
  }

  // Health Records
  getRecords() {
    return this.records;
  }
  getRecordById(id: string) { return this.records.find(r => r.id === id); }

  // Care Assistance
  requestCareAssistance(params: {
    personId: string;
    serviceType: CareAssistanceRequest['serviceType'];
    destination: string;
    date: string;
    time: string;
    specialNeeds: string[];
    notes: string;
  }): CareAssistanceRequest {
    const person = this.familyMembers.find(p => p.id === params.personId) || this.getActivePerson();

    const newRequest: CareAssistanceRequest = {
      id: `care_${Date.now()}`,
      personId: params.personId,
      personName: person.fullName,
      serviceType: params.serviceType,
      destination: params.destination,
      date: params.date,
      time: params.time,
      specialNeeds: params.specialNeeds,
      status: 'Assigned',
      assignedCompanion: {
        name: 'Sunil Hegde (Certified Care Companion)',
        phone: '+91 98450 77123',
        rating: 4.95,
      },
      notes: params.notes,
    };

    this.careAssistanceRequests.unshift(newRequest);

    this.notifications.unshift({
      id: `notif_care_${Date.now()}`,
      title: 'Care Companion Assigned',
      description: `Companion Sunil Hegde assigned for ${person.fullName}'s visit on ${params.date} at ${params.time}.`,
      timestamp: 'Just now',
      type: 'care_assist',
      read: false,
      actionTab: 'home',
    });

    this.notify();
    return newRequest;
  }

  // Notifications
  getNotifications() { return this.notifications; }
  markNotificationRead(id: string) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.notify();
    }
  }
  markAllNotificationsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notify();
  }
}

export const careState = new CareStateManager();

// React hook for connecting any component to live CareState
export function useCareState() {
  const [, setTick] = useState(0);

  useEffect(() => {
    return careState.subscribe(() => setTick(t => t + 1));
  }, []);

  return {
    user: careState.getUser(),
    activePerson: careState.getActivePerson(),
    familyMembers: careState.getFamilyMembers(),
    setActivePerson: (id: string) => careState.setActivePerson(id),
    
    activeJourney: careState.getActiveJourney(),
    allJourneys: careState.getAllJourneys(),
    advanceJourneyStep: (id: string) => careState.advanceJourneyStep(id),

    upcomingCareItems: careState.getUpcomingCareItems(),
    allUpcomingCareItems: careState.getAllUpcomingCareItems(),

    doctors: careState.getDoctors(),
    bookDoctorAppointment: (params: Parameters<typeof careState.bookDoctorAppointment>[0]) => 
      careState.bookDoctorAppointment(params),

    diagnosticTests: careState.getDiagnosticTests(),
    bookDiagnosticTest: (params: Parameters<typeof careState.bookDiagnosticTest>[0]) => 
      careState.bookDiagnosticTest(params),

    records: careState.getRecords(),
    getRecordById: (id: string) => careState.getRecordById(id),

    requestCareAssistance: (params: Parameters<typeof careState.requestCareAssistance>[0]) => 
      careState.requestCareAssistance(params),

    notifications: careState.getNotifications(),
    markNotificationRead: (id: string) => careState.markNotificationRead(id),
    markAllNotificationsRead: () => careState.markAllNotificationsRead(),
  };
}

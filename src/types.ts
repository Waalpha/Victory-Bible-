export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'PRINCIPAL'
  | 'PRESIDENT'
  | 'REGISTRAR'
  | 'ACADEMIC_DEAN'
  | 'ACADEMIC_OFFICER'
  | 'LECTURER'
  | 'FACULTY'
  | 'FINANCE'
  | 'FINANCE_OFFICER'
  | 'MINISTRY_COORDINATOR'
  | 'LIBRARIAN'
  | 'CHAPLAIN'
  | 'STUDENT_AFFAIRS'
  | 'HOSTEL_MANAGER'
  | 'EXAM_OFFICER'
  | 'STUDENT'
  | 'ALUMNI';

export interface UserProfile {
  id: string;
  uid: string;
  email: string;
  fullName: string;
  role: UserRole;
  department?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  status: 'Active' | 'Inactive' | 'Suspended';
  createdAt: string;
}

export interface UserAccount extends UserProfile {
  lastLogin?: string;
  mustChangePassword?: boolean;
  notes?: string;
  accountType?: 'Firebase Auth' | 'Institutional Account';
  passwordHash?: string; // Stored locally for offline/demo institutional accounts
}

export type ApplicantStatus = 'Draft' | 'Submitted' | 'Under Review' | 'Accepted' | 'Rejected' | 'Waitlisted' | 'Enrolled';

export interface Applicant {
  id: string;
  applicationNumber: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  nationality: string;
  address: string;
  nextOfKinName: string;
  nextOfKinPhone: string;
  churchName: string;
  churchPastor: string;
  refereeName: string;
  refereePhone: string;
  programId: string;
  programName: string;
  intake: string;
  status: ApplicantStatus;
  applicationFeePaid: boolean;
  applicationFeeRef?: string;
  submittedAt: string;
  documents?: { name: string; url: string; type: string }[];
  reviewNotes?: string;
}

export type StudentStatus = 'Applicant' | 'Active' | 'Deferred' | 'Suspended' | 'Graduated' | 'Withdrawn' | 'Expelled' | 'Alumni';

export interface Student {
  id: string;
  studentNumber: string;
  admissionNumber: string;
  fullName: string;
  email: string;
  phone: string;
  gender: 'Male' | 'Female' | 'Other';
  dateOfBirth: string;
  nationality: string;
  address: string;
  photoUrl?: string;
  nextOfKinName: string;
  nextOfKinRelationship?: string;
  nextOfKinPhone: string;
  nextOfKinEmail?: string;
  emergencyContact: string;
  churchName: string;
  churchPastor: string;
  previousEducation: string;
  programId: string;
  programName: string;
  department: string;
  intake: string;
  academicYear: string;
  semester: string;
  status: StudentStatus;
  gpa: number;
  cgpa: number;
  feeBalance: number;
  attendanceRate: number;
  createdAt: string;
}

export interface Program {
  id: string;
  code: string;
  name: string;
  awardType: 'Certificate' | 'Diploma' | 'Bachelor' | 'Master' | 'Doctorate';
  durationYears: number;
  department: string;
  creditRequirements: number;
  description: string;
  admissionRequirements: string;
  status: 'Active' | 'Inactive';
}

export interface Department {
  id: string;
  name: string;
  code: string;
  headOfDepartment: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export interface Course {
  id: string;
  code: string;
  title: string;
  category: 'Biblical Studies' | 'Theology' | 'Ministry' | 'Practical Ministry' | 'Biblical Languages' | 'General Education';
  creditHours: number;
  department: string;
  programId: string;
  level: string;
  semester: string;
  lecturerId?: string;
  lecturerName?: string;
  prerequisites?: string[];
  description: string;
  learningOutcomes: string[];
}

export interface TimetableEntry {
  id: string;
  courseId: string;
  courseCode: string;
  courseTitle: string;
  lecturerName: string;
  room: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  startTime: string;
  endTime: string;
  program: string;
  semester: string;
}

export interface AttendanceRecord {
  id: string;
  courseId: string;
  courseCode: string;
  date: string;
  studentId: string;
  studentName: string;
  status: 'Present' | 'Absent' | 'Late';
  remarks?: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  courseCode: string;
  title: string;
  description: string;
  deadline: string;
  maxMarks: number;
  fileUrl?: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  fileUrl: string;
  submittedAt: string;
  status: 'Submitted' | 'Late' | 'Graded' | 'Returned';
  marksAwarded?: number;
  feedback?: string;
}

export interface Examination {
  id: string;
  title: string;
  courseId: string;
  courseCode: string;
  examType: 'CAT' | 'Mid-term' | 'Final' | 'Practical' | 'Project';
  date: string;
  durationMinutes: number;
  room: string;
  maxMarks: number;
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Graded';
}

export interface ExamResult {
  id: string;
  examId: string;
  courseId: string;
  courseCode: string;
  studentId: string;
  studentName: string;
  marksObtained: number;
  maxMarks: number;
  grade: string;
  gradePoint: number;
  remarks: string;
  status: 'Draft' | 'Submitted' | 'Reviewed' | 'Approved' | 'Published';
}

export interface GradingScaleRule {
  grade: string;
  minMark: number;
  maxMark: number;
  gradePoint: number;
  description: string;
}

export interface FeeStructureItem {
  id: string;
  name: string;
  amount: number;
  isOptional?: boolean;
  category?: 'Tuition' | 'Ancillary' | 'Accommodation' | 'Laboratory' | 'Other';
}

export interface FeeStructure {
  id: string;
  name?: string;
  programId: string;
  programName?: string;
  academicYear: string;
  semester: string;
  currency?: string;
  tuitionFee: number;
  registrationFee: number;
  libraryFee: number;
  examinationFee: number;
  activityFee: number;
  hostelFee?: number;
  customItems?: FeeStructureItem[];
  totalAmount: number;
  notes?: string;
  publishedToWebsite?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  studentId: string;
  studentName: string;
  academicYear: string;
  semester: string;
  items: { description: string; amount: number }[];
  totalAmount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: 'Unpaid' | 'Partial' | 'Paid' | 'Overdue';
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  receiptNumber: string;
  studentId: string;
  studentName: string;
  amount: number;
  paymentMethod: 'M-Pesa' | 'Bank Transfer' | 'Paybill' | 'Cash' | 'Credit Card' | 'Other';
  referenceNumber: string;
  bankName?: string;
  recordedBy: string;
  notes?: string;
  date: string;
}

export interface MinistryPlacement {
  id: string;
  studentId: string;
  studentName: string;
  churchOrOrganization: string;
  supervisorName: string;
  supervisorPhone: string;
  supervisorEmail: string;
  placementType: 'Church Attachment' | 'Evangelism' | 'Missions' | 'Chaplaincy' | 'Youth Ministry';
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed' | 'Suspended';
}

export interface MinistryReport {
  id: string;
  studentId: string;
  studentName: string;
  placementId: string;
  weekNumber: number;
  reportDate: string;
  preachingHours: number;
  evangelismSoulsWon: number;
  teachingHours: number;
  counselingSessions: number;
  summary: string;
  supervisorEvaluationScore: number;
  supervisorComments: string;
  status: 'Submitted' | 'Approved' | 'Needs Revision';
}

export interface LibraryBook {
  id: string;
  isbn: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  totalCopies: number;
  availableCopies: number;
  shelfLocation: string;
}

export interface LibraryLoan {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'Borrowed' | 'Returned' | 'Overdue';
  fineAmount: number;
}

export interface HostelRoom {
  id: string;
  hostelName: string;
  roomNumber: string;
  building: string;
  capacity: number;
  currentOccupants: number;
  feePerSemester: number;
}

export interface ChapelService {
  id: string;
  title: string;
  serviceType: 'Morning Devotion' | 'Midweek Service' | 'Communion' | 'Special Revival' | 'Prayer Night';
  date: string;
  speaker: string;
  venue: string;
  attendanceCount: number;
}

export interface DisciplineCase {
  id: string;
  caseNumber: string;
  studentId: string;
  studentName: string;
  category: 'Attendance' | 'Conduct' | 'Academic Dishonesty' | 'Moral Integrity' | 'Financial';
  description: string;
  reportedDate: string;
  actionTaken: string;
  status: 'Pending' | 'Under Investigation' | 'Hearing Scheduled' | 'Resolved' | 'Closed';
  resolution?: string;
}

export interface StaffMember {
  id: string;
  staffNumber: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  position: 'Professor' | 'Senior Lecturer' | 'Lecturer' | 'Assistant Lecturer' | 'Dean' | 'Registrar' | 'Administrator' | 'Support Staff';
  qualifications: string;
  specialization: string;
  employmentStatus: 'Full-Time' | 'Part-Time' | 'Contract';
  avatarUrl?: string;
}

export type Staff = StaffMember;

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'General' | 'Academics' | 'Finances' | 'Examinations' | 'Chapel' | 'Admissions';
  targetAudience: 'All' | 'Students' | 'Lecturers' | 'Staff';
  authorName: string;
  createdAt: string;
  expiresAt?: string;
}

export interface AuditLogItem {
  id: string;
  userEmail: string;
  userRole: string;
  action: string;
  module: string;
  recordId?: string;
  timestamp: string;
  details: string;
}

export interface SystemSettings {
  institutionName: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  currency: string;
  currentAcademicYear: string;
  currentSemester: string;
  logoUrl?: string;
  stampUrl?: string;
  registrarSignatureUrl?: string;
  gradingScale: GradingScaleRule[];
}

export interface HeroSlide {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  imageUrl: string;
  mobileImageUrl?: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WebsiteSettings {
  announcementBarEnabled: boolean;
  announcementText: string;
  announcementLinkText: string;
  announcementLink: string;
  stats: {
    yearsOfFormation: string;
    graduatesCount: string;
    academicProgramsCount: string;
    facultyCount: string;
    countriesReached: string;
  };
  branding: {
    institutionName: string;
    tagline: string;
    motto: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    logoUrl?: string;
  };
  contact: {
    address: string;
    phone: string;
    email: string;
    officeHours: string;
    mapEmbedUrl?: string;
  };
  socialLinks: {
    facebook?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
    instagram?: string;
  };
}

export interface Testimonial {
  id: string;
  name: string;
  graduationYear: string;
  program: string;
  currentRole: string;
  testimonial: string;
  photoUrl: string;
  order: number;
  isActive: boolean;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  category: 'Institutional News' | 'Academic' | 'Ministry' | 'Student Life' | 'Events' | 'Announcements' | 'Research' | 'Alumni';
  author: string;
  date: string;
  readTime: string;
  featuredImage: string;
  summary: string;
  content: string;
  isFeatured: boolean;
  published: boolean;
}

export interface PublicEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  category: 'Conference' | 'Chapel' | 'Admissions' | 'Lecture' | 'Graduation' | 'Seminar';
  description: string;
  imageUrl: string;
  registrationLink?: string;
  fee?: string;
  isUpcoming: boolean;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  programInterest?: string;
  message: string;
  submittedAt: string;
  status: 'New' | 'Replied' | 'Archived';
}

import { 
  Student, Applicant, Program, Department, Course, TimetableEntry, AttendanceRecord,
  Assignment, Submission, Examination, ExamResult, FeeStructure, Invoice, PaymentRecord,
  MinistryPlacement, MinistryReport, LibraryBook, LibraryLoan, HostelRoom, ChapelService,
  DisciplineCase, StaffMember, Announcement, AuditLogItem, SystemSettings, UserProfile,
  HeroSlide, WebsiteSettings, Testimonial, NewsArticle, PublicEvent, ContactMessage
} from '../types';
import { db, cleanFirestoreData } from './firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';

// Storage keys for robust local persistence that mirrors Firestore collections
const STORAGE_PREFIX = 'theo_erp_';

export const defaultSettings: SystemSettings = {
  institutionName: 'Grace Theological Seminary & Bible College',
  tagline: 'Equipping Faithful Leaders for Global Gospel Ministry',
  address: '124 Covenant Way, Redeemer City, RC 40210',
  phone: '+1 (800) 555-THEO',
  email: 'registrar@gracetheo.edu',
  website: 'https://www.gracetheo.edu',
  currency: '$',
  currentAcademicYear: '2026/2027',
  currentSemester: 'Semester 1',
  logoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200',
  stampUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=150',
  registrarSignatureUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150',
  gradingScale: [
    { grade: 'A', minMark: 70, maxMark: 100, gradePoint: 4.0, description: 'Excellent' },
    { grade: 'B+', minMark: 65, maxMark: 69, gradePoint: 3.5, description: 'Very Good' },
    { grade: 'B', minMark: 60, maxMark: 64, gradePoint: 3.0, description: 'Good' },
    { grade: 'C+', minMark: 55, maxMark: 59, gradePoint: 2.5, description: 'Above Average' },
    { grade: 'C', minMark: 50, maxMark: 54, gradePoint: 2.0, description: 'Average' },
    { grade: 'D', minMark: 40, maxMark: 49, gradePoint: 1.0, description: 'Pass' },
    { grade: 'E', minMark: 0, maxMark: 39, gradePoint: 0.0, description: 'Fail' }
  ]
};

const initialDepartments: Department[] = [
  { id: 'dept-1', name: 'Biblical Studies', code: 'BST', headOfDepartment: 'Dr. Jonathan Vance', description: 'Old and New Testament exegesis, hermeneutics, and biblical theology.', status: 'Active' },
  { id: 'dept-2', name: 'Systematic & Historical Theology', code: 'SHT', headOfDepartment: 'Dr. Sarah Kageni', description: 'Christian doctrine, church history, apologetics, and ethics.', status: 'Active' },
  { id: 'dept-3', name: 'Pastoral Ministry & Leadership', code: 'PML', headOfDepartment: 'Rev. Dr. Samuel Okoro', description: 'Homiletics, pastoral care, church administration, and leadership.', status: 'Active' },
  { id: 'dept-4', name: 'Global Missions & Evangelism', code: 'GME', headOfDepartment: 'Dr. Emmanuel Nkurunziza', description: 'Cross-cultural mission, church planting, and evangelism strategies.', status: 'Active' },
  { id: 'dept-5', name: 'Biblical Languages', code: 'BLG', headOfDepartment: 'Dr. Rebecca Stern', description: 'Biblical Hebrew and Koine Greek syntax and translation.', status: 'Active' }
];

const initialPrograms: Program[] = [
  { id: 'prog-1', code: 'CTH', name: 'Certificate in Christian Theology', awardType: 'Certificate', durationYears: 1, department: 'Biblical Studies', creditRequirements: 36, description: 'Foundational training in Christian doctrine and practical ministry.', admissionRequirements: 'High school certificate or equivalent & pastor recommendation.', status: 'Active' },
  { id: 'prog-2', code: 'DTH', name: 'Diploma in Pastoral Ministry', awardType: 'Diploma', durationYears: 2, department: 'Pastoral Ministry & Leadership', creditRequirements: 72, description: 'Comprehensive preparation for local church pastoral leadership and preaching.', admissionRequirements: 'Certificate in Theology or high school diploma with min C- grade.', status: 'Active' },
  { id: 'prog-3', code: 'BTH', name: 'Bachelor of Theology (B.Th.)', awardType: 'Bachelor', durationYears: 4, department: 'Biblical Studies', creditRequirements: 128, description: 'Rigorous academic and spiritual formation for ordained ministry and biblical scholarship.', admissionRequirements: 'High school aggregate C+ and above.', status: 'Active' },
  { id: 'prog-4', code: 'MDIV', name: 'Master of Divinity (M.Div.)', awardType: 'Master', durationYears: 3, department: 'Systematic & Historical Theology', creditRequirements: 90, description: 'The gold standard graduate degree for pastoral ordination and advanced ministry leadership.', admissionRequirements: 'Recognized Bachelor degree in any discipline.', status: 'Active' },
  { id: 'prog-5', code: 'DMIN', name: 'Doctor of Ministry (D.Min.)', awardType: 'Doctorate', durationYears: 3, department: 'Pastoral Ministry & Leadership', creditRequirements: 48, description: 'Advanced professional doctoral degree for experienced church leaders and senior pastors.', admissionRequirements: 'Master of Divinity (M.Div.) and minimum 3 years active ministry experience.', status: 'Active' }
];

const initialCourses: Course[] = [
  { id: 'crs-101', code: 'OT101', title: 'Pentateuch & Historical Books', category: 'Biblical Studies', creditHours: 3, department: 'Biblical Studies', programId: 'prog-3', level: '100', semester: 'Semester 1', lecturerId: 'stf-1', lecturerName: 'Dr. Jonathan Vance', description: 'Study of Genesis through Esther with emphasis on theological themes and covenant history.', learningOutcomes: ['Exegesis of key narratives', 'Understanding covenant theology', 'Application to contemporary ethics'] },
  { id: 'crs-102', code: 'NT101', title: 'Synoptic Gospels & Acts', category: 'Biblical Studies', creditHours: 3, department: 'Biblical Studies', programId: 'prog-3', level: '100', semester: 'Semester 1', lecturerId: 'stf-1', lecturerName: 'Dr. Jonathan Vance', description: 'Comparative study of Matthew, Mark, Luke, and the birth of the early church in Acts.', learningOutcomes: ['Gospel harmonization', 'Kingdom theology', 'Early church missiology'] },
  { id: 'crs-201', code: 'THEO201', title: 'Systematic Theology I (God, Christ, Spirit)', category: 'Theology', creditHours: 4, department: 'Systematic & Historical Theology', programId: 'prog-3', level: '200', semester: 'Semester 1', lecturerId: 'stf-2', lecturerName: 'Dr. Sarah Kageni', description: 'Dogmatic study of Prolegomena, Theology Proper, Christology, and Pneumatology.', learningOutcomes: ['Trinitarian formulation', 'Orthodox Christology', 'Pneumatological gifts'] },
  { id: 'crs-301', code: 'HOM301', title: 'Biblical Preaching & Homiletics', category: 'Practical Ministry', creditHours: 3, department: 'Pastoral Ministry & Leadership', programId: 'prog-3', level: '300', semester: 'Semester 1', lecturerId: 'stf-3', lecturerName: 'Rev. Dr. Samuel Okoro', description: 'The art and science of sermon preparation, exegesis-driven delivery, and pastoral communication.', learningOutcomes: ['Sermon outline structuring', 'Expository preaching', 'Spiritual authority in delivery'] },
  { id: 'crs-401', code: 'HEB101', title: 'Elementary Biblical Hebrew I', category: 'Biblical Languages', creditHours: 3, department: 'Biblical Languages', programId: 'prog-3', level: '200', semester: 'Semester 1', lecturerId: 'stf-4', lecturerName: 'Dr. Rebecca Stern', description: 'Introduction to Hebrew alphabet, grammar, morphology, and basic vocabulary.', learningOutcomes: ['Reading Biblical Hebrew', 'Morphological analysis', 'Lexicon usage'] }
];

const initialStudents: Student[] = [
  {
    id: 'std-1',
    studentNumber: 'GRC/2026/001',
    admissionNumber: 'ADM-2026-8901',
    fullName: 'Caleb Kiprop Koech',
    email: 'caleb.koech@gracetheo.edu',
    phone: '+254 712 345 678',
    gender: 'Male',
    dateOfBirth: '1999-05-14',
    nationality: 'Kenyan',
    address: 'P.O. Box 450, Eldoret',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    nextOfKinName: 'Esther Koech',
    nextOfKinRelationship: 'Mother',
    nextOfKinPhone: '+254 722 000 111',
    nextOfKinEmail: 'esther.koech@gmail.com',
    emergencyContact: '+254 733 444 555',
    churchName: 'Grace Baptist Church, Eldoret',
    churchPastor: 'Rev. James Mwangi',
    previousEducation: 'High School KCSE Aggregate B+',
    programId: 'prog-3',
    programName: 'Bachelor of Theology (B.Th.)',
    department: 'Biblical Studies',
    intake: 'September 2026',
    academicYear: '2026/2027',
    semester: 'Semester 1',
    status: 'Active',
    gpa: 3.75,
    cgpa: 3.75,
    feeBalance: 150.00,
    attendanceRate: 96.5,
    createdAt: '2026-08-10'
  },
  {
    id: 'std-2',
    studentNumber: 'GRC/2026/002',
    admissionNumber: 'ADM-2026-8902',
    fullName: 'Abigail Wanjiru Mwangi',
    email: 'abigail.wanjiru@gracetheo.edu',
    phone: '+254 734 567 890',
    gender: 'Female',
    dateOfBirth: '2001-11-22',
    nationality: 'Kenyan',
    address: 'P.O. Box 12, Nairobi',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    nextOfKinName: 'David Mwangi',
    nextOfKinRelationship: 'Father',
    nextOfKinPhone: '+254 711 222 333',
    nextOfKinEmail: 'david.mwangi@gmail.com',
    emergencyContact: '+254 722 555 666',
    churchName: 'Nairobi Chapel, Ngong Road',
    churchPastor: 'Rev. Nick Korir',
    previousEducation: 'High School KCSE Aggregate A-',
    programId: 'prog-4',
    programName: 'Master of Divinity (M.Div.)',
    department: 'Systematic & Historical Theology',
    intake: 'September 2026',
    academicYear: '2026/2027',
    semester: 'Semester 1',
    status: 'Active',
    gpa: 3.90,
    cgpa: 3.90,
    feeBalance: 0.00,
    attendanceRate: 98.2,
    createdAt: '2026-08-12'
  },
  {
    id: 'std-3',
    studentNumber: 'GRC/2025/014',
    admissionNumber: 'ADM-2025-7104',
    fullName: 'Daniel Omondi Odhiambo',
    email: 'daniel.omondi@gracetheo.edu',
    phone: '+254 720 987 654',
    gender: 'Male',
    dateOfBirth: '1998-02-10',
    nationality: 'Kenyan',
    address: 'P.O. Box 89, Kisumu',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    nextOfKinName: 'Grace Odhiambo',
    nextOfKinRelationship: 'Spouse',
    nextOfKinPhone: '+254 700 111 222',
    nextOfKinEmail: 'grace.odhiambo@gmail.com',
    emergencyContact: '+254 700 333 444',
    churchName: 'Lake Basin Fellowship',
    churchPastor: 'Pastor Tom Mboya',
    previousEducation: 'Diploma in Theology',
    programId: 'prog-3',
    programName: 'Bachelor of Theology (B.Th.)',
    department: 'Biblical Studies',
    intake: 'September 2025',
    academicYear: '2026/2027',
    semester: 'Semester 1',
    status: 'Active',
    gpa: 3.40,
    cgpa: 3.35,
    feeBalance: 450.00,
    attendanceRate: 91.0,
    createdAt: '2025-08-15'
  }
];

const initialApplicants: Applicant[] = [
  {
    id: 'app-1',
    applicationNumber: 'APP-2026-9001',
    fullName: 'Sarah Mercy Chebet',
    email: 'sarah.chebet@gmail.com',
    phone: '+254 719 888 777',
    gender: 'Female',
    dateOfBirth: '2003-07-30',
    nationality: 'Kenyan',
    address: 'P.O. Box 33, Nakuru',
    nextOfKinName: 'John Chebet',
    nextOfKinPhone: '+254 722 999 000',
    churchName: 'PCEA Nakuru Town',
    churchPastor: 'Rev. Dr. Peter Kamau',
    refereeName: 'Elder Mary Wamae',
    refereePhone: '+254 733 111 222',
    programId: 'prog-1',
    programName: 'Certificate in Christian Theology',
    intake: 'September 2026',
    status: 'Submitted',
    applicationFeePaid: true,
    applicationFeeRef: 'MPESA-QRT89234',
    submittedAt: '2026-09-01'
  },
  {
    id: 'app-2',
    applicationNumber: 'APP-2026-9002',
    fullName: 'Emmanuel Kiprono',
    email: 'emmanuel.kiprono@yahoo.com',
    phone: '+254 728 333 222',
    gender: 'Male',
    dateOfBirth: '2000-12-05',
    nationality: 'Kenyan',
    address: 'P.O. Box 77, Kericho',
    nextOfKinName: 'Paul Kiprono',
    nextOfKinPhone: '+254 710 555 444',
    churchName: 'African Gospel Church, Kericho',
    churchPastor: 'Rev. David Bett',
    refereeName: 'Deacon Joshua Langat',
    refereePhone: '+254 720 444 333',
    programId: 'prog-3',
    programName: 'Bachelor of Theology (B.Th.)',
    intake: 'September 2026',
    status: 'Under Review',
    applicationFeePaid: true,
    applicationFeeRef: 'MPESA-QRT99381',
    submittedAt: '2026-09-02'
  }
];

const initialStaff: StaffMember[] = [
  { id: 'stf-1', staffNumber: 'STF-001', fullName: 'Dr. Jonathan Vance', email: 'j.vance@gracetheo.edu', phone: '+1 555-0192', department: 'Biblical Studies', position: 'Professor', qualifications: 'Ph.D. in Old Testament, Trinity Evangelical Divinity School', specialization: 'Old Testament Exegesis & Hebrew Poetry', employmentStatus: 'Full-Time', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200' },
  { id: 'stf-2', staffNumber: 'STF-002', fullName: 'Dr. Sarah Kageni', email: 's.kageni@gracetheo.edu', phone: '+1 555-0183', department: 'Systematic & Historical Theology', position: 'Senior Lecturer', qualifications: 'Ph.D. in Systematic Theology, Edinburgh University', specialization: 'Trinitarian Dogmatics & Apologetics', employmentStatus: 'Full-Time', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200' },
  { id: 'stf-3', staffNumber: 'STF-003', fullName: 'Rev. Dr. Samuel Okoro', email: 's.okoro@gracetheo.edu', phone: '+1 555-0174', department: 'Pastoral Ministry & Leadership', position: 'Dean', qualifications: 'D.Min. in Pastoral Leadership, Fuller Theological Seminary', specialization: 'Homiletics & Church Growth', employmentStatus: 'Full-Time', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200' },
  { id: 'stf-4', staffNumber: 'STF-004', fullName: 'Dr. Rebecca Stern', email: 'r.stern@gracetheo.edu', phone: '+1 555-0165', department: 'Biblical Languages', position: 'Lecturer', qualifications: 'Ph.D. in Semitic Languages, Hebrew University of Jerusalem', specialization: 'Biblical Hebrew & Aramaic Syntax', employmentStatus: 'Full-Time', avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200' }
];

const initialTimetable: TimetableEntry[] = [
  { id: 'tt-1', courseId: 'crs-101', courseCode: 'OT101', courseTitle: 'Pentateuch & Historical Books', lecturerName: 'Dr. Jonathan Vance', room: 'Lecture Hall A', day: 'Monday', startTime: '08:30', endTime: '11:00', program: 'Bachelor of Theology', semester: 'Semester 1' },
  { id: 'tt-2', courseId: 'crs-201', courseCode: 'THEO201', courseTitle: 'Systematic Theology I', lecturerName: 'Dr. Sarah Kageni', room: 'Hall B', day: 'Tuesday', startTime: '09:00', endTime: '12:00', program: 'Bachelor of Theology', semester: 'Semester 1' },
  { id: 'tt-3', courseId: 'crs-301', courseCode: 'HOM301', courseTitle: 'Biblical Preaching & Homiletics', lecturerName: 'Rev. Dr. Samuel Okoro', room: 'Chapel Auditorium', day: 'Wednesday', startTime: '14:00', endTime: '17:00', program: 'Bachelor of Theology', semester: 'Semester 1' },
  { id: 'tt-4', courseId: 'crs-401', courseCode: 'HEB101', courseTitle: 'Elementary Biblical Hebrew I', lecturerName: 'Dr. Rebecca Stern', room: 'Language Lab 2', day: 'Thursday', startTime: '10:00', endTime: '12:30', program: 'Bachelor of Theology', semester: 'Semester 1' }
];

const initialAssignments: Assignment[] = [
  { id: 'asn-1', courseId: 'crs-101', courseCode: 'OT101', title: 'Exegesis on Genesis 22 (The Binding of Isaac)', description: 'Write a 2500-word exegetical paper analyzing the literary structure, historical context, and christological foreshadowing in Genesis 22.', deadline: '2026-09-30', maxMarks: 100, createdAt: '2026-09-01' },
  { id: 'asn-2', courseId: 'crs-201', courseCode: 'THEO201', title: 'Paper on Nicene Christology', description: 'Analyze the theological controversies leading to the Council of Nicaea and defend the homoousios formulation.', deadline: '2026-10-05', maxMarks: 100, createdAt: '2026-09-02' }
];

const initialSubmissions: Submission[] = [
  { id: 'sub-1', assignmentId: 'asn-1', studentId: 'std-1', studentName: 'Caleb Kiprop Koech', fileUrl: '#', submittedAt: '2026-09-05', status: 'Gradged' as any, marksAwarded: 88, feedback: 'Excellent theological insight and clear exegetical methodology.' }
];

const initialExaminations: Examination[] = [
  { id: 'ex-1', title: 'Mid-Semester Theological Examination', courseId: 'crs-201', courseCode: 'THEO201', examType: 'Mid-term', date: '2026-10-15', durationMinutes: 180, room: 'Main Examination Hall', maxMarks: 100, status: 'Scheduled' }
];

const initialResults: ExamResult[] = [
  { id: 'res-1', examId: 'ex-1', courseId: 'crs-101', courseCode: 'OT101', studentId: 'std-1', studentName: 'Caleb Kiprop Koech', marksObtained: 85, maxMarks: 100, grade: 'A', gradePoint: 4.0, remarks: 'Distinction performance', status: 'Approved' }
];

const initialFeeStructures: FeeStructure[] = [
  {
    id: 'fee-1',
    name: 'Certificate in Christian Theology (2026/2027)',
    programId: 'prog-1',
    programName: 'Certificate in Christian Theology',
    academicYear: '2026/2027',
    semester: 'Semester 1',
    currency: 'KES',
    tuitionFee: 25000,
    registrationFee: 2500,
    libraryFee: 3000,
    examinationFee: 2000,
    activityFee: 1500,
    hostelFee: 15000,
    customItems: [
      { id: 'ci-1', name: 'ICT & Campus Wi-Fi', amount: 2000, category: 'Ancillary' },
      { id: 'ci-2', name: 'Chapel Guild & Welfare', amount: 1500, category: 'Ancillary' }
    ],
    totalAmount: 52000,
    notes: 'Includes foundational textbooks and chapel discipleship materials',
    publishedToWebsite: true,
    createdAt: '2026-08-01'
  },
  {
    id: 'fee-2',
    name: 'Diploma in Pastoral Ministry (2026/2027)',
    programId: 'prog-2',
    programName: 'Diploma in Pastoral Ministry',
    academicYear: '2026/2027',
    semester: 'Semester 1',
    currency: 'KES',
    tuitionFee: 38000,
    registrationFee: 2500,
    libraryFee: 3000,
    examinationFee: 2000,
    activityFee: 1500,
    hostelFee: 15000,
    customItems: [
      { id: 'ci-3', name: 'Practical Ministry Practicum', amount: 3000, category: 'Other' },
      { id: 'ci-4', name: 'ICT & Digital Resources', amount: 2000, category: 'Ancillary' }
    ],
    totalAmount: 67000,
    notes: 'Includes practical ministry field mentorship and supervision',
    publishedToWebsite: true,
    createdAt: '2026-08-01'
  },
  {
    id: 'fee-3',
    name: 'Bachelor of Theology (B.Th.) (2026/2027)',
    programId: 'prog-3',
    programName: 'Bachelor of Theology (B.Th.)',
    academicYear: '2026/2027',
    semester: 'Semester 1',
    currency: 'KES',
    tuitionFee: 52000,
    registrationFee: 2500,
    libraryFee: 3000,
    examinationFee: 2000,
    activityFee: 1500,
    hostelFee: 15000,
    customItems: [
      { id: 'ci-5', name: 'Biblical Hebrew & Greek Language Labs', amount: 3500, category: 'Laboratory' },
      { id: 'ci-6', name: 'ICT & Theological Journal Access', amount: 2500, category: 'Ancillary' }
    ],
    totalAmount: 81500,
    notes: 'Includes Greek/Hebrew labs and digital research database access',
    publishedToWebsite: true,
    createdAt: '2026-08-01'
  },
  {
    id: 'fee-4',
    name: 'Master of Divinity (M.Div.) (2026/2027)',
    programId: 'prog-4',
    programName: 'Master of Divinity (M.Div.)',
    academicYear: '2026/2027',
    semester: 'Semester 1',
    currency: 'KES',
    tuitionFee: 68000,
    registrationFee: 3000,
    libraryFee: 4000,
    examinationFee: 2500,
    activityFee: 2000,
    hostelFee: 32000,
    customItems: [
      { id: 'ci-7', name: 'Graduate Research Seminar & Library Privileges', amount: 4500, category: 'Ancillary' }
    ],
    totalAmount: 116000,
    notes: 'Full graduate research privileges and faculty mentoring',
    publishedToWebsite: true,
    createdAt: '2026-08-01'
  },
  {
    id: 'fee-5',
    name: 'Doctor of Ministry (D.Min.) (2026/2027)',
    programId: 'prog-5',
    programName: 'Doctor of Ministry (D.Min.)',
    academicYear: '2026/2027',
    semester: 'Semester 1',
    currency: 'KES',
    tuitionFee: 95000,
    registrationFee: 5000,
    libraryFee: 5000,
    examinationFee: 4000,
    activityFee: 2000,
    hostelFee: 0,
    customItems: [
      { id: 'ci-8', name: 'Doctoral Colloquium & Dissertation Supervision', amount: 15000, category: 'Other' }
    ],
    totalAmount: 126000,
    notes: 'Doctoral colloquiums and faculty dissertation mentoring',
    publishedToWebsite: true,
    createdAt: '2026-08-01'
  }
];

const initialInvoices: Invoice[] = [
  { id: 'inv-1', invoiceNumber: 'INV-2026-001', studentId: 'std-1', studentName: 'Caleb Kiprop Koech', academicYear: '2026/2027', semester: 'Semester 1', items: [{ description: 'Tuition', amount: 1200 }, { description: 'Registration', amount: 100 }, { description: 'Library', amount: 50 }, { description: 'Exams', amount: 150 }, { description: 'Hostel', amount: 300 }], totalAmount: 1850.00, paidAmount: 1700.00, balance: 150.00, dueDate: '2026-09-30', status: 'Partial', createdAt: '2026-08-20' },
  { id: 'inv-2', invoiceNumber: 'INV-2026-002', studentId: 'std-2', studentName: 'Abigail Wanjiru Mwangi', academicYear: '2026/2027', semester: 'Semester 1', items: [{ description: 'Tuition M.Div', amount: 1500 }], totalAmount: 1500.00, paidAmount: 1500.00, balance: 0.00, dueDate: '2026-09-30', status: 'Paid', createdAt: '2026-08-20' }
];

const initialPayments: PaymentRecord[] = [
  { id: 'pay-1', receiptNumber: 'RCT-2026-401', studentId: 'std-1', studentName: 'Caleb Kiprop Koech', amount: 1700.00, paymentMethod: 'M-Pesa', referenceNumber: 'QG89234190', recordedBy: 'Finance Officer (Jane)', notes: 'First installment payment', date: '2026-08-25' },
  { id: 'pay-2', receiptNumber: 'RCT-2026-402', studentId: 'std-2', studentName: 'Abigail Wanjiru Mwangi', amount: 1500.00, paymentMethod: 'Bank Transfer', referenceNumber: 'BNK-9928172', recordedBy: 'Finance Officer (Jane)', notes: 'Full semester settlement', date: '2026-08-22' }
];

const initialMinistryPlacements: MinistryPlacement[] = [
  { id: 'mp-1', studentId: 'std-1', studentName: 'Caleb Kiprop Koech', churchOrOrganization: 'Grace Baptist Church Eldoret', supervisorName: 'Rev. James Mwangi', supervisorPhone: '+254 722 000 111', supervisorEmail: 'pastor.james@gracebaptist.org', placementType: 'Church Attachment', startDate: '2026-09-01', endDate: '2026-12-15', status: 'Active' }
];

const initialMinistryReports: MinistryReport[] = [
  { id: 'mrep-1', studentId: 'std-1', studentName: 'Caleb Kiprop Koech', placementId: 'mp-1', weekNumber: 1, reportDate: '2026-09-06', preachingHours: 2, evangelismSoulsWon: 4, teachingHours: 3, counselingSessions: 2, summary: 'Assisted in Sunday youth service preaching and conducted neighborhood house-to-house evangelism.', supervisorEvaluationScore: 9.0, supervisorComments: 'Caleb shows exceptional zeal and genuine pastoral sensitivity.', status: 'Approved' }
];

const initialLibraryBooks: LibraryBook[] = [
  { id: 'lib-1', isbn: '978-0801036477', title: 'New Testament Theology: Contrasting Diversity and Unity', author: 'Thomas R. Schreiner', publisher: 'Baker Academic', category: 'Biblical Studies', totalCopies: 5, availableCopies: 4, shelfLocation: 'Shelf 3B' },
  { id: 'lib-2', isbn: '978-0310246459', title: 'Systematic Theology: An Introduction to Biblical Doctrine', author: 'Wayne Grudem', publisher: 'Zondervan Academic', category: 'Theology', totalCopies: 8, availableCopies: 6, shelfLocation: 'Shelf 4A' }
];

const initialLibraryLoans: LibraryLoan[] = [
  { id: 'll-1', bookId: 'lib-1', bookTitle: 'New Testament Theology', studentId: 'std-1', studentName: 'Caleb Kiprop Koech', borrowDate: '2026-09-02', dueDate: '2026-09-16', status: 'Borrowed', fineAmount: 0 }
];

const initialHostelRooms: HostelRoom[] = [
  { id: 'hst-1', hostelName: 'Luther Hall', roomNumber: 'Room 102', building: 'Block A', capacity: 2, currentOccupants: 1, feePerSemester: 300 }
];

const initialChapelServices: ChapelService[] = [
  { id: 'chp-1', title: 'Opening Semester Revival Service', serviceType: 'Special Revival', date: '2026-09-07', speaker: 'Bishop David Muriithi', venue: 'Main Chapel Auditorium', attendanceCount: 240 }
];

const initialDisciplineCases: DisciplineCase[] = [
  { id: 'dsc-1', caseNumber: 'DSC-2026-01', studentId: 'std-3', studentName: 'Daniel Omondi Odhiambo', category: 'Attendance', description: 'Repeated unexcused absence from morning chapel devotions.', reportedDate: '2026-09-03', actionTaken: 'Admonished by Dean of Students', status: 'Resolved', resolution: 'Student apologized and committed to regular attendance.' }
];

const initialAnnouncements: Announcement[] = [
  { id: 'ann-1', title: 'Semester 1 Mid-Term Examination Timetable Released', content: 'All students are requested to check the academic portal for the published mid-term examination schedule and clear any outstanding fee balances.', category: 'Examinations', targetAudience: 'Students', authorName: 'Registrar Office', createdAt: '2026-09-05' }
];

const initialAuditLogs: AuditLogItem[] = [
  { id: 'log-1', userEmail: 'registrar@gracetheo.edu', userRole: 'REGISTRAR', action: 'Created Student Record', module: 'Students', recordId: 'std-1', timestamp: '2026-08-10 10:30:00', details: 'Enrolled student Caleb Kiprop Koech into Bachelor of Theology.' }
];

export const defaultWebsiteSettings: WebsiteSettings = {
  announcementBarEnabled: true,
  announcementText: '2027 Admissions Now Open — Apply Today for January & September Intakes',
  announcementLinkText: 'APPLY NOW',
  announcementLink: '/apply',
  stats: {
    yearsOfFormation: '50+',
    graduatesCount: '1,500+',
    academicProgramsCount: '20+',
    facultyCount: '30+',
    countriesReached: '20+'
  },
  branding: {
    institutionName: 'Grace Theological Seminary & Bible College',
    tagline: 'Equipping Faithful Leaders for Global Gospel Ministry',
    motto: 'Veritas, Pietas, Missio — Biblical Truth, Spiritual Piety, Global Mission',
    primaryColor: '#0b1528',
    secondaryColor: '#1e3a8a',
    accentColor: '#d97706',
    logoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200'
  },
  contact: {
    address: '124 Covenant Way, Grace Hill, P.O. Box 450-30100, Eldoret / Nairobi Campus',
    phone: '+254 (0) 712 345 678 / +1 (800) 555-THEO',
    email: 'admissions@gracetheo.edu',
    officeHours: 'Monday – Friday: 8:00 AM – 5:00 PM (EAT)',
    mapEmbedUrl: ''
  },
  socialLinks: {
    facebook: 'https://facebook.com/gracetheological',
    twitter: 'https://twitter.com/gracetheo',
    youtube: 'https://youtube.com/gracetheologicalseminary',
    linkedin: 'https://linkedin.com/school/grace-theological-seminary'
  }
};

const initialHeroSlides: HeroSlide[] = [
  {
    id: 'slide-1',
    eyebrow: 'THEOLOGICAL EDUCATION FOR A LIFE OF PURPOSE',
    title: 'Prepare Your Mind. Strengthen Your Faith. Serve Your Calling.',
    description: 'Receive rigorous theological training, practical ministry preparation and spiritual formation in a community committed to serving Christ and the world.',
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1920',
    mobileImageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
    primaryButtonText: 'EXPLORE PROGRAMS',
    primaryButtonLink: '/programs',
    secondaryButtonText: 'APPLY NOW',
    secondaryButtonLink: '/apply',
    order: 1,
    isActive: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-09-01'
  },
  {
    id: 'slide-2',
    eyebrow: 'DEEP ROOTS. GLOBAL MISSION.',
    title: 'Study Theology. Shape Lives. Transform Communities.',
    description: 'Develop the biblical knowledge, leadership skills and ministry experience required to serve effectively wherever God calls you.',
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1920',
    mobileImageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
    primaryButtonText: 'DISCOVER OUR PROGRAMS',
    primaryButtonLink: '/programs',
    secondaryButtonText: 'START YOUR JOURNEY',
    secondaryButtonLink: '/apply',
    order: 2,
    isActive: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-09-01'
  },
  {
    id: 'slide-3',
    eyebrow: 'FORMATION FOR FAITHFUL LEADERSHIP',
    title: 'Where Biblical Scholarship Meets Practical Ministry.',
    description: 'Learn from experienced faculty while developing the spiritual maturity and practical skills needed for Christian leadership.',
    imageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1920',
    mobileImageUrl: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=800',
    primaryButtonText: 'MEET OUR FACULTY',
    primaryButtonLink: '/faculty',
    secondaryButtonText: 'LEARN MORE',
    secondaryButtonLink: '/about',
    order: 3,
    isActive: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-09-01'
  },
  {
    id: 'slide-4',
    eyebrow: 'YOUR CALLING. YOUR JOURNEY. YOUR FUTURE.',
    title: 'Take the Next Step in Your Ministry Journey.',
    description: 'Whether you are preparing for pastoral ministry, missions, teaching, leadership or further theological study, we are here to help you grow.',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1920',
    mobileImageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    primaryButtonText: 'APPLY NOW',
    primaryButtonLink: '/apply',
    secondaryButtonText: 'CONTACT ADMISSIONS',
    secondaryButtonLink: '/contact',
    order: 4,
    isActive: true,
    createdAt: '2026-01-01',
    updatedAt: '2026-09-01'
  }
];

const initialTestimonials: Testimonial[] = [
  {
    id: 't-1',
    name: 'Rev. Dr. Barnabas Mutua',
    graduationYear: '2018',
    program: 'Master of Divinity (M.Div.)',
    currentRole: 'Senior Pastor, Nairobi Baptist Fellowship',
    testimonial: 'The balance between rigorous biblical exegesis and deep spiritual mentorship at Grace shaped not only my mind but my heart for shepherd ministry.',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    order: 1,
    isActive: true
  },
  {
    id: 't-2',
    name: 'Pastor Faith Chepkoech',
    graduationYear: '2022',
    program: 'Bachelor of Theology (B.Th.)',
    currentRole: 'Church Planter & Missions Director',
    testimonial: 'Grace prepared me with both intellectual depth and practical field resilience. Cross-cultural evangelism weeks and chapel devotions were truly life-defining.',
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
    order: 2,
    isActive: true
  },
  {
    id: 't-3',
    name: 'Bishop Emmanuel Ndegwa',
    graduationYear: '2014',
    program: 'Doctor of Ministry (D.Min.)',
    currentRole: 'Regional Overseer, AIC Fellowship',
    testimonial: 'I have sent dozens of ministry leaders and pastors to Grace Theological Seminary. Its unflinching loyalty to Scripture and ministry relevance is unmatched.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    order: 3,
    isActive: true
  },
  {
    id: 't-4',
    name: 'Sister Mary Njeri Kilonzo',
    graduationYear: '2024',
    program: 'Diploma in Christian Ministry',
    currentRole: 'Hospital & Palliative Care Chaplain',
    testimonial: 'The pastoral counseling practicum and personal mentorship from faculty equipped me with Christlike empathy for patients and families.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    order: 4,
    isActive: true
  }
];

const initialNewsArticles: NewsArticle[] = [
  {
    id: 'news-1',
    title: 'Grace Theological Seminary Celebrates 50 Years of Faithful Biblical Training',
    slug: 'grace-celebrates-50-years-of-biblical-training',
    category: 'Institutional News',
    author: 'Office of the President',
    date: '2026-08-28',
    readTime: '4 min read',
    featuredImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200',
    summary: 'Over five decades of preparing gospel workers across 20 nations, marked by a thanksgiving convocation and legacy research symposium.',
    content: 'Grace Theological Seminary marked its 50th Golden Jubilee anniversary with an international convocation gathering over 800 alumni, church leaders, and academic partners. Founded on an unyielding dedication to the inerrancy and authority of Scripture, the institution has graduated more than 1,500 pastors, theologians, translators, and educators currently serving in urban church plants, rural mission fields, and academic institutions worldwide.',
    isFeatured: true,
    published: true
  },
  {
    id: 'news-2',
    title: 'Faculty Research Symposium 2026: Biblical Authority in the Global Church',
    slug: 'faculty-research-symposium-2026',
    category: 'Research',
    author: 'Academic Dean Office',
    date: '2026-08-15',
    readTime: '6 min read',
    featuredImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=1200',
    summary: 'Leading African and international scholars gathered at our main campus to address hermeneutics, public theology, and the challenge of syncretism.',
    content: 'The 2026 Annual Theological Symposium brought together senior scholars from across Africa, the UK, and North America. Keynote addresses emphasized faithful expository preaching in African contexts, counteracting prosperity gospels through robust biblical theology, and developing rigorous vernacular theological literature.',
    isFeatured: false,
    published: true
  },
  {
    id: 'news-3',
    title: 'Annual Field Ministry & Missions Outreach: 350 Students Dispatched',
    slug: 'annual-field-ministry-missions-outreach-2026',
    category: 'Ministry',
    author: 'Director of Field Ministry',
    date: '2026-08-04',
    readTime: '3 min read',
    featuredImage: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&q=80&w=1200',
    summary: 'Students spent two weeks ministering alongside rural church plants, conducting door-to-door evangelism, medical camps, and children Bible clubs.',
    content: 'Practical ministerial formation is the heartbeat of Grace Seminary. Last month, our student body engaged in our annual 14-day field ministry immersion, partnering with 42 local congregations. Results include over 280 decisions for Christ, 15 new home fellowships established, and invaluable pastoral preaching and counseling experience.',
    isFeatured: true,
    published: true
  },
  {
    id: 'news-4',
    title: 'Seminary Library Repository Upgrades with Over 50,000 Digital Resources',
    slug: 'library-repository-upgrades-digital-resources',
    category: 'Academic',
    author: 'University Librarian',
    date: '2026-07-20',
    readTime: '3 min read',
    featuredImage: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=1200',
    summary: 'Subscribed access to ATLA Religion Database, Logos digital library licenses for every student, and upgraded physical study carrels.',
    content: 'Our library expansion project has reached a major milestone, providing our residential and distance students with premier theological research tools, critical commentaries in Greek and Hebrew, and rare historical Protestant and African theological manuscripts.',
    isFeatured: false,
    published: true
  }
];

const initialPublicEvents: PublicEvent[] = [
  {
    id: 'evt-1',
    title: 'Annual Theological Conference: Faithfulness in a Changing World',
    date: '2026-10-15',
    time: '9:00 AM – 4:30 PM (EAT)',
    venue: 'Grace Main Auditorium & Live Stream',
    category: 'Conference',
    description: 'A three-day gathering of pastors, theologians, and ministry workers exploring Scripture, ethics, and modern cultural challenges.',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=800',
    registrationLink: '/events/evt-1',
    isUpcoming: true
  },
  {
    id: 'evt-2',
    title: 'Campus Open Day & Prospective Student Admissions Fair',
    date: '2026-11-07',
    time: '10:00 AM – 2:00 PM (EAT)',
    venue: 'Seminary Quad & Academic Complex',
    category: 'Admissions',
    description: 'Tour our academic campus, meet faculty mentors, sit in on a live theology lecture, and receive on-the-spot application guidance.',
    imageUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800',
    registrationLink: '/apply',
    isUpcoming: true
  },
  {
    id: 'evt-3',
    title: 'Semester Spiritual Revival Week & Missions Emphasis',
    date: '2026-11-18',
    time: 'Daily at 10:30 AM & 7:00 PM',
    venue: 'Covenant Chapel',
    category: 'Chapel',
    description: 'Special evening preaching services, prayer gatherings, and guest missionary testimonies centering on unreached people groups.',
    imageUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=800',
    registrationLink: '/events/evt-3',
    isUpcoming: true
  },
  {
    id: 'evt-4',
    title: '51st Commencement Ceremony & Ministerial Ordination Service',
    date: '2026-12-12',
    time: '9:30 AM – 1:00 PM',
    venue: 'Grace Sports Pavilion & Gardens',
    category: 'Graduation',
    description: 'Celebrating our 2026 graduating class receiving doctoral, master, bachelor degrees, and ministry diplomas.',
    imageUrl: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80&w=800',
    registrationLink: '/events/evt-4',
    isUpcoming: true
  }
];

const initialContactMessages: ContactMessage[] = [
  {
    id: 'msg-1',
    fullName: 'Peter Mwangi',
    email: 'peter.mwangi@gmail.com',
    phone: '+254 711 999 888',
    subject: 'Inquiry regarding M.Div. modular schedule',
    programInterest: 'Master of Divinity (M.Div.)',
    message: 'Hello, I am a pastor in Kitale inquiring whether the Master of Divinity program offers hybrid or modular block formats.',
    submittedAt: '2026-09-02 14:15:00',
    status: 'Replied'
  }
];

// Generic helper to get/set collection in localStorage mirroring Firestore
export function getCollection<T>(collectionName: string, defaultData: T[]): T[] {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + collectionName);
    if (!raw) {
      localStorage.setItem(STORAGE_PREFIX + collectionName, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.error(`Error reading collection ${collectionName}:`, e);
    return defaultData;
  }
}

export function saveCollection<T>(collectionName: string, items: T[]): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + collectionName, JSON.stringify(items));
    // Asynchronously synchronize with Cloud Firestore
    if (db && Array.isArray(items)) {
      items.forEach((item: any) => {
        const docId = String(item.id || item.code || Math.random().toString(36).substring(2, 9));
        const firestoreData = cleanFirestoreData({
          ...item,
          _firestoreSyncedAt: new Date().toISOString()
        });
        setDoc(doc(db, collectionName, docId), firestoreData, { merge: true }).catch(err => {
          console.warn(`Firestore sync note for ${collectionName}/${docId}:`, err);
        });
      });
    }
  } catch (e) {
    console.error(`Error saving collection ${collectionName}:`, e);
  }
}

// Entity service operations
export const erpService = {
  getSettings: (): SystemSettings => {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + 'settings');
      if (!raw) {
        localStorage.setItem(STORAGE_PREFIX + 'settings', JSON.stringify(defaultSettings));
        return defaultSettings;
      }
      return JSON.parse(raw);
    } catch {
      return defaultSettings;
    }
  },
  updateSettings: (settings: SystemSettings) => {
    localStorage.setItem(STORAGE_PREFIX + 'settings', JSON.stringify(settings));
    if (db) {
      const firestoreData = cleanFirestoreData({
        ...settings,
        _firestoreSyncedAt: new Date().toISOString()
      });
      setDoc(doc(db, 'settings', 'institution-settings'), firestoreData, { merge: true }).catch(err => {
        console.warn('Firestore settings sync note:', err);
      });
    }
  },

  // Students
  getStudents: (): Student[] => getCollection('students', initialStudents),
  saveStudents: (items: Student[]) => saveCollection('students', items),
  addStudent: (student: Omit<Student, 'id'>): Student => {
    const students = erpService.getStudents();
    const newStudent: Student = { ...student, id: 'std-' + Date.now() };
    saveCollection('students', [newStudent, ...students]);
    return newStudent;
  },
  updateStudent: (id: string, updates: Partial<Student>): Student | null => {
    const list = erpService.getStudents();
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) return null;
    const updated = { ...list[idx], ...updates };
    list[idx] = updated;
    saveCollection('students', list);
    return updated;
  },
  deleteStudent: (id: string): void => {
    const list = erpService.getStudents();
    const filtered = list.filter(s => s.id !== id);
    saveCollection('students', filtered);
    if (db) {
      deleteDoc(doc(db, 'students', id)).catch(err => {
        console.warn('Firestore student delete note:', err);
      });
    }
  },

  // Applicants
  getApplicants: (): Applicant[] => getCollection('applicants', initialApplicants),
  saveApplicants: (items: Applicant[]) => saveCollection('applicants', items),
  addApplicant: (applicant: Omit<Applicant, 'id'>): Applicant => {
    const apps = erpService.getApplicants();
    const newApp: Applicant = { ...applicant, id: 'app-' + Date.now() };
    saveCollection('applicants', [newApp, ...apps]);
    return newApp;
  },

  // Programs
  getPrograms: (): Program[] => getCollection('programs', initialPrograms),
  savePrograms: (items: Program[]) => saveCollection('programs', items),

  // Departments
  getDepartments: (): Department[] => getCollection('departments', initialDepartments),
  saveDepartments: (items: Department[]) => saveCollection('departments', initialDepartments),

  // Courses
  getCourses: (): Course[] => getCollection('courses', initialCourses),
  saveCourses: (items: Course[]) => saveCollection('courses', items),

  // Staff
  getStaff: (): StaffMember[] => getCollection('staff', initialStaff),
  saveStaff: (items: StaffMember[]) => saveCollection('staff', items),
  addStaff: (staff: Omit<StaffMember, 'id'>): StaffMember => {
    const staffList = erpService.getStaff();
    const newStaff: StaffMember = {
      ...staff,
      id: 'stf-' + Date.now()
    };
    saveCollection('staff', [newStaff, ...staffList]);
    return newStaff;
  },
  updateStaff: (id: string, updates: Partial<StaffMember>): StaffMember | null => {
    const list = erpService.getStaff();
    const idx = list.findIndex(s => s.id === id);
    if (idx === -1) return null;
    const updated = { ...list[idx], ...updates };
    list[idx] = updated;
    saveCollection('staff', list);
    return updated;
  },
  deleteStaff: (id: string): void => {
    const list = erpService.getStaff();
    const filtered = list.filter(s => s.id !== id);
    saveCollection('staff', filtered);
    if (db) {
      deleteDoc(doc(db, 'staff', id)).catch(err => {
        console.warn('Firestore staff delete note:', err);
      });
    }
  },

  // Timetable
  getTimetable: (): TimetableEntry[] => getCollection('timetable', initialTimetable),
  saveTimetable: (items: TimetableEntry[]) => saveCollection('timetable', items),

  // Attendance
  getAttendance: (): AttendanceRecord[] => getCollection('attendance', []),
  saveAttendance: (items: AttendanceRecord[]) => saveCollection('attendance', items),

  // Assignments & Submissions
  getAssignments: (): Assignment[] => getCollection('assignments', initialAssignments),
  saveAssignments: (items: Assignment[]) => saveCollection('assignments', items),
  getSubmissions: (): Submission[] => getCollection('submissions', initialSubmissions),
  saveSubmissions: (items: Submission[]) => saveCollection('submissions', items),

  // Examinations & Results
  getExaminations: (): Examination[] => getCollection('examinations', initialExaminations),
  saveExaminations: (items: Examination[]) => saveCollection('examinations', items),
  getResults: (): ExamResult[] => getCollection('results', initialResults),
  saveResults: (items: ExamResult[]) => saveCollection('results', items),

  // Finance: Fee Structures
  getFeeStructures: (): FeeStructure[] => getCollection('feeStructures', initialFeeStructures),
  saveFeeStructures: (items: FeeStructure[]) => saveCollection('feeStructures', items),
  addFeeStructure: (fee: Omit<FeeStructure, 'id'>): FeeStructure => {
    const list = erpService.getFeeStructures();
    const newFee: FeeStructure = {
      ...fee,
      id: 'fee-' + Date.now(),
      createdAt: new Date().toISOString().substring(0, 10),
      updatedAt: new Date().toISOString().substring(0, 10)
    };
    saveCollection('feeStructures', [newFee, ...list]);
    return newFee;
  },
  updateFeeStructure: (id: string, updates: Partial<FeeStructure>): FeeStructure | null => {
    const list = erpService.getFeeStructures();
    const idx = list.findIndex(f => f.id === id);
    if (idx === -1) return null;
    const updated: FeeStructure = {
      ...list[idx],
      ...updates,
      updatedAt: new Date().toISOString().substring(0, 10)
    };
    list[idx] = updated;
    saveCollection('feeStructures', list);
    return updated;
  },
  deleteFeeStructure: (id: string) => {
    const list = erpService.getFeeStructures();
    saveCollection('feeStructures', list.filter(f => f.id !== id));
  },
  generateInvoicesFromFeeStructure: (feeStructureId: string): { generated: number; studentCount: number } => {
    const fee = erpService.getFeeStructures().find(f => f.id === feeStructureId);
    if (!fee) return { generated: 0, studentCount: 0 };
    const allStudents = erpService.getStudents();
    
    // Target active students belonging to this program
    const targetStudents = allStudents.filter(s => 
      (s.programId === fee.programId || s.programName?.toLowerCase() === fee.programName?.toLowerCase()) &&
      s.status === 'Active'
    );
    if (targetStudents.length === 0) {
      return { generated: 0, studentCount: 0 };
    }

    const existingInvoices = erpService.getInvoices();
    const newInvoices: Invoice[] = [];

    targetStudents.forEach(st => {
      const exists = existingInvoices.some(inv => 
        inv.studentId === st.id && 
        inv.academicYear === fee.academicYear && 
        inv.semester === fee.semester
      );
      if (!exists) {
        const items: { description: string; amount: number }[] = [
          { description: 'Tuition Fee', amount: Number(fee.tuitionFee) || 0 },
          { description: 'Registration Fee', amount: Number(fee.registrationFee) || 0 },
          { description: 'Library & Digital Resources', amount: Number(fee.libraryFee) || 0 },
          { description: 'Examination Fee', amount: Number(fee.examinationFee) || 0 },
          { description: 'Student Activity & Welfare', amount: Number(fee.activityFee) || 0 }
        ];
        if (fee.hostelFee && fee.hostelFee > 0) {
          items.push({ description: 'Hostel Accommodation', amount: Number(fee.hostelFee) });
        }
        if (fee.customItems && fee.customItems.length > 0) {
          fee.customItems.forEach(ci => {
            if (ci.name && ci.amount) {
              items.push({ description: ci.name, amount: Number(ci.amount) });
            }
          });
        }

        const total = items.reduce((sum, it) => sum + it.amount, 0);
        newInvoices.push({
          id: 'inv-' + Date.now() + '-' + Math.floor(100 + Math.random() * 900),
          invoiceNumber: 'INV-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000),
          studentId: st.id,
          studentName: st.fullName,
          academicYear: fee.academicYear,
          semester: fee.semester,
          items,
          totalAmount: total,
          paidAmount: 0,
          balance: total,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
          status: 'Unpaid',
          createdAt: new Date().toISOString().substring(0, 10)
        });
        st.feeBalance = (st.feeBalance || 0) + total;
      }
    });

    if (newInvoices.length > 0) {
      saveCollection('invoices', [...newInvoices, ...existingInvoices]);
      saveCollection('students', allStudents);
    }

    return { generated: newInvoices.length, studentCount: targetStudents.length };
  },
  getInvoices: (): Invoice[] => getCollection('invoices', initialInvoices),
  saveInvoices: (items: Invoice[]) => saveCollection('invoices', items),
  getPayments: (): PaymentRecord[] => getCollection('payments', initialPayments),
  savePayments: (items: PaymentRecord[]) => {
    saveCollection('payments', items);
  },
  recordPayment: (payment: Omit<PaymentRecord, 'id' | 'receiptNumber'>): PaymentRecord => {
    const payments = erpService.getPayments();
    const newPayment: PaymentRecord = {
      ...payment,
      id: 'pay-' + Date.now(),
      receiptNumber: 'RCT-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000)
    };
    saveCollection('payments', [newPayment, ...payments]);
    return newPayment;
  },

  // Ministry
  getMinistryPlacements: (): MinistryPlacement[] => getCollection('ministryPlacements', initialMinistryPlacements),
  saveMinistryPlacements: (items: MinistryPlacement[]) => saveCollection('ministryPlacements', items),
  getMinistryReports: (): MinistryReport[] => getCollection('ministryReports', initialMinistryReports),
  saveMinistryReports: (items: MinistryReport[]) => saveCollection('ministryReports', items),

  // Library
  getLibraryBooks: (): LibraryBook[] => getCollection('libraryBooks', initialLibraryBooks),
  getBooks: (): LibraryBook[] => getCollection('libraryBooks', initialLibraryBooks),
  saveLibraryBooks: (items: LibraryBook[]) => saveCollection('libraryBooks', items),
  getLibraryLoans: (): LibraryLoan[] => getCollection('libraryLoans', initialLibraryLoans),
  saveLibraryLoans: (items: LibraryLoan[]) => saveCollection('libraryLoans', items),

  // Hostels
  getHostelRooms: (): HostelRoom[] => getCollection('hostelRooms', initialHostelRooms),
  getHostels: (): HostelRoom[] => getCollection('hostelRooms', initialHostelRooms),
  saveHostelRooms: (items: HostelRoom[]) => saveCollection('hostelRooms', items),

  // Chapel
  getChapelServices: (): ChapelService[] => getCollection('chapelServices', initialChapelServices),
  saveChapelServices: (items: ChapelService[]) => saveCollection('chapelServices', items),

  // Discipline
  getDisciplineCases: (): DisciplineCase[] => getCollection('disciplineCases', initialDisciplineCases),
  saveDisciplineCases: (items: DisciplineCase[]) => saveCollection('disciplineCases', items),

  // Announcements
  getAnnouncements: (): Announcement[] => getCollection('announcements', initialAnnouncements),
  saveAnnouncements: (items: Announcement[]) => saveCollection('announcements', items),

  // Audit Logs
  getAuditLogs: (): AuditLogItem[] => getCollection('auditLogs', initialAuditLogs),
  logAction: (userEmail: string, userRole: string, action: string, module: string, recordId?: string, details?: string) => {
    const logs = erpService.getAuditLogs();
    const newLog: AuditLogItem = {
      id: 'log-' + Date.now(),
      userEmail,
      userRole,
      action,
      module,
      recordId: recordId || '',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      details: details || action
    };
    saveCollection('auditLogs', [newLog, ...logs]);
  },

  // Website CMS: Hero Slides
  getHeroSlides: (): HeroSlide[] => getCollection('websiteHeroSlides', initialHeroSlides),
  saveHeroSlides: (items: HeroSlide[]) => saveCollection('websiteHeroSlides', items),
  addHeroSlide: (slide: Omit<HeroSlide, 'id' | 'createdAt' | 'updatedAt'>): HeroSlide => {
    const slides = erpService.getHeroSlides();
    const now = new Date().toISOString();
    const newSlide: HeroSlide = {
      ...slide,
      id: 'slide-' + Date.now(),
      createdAt: now,
      updatedAt: now
    };
    saveCollection('websiteHeroSlides', [...slides, newSlide]);
    return newSlide;
  },
  updateHeroSlide: (id: string, updates: Partial<HeroSlide>): HeroSlide | null => {
    const slides = erpService.getHeroSlides();
    const idx = slides.findIndex(s => s.id === id);
    if (idx === -1) return null;
    const updated: HeroSlide = {
      ...slides[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    slides[idx] = updated;
    saveCollection('websiteHeroSlides', slides);
    return updated;
  },
  deleteHeroSlide: (id: string) => {
    const slides = erpService.getHeroSlides();
    const filtered = slides.filter(s => s.id !== id);
    saveCollection('websiteHeroSlides', filtered);
  },

  // Website Settings & Announcement Bar
  getWebsiteSettings: (): WebsiteSettings => {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + 'websiteSettings');
      if (!raw) {
        localStorage.setItem(STORAGE_PREFIX + 'websiteSettings', JSON.stringify(defaultWebsiteSettings));
        return defaultWebsiteSettings;
      }
      return JSON.parse(raw);
    } catch {
      return defaultWebsiteSettings;
    }
  },
  saveWebsiteSettings: (settings: WebsiteSettings) => {
    localStorage.setItem(STORAGE_PREFIX + 'websiteSettings', JSON.stringify(settings));
    if (db) {
      const firestoreData = cleanFirestoreData({
        ...settings,
        _firestoreSyncedAt: new Date().toISOString()
      });
      setDoc(doc(db, 'websiteSettings', 'public-config'), firestoreData, { merge: true }).catch(err => {
        console.warn('Firestore websiteSettings sync note:', err);
      });
    }
  },

  // Testimonials
  getTestimonials: (): Testimonial[] => getCollection('testimonials', initialTestimonials),
  saveTestimonials: (items: Testimonial[]) => saveCollection('testimonials', items),
  addTestimonial: (item: Omit<Testimonial, 'id'>): Testimonial => {
    const list = erpService.getTestimonials();
    const newItem: Testimonial = { ...item, id: 't-' + Date.now() };
    saveCollection('testimonials', [...list, newItem]);
    return newItem;
  },
  deleteTestimonial: (id: string) => {
    const list = erpService.getTestimonials();
    saveCollection('testimonials', list.filter(t => t.id !== id));
  },

  // News Articles
  getNewsArticles: (): NewsArticle[] => getCollection('newsArticles', initialNewsArticles),
  saveNewsArticles: (items: NewsArticle[]) => saveCollection('newsArticles', items),
  addNewsArticle: (item: Omit<NewsArticle, 'id'>): NewsArticle => {
    const list = erpService.getNewsArticles();
    const newItem: NewsArticle = { ...item, id: 'news-' + Date.now() };
    saveCollection('newsArticles', [newItem, ...list]);
    return newItem;
  },
  deleteNewsArticle: (id: string) => {
    const list = erpService.getNewsArticles();
    saveCollection('newsArticles', list.filter(n => n.id !== id));
  },

  // Public Events
  getPublicEvents: (): PublicEvent[] => getCollection('publicEvents', initialPublicEvents),
  savePublicEvents: (items: PublicEvent[]) => saveCollection('publicEvents', items),
  addPublicEvent: (item: Omit<PublicEvent, 'id'>): PublicEvent => {
    const list = erpService.getPublicEvents();
    const newItem: PublicEvent = { ...item, id: 'evt-' + Date.now() };
    saveCollection('publicEvents', [...list, newItem]);
    return newItem;
  },
  deletePublicEvent: (id: string) => {
    const list = erpService.getPublicEvents();
    saveCollection('publicEvents', list.filter(e => e.id !== id));
  },

  // Contact Submissions
  getContactMessages: (): ContactMessage[] => getCollection('contactMessages', initialContactMessages),
  addContactMessage: (msg: Omit<ContactMessage, 'id' | 'submittedAt' | 'status'>): ContactMessage => {
    const list = erpService.getContactMessages();
    const newMsg: ContactMessage = {
      ...msg,
      id: 'msg-' + Date.now(),
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: 'New'
    };
    saveCollection('contactMessages', [newMsg, ...list]);
    return newMsg;
  }
};

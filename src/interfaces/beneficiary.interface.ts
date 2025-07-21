// Tipos base en string

export type ModalityStudent = 'Renovación' | 'Nuevo Estudiante';

export type Gender = 'male' | 'female' | 'Masculino' | 'Femenino';

export type Parentesco =
  | 'Mamá'
  | 'Papá'
  | 'Nana'
  | 'Niño'
  | 'Tía'
  | 'Tío'
  | 'Hermano'
  | 'Hermana'
  | 'Abuelo'
  | 'Abuela';

export type LearningLevel = 'No tan bien' | 'Mas o menos' | 'Bien' | 'Muy bien';

export type CoursePriorityReason =
  | 'Son los cursos en los que el estudiante presenta más dificultades'
  | "Son cursos 'prioritarios' o básicos a reforzar"
  | 'Los cursos son de interés para el estudiante';

export type CallSignalIssue =
  | 'Señal baja debido a situaciones externas: lluvias, cortes de luz repentinos, etc.'
  | 'Señal baja cotidianamente: regularmente no se escucha las llamadas, a veces se corta, no entra la llamada, etc.'
  | 'No tiene problemas con la señal.';

export type WorkshopPreference =
  | 'Cuenta cuentos (sin internet)'
  | 'Dibujo y Pintura (con internet)'
  | 'Música (con internet)'
  | 'Oratoria (sin internet)'
  | 'Teatro (con internet)'
  | 'Danza (con internet)';

export type Course = 'Matemática' | 'Comunicación' | 'Inglés';

export type EnrollmentStatus = 'Pending' | 'Enrolled' | 'Not Accepted' | 'Inscrito' | 'No Aceptado';

export type LANGUAGES = 'Español' | 'Quechua' | 'Aymara' | 'Otro';

export type PREFERED_COURSES =
  | 'Matemáticas'
  | 'Ciencias'
  | 'Comunicación'
  | 'Inglés'
  | 'Historia'
  | 'Geografía'
  | 'Otros';

export type DAY =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'
  | 'Lunes'
  | 'Martes'
  | 'Miércoles'
  | 'Jueves'
  | 'Viernes'
  | 'Sábado'
  | 'Domingo';

export interface BeneficiaryLanguageDto {
  language: LANGUAGES;
  customLanguageName?: string;
}

export interface PreferredCourseDto {
  name: PREFERED_COURSES;
  customCourseName?: string;
}

export interface ScheduleDto {
  id?: number;
  dayOfWeek: DAY;
  period_time: string;
  period_time2: string;
  period_time3: string;
  createdAt?: string;
  updatedAt?: string;
  beneficiaryId?: number;
}

export interface AreaAdviser {
  id: number;
  name: string;
  isActive: boolean;
  description: string;
}

export interface CommunicationPreference {
  id: number;
  name: string;
}

export interface Beneficiary {
  id: number;
  code: string;
  degree: string | null;
  name: string;
  lastName: string;
  dni: string;
  institution: string | null;
  modalityStudent: ModalityStudent | null;
  birthDate: string | null;
  gender: Gender | null;
  parentesco: Parentesco | null;
  nameRepresentative: string | null;
  lastNameRepresentative: string | null;
  isAddGroupWspp: boolean;
  isAddEquipment: boolean;
  learningLevel: LearningLevel | null;
  hoursAsesoria: number | null;
  coursePriorityReason: CoursePriorityReason | null;
  phoneNumberMain: string | null;
  cellphoneObservation: string | null;
  isWhatsApp: boolean;
  callSignalIssue: CallSignalIssue | null;
  fullNameContactEmergency: string | null;
  phoneNumberContactEmergency: string | null;
  fullNameContactEmergency2: string | null;
  phoneNumberContactEmergency2: string | null;
  allpaAdvisoryConsent: boolean;
  allpaImageConsent: boolean;
  ruruAdvisoryConsent: boolean;
  additionalNotes: string | null;
  firstWorkshopChoice: WorkshopPreference | null;
  secondWorkshopChoice: WorkshopPreference | null;
  thirdWorkshopChoice: WorkshopPreference | null;
  firstCourseChoice: Course | null;
  secondCourseChoice: Course | null;
  enrollmentStatus: EnrollmentStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  beneficiaryLanguage: Array<{
    id?: number;
    language: LANGUAGES;
    customLanguageName: string | null;
    beneficiaryId?: number;
    createdAt?: string;
    updatedAt?: string;
  }>;
  beneficiaryPreferredCourses: Array<{
    id?: number;
    name: PREFERED_COURSES;
    customCourseName: string | null;
    beneficiaryId?: number;
    createdAt?: string;
    updatedAt?: string;
  }>;
  schedules: ScheduleDto[];
  communicationPreferences: CommunicationPreference[];
  areaAdvisers: AreaAdviser[];
  userId: number | null;
}

export interface CreateBeneficiaryDto {
  code: string;
  name: string;
  lastName: string;
  dni: string;
  institution?: string;
  modalityStudent?: ModalityStudent;
  birthDate?: string;
  gender?: Gender;
  parentesco?: Parentesco;
  nameRepresentative?: string;
  lastNameRepresentative?: string;
  isAddGroupWspp?: boolean;
  isAddEquipment?: boolean;
  learningLevel?: LearningLevel;
  hoursAsesoria?: number;
  coursePriorityReason?: CoursePriorityReason;
  phoneNumberMain?: string;
  cellphoneObservation?: string;
  isWhatsApp?: boolean;
  callSignalIssue?: CallSignalIssue;
  fullNameContactEmergency?: string;
  phoneNumberContactEmergency?: string;
  fullNameContactEmergency2?: string;
  phoneNumberContactEmergency2?: string;
  allpaAdvisoryConsent: boolean;
  allpaImageConsent: boolean;
  ruruAdvisoryConsent: boolean;
  additionalNotes?: string;
  firstWorkshopChoice?: WorkshopPreference;
  secondWorkshopChoice?: WorkshopPreference;
  thirdWorkshopChoice?: WorkshopPreference;
  firstCourseChoice?: Course;
  secondCourseChoice?: Course;
  beneficiaryLanguage: BeneficiaryLanguageDto[];
  beneficiaryPreferredCourses: PreferredCourseDto[];
  schedules: ScheduleDto[];
  communicationPreferences: number[];
  areaAdvisers?: number[];
  userId?: number;
}

export interface UpdateBeneficiaryDto extends Partial<CreateBeneficiaryDto> {}

export interface BeneficiaryEnums {
  modalityStudent: string[];
  gender: string[];
  parentesco: string[];
  learningLevel: string[];
  coursePriorityReason: string[];
  callSignalIssue: string[];
  workshopPreference: string[];
  course: string[];
  languages: string[];
  preferredCourses: string[];
  daysOfWeek: string[];
  areaAdvisers: Array<{ id: number; name: string }>;
  communicationPreferences: Array<{ id: number; name: string }>;
}

export interface BeneficiaryListResponse {
  data: Beneficiary[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

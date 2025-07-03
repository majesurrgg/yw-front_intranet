export interface Schedule {
  id: number;
  dayOfWeek: string;
  period_time: string;
  period_time2: string;
  period_time3: string;
}

export interface Postulant {
  id: number;
  name: string;
  lastName: string;
  email: string;
  birthDate: string;
  phoneNumber: string;
  typeVolunteer: 'STAFF' | 'ADVISER';
  typeIdentification: string;
  numIdentification: string;
  wasVoluntary: boolean;
  cvUrl: string;
  videoUrl: string;
  datePostulation: string;
  volunteerMotivation: string;
  howDidYouFindUs: string;
  schedules: Schedule[];
  advisoryCapacity?: number;
  idPostulationArea: number;
  schoolGrades?: string;
  callingPlan?: boolean;
  quechuaLevel?: string;
  programsUniversity?: string;
  isVoluntary: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  statusVolunteer: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ApiResponse {
  data: Postulant[];
  total?: number;
  page?: number;
  limit?: number;
}

export type CreatePostulant = Omit<Postulant, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

export type UpdatePostulant = Partial<CreatePostulant>; 
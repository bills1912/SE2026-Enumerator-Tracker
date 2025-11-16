import { LatLngExpression } from 'leaflet';

export enum UserRole {
  Supervisor = 'Supervisor',
  Enumerator = 'Enumerator',
}

export enum SurveyStatus {
  NotStarted = 'Not Yet Surveyed',
  InProgress = 'Currently Being Surveyed',
  Completed = 'Successfully Surveyed',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  password?: string; // Made optional for type safety, but required for login
}

export interface Respondent {
  id: string;
  name: string;
  location: LatLngExpression;
  status: SurveyStatus;
  enumeratorId: string | null;
  provinsi?: string;
  kabupaten?: string;
  kecamatan?: string;
  desa?: string;
}

export interface Enumerator extends User {
  role: UserRole.Enumerator;
  location: LatLngExpression | null;
  isMoving: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'supervisor';
  content: string;
}

export type ChatMode = 'ai' | 'supervisor';

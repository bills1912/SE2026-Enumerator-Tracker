
import { User, Respondent, Enumerator, UserRole, SurveyStatus } from './types';

export const USERS: User[] = [
  { id: 'supervisor-1', name: 'Dr. Anya Sharma', role: UserRole.Supervisor, email: 'anya.sharma@supervisor.com', password: 'password123' },
  { id: 'enumerator-1', name: 'John Doe', role: UserRole.Enumerator, email: 'john.doe@enumerator.com', password: 'password123' },
  { id: 'enumerator-2', name: 'Jane Smith', role: UserRole.Enumerator, email: 'jane.smith@enumerator.com', password: 'password123' },
];

export const INITIAL_ENUMERATORS: Enumerator[] = [
    { id: 'enumerator-1', name: 'John Doe', role: UserRole.Enumerator, email: 'john.doe@enumerator.com', password: 'password123', location: [34.0522, -118.2437], isMoving: false },
    { id: 'enumerator-2', name: 'Jane Smith', role: UserRole.Enumerator, email: 'jane.smith@enumerator.com', password: 'password123', location: [40.7128, -74.0060], isMoving: true },
];

export const INITIAL_RESPONDENTS: Respondent[] = [
  { id: 'resp-1', name: 'Respondent A', location: [34.06, -118.25], status: SurveyStatus.NotStarted, enumeratorId: 'enumerator-1' },
  { id: 'resp-2', name: 'Respondent B', location: [34.055, -118.26], status: SurveyStatus.NotStarted, enumeratorId: 'enumerator-1' },
  { id: 'resp-3', name: 'Respondent C', location: [34.045, -118.23], status: SurveyStatus.InProgress, enumeratorId: 'enumerator-1' },
  { id: 'resp-4', name: 'Respondent D', location: [40.72, -74.01], status: SurveyStatus.NotStarted, enumeratorId: 'enumerator-2' },
  { id: 'resp-5', name: 'Respondent E', location: [40.71, -73.99], status: SurveyStatus.Completed, enumeratorId: 'enumerator-2' },
  { id: 'resp-6', name: 'Respondent F', location: [40.705, -74.005], status: SurveyStatus.NotStarted, enumeratorId: 'enumerator-2' },
];

export const STATUS_COLORS: Record<SurveyStatus, string> = {
  [SurveyStatus.NotStarted]: 'red',
  [SurveyStatus.InProgress]: 'yellow',
  [SurveyStatus.Completed]: 'green',
};
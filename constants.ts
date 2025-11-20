
import { User, Respondent, Enumerator, UserRole, SurveyStatus } from './types';

export const PROJECT_DUE_DATE = new Date('2026-09-30T23:59:59');

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
  { id: 'resp-7', name: 'Purba Margana (PM) Coffee and Resto', location: [1.5046091433658828, 99.6245735746451], status: SurveyStatus.NotStarted, enumeratorId: 'enumerator-1' },
];

export const STATUS_COLORS: Record<SurveyStatus, string> = {
  [SurveyStatus.NotStarted]: '#EF4444', // red-500
  [SurveyStatus.InProgress]: '#EAB308', // yellow-500
  [SurveyStatus.Completed]: '#22C55E', // green-500
  [SurveyStatus.Reviewed]: '#8B5CF6', // violet-500
};

// New orange theme color
export const THEME_COLOR = '#E18939';

// Base64 encoded logos
export const BPS_LOGO_BASE64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMjgwIDk2MCI+PGRlZnM+PGNsaVBhdGggaWQ9ImEiPjxwYXRoIGQ9Ik0wIDBoMTI4MHY5NjBIMHoiLz48L2NsaXBQYXRoPjwvZGVmcz48ZyBjbGlwLXBhdGg9InVybCgjYSkiPjxwYXRoIGQ9Ik0xMjAuMzQgODEzLjU0aDEwMzkuMzJWMjcwLjI3SDEyMC4zNHptODY3LjE2LTY1M0EuNDFjMjEuMzkgMCAzOC44NSAxNy40NiAzOC44NSAzOC44NXY0MTUuMzdjMCAyMS40LTE3LjQ2IDM4Ljg1LTM4Ljg1IDM4Ljg1SDI5Mi41Yy0yMS4zOSAwLTM4Ljg1LTE3LjQ2LTM4Ljg1LTM4Ljg1VjE5OWMtLjAyLTIxLjM5IDE3LjQ0LTM4Ljg1IDM4Ljg1LTM4LjgVem0tMzguODUgMTA4LjA4YzAgMTMuMzctMTAuODUgMjQuMjUtMjQuMjUgMjQuMjVoLTQ0MWMtMTMuMzcgMC0yNC4yNSwxMC44OC0yNC4yNSAyNC4yNXYxMDEuMzRjMCAxMy4zNyAxMC44OCAyNC4yNSAyNC4yNSAyNC4yNWg0NDFjMTMuNCAwIDI0LjI1LDEwLjg4IDI0LjI1LTI0LjI1VjQwNS40M2MwLTEzLjM3LTEwLjg1LTI0LjI1LTI0LjI1LTI0LjI1aC00NDFjLTEzLjM3IDAtMjQuMjUtMTAuODgtMjQuMjUtMjQuMjV2LTQyLjQ1YzAtMTMuMzcgMTAuODggMjQuMjUgMjQuMjUgMjQuMjVoNDQxYzEzLjQgMCAyNC4yNSAxMC44OCAyNC4yNSAyNC4yNXptLTU0NC4wMyAxOTAuNDRjMCAxMy4zNy0xMC44OCAyNC4yNS0yNC4yNSAyNC4yNUgyOTUuMjFjLTEzLjM3IDAtMjQuMjUtMTAuODgtMjQuMjUtMjQuMjV2LTQyLjQ1YzAtMTMuMzcgMTAuODggMjQuMjUgMjQuMjUgMjQuMjVoMTczLjAzYzEzLjM3IDAgMjQuMjUgMTAuODggMjQuMjUgMjQuMjV6bTM2Mi40NyAwYzAgMTMuMzctMTAuODUgMjQuMjUtMjQuMjUgMjQuMjVoLTE3M2MtMTMuMzcgMC0yNC4yNS0xMC44OC0yNC4yNS0yNC4yNXYtNDIuNDVjMC0xMy4zNyAxMC44OC0yNC4yNSAyNC4yNS0yNC4yNWgxNzMuMDNjMTMuMzcgMCAyNC4yNSAxMC44OCAyNC4yNSAyNC4yNXptLTIxNi4xLTQwMS42M2gtMzM1LjdjLTE4LjQyIDAtMzMuMzMgMTQuOTQtMzMuMzMgMzMuMzZ2NTEzLjM0YzAgMTguNDIgMTQuOTEgMzMuMzMgMzMuMzMgMzMuMzNoNzgyLjY1YzE4LjQyIDAgMzMuMzMtMTQuOTEgMzMuMzMtMzMuMzNWMTk5Yy4wMi0xOC40Mi0xNC44OS0zMy4zMy0zMy4zMy0zMy4zM3oiIGZpbGw9IiMwMDk0ZGEiLz48cGF0aCBkPSJtNTU1LjQyIDYwNS4zMSAyNy4yMiA0Ny4xNmM0LjQgNy42MiAxNC42NiA3LjYyIDE5LjA3IDBsMjcuMjItNDcuMTZoLTczLjV6IiBmaWxsPSIjZmY5MDAwIi8+PHBhdGggZD0ibTQ2MC41NSA0NzkuOWgzMDguOTF2MjQ3LjU0SDQ2MC41NXoiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNNTk5LjUyIDUzMS45NGMtNDEuNjkgMC03Ni4zNyAzNS4yMS03Ni4zNyA3OS4zMyAwIDQ0LjEgMzQuNjggNzkuMzMgNzYuMzcgNzkuMzNzNzYuMzctMzUuMjIgNzYuMzctNzkuMzNjMC00NC4xMi0zNC4yOC03OS4zMy03Ni4zNy03OS4zM3ptMCAxMjguMDJjLTI1LjA5IDAtNDUuNTctMjAuNDgtNDUuNTctNDUuNTcgMC0yNS4wOSAyMC40OC00NS41NyA0NS41Ny00NS41N3M0NS41NyAyMC40OCA0NS41NyA0NS41N2MwIDI1LjA5LTIwLjQ4IDQ1LjU3LTQ1LjU3IDQ1LjU3eiIgZmlsbD0iIzAwOTRkYSIvPjxwYXRoIGQ9Im01OTkuNTIgNTU0LjE4Yy0yOS40OCAwLTUzLjQ2IDI0Ljg4LTUzLjQ2IDU3LjA5IDAgMzIuMiAyMy45OCA1oty4wOSA1My40NiA1Ny4wOXM1My40Ni0yNC44OCA1My40Ni01Ny4wOWMwLTMyLjIxLTIzLjk4LTU3LjA5LTUzLjQ2LTU3LjA5em0wIDgzLjU1Yy0xMy4zMSAwLTI0LjA3LTEwLjc2LTI0LjA3LTI0LjA3IDAtMTMuMyAxMC43Ni0yNC4wNyAyNC4wNy0yNC4wN3MyNC4wNyAxMC43NyAyNC4wNyAyNC4wN2MwIDEzLjMyLTEwLjc2IDI0LjA3LTI0LjA3IDI0LjA3eiIgZmlsbD0iIzAwOTRkYSIvPjwvZz48L3N2Zz4=";
export const SE2026_LOGO_BASE64 = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIiB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCI+PGcgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRTE4OTM5IiBzdHJva2Utd2lkdGg9IjEwIj48cGF0aCBkPSJNNjAsMjBIMTQwYTIwLDIwIDAgMCAxIDIwLDIwdjEyMGEyMCwyMCAwIDAgMS0yMCwyMEg2MGEyMCwyMCAwIDAgMS0yMC0yMFY0MGEyMCwyMCAwIDAgMSAyMC0yMFoiLz48L2c+PHRleHQgeD0iMTAwIiB5PSIxMDUiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjgwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI0UxODkzOSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJjZW50cmFsIj5TRTwvdGV4dD48dGV4dCB4PSIxMDAiIHk9IjE1MCIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMzUiIGZvbnQtd2VnaHQ9ImJvbGQiIGZpbGw9IiMxRjI5MzkiIHRleHQtYW5jaGy9Im1pZGRsZSIgYWxpZ25tZW50LWJhc2VsaW5lPSJjZW50cmFsIj4yMDI2PC90ZXh0Pjwvc3ZnPg==";

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

// Base64 encoded logos
export const BPS_LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX/txcAAAD/ugD/uQD/twD/tgD/vQD/twX/tQD/uQb+tRb9sAD/tgb9sQD+tAD+tgT9sQb9sQT+uAX9sQL9sQX9rhD9rwD9sgD+tgD/tAD+sgH+sQD9sAH+rgD/ugj/uwn/vxT/wxn/yCP/zCv/0Dj/1Db/3Ur/4lD/5mD/6Wv/7nn/8YX/9Jf/+aL/+7L//fb/yhv/2UL/6mr/xCL+rwP+tAb9rAb/uAj///9T261+AAAFyElEQVR4nO2da3uiOhCGQ0oKBS8LLwQVL/aiFbDWWqu1d73//2/ZDaFJyAw5mR2fcz/EpDPz5iaTTCZJBAKBQCAQCAQCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgE3k/4x/5kLh5i/eUf/1r44Y8s3K8t3+eLDzI89Y8yPI7v1xYjHzE8+48yPHn2r9f4YyQvHiN5sXhX/Z9H+G2S/9WJt1hftvLp8t55uM1cPOmP+/B5eP3y/fVj+K98s3y5M3yXp35i7g0iWfAanPj/Z8uXM8OXe+p94j4PItnwGpy/l+9/d4Qv9tS79n0fRLHgNXj/x8u/G8Kv+Op9/L4PItnyGjz+z5ffLwz/ylPvi/R9EcmyZ/T6S5f/NoRv+tS75H0f5LLU4fN//t2Rvu1T75L0f5HLc4fJ/+77/r0D33yfZbLD/uM1uHz5w3/3oP/3CffZ7FscP+41fR5+L6D//lPvvU5UmyOHP7v/l9dfl+//H/bH74T8Wf7r0mS/VOn/lOnf/rU6/r8J8uXXz/tL19s73/61P9u9J8uXX6/tH15+9pT71L3/yZLvv3t6/1r71L3/yZD/l+9/a196l77/JmQf2d/a596577/Jhly/729f+pd+s6b/NnL3/72t/epd+U7b/Jn/v72t/epd+87b/JnP7PXtT99523+TAj+Xt/+9J23+TNh+Mva3z7ztn8myvzeXt/+85b/JnQ/2va3z7zl3wky/zeXv83t7/95S3+TID/27397S/f+ZcEzX/w/m9v/9t33uXfhMz/x/+jva3v/OtfEjL/0d/e1t7/dp0mZLzDf7e9/Z07+dOQ/Y/+9rf3/F1PTQn5D/u9va1t/47rpxQk/+t/v72tbf/puj5MCN/41/72trb9t+n6MCF8++f87W9v+5fR9TshfKev8e2/u+M4J8TvfPtP+l/71P+p33u/MvEbf+n/aJ96V/tPfTsh8V/9r/2rfeo/3++bEyL/1/5VP/U++X/v254Q5/+rf+qd+v3vb3NDguJf/a/+qXfqN7y9zQ0Jj7/6X/2T7+Tvb3tDgsNf/S/+yXfW97e9IcHRr/5X/6R7zve3vSHB8V/9r/7Jd8L3t71hQfGv/lf/5Dvve3vbHhIU/+p/9U++C7y98Q4J0n/1v/on3/He3viGBCn/6n/1T77LvL3xDgnS/9U/9U++C769+Q4JSr/6X/2T75/e3viHBCle/W/9SffQd7e/IcE+tU/+a/+6XfqX39v/kOCg1//L/6rd+p3tL39Dwn0q3/yX/2T7+zv+B5f0K/90//qnXpH+/vfnv4kQ/6d/+o/6l383vb3P6EQ9E//o3/qnXnve3vfKMR/9E/9o37q/efvf7cQ05/8R/vU+/a9/b0w2T+n6H/6rfeo/4/e+mifzR+u//qXfqa/6/e+mibwjX//nv/on//Xvb5NE/nj9n/9VP/U+9ftbJoq8/fN/9U+903/1+5NFfub1f/on//Xvv20mibz1i/8rf+r98vuTJBHw/S/+V/7Ue/o70yQh8M4v/t8/+k6+n5wkqo+d/+K/6qd+W7+fTBIz4ee/+F/9U+/t7y+ThMA//8U/1U79Pnp/myQi/8QX/+e/+iffl+8vk0Ts9EV/sB/fT5Z8hL/6L/6P/k7/PjZJWPrR/+h/9E/8Hno/W/IR/ut/+l/9k//pP7FJKPrhP/qnv/on/yPft0kS/vEf/9O/f+S7+hNJ+pT//J//039Xv5dMkjz5T//5P/1n+q/sJUkS/POf/NP/1H8tX0smCYL+8Z/+c3/6v7efTCYJkv75T//5P/t/+o+sS0IJ4D/95/+0/wP+/W8bkgBCgUAgEAgEAoFAIBAIBAKBQCAQCAQCgUAgEAgEAoFAIBAIBN6Z/wH807l00G+o/wAAAABJRU5ErkJggg==";
export const STATS_LOGO_BASE64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAbFBMVEX///9a3f+I5/+38/+P6P+Y6v+r7v/U9f/c+f+s7/+h7P/x+//6/v+Z6//E9P/O9v9E2f/4/f9S3P8+2f+J5/9h4P+98v/s+v/I8/+g6//h+v+L5//W9/9p4f+A5f+c6/8e1f8A0v9jS2l/AAADUUlEQVR4nO3bC3KqQBiG4YxgjIAKiohgRfP/X3GiTjq1gYMMzNprrU/VpqBTOucm5wQEAAAAAAAAAAAAAAAAAAAAAAACA7+Pj9p2N8w6iVf6M9X4e+z2hT8Tj8Xj87Gv8iR/61+e0hQ7D4b/2m7+xW2/YhJ+w2f42MvP/7Sbt8Lg/9vYFv6+t/3P8xS/Uv+N80r/2M3qB9/rZl+h1/rT16A5+q/1c+28j3+s/oW/4Xf+i+/A9/lD7S9+B+/L72l74DX2r/aXv0C/aj6f3a3/Xv/6F+n/tM30vfv98m77Tvy4f5W98l363/aXvxF+U3/I2vs3+0vfid/m72lb6Tvy4/JW/8Uf0X20vflP8lP8T2l/6jv9r+a1/jL+3/rS9+x35Q/spfmF/aXvye+0X5K3+N/0t781vtl5O3+iP6d33o/vE9v46+/4v+W33o/vE9v9I26/9J//I+9P68/19pfXgffr/l3+eWf+/469P88v2P/l8fXj/9gVf9V3x+XfXj+9Bv9+wH+nB93Tz/V/vQ+fQ5/zY8n/T4f9f7Q/c+b368v3T/l9an7f368vnT/l9an7+9Pf/156f+V1qf360//8o+l/1dan94P//oPp/9W+p+n95O/+kdT/qu0P30X/+ifT/qv0v31f/+m+p+l/1f6n7/pD+g/m/5b6f/1U/oP5v+W+l+n+l/+o/yP095X+x/2g/mP5f63+d/vR+6n/X/V8AAAAAAAAAAAAAAAAAAAAAAAAAAIAv79L+/lC4x4/aX/a/l5QAAAAAAAAAAAAAAAAAAAAAAAAAAAIDf4n91/xP8s/R/4n95//4u/c/iV/rX3uU+/e/8vVf/q5/e/d/b//8F/w9/9y/x579Gf/P3/aVfe/ef+a+j/rZfSj+l70p/qf2l9FP6r/WXtq/0l9pfaT+l/1r7S+ml9F/rL21f6a+0v9J+0v9q+0vpZ/S/1l/avtL6af0v9Ze2r/S32l/pP2l/tf2l9NP6f+svbV/pb7S/0n7S/2r7S+mn9L/WX9q+0t9pfaT9pf7X9pfST+m/rL21/SWAAAACAY/UAAAAAAADwjwv+B7iQeJ8YnO+JAAAAAElFTkSuQmCC";

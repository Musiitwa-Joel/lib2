export interface Module {
  id: string;
  name: string;
  icon: string;
  description: string;
  path: string;
  color: string;
}

export interface User {
  id: string;
  name: string;
  role: 'librarian' | 'assistant' | 'student';
  email: string;
}
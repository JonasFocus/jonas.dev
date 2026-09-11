export type RequestStatus =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'closed'
  | 'spam';
export type RequestRecord = {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string | null;
  service: string;
  description: string;
  budget: string | null;
  timeline: string | null;
  case_study: string | null;
  status: RequestStatus;
  read_at: string | null;
  customer_id: string | null;
};
export type CustomerRecord = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  status: 'active' | 'inactive';
  created_at: string;
};
export type NoteRecord = {
  id: string;
  request_id: string;
  body: string;
  created_at: string;
};
export type ActivityRecord = {
  id: string;
  request_id: string;
  action: string;
  created_at: string;
};
export type FollowUpRecord = {
  id: string;
  request_id: string;
  title: string;
  due_at: string;
  completed_at: string | null;
  created_at: string;
};

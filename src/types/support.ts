export type IssueType =
  | 'Missing item'
  | 'Damaged item'
  | 'Stain'
  | 'Wrong item'
  | 'Late delivery'
  | 'Payment issue'
  | 'Other';

export interface Complaint {
  id: string;
  ticketNumber: string;
  userId: string;
  orderId: string;
  issueType: IssueType;
  description: string;
  images?: string[];
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  resolutionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

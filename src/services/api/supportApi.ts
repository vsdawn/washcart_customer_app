import ENV from '../../config/env';
import apiClient from './apiClient';
import { Complaint, FAQItem, IssueType } from '../../types/support';
import { MOCK_FAQS } from '../../mocks/faqs';

export interface CreateComplaintInput {
  orderId: string;
  issueType: IssueType;
  description: string;
  images?: string[];
}

export const supportApi = {
  async getFAQs(): Promise<FAQItem[]> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 300));
      return MOCK_FAQS;
    }
    return apiClient.get<FAQItem[]>('/support/faqs');
  },

  async createComplaint(input: CreateComplaintInput): Promise<Complaint> {
    if (ENV.USE_MOCK_API) {
      await new Promise<void>(res => setTimeout(res, 800));
      const ticketNum = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
      return {
        id: `cmp_${Date.now()}`,
        ticketNumber: ticketNum,
        userId: 'usr_101',
        orderId: input.orderId,
        issueType: input.issueType,
        description: input.description,
        images: input.images,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
    return apiClient.post<Complaint>('/support/complaint', input);
  },
};

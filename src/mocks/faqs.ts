import { FAQItem } from '../types/support';

export const MOCK_FAQS: FAQItem[] = [
  {
    id: 'faq_1',
    category: 'Ordering & Slots',
    question: 'How do I schedule a laundry pickup?',
    answer: 'Select your required services, add items to cart, choose your preferred pickup address and date/time slot, and complete checkout. Our valet will arrive during your selected window.',
  },
  {
    id: 'faq_2',
    category: 'Ordering & Slots',
    question: 'What is the minimum order value?',
    answer: 'The minimum order value for doorstep pickup is ₹199. Orders above ₹499 qualify for FREE pickup and delivery.',
  },
  {
    id: 'faq_3',
    category: 'Garment Care & Quality',
    question: 'How are my clothes washed and handled?',
    answer: 'Every order is inspected and tagged at our facility. Clothes are sorted by color, fabric type, and care label instructions before undergoing hypoallergenic washing or eco dry cleaning.',
  },
  {
    id: 'faq_4',
    category: 'Garment Care & Quality',
    question: 'What happens if a garment gets damaged or lost?',
    answer: 'We have a stringent Quality Check process. In the rare event of damage or missing items, you can raise a complaint within 48 hours of delivery for full investigation and compensation as per terms.',
  },
  {
    id: 'faq_5',
    category: 'Payments & Subscriptions',
    question: 'What payment options are supported?',
    answer: 'We accept UPI (GPay, PhonePe, Paytm), Credit & Debit Cards, Net Banking, Mobile Wallets, and Cash on Delivery (COD).',
  },
];

export interface ReferralInfo {
  referralCode: string;
  shareUrl: string;
  referrerReward: number; // e.g. 100 INR
  refereeReward: number; // e.g. 100 INR
  totalEarned: number;
  successfulReferralsCount: number;
  referralHistory: {
    id: string;
    refereeName: string;
    status: 'COMPLETED' | 'PENDING';
    rewardAmount: number;
    date: string;
  }[];
}

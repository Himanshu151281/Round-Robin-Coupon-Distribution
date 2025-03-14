
export interface Coupon {
  id: string;
  code: string;
  description: string;
  isActive: boolean;
  isRedeemed: boolean;
  redeemedAt?: string;
  redeemedBy?: UserInfo;
  createdAt: string;
  updatedAt: string;
}

export interface UserInfo {
  ip: string;
  fingerprint: string;
  timestamp: string;
}

export interface ClaimHistory {
  id: string;
  couponId: string;
  couponCode: string;
  userInfo: UserInfo;
  claimedAt: string;
}

export interface AdminCredentials {
  username: string;
  password: string;
}

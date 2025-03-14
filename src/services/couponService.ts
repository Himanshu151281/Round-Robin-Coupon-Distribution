
import { v4 as uuidv4 } from 'uuid';
import { Coupon, UserInfo, ClaimHistory } from '@/types';

// Mock data stored in localStorage
const COUPONS_KEY = 'coupons';
const CLAIMS_KEY = 'claims';
const ADMIN_KEY = 'admin_credentials';
const COOLDOWN_PERIOD = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// Initialize localStorage with default data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(COUPONS_KEY)) {
    const defaultCoupons: Coupon[] = [
      {
        id: uuidv4(),
        code: 'WELCOME10',
        description: '10% off your first purchase',
        isActive: true,
        isRedeemed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        code: 'SPRING25',
        description: '25% off spring collection',
        isActive: true,
        isRedeemed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: uuidv4(),
        code: 'FREESHIP',
        description: 'Free shipping on orders over $50',
        isActive: true,
        isRedeemed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
    localStorage.setItem(COUPONS_KEY, JSON.stringify(defaultCoupons));
  }

  if (!localStorage.getItem(CLAIMS_KEY)) {
    localStorage.setItem(CLAIMS_KEY, JSON.stringify([]));
  }

  if (!localStorage.getItem(ADMIN_KEY)) {
    const defaultAdmin = {
      username: 'admin',
      password: 'admin123' // In a real app, this would be hashed
    };
    localStorage.setItem(ADMIN_KEY, JSON.stringify(defaultAdmin));
  }
};

// Get all coupons
export const getAllCoupons = (): Coupon[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(COUPONS_KEY) || '[]');
};

// Get all active coupons
export const getActiveCoupons = (): Coupon[] => {
  return getAllCoupons().filter(coupon => coupon.isActive && !coupon.isRedeemed);
};

// Get next available coupon (round-robin)
export const getNextAvailableCoupon = (): Coupon | null => {
  const activeCoupons = getActiveCoupons();
  return activeCoupons.length > 0 ? activeCoupons[0] : null;
};

// Add a new coupon
export const addCoupon = (couponData: Omit<Coupon, 'id' | 'createdAt' | 'updatedAt' | 'isRedeemed'>): Coupon => {
  const coupons = getAllCoupons();
  const newCoupon: Coupon = {
    ...couponData,
    id: uuidv4(),
    isRedeemed: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  coupons.push(newCoupon);
  localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
  return newCoupon;
};

// Update coupon
export const updateCoupon = (id: string, couponData: Partial<Coupon>): Coupon | null => {
  const coupons = getAllCoupons();
  const index = coupons.findIndex(c => c.id === id);
  
  if (index === -1) return null;
  
  coupons[index] = {
    ...coupons[index],
    ...couponData,
    updatedAt: new Date().toISOString()
  };
  
  localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
  return coupons[index];
};

// Toggle coupon status
export const toggleCouponStatus = (id: string): Coupon | null => {
  const coupons = getAllCoupons();
  const index = coupons.findIndex(c => c.id === id);
  
  if (index === -1) return null;
  
  coupons[index].isActive = !coupons[index].isActive;
  coupons[index].updatedAt = new Date().toISOString();
  
  localStorage.setItem(COUPONS_KEY, JSON.stringify(coupons));
  return coupons[index];
};

// Claim a coupon
export const claimCoupon = (userInfo: UserInfo): { success: boolean; coupon?: Coupon; message: string } => {
  // Check if user has claimed within cooldown period
  const claims: ClaimHistory[] = JSON.parse(localStorage.getItem(CLAIMS_KEY) || '[]');
  const userClaims = claims.filter(
    claim => 
      (claim.userInfo.ip === userInfo.ip || claim.userInfo.fingerprint === userInfo.fingerprint)
  );
  
  if (userClaims.length > 0) {
    const latestClaim = userClaims.sort((a, b) => 
      new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime()
    )[0];
    
    const timeSinceLastClaim = new Date().getTime() - new Date(latestClaim.claimedAt).getTime();
    
    if (timeSinceLastClaim < COOLDOWN_PERIOD) {
      const hoursRemaining = Math.ceil((COOLDOWN_PERIOD - timeSinceLastClaim) / (1000 * 60 * 60));
      return { 
        success: false, 
        message: `You've already claimed a coupon. Please try again in ${hoursRemaining} hours.` 
      };
    }
  }
  
  // Get next available coupon
  const nextCoupon = getNextAvailableCoupon();
  if (!nextCoupon) {
    return { success: false, message: 'No coupons available at this time.' };
  }
  
  // Mark coupon as redeemed
  const updatedCoupon = updateCoupon(nextCoupon.id, { 
    isRedeemed: true,
    redeemedAt: new Date().toISOString(),
    redeemedBy: userInfo
  });
  
  if (!updatedCoupon) {
    return { success: false, message: 'Error claiming coupon. Please try again.' };
  }
  
  // Record claim history
  const newClaim: ClaimHistory = {
    id: uuidv4(),
    couponId: updatedCoupon.id,
    couponCode: updatedCoupon.code,
    userInfo,
    claimedAt: new Date().toISOString()
  };
  
  claims.push(newClaim);
  localStorage.setItem(CLAIMS_KEY, JSON.stringify(claims));
  
  return { 
    success: true, 
    coupon: updatedCoupon, 
    message: `Congratulations! Your coupon code is: ${updatedCoupon.code}` 
  };
};

// Get all claim history
export const getClaimHistory = (): ClaimHistory[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(CLAIMS_KEY) || '[]');
};

// Admin authentication
export const adminLogin = (username: string, password: string): boolean => {
  initializeStorage();
  const adminCredentials = JSON.parse(localStorage.getItem(ADMIN_KEY) || '{}');
  return adminCredentials.username === username && adminCredentials.password === password;
};

// Generate a fingerprint based on browser information
export const generateFingerprint = (): string => {
  const userAgent = navigator.userAgent;
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const colorDepth = window.screen.colorDepth;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Create a simple fingerprint from available browser information
  const fingerprintSource = `${userAgent}|${screenWidth}x${screenHeight}|${colorDepth}|${timezone}`;
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < fingerprintSource.length; i++) {
    const char = fingerprintSource.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return hash.toString(16); // Convert to hex string
};

// Get user IP (Note: In a real app, this would be done server-side)
export const getUserIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP:', error);
    return 'unknown';
  }
};

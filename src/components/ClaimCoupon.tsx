
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Ticket, Clock, Check } from 'lucide-react';
import { claimCoupon, getUserIP, generateFingerprint } from '@/services/couponService';
import { UserInfo } from '@/types';

const ClaimCoupon = () => {
  const [loading, setLoading] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [claimedCode, setClaimedCode] = useState('');
  const [message, setMessage] = useState('');

  const handleClaimCoupon = async () => {
    setLoading(true);
    try {
      const ip = await getUserIP();
      const fingerprint = generateFingerprint();
      
      const userInfo: UserInfo = {
        ip,
        fingerprint,
        timestamp: new Date().toISOString()
      };
      
      const result = await claimCoupon(userInfo);
      
      if (result.success && result.coupon) {
        setClaimed(true);
        setClaimedCode(result.coupon.code);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      
      setMessage(result.message);
    } catch (error) {
      console.error('Error claiming coupon:', error);
      toast.error('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 bg-coupon-100 p-3 rounded-full">
          <Ticket className="h-8 w-8 text-coupon-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Get Your Coupon</CardTitle>
        <CardDescription>
          Claim your exclusive coupon code for special discounts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : claimed ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
            <Check className="h-6 w-6 text-green-500 mx-auto mb-2" />
            <p className="font-medium text-green-800">Coupon Claimed!</p>
            <p className="mt-1 text-green-700 text-sm">{message}</p>
            <div className="mt-3 bg-white border border-green-300 rounded py-2 px-4 font-mono font-bold text-lg tracking-wider text-center">
              {claimedCode}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-4">
              Click the button below to get your unique coupon code. Each user can claim one coupon per day.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleClaimCoupon} 
          className="w-full" 
          disabled={loading || claimed}
          variant={claimed ? "outline" : "default"}
        >
          {loading ? (
            <>
              <Clock className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : claimed ? (
            "Already Claimed"
          ) : (
            "Claim Your Coupon"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ClaimCoupon;

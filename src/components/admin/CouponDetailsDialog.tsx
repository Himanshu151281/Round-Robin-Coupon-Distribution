
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, MapPin, Activity } from 'lucide-react';
import { Coupon } from '@/types';
import { format } from 'date-fns';

interface CouponDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  coupon: Coupon | null;
}

const CouponDetailsDialog: React.FC<CouponDetailsDialogProps> = ({
  open,
  onClose,
  coupon,
}) => {
  if (!coupon) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Coupon Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">{coupon.code}</h3>
            <Badge variant={coupon.isActive ? "default" : "outline"} className={coupon.isActive ? "bg-green-500" : ""}>
              {coupon.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground">{coupon.description}</p>
          
          <Separator />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground flex items-center">
                <Calendar className="h-3 w-3 mr-1" />
                Created
              </div>
              <div className="text-sm">
                {format(new Date(coupon.createdAt), 'PPP')}
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Last Updated
              </div>
              <div className="text-sm">
                {format(new Date(coupon.updatedAt), 'PPP')}
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-1" />
              Redemption Status
            </h4>
            
            {coupon.isRedeemed ? (
              <div className="bg-yellow-50 rounded-md p-3 space-y-3">
                <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
                  Redeemed
                </Badge>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Redeemed At
                    </div>
                    <div>
                      {coupon.redeemedAt ? format(new Date(coupon.redeemedAt), 'PPP p') : 'N/A'}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      IP Address
                    </div>
                    <div className="font-mono text-xs">
                      {coupon.redeemedBy?.ip || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 rounded-md p-3">
                <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                  Available
                </Badge>
                <p className="text-sm mt-2 text-green-700">
                  This coupon has not been redeemed yet.
                </p>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CouponDetailsDialog;

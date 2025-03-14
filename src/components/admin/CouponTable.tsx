
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, ToggleLeft, ToggleRight, Edit, Eye } from 'lucide-react';
import { Coupon } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface CouponTableProps {
  coupons: Coupon[];
  onToggleStatus: (id: string) => void;
  onEditCoupon: (coupon: Coupon) => void;
  onViewDetails: (coupon: Coupon) => void;
}

const CouponTable: React.FC<CouponTableProps> = ({
  coupons,
  onToggleStatus,
  onEditCoupon,
  onViewDetails,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Redeemed</TableHead>
            <TableHead className="w-[120px]">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {coupons.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No coupons found
              </TableCell>
            </TableRow>
          ) : (
            coupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-medium">{coupon.code}</TableCell>
                <TableCell>{coupon.description}</TableCell>
                <TableCell>
                  {coupon.isActive ? (
                    <Badge variant="default" className="bg-green-500">Active</Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {coupon.isRedeemed ? (
                    <Badge variant="outline" className="text-yellow-500 border-yellow-200 bg-yellow-50">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Redeemed
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">
                      <XCircle className="mr-1 h-3 w-3" />
                      Available
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(coupon.createdAt), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onViewDetails(coupon)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditCoupon(coupon)}
                      disabled={coupon.isRedeemed}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onToggleStatus(coupon.id)}
                      disabled={coupon.isRedeemed}
                    >
                      {coupon.isActive ? (
                        <ToggleRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ToggleLeft className="h-4 w-4 text-gray-500" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CouponTable;

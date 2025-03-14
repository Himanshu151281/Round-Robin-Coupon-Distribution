
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ClaimHistory } from '@/types';
import { formatDistanceToNow } from 'date-fns';

interface ClaimHistoryTableProps {
  claims: ClaimHistory[];
}

const ClaimHistoryTable: React.FC<ClaimHistoryTableProps> = ({ claims }) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Coupon Code</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Fingerprint</TableHead>
            <TableHead className="w-[160px]">Claimed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {claims.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                No claim history found
              </TableCell>
            </TableRow>
          ) : (
            claims.map((claim) => (
              <TableRow key={claim.id}>
                <TableCell className="font-medium">
                  <Badge variant="outline" className="bg-coupon-100 text-coupon-700 border-coupon-200">
                    {claim.couponCode}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {claim.userInfo.ip}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground max-w-[200px] truncate">
                  {claim.userInfo.fingerprint}
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(claim.claimedAt), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ClaimHistoryTable;

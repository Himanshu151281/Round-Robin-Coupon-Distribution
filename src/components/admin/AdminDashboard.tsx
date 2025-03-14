
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Ticket, Users, Info } from 'lucide-react';
import { toast } from 'sonner';
import CouponTable from './CouponTable';
import ClaimHistoryTable from './ClaimHistoryTable';
import AddCouponForm from './AddCouponForm';
import CouponDetailsDialog from './CouponDetailsDialog';
import { getAllCoupons, getClaimHistory, toggleCouponStatus } from '@/services/couponService';
import { Coupon, ClaimHistory } from '@/types';

const AdminDashboard: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [claims, setClaims] = useState<ClaimHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [addCouponOpen, setAddCouponOpen] = useState(false);
  const [editCoupon, setEditCoupon] = useState<Coupon | null>(null);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const loadData = () => {
    setLoading(true);
    try {
      const couponData = getAllCoupons();
      const claimData = getClaimHistory();
      
      setCoupons(couponData);
      setClaims(claimData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleStatus = (id: string) => {
    try {
      const updatedCoupon = toggleCouponStatus(id);
      if (updatedCoupon) {
        setCoupons(coupons.map(c => (c.id === id ? updatedCoupon : c)));
        toast.success(`Coupon ${updatedCoupon.isActive ? 'activated' : 'deactivated'}`);
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      toast.error('Failed to update coupon status');
    }
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditCoupon(coupon);
    setAddCouponOpen(true);
  };

  const handleViewDetails = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setDetailsOpen(true);
  };

  const handleAddCoupon = () => {
    setEditCoupon(null);
    setAddCouponOpen(true);
  };

  const handleFormSuccess = () => {
    loadData();
  };

  const activeCoupons = coupons.filter(c => c.isActive && !c.isRedeemed).length;
  const redeemedCoupons = coupons.filter(c => c.isRedeemed).length;
  const inactiveCoupons = coupons.filter(c => !c.isActive).length;

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage coupons and view claim history
          </p>
        </div>
        <Button onClick={handleAddCoupon}>
          <Plus className="mr-2 h-4 w-4" />
          Add Coupon
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCoupons}</div>
            <p className="text-xs text-muted-foreground">
              Available for users to claim
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redeemed Coupons</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{redeemedCoupons}</div>
            <p className="text-xs text-muted-foreground">
              Total coupons claimed by users
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive Coupons</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveCoupons}</div>
            <p className="text-xs text-muted-foreground">
              Disabled or expired coupons
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="coupons" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="claims">Claim History</TabsTrigger>
        </TabsList>
        <TabsContent value="coupons" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Coupon Management</CardTitle>
              <CardDescription>
                View and manage your coupons. Toggle active status or edit coupon details.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CouponTable
                coupons={coupons}
                onToggleStatus={handleToggleStatus}
                onEditCoupon={handleEditCoupon}
                onViewDetails={handleViewDetails}
              />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="claims" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Claim History</CardTitle>
              <CardDescription>
                View all coupon claims with user information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClaimHistoryTable claims={claims} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddCouponForm
        open={addCouponOpen}
        onClose={() => setAddCouponOpen(false)}
        onSuccess={handleFormSuccess}
        editCoupon={editCoupon}
      />

      <CouponDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        coupon={selectedCoupon}
      />
    </div>
  );
};

export default AdminDashboard;

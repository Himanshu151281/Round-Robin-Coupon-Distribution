
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Coupon } from '@/types';
import { addCoupon, updateCoupon } from '@/services/couponService';

interface AddCouponFormProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editCoupon?: Coupon | null;
}

const AddCouponForm: React.FC<AddCouponFormProps> = ({
  open,
  onClose,
  onSuccess,
  editCoupon,
}) => {
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  // Reset form when modal opens or editCoupon changes
  useEffect(() => {
    if (editCoupon) {
      setCode(editCoupon.code);
      setDescription(editCoupon.description);
      setIsActive(editCoupon.isActive);
    } else {
      setCode('');
      setDescription('');
      setIsActive(true);
    }
  }, [editCoupon, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (code.trim() === '' || description.trim() === '') {
        toast.error('Please fill in all fields');
        return;
      }

      if (editCoupon) {
        // Update existing coupon
        await updateCoupon(editCoupon.id, {
          code,
          description,
          isActive,
        });
        toast.success('Coupon updated successfully');
      } else {
        // Add new coupon
        await addCoupon({
          code,
          description,
          isActive,
        });
        toast.success('Coupon added successfully');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving coupon:', error);
      toast.error('An error occurred while saving the coupon');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{editCoupon ? 'Edit Coupon' : 'Add New Coupon'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="code">Coupon Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. SUMMER20"
                disabled={loading}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. 20% off summer collection"
                rows={3}
                disabled={loading}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={isActive}
                onCheckedChange={setIsActive}
                disabled={loading}
              />
              <Label htmlFor="active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : editCoupon ? 'Update' : 'Add Coupon'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCouponForm;

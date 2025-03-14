
import React from 'react';
import { Link } from 'react-router-dom';
import ClaimCoupon from '@/components/ClaimCoupon';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-coupon-700">Coupon Carousel</h1>
          <Link to="/admin">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Shield className="h-4 w-4" />
              Admin
            </Button>
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-coupon-900 mb-4">
            Get Your Exclusive Coupon
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Claim a special discount coupon for your next purchase. Each user can claim one coupon every 24 hours.
          </p>
          
          <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
            <ClaimCoupon />
          </div>
        </div>
        
        <div className="max-w-2xl mx-auto mt-16 grid gap-8 md:grid-cols-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-coupon-700">How It Works</h3>
            <p className="text-gray-600">
              Our system automatically assigns you the next available coupon in our carousel. Each coupon can only be claimed once, and we ensure fair distribution to all users.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2 text-coupon-700">Coupon Terms</h3>
            <p className="text-gray-600">
              Coupons are valid for 30 days from the date of claiming. One coupon per customer per purchase. Cannot be combined with other offers.
            </p>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-6 py-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Coupon Carousel. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

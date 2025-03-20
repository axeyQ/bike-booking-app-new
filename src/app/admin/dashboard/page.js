'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAnalytics } from '@/hooks/use-analytics';
import { useWeekSummary } from '@/hooks/use-analytics';
import { useBookings } from '@/hooks/use-bookings';
import { useBikes } from '@/hooks/use-bikes';
import { useUsers } from '@/hooks/use-users';
import { formatPrice, formatDate } from '@/lib/utils';
import { BOOKING_STATUSES } from '@/lib/constants';
import { Loader } from '@/components/ui/loader';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

import {
  Users,
  Bike,
  CalendarClock,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
} from 'lucide-react';

export default function AdminDashboard() {
  const summary = useWeekSummary();
  const { allBookings } = useBookings();
  const { allBikes } = useBikes();
  const { allUsers } = useUsers();
  const { calculateDailyAnalytics } = useAnalytics();
  
  // Calculate metrics
  const totalBikes = allBikes?.length || 0;
  const activeBikes = allBikes?.filter(bike => bike.isAvailable).length || 0;
  const totalCustomers = allUsers?.length || 0;
  
  // Get recent bookings
  const recentBookings = allBookings 
    ? [...allBookings]
        .sort((a, b) => b.createdAt - a.createdAt)
        .slice(0, 5)
    : [];
  
  // Count bookings by status
  const bookingsByStatus = allBookings 
    ? Object.entries(
        allBookings.reduce((acc, booking) => {
          acc[booking.status] = (acc[booking.status] || 0) + 1;
          return acc;
        }, {})
      ).map(([status, count]) => ({ status, count }))
    : [];
  
  // Placeholder data for charts
  const revenueData = [
    { name: 'Mon', revenue: 1200 },
    { name: 'Tue', revenue: 1800 },
    { name: 'Wed', revenue: 1400 },
    { name: 'Thu', revenue: 2200 },
    { name: 'Fri', revenue: 2600 },
    { name: 'Sat', revenue: 3200 },
    { name: 'Sun', revenue: 2800 },
  ];
  
  const bookingData = [
    { name: 'Mountain', value: 35 },
    { name: 'Road', value: 25 },
    { name: 'City', value: 20 },
    { name: 'Hybrid', value: 15 },
    { name: 'Electric', value: 5 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  // Calculate analytics for today - this would typically run on a schedule
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    
    const updateAnalytics = async () => {
      try {
        await calculateDailyAnalytics({ date: today });
      } catch (error) {
        console.error('Failed to update analytics:', error);
      }
    };
    
    updateAnalytics();
  }, [calculateDailyAnalytics]);
  
  if (!allBookings || !allBikes || !allUsers) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="lg" className="text-blue-600" />
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="mt-4 md:mt-0 flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {formatDate(new Date(), 'PPP')}
          </span>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1">{formatPrice(summary?.totalRevenue || 0)}</h3>
              <p className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +12.5% from last week
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Bookings</p>
              <h3 className="text-2xl font-bold mt-1">{summary?.totalBookings || allBookings.length}</h3>
              <p className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +4.2% from last week
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CalendarClock className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Bikes</p>
              <h3 className="text-2xl font-bold mt-1">{activeBikes}/{totalBikes}</h3>
              <p className="text-xs text-yellow-500 flex items-center mt-1">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {((activeBikes / totalBikes) * 100).toFixed(1)}% availability
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-yellow-100 flex items-center justify-center">
              <Bike className="h-6 w-6 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Customers</p>
              <h3 className="text-2xl font-bold mt-1">{totalCustomers}</h3>
              <p className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2 new this week
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts and Tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Weekly Revenue</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} />
                  <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Booking by Bike Type */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Bookings by Bike Type</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {bookingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Bookings']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Bookings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Bookings</CardTitle>
            <Link href="/admin/bookings">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Booking ID</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Customer</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Bike</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Amount</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.length > 0 ? (
                  recentBookings.map((booking) => (
                    <tr key={booking._id} className="border-b">
                      <td className="px-4 py-3 text-sm">{booking._id.slice(-6)}</td>
                      <td className="px-4 py-3 text-sm">{booking.userId.slice(-6)}</td>
                      <td className="px-4 py-3 text-sm">{booking.bikeId.slice(-6)}</td>
                      <td className="px-4 py-3 text-sm">{formatDate(booking.createdAt)}</td>
                      <td className="px-4 py-3 text-sm">{formatPrice(booking.totalPrice)}</td>
                      <td className="px-4 py-3 text-sm">
                        <Badge
                          variant="outline"
                          className={BOOKING_STATUSES[booking.status]?.color}
                        >
                          {BOOKING_STATUSES[booking.status]?.label || booking.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-5 text-center text-sm text-gray-500">
                      No recent bookings
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
      
      {/* Booking Status Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Booking Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-2">
              <div className="flex items-center gap-2 p-4 border rounded-lg">
                <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending</p>
                  <p className="text-xl font-bold">
                    {bookingsByStatus.find(b => b.status === 'pending')?.count || 0}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-4 border rounded-lg">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Confirmed</p>
                  <p className="text-xl font-bold">
                    {bookingsByStatus.find(b => b.status === 'confirmed')?.count || 0}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-4 border rounded-lg">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-xl font-bold">
                    {bookingsByStatus.find(b => b.status === 'completed')?.count || 0}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 p-4 border rounded-lg">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Cancelled</p>
                  <p className="text-xl font-bold">
                    {bookingsByStatus.find(b => b.status === 'cancelled')?.count || 0}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 grid-cols-1">
              <Link href="/admin/bikes/add">
                <Button className="w-full justify-start" size="lg">
                  <Bike className="mr-2 h-5 w-5" /> Add New Bike
                </Button>
              </Link>
              
              <Link href="/admin/bookings">
                <Button className="w-full justify-start" variant="outline" size="lg">
                  <CalendarClock className="mr-2 h-5 w-5" /> Manage Bookings
                </Button>
              </Link>
              
              <Link href="/admin/reports">
                <Button className="w-full justify-start" variant="outline" size="lg">
                  <BarChart className="mr-2 h-5 w-5" /> View Reports
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
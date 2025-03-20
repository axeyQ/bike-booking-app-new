'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader } from '@/components/ui/loader';
import { useBookings } from '@/hooks/use-bookings';
import { useBikes } from '@/hooks/use-bikes';
import { formatDate, formatPrice } from '@/lib/utils';
import { BOOKING_STATUSES, BIKE_TYPES, REPORT_PERIODS } from '@/lib/constants';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  Calendar,
  Download,
  TrendingUp,
  ArrowRight,
  ArrowDown,
  CreditCard,
  Bike,
  Users,
  CalendarClock,
} from 'lucide-react';

export default function AdminReportsPage() {
  const { allBookings } = useBookings();
  const { allBikes } = useBikes();
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  
  // Set default date range when component mounts
  useEffect(() => {
    const now = new Date();
    const end = now.toISOString().split('T')[0];
    
    let start;
    if (dateRange === 'week') {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 7);
      start = weekAgo.toISOString().split('T')[0];
    } else if (dateRange === 'month') {
      const monthAgo = new Date(now);
      monthAgo.setDate(now.getDate() - 30);
      start = monthAgo.toISOString().split('T')[0];
    } else if (dateRange === 'quarter') {
      const quarterAgo = new Date(now);
      quarterAgo.setDate(now.getDate() - 90);
      start = quarterAgo.toISOString().split('T')[0];
    } else if (dateRange === 'year') {
      const yearAgo = new Date(now);
      yearAgo.setDate(now.getDate() - 365);
      start = yearAgo.toISOString().split('T')[0];
    }
    
    setStartDate(start);
    setEndDate(end);
  }, [dateRange]);
  
  // Process data to generate reports when dependencies change
  useEffect(() => {
    if (!allBookings || !allBikes || !startDate || !endDate) return;
    
    const startTimestamp = new Date(startDate).getTime();
    const endTimestamp = new Date(endDate + 'T23:59:59').getTime();
    
    // Filter bookings in the date range
    const filteredBookings = allBookings.filter(booking => {
      return booking.createdAt >= startTimestamp && booking.createdAt <= endTimestamp;
    });
    
    // Revenue metrics
    const totalRevenue = filteredBookings.reduce((sum, booking) => sum + booking.totalPrice, 0);
    const confirmedRevenue = filteredBookings
      .filter(booking => booking.status === 'confirmed' || booking.status === 'completed')
      .reduce((sum, booking) => sum + booking.totalPrice, 0);
    const cancelledRevenue = filteredBookings
      .filter(booking => booking.status === 'cancelled')
      .reduce((sum, booking) => sum + booking.totalPrice, 0);
    
    // Booking metrics
    const totalBookings = filteredBookings.length;
    const bookingsByStatus = {};
    
    Object.keys(BOOKING_STATUSES).forEach(status => {
      bookingsByStatus[status] = filteredBookings.filter(booking => booking.status === status).length;
    });
    
    // Calculate revenue by day
    const revenueByDay = {};
    filteredBookings.forEach(booking => {
      const date = new Date(booking.createdAt).toISOString().split('T')[0];
      revenueByDay[date] = (revenueByDay[date] || 0) + booking.totalPrice;
    });
    
    const revenueChartData = Object.entries(revenueByDay)
      .map(([date, revenue]) => ({
        date,
        revenue,
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // Calculate bookings by bike type
    const bookingsByBikeType = {};
    
    filteredBookings.forEach(booking => {
      const bike = allBikes.find(bike => bike._id === booking.bikeId);
      if (bike) {
        bookingsByBikeType[bike.type] = (bookingsByBikeType[bike.type] || 0) + 1;
      }
    });
    
    const bikeTypeChartData = Object.entries(bookingsByBikeType)
      .map(([type, count]) => ({
        name: BIKE_TYPES.find(t => t.id === type)?.label || type,
        value: count,
      }));
    
    // Calculate bike utilization
    const bikeUtilization = allBikes.map(bike => {
      const bookings = filteredBookings.filter(booking => booking.bikeId === bike._id);
      return {
        name: bike.name,
        bookings: bookings.length,
        revenue: bookings.reduce((sum, booking) => sum + booking.totalPrice, 0),
      };
    }).sort((a, b) => b.bookings - a.bookings);
    
    // Bookings by day of week
    const bookingsByDay = Array(7).fill(0);
    filteredBookings.forEach(booking => {
      const day = new Date(booking.createdAt).getDay();
      bookingsByDay[day]++;
    });
    
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayChartData = bookingsByDay.map((count, index) => ({
      name: daysOfWeek[index],
      bookings: count,
    }));
    
    // Set combined report data
    setReportData({
      totalRevenue,
      confirmedRevenue,
      cancelledRevenue,
      totalBookings,
      bookingsByStatus,
      revenueChartData,
      bikeTypeChartData,
      bikeUtilization: bikeUtilization.slice(0, 5), // Top 5 bikes
      dayChartData,
    });
  }, [allBookings, allBikes, startDate, endDate]);
  
  // Handle date range change
  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };
  
  // Handle custom date range change
  const handleCustomDateChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startDate') {
      setStartDate(value);
    } else if (name === 'endDate') {
      setEndDate(value);
    }
  };
  
  // Export reports as CSV
  const exportCSV = () => {
    if (!reportData) return;
    
    // Revenue data
    const revenueRows = reportData.revenueChartData.map(item => 
      `${item.date},${item.revenue}`
    );
    
    const revenueCSV = `Date,Revenue\n${revenueRows.join('\n')}`;
    
    // Bike utilization data
    const utilizationRows = reportData.bikeUtilization.map(item => 
      `${item.name},${item.bookings},${item.revenue}`
    );
    
    const utilizationCSV = `Bike Name,Bookings,Revenue\n${utilizationRows.join('\n')}`;
    
    // Create download links
    const revenueBlob = new Blob([revenueCSV], { type: 'text/csv' });
    const utilizationBlob = new Blob([utilizationCSV], { type: 'text/csv' });
    
    const revenueURL = URL.createObjectURL(revenueBlob);
    const utilizationURL = URL.createObjectURL(utilizationBlob);
    
    // Create and click download links
    const revenueLink = document.createElement('a');
    revenueLink.href = revenueURL;
    revenueLink.download = `revenue_${startDate}_to_${endDate}.csv`;
    revenueLink.click();
    
    const utilizationLink = document.createElement('a');
    utilizationLink.href = utilizationURL;
    utilizationLink.download = `bike_utilization_${startDate}_to_${endDate}.csv`;
    utilizationLink.click();
  };
  
  // Custom colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  if (!allBookings || !allBikes) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="lg" className="text-blue-600" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <div className="mt-4 md:mt-0">
          <Button 
            variant="outline" 
            onClick={exportCSV}
            disabled={!reportData}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>
      
      {/* Date Range Selection */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-gray-500" />
              <span className="text-sm font-medium">Date Range:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {REPORT_PERIODS.map((period) => (
                <Button
                  key={period.id}
                  variant={dateRange === period.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleDateRangeChange(period.id)}
                >
                  {period.label}
                </Button>
              ))}
            </div>
            
            {dateRange === 'custom' && (
              <div className="flex flex-wrap gap-2 items-center">
                <input
                  type="date"
                  name="startDate"
                  value={startDate}
                  onChange={handleCustomDateChange}
                  className="rounded-md border border-gray-200 p-2"
                />
                <ArrowRight className="h-4 w-4 text-gray-500" />
                <input
                  type="date"
                  name="endDate"
                  value={endDate}
                  onChange={handleCustomDateChange}
                  className="rounded-md border border-gray-200 p-2"
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Revenue Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold mt-1">
                {reportData ? formatPrice(reportData.totalRevenue) : '-'}
              </h3>
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
              <h3 className="text-2xl font-bold mt-1">
                {reportData ? reportData.totalBookings : '-'}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CalendarClock className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6 flex flex-row items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Per Booking</p>
              <h3 className="text-2xl font-bold mt-1">
                {reportData && reportData.totalBookings > 0
                  ? formatPrice(reportData.totalRevenue / reportData.totalBookings)
                  : '-'}
              </h3>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Over Time */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Revenue Over Time</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              {reportData && reportData.revenueChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={reportData.revenueChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatPrice(value)} />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#3B82F6" 
                      fill="#93C5FD" 
                      name="Revenue" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-500">No data available for the selected date range</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Bookings by Bike Type */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Bookings by Bike Type</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              {reportData && reportData.bikeTypeChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={reportData.bikeTypeChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {reportData.bikeTypeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-500">No data available for the selected date range</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Booking Status Distribution */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Booking Status Distribution</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              {reportData && reportData.totalBookings > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={Object.entries(BOOKING_STATUSES).map(([key, { label }]) => ({
                      name: label,
                      value: reportData.bookingsByStatus[key] || 0,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" name="Bookings" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-500">No data available for the selected date range</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Bookings by Day of Week */}
        <Card>
          <CardHeader className="pb-0">
            <CardTitle>Bookings by Day of Week</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-80">
              {reportData && reportData.dayChartData.some(day => day.bookings > 0) ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={reportData.dayChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="bookings" name="Bookings" fill="#00C49F" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <p className="text-gray-500">No data available for the selected date range</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Top Bikes by Bookings */}
      <Card>
        <CardHeader>
          <CardTitle>Top Bikes by Utilization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Bike Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Bookings</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Revenue</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Utilization</th>
                </tr>
              </thead>
              <tbody>
                {reportData && reportData.bikeUtilization.length > 0 ? (
                  reportData.bikeUtilization.map((bike, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-4 text-sm">{bike.name}</td>
                      <td className="px-4 py-4 text-sm">{bike.bookings}</td>
                      <td className="px-4 py-4 text-sm">{formatPrice(bike.revenue)}</td>
                      <td className="px-4 py-4 text-sm">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ 
                              width: `${Math.min(100, (bike.bookings / Math.max(...reportData.bikeUtilization.map(b => b.bookings))) * 100)}%` 
                            }}
                          ></div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                      No data available for the selected date range
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useBookings } from '@/hooks/use-bookings';
import { useBikes } from '@/hooks/use-bikes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';
import { BOOKING_STATUSES } from '@/lib/constants';
import { formatDate, formatPrice } from '@/lib/utils';
import { showSuccess, showError } from '@/lib/utils';
import {
  Search,
  Filter,
  Calendar,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';

export default function AdminBookingsPage() {
  const { allBookings, updateBookingStatus } = useBookings();
  const { allBikes } = useBikes();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate date ranges for filtering
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  const nextMonth = new Date(today);
  nextMonth.setDate(nextMonth.getDate() + 30);
  
  // Update filtered bookings when data or filters change
  useEffect(() => {
    if (!allBookings || !allBikes) return;
    
    let filtered = [...allBookings];
    
    // Apply search filter (search by bike or booking ID)
    if (searchTerm) {
      filtered = filtered.filter(booking => {
        const bookingIdMatch = booking._id.toLowerCase().includes(searchTerm.toLowerCase());
        
        // Find the bike to check its name
        const bike = allBikes.find(bike => bike._id === booking.bikeId);
        const bikeNameMatch = bike && bike.name.toLowerCase().includes(searchTerm.toLowerCase());
        
        return bookingIdMatch || bikeNameMatch;
      });
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const now = today.getTime();
      
      if (dateFilter === 'today') {
        filtered = filtered.filter(booking => 
          booking.startTime >= now && booking.startTime < tomorrow.getTime()
        );
      } else if (dateFilter === 'tomorrow') {
        filtered = filtered.filter(booking => 
          booking.startTime >= tomorrow.getTime() && booking.startTime < nextWeek.getTime()
        );
      } else if (dateFilter === 'week') {
        filtered = filtered.filter(booking => 
          booking.startTime >= now && booking.startTime < nextWeek.getTime()
        );
      } else if (dateFilter === 'month') {
        filtered = filtered.filter(booking => 
          booking.startTime >= now && booking.startTime < nextMonth.getTime()
        );
      } else if (dateFilter === 'past') {
        filtered = filtered.filter(booking => booking.endTime < now);
      } else if (dateFilter === 'future') {
        filtered = filtered.filter(booking => booking.startTime > now);
      }
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'createdAt') {
        comparison = a.createdAt - b.createdAt;
      } else if (sortField === 'startTime') {
        comparison = a.startTime - b.startTime;
      } else if (sortField === 'totalPrice') {
        comparison = a.totalPrice - b.totalPrice;
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredBookings(filtered);
  }, [allBookings, allBikes, searchTerm, statusFilter, dateFilter, sortField, sortDirection, today, tomorrow, nextWeek, nextMonth]);
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const handleStatusChange = async (bookingId, newStatus) => {
    setIsLoading(true);
    
    try {
      await updateBookingStatus({ bookingId, status: newStatus });
      showSuccess(`Booking status updated to ${BOOKING_STATUSES[newStatus].label}`);
    } catch (error) {
      showError('Failed to update booking status');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getSortIcon = (field) => {
    if (field !== sortField) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />;
  };
  
  const getBikeName = (bikeId) => {
    if (!allBikes) return 'Loading...';
    const bike = allBikes.find(bike => bike._id === bikeId);
    return bike ? bike.name : 'Unknown bike';
  };
  
  if (!allBookings || !allBikes) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="lg" className="text-blue-600" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Bookings</h1>
        <div className="mt-4 sm:mt-0">
          <span className="text-sm text-gray-500">
            {filteredBookings.length} bookings found
          </span>
        </div>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search bookings..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <select
                className="w-full rounded-md border border-gray-200 p-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                {Object.entries(BOOKING_STATUSES).map(([key, { label }]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                className="w-full rounded-md border border-gray-200 p-2"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Dates</option>
                <option value="today">Today</option>
                <option value="tomorrow">Tomorrow</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="past">Past Bookings</option>
                <option value="future">Future Bookings</option>
              </select>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateFilter('all');
              }}>
                <Filter className="mr-2 h-4 w-4" />
                Reset Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Bookings List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center">
                      Booking ID
                      {getSortIcon('createdAt')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Bike
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('startTime')}
                  >
                    <div className="flex items-center">
                      Date
                      {getSortIcon('startTime')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('totalPrice')}
                  >
                    <div className="flex items-center">
                      Price
                      {getSortIcon('totalPrice')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {getSortIcon('status')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => (
                    <tr key={booking._id} className="border-b">
                      <td className="px-4 py-4 text-sm">
                        {booking._id.slice(-6)}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {booking.userId.slice(-6)}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {getBikeName(booking.bikeId)}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <div className="flex flex-col">
                          <span>{formatDate(booking.startTime)}</span>
                          <span className="text-xs text-gray-500">
                            to {formatDate(booking.endTime)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm">
                        {formatPrice(booking.totalPrice)}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <Badge
                          variant="outline"
                          className={BOOKING_STATUSES[booking.status]?.color}
                        >
                          {BOOKING_STATUSES[booking.status]?.label || booking.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <div className="dropdown dropdown-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              disabled={isLoading}
                              className="flex gap-1 items-center"
                            >
                              Actions <span className="text-xs">▼</span>
                            </Button>
                            <div className="dropdown-content bg-white shadow-lg rounded-md p-2 w-48 absolute right-0 z-10 hidden group-hover:block">
                              <div className="py-1 space-y-1">
                                <Link 
                                  href={`/admin/bookings/${booking._id}`}
                                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </Link>
                                
                                {booking.status === 'pending' && (
                                  <button
                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-green-700 hover:bg-green-50 rounded-md"
                                    onClick={() => handleStatusChange(booking._id, 'confirmed')}
                                    disabled={isLoading}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Confirm
                                  </button>
                                )}
                                
                                {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                  <button
                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 rounded-md"
                                    onClick={() => handleStatusChange(booking._id, 'cancelled')}
                                    disabled={isLoading}
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancel
                                  </button>
                                )}
                                
                                {booking.status === 'confirmed' && (
                                  <button
                                    className="flex items-center w-full text-left px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 rounded-md"
                                    onClick={() => handleStatusChange(booking._id, 'completed')}
                                    disabled={isLoading}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Mark Completed
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <Link href={`/admin/bookings/${booking._id}`}>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                      No bookings found. Try adjusting your filters.
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
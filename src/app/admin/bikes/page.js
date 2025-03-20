'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useBikes } from '@/hooks/use-bikes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from '@/components/ui/loader';
import { formatPrice } from '@/lib/utils';
import { BIKE_TYPES } from '@/lib/constants';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle,
  Edit,
  Trash2,
  ArrowUpDown,
  ArrowDown,
  ArrowUp
} from 'lucide-react';

// Helper to map type IDs to labels
const getBikeTypeLabel = (typeId) => {
  const type = BIKE_TYPES.find(type => type.id === typeId);
  return type ? type.label : typeId;
};

export default function BikesPage() {
  const { allBikes, deleteBike } = useBikes();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [availability, setAvailability] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filteredBikes, setFilteredBikes] = useState([]);
  
  // Update filtered bikes when any filter changes
  useEffect(() => {
    if (!allBikes) return;
    
    let filtered = [...allBikes];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(bike => 
        bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bike.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (selectedType) {
      filtered = filtered.filter(bike => bike.type === selectedType);
    }
    
    // Apply availability filter
    if (availability !== 'all') {
      const isAvailable = availability === 'available';
      filtered = filtered.filter(bike => bike.isAvailable === isAvailable);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'type') {
        comparison = a.type.localeCompare(b.type);
      } else if (sortField === 'pricePerHour') {
        comparison = a.pricePerHour - b.pricePerHour;
      } else if (sortField === 'pricePerDay') {
        comparison = a.pricePerDay - b.pricePerDay;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    setFilteredBikes(filtered);
  }, [allBikes, searchTerm, selectedType, availability, sortField, sortDirection]);
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const handleDelete = async (bikeId) => {
    if (window.confirm('Are you sure you want to delete this bike?')) {
      try {
        await deleteBike({ bikeId });
      } catch (error) {
        console.error('Failed to delete bike:', error);
        alert('Failed to delete bike. Please try again.');
      }
    }
  };
  
  const getSortIcon = (field) => {
    if (field !== sortField) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortDirection === 'asc' ? 
      <ArrowUp className="ml-2 h-4 w-4" /> : 
      <ArrowDown className="ml-2 h-4 w-4" />;
  };
  
  if (!allBikes) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="lg" className="text-blue-600" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Manage Bikes</h1>
        <Link href="/admin/bikes/add">
          <Button className="mt-4 sm:mt-0">
            <Plus className="mr-2 h-4 w-4" />
            Add New Bike
          </Button>
        </Link>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search bikes..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <select
                className="w-full rounded-md border border-gray-200 p-2"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option value="">All Types</option>
                {BIKE_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <select
                className="w-full rounded-md border border-gray-200 p-2"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              >
                <option value="all">All Availability</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>
            
            <div className="flex items-center justify-end">
              <span className="mr-2 text-sm text-gray-500">
                {filteredBikes.length} bikes found
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Bikes List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      Name
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center">
                      Type
                      {getSortIcon('type')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('pricePerHour')}
                  >
                    <div className="flex items-center">
                      Hourly Rate
                      {getSortIcon('pricePerHour')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                    onClick={() => handleSort('pricePerDay')}
                  >
                    <div className="flex items-center">
                      Daily Rate
                      {getSortIcon('pricePerDay')}
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredBikes.length > 0 ? (
                  filteredBikes.map((bike) => (
                    <tr key={bike._id} className="border-b">
                      <td className="px-4 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-md bg-gray-100 flex items-center justify-center mr-3">
                            {bike.images && bike.images.length > 0 ? (
                              <img 
                                src={bike.images[0]} 
                                alt={bike.name} 
                                className="h-10 w-10 object-cover rounded-md"
                              />
                            ) : (
                              <span className="text-gray-400">No img</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{bike.name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">
                              {bike.description}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge variant="secondary">
                          {getBikeTypeLabel(bike.type)}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        {formatPrice(bike.pricePerHour)}
                      </td>
                      <td className="px-4 py-4">
                        {formatPrice(bike.pricePerDay)}
                      </td>
                      <td className="px-4 py-4">
                        {bike.isAvailable ? (
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                            <CheckCircle className="mr-1 h-3 w-3" /> Available
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">
                            <XCircle className="mr-1 h-3 w-3" /> Unavailable
                          </Badge>
                        )}
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Link href={`/admin/bikes/${bike._id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleDelete(bike._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      No bikes found. Try adjusting your filters or add a new bike.
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
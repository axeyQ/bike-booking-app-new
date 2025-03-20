'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useBikes } from '@/hooks/use-bikes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';
import { BIKE_TYPES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import {
  Search,
  Filter,
  Calendar,
  SlidersHorizontal,
  Star,
  X,
} from 'lucide-react';

export default function CustomerBikesPage() {
  const { allBikes } = useBikes();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [filteredBikes, setFilteredBikes] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter bikes when data or filters change
  useEffect(() => {
    if (!allBikes) return;
    
    let filtered = allBikes.filter(bike => bike.isAvailable);
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(bike => 
        bike.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bike.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bike.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply type filter
    if (selectedType) {
      filtered = filtered.filter(bike => bike.type === selectedType);
    }
    
    // Apply price filter
    filtered = filtered.filter(bike => 
      bike.pricePerHour >= priceRange[0] && bike.pricePerHour <= priceRange[1]
    );
    
    // Sort by price (low to high)
    filtered.sort((a, b) => a.pricePerHour - b.pricePerHour);
    
    setFilteredBikes(filtered);
  }, [allBikes, searchTerm, selectedType, priceRange]);
  
  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedType('');
    setPriceRange([0, 500]);
  };
  
  // Helper to get bike type label
  const getBikeTypeLabel = (typeId) => {
    const typeObj = BIKE_TYPES.find(type => type.id === typeId);
    return typeObj ? typeObj.label : typeId;
  };
  
  // Loading state
  if (!allBikes) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="lg" className="text-blue-600" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Browse Bikes</h1>
            <p className="mt-2 text-gray-600">
              Find and book the perfect bike for your next adventure
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)} 
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
            
            <span className="text-sm text-gray-500">
              {filteredBikes.length} bikes available
            </span>
          </div>
        </div>
      </motion.div>
      
      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: showFilters ? 1 : 0,
          height: showFilters ? 'auto' : 0,
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
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
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Hourly Price: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
              
              <div className="flex items-center justify-end">
                <Button variant="outline" onClick={resetFilters} className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Bike Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredBikes.length > 0 ? (
          filteredBikes.map((bike, index) => (
            <motion.div
              key={bike._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Link href={`/customer/bikes/${bike._id}`}>
                <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300">
                  <div className="relative h-48 bg-gray-100">
                    {bike.images && bike.images.length > 0 ? (
                      <img
                        src={bike.images[0]}
                        alt={bike.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400">No image available</span>
                      </div>
                    )}
                    <Badge
                      className="absolute top-2 left-2"
                      variant="secondary"
                    >
                      {getBikeTypeLabel(bike.type)}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{bike.name}</h3>
                      <div className="flex items-center text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="ml-1 text-sm">4.7</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {bike.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-lg font-bold text-blue-600">
                          {formatPrice(bike.pricePerHour)}
                        </span>
                        <span className="text-sm text-gray-500"> / hour</span>
                      </div>
                      
                      <Button variant="default" size="sm">
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Search className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold">No bikes found</h3>
            <p className="text-gray-500 mt-2">
              Try adjusting your filters or search for something else.
            </p>
            <Button onClick={resetFilters} className="mt-4">
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
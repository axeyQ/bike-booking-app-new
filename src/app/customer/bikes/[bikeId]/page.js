'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useBikeById } from '@/hooks/use-bikes';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader } from '@/components/ui/loader';
import { BIKE_TYPES } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';
import {
  ArrowLeft,
  Clock,
  Calendar,
  CheckCircle,
  Star,
  Info,
  ChevronRight,
} from 'lucide-react';

export default function BikeDetailsPage({ params }) {
  const bikeId = params.bikeId;
  const bike = useBikeById(bikeId);
  const [activeImage, setActiveImage] = useState(0);
  
  // Helper to get bike type label
  const getBikeTypeLabel = (typeId) => {
    const typeObj = BIKE_TYPES.find(type => type.id === typeId);
    return typeObj ? typeObj.label : typeId;
  };

  if (!bike) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="lg" className="text-blue-600" />
      </div>
    );
  }
  
  // Handle cases where the bike is not available
  if (!bike.isAvailable) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Link href="/customer/bikes" className="mr-4">
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Bike Details</h1>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            This bike is currently unavailable
          </h2>
          <p className="text-red-600 mb-4">
            Please browse our other available bikes.
          </p>
          <Link href="/customer/bikes">
            <Button>Browse Other Bikes</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center"
      >
        <Link href="/customer/bikes" className="mr-4">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">{bike.name}</h1>
      </motion.div>
      
      <div className="grid gap-8 md:grid-cols-5">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-3 space-y-4"
        >
          <div className="relative aspect-w-16 aspect-h-9 bg-gray-100 rounded-lg overflow-hidden">
            {bike.images && bike.images.length > 0 ? (
              <img
                src={bike.images[activeImage]}
                alt={bike.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-96 flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          
          {bike.images && bike.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {bike.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-20 rounded-md overflow-hidden ${
                    activeImage === index ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <img
                    src={image}
                    alt={`${bike.name} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Bike Information */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2 space-y-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary">
                    {getBikeTypeLabel(bike.type)}
                  </Badge>
                  <div className="flex items-center text-yellow-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="ml-1">4.7</span>
                    <span className="ml-1 text-gray-500">(12 reviews)</span>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold">Pricing</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-500 mr-2" />
                        <span>Hourly Rate</span>
                      </div>
                      <span className="font-medium">{formatPrice(bike.pricePerHour)}</span>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                        <span>Daily Rate</span>
                      </div>
                      <span className="font-medium">{formatPrice(bike.pricePerDay)}</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <Link href={`/customer/bookings/new?bikeId=${bike._id}`}>
                    <Button className="w-full">Book This Bike</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Specifications</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Brand</span>
                  <span className="font-medium">{bike.specifications?.brand || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model</span>
                  <span className="font-medium">{bike.specifications?.model || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frame Size</span>
                  <span className="font-medium">{bike.specifications?.frameSize || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Wheel Size</span>
                  <span className="font-medium">{bike.specifications?.wheelSize || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Color</span>
                  <span className="font-medium">{bike.specifications?.color || 'N/A'}</span>
                </div>
                {bike.specifications?.weight && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Weight</span>
                    <span className="font-medium">{bike.specifications.weight} kg</span>
                  </div>
                )}
                {bike.specifications?.gears && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gears</span>
                    <span className="font-medium">{bike.specifications.gears}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {bike.description}
            </p>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Features and Guidelines */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Well-maintained and regularly serviced</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Safety equipment included</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>24/7 support during rental period</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  <span>Free replacement in case of technical issues</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">Rental Guidelines</h3>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <span>Valid ID required at pickup</span>
                </li>
                <li className="flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <span>Security deposit may be required</span>
                </li>
                <li className="flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <span>Late returns will incur additional fees</span>
                </li>
                <li className="flex items-start">
                  <Info className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <span>Damage to the bike is the renter`&apos;`s responsibility</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-center py-8"
      >
        <h3 className="text-2xl font-bold mb-4">Ready to Book This Bike?</h3>
        <p className="text-gray-600 mb-6 max-w-lg mx-auto">
          Reserve now to ensure availability for your desired dates. Our booking process is quick and secure.
        </p>
        <Link href={`/customer/bookings/new?bikeId=${bike._id}`}>
          <Button size="lg" className="px-8">
            Book Now <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </motion.div>
    </div>
  );
}
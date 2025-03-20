'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader } from '@/components/ui/loader';
import { useBikeById } from '@/hooks/use-bikes';
import { useBikes } from '@/hooks/use-bikes';
import { BIKE_TYPES, FRAME_SIZES, WHEEL_SIZES, BIKE_BRANDS } from '@/lib/constants';
import { imageToBase64, showSuccess, showError } from '@/lib/utils';
import { ArrowLeft, Save, Upload, X } from 'lucide-react';

export default function EditBikePage({ params }) {
  const bikeId = params.bikeId;
  const router = useRouter();
  const bike = useBikeById(bikeId);
  const { updateBike } = useBikes();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'mountain',
    pricePerHour: '',
    pricePerDay: '',
    specifications: {
      brand: '',
      model: '',
      frameSize: '',
      wheelSize: '',
      color: '',
      weight: '',
      gears: '',
    },
    isAvailable: true,
  });
  
  // Load bike data when available
  useEffect(() => {
    if (bike) {
      setFormData({
        name: bike.name,
        description: bike.description,
        type: bike.type,
        pricePerHour: bike.pricePerHour,
        pricePerDay: bike.pricePerDay,
        specifications: {
          brand: bike.specifications.brand || '',
          model: bike.specifications.model || '',
          frameSize: bike.specifications.frameSize || '',
          wheelSize: bike.specifications.wheelSize || '',
          color: bike.specifications.color || '',
          weight: bike.specifications.weight || '',
          gears: bike.specifications.gears || '',
        },
        isAvailable: bike.isAvailable,
      });
      
      setImages(bike.images || []);
    }
  }, [bike]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked,
    });
  };
  
  const handleNumberInput = (e) => {
    const { name, value } = e.target;
    
    if (value === '') {
      handleInputChange(e);
      return;
    }
    
    const numberValue = parseFloat(value);
    if (!isNaN(numberValue)) {
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData({
          ...formData,
          [parent]: {
            ...formData[parent],
            [child]: numberValue,
          },
        });
      } else {
        setFormData({
          ...formData,
          [name]: numberValue,
        });
      }
    }
  };
  
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 5) {
      showError(`You can only upload up to 5 images (currently have ${images.length})`);
      return;
    }
    
    try {
      const imagePromises = files.map(file => imageToBase64(file));
      const imageUrls = await Promise.all(imagePromises);
      setImages([...images, ...imageUrls].slice(0, 5));
    } catch (error) {
      showError('Failed to upload images');
      console.error('Image upload error:', error);
    }
  };
  
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      // Convert price strings to numbers if they're strings
      const pricePerHour = typeof formData.pricePerHour === 'string' 
        ? parseFloat(formData.pricePerHour) 
        : formData.pricePerHour;
        
      const pricePerDay = typeof formData.pricePerDay === 'string' 
        ? parseFloat(formData.pricePerDay) 
        : formData.pricePerDay;
      
      // Validate form
      if (!formData.name || !formData.description || !pricePerHour || !pricePerDay) {
        throw new Error('Please fill all required fields');
      }
      
      // Fix numbers in specifications
      const specifications = {
        ...formData.specifications,
        weight: formData.specifications.weight 
          ? (typeof formData.specifications.weight === 'string' 
              ? parseFloat(formData.specifications.weight) 
              : formData.specifications.weight)
          : undefined,
        gears: formData.specifications.gears 
          ? (typeof formData.specifications.gears === 'string' 
              ? parseInt(formData.specifications.gears) 
              : formData.specifications.gears) 
          : undefined,
      };
      
      // Update bike
      await updateBike({
        bikeId,
        name: formData.name,
        description: formData.description,
        type: formData.type,
        pricePerHour,
        pricePerDay,
        images,
        specifications,
        isAvailable: formData.isAvailable,
      });
      
      showSuccess('Bike updated successfully');
      router.push('/admin/bikes');
    } catch (error) {
      showError(error.message || 'Failed to update bike');
      console.error('Update bike error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!bike) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader size="lg" className="text-blue-600" />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Link href="/admin/bikes" className="mr-4">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Edit Bike</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bike Name*
                </label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Trek Mountain Explorer"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bike Type*
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-200 p-2"
                  required
                >
                  {BIKE_TYPES.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-200 p-2 min-h-[100px]"
                placeholder="Describe the bike features and condition"
                required
              />
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hourly Rate (USD)*
                </label>
                <Input
                  name="pricePerHour"
                  value={formData.pricePerHour}
                  onChange={handleNumberInput}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 10.00"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daily Rate (USD)*
                </label>
                <Input
                  name="pricePerDay"
                  value={formData.pricePerDay}
                  onChange={handleNumberInput}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 50.00"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleCheckboxChange}
                  className="rounded mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Available for booking
                </span>
              </label>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Brand
                </label>
                <select
                  name="specifications.brand"
                  value={formData.specifications.brand}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-200 p-2"
                >
                  <option value="">Select Brand</option>
                  {BIKE_BRANDS.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <Input
                  name="specifications.model"
                  value={formData.specifications.model}
                  onChange={handleInputChange}
                  placeholder="e.g. XC900"
                />
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Frame Size
                </label>
                <select
                  name="specifications.frameSize"
                  value={formData.specifications.frameSize}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-200 p-2"
                >
                  <option value="">Select Size</option>
                  {FRAME_SIZES.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Wheel Size
                </label>
                <select
                  name="specifications.wheelSize"
                  value={formData.specifications.wheelSize}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-200 p-2"
                >
                  <option value="">Select Size</option>
                  {WHEEL_SIZES.map((size) => (
                    <option key={size.id} value={size.id}>
                      {size.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Color
                </label>
                <Input
                  name="specifications.color"
                  value={formData.specifications.color}
                  onChange={handleInputChange}
                  placeholder="e.g. Red"
                />
              </div>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <Input
                  name="specifications.weight"
                  value={formData.specifications.weight}
                  onChange={handleNumberInput}
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="e.g. 12.5"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Gears
                </label>
                <Input
                  name="specifications.gears"
                  value={formData.specifications.gears}
                  onChange={handleNumberInput}
                  type="number"
                  min="0"
                  placeholder="e.g. 21"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <div className="space-y-2">
                <div className="flex justify-center">
                  <Upload className="h-10 w-10 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500">
                  Drag & drop images here, or click to select files
                </p>
                <p className="text-xs text-gray-400">
                  Upload up to 5 images (JPG, PNG)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('image-upload').click()}
                >
                  Select Files
                </Button>
              </div>
            </div>
            
            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image}
                      alt={`Uploaded ${index + 1}`}
                      className="object-cover w-full h-32 rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="flex justify-end space-x-4">
          <Link href="/admin/bikes">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          
          <Button type="submit" disabled={isSubmitting}>
            <Save className="mr-2 h-4 w-4" />
            Update Bike
          </Button>
        </div>
      </form>
    </div>
  );
}
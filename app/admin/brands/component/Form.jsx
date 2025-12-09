"use client";

import { Button } from "@heroui/react";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { createNewBrand, updateBrand } from "@/lib/firestore/brands/write";
import { getBrandById } from "@/lib/firestore/brands/read";

export default function Form({ editBrandId, onEditComplete }) {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const fileInputRef = useRef(null);

  // Ensure component only renders on client side to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load brand data for editing
  useEffect(() => {
    if (editBrandId) {
      setIsEditMode(true);
      loadBrandData(editBrandId);
    } else {
      setIsEditMode(false);
      // Reset form
      setData(null);
      setImage(null);
      setImageUrl("");
    }
  }, [editBrandId]);

  const loadBrandData = async (id) => {
    try {
      setIsLoading(true);
      const brand = await getBrandById(id);
      setData({
        name: brand.name,
        slug: brand.slug,
      });
      setImageUrl(brand.image);
      // Don't set image file since we only have the URL
    } catch (error) {
      toast.error("Failed to load brand data: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleData = (key, value) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  // Upload image to ImgBB
  const uploadToImgBB = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const response = await fetch(`https://api.imgbb.com/1/upload?key=e2eab96f6583c73dfeb489357e18b6aa`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        return result.data.url;
      } else {
        throw new Error(result.error.message || 'Failed to upload image');
      }
    } catch (error) {
      throw new Error('Failed to upload image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    try {
      setImage(file);
      // Upload to ImgBB
      const uploadedUrl = await uploadToImgBB(file);
      setImageUrl(uploadedUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error.message);
      setImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate that all fields are filled
    if (!data?.name || !data?.slug) {
      toast.error("Please fill all fields");
      return;
    }
    
    if (!imageUrl) {
      toast.error("Please upload an image or provide an image URL");
      return;
    }
    
    setIsLoading(true);
    try {
      if (isEditMode) {
        // Update existing brand
        await updateBrand(editBrandId, { 
          data: data, 
          imageUrl: imageUrl
        });
        toast.success("Brand updated successfully");
      } else {
        // Create new brand
        await createNewBrand({ 
          data: data, 
          imageUrl: imageUrl
        });
        toast.success("Brand created successfully");
      }
      
      // Reset form
      setData(null);
      setImage(null);
      setImageUrl("");
      
      // Notify parent component if in edit mode
      if (isEditMode && onEditComplete) {
        onEditComplete();
      }
    } catch (error) {
      toast.error(error?.message || `Failed to ${isEditMode ? 'update' : 'create'} brand`);
    }
    setIsLoading(false);
  };

  // Don't render on server to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <div className="bg-white w-full rounded-xl p-5 flex flex-col gap-3">
      <h1 className="font-semibold text-lg">{isEditMode ? "Edit Brand" : "Create Brand"}</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2">
        {/* brand image upload */}
        <div className="flex flex-col gap-1">
          <label className="block text-sm font-medium mb-1">Image</label>
          
          {/* Image preview */}
          {(image || imageUrl) && (
            <div className="flex items-center justify-center mb-2">
              <img 
                className="h-20 w-20 rounded-md object-cover" 
                src={imageUrl || (image ? URL.createObjectURL(image) : "")} 
                alt="Preview" 
              />
            </div>
          )}
          
          {/* Upload button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={`w-full p-2 border rounded-md focus:outline-none ${
              uploading ? 'bg-gray-200' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {uploading ? 'Uploading...' : image ? 'Change Image' : 'Select Image'}
          </button>
          
          <div className="relative flex items-center justify-center my-2">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-gray-500">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          
          {/* Direct URL input */}
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Or enter image URL directly"
            className="w-full p-2 border rounded-md focus:outline-none"
          />
        </div>
        
        {/* data */}
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={data?.name ?? ""}
            onChange={(e) => {
              handleData("name", e.target.value)
            }}
            className="w-full p-2 border rounded-md focus:outline-none "
            placeholder="Enter brand name" />
        </div>
        <div>
          <label htmlFor="slug" className="block text-sm font-medium mb-1">Slug</label>
          <input
            id="slug"
            type="text"
            name="slug"
            value={data?.slug ?? ""}
            onChange={(e) => {
              handleData("slug", e.target.value)
            }}
            className="w-full p-2 border rounded-md focus:outline-none "
            placeholder="Enter Slug" />
        </div>
        <div className="flex gap-2">
          <Button 
            type="submit" 
            disabled={isLoading || uploading}
            className="flex-1 py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {isLoading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update" : "Create")}
          </Button>
          {isEditMode && (
            <Button 
              type="button"
              onClick={() => {
                if (onEditComplete) onEditComplete();
              }}
              className="flex-1 py-2 rounded-md bg-gray-500 text-white hover:bg-gray-600"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
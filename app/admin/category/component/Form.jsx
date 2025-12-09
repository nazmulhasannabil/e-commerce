"use client";
import { Button } from "@heroui/react";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { createNewCategory } from "@/lib/firestore/category/write";

export default function Form() {
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Ensure component only renders on client side to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

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
      setImageUrl(""); // Clear any existing URL
      
      // Upload to ImgBB
      const uploadedUrl = await uploadToImgBB(file);
      setImageUrl(uploadedUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error.message);
      setImage(null);
    }
  };

  const handleCreate = async () => {
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
      // Log the data being sent
      console.log("Sending data to create category:", { data, imageUrl });
      
      // Pass the image URL to createNewCategory
      await createNewCategory({ 
        data: data, 
        imageUrl: imageUrl
      });
      toast.success("Successfully Created");
      setData(null);
      setImage(null);
      setImageUrl(""); // Clear the image URL
    } catch (error) {
      toast.error(error?.message || "Failed to create category");
    }
    setIsLoading(false);
  };

  // Don't render on server to prevent hydration mismatch
  if (!isClient) {
    return null;
  }

  return (
    <div className=" bg-white w-full md:w-[400px] rounded-xl p-5 flex flex-col gap-3">
      <h1 className="font-semibold text-lg">Create Category</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreate();
        }}
        className="flex flex-col gap-2">
        {/* category image upload */}
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
            disabled={!!image}
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
            placeholder="Enter category name" />
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
        <Button 
          type="submit" 
          disabled={isLoading || uploading}
          className="w-full py-2 rounded-md bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create"}
        </Button>
      </form>
    </div>
  )
}
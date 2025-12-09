"use client";

import { useState, useEffect } from "react";
import { getAllCategories, deleteCategory, getCategoryById } from "@/lib/firestore/categories/read";
import toast from "react-hot-toast";
import { Edit, Trash2 } from "lucide-react";
import Form from "./Form";

export default function ListView() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure component only renders on client side to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load category data
  useEffect(() => {
    if (isClient) {
      fetchCategories();
    }
  }, [isClient]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllCategories();
      setCategories(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to fetch categories: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory(id);
        toast.success("Category deleted successfully");
        fetchCategories(); // Refresh the list to show updated data
      } catch (err) {
        toast.error(err.message || "Failed to delete category");
      }
    }
  };

  const handleEdit = (id) => {
    setEditingCategoryId(id);
  };

  const handleEditComplete = () => {
    setEditingCategoryId(null);
    fetchCategories(); // Refresh the list to show updated data
  };

  // Function to check if URL is valid
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Don't render on server to prevent hydration mismatch
  if (!isClient) {
    return (
      <div className="bg-white flex-1 rounded-xl p-5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white flex-1 rounded-xl p-5 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white flex-1 rounded-xl p-5 flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white flex-1 rounded-xl p-5">
      <h2 className="text-xl font-bold mb-4">Category List</h2>
      
      {categories.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No categories found. Create a new category to get started.
        </div>
      ) : (
        <>
          {/* Mobile view - Card layout */}
          <div className="md:hidden grid grid-cols-1 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="shrink-0">
                    {category.image && typeof category.image === 'string' && isValidUrl(category.image) ? (
                      <img
                        className="h-16 w-16 rounded-md object-cover"
                        src={category.image}
                        alt={category.name || "Category image"}
                        onError={(e) => {
                          // If the image fails to load, show a placeholder
                          e.target.onerror = null; // Prevent infinite loop
                          e.target.src = "https://placehold.co/100x100?text=No+Image";
                        }}
                      />
                    ) : (
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                        <span className="text-xs text-gray-500">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{category.name || "Unnamed"}</h3>
                    <p className="text-sm text-gray-500 truncate">{category.slug || "No slug"}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(category.id)}
                      className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Desktop view - Table layout */}
          <div className="hidden md:block overflow-x-auto -mx-5 px-5 md:mx-0 md:px-0">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category Image
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-10 w-10">
                        {category.image && typeof category.image === 'string' && isValidUrl(category.image) ? (
                          <img
                            className="h-10 w-10 rounded-md object-cover"
                            src={category.image}
                            alt={category.name || "Category image"}
                            onError={(e) => {
                              // If the image fails to load, show a placeholder
                              e.target.onerror = null; // Prevent infinite loop
                              e.target.src = "https://placehold.co/100x100?text=No+Image";
                            }}
                          />
                        ) : (
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10 flex items-center justify-center">
                            <span className="text-xs text-gray-500">No Image</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category.name || "Unnamed"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{category.slug || "No slug"}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(category.id)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(category.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      
      {/* Edit Form Modal */}
      {editingCategoryId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-5">
              <Form 
                editCategoryId={editingCategoryId} 
                onEditComplete={handleEditComplete} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
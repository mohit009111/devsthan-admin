import React, { useState, useEffect } from "react";
import "./DatatableCategory.css";
import { BASE_URL } from "../../utils/headers";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Datatable = () => {
  const [categoryName, setCategoryName] = useState(""); // State to hold input value
  const [categories, setCategories] = useState([]); // State to hold the list of categories

  // Function to add a new category
  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }
  
    try {
      const response = await fetch(`${BASE_URL}/api/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: categoryName }),
      });
  
      if (response.ok) {
        toast.success("Category added successfully!");
        setCategoryName(""); // Clear the input field
        fetchCategories(); // Refresh the list of categories
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Error adding category");
    }
  };

  // Function to fetch all categories from the database
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setCategories(data); // Update categories state
      } else {
        console.error("Failed to fetch categories");
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Function to delete a category
  const handleDeleteCategory = async (categoryId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/categories/${categoryId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Category deleted successfully!');
        fetchCategories(); // Refresh the list of categories
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Error deleting category');
    }
  };

  // Fetch categories when the component mounts
  useEffect(() => {
    fetchCategories();
  }, []);
  
  return (
    <div className="datatableCategory">
      {/* First Box: Input for adding new category */}
      <div className="category-add-box">
        <h3>Add Category</h3>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Enter category name"
        />
        <button onClick={handleAddCategory}>Add Category</button>
      </div>

      {/* Second Box: Display list of categories */}
      <div className="category-list-box">
        <h3>All Categories</h3>
        {categories.length > 0 ? (
          <ul>
            {categories.map((category) => (
              <li key={category._id}>
                {category.name}
                <button className="delete-button" onClick={() => handleDeleteCategory(category._id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No categories found.</p>
        )}
      </div>
    </div>
  );
};

export default Datatable;

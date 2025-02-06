import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import './about.css';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { BASE_URL } from '../../utils/headers';
import { v4 as uuidv4 } from 'uuid';
import { toast,ToastContainer } from 'react-hot-toast';
const NewBlog = ({ title }) => {
   
    const [imagePreview, setImagePreview] = useState(null); // State for image preview
    const [formData, setFormData] = useState({
        uuid: uuidv4(),
        bannerImage: '',
        title: '',
        description: ''
    });
    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get the selected file
        if (file) {
            setFormData({
                ...formData,
                bannerImage: file
            });

            // Create a preview URL for the selected image
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };
    const handleDescriptionChange = (value) => {
        setFormData((prevData) => ({ ...prevData, description: value }));
    };
    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // 1. Upload image to Cloudinary
            const uploadImageToCloudinary = async (image) => {
                const cloudinaryURL = 'https://api.cloudinary.com/v1_1/dmyzudtut/image/upload';
                const formData = new FormData();
                formData.append('file', image);
                formData.append('upload_preset', 'ljqbwqy9');
    
                const response = await fetch(cloudinaryURL, {
                    method: 'POST',
                    body: formData,
                });
    
                if (response.ok) {
                    const data = await response.json();
                    return data.secure_url; // Return the uploaded image URL
                } else {
                    throw new Error('Failed to upload image to Cloudinary');
                }
            };
    
            // Get the banner image from formData (assuming it's stored there)
            const imageFile = formData.bannerImage; // Ensure 'bannerImage' holds the File object
    
            // Upload the image and get the URL
            const bannerImageUrl = await uploadImageToCloudinary(imageFile);
    
            // 2. Prepare the data for the backend
            const blogData = {
                uuid: formData.uuid,
                bannerImage: bannerImageUrl,
                title: formData.title,
                description: formData.description,
            };
    
            // 3. Send the data to the backend
            const response = await fetch(`${BASE_URL}/api/createWhyChoose`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(blogData), // Send JSON with the Cloudinary URL
            });
    
            // Check if the response is ok (status 200-299)
            if (response.ok) {
                const data = await response.json();  // Parse the JSON response
                console.log('Blog created successfully:', data);
                toast.success("Blog created successfully:");
            } else {
                console.error('Error creating blog:', response.statusText);
                toast.error("Error creating blog:!");
            }
        } catch (error) {
            console.error('Error creating blog:', error);
        }
    };
    

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>{title || 'Create New Blog'}</h1>
                </div>
                <div className="bottom">
                    <form onSubmit={handleSubmit}>
                        <div className="formInput">
                            <label>Banner Image</label>
                            <label className="uploadButton" htmlFor="fileUpload">
                                Choose Image
                            </label>
                            <input
                                id="fileUpload"
                                type="file"
                                name="bannerImage"
                                onChange={handleImageChange}
                            />
                            {imagePreview && (
                                <div className="imagePreview">
                                    <img src={imagePreview} alt="Image Preview" />
                                </div>
                            )}
                        </div>
                        <div className="formInput">
                            <label>Title</label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Enter whyChoose title"
                            />
                        </div>
                        <div className="formInput">
                    <label>Description</label>
                    <ReactQuill
                        value={formData.description}
                        onChange={handleDescriptionChange}
                        placeholder="Enter whyChoose description"
                    />
                </div>
                        <button type="submit">Create whyChoose</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewBlog;

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { BASE_URL } from '../../utils/headers';
import { toast, ToastContainer } from 'react-hot-toast';
import { RotatingLines } from 'react-loader-spinner';
import { useParams } from 'react-router-dom';

const EditBlog = ({ title }) => {
    const { id } = useParams(); // Extract blog ID from URL params
    const [formData, setFormData] = useState({
        uuid: '',
        title: '',
        description: '',
        bannerImage: '',
        metaTitle: '',
        metaDescription: '',
    });
    console.log(formData)
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    // Fetch blog details
    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${BASE_URL}/api/getBlogById/${id}`);
                const blog = response.data.data;

                setFormData({
                    uuid: blog.uuid || '',
                    title: blog.title || '',
                    description: blog.description || '',
                    bannerImage: blog.bannerImage || '',
                    metaDescription:blog.metaDescription || '',
                    metaTitle:blog.metaTitle || '', 
                });

                setImagePreview(blog.bannerImage);
            } catch (error) {
                console.error('Error fetching blog details:', error);
                toast.error('Failed to fetch blog details');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogDetails();
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0]; // Get the selected file
        if (file) {
            setFormData({
                ...formData,
                bannerImage: file,
            });

            // Create a preview URL for the selected image
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleDescriptionChange = (value) => {
        setFormData((prevData) => ({ ...prevData, description: value }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const uploadImageToCloudinary = async (image) => {
             
      
                const cloudinaryURL = ' "https://api.cloudinary.com/v1_1/drsexfijb/image/upload";';
                const formData = new FormData();
                formData.append('file', image);
                formData.append('upload_preset', 'devsthan');

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

            let bannerImageUrl = formData.bannerImage;

            if (formData.bannerImage instanceof File) {
                bannerImageUrl = await uploadImageToCloudinary(formData.bannerImage);
            }

            const blogData = {
                uuid: formData.uuid,
                bannerImage: bannerImageUrl,
                title: formData.title,
                description: formData.description,
                metaTitle:formData.metaTitle,
                metaDescription:formData.metaDescription,
            };

            const response = await axios.put(`${BASE_URL}/api/updateBlog/${id}`, blogData);

            if (response.status === 200) {
                toast.success('Blog updated successfully');
            } else {
                toast.error('Error updating blog');
            }
        } catch (error) {
            console.error('Error updating blog:', error);
            toast.error('Error updating blog');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>{title || 'Edit Blog'}</h1>
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
                                placeholder="Enter blog title"
                            />
                        </div>
                        <div className="formInput">
                            <label>Description</label>
                            <ReactQuill
                                value={formData.description}
                                onChange={handleDescriptionChange}
                                placeholder="Enter blog description"
                            />
                        </div>
                        <div className="formInput">
                            <label>Meta Title</label>
                            <input
                                type="text"
                                name="metaTitle"
                                value={formData.metaTitle}
                                onChange={handleChange}
                                placeholder="Enter Meta Title"
                            />
                        </div>
                        <div className="formInput">
                            <label>Meta Description</label>
                            <input
                                type="text"
                                name="metaDescription"
                                value={formData.metaDescription}
                                onChange={handleChange}
                                placeholder="Enter Meta Description"
                            />
                        </div>
                        {loading ? (
                            <RotatingLines
                                visible={true}
                                height="60"
                                width="60"
                                color="grey"
                                strokeWidth="5"
                                animationDuration="0.75"
                                ariaLabel="rotating-lines-loading"
                                wrapperStyle={{}}
                                wrapperClass=""
                            />
                        ) : (
                            <button type="submit">Update Blog</button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditBlog;

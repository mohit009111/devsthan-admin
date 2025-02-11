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
        bannerImage: "",
        title: "",
        description: "",
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
        canonicalUrl: "",
        openGraph: {
          title: "",
          description: "",
          url: "",
         
          type: "",
        },
        twitter: {
          title: "",
          description: "",
          
        },
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
                    metaKeywords: blog.metaKeywords || '',
                    canonicalUrl: blog.canonicalUrl || '',
                    openGraph: {
                      title: blog.openGraph?.title || '',
                      description: blog.openGraph?.description || '',
                      url: blog.openGraph?.url || '',
                      type: blog.openGraph?.type || '',
                    },
                    twitter: {
                      title: blog.twitter?.title || '',
                      description: blog.twitter?.description || '',
                    },
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
console.log(formData)
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

    const handleTagsChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');
      
        setFormData((prev) => {
          let updatedData = { ...prev };
          let currentLevel = updatedData;
      
          for (let i = 0; i < keys.length - 1; i++) {
            if (!currentLevel[keys[i]]) {
              currentLevel[keys[i]] = {};
            }
            currentLevel = currentLevel[keys[i]];
          }
      
          currentLevel[keys[keys.length - 1]] = value;
          return updatedData;
        });
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
                const cloudinaryURL = "https://api.cloudinary.com/v1_1/drsexfijb/image/upload";
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
                            <label>Banner Image (width: 900px, height:300px)</label>
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
                        <h2>SEO & Social Media Tags</h2>

{/* Meta Title */}
<div className="formGroup">
  <label>Meta Title</label>
  <input
    type="text"
    name="metaTitle"
    value={formData?.metaTitle}
    onChange={handleChange}
    placeholder="Enter meta title"
    required
  />
</div>

{/* Meta Description */}
<div className="formGroup">
  <label>Meta Description</label>
  <textarea
    name="metaDescription"
    value={formData?.metaDescription}
    onChange={handleChange}
    placeholder="Enter meta description"
    required
  />
</div>

{/* Meta Keywords */}
<div className="formGroup">
  <label>Meta Keywords</label>
  <input
    type="text"
    name="metaKeywords"
    value={formData?.metaKeywords}
    onChange={handleChange}
    placeholder="Enter keywords (comma separated)"
    required
  />
</div>

{/* Canonical URL */}
<div className="formGroup">
  <label>Canonical URL</label>
  <input
    type="text"
    name="canonicalUrl"
    value={formData?.canonicalUrl}
    onChange={handleChange}
    placeholder="Enter canonical URL"
    required
  />
</div>

{/* Open Graph Tags */}
<h3>Open Graph (OG) Tags</h3>

<div className="formGroup">
  <label>OG Title</label>
  <input
    type="text"
    name="openGraph.title"
    value={formData?.openGraph?.title}
    onChange={handleTagsChange}
    placeholder="Enter OG title"
    required
  />
</div>

<div className="formGroup">
  <label>OG Description</label>
  <textarea
    name="openGraph.description"
    value={formData?.openGraph?.description}
    onChange={handleTagsChange}
    placeholder="Enter OG description"
    required
  />
</div>

<div className="formGroup">
  <label>OG URL</label>
  <input
    type="text"
    name="openGraph.url"
    value={formData?.openGraph?.url}
    onChange={handleTagsChange}
    placeholder="Enter OG URL"
    required
  />
</div>
{/* 
<div className="formGroup">
  <label>OG Image</label>
  <input
    type="text"
    name="openGraph.image"
    value={formData?.openGraph?.image}
    onChange={handleTagsChange}
    placeholder="Enter OG Image URL"
    required
  />
</div> */}

<div className="formGroup">
  <label>OG Type</label>
  <input
    type="text"
    name="openGraph.type"
    value={formData?.openGraph?.type}
    onChange={handleTagsChange}
    placeholder="Enter OG Type (e.g., website, article)"
    required
  />
</div>

{/* Twitter Tags */}
<h3>Twitter Tags</h3>

<div className="formGroup">
  <label>Twitter Title</label>
  <input
    type="text"
    name="twitter.title"
    value={formData?.twitter?.title}
    onChange={handleTagsChange}
    placeholder="Enter Twitter title"
    required
  />
</div>

<div className="formGroup">
  <label>Twitter Description</label>
  <textarea
    name="twitter.description"
    value={formData?.twitter?.description}
    onChange={handleTagsChange}
    placeholder="Enter Twitter description"
    required
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

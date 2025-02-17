import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import axios from 'axios';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { BASE_URL } from '../../utils/headers';
import { toast, ToastContainer } from 'react-hot-toast';

const EditBlog = ({ title }) => {
    const { whychoose } = useParams();
    console.log(useParams())
    const [imagePreview, setImagePreview] = useState(null);
    const [formData, setFormData] = useState({
        uuid: '',
        bannerImage: '',
        title: '',
        description: ''
    });

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                const response = await axios.get(`${BASE_URL}/api/getWhyChooseById/${whychoose}`);
                if (response.status === 200) {
                    const data = response.data;
                    setFormData({
                        uuid: data.uuid,
                        bannerImage: data.bannerImage,
                        title: data.title,
                        description: data.description
                    });
                    setImagePreview(data.bannerImage);
                }
            } catch (error) {
                console.error('Error fetching blog data:', error);
            }
        };
        fetchBlogData();
    }, [whychoose]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({
                ...formData,
                bannerImage: file
            });
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
            [name]: value
        });
    };

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
            return data.secure_url;
        } else {
            throw new Error('Failed to upload image to Cloudinary');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let bannerImageUrl = formData.bannerImage;
            if (formData.bannerImage instanceof File) {
                bannerImageUrl = await uploadImageToCloudinary(formData.bannerImage);
            }

            const updatedData = {
                uuid: formData.uuid,
                bannerImage: bannerImageUrl,
                title: formData.title,
                description: formData.description,
            };

            const response = await axios.put(`${BASE_URL}/api/updateWhyChoose/${whychoose}`, updatedData);

            if (response.status === 200) {
                toast.success("Blog updated successfully");
            } else {
                toast.error("Error updating blog");
            }
        } catch (error) {
            console.error('Error updating blog:', error);
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
                        <button type="submit">Update Blog</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditBlog;
import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import '../addBanners/addBanner.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { BASE_URL } from '../../utils/headers';
import { FaTrash } from 'react-icons/fa';

const NewBlog = ({ title }) => {
    const [banners, setBanners] = useState({
        homeBanner: [],
        aboutUsBanner: [],
        contactBanner: [],
        destinationBanner: [],
        destinationsBanner: [],
        blogBanner: [],
        blogsBanner: [],
        toursBanner: [],
    });
    const [validationErrors, setValidationErrors] = useState({});
    const handleDeleteImage = async (type, index) => {
        
        try {

            const imageUrl = banners[type][index];   
            const response = await fetch(`${BASE_URL}/api/deleteBannerImage`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ imageUrl, page: type }),
            });

            if (response.ok) {
                alert("Image deleted successfully!");
            } else {
                const errorData = await response.json();
                console.error("Backend error:", errorData);
              
            }
        } catch (error) {
            console.error("Error deleting image:", error);
       
        }
    };
    // Fetch existing banner images from the backend
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                const bannerTypes = [
                    'homeBanner', 'aboutUsBanner', 'contactBanner', 'destinationBanner',
                    'destinationsBanner', 'blogBanner', 'blogsBanner', 'toursBanner'
                ];

                const fetchedBanners = {};

                for (const type of bannerTypes) {
                    const response = await fetch(`${BASE_URL}/api/getBanner?page=${type}`);
                    if (response.ok) {
                        const result = await response.json();
                        fetchedBanners[type] = result.data?.bannerUrls || [];  // Store the fetched banner URLs
                    } else {
                        fetchedBanners[type] = [];  // If no banners exist, set empty array
                    }
                }

                setBanners(fetchedBanners);  // Update state with fetched banners
            } catch (error) {
                console.error("Error fetching banners:", error);
            }
        };

        fetchBanners();
    }, []);
    console.log(banners)
    const handleFileChange = (e, type, multiple = false) => {
        const files = e.target.files;
        let updatedFiles = multiple
            ? [...banners[type], ...Array.from(files)]
            : [files[0]];  // Ensure it's wrapped in an array

        setBanners((prev) => ({
            ...prev,
            [type]: updatedFiles,
        }));
    };
    const getPreviewUrls = (type) => {
        const banner = banners[type];

      
        if (!banner || banner.length === 0) return [];

      
        return banner.map((file) => {
            if (file instanceof File) {
                return URL.createObjectURL(file); // Create URL for File objects
            }
            return file; // If it's already a URL (for example, from Cloudinary), return it
        });
    };

    const handleSubmit = async (type) => {
        console.log(type);
        const bannerData = banners[type];

        const cloudinaryURL = "https://api.cloudinary.com/v1_1/dmyzudtut/image/upload";
        const uploadPreset = "ljqbwqy9";

        // Helper: Upload a single image to Cloudinary
        const uploadImageToCloudinary = async (image) => {
            try {
                const formData = new FormData();
                formData.append("file", image);
                formData.append("upload_preset", uploadPreset);

                const response = await fetch(cloudinaryURL, {
                    method: "POST",
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    return data.secure_url;
                } else {
                    const errorData = await response.json();
                    throw new Error(errorData.error?.message || "Failed to upload image");
                }
            } catch (error) {
                console.error("Error uploading to Cloudinary:", error);
                throw error;
            }
        };

        try {
            const uploadedImageUrls = [];

            if (Array.isArray(bannerData)) {
                // Separate new images (File instances) from already uploaded URLs
                const newImages = bannerData.filter((image) => image instanceof File);

                // Upload only the new images
                for (const image of newImages) {
                    const url = await uploadImageToCloudinary(image);
                    uploadedImageUrls.push(url);
                }

                // Add already existing URLs to the final array
                const existingUrls = bannerData.filter((image) => typeof image === 'string');
                uploadedImageUrls.push(...existingUrls);
            }

            // Send the uploaded and existing URLs to the backend
            const response = await fetch(`${BASE_URL}/api/addBannerImages?page=${type}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ bannerUrls: uploadedImageUrls }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Backend response:", result);
                alert(`${type} banner uploaded successfully!`);
            } else {
                const errorData = await response.json();
                console.error("Backend error:", errorData);
                alert(`Failed to save ${type} banner.`);
            }
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            alert("An error occurred while uploading the banner.");
        }
    };

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>{title || 'Add Banners'}</h1>
                </div>
                <div className="bottom">
                    <form>
                        <div className="formGroup">
                            <label htmlFor="homeBanner">Home Banner (Multiple Images)</label>
                            <input
                                type="file"
                                id="homeBanner"
                                multiple
                                onChange={(e) => handleFileChange(e, 'homeBanner', true)}
                            />
                            {validationErrors.homeBanner && <div className="error">{validationErrors.homeBanner}</div>}
                            <div className="preview">
                {getPreviewUrls('homeBanner').map((url, index) => (
                    <div key={index} className="preview-image-container">
                        <img src={url} alt={`Preview ${index}`} />
                        <button
                            className="delete-banner"
                            onClick={() => handleDeleteImage('homeBanner', index)}
                            aria-label={`Delete Preview ${index}`}
                        >
                            <FaTrash />
                        </button>
                    </div>
                ))}
            </div>
                            <button
                                type="button"
                                onClick={() => handleSubmit('homeBanner')}
                            >
                                Save Home Banner
                            </button>
                        </div>
                        {[
                            { id: 'aboutUsBanner', label: 'About Us Page Banner' },
                            { id: 'contactBanner', label: 'Contact Page Banner' },
                            { id: 'destinationBanner', label: 'Destination Page Banner' },
                            { id: 'destinationsBanner', label: 'Destinations Page Banner' },
                            { id: 'blogBanner', label: 'Blog Page Banner' },
                            { id: 'blogsBanner', label: 'Blogs Page Banner' },
                            { id: 'toursBanner', label: 'Tours Page Banner' },
                        ].map(({ id, label }) => (
                            <div className="formGroup" key={id}>
                                <label htmlFor={id}>{label}</label>
                                <input
                                    type="file"
                                    id={id}
                                    onChange={(e) => handleFileChange(e, id)}
                                />
                                {validationErrors[id] && <div className="error">{validationErrors[id]}</div>}
                                <div className="preview">
                {getPreviewUrls(id).map((url, index) => (
                    <div key={index} className="preview-image-container">
                        <img src={url} alt={`Preview ${label} ${index}`} />
                        <button
                            className="delete-banner"
                            onClick={() => handleDeleteImage(id, index)}
                            aria-label={`Delete ${label} Preview ${index}`}
                        >
                            <FaTrash />
                        </button>
                    </div>
                ))}
            </div>
                                <button
                                    type="button"
                                    onClick={() => handleSubmit(id)}
                                >
                                    Save {label}
                                </button>
                            </div>
                        ))}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default NewBlog;
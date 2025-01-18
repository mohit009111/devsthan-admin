import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import '../addBanners/addBanner.css';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { BASE_URL } from '../../utils/headers';
import { FaTrash } from 'react-icons/fa';
import { RotatingLines } from 'react-loader-spinner';
import { toast, Toaster } from 'react-hot-toast';
const NewBlog = ({ title }) => {
    const [loading, setLoading] = useState({});
    const [banners, setBanners] = useState({
        homeBanner: { desktop: [], mobile: [], tablet: [] },
        aboutUsBanner: { desktop: [], mobile: [], tablet: [] },
        contactBanner: { desktop: [], mobile: [], tablet: [] },
        destinationBanner: { desktop: [], mobile: [], tablet: [] },
        destinationsBanner: { desktop: [], mobile: [], tablet: [] },
        blogBanner: { desktop: [], mobile: [], tablet: [] },
        blogsBanner: { desktop: [], mobile: [], tablet: [] },
        toursBanner: { desktop: [], mobile: [], tablet: [] },
    });
    console.log(banners)
    const [validationErrors, setValidationErrors] = useState({});
    const handleDeleteImage = async (type, device, imageUrl) => {
        console.log("Type:", type); 
        console.log("Device:", device); 
        console.log("Image URL:", imageUrl); 
        try {
            const response = await fetch(`${BASE_URL}/api/deleteBannerImage`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ imageUrl, page: type, device }),
            });
    
            const result = await response.json(); 
            if (result.success) {
                toast.success("Image deleted successfully!");
                setBanners((prev) => {
                    const updatedBanners = { ...prev };
                    updatedBanners[type][device] = updatedBanners[type][device].filter(
                        (url) => url !== imageUrl
                    );
                    return updatedBanners;
                });
            } else {
                // If the response is not OK, handle the error
                console.error("Backend error:", result.error);
                toast.error(`Failed to delete image: ${result.error || 'Unknown error'}`);
            }
        } catch (error) {
            // Catch any unexpected errors
            console.error("Error deleting image:", error);
            toast.error("An error occurred while deleting the image.");
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
    const handleFileChange = (e, type, device) => {
        const files = Array.from(e.target.files);

        setBanners((prev) => ({
            ...prev,
            [type]: {
                ...prev[type],
                [device]: [...(prev[type]?.[device] || []), ...files], // Fallback to an empty array if undefined
            },
        }));
    };

    const uploadImageToCloudinary = async (imageFile) => {
        const formData = new FormData();
        formData.append('file', imageFile); // Image file to upload
        formData.append('upload_preset', 'ljqbwqy9'); // Your Cloudinary upload preset

        const cloudinaryURL = "https://api.cloudinary.com/v1_1/dmyzudtut/image/upload";

        try {
            const response = await fetch(cloudinaryURL, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Failed to upload image to Cloudinary');
            }

            const data = await response.json();
            return data.secure_url; // Returns the URL of the uploaded image
        } catch (error) {
            console.error('Error uploading image:', error.message);
            throw error;
        }
    };


    const getPreviewUrls = (type, device) => {
        const banner = banners[type]?.[device];
        if (!banner || banner.length === 0) return [];

        return banner.map((file) =>
            file instanceof File ? URL.createObjectURL(file) : file
        );
    };

    const handleSubmit = async (type) => {
        setLoading((prev) => ({ ...prev, [type]: true }));

        const devices = ['desktop', 'mobile', 'tablet'];
        const uploadedImages = {
            desktop: [],
            mobile: [],
            tablet: []
        };

        try {
            // Iterate through devices to handle each banner type
            for (const device of devices) {
                const bannerData = banners[type]?.[device] || []; // Safely access the data (use empty array if undefined)

                // Filter the images for files (File type) and URLs (String type)
                const newImages = bannerData.filter((image) => image instanceof File);
                const existingUrls = bannerData.filter((image) => typeof image === 'string');

                // Upload new images to Cloudinary
                if (newImages.length > 0) {
                    const uploadPromises = newImages.map((image) => uploadImageToCloudinary(image));
                    const uploadedUrls = await Promise.all(uploadPromises);

                    // Add the newly uploaded URLs to the final device's array
                    uploadedImages[device] = [...uploadedUrls, ...existingUrls];
                } else {
                    // If no new images to upload, just include existing URLs
                    uploadedImages[device] = existingUrls;
                }
            }

            // Send the final uploaded images for each device to the backend
            const response = await fetch(`${BASE_URL}/api/addBannerImages?page=${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(uploadedImages),  // Send separate arrays for each device
            });

            if (response.ok) {
                toast.success(`${type} banners uploaded successfully!`);
            } else {
                const errorData = await response.json();
                console.error('Backend error:', errorData);
                toast.error(`Failed to save ${type} banners.`);
            }
        } catch (error) {
            console.error('Error in handleSubmit:', error.message);
            toast.error(`An error occurred: ${error.message}`);
        } finally {
            setLoading((prev) => ({ ...prev, [type]: false }));
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
                        {[
                            { id: 'homeBanner', label: 'Home Banner' },
                            { id: 'aboutUsBanner', label: 'About Us Page Banner' },
                            { id: 'contactBanner', label: 'Contact Page Banner' },
                            { id: 'destinationBanner', label: 'Destination Page Banner' },
                            { id: 'destinationsBanner', label: 'Destinations Page Banner' },
                            { id: 'blogBanner', label: 'Blog Page Banner' },
                            { id: 'blogsBanner', label: 'Blogs Page Banner' },
                            { id: 'toursBanner', label: 'Tours Page Banner' },
                        ].map(({ id, label }) => (
                            <div className="formGroup" key={id}>
                                <h3>{label}</h3>

                                {['desktop', 'mobile', 'tablet'].map((device) => (
                                    <div key={`${id}-${device}`} className="device-group">
                                        <label htmlFor={`${id}-${device}`}>
                                            {`${label} (${device.charAt(0).toUpperCase() + device.slice(1)})`}
                                        </label>
                                        <input
                                            type="file"
                                            id={`${id}-${device}`}
                                            multiple
                                            onChange={(e) => handleFileChange(e, id, device)}
                                        />
                                        <div className="preview">
                                            {getPreviewUrls(id, device).map((url, index) => (
                                                <div key={index} className="preview-image-container">
                                                    <img src={url} alt={`Preview ${device} ${index}`} />
                                                    <button
                                                        className="delete-banner"
                                                        onClick={(e) => {
                                                            e.preventDefault(); // Prevent form submission
                                                            handleDeleteImage(id, device, url);
                                                          }}
                                                        aria-label={`Delete ${device} Preview ${index}`}
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                <button
                                    type="button"
                                    onClick={() => 
                                         handleSubmit(id)}
                                    disabled={loading[id]}
                                >
                                    {loading[id] ? (
                                        <RotatingLines
                                            visible={true}
                                            height="60"
                                            width="60"
                                            color="grey"
                                            strokeWidth="5"
                                            animationDuration="0.75"
                                            ariaLabel="rotating-lines-loading"
                                        />
                                    ) : (
                                        `Save ${label}`
                                    )}
                                </button>
                            </div>
                        ))}
                    </form>
                </div>

            </div>
            <Toaster />
        </div>
    );
};

export default NewBlog;

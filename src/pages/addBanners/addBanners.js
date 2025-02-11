import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../addBanners/addBanner.css";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { BASE_URL } from "../../utils/headers";
import { FaTrash } from "react-icons/fa";
import { RotatingLines } from "react-loader-spinner";
import { toast, Toaster } from "react-hot-toast";
import {
  CircularProgress, // Importing the CircularProgress component
} from "@mui/material";
const NewBlog = ({ title }) => {
  const [loading, setLoading] = useState({});
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [deletedImages, setDeletedImages] = useState([]);
  const [hiddenImages, setHiddenImages] = useState([]);

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
  console.log(banners);
  const [validationErrors, setValidationErrors] = useState({});
  const handleDeleteImage = (type, device, imageUrl) => {
    // Hide the image by adding it to the hidden images state
    setHiddenImages((prev) => [
      ...prev,
      { type, device, imageUrl }, // Add the image URL to the list of hidden images
    ]);
  };
  

  const handleSubmit = async (type) => {
    setLoading((prev) => ({ ...prev, [type]: true }));
  
    const devices = ["desktop", "mobile", "tablet"];
    const uploadedImages = {
      desktop: [],
      mobile: [],
      tablet: [],
    };
  
    try {
      // Filter out hidden images from the banners
      const updatedBanners = { ...banners };
  
      // Remove hidden images from the preview
      hiddenImages.forEach(({ type, device, imageUrl }) => {
        updatedBanners[type][device] = updatedBanners[type][device].filter(
          (url) => url !== imageUrl
        );
      });
  
      // Handle the image uploads and updates
      for (const device of devices) {
        const bannerData = updatedBanners[type]?.[device] || [];
  
        const newImages = bannerData.filter((image) => image instanceof File);
        const existingUrls = bannerData.filter(
          (image) => typeof image === "string"
        );
  
        if (newImages.length > 0) {
          const uploadPromises = newImages.map((image) =>
            uploadImageToCloudinary(image)
          );
          const uploadedUrls = await Promise.all(uploadPromises);
          uploadedImages[device] = [...uploadedUrls, ...existingUrls];
        } else {
          uploadedImages[device] = existingUrls;
        }
      }
  
      // First, upload the new images to the backend
      const response = await fetch(
        `${BASE_URL}/api/addBannerImages?page=${type}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(uploadedImages),
        }
      );
  
      if (response.ok) {
        // After uploading, delete hidden images (not immediately after hiding)
        await handleDeleteHiddenImages();
        toast.success(`${type} banners uploaded and hidden images deleted successfully!`);
      } else {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        toast.error(`Failed to save ${type} banners.`);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error.message);
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };
  

  const handleDeleteHiddenImages = async () => {
    try {
      for (const { type, device, imageUrl } of hiddenImages) {
        const deleteResponse = await fetch(`${BASE_URL}/api/deleteBannerImage`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl, page: type, device }),
        });
  
        const deleteResult = await deleteResponse.json();
        if (!deleteResult.success) {
          console.error("Error deleting image:", deleteResult.error);
        }
      }
      // Clear hidden images after deletion
      setHiddenImages([]);
    } catch (error) {
      console.error("Error deleting hidden images:", error);
      toast.error("An error occurred while deleting hidden images.");
    }
  };
  

  // Fetch existing banner images from the backend
  useEffect(() => {
    const fetchBanners = async () => {
      setIsFormLoading(true);
      try {
        const bannerTypes = [
          "homeBanner",
          "aboutUsBanner",
          "contactBanner",
          "destinationBanner",
          "destinationsBanner",
          "blogBanner",
          "blogsBanner",
          "toursBanner",
        ];

        const fetchedBanners = {};

        for (const type of bannerTypes) {
          const response = await fetch(
            `${BASE_URL}/api/getBanner?page=${type}`
          );
          if (response.ok) {
            const result = await response.json();
            fetchedBanners[type] = result.data?.bannerUrls || []; // Store the fetched banner URLs
          } else {
            fetchedBanners[type] = []; // If no banners exist, set empty array
          }
        }

        setBanners(fetchedBanners); // Update state with fetched banners
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setIsFormLoading(false);
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
    formData.append("file", imageFile); // Image file to upload
    formData.append("upload_preset", "devsthan"); // Your Cloudinary upload preset

    const cloudinaryURL = "https://api.cloudinary.com/v1_1/drsexfijb/image/upload";

    try {
      const response = await fetch(cloudinaryURL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image to Cloudinary");
      }

      const data = await response.json();
      return data.secure_url; // Returns the URL of the uploaded image
    } catch (error) {
      console.error("Error uploading image:", error.message);
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

  // const handleSubmit = async (type) => {  // Set global loader on

  //   setLoading((prev) => ({ ...prev, [type]: true }));

  //   const devices = ["desktop", "mobile", "tablet"];
  //   const uploadedImages = {
  //     desktop: [],
  //     mobile: [],
  //     tablet: [],
  //   };

  //   try {
  //     for (const device of devices) {
  //       const bannerData = banners[type]?.[device] || [];

  //       const newImages = bannerData.filter((image) => image instanceof File);
  //       const existingUrls = bannerData.filter(
  //         (image) => typeof image === "string"
  //       );

  //       if (newImages.length > 0) {
  //         const uploadPromises = newImages.map((image) =>
  //           uploadImageToCloudinary(image)
  //         );
  //         const uploadedUrls = await Promise.all(uploadPromises);
  //         uploadedImages[device] = [...uploadedUrls, ...existingUrls];
  //       } else {
  //         uploadedImages[device] = existingUrls;
  //       }
  //     }

  //     const response = await fetch(
  //       `${BASE_URL}/api/addBannerImages?page=${type}`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify(uploadedImages),
  //       }
  //     );

  //     if (response.ok) {
  //       toast.success(`${type} banners uploaded successfully!`);
  //     } else {
  //       const errorData = await response.json();
  //       console.error("Backend error:", errorData);
  //       toast.error(`Failed to save ${type} banners.`);
  //     }
  //   } catch (error) {
  //     console.error("Error in handleSubmit:", error.message);
  //     toast.error(`An error occurred: ${error.message}`);
  //   } finally { // Set global loader off
  //     setLoading((prev) => ({ ...prev, [type]: false }));
  //   }
  // };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title || "Add Banners"}</h1>
        </div>
        {isFormLoading ? (
          <div className="loader">
            <CircularProgress />
          </div>
        ) : (
          <div className="bottom">
            <form>
              {[
                { id: "homeBanner", label: "Home Banner" },
                { id: "aboutUsBanner", label: "About Us Page Banner" },
                { id: "contactBanner", label: "Contact Page Banner" },
                { id: "destinationBanner", label: "Destination Page Banner" },
                { id: "destinationsBanner", label: "Destinations Page Banner" },
                { id: "blogBanner", label: "Blog Page Banner" },
                { id: "blogsBanner", label: "Blogs Page Banner" },
                { id: "toursBanner", label: "Tours Page Banner" },
              ].map(({ id, label }) => (
                <div className="formGroup" key={id}>
                  <h3>{label}</h3>

                  {["desktop(width: 1350px ,only for Home Banner ->  height: 700px;, others ->  height: 400px)", "mobile(width: 600px ,only for Home Banner ->  height: 600px;, others ->  height: 400px)", "tablet (width: 900px ,only for Home Banner ->  height: 800px;, others ->  height: 400px)"].map((device) => (
                    <div key={`${id}-${device}`} className="device-group">
                      <label htmlFor={`${id}-${device}`}>
                        {`${label} (${
                          device.charAt(0).toUpperCase() + device.slice(1)
                        })`}
                      </label>
                      <input
                        type="file"
                        id={`${id}-${device}`}
                        multiple
                        onChange={(e) => handleFileChange(e, id, device)}
                      />
                      <div className="preview">
                        {getPreviewUrls(id, device).map((url, index) => {
                          // Skip rendering hidden images
                          if (
                            hiddenImages.some((img) => img.imageUrl === url)
                          ) {
                            return null; // Do not render this image if it is in the hiddenImages list
                          }

                          return (
                            <div
                              key={index}
                              className="preview-image-container"
                            >
                              <img
                                src={url}
                                alt={`Preview ${device} ${index}`}
                              />
                              <button
                                className="delete-banner"
                                onClick={(e) => {
                                  e.preventDefault(); // Prevent form submission
                                  handleDeleteImage(id, device, url);
                                }}
                                aria-label={`Hide ${device} Preview ${index}`}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div
                    className="button-container"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginLeft: "20px",
                      marginRight: "20px",
                    }}
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
                      <button type="button" onClick={() => handleSubmit(id)}>
                        Save {label}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </form>
          </div>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default NewBlog;

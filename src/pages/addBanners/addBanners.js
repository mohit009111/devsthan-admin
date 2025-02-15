import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "../addBanners/addBanner.css";
import { FaTrash } from "react-icons/fa";
import { RotatingLines } from "react-loader-spinner";
import { toast, Toaster } from "react-hot-toast";
import { CircularProgress } from "@mui/material";
import { BASE_URL } from "../../utils/headers";

const NewBlog = ({ title }) => {
  const [loading, setLoading] = useState({});
  const [isFormLoading, setIsFormLoading] = useState(false);
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

  useEffect(() => {
    const fetchBanners = async () => {
      setIsFormLoading(true);
      try {
        const bannerTypes = Object.keys(banners);
        const fetchedBanners = {};

        for (const type of bannerTypes) {
          const response = await fetch(`${BASE_URL}/api/getBanner?page=${type}`);
          fetchedBanners[type] = response.ok ? (await response.json()).data?.bannerUrls || [] : [];
        }

        setBanners(fetchedBanners);
      } catch (error) {
        console.error("Error fetching banners:", error);
      } finally {
        setIsFormLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const handleFileChange = (e, type, device) => {
    const newFiles = Array.from(e.target.files);

    setBanners((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [device]: [...(prev[type][device] || []), ...newFiles], // Append new files for preview
      },
    }));
  };


  const handleDeleteImage = (type, device, imageUrl) => {
    setBanners((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [device]: prev[type][device].filter((img) => img !== imageUrl),
      },
    }));
  };


  const handleSubmit = async (type) => {
    setLoading((prev) => ({ ...prev, [type]: true }));
    try {
      const uploadedImages = {};
      for (const device of ["desktop", "mobile", "tablet"]) {
        const bannerData = banners[type]?.[device] || [];
        const newImages = bannerData.filter((img) => img instanceof File);
        const existingUrls = bannerData.filter((img) => typeof img === "string");

        const uploadedUrls = newImages.length > 0 ? await Promise.all(newImages.map(uploadImageToCloudinary)) : [];
        uploadedImages[device] = [...uploadedUrls, ...existingUrls];
      }

      const response = await fetch(`${BASE_URL}/api/addBannerImages?page=${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(uploadedImages),
      });

      if (response.ok) {
        toast.success(`${type} banners updated successfully!`);
      } else {
        toast.error(`Failed to update ${type} banners.`);
      }
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    } finally {
      setLoading((prev) => ({ ...prev, [type]: false }));
    }
  };
  const handleDeleteHiddenImages = async () => {
    try {
      for (const { type, device, imageUrl } of hiddenImages) {
        await fetch(`${BASE_URL}/api/deleteBannerImage`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageUrl, page: type, device }),
        });
      }
      setHiddenImages([]);
    } catch (error) {
      toast.error("Error deleting hidden images.");
    }
  };

  const uploadImageToCloudinary = async (imageFile) => {
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "devsthan");

    try {
      const response = await fetch("https://api.cloudinary.com/v1_1/drsexfijb/image/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Image upload failed");
      return (await response.json()).secure_url;
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top"><h1>{title || "Add Banners"}</h1></div>
        {isFormLoading ? (
          <div className="loader"><CircularProgress /></div>
        ) : (
          <div className="bottom">
            <form>
              {Object.keys(banners).map((id) => (
                <div className="formGroup" key={id}>
                  <h3>{id.replace("Banner", " Page Banner")}</h3>
                  {["desktop", "mobile", "tablet"].map((device) => (
                    <div key={`${id}-${device}`} className="device-group">
                      <label htmlFor={`${id}-${device}`}>{`${device} banner`}</label>
                      <input type="file" id={`${id}-${device}`} multiple onChange={(e) => handleFileChange(e, id, device)} />
                      <div className="preview">
                        {banners[id][device]?.map((file, index) => {
                          const imgSrc = file instanceof File ? URL.createObjectURL(file) : file; // Show preview for new uploads
                          return (
                            <div key={index} className="preview-image-container">
                              <img src={imgSrc} alt={`${device} preview`} />
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  handleDeleteImage(id, device, file);
                                }}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <button type="button" onClick={() => handleSubmit(id)}>{loading[id] ? <RotatingLines /> : `Save ${id}`}</button>
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
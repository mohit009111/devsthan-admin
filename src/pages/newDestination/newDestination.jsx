import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import '../newDestination/newDestination.css'
import Select from 'react-select';
import { Country, State, City } from 'country-state-city';
import { BASE_URL } from '../../utils/headers';
import { RotatingLines } from 'react-loader-spinner'
import { v4 as uuidv4 } from 'uuid';
import { toast,ToastContainer } from 'react-hot-toast';
const NewDestination = ({ title }) => {
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [destinationData, setDestinationData] = useState({
        uuid: uuidv4(),
        bannerImage: null,
        description: '',
        country: null,
        state: null,
        location:"",
        city: null,
        images: [],
        population: '',
        languages: '',
        capitalCity: '',
        subDestinations: [{ name: '', description: '', photos: [] }],
        highlights: [{ image: '', heading: '', subHeading: '' }],
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
    const handleTagsChange = (e) => {
        const { name, value } = e.target;
        const keys = name.split('.');
      
        setDestinationData((prev) => {
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
  const uploadImageToCloudinary = async (image) => {
      try {
        if (typeof image === "string") {
          return image; // If it's already a Cloudinary URL, return it as is.
        }
    
        const cloudinaryURL = "https://api.cloudinary.com/v1_1/drsexfijb/image/upload";
        const formData = new FormData();
        formData.append("file", image); // Directly append the File object.
        formData.append("upload_preset", "devsthan");
    
        const response = await fetch(cloudinaryURL, {
          method: "POST",
          body: formData,
        });
    
        if (!response.ok) {
          throw new Error("Cloudinary upload failed");
        }
    
        const data = await response.json();
        return data.secure_url; // Return the uploaded image URL.
      } catch (error) {
        console.error("Image upload error:", error);
        throw error;
      }
    };
    
    const isCloudinaryUrl = (url) =>
      typeof url === "string" && url.startsWith("https://res.cloudinary.com/");
    
    const handleSubmit = async () => {
      setLoading(true);
    
      // Create a copy of the destination data
      const updatedData = { ...destinationData };
    
      try {
        // Upload banner image if needed
        if (updatedData.bannerImage && !isCloudinaryUrl(updatedData.bannerImage)) {
          updatedData.bannerImage = await uploadImageToCloudinary(updatedData.bannerImage);
        }
    
        // Upload images array if needed
        if (updatedData.images && updatedData.images.length > 0) {
          const imageUploads = await Promise.all(
            updatedData.images.map(async (img) =>
              isCloudinaryUrl(img) ? img : await uploadImageToCloudinary(img)
            )
          );
          updatedData.images = imageUploads;
        }
    
        // Upload subDestinations' photos
        if (updatedData.subDestinations && updatedData.subDestinations.length > 0) {
          updatedData.subDestinations = await Promise.all(
            updatedData.subDestinations.map(async (destination) => {
              if (destination.photos && destination.photos.length > 0) {
                const uploadedPhotos = await Promise.all(
                  destination.photos.map(async (photo) =>
                    isCloudinaryUrl(photo) ? photo : await uploadImageToCloudinary(photo)
                  )
                );
                return { ...destination, photos: uploadedPhotos };
              }
              return destination;
            })
          );
        }
    
        // Upload highlights' images
        if (updatedData.highlights && updatedData.highlights.length > 0) {
          updatedData.highlights = await Promise.all(
            updatedData.highlights.map(async (highlight) => {
              if (highlight.image && !isCloudinaryUrl(highlight.image)) {
                const uploadedImage = await uploadImageToCloudinary(highlight.image);
                return { ...highlight, image: uploadedImage };
              }
              return highlight;
            })
          );
        }
    
        // Send updated data to backend
        const response = await fetch(`${BASE_URL}/api/createDestination`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });
    
        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(`Failed to create destination: ${errorResponse.error}`);
        }
    
        toast.success("Destination created successfully!");
      } catch (error) {
        console.error("Upload failed:", error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    // Handle text and number field changes
    const handleInputChange = (e, field) => {
        setDestinationData({
            ...destinationData,
            [field]: e.target.value,
        });
    };

    // Handle image upload
    const handleImageUpload = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setDestinationData({
                ...destinationData,
                [field]: file,
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        setDestinationData((prev) => ({
          ...prev,
          [name]: value,
        }));
      };
    const handleMultipleImageUpload = (e) => {
        const files = Array.from(e.target.files); // Store actual file objects
        setDestinationData({
            ...destinationData,
            images: [...destinationData.images, ...files], // Append new File objects to the array
        });
    };
    const removeHighlightImage = (index) => {
        const updatedHighlights = [...destinationData.highlights];
        updatedHighlights[index].image = null; // Remove the image by setting it to null
        setDestinationData({
          ...destinationData,
          highlights: updatedHighlights,
        });
      };

    // Updated handleDestinationChange for handling multiple images in destinations
    const handleDestinationChange = (index, field, value) => {
        setDestinationData((prevData) => {
            const updatedSubDestinations = [...prevData.subDestinations];

            if (field === 'photos') {
                // Handle multiple images by adding `File` objects directly
                const files = Array.from(value);
                updatedSubDestinations[index] = {
                    ...updatedSubDestinations[index],
                    photos: [...updatedSubDestinations[index].photos, ...files] // Append new files to photos
                };
            } else {
                // Handle text input fields like 'name' and 'description'
                updatedSubDestinations[index] = {
                    ...updatedSubDestinations[index],
                    [field]: value, // Update the text field value
                };
            }
            return { ...prevData, subDestinations: updatedSubDestinations };
        });
    };


    const handleHighlightChange = (index, field, value) => {
        const updatedHighlights = [...destinationData.highlights];
        updatedHighlights[index][field] = value;
        setDestinationData({ ...destinationData, highlights: updatedHighlights });
    };

    const addDestination = () => {
        setDestinationData({
            ...destinationData,
            subDestinations: [...destinationData.subDestinations, { name: '', description: '', photos: [] }],
        });
    };

    const addHighlight = () => {
        setDestinationData({
            ...destinationData,
            highlights: [...destinationData.highlights, { image: '', heading: '', subHeading: '' }],
        });
    };

    // Remove destination by index
    const removeDestination = (index) => {
        const updatedDestinations = destinationData.destinations.filter((_, i) => i !== index);
        setDestinationData({ ...destinationData, destinations: updatedDestinations });
    };

    // Remove highlight by index
    const removeHighlight = (index) => {
        const updatedHighlights = destinationData.highlights.filter((_, i) => i !== index);
        setDestinationData({ ...destinationData, highlights: updatedHighlights });
    };
    useEffect(() => {
        const countryOptions = Country.getAllCountries().map((country) => ({
            value: country.isoCode,
            label: country.name,
        }));
        setCountries(countryOptions);
    }, []);
    useEffect(() => {
        if (destinationData.country) {
            const stateOptions = State.getStatesOfCountry(destinationData.country.value).map((state) => ({
                value: state.isoCode,
                label: state.name,
            }));
            setStates(stateOptions);
            setCities([]); // Clear cities when country changes
            setDestinationData({ ...destinationData, state: null, city: null }); // Reset state and city selection
        }
    }, [destinationData.country]);
    useEffect(() => {
        if (destinationData.country && destinationData.state) {
            const cityOptions = City.getCitiesOfState(destinationData.country.value, destinationData.state.value).map((city) => ({
                value: city.name,
                label: city.name,
            }));
            setCities(cityOptions);
            setDestinationData({ ...destinationData, city: null }); // Reset city selection
        }
    }, [destinationData.state]);
    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>{title}</h1>
                </div>
                <div className="formContainer">
                    <div className="formGroup">
                        <label>Country</label>
                        <Select
                            options={countries}
                            value={destinationData.country}
                            onChange={(selectedCountry) => setDestinationData({ ...destinationData, country: selectedCountry })}
                            placeholder="Select Country"
                        />
                    </div>
                    <div className="formGroup">
                        <label>State</label>
                        <Select
                            options={states}
                            value={destinationData.state}
                            onChange={(selectedState) => setDestinationData({ ...destinationData, state: selectedState })}
                            placeholder="Select State"
                            isDisabled={!destinationData.country}
                        />
                    </div>
                    <div className="formGroup">
                        <label>City</label>
                        <Select
                            options={cities}
                            value={destinationData.city}
                            onChange={(selectedCity) => setDestinationData({ ...destinationData, city: selectedCity })}
                            placeholder="Select City"
                            isDisabled={!destinationData.state}
                        />
                    </div>
                    <div className="formGroup">
                        <label>location</label>
                        <input
                            value={destinationData.location}
                            onChange={(e) => handleInputChange(e, 'location')}
                        />
                    </div>
                    <div className="formGroup">
                        <label>Banner Image (width: 500px, height:600px)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'bannerImage')}
                        />
                    </div>
                    <div className="formGroup">
                        <label>Description</label>
                        <textarea
                            value={destinationData.description}
                            onChange={(e) => handleInputChange(e, 'description')}
                        ></textarea>
                    </div>
                    <div className="formGroup">
                        <label>Population</label>
                        <input
                            type="text"
                            value={destinationData.population}
                            onChange={(e) => handleInputChange(e, 'population')}
                        />
                    </div>
                    <div className="formGroup">
                        <label>Languages</label>
                        <input
                            type="text"
                            value={destinationData.languages}
                            onChange={(e) => handleInputChange(e, 'languages')}
                        />
                    </div>
                   

                    <div className="formGroup">
                        <label>Images </label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleMultipleImageUpload}
                        />
                        <div className="imagePreview">
                            {destinationData.images.map((image, index) => (
                                <img key={index} src={image} alt={`Preview ${index}`} className="previewImg" />
                            ))}
                        </div>
                    </div>
                    <h2>SEO & Social Media Tags</h2>


<div className="formGroup">
  <label>Meta Title</label>
  <input
    type="text"
    name="metaTitle"
    value={destinationData?.metaTitle}
    onChange={handleChange}
    placeholder="Enter meta title"
    required
  />
</div>


<div className="formGroup">
  <label>Meta Description</label>
  <textarea
    name="metaDescription"
    value={destinationData?.metaDescription}
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
    value={destinationData?.metaKeywords}
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
    value={destinationData?.canonicalUrl}
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
    value={destinationData?.openGraph?.title}
    onChange={handleTagsChange}
    placeholder="Enter OG title"
    required
  />
</div>

<div className="formGroup">
  <label>OG Description</label>
  <textarea
    name="openGraph.description"
    value={destinationData?.openGraph?.description}
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
    value={destinationData?.openGraph?.url}
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
    value={destinationData?.openGraph?.image}
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
    value={destinationData?.openGraph?.type}
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
    value={destinationData?.twitter?.title}
    onChange={handleTagsChange}
    placeholder="Enter Twitter title"
    required
  />
</div>

<div className="formGroup">
  <label>Twitter Description</label>
  <textarea
    name="twitter.description"
    value={destinationData?.twitter?.description}
    onChange={handleTagsChange}
    placeholder="Enter Twitter description"
    required
  />
</div>

                    <h2>Sub Destinations</h2>
                    {destinationData.subDestinations.map((destination, index) => (
                        <div key={index} className="formGroup">
                            <input
                                type="text"
                                placeholder="Destination Name"
                                value={destination.name}
                                onChange={(e) => handleDestinationChange(index, 'name', e.target.value)}
                            />
                            <textarea
                                placeholder="Description"
                                value={destination.description}
                                onChange={(e) => handleDestinationChange(index, 'description', e.target.value)}
                            />
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleDestinationChange(index, 'photos', e.target.files)}
                            />

                            <div className="imagePreview">
                                {destination.photos.map((image, index) => (
                                    <img key={index} src={image} alt={`Preview ${index}`} className="previewImg" />
                                ))}
                            </div>
                            {destinationData.subDestinations.length > 1 ? <button onClick={() => removeDestination(index)} className="deleteButton">
                                Delete Destination
                            </button> : null}

                        </div>
                    ))}
                    <button onClick={addDestination}>Add Another Destination</button>

                    <h2>Highlights</h2>
                    {destinationData?.highlights?.map((highlight, index) => (
  <div key={index} className="formGroup">
    <input
      type="file"
      accept="image/*"
      onChange={(e) =>
        handleHighlightChange(index, "image", e.target.files[0])
      }
    />

    {highlight.image && (
      <div className="imageContainer">
        <img
          src={
            typeof highlight.image === "string"
              ? highlight.image // Cloudinary URL
              : URL.createObjectURL(highlight.image) // Local File Preview
          }
          alt="Highlight Preview"
          style={{ width: "100px", height: "100px" }}
        />
        <button
          className="deleteImageButton"
          onClick={() => removeHighlightImage(index)}
        >
          Delete Image
        </button>
      </div>
    )}

    <input
      type="text"
      placeholder="Heading"
      value={highlight.heading}
      onChange={(e) =>
        handleHighlightChange(index, "heading", e.target.value)
      }
    />
    <input
      type="text"
      placeholder="Sub Heading"
      value={highlight.subHeading}
      onChange={(e) =>
        handleHighlightChange(index, "subHeading", e.target.value)
      }
    />

    {destinationData.highlights.length > 1 ? (
      <button
        onClick={() => removeHighlight(index)}
        className="deleteButton"
      >
        Delete Highlight
      </button>
    ) : null}
  </div>
))}
                    <button onClick={addHighlight}>Add Another Highlight</button>
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
                    <button onClick={handleSubmit}>Submit</button> // Show submit button
                )}


            </div>
        </div>
    );
};

export default NewDestination;

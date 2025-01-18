import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import '../newDestination/newDestination.css'
import Select from 'react-select';
import { Country, State, City } from 'country-state-city';
import { BASE_URL } from '../../utils/headers';
import { RotatingLines } from 'react-loader-spinner'
import { useParams } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';
import { toast, ToastContainer } from 'react-hot-toast';
const NewDestination = ({ title }) => {
    const { id } = useParams();
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [loading, setLoading] = useState(false);
    const [destinationData, setDestinationData] = useState({

    });


    const fetchAllDestination = async () => {

        try {
            const response = await fetch(`${BASE_URL}/api/getDestinationById/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();

            setDestinationData(data)


        } catch (error) {
            console.error("Error fetching tours:", error);
        }
    };

    useEffect(() => {

        fetchAllDestination();
    }, []);
    const uploadImageToCloudinary = async (image) => {
        try {
            const cloudinaryURL = 'https://api.cloudinary.com/v1_1/dmyzudtut/image/upload';
            const formData = new FormData();
            formData.append('file', image);
            formData.append('upload_preset', 'ljqbwqy9');

            const response = await fetch(cloudinaryURL, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Cloudinary upload failed');
            }

            const data = await response.json();
            return data.secure_url;
        } catch (error) {
            console.error('Image upload error:', error);
            throw error;
        }
    };
    const isCloudinaryUrl = (url) => typeof url === 'string' && url.startsWith('https://res.cloudinary.com/');
    const handleSubmit = async () => {
        setLoading(true);

        // Prepare a copy of destinationData
        const updatedData = { ...destinationData };

        try {
            // Upload banner image if needed
            if (updatedData.bannerImage && !isCloudinaryUrl(updatedData.bannerImage)) {
                updatedData.bannerImage = await uploadImageToCloudinary(updatedData.bannerImage.file);
            }

            // Upload images array if needed
            if (updatedData.images && updatedData.images.length > 0) {
                const imageUploads = await Promise.all(
                    updatedData.images.map(async (img) =>
                        isCloudinaryUrl(img) ? img : await uploadImageToCloudinary(img.file)
                    )
                );
                updatedData.images = imageUploads;
            }

            // Process subDestinations
            updatedData.subDestinations = await Promise.all(
                updatedData.subDestinations.map(async (destination) => {
                    if (destination.photos && destination.photos.length > 0) {
                        const uploadedPhotos = await Promise.all(
                            destination.photos.map(async (photo) =>
                                isCloudinaryUrl(photo) ? photo : await uploadImageToCloudinary(photo.file)
                            )
                        );
                        return { ...destination, photos: uploadedPhotos };
                    }
                    return destination;
                })
            );

            // Process highlights
            updatedData.highlights = await Promise.all(
                updatedData.highlights.map(async (highlight) => {
                    if (highlight.image && !isCloudinaryUrl(highlight.image)) {
                        const uploadedImage = await uploadImageToCloudinary(highlight.image.file);
                        return { ...highlight, image: uploadedImage };
                    }
                    return highlight;
                })
            );

            // Send updated data to backend
            const response = await fetch(`${BASE_URL}/api/createDestination`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(`Failed to create destination: ${errorResponse.error}`);
            }

            toast.success('Destination created successfully!');
        } catch (error) {
            console.error('Upload failed:', error);
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
            setDestinationData((prevData) => ({
                ...prevData,
                [field]: {
                    file, // Store file for upload
                    preview: URL.createObjectURL(file), // Local preview URL
                },
            }));
        }
    };


    const handleMultipleImageUpload = (e) => {
        const files = Array.from(e.target.files); // Store actual file objects
        setDestinationData({
            ...destinationData,
            images: [...destinationData.images, ...files], // Append new File objects to the array
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
        if (field === 'image') {
            updatedHighlights[index][field] = value; // Save the file directly
        } else {
            updatedHighlights[index][field] = value;
        }
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
                        <label>Banner Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, 'bannerImage')}
                        />
                        <img
                        key={destinationData.bannerImage?.preview || destinationData.bannerImage}
                src={
                    typeof destinationData.bannerImage === 'string'
                        ? destinationData.bannerImage
                        : destinationData.bannerImage?.preview
                }
                alt="Preview"
                className="previewImg"
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
                        <label>Capital City</label>
                        <input
                            type="text"
                            value={destinationData.capitalCity}
                            onChange={(e) => handleInputChange(e, 'capitalCity')}
                        />
                    </div>
                    <div className="formGroup">
                            <label>Meta Title</label>
                            <input
                                type="text"
                                name="metaTitle"
                                value={destinationData.metaTitle}
                                onChange={(e) => handleInputChange(e, 'metaTitle')}
                                placeholder="Enter Meta Title"
                            />
                        </div>
                        <div className="formGroup">
                            <label>Meta Description</label>
                            <input
                                type="text"
                                name="metaDescription"
                                value={destinationData.metaDescription}
                                onChange={(e) => handleInputChange(e, 'metaDescription')}
                                placeholder="Enter Meta Description"
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
                            {destinationData.images && destinationData.images.map((image, index) => (
                                <div key={index} className="imageContainer">
                                    <img
                                        src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                        alt={`Preview ${index}`}
                                        className="previewImg"
                                    />
                                    <button
                                        className="removeImageButton"
                                        onClick={() => {
                                            const updatedImages = destinationData.images.filter((_, i) => i !== index);
                                            setDestinationData({ ...destinationData, images: updatedImages });
                                        }}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                    </div>

                    <h2>Sub Destinations</h2>
                    {destinationData?.subDestinations?.map((destination, index) => (
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

                                {destination?.photos?.map((photo, index) => {
                                    // Determine the source of the image (File or existing URL)
                                    const photoSrc = photo instanceof File ? URL.createObjectURL(photo) : photo;

                                    return (
                                        <img
                                            key={index}
                                            src={photoSrc}
                                            alt={`Preview ${index}`}
                                            className="previewImg"
                                        />
                                    );
                                })}
                            </div>
                            {destinationData?.subDestinations.length > 1 ? <button onClick={() => removeDestination(index)} className="deleteButton">
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
                                onChange={(e) => handleHighlightChange(index, 'image', e.target.files[0])}
                            />
                            {highlight.image && typeof highlight.image !== 'string' && (
                                <img
                                    src={URL.createObjectURL(highlight.image)}
                                    alt="Highlight Preview"
                                    style={{ width: '100px', height: '100px' }}
                                />
                            )}
                            <input
                                type="text"
                                placeholder="Heading"
                                value={highlight.heading}
                                onChange={(e) => handleHighlightChange(index, 'heading', e.target.value)}
                            />
                            <input
                                type="text"
                                placeholder="Sub Heading"
                                value={highlight.subHeading}
                                onChange={(e) => handleHighlightChange(index, 'subHeading', e.target.value)}
                            />
                            {destinationData.highlights.length > 1 ? (
                                <button onClick={() => removeHighlight(index)} className="deleteButton">
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

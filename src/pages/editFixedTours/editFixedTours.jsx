import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/sidebar/Sidebar';
import Navbar from '../../components/navbar/Navbar';
import { RotatingLines } from "react-loader-spinner";
import '../newFixedTour/newFixedTour.css';
import { toast, ToastContainer } from "react-hot-toast";
import "react-quill/dist/quill.snow.css";
import { v4 as uuidv4 } from "uuid";
import ReactQuill from "react-quill";
import { BASE_URL } from "../../utils/headers";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useParams } from "react-router-dom";
const NewDestination = ({ title }) => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [attributes, setAttributes] = useState([]);
    const [destinations, setDestinations] = useState("");
    const [tourData, setTourData] = useState({})
    const { id } = useParams();
    const handleItineraryPhotos = (index, files, section) => {
        const newPhotos = Array.from(files).map((file) =>
            URL.createObjectURL(file)
        );

        setTourData((prevData) => {
            const updatedItineraries = [...prevData[section].itineraries];

            // Ensure the `photos` array exists
            const existingPhotos = updatedItineraries[index].photos || [];

            // Merge existing photos with new photos, ensuring uniqueness
            const uniquePhotos = [...new Set([...existingPhotos, ...newPhotos])];

            updatedItineraries[index].photos = uniquePhotos;

            return {
                ...prevData,
                [section]: {
                    ...prevData[section],
                    itineraries: updatedItineraries,
                },
            };
        });
    };

    const handleFieldChange = (field, value, category) => {
        setTourData((prevData) => {
            return {
                ...prevData,
                [category]: {
                    ...prevData[category],
                    [field]: value,
                },
            };
        });
    };
    const hotelCategoryOptions = [
        "Luxury",
        "Budget",
        "Boutique",
        "Resort",
        "Eco-Friendly",
    ];

    const handleHotelImages = (index, files, section) => {
        const newPhotos = Array.from(files).map((file) =>
            URL.createObjectURL(file)
        );

        setTourData((prevData) => {
            const updatedItineraries = [...prevData[section].itineraries];

            // Merge existing photos with new ones
            const existingPhotos = updatedItineraries[index].hotel.hotelImages || [];
            updatedItineraries[index].hotel.hotelImages = [
                ...new Set([...existingPhotos, ...newPhotos]),
            ];

            return {
                ...prevData,
                [section]: {
                    ...prevData[section],
                    itineraries: updatedItineraries,
                },
            };
        });
    };
    const handleItineraryDescriptionChange = (index, field, value, category) => {
        if (!tourData[category] || !tourData[category].itineraries) {
            console.error(`Category "${category}" or itineraries are undefined.`);
            return;
        }

        const updatedItineraries = [...tourData[category].itineraries];
        updatedItineraries[index][field] = value;

        setTourData((prevState) => ({
            ...prevState,
            [category]: {
                ...prevState[category],
                itineraries: updatedItineraries,
            },
        }));
    };
    const handleItineraryChange = (index, field, value, category) => {
        if (!tourData[category] || !tourData[category].itineraries) {
            console.error(`Category "${category}" or itineraries are undefined.`);
            return;
        }

        const updatedItineraries = [...tourData[category].itineraries];
        updatedItineraries[index][field] = value;

        setTourData((prevState) => ({
            ...prevState,
            [category]: {
                ...prevState[category],
                itineraries: updatedItineraries,
            },
        }));
    };
    const updateBatch = (index, field, value) => {
        const updatedBatches = [...tourData.batch];
        updatedBatches[index][field] = value;
        setTourData({ ...tourData, batch: updatedBatches });
    };

    // Function to add a new batch
    const addBatch = () => {
        setTourData({
            ...tourData,
            batch: [
                ...tourData.batch,
                {
                    minPeople: "",
                    tourStartDate: "",
                    tourEndDate: "",
                    groupSize: "",
                    minBookingDate: "",
                    seatBooked: "",
                    price: "",
                },
            ],
        });
    };

    // Function to remove a batch
    const removeBatch = (index) => {
        const updatedBatches = tourData.batch.filter((_, i) => i !== index);
        setTourData({ ...tourData, batch: updatedBatches });
    };

    const handleBedPriceChange = (section, index, bedType, priceType, value) => {
        // Update the corresponding section in the tourData state dynamically
        const updatedTourData = { ...tourData };

        // Access the relevant section (standard, deluxe, or premium)
        const sectionData =
            updatedTourData[`${section}Details`].itineraries[index].hotel.beds;

        // Update the price or extra bed price
        sectionData[bedType][priceType] = value;

        // Set the updated state
        setTourData(updatedTourData);
    };
    const handleRoomImages = (index, files, section) => {
        const newPhotos = Array.from(files).map((file) =>
            URL.createObjectURL(file)
        );

        setTourData((prevData) => {
            const updatedItineraries = [...prevData[section].itineraries];

            // Merge new photos with existing ones
            const existingPhotos = updatedItineraries[index].hotel.roomImages || [];
            updatedItineraries[index].hotel.roomImages = [
                ...new Set([...existingPhotos, ...newPhotos]),
            ];

            return {
                ...prevData,
                [section]: {
                    ...prevData[section],
                    itineraries: updatedItineraries,
                },
            };
        });
    };
    const handleLocationSelect = (field, value) => {
        setTourData((prevTourData) => ({
            ...prevTourData,
            [field]: value,
        }));
    };
    const handleMealChange = (e, itineraryIndex, mealType, tourDetailType) => {
        const { checked } = e.target; // Get the checked status
        setTourData((prevState) => {
            const updatedItineraries = [...prevState[tourDetailType].itineraries];
            const updatedItinerary = { ...updatedItineraries[itineraryIndex] };

            // Update the `isAvailable` field for the mealType (e.g., "breakfast")
            updatedItinerary.meals[mealType].isAvailable = checked;

            updatedItineraries[itineraryIndex] = updatedItinerary;

            return {
                ...prevState,
                [tourDetailType]: {
                    ...prevState[tourDetailType],
                    itineraries: updatedItineraries,
                },
            };
        });
    };
    const handleTransportationChange = (index, type, value, section) => {
        setTourData((prev) => {
            const updatedItineraries = [...prev[section].itineraries];
            updatedItineraries[index].transportation[type] = {
                ...updatedItineraries[index].transportation[type],
                ...value,
            };
            return {
                ...prev,
                [section]: { ...prev[section], itineraries: updatedItineraries },
            };
        });
    };
    const handleDestinationSelect = (destinationId) => {
        const selectedDestination = destinations.find(
            (d) => d.state.label === destinationId
        );

        setTourData((prevTourData) => ({
            ...prevTourData,
            destinationId: selectedDestination ? selectedDestination.uuid : "", // Save the uuid
        }));
    };
    const handleBannerImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (tourData.bannerImage) {
                URL.revokeObjectURL(tourData.bannerImage); // Clean up old object URL
            }
            const previewUrl = URL.createObjectURL(file);
            setTourData((prevData) => ({
                ...prevData,
                bannerImage: previewUrl,
            }));
        }
    };
    const handleDeletePhoto = (index) => {
        setTourData((prevData) => {
            // Revoke the object URL for the deleted image
            URL.revokeObjectURL(prevData.images[index]);

            // Remove the image from the `images` array
            const updatedImages = [...prevData.images];
            updatedImages.splice(index, 1);

            return {
                ...prevData,
                images: updatedImages,
            };
        });
    };
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);

        // Generate preview URLs for each uploaded file
        const previewUrls = files.map((file) => URL.createObjectURL(file));

        // Update the `images` array in `tourData` state
        setTourData((prevData) => ({
            ...prevData,
            images: [...prevData.images, ...previewUrls],
        }));

        console.log("Uploaded Images:", previewUrls); // Debug log
    };
    const handleDeleteBanner = () => {
        setTourData((prevState) => ({
            ...prevState,
            bannerImage: "",
        }));
    };
    const handleTransportationPhotos = (index, type, files, section) => {
        const uploadedPhotos = Array.from(files).map((file) =>
            URL.createObjectURL(file)
        );

        setTourData((prev) => {
            const updatedItineraries = [...prev[section].itineraries];
            const existingPhotos =
                updatedItineraries[index].transportation[type].photos || [];

            // Remove duplicates by filtering out photos already in the existing array
            const uniqueUploadedPhotos = uploadedPhotos.filter(
                (newPhoto) => !existingPhotos.includes(newPhoto)
            );

            updatedItineraries[index].transportation[type].photos = [
                ...existingPhotos,
                ...uniqueUploadedPhotos,
            ];

            return {
                ...prev,
                [section]: { ...prev[section], itineraries: updatedItineraries },
            };
        });
    };
    const handleItineraryMealsChange = (
        itineraryIndex,
        mealType,
        field,
        files,
        tourDetailType
    ) => {
        setTourData((prevState) => {
            const updatedItineraries = [...prevState[tourDetailType].itineraries];
            const updatedItinerary = { ...updatedItineraries[itineraryIndex] };

            if (field === "photos") {
                // Get the current list of photos
                const currentPhotos = updatedItinerary.meals[mealType][field];

                // Filter out duplicates by comparing the name and size of each file
                const newFiles = Array.from(files).filter((newFile) => {
                    return !currentPhotos.some(
                        (existingFile) =>
                            existingFile.name === newFile.name &&
                            existingFile.size === newFile.size
                    );
                });

                // Append only the new files (without duplicates)
                updatedItinerary.meals[mealType][field] = [
                    ...currentPhotos,
                    ...newFiles,
                ];
            } else {
                // Update other fields (e.g., name)
                updatedItinerary.meals[mealType][field] = files;
            }

            updatedItineraries[itineraryIndex] = updatedItinerary;

            return {
                ...prevState,
                [tourDetailType]: {
                    ...prevState[tourDetailType],
                    itineraries: updatedItineraries,
                },
            };
        });
    };
    const handleDeleteMealPhoto = (
        itineraryIndex,
        photoIndex,
        mealType,
        tourDetailType
    ) => {
        setTourData((prevState) => {
            const updatedItineraries = [...prevState[tourDetailType].itineraries];
            const updatedItinerary = { ...updatedItineraries[itineraryIndex] };

            updatedItinerary.meals[mealType].photos = updatedItinerary.meals[
                mealType
            ].photos.filter((_, index) => index !== photoIndex);
            updatedItineraries[itineraryIndex] = updatedItinerary;

            return {
                ...prevState,
                [tourDetailType]: {
                    ...prevState[tourDetailType],
                    itineraries: updatedItineraries,
                },
            };
        });
    };
    const handleCategoryRemove = (categoryId) => {
        setTourData((prevData) => ({
            ...prevData,
            categories: prevData.categories.filter((id) => id !== categoryId),
        }));
    };
    const handleCategorySelect = (categoryId) => {
        if (!tourData.categories.includes(categoryId)) {
            setTourData((prevData) => ({
                ...prevData,
                categories: [...prevData.categories, categoryId],
            }));
        }
    };
    const handleActivityPhotos = (index, type, files, section) => {
        const validFiles = Array.from(files).filter((file) => file instanceof File);
        const newPhotos = validFiles.map((file) => URL.createObjectURL(file));

        setTourData((prev) => {
            const updatedItineraries = [...prev[section].itineraries];

            // Ensure the `photos` array exists
            const existingPhotos = updatedItineraries[index][type].photos || [];

            // Remove duplicates
            const uniquePhotos = [...new Set([...existingPhotos, ...newPhotos])];

            // Update the photos
            updatedItineraries[index][type].photos = uniquePhotos;

            return {
                ...prev,
                [section]: { ...prev[section], itineraries: updatedItineraries },
            };
        });
    };
    const removeItinerary = (type, index) => {
        setTourData((prevState) => {
            const newItineraries = prevState[type].itineraries.filter(
                (itinerary, i) => i !== index
            );
            return {
                ...prevState,
                [type]: {
                    ...prevState[type],
                    itineraries: newItineraries,
                },
            };
        });
    };
    const addItinerary = (category) => {
        const newItineraryIndex = tourData[category].itineraries.length;
        const newItinerary = {
            day: newItineraryIndex + 1, // Increment day number
            title: "",
            description: "",

            photos: [],
            tourManager: {
                price: "",
                isAvailable: false,
                name: "",
                photo: "",
                description: "",
                departureFrom: "",
                arrivalTo: "",
            },
            welcomeDrinks: false,
            hotel: {
                isIncluded: false,
                name: "",
                url: "",
                hotelCategory: "",
                hotelImages: [],

                roomCategory: "",
                roomImages: [],
                location: "",
                beds: {
                    doubleBed: {
                        price: null,
                        extraBedPrice: null,
                    },
                    tripleBed: {
                        price: null,
                        extraBedPrice: null,
                    },
                    fourBed: {
                        price: null,
                        extraBedPrice: null,
                    },
                    fiveBed: {
                        price: null,
                        extraBedPrice: null,
                    },
                    sixBed: {
                        price: null,
                        extraBedPrice: null,
                    },
                },
            },
            activities: [{
                isIncluded: false,
                name: "",
                description: "",
                price: "",
                photos: [],
            }],
            transportation: {
                isIncluded: false,
                car: {
                    isIncluded: false,
                    name: "",
                    category: "",
                    price: "",
                    departureFrom: "",
                    arrivalTo: "",

                    description: "",
                    departureTime: "",
                    photos: [],
                },
                bus: {
                    isIncluded: false,
                    name: "",
                    category: "",
                    price: "",
                    departureFrom: "",
                    arrivalTo: "",

                    description: "",
                    departureTime: "",
                    photos: [],
                },
                train: {
                    isIncluded: false,
                    name: "",
                    category: "",
                    price: "",
                    departureFrom: "",
                    arrivalTo: "",

                    description: "",
                    departureTime: "",
                    photos: [],
                },
                flight: {
                    isIncluded: false,
                    name: "",
                    category: "",
                    price: "",
                    departureFrom: "",
                    arrivalTo: "",

                    description: "",
                    departureTime: "",
                    photos: [],
                },
                chopper: {
                    isIncluded: false,
                    name: "",
                    company: "",
                    category: "",
                    price: "",
                    departureFrom: "",
                    arrivalTo: "",

                    description: "",
                    departureTime: "",
                    photos: [],
                },
            },

            meals: {
                breakfast: {
                    isAvailable: false,
                    name: "",
                    photos: [],
                },
                lunch: {
                    isAvailable: false,
                    name: "",
                    photos: [],
                },
                dinner: {
                    isAvailable: false,
                    name: "",
                    photos: [],
                },
            },
            siteSeen: [{
                isAvailable: false,
                name: "",
                description: "",
                photos: [],
            }],
        };

        // Update state with the new itinerary
        setTourData((prevData) => ({
            ...prevData,
            [category]: {
                ...prevData[category],
                itineraries: [...prevData[category].itineraries, newItinerary],
            },
        }));
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        const handleSaveChanges = async () => {
            try {
                setLoading(true);

                const cloudinaryURL =
                    "https://api.cloudinary.com/v1_1/drsexfijb/image/upload";
                const uploadPreset = "devsthan";

                // Helper: Upload a single image to Cloudinary
                const uploadImageToCloudinary = async (image) => {
                    if (!image) return null; // Skip invalid images

                    // Skip if the image is already a URL
                    if (typeof image === "string" && image.startsWith("http")) {
                        return image;
                    }

                    // If the image is a blob URL, fetch the blob and convert it to a File
                    if (typeof image === "string" && image.startsWith("blob:")) {
                        const blob = await fetch(image).then((res) => res.blob());
                        console.log("Converted Blob to File:", blob);
                        image = new File([blob], "image.jpg", { type: blob.type });
                    }

                    const formData = new FormData();
                    formData.append("file", image);
                    formData.append("upload_preset", uploadPreset);

                    const response = await fetch(cloudinaryURL, {
                        method: "POST",
                        body: formData,
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log("Uploaded to Cloudinary:", data.secure_url);
                        return data.secure_url;
                    } else {
                        const errorData = await response.json();
                        console.error("Cloudinary Upload Error:", errorData);
                        throw new Error(
                            errorData.error?.message || "Failed to upload image"
                        );
                    }
                };

                // Helper: Upload multiple images
                const uploadImagesForField = async (photos = []) => {
                    if (!Array.isArray(photos)) return [];
                    return await Promise.all(
                        photos.map(async (photo, index) => {
                            try {
                                if (photo) {
                                    const uploadedUrl = await uploadImageToCloudinary(photo);
                                    console.log(`Uploaded photo ${index + 1}:`, uploadedUrl);
                                    return uploadedUrl;
                                }
                                return null;
                            } catch (error) {
                                console.error(`Error uploading photo ${index + 1}:`, error);
                                return null;
                            }
                        })
                    );
                };

                // Helper: Append uploaded image URLs to itinerary fields
                const appendImagesToItinerary = async (itinerary) => {
                    if (!itinerary) return;

                    const uploadFields = [
                        { key: "photos", photos: itinerary.photos },
                        { key: "welcomeDrinks.photos", photos: itinerary.welcomeDrinks?.photos },
                        { key: "hotel.hotelImages", photos: itinerary.hotel?.hotelImages },
                        { key: "hotel.roomImages", photos: itinerary.hotel?.roomImages },
                        { key: "tourManager.photo", photos: itinerary.tourManager?.photo },
                        { key: "activity.photos", photos: itinerary.activity?.photos },
                    ];

                    // Upload for meals
                    const mealTypes = ["breakfast", "lunch", "dinner"];
                    mealTypes.forEach((mealType) => {
                        if (Array.isArray(itinerary.meals?.[mealType]?.photos)) {
                            uploadFields.push({
                                key: `meals.${mealType}.photos`,
                                photos: itinerary.meals[mealType].photos,
                            });
                        }
                    });

                    // Upload for transportation
                    const transportModes = ["car", "bus", "train", "flight", "chopper"];
                    transportModes.forEach((mode) => {
                        if (Array.isArray(itinerary.transportation?.[mode]?.photos)) {
                            uploadFields.push({
                                key: `transportation.${mode}.photos`,
                                photos: itinerary.transportation[mode].photos,
                            });
                        }
                    });

                    // ✅ Process `siteSeen` as an array
                    if (Array.isArray(itinerary.siteSeen)) {
                        for (let i = 0; i < itinerary.siteSeen.length; i++) {
                            const site = itinerary.siteSeen[i];
                            if (Array.isArray(site.photos)) {
                                const uploadedUrls = await uploadImagesForField(site.photos);

                                itinerary.siteSeen[i].photos = uploadedUrls; // ✅ Update siteSeen[i] with uploaded URLs
                            }
                        }
                    }
                    console.log(itinerary.activities)
                    if (Array.isArray(itinerary.activities)) {
                        for (let i = 0; i < itinerary.activities.length; i++) {
                            const site = itinerary.activities[i];
                            if (Array.isArray(site.photos)) {
                                const uploadedUrls = await uploadImagesForField(site.photos);
                                console.log(`Uploaded photos for activities[${i}]:`, uploadedUrls);
                                itinerary.activities[i].photos = uploadedUrls; // ✅ Update activities[i] with uploaded URLs
                            }
                        }
                    }

                    console.log("Upload Fields Before Upload:", uploadFields);

                    // Process each upload field
                    for (const field of uploadFields) {
                        if (Array.isArray(field.photos)) {
                            const uploadedUrls = await uploadImagesForField(field.photos);
                            console.log(`Uploaded photos for ${field.key}:`, uploadedUrls);

                            // Update the respective field in the itinerary object
                            const keys = field.key.split(".");
                            let ref = itinerary;

                            // Navigate to the correct nested field
                            for (let i = 0; i < keys.length - 1; i++) {
                                ref = ref[keys[i]];
                            }

                            // Set the uploaded URLs
                            ref[keys[keys.length - 1]] = uploadedUrls;
                        }
                    }
                };


                // Process all itineraries for each category
                const itineraryCategories = [
                    "standardDetails",
                    "deluxeDetails",
                    "premiumDetails",
                ];
                for (const category of itineraryCategories) {
                    if (tourData[category]?.itineraries) {
                        for (const itinerary of tourData[category].itineraries) {
                            console.log(
                                `Processing itinerary for category ${category}:`,
                                itinerary
                            );
                            await appendImagesToItinerary(itinerary);
                        }
                    }
                }

                // Upload banner image
                if (tourData.bannerImage) {
                    tourData.bannerImage = await uploadImageToCloudinary(
                        tourData.bannerImage
                    );
                    console.log("Uploaded Banner Image:", tourData.bannerImage);
                }

                // Upload additional images
                if (tourData.images?.length) {
                    tourData.images = await uploadImagesForField(tourData.images);
                    console.log("Uploaded Additional Images:", tourData.images);
                }

                // Prepare the tourData for submission
                const cleanTourData = { ...tourData };
                console.log("Final Payload Before Submission:", cleanTourData);

                // Submit data to the backend
                const response = await fetch(`${BASE_URL}/api/fixedTour/createTours`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(cleanTourData),
                });

                if (response.ok) {
                    const responseData = await response.json();
                    toast.success("Tour data saved successfully!");
                    console.log("Save response:", responseData);
                } else {
                    const errorData = await response.json();
                    console.error("Backend Error Response:", errorData);
                    throw new Error(errorData.error || "Failed to save tour data");
                }
            } catch (error) {
                toast.error(
                    error.message || "An error occurred while saving the tour data"
                );
                console.error("Error during submission:", error);
            } finally {
                setLoading(false);
            }
        };

        handleSaveChanges();
    };
    console.log(tourData)
    useEffect(() => {
        // Fetch categories from API
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/categories`);
                const responseAttribute = await fetch(`${BASE_URL}/api/attributes`);
                const responseADestinations = await fetch(
                    `${BASE_URL}/api/getAllDestinations`
                );
                const tour = await fetch(`${BASE_URL}/api/getTour/${id}`);
                const tourJson = await tour.json();
                console.log(tourJson);
                const attributeData = await responseAttribute.json();
                const destinationData = await responseADestinations.json();
                const data = await response.json();
                setTourData(tourJson[0]);
                setAttributes(attributeData);
                setCategories(data);
                setDestinations(destinationData);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);
    return (

        <>

            <div className="bottom">

                <div className="new">
                    <Sidebar />
                    <div className="newContainer">
                        <Navbar />
                        <div className="top">
                            <h1>{title}</h1>
                        </div>

                        <form onSubmit={handleSubmit}>


                            {/* Tour Start Date */}


                            {/* Seats Booked */}


                            {/* Tour Name */}
                            <div className="formGroup">
                                <label>Tour Name</label>
                                <input
                                    type="text"
                                    value={tourData?.name}
                                    onChange={(e) => setTourData({ ...tourData, name: e.target.value })}
                                />
                            </div>
                            <div className="formGroup">
                                <label>
                                    <input
                                        type="checkbox"
                                        name="partialPayment"
                                        checked={tourData?.partialPayment?.enabled}
                                        onChange={(e) =>
                                            setTourData((prevState) => ({
                                                ...prevState,
                                                partialPayment: {
                                                    ...prevState.partialPayment,
                                                    enabled: e.target.checked,
                                                },
                                            }))
                                        }
                                    />
                                    Partial Payment
                                </label>
                            </div>
                            {tourData?.partialPayment?.enabled && (
                                <div className="fixedDatesBox">
                                    <h4>partialPayments</h4>
                                    <div className="formGroup">
                                        <label>Amount</label>
                                        <input
                                            type="number"
                                            value={tourData.partialPayment?.amount || ""}
                                            onChange={(e) =>
                                                setTourData((prevState) => ({
                                                    ...prevState,
                                                    partialPayment: {
                                                        ...prevState.partialPayment,
                                                        amount: e.target.value,
                                                    },
                                                }))
                                            }
                                            placeholder="Enter amount"
                                        />
                                    </div>


                                </div>
                            )}
                            {/* Overview */}
                            <div className="formGroup">
                                <label>Overview</label>
                                <textarea
                                    value={tourData?.overview}
                                    onChange={(e) => setTourData({ ...tourData, overview: e.target.value })}
                                />
                            </div>

                            {/* Welcome Drinks */}
                            <div className="formGroup">
                                <label>Welcome Drinks</label>
                                <input
                                    type="checkbox"
                                    checked={tourData?.welcomeDrinks}
                                    onChange={(e) => setTourData({ ...tourData, welcomeDrinks: e.target.checked })}
                                />
                            </div>



                            {/* Duration */}
                            <div className="formGroup">
                                <label>Duration (in days)</label>
                                <input
                                    type="number"
                                    value={tourData?.duration}
                                    onChange={(e) => setTourData({ ...tourData, duration: e.target.value })}
                                />
                            </div>

                            {/* Languages */}
                            <div className="formGroup">
                                <label>Languages</label>
                                <select
                                    multiple
                                    value={tourData?.languages}
                                    onChange={(e) => {
                                        const options = Array.from(e.target.selectedOptions, (option) => option.value);
                                        setTourData({ ...tourData, languages: options });
                                    }}
                                >
                                    <option value="English">English</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="French">French</option>
                                    {/* Add more language options here */}
                                </select>
                            </div>

                            {/* Meta Title */}
                            <div className="formGroup">
                                <label>Meta Title</label>
                                <input
                                    type="text"
                                    value={tourData?.metaTitle}
                                    onChange={(e) => setTourData({ ...tourData, metaTitle: e.target.value })}
                                />
                            </div>
                            <div className="formGroup">
                                <label>Meta Description</label>
                                <input
                                    type="text"
                                    value={tourData?.metaDescription}
                                    onChange={(e) => setTourData({ ...tourData, metaDescription: e.target.value })}
                                />
                            </div>

                            {/* Terms and Conditions */}


                            {/* Highlights */}


                            {/* Pricing */}
                            <div className="formGroup">
                                <label>Pricing</label>
                                <textarea
                                    value={tourData?.price}
                                    onChange={(e) => setTourData({ ...tourData, price: e.target.value })}
                                />
                            </div>

                            <div className="formGroup" style={{ position: "relative" }}>
                                <label htmlFor="categoriesInput">Categories</label>
                                <div>
                                    <select
                                        id="categoriesInput"
                                        name="categories"
                                        value="" // Keep this empty to allow selecting multiple categories
                                        onChange={(e) => handleCategorySelect(e.target.value)}
                                    >
                                        <option value="">Select a category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="selectedCategories">
                                    {tourData?.categories?.map((categoryId) => {
                                        return (
                                            <div key={categoryId} className="categoryTag">
                                                {categoryId}
                                                <button
                                                    type="button"
                                                    onClick={() => handleCategoryRemove(categoryId)}
                                                    className="deleteIcon"
                                                >
                                                    &#10006;
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Itineraries */}
                            <div>
                                {tourData?.itineraries?.map((itinerary, index) => (
                                    <div key={index}>
                                        <h4>Day {itinerary.day}</h4>
                                        <div className="formGroup">
                                            <label>Title</label>
                                            <input
                                                type="text"
                                                value={itinerary.title}
                                                onChange={(e) => {
                                                    const updatedItineraries = [...tourData.itineraries];
                                                    updatedItineraries[index].title = e.target.value;
                                                    setTourData({ ...tourData, itineraries: updatedItineraries });
                                                }}
                                            />
                                        </div>
                                        <div className="formGroup">
                                            <label>Description</label>
                                            <textarea
                                                value={itinerary.description}
                                                onChange={(e) => {
                                                    const updatedItineraries = [...tourData.itineraries];
                                                    updatedItineraries[index].description = e.target.value;
                                                    setTourData({ ...tourData, itineraries: updatedItineraries });
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="standardDetails">


                                {/* Price Field */}

                                {/* Pricing Field */}


                                <div className="formGroup">
                                    <label>Cancellation Policy</label>
                                    <ReactQuill
                                        name="cancellationPolicy"
                                        value={tourData?.standardDetails?.cancellationPolicy || ""}
                                        onChange={(value) =>
                                            handleFieldChange("cancellationPolicy", value, "standardDetails")
                                        }
                                        placeholder="Enter cancellation policy"
                                    />
                                </div>
                                <div className="formGroup">
                                    <label>Terms and Cancellation</label>
                                    <ReactQuill
                                        name="termsAndConditions"
                                        value={tourData?.standardDetails?.termsAndConditions || ""}
                                        onChange={(value) =>
                                            handleFieldChange("termsAndConditions", value, "standardDetails")
                                        }
                                        placeholder="Enter terms and conditions"
                                    />
                                </div>

                                <div className="formGroup">
                                    <label>Highlights</label>
                                    <ReactQuill
                                        name="highlights"
                                        value={tourData?.standardDetails?.highlights || ""}
                                        onChange={(value) =>
                                            handleFieldChange("highlights", value, "standardDetails")
                                        }
                                        placeholder="Enter highlights"
                                    />
                                </div>

                                {/* What's Included Field */}

                                {/* What's Excluded Field */}
                                <div className="formGroup">
                                    <label>What's Included</label>
                                    <ReactQuill
                                        name="whatsIncluded"
                                        value={tourData?.standardDetails?.whatsIncluded || ""}
                                        onChange={(value) =>
                                            handleFieldChange("whatsIncluded", value, "standardDetails")
                                        }
                                        placeholder="Enter whatsIncluded"
                                    />
                                </div>

                                {/* What's Excluded Field */}
                                <div className="formGroup">
                                    <label>What's Excluded</label>
                                    <ReactQuill
                                        name="whatsExcluded"
                                        value={tourData?.standardDetails?.whatsExcluded || ""}
                                        onChange={(value) =>
                                            handleFieldChange("whatsExcluded", value, "standardDetails")
                                        }
                                        placeholder="Enter whatsExcluded"
                                    />
                                </div>
                                <div className="formGroup" style={{ position: "relative" }}>
                                    <label htmlFor="categoriesInput">Country</label>
                                    <div>
                                        <select
                                            name="country"
                                            onChange={(e) =>
                                                handleLocationSelect("country", e.target.value)
                                            }
                                        >
                                            <option value="">Select a country</option>
                                            {Array.from(
                                                new Set(
                                                    (destinations || []).map(
                                                        (d) => d.country?.label?.toLowerCase() || ""
                                                    )
                                                )
                                            ).map(
                                                (label, index) =>
                                                    label && ( // Exclude empty or invalid labels
                                                        <option key={index} value={label}>
                                                            {label}
                                                        </option>
                                                    )
                                            )}
                                        </select>

                                        <select
                                            name="state"
                                            onChange={(e) => {
                                                handleLocationSelect("state", e.target.value);
                                                handleDestinationSelect(e.target.value);
                                            }}
                                        >
                                            <option value="">Select a state</option>
                                            {Array.from(
                                                new Set(
                                                    (destinations || []).map(
                                                        (d) => d.state?.label?.toLowerCase() || ""
                                                    )
                                                )
                                            ).map(
                                                (label, index) =>
                                                    label && (
                                                        <option key={index} value={label.replace(/\s+/g, "-")}>
                                                            {label}
                                                        </option>
                                                    )
                                            )}
                                        </select>

                                        <select
                                            name="city"
                                            onChange={(e) => handleLocationSelect("city", e.target.value)}
                                        >
                                            <option value="">Select a city</option>
                                            {Array.from(
                                                new Set(
                                                    (destinations || []).map(
                                                        (d) => d.city?.label?.toLowerCase() || ""
                                                    )
                                                )
                                            ).map(
                                                (label, index) =>
                                                    label && (
                                                        <option key={index} value={label}>
                                                            {label}
                                                        </option>
                                                    )
                                            )}
                                        </select>
                                    </div>
                                </div>
                                <div className="formGroup">
                                    <label>Upload Banner Image</label>
                                    <input
                                        type="file"
                                        name="bannerImage"
                                        onChange={handleBannerImageChange}
                                    />

                                    {/* Display banner image preview only when it's uploaded */}
                                    {tourData.bannerImage && (
                                        <div className="banner-preview">
                                            <img src={tourData.bannerImage} alt="Banner Preview" />
                                            <button
                                                className="delete-banner"
                                                onClick={handleDeleteBanner}
                                            >
                                                &times; {/* Delete icon for the banner image */}
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className="formGroup">
                                    <label>Upload Photos</label>
                                    <input
                                        type="file"
                                        multiple
                                        name="photos"
                                        accept="image/*" // Allow only image files
                                        onChange={handleFileChange}
                                    />

                                    {/* Display image previews */}
                                    {tourData?.images?.length > 0 && (
                                        <div className="photo-preview">
                                            {tourData.images.map((photo, index) => (
                                                <div key={index} className="photo-container">
                                                    <img src={photo} alt={`Uploaded preview ${index}`} />
                                                    <button
                                                        className="delete-photo"
                                                        onClick={() => handleDeletePhoto(index)}
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="formGroup">
                                    <h3>Itineries</h3>
                                    {tourData?.standardDetails?.itineraries?.map((itinerary, index) => (
                                        <div key={index} className="itinerary">
                                            <label>Day {itinerary.day}</label>
                                            <label>Itinerary Photos</label>
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleItineraryPhotos(index, e.target.files, "standardDetails")
                                                }
                                            />
                                            <div className="photo-preview">
                                                {tourData?.standardDetails?.itineraries[index].photos?.map(
                                                    (photo, photoIndex) => (
                                                        <div
                                                            key={photoIndex}
                                                            style={{
                                                                display: "inline-block",
                                                                position: "relative",
                                                                margin: "5px",
                                                            }}
                                                        >
                                                            <img
                                                                src={photo}
                                                                alt={`Itinerary Photo ${photoIndex + 1}`}
                                                                width="100"
                                                                height="100"
                                                                style={{ display: "block" }}
                                                            />
                                                            <button
                                                                style={{
                                                                    position: "absolute",
                                                                    top: 0,
                                                                    right: 0,
                                                                    backgroundColor: "red",
                                                                    color: "white",
                                                                    border: "none",
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={() => {
                                                                    const updatedPhotos = itinerary.photos.filter(
                                                                        (_, i) => i !== photoIndex
                                                                    );
                                                                    const updatedItineraries = [
                                                                        ...tourData.standardDetails.itineraries,
                                                                    ];
                                                                    updatedItineraries[index] = {
                                                                        ...itinerary,
                                                                        photos: updatedPhotos,
                                                                    };
                                                                    setTourData({
                                                                        ...tourData,
                                                                        standardDetails: {
                                                                            ...tourData.standardDetails,
                                                                            itineraries: updatedItineraries,
                                                                        },
                                                                    });
                                                                }}
                                                            >
                                                                ×
                                                            </button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                name="title"
                                                value={itinerary.title}
                                                onChange={(e) =>
                                                    handleItineraryChange(
                                                        index,
                                                        "title",
                                                        e.target.value,
                                                        "standardDetails"
                                                    )
                                                }
                                                placeholder="Enter itinerary title"
                                            />
                                            <ReactQuill
                                                name="description"
                                                value={itinerary?.description}
                                                onChange={(value) =>
                                                    handleItineraryDescriptionChange(
                                                        index,
                                                        "description",
                                                        value,
                                                        "standardDetails"
                                                    )
                                                }
                                                placeholder="Enter itinerary description"
                                            />

                                            <div className="labels">
                                                <label>Siteseen:</label>
                                                <input
                                                    type="checkbox"
                                                    checked={itinerary.siteSeen?.length > 0}
                                                    onChange={(e) =>
                                                        handleItineraryChange(
                                                            index,
                                                            "siteSeen",
                                                            e.target.checked ? [{ name: "", description: "", photos: [] }] : [],
                                                            "standardDetails"
                                                        )
                                                    }
                                                />
                                            </div>

                                            {itinerary.siteSeen?.length > 0 && (
                                                <div className="siteseen-section">
                                                    <h4>Siteseen Details</h4>

                                                    {itinerary.siteSeen.map((site, siteIndex) => (

                                                        <>
                                                            <h3>siteseen {siteIndex + 1}</h3>
                                                            <div key={siteIndex} className="siteseen-entry">
                                                                {/* Siteseen Name */}
                                                                <input
                                                                    type="text"
                                                                    placeholder="Enter Siteseen name"
                                                                    value={site.name}
                                                                    onChange={(e) => {
                                                                        const updatedSites = [...itinerary.siteSeen];
                                                                        updatedSites[siteIndex].name = e.target.value;
                                                                        handleItineraryChange(index, "siteSeen", updatedSites, "standardDetails");
                                                                    }}
                                                                />

                                                                {/* Siteseen Description */}
                                                                <textarea
                                                                    placeholder="Enter Siteseen description"
                                                                    value={site.description}
                                                                    onChange={(e) => {
                                                                        const updatedSites = [...itinerary.siteSeen];
                                                                        updatedSites[siteIndex].description = e.target.value;
                                                                        handleItineraryChange(index, "siteSeen", updatedSites, "standardDetails");
                                                                    }}
                                                                ></textarea>

                                                                {/* Siteseen Photos */}
                                                                <label>Upload Siteseen Photos</label>
                                                                <input
                                                                    type="file"
                                                                    multiple
                                                                    onChange={(e) => {
                                                                        const files = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
                                                                        const updatedSites = [...itinerary.siteSeen];
                                                                        updatedSites[siteIndex].photos = [...(updatedSites[siteIndex].photos || []), ...files];
                                                                        handleItineraryChange(index, "siteSeen", updatedSites, "standardDetails");
                                                                    }}
                                                                />

                                                                <div className="preview-photos">
                                                                    {site.photos &&
                                                                        site.photos.map((photo, photoIndex) => (
                                                                            <div
                                                                                key={photoIndex}
                                                                                style={{
                                                                                    display: "inline-block",
                                                                                    position: "relative",
                                                                                    margin: "5px",
                                                                                }}
                                                                            >
                                                                                <img src={photo} alt={`Siteseen photo ${photoIndex + 1}`} width="100" />
                                                                                <button
                                                                                    style={{
                                                                                        position: "absolute",
                                                                                        top: 0,
                                                                                        right: 0,
                                                                                        backgroundColor: "red",
                                                                                        color: "white",
                                                                                        border: "none",
                                                                                        cursor: "pointer",
                                                                                        padding: "5px",
                                                                                    }}
                                                                                    onClick={() => {
                                                                                        const updatedPhotos = site.photos.filter((_, i) => i !== photoIndex);
                                                                                        const updatedSites = [...itinerary.siteSeen];
                                                                                        updatedSites[siteIndex].photos = updatedPhotos;
                                                                                        handleItineraryChange(index, "siteSeen", updatedSites, "standardDetails");
                                                                                    }}
                                                                                >
                                                                                    ×
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                </div>

                                                                {/* Remove Siteseen */}
                                                                <button
                                                                    onClick={() => {
                                                                        const updatedSites = itinerary.siteSeen.filter((_, i) => i !== siteIndex);
                                                                        handleItineraryChange(index, "siteSeen", updatedSites, "standardDetails");
                                                                    }}
                                                                    style={{ backgroundColor: "red", color: "white", marginTop: "10px" }}
                                                                >
                                                                    Remove Siteseen
                                                                </button>
                                                            </div>

                                                        </>

                                                    ))}

                                                    {/* Add New Siteseen */}
                                                    <button
                                                        onClick={() => {
                                                            const updatedSites = [...itinerary.siteSeen, { name: "", description: "", photos: [] }];
                                                            handleItineraryChange(index, "siteSeen", updatedSites, "standardDetails");
                                                        }}
                                                        style={{ marginTop: "10px", backgroundColor: "green", color: "white" }}
                                                    >
                                                        Add Siteseen
                                                    </button>
                                                </div>
                                            )}


                                            <div className="labels">
                                                <label>Tour Manager:</label>
                                                <input
                                                    type="checkbox"
                                                    checked={itinerary.tourManager?.isAvailable || false}
                                                    onChange={(e) =>
                                                        handleItineraryChange(
                                                            index,
                                                            "tourManager",
                                                            { ...itinerary.tourManager, isAvailable: e.target.checked },
                                                            "standardDetails"
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div className="labels">
                                                <label>Welcome Drinks</label>
                                                <input
                                                    type="checkbox"
                                                    checked={itinerary.welcomeDrinks?.isAvailable || false}
                                                    onChange={(e) =>
                                                        handleItineraryChange(
                                                            index,
                                                            "welcomeDrinks",
                                                            {
                                                                ...itinerary.welcomeDrinks,
                                                                isAvailable: e.target.checked,
                                                            },
                                                            "standardDetails"
                                                        )
                                                    }
                                                />
                                            </div>
                                            {itinerary.welcomeDrinks?.isAvailable && (
                                                <div className="siteseen-section">
                                                    <h4>Welcome drink</h4>

                                                    {/* Siteseen Name */}
                                                    <input
                                                        type="text"
                                                        placeholder="Enter welcome drink name"
                                                        value={itinerary.welcomeDrinks.name || ""}
                                                        onChange={(e) =>
                                                            handleItineraryChange(
                                                                index,
                                                                "welcomeDrinks",
                                                                { ...itinerary.welcomeDrinks, name: e.target.value },
                                                                "standardDetails"
                                                            )
                                                        }
                                                    />

                                                    {/* Siteseen Description */}
                                                    <textarea
                                                        placeholder="Enter welcome drink description"
                                                        value={itinerary.welcomeDrinks.description || ""}
                                                        onChange={(e) =>
                                                            handleItineraryChange(
                                                                index,
                                                                "welcomeDrinks",
                                                                {
                                                                    ...itinerary.welcomeDrinks,
                                                                    description: e.target.value,
                                                                },
                                                                "standardDetails"
                                                            )
                                                        }
                                                    ></textarea>

                                                    {/* Siteseen Photos */}
                                                    <label>Upload Welcome drinks Photos</label>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        onChange={(e) => {
                                                            const files = Array.from(e.target.files).map((file) =>
                                                                URL.createObjectURL(file)
                                                            );
                                                            handleItineraryChange(
                                                                index,
                                                                "welcomeDrinks",
                                                                {
                                                                    ...itinerary.welcomeDrinks,
                                                                    photos: [
                                                                        ...(itinerary.welcomeDrinks.photos || []),
                                                                        ...files,
                                                                    ],
                                                                },
                                                                "standardDetails"
                                                            );
                                                        }}
                                                    />

                                                    <div className="preview-photos">
                                                        {itinerary.welcomeDrinks.photos &&
                                                            itinerary.welcomeDrinks.photos.map((photo, photoIndex) => (
                                                                <img
                                                                    key={photoIndex}
                                                                    src={photo}
                                                                    alt={`Siteseen photo ${photoIndex + 1}`}
                                                                    width="100"
                                                                />
                                                            ))}
                                                    </div>
                                                </div>
                                            )}

                                            {itinerary.tourManager?.isAvailable && (
                                                <div className="tour-manager-section">
                                                    <h4>Tour Manager Details</h4>
                                                    <input
                                                        type="text"
                                                        placeholder="price"
                                                        value={itinerary.tourManager.price || ""}
                                                        onChange={(e) =>
                                                            handleItineraryChange(
                                                                index,
                                                                "tourManager",
                                                                { ...itinerary.tourManager, price: e.target.value },
                                                                "standardDetails"
                                                            )
                                                        }
                                                    />
                                                    {/* Tour Manager Name */}
                                                    <input
                                                        type="text"
                                                        placeholder="Enter Tour Manager name"
                                                        value={itinerary.tourManager.name || ""}
                                                        onChange={(e) =>
                                                            handleItineraryChange(
                                                                index,
                                                                "tourManager",
                                                                { ...itinerary.tourManager, name: e.target.value },
                                                                "standardDetails"
                                                            )
                                                        }
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Enter departure from"
                                                        value={itinerary.tourManager.departureFrom || ""}
                                                        onChange={(e) =>
                                                            handleItineraryChange(
                                                                index,
                                                                "tourManager",
                                                                {
                                                                    ...itinerary.tourManager,
                                                                    departureFrom: e.target.value,
                                                                },
                                                                "standardDetails"
                                                            )
                                                        }
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Enter arrival to"
                                                        value={itinerary.tourManager.arrivalTo || ""}
                                                        onChange={(e) =>
                                                            handleItineraryChange(
                                                                index,
                                                                "tourManager",
                                                                { ...itinerary.tourManager, arrivalTo: e.target.value },
                                                                "standardDetails"
                                                            )
                                                        }
                                                    />

                                                    {/* Tour Manager Description */}
                                                    <textarea
                                                        placeholder="Enter Tour Manager description"
                                                        value={itinerary.tourManager.description || ""}
                                                        onChange={(e) =>
                                                            handleItineraryChange(
                                                                index,
                                                                "tourManager",
                                                                { ...itinerary.tourManager, description: e.target.value },
                                                                "standardDetails"
                                                            )
                                                        }
                                                    ></textarea>

                                                    {/* Tour Manager Photo */}
                                                    <label>Upload Tour Manager Photo</label>
                                                    <input
                                                        type="file"
                                                        onChange={(e) => {
                                                            const file = e.target.files[0]
                                                                ? URL.createObjectURL(e.target.files[0])
                                                                : "";
                                                            handleItineraryChange(
                                                                index,
                                                                "tourManager",
                                                                { ...itinerary.tourManager, photo: file },
                                                                "standardDetails"
                                                            );
                                                        }}
                                                    />

                                                    {/* Preview Tour Manager Photo */}
                                                    {itinerary.tourManager?.photo && (
                                                        <div className="preview-tour-manager-photo">
                                                            <img
                                                                src={itinerary.tourManager.photo}
                                                                alt="Tour Manager"
                                                                width="100"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            <div className="labels">
                                                <label>Include Hotel</label>
                                                <input
                                                    type="checkbox"
                                                    checked={itinerary.hotel.isIncluded || false}
                                                    onChange={(e) => {
                                                        const updatedItineraries = [
                                                            ...tourData.standardDetails.itineraries,
                                                        ];
                                                        updatedItineraries[index].hotel.isIncluded = e.target.checked;
                                                        setTourData({
                                                            ...tourData,
                                                            standardDetails: {
                                                                ...tourData.standardDetails,
                                                                itineraries: updatedItineraries,
                                                            },
                                                        });
                                                    }}
                                                />
                                            </div>

                                            {/* Hotel details div, visible only if Include Hotel is checked */}
                                            {itinerary.hotel.isIncluded && (
                                                <div className="hotel-details">
                                                    <label>Hotel Name</label>
                                                    <input
                                                        type="text"
                                                        value={itinerary.hotel.name || ""}
                                                        onChange={(e) => {
                                                            const updatedItineraries = [
                                                                ...tourData.standardDetails.itineraries,
                                                            ];
                                                            updatedItineraries[index].hotel.name = e.target.value;
                                                            setTourData({
                                                                ...tourData,
                                                                standardDetails: {
                                                                    ...tourData.standardDetails,
                                                                    itineraries: updatedItineraries,
                                                                },
                                                            });
                                                        }}
                                                    />

                                                    <label>Hotel URL</label>
                                                    <input
                                                        type="url"
                                                        value={itinerary.hotel.url || ""}
                                                        onChange={(e) => {
                                                            const updatedItineraries = [
                                                                ...tourData.standardDetails.itineraries,
                                                            ];
                                                            updatedItineraries[index].hotel.url = e.target.value;
                                                            setTourData({
                                                                ...tourData,
                                                                standardDetails: {
                                                                    ...tourData.standardDetails,
                                                                    itineraries: updatedItineraries,
                                                                },
                                                            });
                                                        }}
                                                    />

                                                    <label>Hotel Category</label>
                                                    <input
                                                        type="text"
                                                        value={itinerary.hotel.hotelCategory || ""}
                                                        readOnly
                                                        onFocus={() => {
                                                            const updatedItineraries = [
                                                                ...tourData.standardDetails.itineraries,
                                                            ];
                                                            updatedItineraries[index].showCategoryOptions = true;
                                                            setTourData({
                                                                ...tourData,
                                                                standardDetails: {
                                                                    ...tourData.standardDetails,
                                                                    itineraries: updatedItineraries,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                    {itinerary.showCategoryOptions && (
                                                        <div className="category-options">
                                                            {hotelCategoryOptions.map((option) => (
                                                                <div
                                                                    key={option}
                                                                    onClick={() => {
                                                                        const updatedItineraries = [
                                                                            ...tourData.standardDetails.itineraries,
                                                                        ];
                                                                        updatedItineraries[index].hotel.hotelCategory = [
                                                                            option,
                                                                        ];
                                                                        updatedItineraries[index].showCategoryOptions = false; // Hide options after selection
                                                                        setTourData({
                                                                            ...tourData,
                                                                            standardDetails: {
                                                                                ...tourData.standardDetails,
                                                                                itineraries: updatedItineraries,
                                                                            },
                                                                        });
                                                                    }}
                                                                >
                                                                    {option}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <label>Hotel Images</label>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={(e) =>
                                                            handleHotelImages(index, e.target.files, "standardDetails")
                                                        }
                                                    />

                                                    {itinerary.hotel.hotelImages?.length > 0 && (
                                                        <div className="photo-preview">
                                                            {itinerary.hotel.hotelImages.map((photo, photoIndex) => (
                                                                <div key={photoIndex} className="photo-container">
                                                                    <img
                                                                        src={photo} // URL is already created
                                                                        alt={`Hotel Image ${photoIndex + 1}`}
                                                                        width="100"
                                                                        height="100"
                                                                    />
                                                                    <button
                                                                        className="delete-photo"
                                                                        onClick={() => {
                                                                            const updatedHotelImages =
                                                                                itinerary.hotel.hotelImages.filter(
                                                                                    (_, i) => i !== photoIndex
                                                                                );
                                                                            const updatedItineraries = [
                                                                                ...tourData.standardDetails.itineraries,
                                                                            ];
                                                                            updatedItineraries[index] = {
                                                                                ...itinerary,
                                                                                hotel: {
                                                                                    ...itinerary.hotel,
                                                                                    hotelImages: updatedHotelImages,
                                                                                },
                                                                            };
                                                                            setTourData({
                                                                                ...tourData,
                                                                                standardDetails: {
                                                                                    ...tourData.standardDetails,
                                                                                    itineraries: updatedItineraries,
                                                                                },
                                                                            });
                                                                        }}
                                                                    >
                                                                        &times;
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <label>Room Category</label>
                                                    <input
                                                        type="text"
                                                        value={itinerary.hotel.roomCategory || ""}
                                                        onChange={(e) => {
                                                            const updatedItineraries = [
                                                                ...tourData.standardDetails.itineraries,
                                                            ];
                                                            updatedItineraries[index].hotel.roomCategory =
                                                                e.target.value;
                                                            setTourData({
                                                                ...tourData,
                                                                standardDetails: {
                                                                    ...tourData.standardDetails,
                                                                    itineraries: updatedItineraries,
                                                                },
                                                            });
                                                        }}
                                                    />

                                                    <div className="standard-details-pricing">
                                                        <h4>Standard Details: Bed Pricing</h4>
                                                        {Object.keys(
                                                            tourData.standardDetails?.itineraries[index]?.hotel?.beds
                                                        ).map((bedType, bedIndex) => (
                                                            <div key={bedIndex} className="bed-type">
                                                                <h5>
                                                                    {bedType
                                                                        .replace(/([A-Z])/g, " $1")
                                                                        .replace("Bed", " Bed")}
                                                                </h5>
                                                                <div className="price-inputs">
                                                                    <label>
                                                                        Room Price:
                                                                        <input
                                                                            type="number"
                                                                            placeholder="Enter room price"
                                                                            value={
                                                                                tourData.standardDetails?.itineraries[index]
                                                                                    ?.hotel.beds[bedType].price || ""
                                                                            }
                                                                            onChange={(e) =>
                                                                                handleBedPriceChange(
                                                                                    "standard",
                                                                                    index,
                                                                                    bedType,
                                                                                    "price",
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                        />
                                                                    </label>
                                                                    <label>
                                                                        Extra Bed Price:
                                                                        <input
                                                                            type="number"
                                                                            placeholder="Enter extra bed price"
                                                                            value={
                                                                                tourData.standardDetails?.itineraries[index]
                                                                                    ?.hotel.beds[bedType].extraBedPrice || ""
                                                                            }
                                                                            onChange={(e) =>
                                                                                handleBedPriceChange(
                                                                                    "standard",
                                                                                    index,
                                                                                    bedType,
                                                                                    "extraBedPrice",
                                                                                    e.target.value
                                                                                )
                                                                            }
                                                                        />
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <label>Room Images</label>
                                                    <input
                                                        type="file"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={(e) =>
                                                            handleRoomImages(index, e.target.files, "standardDetails")
                                                        }
                                                    />

                                                    {itinerary.hotel.roomImages?.length > 0 && (
                                                        <div className="photo-preview">
                                                            {itinerary.hotel.roomImages.map((photo, photoIndex) => (
                                                                <div key={photoIndex} className="photo-container">
                                                                    <img
                                                                        src={photo} // URL is already created
                                                                        alt={`Room Image ${photoIndex + 1}`}
                                                                        width="100"
                                                                        height="100"
                                                                    />
                                                                    <button
                                                                        className="delete-photo"
                                                                        onClick={() => {
                                                                            // Update roomImages instead of hotelImages
                                                                            const updatedRoomImages =
                                                                                itinerary.hotel.roomImages.filter(
                                                                                    (_, i) => i !== photoIndex
                                                                                );
                                                                            const updatedItineraries = [
                                                                                ...tourData.standardDetails.itineraries,
                                                                            ];
                                                                            updatedItineraries[index] = {
                                                                                ...itinerary,
                                                                                hotel: {
                                                                                    ...itinerary.hotel,
                                                                                    roomImages: updatedRoomImages, // Update roomImages here
                                                                                },
                                                                            };
                                                                            setTourData({
                                                                                ...tourData,
                                                                                standardDetails: {
                                                                                    ...tourData.standardDetails,
                                                                                    itineraries: updatedItineraries,
                                                                                },
                                                                            });
                                                                        }}
                                                                    >
                                                                        &times;
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    <label>Hotel Location</label>
                                                    <input
                                                        type="text"
                                                        value={itinerary.hotel.location || ""}
                                                        onChange={(e) => {
                                                            const updatedItineraries = [
                                                                ...tourData.standardDetails.itineraries,
                                                            ];
                                                            updatedItineraries[index].hotel.location = e.target.value;
                                                            setTourData({
                                                                ...tourData,
                                                                standardDetails: {
                                                                    ...tourData.standardDetails,
                                                                    itineraries: updatedItineraries,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            )}

                                            <div className="labels">
                                                <label>Meals</label>

                                                <input
                                                    type="checkbox"
                                                    checked={itinerary.meals?.isAvailable || false}
                                                    onChange={(e) =>
                                                        handleItineraryChange(
                                                            index,
                                                            "meals",
                                                            { ...itinerary.meals, isAvailable: e.target.checked },
                                                            "standardDetails"
                                                        )
                                                    }
                                                />
                                            </div>
                                            {itinerary?.meals?.isAvailable ? (
                                                <div className="meals-checkbox">
                                                    <div className="labels">
                                                        <label> Breakfast</label>
                                                        <input
                                                            type="checkbox"
                                                            value="breakfast"
                                                            checked={itinerary.meals.breakfast.isAvailable}
                                                            onChange={(e) =>
                                                                handleMealChange(e, index, "breakfast", "standardDetails")
                                                            }
                                                        />
                                                    </div>

                                                    {itinerary?.meals?.breakfast?.isAvailable == true && (
                                                        <div className="meal-details">
                                                            <label>Breakfast Name</label>
                                                            <input
                                                                type="text"
                                                                name="breakfastName"
                                                                value={itinerary.meals.breakfast.name}
                                                                onChange={(e) =>
                                                                    handleItineraryMealsChange(
                                                                        index,
                                                                        "breakfast",
                                                                        "name",
                                                                        e.target.value,
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                                placeholder="Enter breakfast name"
                                                            />

                                                            <label>Breakfast Photos</label>
                                                            <input
                                                                type="file"
                                                                multiple
                                                                onChange={(e) =>
                                                                    handleItineraryMealsChange(
                                                                        index,
                                                                        "breakfast",
                                                                        "photos",
                                                                        Array.from(e.target.files),
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />

                                                            {itinerary?.meals?.breakfast?.photos?.length > 0 && (
                                                                <div className="photo-preview">
                                                                    {itinerary.meals.breakfast.photos.map(
                                                                        (photo, photoIndex) => {
                                                                            // Check if the photo is a File object
                                                                            const photoSrc =
                                                                                photo instanceof File
                                                                                    ? URL.createObjectURL(photo)
                                                                                    : photo;

                                                                            return (
                                                                                <div key={photoIndex} className="photo-container">
                                                                                    <img
                                                                                        src={photoSrc}
                                                                                        alt={`Breakfast ${photoIndex}`}
                                                                                    />
                                                                                    <button
                                                                                        className="delete-photo"
                                                                                        onClick={() =>
                                                                                            handleDeleteMealPhoto(
                                                                                                index,
                                                                                                photoIndex,
                                                                                                "breakfast",
                                                                                                "standardDetails"
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        &times;
                                                                                    </button>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="labels">
                                                        <label> Lunch</label>
                                                        <input
                                                            type="checkbox"
                                                            value="lunch"
                                                            checked={itinerary.meals.lunch.isAvailable}
                                                            onChange={(e) =>
                                                                handleMealChange(e, index, "lunch", "standardDetails")
                                                            }
                                                        />
                                                    </div>

                                                    {itinerary.meals.lunch.isAvailable == true && (
                                                        <div className="meal-details">
                                                            <label>LunchName</label>
                                                            <input
                                                                type="text"
                                                                name="lunchName"
                                                                value={itinerary.meals.lunch.name}
                                                                onChange={(e) =>
                                                                    handleItineraryMealsChange(
                                                                        index,
                                                                        "lunch",
                                                                        "name",
                                                                        e.target.value,
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                                placeholder="Enter lunch name"
                                                            />
                                                            <label>Lunch Photos</label>
                                                            <input
                                                                type="file"
                                                                multiple
                                                                onChange={(e) =>
                                                                    handleItineraryMealsChange(
                                                                        index,
                                                                        "lunch",
                                                                        "photos",
                                                                        Array.from(e.target.files),
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            {itinerary?.meals?.lunch?.photos?.length > 0 && (
                                                                <div className="photo-preview">
                                                                    {itinerary.meals.lunch.photos.map(
                                                                        (photo, photoIndex) => {
                                                                            // Check if the photo is a File object
                                                                            const photoSrc =
                                                                                photo instanceof File
                                                                                    ? URL.createObjectURL(photo)
                                                                                    : photo;

                                                                            return (
                                                                                <div key={photoIndex} className="photo-container">
                                                                                    <img
                                                                                        src={photoSrc}
                                                                                        alt={`Lunch ${photoIndex}`}
                                                                                    />
                                                                                    <button
                                                                                        className="delete-photo"
                                                                                        onClick={() =>
                                                                                            handleDeleteMealPhoto(
                                                                                                index,
                                                                                                photoIndex,
                                                                                                "lunch",
                                                                                                "standardDetails"
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        &times;
                                                                                    </button>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="labels">
                                                        <label> Dinner</label>
                                                        <input
                                                            type="checkbox"
                                                            value="Dinner"
                                                            checked={itinerary.meals.dinner.isAvailable}
                                                            onChange={(e) =>
                                                                handleMealChange(e, index, "dinner", "standardDetails")
                                                            }
                                                        />
                                                    </div>
                                                    {itinerary.meals.dinner.isAvailable == true && (
                                                        <div className="meal-details">
                                                            <label>Dinner Name</label>
                                                            <input
                                                                type="text"
                                                                name="dinnerName"
                                                                value={itinerary.meals.dinner.name}
                                                                onChange={(e) =>
                                                                    handleItineraryMealsChange(
                                                                        index,
                                                                        "dinner",
                                                                        "name",
                                                                        e.target.value,
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                                placeholder="Enter dinner name"
                                                            />
                                                            <label>Dinner Photos</label>
                                                            <input
                                                                type="file"
                                                                multiple
                                                                onChange={(e) =>
                                                                    handleItineraryMealsChange(
                                                                        index,
                                                                        "dinner",
                                                                        "photos",
                                                                        Array.from(e.target.files),
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            {itinerary?.meals?.dinner?.photos?.length > 0 && (
                                                                <div className="photo-preview">
                                                                    {itinerary.meals.dinner.photos.map(
                                                                        (photo, photoIndex) => {
                                                                            // Check if the photo is a File object
                                                                            const photoSrc =
                                                                                photo instanceof File
                                                                                    ? URL.createObjectURL(photo)
                                                                                    : photo;

                                                                            return (
                                                                                <div key={photoIndex} className="photo-container">
                                                                                    <img
                                                                                        src={photoSrc}
                                                                                        alt={`Dinner ${photoIndex}`}
                                                                                    />
                                                                                    <button
                                                                                        className="delete-photo"
                                                                                        onClick={() =>
                                                                                            handleDeleteMealPhoto(
                                                                                                index,
                                                                                                photoIndex,
                                                                                                "dinner",
                                                                                                "standardDetails"
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        &times;
                                                                                    </button>
                                                                                </div>
                                                                            );
                                                                        }
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : null}
                                            <div className="labels">
                                                <label>Include Activity</label>
                                                <input
                                                    type="checkbox"
                                                    checked={itinerary.activities?.length > 0}
                                                    onChange={(e) =>
                                                        handleItineraryChange(
                                                            index,
                                                            "activities",
                                                            e.target.checked ? [{ name: "", description: "", price: "", photos: [] }] : [],
                                                            "standardDetails"
                                                        )
                                                    }
                                                />
                                            </div>

                                            {itinerary.activities?.length > 0 && (
                                                <div className="activity-details">
                                                    <h4>Activity Details</h4>

                                                    {itinerary.activities.map((activity, activityIndex) => (
                                                        <div key={activityIndex} className="activity-entry">
                                                            {/* Activity Name */}
                                                            <input
                                                                type="text"
                                                                placeholder="Enter activity name"
                                                                value={activity.name || ""}
                                                                onChange={(e) => {
                                                                    const updatedActivities = [...itinerary.activities];
                                                                    updatedActivities[activityIndex].name = e.target.value;
                                                                    handleItineraryChange(index, "activities", updatedActivities, "standardDetails");
                                                                }}
                                                            />

                                                            {/* Activity Description */}
                                                            <textarea
                                                                placeholder="Enter activity description"
                                                                value={activity.description || ""}
                                                                onChange={(e) => {
                                                                    const updatedActivities = [...itinerary.activities];
                                                                    updatedActivities[activityIndex].description = e.target.value;
                                                                    handleItineraryChange(index, "activities", updatedActivities, "standardDetails");
                                                                }}
                                                            ></textarea>

                                                            {/* Activity Price */}
                                                            <input
                                                                type="number"
                                                                placeholder="Enter activity price"
                                                                value={activity.price || ""}
                                                                onChange={(e) => {
                                                                    const updatedActivities = [...itinerary.activities];
                                                                    updatedActivities[activityIndex].price = e.target.value;
                                                                    handleItineraryChange(index, "activities", updatedActivities, "standardDetails");
                                                                }}
                                                            />

                                                            {/* Upload Photos */}
                                                            <label>Upload Photos</label>
                                                            <input
                                                                type="file"
                                                                multiple
                                                                onChange={(e) => {
                                                                    const files = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
                                                                    const updatedActivities = [...itinerary.activities];
                                                                    updatedActivities[activityIndex].photos = [...(updatedActivities[activityIndex].photos || []), ...files];
                                                                    handleItineraryChange(index, "activities", updatedActivities, "standardDetails");
                                                                }}
                                                            />

                                                            {/* Display Uploaded Photos */}
                                                            <div className="preview-photos">
                                                                {activity.photos &&
                                                                    activity.photos.map((photo, photoIndex) => (
                                                                        <div
                                                                            key={photoIndex}
                                                                            style={{
                                                                                display: "inline-block",
                                                                                position: "relative",
                                                                                margin: "5px",
                                                                            }}
                                                                        >
                                                                            <img src={photo} alt={`Activity photo ${photoIndex + 1}`} width="100" />
                                                                            <button
                                                                                style={{
                                                                                    position: "absolute",
                                                                                    top: 0,
                                                                                    right: 0,
                                                                                    backgroundColor: "red",
                                                                                    color: "white",
                                                                                    border: "none",
                                                                                    cursor: "pointer",
                                                                                    padding: "5px",
                                                                                }}
                                                                                onClick={() => {
                                                                                    const updatedPhotos = activity.photos.filter((_, i) => i !== photoIndex);
                                                                                    const updatedActivities = [...itinerary.activities];
                                                                                    updatedActivities[activityIndex].photos = updatedPhotos;
                                                                                    handleItineraryChange(index, "activities", updatedActivities, "standardDetails");
                                                                                }}
                                                                            >
                                                                                ×
                                                                            </button>
                                                                        </div>
                                                                    ))}
                                                            </div>

                                                            {/* Remove Activity Button */}
                                                            <button
                                                                onClick={() => {
                                                                    const updatedActivities = itinerary.activities.filter((_, i) => i !== activityIndex);
                                                                    handleItineraryChange(index, "activities", updatedActivities, "standardDetails");
                                                                }}
                                                                style={{ backgroundColor: "red", color: "white", marginTop: "10px" }}
                                                            >
                                                                Remove Activity
                                                            </button>
                                                        </div>
                                                    ))}

                                                    {/* Add New Activity Button */}
                                                    <button
                                                        onClick={() => {
                                                            const updatedActivities = [...itinerary.activities, { name: "", description: "", price: "", photos: [] }];
                                                            handleItineraryChange(index, "activities", updatedActivities, "standardDetails");
                                                        }}
                                                        style={{ marginTop: "10px", backgroundColor: "green", color: "white" }}
                                                    >
                                                        Add Activity
                                                    </button>
                                                </div>
                                            )}

                                            <div className="labels">
                                                <label> Include Transportation</label>
                                                <input
                                                    type="checkbox"
                                                    name="transportation"
                                                    checked={itinerary.transportation?.isIncluded || false}
                                                    onChange={(e) => {
                                                        handleItineraryChange(
                                                            index,
                                                            "transportation",
                                                            {
                                                                ...itinerary.transportation,
                                                                isIncluded: e.target.checked,
                                                            },
                                                            "standardDetails"
                                                        );
                                                    }}
                                                />
                                            </div>

                                            {/* Transportation Section */}
                                            {itinerary.transportation?.isIncluded && (
                                                <div className="transportation-section">
                                                    <div className="labels">
                                                        <label className="labels"> Include Car</label>
                                                        <input
                                                            type="checkbox"
                                                            checked={itinerary.transportation.car?.isIncluded || false}
                                                            onChange={(e) =>
                                                                handleTransportationChange(
                                                                    index,
                                                                    "car",
                                                                    { isIncluded: e.target.checked },
                                                                    "standardDetails"
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    {itinerary.transportation.car?.isIncluded && (
                                                        <div className="transportation-details">
                                                            <input
                                                                type="text"
                                                                placeholder="Car Name"
                                                                value={itinerary.transportation.car.name || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "car",
                                                                        {
                                                                            ...itinerary.transportation.car,
                                                                            name: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Departure from"
                                                                value={itinerary.transportation.car.departureFrom || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "car",
                                                                        {
                                                                            ...itinerary.transportation.car,
                                                                            departureFrom: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Arrival To"
                                                                value={itinerary.transportation.car.arrivalTo || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "car",
                                                                        {
                                                                            ...itinerary.transportation.car,
                                                                            arrivalTo: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Car Category"
                                                                value={itinerary.transportation.car.category || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "car",
                                                                        {
                                                                            ...itinerary.transportation.car,
                                                                            category: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />

                                                            <input
                                                                type="number"
                                                                placeholder="Enter car price"
                                                                value={itinerary.transportation.car.price || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "car",
                                                                        {
                                                                            ...itinerary.transportation.car,
                                                                            price: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />

                                                            <input
                                                                type="number"
                                                                placeholder="Enter maximum people capacity"
                                                                value={itinerary.transportation.car.maxPeople || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "car",
                                                                        {
                                                                            ...itinerary.transportation.car,
                                                                            maxPeople: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Description"
                                                                value={itinerary.transportation.car.description || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "car",
                                                                        {
                                                                            ...itinerary.transportation.car,
                                                                            description: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <input
                                                                type="time"
                                                                placeholder="Departure Time"
                                                                value={itinerary.transportation.car.departureTime || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "car",
                                                                        {
                                                                            ...itinerary.transportation.car,
                                                                            departureTime: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <label>Upload Car Photos</label>
                                                            <input
                                                                type="file"
                                                                multiple
                                                                accept="image/*"
                                                                onChange={(e) =>
                                                                    handleTransportationPhotos(
                                                                        index,
                                                                        "car",
                                                                        e.target.files,
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />

                                                            {itinerary.transportation.car?.photos?.length > 0 && (
                                                                <div className="photo-preview">
                                                                    {itinerary.transportation.car.photos.map(
                                                                        (photo, photoIndex) => (
                                                                            <div
                                                                                key={photoIndex}
                                                                                className="photo-container"
                                                                                style={{
                                                                                    position: "relative",
                                                                                    display: "inline-block",
                                                                                    margin: "5px",
                                                                                }}
                                                                            >
                                                                                <img
                                                                                    src={photo} // URL is already created
                                                                                    alt={`Car Photo ${photoIndex + 1}`}
                                                                                    width="100"
                                                                                    height="100"
                                                                                    style={{ display: "block" }}
                                                                                />
                                                                                <button
                                                                                    className="delete-photo"
                                                                                    onClick={() => {
                                                                                        // Remove the selected photo from car.photos
                                                                                        const updatedCarPhotos =
                                                                                            itinerary.transportation.car.photos.filter(
                                                                                                (_, i) => i !== photoIndex
                                                                                            );
                                                                                        const updatedItineraries = [
                                                                                            ...tourData.standardDetails.itineraries,
                                                                                        ];
                                                                                        updatedItineraries[index] = {
                                                                                            ...itinerary,
                                                                                            transportation: {
                                                                                                ...itinerary.transportation,
                                                                                                car: {
                                                                                                    ...itinerary.transportation.car,
                                                                                                    photos: updatedCarPhotos, // Update car photos
                                                                                                },
                                                                                            },
                                                                                        };
                                                                                        setTourData({
                                                                                            ...tourData,
                                                                                            standardDetails: {
                                                                                                ...tourData.standardDetails,
                                                                                                itineraries: updatedItineraries,
                                                                                            },
                                                                                        });
                                                                                    }}
                                                                                >
                                                                                    &times;
                                                                                </button>
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="labels">
                                                        <label className="labels"> Include Bus</label>
                                                        <input
                                                            type="checkbox"
                                                            checked={itinerary.transportation.bus?.isIncluded || false}
                                                            onChange={(e) =>
                                                                handleTransportationChange(
                                                                    index,
                                                                    "bus",
                                                                    { isIncluded: e.target.checked },
                                                                    "standardDetails"
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    {itinerary.transportation.bus?.isIncluded && (
                                                        <div className="transportation-details">
                                                            <h5>Bus Details</h5>

                                                            <label>Bus Name</label>
                                                            <input
                                                                type="text"
                                                                placeholder="Enter bus name"
                                                                value={itinerary.transportation.bus.name || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "bus",
                                                                        {
                                                                            ...itinerary.transportation.bus,
                                                                            name: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <input
                                                                type="number"
                                                                placeholder="Enter bus price"
                                                                value={itinerary.transportation.bus.price || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "bus",
                                                                        {
                                                                            ...itinerary.transportation.bus,
                                                                            price: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Departure from"
                                                                value={itinerary.transportation.bus.departureFrom || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "bus",
                                                                        {
                                                                            ...itinerary.transportation.bus,
                                                                            departureFrom: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Arrival To"
                                                                value={itinerary.transportation.bus.arrivalTo || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "bus",
                                                                        {
                                                                            ...itinerary.transportation.bus,
                                                                            arrivalTo: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <label>Bus Category</label>
                                                            <input
                                                                type="text"
                                                                placeholder="Enter bus category (e.g., AC, Non-AC)"
                                                                value={itinerary.transportation.bus.category || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "bus",
                                                                        {
                                                                            ...itinerary.transportation.bus,
                                                                            category: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />

                                                            <label>Description</label>
                                                            <textarea
                                                                placeholder="Enter bus description"
                                                                value={itinerary.transportation.bus.description || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "bus",
                                                                        {
                                                                            ...itinerary.transportation.bus,
                                                                            description: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />

                                                            <label>Departure Time</label>
                                                            <input
                                                                type="time"
                                                                value={itinerary.transportation.bus.departureTime || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "bus",
                                                                        {
                                                                            ...itinerary.transportation.bus,
                                                                            departureTime: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />

                                                            <label>Upload Bus Photos</label>
                                                            <input
                                                                type="file"
                                                                multiple
                                                                onChange={(e) =>
                                                                    handleTransportationPhotos(
                                                                        index,
                                                                        "bus",
                                                                        e.target.files,
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <div className="preview-photos">
                                                                {(itinerary.transportation.bus.photos || []).map(
                                                                    (photo, photoIndex) => (
                                                                        <img
                                                                            key={photoIndex}
                                                                            src={photo}
                                                                            alt={`Bus photo ${photoIndex + 1}`}
                                                                            width="100"
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Train Section */}
                                                    <div className="labels">
                                                        <label className="labels">Include Train</label>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                itinerary.transportation.train?.isIncluded || false
                                                            }
                                                            onChange={(e) =>
                                                                handleTransportationChange(
                                                                    index,
                                                                    "train",
                                                                    {
                                                                        ...itinerary.transportation.train,
                                                                        isIncluded: e.target.checked,
                                                                    },
                                                                    "standardDetails"
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    {itinerary.transportation.train?.isIncluded && (
                                                        <div className="transportation-details">
                                                            <label>Train Name</label>
                                                            <input
                                                                type="text"
                                                                placeholder="Enter train name"
                                                                value={itinerary.transportation.train.name || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "train",
                                                                        {
                                                                            ...itinerary.transportation.train,
                                                                            name: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Departure from"
                                                                value={itinerary.transportation.train.departureFrom || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "train",
                                                                        {
                                                                            ...itinerary.transportation.train,
                                                                            departureFrom: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <input
                                                                type="number"
                                                                placeholder="Enter train price"
                                                                value={itinerary.transportation.train.price || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "train",
                                                                        {
                                                                            ...itinerary.transportation.train,
                                                                            price: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Arrival To"
                                                                value={itinerary.transportation.train.arrivalTo || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "train",
                                                                        {
                                                                            ...itinerary.transportation.train,
                                                                            arrivalTo: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <label>Category</label>
                                                            <input
                                                                type="text"
                                                                placeholder="Enter train category"
                                                                value={itinerary.transportation.train.category || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "train",
                                                                        {
                                                                            ...itinerary.transportation.train,
                                                                            category: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />

                                                            <label>Description</label>
                                                            <textarea
                                                                placeholder="Enter train description"
                                                                value={itinerary.transportation.train.description || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "train",
                                                                        {
                                                                            ...itinerary.transportation.train,
                                                                            description: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />

                                                            <label>Departure Time</label>
                                                            <input
                                                                type="time"
                                                                value={itinerary.transportation.train.departureTime || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "train",
                                                                        {
                                                                            ...itinerary.transportation.train,
                                                                            departureTime: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />

                                                            <label>Upload Train Photos</label>
                                                            <input
                                                                type="file"
                                                                multiple
                                                                onChange={(e) =>
                                                                    handleTransportationPhotos(
                                                                        index,
                                                                        "train",
                                                                        e.target.files,
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <div className="preview-photos">
                                                                {(itinerary.transportation.train.photos || []).map(
                                                                    (photo, photoIndex) => (
                                                                        <img
                                                                            key={photoIndex}
                                                                            src={photo}
                                                                            alt={`Train photo ${photoIndex + 1}`}
                                                                            width="100"
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Flight Section */}
                                                    <div className="labels">
                                                        <label className="labels">Include Flight</label>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                itinerary.transportation.flight?.isIncluded || false
                                                            }
                                                            onChange={(e) =>
                                                                handleTransportationChange(
                                                                    index,
                                                                    "flight",
                                                                    {
                                                                        ...itinerary.transportation.flight,
                                                                        isIncluded: e.target.checked,
                                                                    },
                                                                    "standardDetails"
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                    {itinerary.transportation.flight?.isIncluded && (
                                                        <div className="transportation-details">
                                                            <label>Flight Name</label>
                                                            <input
                                                                type="text"
                                                                placeholder="Enter flight name"
                                                                value={itinerary.transportation.flight.name || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "flight",
                                                                        {
                                                                            ...itinerary.transportation.flight,
                                                                            name: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <input
                                                                type="number"
                                                                placeholder="Enter flight price"
                                                                value={itinerary.transportation.flight.price || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "flight",
                                                                        {
                                                                            ...itinerary.transportation.flight,
                                                                            price: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Departure from"
                                                                value={
                                                                    itinerary.transportation.flight.departureFrom || ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "flight",
                                                                        {
                                                                            ...itinerary.transportation.flight,
                                                                            departureFrom: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Arrival To"
                                                                value={itinerary.transportation.flight.arrivalTo || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "flight",
                                                                        {
                                                                            ...itinerary.transportation.flight,
                                                                            arrivalTo: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <label>Description</label>
                                                            <textarea
                                                                placeholder="Enter flight description"
                                                                value={itinerary.transportation.flight.description || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "flight",
                                                                        {
                                                                            ...itinerary.transportation.flight,
                                                                            description: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />

                                                            <label>Departure Time</label>
                                                            <input
                                                                type="time"
                                                                value={
                                                                    itinerary.transportation.flight.departureTime || ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "flight",
                                                                        {
                                                                            ...itinerary.transportation.flight,
                                                                            departureTime: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />

                                                            <label>Upload Flight Photos</label>
                                                            <input
                                                                type="file"
                                                                multiple
                                                                onChange={(e) =>
                                                                    handleTransportationPhotos(
                                                                        index,
                                                                        "flight",
                                                                        e.target.files,
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <div className="preview-photos">
                                                                {(itinerary.transportation.flight.photos || []).map(
                                                                    (photo, photoIndex) => (
                                                                        <img
                                                                            key={photoIndex}
                                                                            src={photo}
                                                                            alt={`Flight photo ${photoIndex + 1}`}
                                                                            width="100"
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="labels">
                                                        <label className="labels">Include Chopper</label>
                                                        <input
                                                            type="checkbox"
                                                            checked={
                                                                itinerary.transportation.chopper?.isIncluded || false
                                                            }
                                                            onChange={(e) =>
                                                                handleTransportationChange(
                                                                    index,
                                                                    "chopper",
                                                                    {
                                                                        ...itinerary.transportation.chopper,
                                                                        isIncluded: e.target.checked,
                                                                    },
                                                                    "standardDetails"
                                                                )
                                                            }
                                                        />
                                                    </div>

                                                    {itinerary.transportation.chopper?.isIncluded && (
                                                        <div className="transportation-details">
                                                            <h4>Chopper Details</h4>

                                                            {/* Chopper Company Name */}
                                                            <label>Chopper Company</label>
                                                            <input
                                                                type="text"
                                                                placeholder="Enter chopper company name"
                                                                value={itinerary.transportation.chopper.company || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "chopper",
                                                                        {
                                                                            ...itinerary.transportation.chopper,
                                                                            company: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />

                                                            {/* Chopper Departure Time */}
                                                            <label>Departure Time</label>
                                                            <input
                                                                type="time"
                                                                value={
                                                                    itinerary.transportation.chopper.departureTime || ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "chopper",
                                                                        {
                                                                            ...itinerary.transportation.chopper,
                                                                            departureTime: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />

                                                            {/* Chopper Departure From */}
                                                            <label>Departure From</label>
                                                            <input
                                                                type="text"
                                                                placeholder="Departure from"
                                                                value={
                                                                    itinerary.transportation.chopper.departureFrom || ""
                                                                }
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "chopper",
                                                                        {
                                                                            ...itinerary.transportation.chopper,
                                                                            departureFrom: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />

                                                            {/* Chopper Arrival To */}
                                                            <label>Arrival To</label>
                                                            <input
                                                                type="text"
                                                                placeholder="Arrival To"
                                                                value={itinerary.transportation.chopper.arrivalTo || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "chopper",
                                                                        {
                                                                            ...itinerary.transportation.chopper,
                                                                            arrivalTo: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />

                                                            {/* Chopper Description */}
                                                            <label>Description</label>
                                                            <textarea
                                                                placeholder="Enter chopper description"
                                                                value={itinerary.transportation.chopper.description || ""}
                                                                onChange={(e) =>
                                                                    handleTransportationChange(
                                                                        index,
                                                                        "chopper",
                                                                        {
                                                                            ...itinerary.transportation.chopper,
                                                                            description: e.target.value,
                                                                        },
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />

                                                            {/* Upload Chopper Photos */}
                                                            <label>Upload Chopper Photos</label>
                                                            <input
                                                                type="file"
                                                                multiple
                                                                onChange={(e) =>
                                                                    handleTransportationPhotos(
                                                                        index,
                                                                        "chopper",
                                                                        e.target.files,
                                                                        "standardDetails"
                                                                    )
                                                                }
                                                            />
                                                            <div className="preview-photos">
                                                                {(itinerary.transportation.chopper.photos || []).map(
                                                                    (photo, photoIndex) => (
                                                                        <img
                                                                            key={photoIndex}
                                                                            src={photo}
                                                                            alt={`Chopper photo ${photoIndex + 1}`}
                                                                            width="100"
                                                                        />
                                                                    )
                                                                )}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <button
                                                type="button"
                                                onClick={() => removeItinerary("standardDetails", index)}
                                                className="deleteButton"
                                            >
                                                Remove Itinerary
                                            </button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => addItinerary("standardDetails")}>
                                        Add Standard Itinerary
                                    </button>
                                </div>
                                <h3>Batches</h3>
                                {tourData?.batch?.map((batch, index) => (
                                    <div key={index} className="batchContainer">
                                        <h4>Batch {index + 1}</h4>
                                        <div className="formGroup">
                                            <label>Season Name</label>
                                            <input
                                                type="text"
                                                value={batch.seasonName}
                                                onChange={(e) => updateBatch(index, "seasonName", e.target.value)}
                                            />
                                        </div>

                                        <div className="formGroup">
                                            <label>Min People</label>
                                            <input
                                                type="number"
                                                value={batch.minPeople}
                                                onChange={(e) => updateBatch(index, "minPeople", e.target.value)}
                                            />
                                        </div>

                                        <div className="formGroup">
                                            <label>Tour Start Date</label>
                                            <input
                                                type="date"
                                                value={batch.tourStartDate}
                                                onChange={(e) => updateBatch(index, "tourStartDate", e.target.value)}
                                            />
                                        </div>

                                        <div className="formGroup">
                                            <label>Tour End Date</label>
                                            <input
                                                type="date"
                                                value={batch.tourEndDate}
                                                onChange={(e) => updateBatch(index, "tourEndDate", e.target.value)}
                                            />
                                        </div>

                                        <div className="formGroup">
                                            <label>Group Size</label>
                                            <input
                                                type="number"
                                                value={batch.groupSize}
                                                onChange={(e) => updateBatch(index, "groupSize", e.target.value)}
                                            />
                                        </div>

                                        <div className="formGroup">
                                            <label>Min Booking Date</label>
                                            <input
                                                type="number"
                                                value={batch.minBookingDate}
                                                onChange={(e) => updateBatch(index, "minBookingDate", e.target.value)}
                                            />
                                        </div>

                                        <div className="formGroup">
                                            <label>Seat Booked</label>
                                            <input
                                                type="number"
                                                value={batch.seatBooked}
                                                onChange={(e) => updateBatch(index, "seatBooked", e.target.value)}
                                            />
                                        </div>

                                        <div className="formGroup">
                                            <label> Double Sharing Price</label>
                                            <input
                                                type="number"
                                                value={batch.doubleSharingPrice}
                                                onChange={(e) => updateBatch(index, "doubleSharingPrice", e.target.value)}
                                                placeholder='Double sharing price'
                                            />
                                            <label> Quad Sharing Price</label>
                                            <input
                                                type="number"
                                                value={batch.quadSharingPrice}
                                                onChange={(e) => updateBatch(index, "quadSharingPrice", e.target.value)}
                                                placeholder='Quad sharing price'
                                            />
                                            <label> Group Sharing Price</label>
                                            <input
                                                type="number"
                                                value={batch.groupSharingPrice}
                                                onChange={(e) => updateBatch(index, "groupSharingPrice", e.target.value)}
                                                placeholder='Group sharing price'
                                            />
                                        </div>

                                        {tourData.batch.length > 1 && (
                                            <button type="button" onClick={() => removeBatch(index)}>
                                                Remove Batch
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button type="button" onClick={addBatch}>
                                    + Add Batch
                                </button>
                            </div>
                            {loading ? (
                                <div className="loader-container">
                                    <RotatingLines
                                        visible={true}
                                        height="60"
                                        width="60"
                                        color="grey"
                                        strokeWidth="5"
                                        animationDuration="0.75"
                                        ariaLabel="rotating-lines-loading"
                                        wrapperStyle={{}} // Optional, can be used for additional inline styling
                                        wrapperClass="" // Optional, if you want to use a className
                                    />
                                </div>
                            ) : (
                                <button type="submit">Submit</button>
                            )}

                        </form>






                    </div>
                </div>
            </div>
        </>

    );
};

export default NewDestination;

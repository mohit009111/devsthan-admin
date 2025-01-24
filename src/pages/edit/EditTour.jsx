import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./EditTour.css";
import { BASE_URL } from "../../utils/headers";
import { toast, ToastContainer } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";
import { RotatingLines } from "react-loader-spinner";
import { v4 as uuidv4 } from "uuid";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  CircularProgress, // Importing the CircularProgress component
} from "@mui/material";
// import { v2 as cloudinary } from 'cloudinary';

const NewTour = ({ title }) => {
  const [openTranportation, setOpenTranportation] = useState(false);
  const [openPremiumTranportation, setOpenPremiumTranportation] =
    useState(false);
  const [openStandardTransportation, setOpenStandardTransportation] =
    useState(false);
  const [selectedTourType, setSelectedTourType] = useState("standard");
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [destinations, setDestinations] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  const [tourData, setTourData] = useState({});

  const [isLoading, setIsLoading] = useState(false);


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

  const handletermsChange = (value, name) => {
    // Check if 'value' and 'name' are correctly passed
    console.log(name, value);

    // Update state based on the input name
    setTourData((prev) => ({
      ...prev,
      [name]: value, // Use the name and value to update the state
    }));
  };
  const handleDeleteBanner = () => {
    setTourData((prevState) => ({
      ...prevState,
      bannerImage: "",
    }));
  };

  const handleFieldChange = (field, value, category) => {
    setTourData((prevData) => ({
      ...prevData,
      [category]: {
        ...prevData[category],
        [field]: value,
      },
    }));
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

  const handleCategorySelect = (categoryId) => {
    if (!tourData.categories.includes(categoryId)) {
      setTourData((prevData) => ({
        ...prevData,
        categories: [...prevData.categories, categoryId],
      }));
    }
  };
  const hotelCategoryOptions = [
    "Luxury",
    "Budget",
    "Boutique",
    "Resort",
    "Eco-Friendly",
  ];

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
      activity: {
        name: "",
        description: "",
        price: "",
        photos: [],
      },
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
        isIncluded: false,
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
      siteSeen: {
        isAvailable: false,
        name: "",
        description: "",
        photos: [],
      },
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
  const handleSiteSeenPhotoChange = (event, itineraryIndex, detailsType) => {
    const files = Array.from(event.target.files); // Convert FileList to an array
    setTourData((prevData) => {
      const updatedItineraries = [...prevData[detailsType].itineraries];
      updatedItineraries[itineraryIndex] = {
        ...updatedItineraries[itineraryIndex],
        siteSeenPhotos: [
          ...updatedItineraries[itineraryIndex].siteSeenPhotos,
          ...files,
        ], // Append new photos
      };
      return {
        ...prevData,
        [detailsType]: {
          ...prevData[detailsType],
          itineraries: updatedItineraries,
        },
      };
    });
  };
  const handleHotelPhotoChange = (event, itineraryIndex, detailsType) => {
    const files = Array.from(event.target.files); // Convert FileList to an array
    setTourData((prevData) => {
      const updatedItineraries = [...prevData[detailsType].itineraries];
      updatedItineraries[itineraryIndex] = {
        ...updatedItineraries[itineraryIndex],
        hotelPhotos: [
          ...updatedItineraries[itineraryIndex].hotelPhotos,
          ...files,
        ], // Append new photos
      };
      return {
        ...prevData,
        [detailsType]: {
          ...prevData[detailsType],
          itineraries: updatedItineraries,
        },
      };
    });
  };

  const handleDeleteSiteSeenPhoto = (
    itineraryIndex,
    photoIndex,
    itineraryType
  ) => {
    setTourData((prevData) => {
      const updatedItineraries = [...prevData.standardDetails.itineraries];
      updatedItineraries[itineraryIndex].siteSeenPhotos = updatedItineraries[
        itineraryIndex
      ].siteSeenPhotos.filter((_, index) => index !== photoIndex);

      return {
        ...prevData,
        standardDetails: {
          ...prevData.standardDetails,
          itineraries: updatedItineraries,
        },
      };
    });
  };
  const handleQuillChange = (value, fieldName) => {
    setTourData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleDeleteHotelPhoto = (
    itineraryIndex,
    photoIndex,
    itineraryType
  ) => {
    setTourData((prevData) => {
      const updatedItineraries = [...prevData.standardDetails.itineraries];
      updatedItineraries[itineraryIndex].hotelPhotos = updatedItineraries[
        itineraryIndex
      ].hotelPhotos.filter((_, index) => index !== photoIndex);

      return {
        ...prevData,
        standardDetails: {
          ...prevData.standardDetails,
          itineraries: updatedItineraries,
        },
      };
    });
  };

  const handleAttributeSelect = (attributeId) => {
    if (!tourData.attributes.includes(attributeId)) {
      setTourData((prevData) => ({
        ...prevData,
        attributes: [...prevData.attributes, attributeId],
      }));
    }
  };
  const handleAttributeRemove = (attributeId) => {
    setTourData((prevData) => ({
      ...prevData,
      attributes: prevData.attributes.filter((id) => id !== attributeId),
    }));
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

  // Function to handle deleting car photos
  const handleDeleteCarPhoto = (itineraryIndex, photoIndex, packageType) => {
    const updatedItineraries = [...tourData[packageType].itineraries];

    // Remove the selected photo from carPhotos
    updatedItineraries[itineraryIndex].carPhotos.splice(photoIndex, 1);

    setTourData((prevState) => ({
      ...prevState,
      [packageType]: {
        ...prevState[packageType],
        itineraries: updatedItineraries,
      },
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

  const handleCarPhotosChange = (e, index, packageType) => {
    const files = Array.from(e.target.files); // Convert the FileList to an array
    const updatedItineraries = [...tourData[packageType].itineraries];

    // Append the new files to the existing carPhotos array
    updatedItineraries[index].carPhotos = [
      ...updatedItineraries[index].carPhotos,
      ...files,
    ];

    setTourData((prevState) => ({
      ...prevState,
      [packageType]: {
        ...prevState[packageType],
        itineraries: updatedItineraries,
      },
    }));
  };

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
  const handleStandardBedPriceChange = (
    itineraryIndex,
    bedType,
    field,
    value
  ) => {
    setTourData((prev) => {
      const updated = { ...prev };
      updated.standardDetails.itineraries[itineraryIndex].hotel.beds[bedType][
        field
      ] = value;
      return updated;
    });
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
  const handleCategoryRemove = (categoryId) => {
    setTourData((prevData) => ({
      ...prevData,
      categories: prevData.categories.filter((id) => id !== categoryId),
    }));
  };

  const addLanguageField = () => {
    setTourData((prevData) => ({
      ...prevData,
      languages: [...prevData.languages, ""], // Adds a new empty string to the languages array
    }));
  };

  // Function to remove a language field
  const removeLanguage = (index) => {
    setTourData((prevData) => ({
      ...prevData,
      languages: prevData.languages.filter((_, i) => i !== index),
    }));
  };

  // Handle input change for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;

    setTourData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
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

  const addArrayField = (field, category) => {
    setTourData((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: [...(prev[category][field] || []), ""], // Ensure the field is an array
      },
    }));
  };
  const addPricingArrayField = (field, category) => {
    setTourData((prev) => {
      const updatedCategory = { ...prev[category] };
      const updatedPricing = [...updatedCategory.pricing];

      // Determine the next person count
      const nextPerson =
        updatedPricing.length > 0 ? updatedPricing.length + 1 : 1;

      // Create a new pricing object
      const newPricing = {
        person: nextPerson,
        price: "",
      };

      // Add the new pricing entry
      updatedPricing.push(newPricing);

      return {
        ...prev,
        [category]: {
          ...updatedCategory,
          pricing: updatedPricing,
        },
      };
    });
  };

  const removeArrayField = (index, field, category) => {
    const updatedCategory = { ...tourData[category] };
    updatedCategory[field] = updatedCategory[field].filter(
      (_, i) => i !== index
    );

    setTourData((prevData) => ({
      ...prevData,
      [category]: updatedCategory,
    }));
  };
  const handleLocationSelect = (field, value) => {
    setTourData((prevTourData) => ({
      ...prevTourData,
      [field]: value,
    }));
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

  const handleArrayChange = (index, field, value, category) => {
    setTourData((prevData) => {
      const updatedCategory = { ...prevData[category] };

      // Ensure the field is an array
      if (!Array.isArray(updatedCategory[field])) {
        updatedCategory[field] = [];
      }

      // Update the specific index in the array
      updatedCategory[field][index] = value;

      return {
        ...prevData,
        [category]: updatedCategory,
      };
    });
  };

  const handlePricingArrayChange = (index, updatedValue, category) => {
    setTourData((prevData) => {
      // Clone the current category (standard, deluxe, or premium)
      const updatedCategory = { ...prevData[category] };

      // Update the specific pricing entry in the category
      updatedCategory.pricing[index] = updatedValue;

      return {
        ...prevData,
        [category]: updatedCategory,
      };
    });
  };

  const handleArrayChangeLanguage = (index, value) => {
    setTourData((prevData) => {
      // Create a copy of the languages array
      const updatedLanguages = [...prevData.languages];

      // Update the specific index in the array
      updatedLanguages[index] = value;

      // Return the new state
      return {
        ...prevData,
        languages: updatedLanguages,
      };
    });
  };

  useEffect(() => {
    // Fetch categories from API
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/api/categories`);
        const responseAttribute = await fetch(`${BASE_URL}/api/attributes`);
        const tour = await fetch(`${BASE_URL}/api/getTour/${id}`);
        const tourJson = await tour.json();
        console.log(tourJson);
        const responseADestinations = await fetch(
          `${BASE_URL}/api/getAllDestinations`
        );
        const attributeData = await responseAttribute.json();
        const destinationData = await responseADestinations.json();
        const data = await response.json();
        console.log(data);
        setTourData(tourJson[0]);
        setAttributes(attributeData);
        setCategories(data);
        setDestinations(destinationData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }finally{
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);
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
            { key: "siteSeen.photos", photos: itinerary.siteSeen?.photos },
            {
              key: "welcomeDrinks.photos",
              photos: itinerary.welcomeDrinks?.photos,
            },
            { key: "photos", photos: itinerary.photos },
            { key: "hotel.hotelImages", photos: itinerary.hotel?.hotelImages },
            { key: "hotel.roomImages", photos: itinerary.hotel?.roomImages },
            { key: "tourManager.photo", photos: itinerary.tourManager?.photo },
            { key: "activity.photos", photos: itinerary.activity?.photos },
          ];

          

          const mealTypes = ["breakfast", "lunch", "dinner"];
          mealTypes.forEach((mealType) => {
            if (Array.isArray(itinerary.meals?.[mealType]?.photos)) {
              uploadFields.push({
                key: `meals.${mealType}.photos`,
                photos: itinerary.meals[mealType].photos,
              });
            }
          });

          const transportModes = ["car", "bus", "train", "flight", "chopper"];
          transportModes.forEach((mode) => {
            if (Array.isArray(itinerary.transportation?.[mode]?.photos)) {
              uploadFields.push({
                key: `transportation.${mode}.photos`,
                photos: itinerary.transportation[mode].photos,
              });
            }
          });

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
        const response = await fetch(`${BASE_URL}/api/createTours`, {
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

  const renderStandardDetails = () => (
    <div className="standardDetails">
      <h3>Standard Tour Details</h3>

      {/* Price Field */}

      {/* Pricing Field */}
      <div className="formGroup">
        <label>Pricing</label>
        {tourData.standardDetails?.pricing?.map((priceObj, index) => (
          <div key={index}>
            <input
              type="number"
              value={priceObj.price}
              onChange={(e) =>
                handlePricingArrayChange(
                  index,
                  { ...priceObj, price: e.target.value },
                  "standardDetails"
                )
              }
              placeholder={`Price for ${priceObj.person} person`}
            />
            <input
              type="number"
              value={priceObj.rooms && priceObj.rooms}
              onChange={(e) =>
                handlePricingArrayChange(
                  index,
                  { ...priceObj, rooms: e.target.value },
                  "standardDetails"
                )
              }
              placeholder={`No. of rooms`}
            />

            {tourData.standardDetails.pricing.length > 1 && (
              <button
                type="button"
                className="deleteButton"
                onClick={() =>
                  removeArrayField(index, "pricing", "standardDetails")
                }
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addPricingArrayField("pricing", "standardDetails")}
          className="add-more"
        >
          Add More Pricing
        </button>
      </div>

      <div className="formGroup">
        <label>Standard Cancellation Policy</label>
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

      <div className="formGroup">
        <h3>Standard Itineraries</h3>
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
              {" "}
              <label>Siteseen:</label>
              <input
                type="checkbox"
                checked={itinerary.siteSeen?.isAvailable || false}
                onChange={(e) =>
                  handleItineraryChange(
                    index,
                    "siteSeen",
                    { ...itinerary.siteSeen, isAvailable: e.target.checked },
                    "standardDetails"
                  )
                }
              />
            </div>

            {itinerary.siteSeen?.isAvailable && (
              <div className="siteseen-section">
                <h4>Siteseen Details</h4>

                {/* Siteseen Name */}
                <input
                  type="text"
                  placeholder="Enter Siteseen name"
                  value={itinerary.siteSeen.name || ""}
                  onChange={(e) =>
                    handleItineraryChange(
                      index,
                      "siteSeen",
                      { ...itinerary.siteSeen, name: e.target.value },
                      "standardDetails"
                    )
                  }
                />

                {/* Siteseen Description */}
                <textarea
                  placeholder="Enter Siteseen description"
                  value={itinerary.siteSeen.description || ""}
                  onChange={(e) =>
                    handleItineraryChange(
                      index,
                      "siteSeen",
                      { ...itinerary.siteSeen, description: e.target.value },
                      "standardDetails"
                    )
                  }
                ></textarea>

                {/* Siteseen Photos */}
                <label>Upload Siteseen Photos</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files).map((file) =>
                      URL.createObjectURL(file)
                    );
                    handleItineraryChange(
                      index,
                      "siteSeen",
                      {
                        ...itinerary.siteSeen,
                        photos: [
                          ...(itinerary.siteSeen.photos || []),
                          ...files,
                        ],
                      },
                      "standardDetails"
                    );
                  }}
                />

                <div className="preview-photos">
                  {itinerary.siteSeen?.photos &&
                    itinerary.siteSeen.photos.map((photo, photoIndex) => (
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
                          alt={`Siteseen photo ${photoIndex + 1}`}
                          width="100"
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
                            padding: "5px",
                          }}
                          onClick={() => {
                            const updatedPhotos =
                              itinerary.siteSeen.photos.filter(
                                (_, i) => i !== photoIndex
                              );
                            handleItineraryChange(
                              index,
                              "siteSeen",
                              { ...itinerary.siteSeen, photos: updatedPhotos },
                              "standardDetails"
                            );
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                </div>
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
              <label> Include Activity</label>
              <input
                type="checkbox"
                checked={itinerary.activity?.isIncluded || false}
                onChange={(e) =>
                  handleItineraryChange(
                    index,
                    "activity",
                    { ...itinerary.activity, isIncluded: e.target.checked },
                    "standardDetails"
                  )
                }
              />
            </div>

            {itinerary.activity?.isIncluded && (
              <div className="activity-details">
                <input
                  type="text"
                  placeholder="Enter activity name"
                  value={itinerary.activity.name || ""}
                  onChange={(e) =>
                    handleItineraryChange(
                      index,
                      "activity",
                      { ...itinerary.activity, name: e.target.value },
                      "standardDetails"
                    )
                  }
                />
                <textarea
                  placeholder="Enter activity description"
                  value={itinerary.activity.description || ""}
                  onChange={(e) =>
                    handleItineraryChange(
                      index,
                      "activity",
                      { ...itinerary.activity, description: e.target.value },
                      "standardDetails"
                    )
                  }
                />

                <input
                  type="number"
                  placeholder="Enter activity price"
                  value={itinerary.activity.price || ""}
                  onChange={(e) =>
                    handleItineraryChange(
                      index,
                      "activity",
                      { ...itinerary.activity, price: e.target.value },
                      "standardDetails"
                    )
                  }
                />

                <label>Upload Photos</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    handleActivityPhotos(
                      index,
                      "activity",
                      e.target.files,
                      "standardDetails"
                    )
                  }
                />
                {itinerary.activity.photos.length > 0 && (
                  <div className="preview-photos">
                    {itinerary.activity.photos.map((photo, photoIndex) => (
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
                          src={photo}
                          alt={`Activity photo ${photoIndex + 1}`}
                          width="100"
                          style={{ display: "block" }}
                        />
                        <button
                          onClick={() => {
                            // Remove the selected photo
                            const updatedActivityPhotos =
                              itinerary.activity.photos.filter(
                                (_, i) => i !== photoIndex
                              );
                            const updatedItineraries = [
                              ...tourData.standardDetails.itineraries,
                            ];
                            updatedItineraries[index] = {
                              ...itinerary,
                              activity: {
                                ...itinerary.activity,
                                photos: updatedActivityPhotos, // Update activity photos
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
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
    </div>
  );

  const renderDeluxeDetails = () => (
    <div className="deluxeDetails">
      <h3>Deluxe Tour Details</h3>

      {/* Price Field */}
      <div className="formGroup">
        <label>Pricing</label>
        {tourData?.deluxeDetails?.pricing.map((priceObj, index) => (
          <div key={index}>
            <input
              type="number"
              value={priceObj.price}
              onChange={(e) =>
                handlePricingArrayChange(
                  index,
                  { ...priceObj, price: e.target.value },
                  "deluxeDetails"
                )
              }
              placeholder={`Price for ${priceObj.person} person`}
            />
            <input
              type="number"
              value={priceObj.rooms && priceObj.rooms}
              onChange={(e) =>
                handlePricingArrayChange(
                  index,
                  { ...priceObj, rooms: e.target.value },
                  "deluxeDetails"
                )
              }
              placeholder={`No. of rooms`}
            />
            {tourData.deluxeDetails.pricing.length > 1 && (
              <button
                type="button"
                className="deleteButton"
                onClick={() =>
                  removeArrayField(index, "pricing", "deluxeDetails")
                }
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addPricingArrayField("pricing", "deluxeDetails")}
          className="add-more"
        >
          Add More Pricing
        </button>
      </div>

      {/* Cancellation Policy */}
      <div className="formGroup">
        <label>Deluxe Cancellation Policy</label>
        <ReactQuill
          name="cancellationPolicy"
          value={tourData?.deluxeDetails?.cancellationPolicy || ""}
          onChange={(value) =>
            handleFieldChange("cancellationPolicy", value, "deluxeDetails")
          }
          placeholder="Enter cancellation policy"
        />
      </div>

      {/* Highlights */}

      <div className="formGroup">
        <label>Highlights</label>
        <ReactQuill
          name="highlights"
          value={tourData?.deluxeDetails?.highlights || ""}
          onChange={(value) =>
            handleFieldChange("highlights", value, "deluxeDetails")
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
          value={tourData?.deluxeDetails?.whatsIncluded || ""}
          onChange={(value) =>
            handleFieldChange("whatsIncluded", value, "deluxeDetails")
          }
          placeholder="Enter whatsIncluded"
        />
      </div>

      {/* What's Excluded Field */}
      <div className="formGroup">
        <label>What's Excluded</label>
        <ReactQuill
          name="whatsExcluded"
          value={tourData?.deluxeDetails?.whatsExcluded || ""}
          onChange={(value) =>
            handleFieldChange("whatsExcluded", value, "deluxeDetails")
          }
          placeholder="Enter whatsExcluded"
        />
      </div>

      <div className="formGroup">
        <h3>Deluxe Itineraries</h3>
        {tourData.deluxeDetails.itineraries.map((itinerary, index) => (
          <div key={index} className="itinerary">
            <label>Day {itinerary.day}</label>
            <label>Itinerary Photos</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                handleItineraryPhotos(index, e.target.files, "deluxeDetails")
              }
            />
            <div className="photo-preview">
              <div className="preview-photos">
                {tourData.deluxeDetails.itineraries[index].photos?.map(
                  (photo, photoIndex) => (
                    <div key={photoIndex} className="photo-container">
                      <img
                        src={photo}
                        alt={`Itinerary Photo ${photoIndex + 1}`}
                        width="100"
                        height="100"
                        style={{ margin: "5px" }}
                      />
                      <button
                        className="delete-photo"
                        onClick={() => {
                          // Remove the selected photo by filtering it out
                          const updatedPhotos =
                            tourData.deluxeDetails.itineraries[
                              index
                            ].photos.filter((_, i) => i !== photoIndex);
                          const updatedItinerary = {
                            ...tourData.deluxeDetails.itineraries[index],
                            photos: updatedPhotos, // Update the photos array
                          };

                          // Update the state with the new itinerary
                          const updatedItineraries = [
                            ...tourData.deluxeDetails.itineraries,
                          ];
                          updatedItineraries[index] = updatedItinerary;

                          setTourData({
                            ...tourData,
                            deluxeDetails: {
                              ...tourData.deluxeDetails,
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
                  "deluxeDetails"
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
                  "deluxeDetails"
                )
              }
              placeholder="Enter itinerary description"
            />

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
                    "deluxeDetails"
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
                      "deluxeDetails"
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
                      "deluxeDetails"
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
                      "deluxeDetails"
                    );
                  }}
                />

                <div className="preview-photos">
                  {itinerary.welcomeDrinks.photos &&
                    itinerary.welcomeDrinks.photos.map((photo, photoIndex) => (
                      <div key={photoIndex} className="photo-container">
                        <img
                          src={photo}
                          alt={`Welcome Drinks photo ${photoIndex + 1}`}
                          width="100"
                        />
                        <button
                          className="delete-photo"
                          onClick={() => {
                            // Remove the selected photo by filtering it out
                            const updatedPhotos =
                              itinerary.welcomeDrinks.photos.filter(
                                (_, i) => i !== photoIndex
                              );
                            const updatedItinerary = {
                              ...itinerary,
                              welcomeDrinks: {
                                ...itinerary.welcomeDrinks,
                                photos: updatedPhotos, // Update the photos array
                              },
                            };

                            setTourData({
                              ...tourData,
                              standardDetails: {
                                ...tourData.standardDetails,
                                itineraries:
                                  tourData.standardDetails.itineraries.map(
                                    (it, idx) =>
                                      idx === index ? updatedItinerary : it
                                  ),
                              },
                            });
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                </div>
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
                    "deluxeDetails"
                  )
                }
              />
            </div>

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
                      { ...itinerary.price, price: e.target.value },
                      "deluxeDetails"
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
                      "deluxeDetails"
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="Enter Tour Departure from"
                  value={itinerary.tourManager.departureFrom || ""}
                  onChange={(e) =>
                    handleItineraryChange(
                      index,
                      "tourManager",
                      {
                        ...itinerary.tourManager,
                        departureFrom: e.target.value,
                      },
                      "deluxeDetails"
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="Enter Tour arrival to"
                  value={itinerary.tourManager.arrivalTo || ""}
                  onChange={(e) =>
                    handleItineraryChange(
                      index,
                      "tourManager",
                      { ...itinerary.tourManager, arrivalTo: e.target.value },
                      "deluxeDetails"
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
                      "deluxeDetails"
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
                      "deluxeDetails"
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
                    <button
                      className="delete-photo"
                      onClick={() => {
                        // Remove the tour manager's photo
                        const updatedItinerary = {
                          ...itinerary,
                          tourManager: {
                            ...itinerary.tourManager,
                            photo: null, // Set the photo field to null
                          },
                        };

                        setTourData({
                          ...tourData,
                          standardDetails: {
                            ...tourData.standardDetails,
                            itineraries:
                              tourData.standardDetails.itineraries.map(
                                (it, idx) =>
                                  idx === index ? updatedItinerary : it
                              ),
                          },
                        });
                      }}
                    >
                      &times;
                    </button>
                  </div>
                )}
              </div>
            )}

            <div className="labels">
              {" "}
              <label>Siteseen:</label>
              <input
                type="checkbox"
                checked={itinerary.siteSeen?.isAvailable || false}
                onChange={(e) =>
                  handleItineraryChange(
                    index,
                    "siteSeen",
                    { ...itinerary.siteSeen, isAvailable: e.target.checked },
                    "deluxeDetails"
                  )
                }
              />
            </div>

            {itinerary.siteSeen?.isAvailable && (
              <div className="siteseen-section">
                <h4>Siteseen Details</h4>

                {/* Siteseen Name */}
                <input
                  type="text"
                  placeholder="Enter Siteseen name"
                  value={itinerary.siteSeen.name || ""}
                  onChange={(e) =>
                    handleItineraryChange(
                      index,
                      "siteSeen",
                      { ...itinerary.siteSeen, name: e.target.value },
                      "deluxeDetails"
                    )
                  }
                />

                {/* Siteseen Description */}
                <textarea
                  placeholder="Enter Siteseen description"
                  value={itinerary.siteSeen.description || ""}
                  onChange={(e) =>
                    handleItineraryChange(
                      index,
                      "siteSeen",
                      { ...itinerary.siteSeen, description: e.target.value },
                      "deluxeDetails"
                    )
                  }
                ></textarea>

                {/* Siteseen Photos */}
                <label>Upload Siteseen Photos</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files).map((file) =>
                      URL.createObjectURL(file)
                    );
                    handleItineraryChange(
                      index,
                      "siteSeen",
                      {
                        ...itinerary.siteSeen,
                        photos: [
                          ...(itinerary.siteSeen.photos || []),
                          ...files,
                        ],
                      },
                      "deluxeDetails"
                    );
                  }}
                />

                <div className="preview-photos">
                  {itinerary.siteSeen.photos &&
                    itinerary.siteSeen.photos.map((photo, photoIndex) => (
                      <div key={photoIndex} className="photo-container">
                        <img
                          src={photo}
                          alt={`Siteseen photo ${photoIndex + 1}`}
                          width="100"
                        />
                        <button
                          className="delete-photo"
                          onClick={() => {
                            const updatedPhotos =
                              itinerary.siteSeen.photos.filter(
                                (_, i) => i !== photoIndex
                              );
                            handleItineraryChange(
                              index,
                              "siteSeen",
                              { ...itinerary.siteSeen, photos: updatedPhotos },
                              "deluxeDetails"
                            );
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="labels">
              <label>Include Hotel</label>
              <input
                type="checkbox"
                checked={itinerary.hotel.isIncluded || false}
                onChange={(e) => {
                  const updatedItineraries = [
                    ...tourData.deluxeDetails.itineraries,
                  ];
                  updatedItineraries[index].hotel.isIncluded = e.target.checked;
                  setTourData({
                    ...tourData,
                    deluxeDetails: {
                      ...tourData.deluxeDetails,
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
                      ...tourData.deluxeDetails.itineraries,
                    ];
                    updatedItineraries[index].hotel.name = e.target.value;
                    setTourData({
                      ...tourData,
                      deluxeDetails: {
                        ...tourData.deluxeDetails,
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
                      ...tourData.deluxeDetails.itineraries,
                    ];
                    updatedItineraries[index].hotel.url = e.target.value;
                    setTourData({
                      ...tourData,
                      deluxeDetails: {
                        ...tourData.deluxeDetails,
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
                      ...tourData.deluxeDetails.itineraries,
                    ];
                    updatedItineraries[index].showCategoryOptions = true;
                    setTourData({
                      ...tourData,
                      deluxeDetails: {
                        ...tourData.deluxeDetails,
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
                            ...tourData.deluxeDetails.itineraries,
                          ];
                          updatedItineraries[index].hotel.hotelCategory = [
                            option,
                          ];
                          updatedItineraries[index].showCategoryOptions = false; // Hide options after selection
                          setTourData({
                            ...tourData,
                            deluxeDetails: {
                              ...tourData.deluxeDetails,
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
                    handleHotelImages(index, e.target.files, "deluxeDetails")
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
                              ...tourData.deluxeDetails.itineraries,
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
                              deluxeDetails: {
                                ...tourData.deluxeDetails,
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
                      ...tourData.deluxeDetails.itineraries,
                    ];
                    updatedItineraries[index].hotel.roomCategory =
                      e.target.value;
                    setTourData({
                      ...tourData,
                      deluxeDetails: {
                        ...tourData.deluxeDetails,
                        itineraries: updatedItineraries,
                      },
                    });
                  }}
                />
                <div className="deluxe-details-pricing">
                  <h4>Deluxe Details: Bed Pricing</h4>
                  {Object.keys(
                    tourData.deluxeDetails.itineraries[index].hotel.beds
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
                              tourData.deluxeDetails.itineraries[index].hotel
                                .beds[bedType].price || ""
                            }
                            onChange={(e) =>
                              handleBedPriceChange(
                                "deluxe",
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
                              tourData.deluxeDetails.itineraries[index].hotel
                                .beds[bedType].extraBedPrice || ""
                            }
                            onChange={(e) =>
                              handleBedPriceChange(
                                "deluxe",
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
                    handleRoomImages(index, e.target.files, "deluxeDetails")
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
                              ...tourData.deluxeDetails.itineraries,
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
                              deluxeDetails: {
                                ...tourData.deluxeDetails,
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
                      ...tourData.deluxeDetails.itineraries,
                    ];
                    updatedItineraries[index].hotel.location = e.target.value;
                    setTourData({
                      ...tourData,
                      deluxeDetails: {
                        ...tourData.deluxeDetails,
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
                    "deluxeDetails"
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
                      handleMealChange(e, index, "breakfast", "deluxeDetails")
                    }
                  />
                </div>

                {itinerary.meals.breakfast.isAvailable == true && (
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
                          "deluxeDetails"
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
                          "deluxeDetails"
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
                                  onClick={() => {
                                    // Remove the selected breakfast photo by filtering it out
                                    const updatedPhotos =
                                      itinerary.meals.breakfast.photos.filter(
                                        (_, i) => i !== photoIndex
                                      );
                                    const updatedItinerary = {
                                      ...itinerary,
                                      meals: {
                                        ...itinerary.meals,
                                        breakfast: {
                                          ...itinerary.meals.breakfast,
                                          photos: updatedPhotos, // Update the breakfast photos array
                                        },
                                      },
                                    };

                                    setTourData({
                                      ...tourData,
                                      standardDetails: {
                                        ...tourData.standardDetails,
                                        itineraries:
                                          tourData.standardDetails.itineraries.map(
                                            (it, idx) =>
                                              idx === index
                                                ? updatedItinerary
                                                : it
                                          ),
                                      },
                                    });
                                  }}
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
                      handleMealChange(e, index, "lunch", "deluxeDetails")
                    }
                  />
                </div>

                {itinerary?.meals?.lunch.isAvailable == true && (
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
                          "deluxeDetails"
                        )
                      }
                      placeholder="Enter lunch name"
                    />
                    <label>Breakfast Photos</label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        handleItineraryMealsChange(
                          index,
                          "lunch",
                          "photos",
                          Array.from(e.target.files),
                          "deluxeDetails"
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
                                  onClick={() => {
                                    // Remove the selected photo by filtering it out
                                    const updatedPhotos =
                                      itinerary.meals.lunch.photos.filter(
                                        (_, i) => i !== photoIndex
                                      );
                                    const updatedItinerary = {
                                      ...itinerary,
                                      meals: {
                                        ...itinerary.meals,
                                        lunch: {
                                          ...itinerary.meals.lunch,
                                          photos: updatedPhotos, // Update the lunch photos array
                                        },
                                      },
                                    };

                                    setTourData({
                                      ...tourData,
                                      standardDetails: {
                                        ...tourData.standardDetails,
                                        itineraries:
                                          tourData.standardDetails.itineraries.map(
                                            (it, idx) =>
                                              idx === index
                                                ? updatedItinerary
                                                : it
                                          ),
                                      },
                                    });
                                  }}
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
                      handleMealChange(e, index, "dinner", "deluxeDetails")
                    }
                  />
                </div>
                {itinerary?.meals?.dinner?.isAvailable == true && (
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
                          "deluxeDetails"
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
                          "deluxeDetails"
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
                                      "deluxeDetails"
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
              <label> Include Activity</label>
              <input
                type="checkbox"
                checked={itinerary.activity?.isIncluded || false}
                onChange={(e) =>
                  handleItineraryChange(
                    index,
                    "activity",
                    { ...itinerary.activity, isIncluded: e.target.checked },
                    "deluxeDetails"
                  )
                }
              />
            </div>

            {itinerary.activity?.isIncluded && (
              <div className="activity-details">
                <input
                  type="text"
                  placeholder="Enter activity name"
                  value={itinerary.activity.name || ""}
                  onChange={(e) =>
                    handleItineraryChange(
                      index,
                      "activity",
                      { ...itinerary.activity, name: e.target.value },
                      "deluxeDetails"
                    )
                  }
                />
                <textarea
                  placeholder="Enter activity description"
                  value={itinerary.activity.description || ""}
                  onChange={(e) =>
                    handleItineraryChange(
                      index,
                      "activity",
                      { ...itinerary.activity, description: e.target.value },
                      "deluxeDetails"
                    )
                  }
                />

                <input
                  type="number"
                  placeholder="Enter activity price"
                  value={itinerary.activity.price || ""}
                  onChange={(e) =>
                    handleItineraryChange(
                      index,
                      "activity",
                      { ...itinerary.activity, price: e.target.value },
                      "deluxeDetails"
                    )
                  }
                />

                <label>Upload Photos</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    handleActivityPhotos(
                      index,
                      "activity",
                      e.target.files,
                      "deluxeDetails"
                    )
                  }
                />
                {itinerary.activity.photos.length > 0 && (
                  <div className="preview-photos">
                    {itinerary.activity.photos.map((photo, photoIndex) => (
                      <div key={photoIndex} className="photo-container">
                        <img
                          src={photo}
                          alt={`Activity photo ${photoIndex + 1}`}
                          width="100"
                        />
                        <button
                          className="delete-photo"
                          onClick={() => {
                            // Remove the selected photo
                            const updatedActivityPhotos =
                              itinerary.activity.photos.filter(
                                (_, i) => i !== photoIndex
                              );
                            const updatedItineraries = [
                              ...tourData.deluxeDetails.itineraries,
                            ];
                            updatedItineraries[index] = {
                              ...itinerary,
                              activity: {
                                ...itinerary.activity,
                                photos: updatedActivityPhotos, // Update activity photos
                              },
                            };
                            setTourData({
                              ...tourData,
                              deluxeDetails: {
                                ...tourData.deluxeDetails,
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
                    "deluxeDetails"
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
                        "deluxeDetails"
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
                          "deluxeDetails"
                        )
                      }
                    />
                    <input
                      type="text"
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
                          "deluxeDetails"
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder="Car Departure from"
                      value={itinerary.transportation.car.departureFrom || ""}
                      onChange={(e) =>
                        handleTransportationChange(
                          index,
                          "car",
                          {
                            ...itinerary.transportation.car,
                            departureFrom: e.target.value,
                          },
                          "deluxeDetails"
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder="Car arrival to"
                      value={itinerary.transportation.car.arrivalTo || ""}
                      onChange={(e) =>
                        handleTransportationChange(
                          index,
                          "car",
                          {
                            ...itinerary.transportation.car,
                            arrivalTo: e.target.value,
                          },
                          "deluxeDetails"
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
                          "deluxeDetails"
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
                          "deluxeDetails"
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
                          "deluxeDetails"
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
                          "deluxeDetails"
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
                          "deluxeDetails"
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
                          "deluxeDetails"
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
                                    ...tourData.deluxeDetails.itineraries,
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
                                    deluxeDetails: {
                                      ...tourData.deluxeDetails,
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
                        "deluxeDetails"
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
                          "deluxeDetails"
                        )
                      }
                    />
                    <input
                      type="text"
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
                          "deluxeDetails"
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder="Bus Departure from"
                      value={itinerary.transportation.bus.departureFrom || ""}
                      onChange={(e) =>
                        handleTransportationChange(
                          index,
                          "bus",
                          {
                            ...itinerary.transportation.bus,
                            departureFrom: e.target.value,
                          },
                          "deluxeDetails"
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder="Bus arrival to"
                      value={itinerary.transportation.bus.arrivalTo || ""}
                      onChange={(e) =>
                        handleTransportationChange(
                          index,
                          "bus",
                          {
                            ...itinerary.transportation.bus,
                            arrivalTo: e.target.value,
                          },
                          "deluxeDetails"
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
                          "deluxeDetails"
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
                          "deluxeDetails"
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
                          "deluxeDetails"
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
                          "deluxeDetails"
                        )
                      }
                    />
                    <div className="preview-photos">
                      {(itinerary.transportation.bus.photos || []).map(
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
                              src={photo}
                              alt={`Bus photo ${photoIndex + 1}`}
                              width="100"
                              height="100"
                              style={{ display: "block" }}
                            />
                            <button
                              className="delete-photo"
                              onClick={() => {
                                // Remove the selected photo by filtering it out
                                const updatedPhotos =
                                  itinerary.transportation.bus.photos.filter(
                                    (_, i) => i !== photoIndex
                                  );
                                const updatedItinerary = {
                                  ...itinerary,
                                  transportation: {
                                    ...itinerary.transportation,
                                    bus: {
                                      ...itinerary.transportation.bus,
                                      photos: updatedPhotos, // Update the photos array
                                    },
                                  },
                                };
                                setTourData({
                                  ...tourData,
                                  standardDetails: {
                                    ...tourData.standardDetails,
                                    itineraries:
                                      tourData.standardDetails.itineraries.map(
                                        (it, idx) =>
                                          idx === index ? updatedItinerary : it
                                      ),
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
                        "deluxeDetails"
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
                          "deluxeDetails"
                        )
                      }
                    />
                    <input
                      type="text"
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
                          "deluxeDetails"
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder="Train Departure from"
                      value={itinerary.transportation.train.departureFrom || ""}
                      onChange={(e) =>
                        handleTransportationChange(
                          index,
                          "train",
                          {
                            ...itinerary.transportation.train,
                            departureFrom: e.target.value,
                          },
                          "deluxeDetails"
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder="Train arrival to"
                      value={itinerary.transportation.train.arrivalTo || ""}
                      onChange={(e) =>
                        handleTransportationChange(
                          index,
                          "train",
                          {
                            ...itinerary.transportation.train,
                            arrivalTo: e.target.value,
                          },
                          "deluxeDetails"
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
                          "deluxeDetails"
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
                          "deluxeDetails"
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
                          "deluxeDetails"
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
                          "deluxeDetails"
                        )
                      }
                    />
                    <div className="preview-photos">
                      {(itinerary.transportation.train.photos || []).map(
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
                              src={photo}
                              alt={`Train photo ${photoIndex + 1}`}
                              width="100"
                              height="100"
                              style={{ display: "block" }}
                            />
                            <button
                              className="delete-photo"
                              onClick={() => {
                                // Remove the selected photo by filtering it out
                                const updatedPhotos =
                                  itinerary.transportation.train.photos.filter(
                                    (_, i) => i !== photoIndex
                                  );
                                const updatedItinerary = {
                                  ...itinerary,
                                  transportation: {
                                    ...itinerary.transportation,
                                    train: {
                                      ...itinerary.transportation.train,
                                      photos: updatedPhotos, // Update the photos array
                                    },
                                  },
                                };
                                setTourData({
                                  ...tourData,
                                  standardDetails: {
                                    ...tourData.standardDetails,
                                    itineraries:
                                      tourData.standardDetails.itineraries.map(
                                        (it, idx) =>
                                          idx === index ? updatedItinerary : it
                                      ),
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
                        "deluxeDetails"
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
                          "deluxeDetails"
                        )
                      }
                    />
                    <input
                      type="text"
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
                          "deluxeDetails"
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder="Flight Departure from"
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
                          "deluxeDetails"
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder="Flight arrival to"
                      value={itinerary.transportation.flight.arrivalTo || ""}
                      onChange={(e) =>
                        handleTransportationChange(
                          index,
                          "flight",
                          {
                            ...itinerary.transportation.flight,
                            arrivalTo: e.target.value,
                          },
                          "deluxeDetails"
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
                          "deluxeDetails"
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
                          "deluxeDetails"
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
                          "deluxeDetails"
                        )
                      }
                    />
                    <div className="preview-photos">
                      {(itinerary.transportation.flight.photos || []).map(
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
                              src={photo}
                              alt={`Flight photo ${photoIndex + 1}`}
                              width="100"
                              height="100"
                              style={{ display: "block" }}
                            />
                            <button
                              className="delete-photo"
                              onClick={() => {
                                // Remove the selected photo by filtering it out
                                const updatedPhotos =
                                  itinerary.transportation.flight.photos.filter(
                                    (_, i) => i !== photoIndex
                                  );
                                const updatedItinerary = {
                                  ...itinerary,
                                  transportation: {
                                    ...itinerary.transportation,
                                    flight: {
                                      ...itinerary.transportation.flight,
                                      photos: updatedPhotos, // Update the photos array
                                    },
                                  },
                                };
                                setTourData({
                                  ...tourData,
                                  standardDetails: {
                                    ...tourData.standardDetails,
                                    itineraries:
                                      tourData.standardDetails.itineraries.map(
                                        (it, idx) =>
                                          idx === index ? updatedItinerary : it
                                      ),
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
                        "deluxeDetails"
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
                          "deluxeDetails"
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
                          "deluxeDetails"
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
                          "deluxeDetails"
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
                          "deluxeDetails"
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
                          "deluxeDetails"
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
                          "deluxeDetails"
                        )
                      }
                    />
                    <div className="preview-photos">
                      {(itinerary.transportation.chopper.photos || []).map(
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
                              src={photo}
                              alt={`Chopper photo ${photoIndex + 1}`}
                              width="100"
                              height="100"
                              style={{ display: "block" }}
                            />
                            <button
                              className="delete-photo"
                              onClick={() => {
                                // Remove the selected photo by filtering it out
                                const updatedPhotos =
                                  itinerary.transportation.chopper.photos.filter(
                                    (_, i) => i !== photoIndex
                                  );
                                const updatedItinerary = {
                                  ...itinerary,
                                  transportation: {
                                    ...itinerary.transportation,
                                    chopper: {
                                      ...itinerary.transportation.chopper,
                                      photos: updatedPhotos, // Update the photos array
                                    },
                                  },
                                };
                                setTourData({
                                  ...tourData,
                                  standardDetails: {
                                    ...tourData.standardDetails,
                                    itineraries:
                                      tourData.standardDetails.itineraries.map(
                                        (it, idx) =>
                                          idx === index ? updatedItinerary : it
                                      ),
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
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => removeItinerary("deluxeDetails", index)}
              className="deleteButton"
            >
              Remove Itinerary
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addItinerary("deluxeDetails")}>
          Add Standard Itinerary
        </button>
      </div>
    </div>
  );

  const renderPremiumDetails = () => (
    <div className="premiumDetails">
      <h3>Premium Tour Details</h3>

      {/* Price Field */}
      <div className="formGroup">
        <label>Pricing</label>
        {tourData.premiumDetails.pricing.map((priceObj, index) => (
          <div key={index}>
            <input
              type="number"
              value={priceObj.price}
              onChange={(e) =>
                handlePricingArrayChange(
                  index,
                  { ...priceObj, price: e.target.value },
                  "premiumDetails"
                )
              }
              placeholder={`Price for ${priceObj.person} person`}
            />
            <input
              type="number"
              value={priceObj.rooms && priceObj.rooms}
              onChange={(e) =>
                handlePricingArrayChange(
                  index,
                  { ...priceObj, rooms: e.target.value },
                  "premiumDetails"
                )
              }
              placeholder={`No. of rooms`}
            />
            {tourData.premiumDetails.pricing.length > 1 && (
              <button
                type="button"
                className="deleteButton"
                onClick={() =>
                  removeArrayField(index, "pricing", "premiumDetails")
                }
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addPricingArrayField("pricing", "premiumDetails")}
          className="add-more"
        >
          Add More Pricing
        </button>
      </div>
      <div className="formGroup">
        <label>Premium Cancellation Policy</label>
        <ReactQuill
          name="cancellationPolicy"
          value={tourData?.premiumDetails?.cancellationPolicy || ""}
          onChange={(value) =>
            handleFieldChange("cancellationPolicy", value, "premiumDetails")
          }
          placeholder="Enter cancellation policy"
        />
      </div>

      {/* Highlights Field */}

      <div className="formGroup">
        <label>Highlights</label>
        <ReactQuill
          name="highlights"
          value={tourData?.premiumDetails?.highlights || ""}
          onChange={(value) =>
            handleFieldChange("highlights", value, "premiumDetails")
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
          value={tourData?.premiumDetails?.whatsIncluded || ""}
          onChange={(value) =>
            handleFieldChange("whatsIncluded", value, "premiumDetails")
          }
          placeholder="Enter whatsIncluded"
        />
      </div>

      {/* What's Excluded Field */}
      <div className="formGroup">
        <label>What's Excluded</label>
        <ReactQuill
          name="whatsExcluded"
          value={tourData?.premiumDetails?.whatsExcluded || ""}
          onChange={(value) =>
            handleFieldChange("whatsExcluded", value, "premiumDetails")
          }
          placeholder="Enter whatsExcluded"
        />
      </div>

      {/* Premium Itineraries */}

      <div className="formGroup">
        <h3>Premium Itineraries</h3>
        {tourData.premiumDetails.itineraries.map((itinerary, index) => (
          <div key={index} className="itinerary">
            <label>Day {itinerary.day}</label>
            <label>Itinerary Photos</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                handleItineraryPhotos(index, e.target.files, "premiumDetails")
              }
            />
            <div className="photo-preview">
              {tourData.premiumDetails.itineraries[index].photos?.map(
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
                      src={photo}
                      alt={`Itinerary Photo ${photoIndex + 1}`}
                      width="100"
                      height="100"
                      style={{ display: "block" }}
                    />
                    <button
                      className="delete-photo"
                      onClick={() => {
                        // Remove the selected photo by filtering it out
                        const updatedPhotos =
                          tourData.premiumDetails.itineraries[
                            index
                          ].photos.filter((_, i) => i !== photoIndex);
                        const updatedItineraries = [
                          ...tourData.premiumDetails.itineraries,
                        ];
                        updatedItineraries[index] = {
                          ...tourData.premiumDetails.itineraries[index],
                          photos: updatedPhotos, // Update the photos array
                        };
                        setTourData({
                          ...tourData,
                          premiumDetails: {
                            ...tourData.premiumDetails,
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

            <input
              type="text"
              name="title"
              value={itinerary.title}
              onChange={(e) =>
                handleItineraryChange(
                  index,
                  "title",
                  e.target.value,
                  "premiumDetails"
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
                  "premiumDetails"
                )
              }
              placeholder="Enter itinerary description"
            />
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
                    "premiumDetails"
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
                    "premiumDetails"
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
                      "premiumDetails"
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
                      "premiumDetails"
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
                      "premiumDetails"
                    );
                  }}
                />

                <div className="preview-photos">
                  {itinerary.welcomeDrinks?.photos?.map((photo, photoIndex) => (
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
                        src={photo}
                        alt={`Welcome Drinks photo ${photoIndex + 1}`}
                        width="100"
                        style={{ display: "block" }}
                      />
                      <button
                        className="delete-photo"
                        onClick={() => {
                          // Remove the selected photo by filtering it out
                          const updatedPhotos =
                            itinerary.welcomeDrinks.photos.filter(
                              (_, i) => i !== photoIndex
                            );
                          const updatedItineraries = [
                            ...tourData.standardDetails.itineraries,
                          ];
                          updatedItineraries[index] = {
                            ...itinerary,
                            welcomeDrinks: {
                              ...itinerary.welcomeDrinks,
                              photos: updatedPhotos, // Update the welcomeDrinks photos array
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
                      "premiumDetails"
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
                      "premiumDetails"
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="Enter Tour Departure from"
                  value={itinerary.tourManager.departureFrom || ""}
                  onChange={(e) =>
                    handleItineraryChange(
                      index,
                      "tourManager",
                      {
                        ...itinerary.tourManager,
                        departureFrom: e.target.value,
                      },
                      "premiumDetails"
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="Enter Tour arrival to"
                  value={itinerary.tourManager.arrivalTo || ""}
                  onChange={(e) =>
                    handleItineraryChange(
                      index,
                      "tourManager",
                      { ...itinerary.tourManager, arrivalTo: e.target.value },
                      "premiumDetails"
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
                      "premiumDetails"
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
                      "premiumDetails"
                    );
                  }}
                />

                {/* Preview Tour Manager Photo */}
                {itinerary.tourManager?.photo && (
                  <div
                    className="preview-tour-manager-photo"
                    style={{
                      position: "relative",
                      display: "inline-block",
                      margin: "5px",
                    }}
                  >
                    <img
                      src={itinerary.tourManager.photo}
                      alt="Tour Manager"
                      width="100"
                      style={{ display: "block" }}
                    />
                    <button
                      className="delete-photo"
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        cursor: "pointer",
                        padding: "2px 6px",
                      }}
                      onClick={() => {
                        // Remove the tour manager photo
                        const updatedItineraries = [
                          ...tourData.standardDetails.itineraries,
                        ];
                        updatedItineraries[index] = {
                          ...itinerary,
                          tourManager: {
                            ...itinerary.tourManager,
                            photo: null, // Set photo to null to remove it
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
                )}
              </div>
            )}

            <div className="labels">
              {" "}
              <label>Siteseen:</label>
              <input
                type="checkbox"
                checked={itinerary?.siteSeen?.isAvailable || false}
                onChange={(e) =>
                  handleItineraryChange(
                    index,
                    "siteSeen",
                    { ...itinerary.siteSeen, isAvailable: e.target.checked },
                    "premiumDetails"
                  )
                }
              />
            </div>

            {itinerary.siteSeen?.isAvailable && (
              <div className="siteseen-section">
                <h4>Siteseen Details</h4>

                {/* Siteseen Name */}
                <input
                  type="text"
                  placeholder="Enter Siteseen name"
                  value={itinerary.siteSeen.name || ""}
                  onChange={(e) =>
                    handleItineraryChange(
                      index,
                      "siteSeen",
                      { ...itinerary.siteSeen, name: e.target.value },
                      "premiumDetails"
                    )
                  }
                />

                {/* Siteseen Description */}
                <textarea
                  placeholder="Enter Siteseen description"
                  value={itinerary.siteSeen.description || ""}
                  onChange={(e) =>
                    handleItineraryChange(
                      index,
                      "siteSeen",
                      { ...itinerary.siteSeen, description: e.target.value },
                      "premiumDetails"
                    )
                  }
                ></textarea>

                {/* Siteseen Photos */}
                <label>Upload Siteseen Photos</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => {
                    const files = Array.from(e.target.files).map((file) =>
                      URL.createObjectURL(file)
                    );
                    handleItineraryChange(
                      index,
                      "siteSeen",
                      {
                        ...itinerary.siteSeen,
                        photos: [
                          ...(itinerary.siteSeen.photos || []),
                          ...files,
                        ],
                      },
                      "premiumDetails"
                    );
                  }}
                />
                <div className="preview-photos">
                  {itinerary.siteSeen.photos?.length > 0 &&
                    itinerary.siteSeen.photos.map((photo, photoIndex) => (
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
                          alt={`Siteseen photo ${photoIndex + 1}`}
                          width="100"
                          style={{ display: "block" }}
                        />
                        <button
                          className="delete-photo"
                          onClick={() => {
                            const updatedPhotos =
                              itinerary.siteSeen.photos.filter(
                                (_, i) => i !== photoIndex
                              );
                            handleItineraryChange(
                              index,
                              "siteSeen",
                              { ...itinerary.siteSeen, photos: updatedPhotos },
                              "premiumDetails"
                            );
                          }}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <div className="labels">
              <label>Include Hotel</label>
              <input
                type="checkbox"
                checked={itinerary.hotel.isIncluded || false}
                onChange={(e) => {
                  const updatedItineraries = [
                    ...tourData.premiumDetails.itineraries,
                  ];
                  updatedItineraries[index].hotel.isIncluded = e.target.checked;
                  setTourData({
                    ...tourData,
                    premiumDetails: {
                      ...tourData.premiumDetails,
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
                      ...tourData.premiumDetails.itineraries,
                    ];
                    updatedItineraries[index].hotel.name = e.target.value;
                    setTourData({
                      ...tourData,
                      premiumDetails: {
                        ...tourData.premiumDetails,
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
                      ...tourData.premiumDetails.itineraries,
                    ];
                    updatedItineraries[index].hotel.url = e.target.value;
                    setTourData({
                      ...tourData,
                      premiumDetails: {
                        ...tourData.premiumDetails,
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
                      ...tourData.premiumDetails.itineraries,
                    ];
                    updatedItineraries[index].showCategoryOptions = true;
                    setTourData({
                      ...tourData,
                      premiumDetails: {
                        ...tourData.premiumDetails,
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
                            ...tourData.premiumDetails.itineraries,
                          ];
                          updatedItineraries[index].hotel.hotelCategory = [
                            option,
                          ];
                          updatedItineraries[index].showCategoryOptions = false; // Hide options after selection
                          setTourData({
                            ...tourData,
                            premiumDetails: {
                              ...tourData.premiumDetails,
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
                    handleHotelImages(index, e.target.files, "premiumDetails")
                  }
                />

                {itinerary.hotel.hotelImages?.length > 0 && (
                  <div className="photo-preview">
                    {itinerary.hotel.hotelImages.map((photo, photoIndex) => (
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
                          alt={`Hotel Image ${photoIndex + 1}`}
                          width="100"
                          height="100"
                          style={{ display: "block" }}
                        />
                        <button
                          className="delete-photo"
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            backgroundColor: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            cursor: "pointer",
                            padding: "2px 6px",
                          }}
                          onClick={() => {
                            // Remove the selected hotel image by filtering it out
                            const updatedPhotos =
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
                                hotelImages: updatedPhotos, // Update the hotelImages array
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
                      ...tourData.premiumDetails.itineraries,
                    ];
                    updatedItineraries[index].hotel.roomCategory =
                      e.target.value;
                    setTourData({
                      ...tourData,
                      premiumDetails: {
                        ...tourData.premiumDetails,
                        itineraries: updatedItineraries,
                      },
                    });
                  }}
                />
                <div className="premium-details-pricing">
                  <h4>Premium Details: Bed Pricing</h4>
                  {Object.keys(
                    tourData.premiumDetails?.itineraries[index]?.hotel?.beds
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
                              tourData.premiumDetails?.itineraries[index]?.hotel
                                ?.beds[bedType]?.price || ""
                            }
                            onChange={(e) =>
                              handleBedPriceChange(
                                "premium",
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
                              tourData.premiumDetails?.itineraries[index]?.hotel
                                .beds[bedType]?.extraBedPrice || ""
                            }
                            onChange={(e) =>
                              handleBedPriceChange(
                                "premium",
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
                    handleRoomImages(index, e.target.files, "premiumDetails")
                  }
                />

                {itinerary.hotel.roomImages?.length > 0 && (
                  <div className="photo-preview">
                    {itinerary.hotel.roomImages.map((photo, photoIndex) => (
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
                          alt={`Room Image ${photoIndex + 1}`}
                          width="100"
                          height="100"
                          style={{ display: "block" }}
                        />
                        <button
                          className="delete-photo"
                          style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            backgroundColor: "red",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            cursor: "pointer",
                            padding: "2px 6px",
                          }}
                          onClick={() => {
                            // Remove the selected room image by filtering it out
                            const updatedPhotos =
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
                                roomImages: updatedPhotos, // Update the roomImages array
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
                      ...tourData.premiumDetails.itineraries,
                    ];
                    updatedItineraries[index].hotel.location = e.target.value;
                    setTourData({
                      ...tourData,
                      premiumDetails: {
                        ...tourData.premiumDetails,
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
                    "premiumDetails"
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
                      handleMealChange(e, index, "breakfast", "premiumDetails")
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
                          "premiumDetails"
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
                          "premiumDetails"
                        )
                      }
                    />
                    {itinerary?.meals?.breakfast?.photos?.length > 0 && (
                      <div className="photo-preview">
                        {itinerary.meals.breakfast.photos.map(
                          (photo, photoIndex) => {
                            // Check if the photo is a File object and create an object URL if true
                            const photoSrc =
                              photo instanceof File
                                ? URL.createObjectURL(photo)
                                : photo;

                            return (
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
                                  src={photoSrc}
                                  alt={`Breakfast ${photoIndex}`}
                                  width="100"
                                  height="100"
                                  style={{ display: "block" }}
                                />
                                <button
                                  className="delete-photo"
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    backgroundColor: "red",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    padding: "2px 6px",
                                  }}
                                  onClick={() => {
                                    // Remove the selected photo by filtering it out
                                    const updatedPhotos =
                                      itinerary.meals.breakfast.photos.filter(
                                        (_, i) => i !== photoIndex
                                      );
                                    const updatedItineraries = [
                                      ...tourData.standardDetails.itineraries,
                                    ];
                                    updatedItineraries[index] = {
                                      ...itinerary,
                                      meals: {
                                        ...itinerary.meals,
                                        breakfast: {
                                          ...itinerary.meals.breakfast,
                                          photos: updatedPhotos, // Update the breakfast photos array
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
                    checked={itinerary?.meals?.lunch.isAvailable}
                    onChange={(e) =>
                      handleMealChange(e, index, "lunch", "premiumDetails")
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
                          "premiumDetails"
                        )
                      }
                      placeholder="Enter lunch name"
                    />
                    <label>Breakfast Photos</label>
                    <input
                      type="file"
                      multiple
                      onChange={(e) =>
                        handleItineraryMealsChange(
                          index,
                          "lunch",
                          "photos",
                          Array.from(e.target.files),
                          "premiumDetails"
                        )
                      }
                    />
                    {itinerary?.meals?.lunch?.photos?.length > 0 && (
                      <div className="photo-preview">
                        {itinerary.meals.lunch.photos.map(
                          (photo, photoIndex) => {
                            // Check if the photo is a File object and create an object URL if true
                            const photoSrc =
                              photo instanceof File
                                ? URL.createObjectURL(photo)
                                : photo;

                            return (
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
                                  src={photoSrc}
                                  alt={`Lunch ${photoIndex}`}
                                  width="100"
                                  height="100"
                                  style={{ display: "block" }}
                                />
                                <button
                                  className="delete-photo"
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    backgroundColor: "red",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "50%",
                                    cursor: "pointer",
                                    padding: "2px 6px",
                                  }}
                                  onClick={() => {
                                    // Remove the selected photo by filtering it out
                                    const updatedPhotos =
                                      itinerary.meals.lunch.photos.filter(
                                        (_, i) => i !== photoIndex
                                      );
                                    const updatedItineraries = [
                                      ...tourData.standardDetails.itineraries,
                                    ];
                                    updatedItineraries[index] = {
                                      ...itinerary,
                                      meals: {
                                        ...itinerary.meals,
                                        lunch: {
                                          ...itinerary.meals.lunch,
                                          photos: updatedPhotos, // Update the lunch photos array
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
                      handleMealChange(e, index, "dinner", "premiumDetails")
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
                          "premiumDetails"
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
                          "premiumDetails"
                        )
                      }
                    />
                    {itinerary?.meals?.dinner?.photos?.length > 0 && (
                      <div className="photo-preview">
                        {itinerary.meals.dinner.photos.map(
                          (photo, photoIndex) => {
                            // Check if the photo is a File object and create an object URL if true
                            const photoSrc =
                              photo instanceof File
                                ? URL.createObjectURL(photo)
                                : photo;

                            return (
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
                                  src={photoSrc}
                                  alt={`Dinner ${photoIndex}`}
                                  width="100"
                                  height="100"
                                  style={{ display: "block" }}
                                />
                                <button
                                  className="delete-photo"
                                  onClick={() =>
                                    handleDeleteMealPhoto(
                                      index,
                                      photoIndex,
                                      "dinner",
                                      "premiumDetails"
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
              <label> Include Activity</label>
              <input
                type="checkbox"
                checked={itinerary.activity?.isIncluded || false}
                onChange={(e) =>
                  handleItineraryChange(
                    index,
                    "activity",
                    { ...itinerary.activity, isIncluded: e.target.checked },
                    "premiumDetails"
                  )
                }
              />
            </div>

            {itinerary.activity?.isIncluded && (
              <div className="activity-details">
                <input
                  type="text"
                  placeholder="Enter activity name"
                  value={itinerary.activity.name || ""}
                  onChange={(e) =>
                    handleItineraryChange(
                      index,
                      "activity",
                      { ...itinerary.activity, name: e.target.value },
                      "premiumDetails"
                    )
                  }
                />
                <textarea
                  placeholder="Enter activity description"
                  value={itinerary.activity.description || ""}
                  onChange={(e) =>
                    handleItineraryChange(
                      index,
                      "activity",
                      { ...itinerary.activity, description: e.target.value },
                      "premiumDetails"
                    )
                  }
                />

                <input
                  type="number"
                  placeholder="Enter activity price"
                  value={itinerary.activity.price || ""}
                  onChange={(e) =>
                    handleItineraryChange(
                      index,
                      "activity",
                      { ...itinerary.activity, price: e.target.value },
                      "premiumDetails"
                    )
                  }
                />

                <label>Upload Photos</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) =>
                    handleActivityPhotos(
                      index,
                      "activity",
                      e.target.files,
                      "premiumDetails"
                    )
                  }
                />
                {itinerary.activity.photos.length > 0 ? (
                  <div className="photo-preview">
                    {itinerary.activity.photos.map((photo, photoIndex) => (
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
                          src={photo}
                          alt={`Activity Photo ${photoIndex + 1}`}
                          width="100"
                          height="100"
                          style={{ display: "block" }}
                        />
                        <button
                          className="delete-photo"
                          onClick={() => {
                            // Remove the selected photo
                            const updatedActivityPhotos =
                              itinerary.activity.photos.filter(
                                (_, i) => i !== photoIndex
                              );
                            const updatedItineraries = [
                              ...tourData.premiumDetails.itineraries,
                            ];
                            updatedItineraries[index] = {
                              ...itinerary,
                              activity: {
                                ...itinerary.activity,
                                photos: updatedActivityPhotos, // Update activity photos
                              },
                            };
                            setTourData({
                              ...tourData,
                              premiumDetails: {
                                ...tourData.premiumDetails,
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
                ) : null}
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
                    "premiumDetails"
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
                        "premiumDetails"
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
                          "premiumDetails"
                        )
                      }
                    />
                    <input
                      type="text"
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
                          "premiumDetails"
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder="Car Departure from"
                      value={itinerary.transportation.car.departureFrom || ""}
                      onChange={(e) =>
                        handleTransportationChange(
                          index,
                          "car",
                          {
                            ...itinerary.transportation.car,
                            departureFrom: e.target.value,
                          },
                          "premiumDetails"
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder="Car Arrival to"
                      value={itinerary.transportation.car.arrivalTo || ""}
                      onChange={(e) =>
                        handleTransportationChange(
                          index,
                          "car",
                          {
                            ...itinerary.transportation.car,
                            arrivalTo: e.target.value,
                          },
                          "premiumDetails"
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
                          "premiumDetails"
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
                          "premiumDetails"
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
                          "premiumDetails"
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
                          "premiumDetails"
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
                          "premiumDetails"
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
                          "premiumDetails"
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
                                    ...tourData.premiumDetails.itineraries,
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
                                    premiumDetails: {
                                      ...tourData.premiumDetails,
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
                        "premiumDetails"
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
                          "premiumDetails"
                        )
                      }
                    />
                    <input
                      type="text"
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
                          "premiumDetails"
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder="Enter bus defparture from"
                      value={itinerary.transportation.bus.departureFrom || ""}
                      onChange={(e) =>
                        handleTransportationChange(
                          index,
                          "bus",
                          {
                            ...itinerary.transportation.bus,
                            departureFrom: e.target.value,
                          },
                          "premiumDetails"
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder="Enter bus arrival to"
                      value={itinerary.transportation.bus.arrivalTo || ""}
                      onChange={(e) =>
                        handleTransportationChange(
                          index,
                          "bus",
                          {
                            ...itinerary.transportation.bus,
                            arrivalTo: e.target.value,
                          },
                          "premiumDetails"
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
                          "premiumDetails"
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
                          "premiumDetails"
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
                          "premiumDetails"
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
                          "premiumDetails"
                        )
                      }
                    />
                    <div className="preview-photos">
                      {(itinerary.transportation.bus.photos || []).map(
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
                              src={photo}
                              alt={`Bus photo ${photoIndex + 1}`}
                              width="100"
                              height="100"
                              style={{ display: "block" }}
                            />
                            <button
                              className="delete-photo"
                              onClick={() => {
                                // Remove the selected photo from bus.photos
                                const updatedBusPhotos =
                                  itinerary.transportation.bus.photos.filter(
                                    (_, i) => i !== photoIndex
                                  );
                                const updatedItineraries = [
                                  ...tourData.standardDetails.itineraries,
                                ];
                                updatedItineraries[index] = {
                                  ...itinerary,
                                  transportation: {
                                    ...itinerary.transportation,
                                    bus: {
                                      ...itinerary.transportation.bus,
                                      photos: updatedBusPhotos, // Update bus photos
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
                        "premiumDetails"
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
                          "premiumDetails"
                        )
                      }
                    />
                    <input
                      type="text"
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
                          "premiumDetails"
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder="Enter train defparture from"
                      value={itinerary.transportation.train.departureFrom || ""}
                      onChange={(e) =>
                        handleTransportationChange(
                          index,
                          "train",
                          {
                            ...itinerary.transportation.train,
                            departureFrom: e.target.value,
                          },
                          "premiumDetails"
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder="Enter train arrival to"
                      value={itinerary.transportation.train.arrivalTo || ""}
                      onChange={(e) =>
                        handleTransportationChange(
                          index,
                          "train",
                          {
                            ...itinerary.transportation.train,
                            arrivalTo: e.target.value,
                          },
                          "premiumDetails"
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
                          "premiumDetails"
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
                          "premiumDetails"
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
                          "premiumDetails"
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
                          "premiumDetails"
                        )
                      }
                    />
                    <div className="preview-photos">
                      {(itinerary.transportation.train.photos || []).map(
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
                              src={photo}
                              alt={`Train photo ${photoIndex + 1}`}
                              width="100"
                              height="100"
                              style={{ display: "block" }}
                            />
                            <button
                              className="delete-photo"
                              onClick={() => {
                                // Remove the selected photo from train.photos
                                const updatedTrainPhotos =
                                  itinerary.transportation.train.photos.filter(
                                    (_, i) => i !== photoIndex
                                  );
                                const updatedItineraries = [
                                  ...tourData.standardDetails.itineraries,
                                ];
                                updatedItineraries[index] = {
                                  ...itinerary,
                                  transportation: {
                                    ...itinerary.transportation,
                                    train: {
                                      ...itinerary.transportation.train,
                                      photos: updatedTrainPhotos, // Update train photos
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
                        "premiumDetails"
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
                          "premiumDetails"
                        )
                      }
                    />
                    <input
                      type="text"
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
                          "premiumDetails"
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder="Enter flight defparture from"
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
                          "premiumDetails"
                        )
                      }
                    />
                    <input
                      type="text"
                      placeholder="Enter flight arrival to"
                      value={itinerary.transportation.flight.arrivalTo || ""}
                      onChange={(e) =>
                        handleTransportationChange(
                          index,
                          "flight",
                          {
                            ...itinerary.transportation.flight,
                            arrivalTo: e.target.value,
                          },
                          "premiumDetails"
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
                          "premiumDetails"
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
                          "premiumDetails"
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
                          "premiumDetails"
                        )
                      }
                    />
                    <div className="preview-photos">
                      {(itinerary.transportation.flight.photos || []).map(
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
                              src={photo}
                              alt={`Flight photo ${photoIndex + 1}`}
                              width="100"
                              height="100"
                              style={{ display: "block" }}
                            />
                            <button
                              className="delete-photo"
                              onClick={() => {
                                // Remove the selected photo from flight.photos
                                const updatedFlightPhotos =
                                  itinerary.transportation.flight.photos.filter(
                                    (_, i) => i !== photoIndex
                                  );
                                const updatedItineraries = [
                                  ...tourData.standardDetails.itineraries,
                                ];
                                updatedItineraries[index] = {
                                  ...itinerary,
                                  transportation: {
                                    ...itinerary.transportation,
                                    flight: {
                                      ...itinerary.transportation.flight,
                                      photos: updatedFlightPhotos, // Update flight photos
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
                        "premiumDetails"
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
                          "premiumDetails"
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
                          "premiumDetails"
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
                          "premiumDetails"
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
                          "premiumDetails"
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
                          "premiumDetails"
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
                          "premiumDetails"
                        )
                      }
                    />
                    <div className="preview-photos">
                      {(itinerary?.transportation?.chopper?.photos || []).map(
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
                              src={photo}
                              alt={`Chopper photo ${photoIndex + 1}`}
                              width="100"
                              height="100"
                              style={{ display: "block" }}
                            />
                            <button
                              className="delete-photo"
                              onClick={() => {
                                // Remove the selected photo from chopper.photos
                                const updatedChopperPhotos =
                                  itinerary.transportation.chopper.photos.filter(
                                    (_, i) => i !== photoIndex
                                  );
                                const updatedItineraries = [
                                  ...tourData.premiumDetails.itineraries,
                                ];
                                updatedItineraries[index] = {
                                  ...itinerary,
                                  transportation: {
                                    ...itinerary.transportation,
                                    chopper: {
                                      ...itinerary.transportation.chopper,
                                      photos: updatedChopperPhotos, // Update chopper photos
                                    },
                                  },
                                };
                                setTourData({
                                  ...tourData,
                                  premiumDetails: {
                                    ...tourData.premiumDetails,
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
                  </div>
                )}
              </div>
            )}

            <button
              type="button"
              onClick={() => removeItinerary("premiumDetails", index)}
              className="deleteButton"
            >
              Remove Itinerary
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addItinerary("premiumDetails")}>
          Add Standard Itinerary
        </button>
      </div>
    </div>
  );

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>{title}</h1>
        </div>
        {isLoading ? ( // Conditional rendering for the loader
                <div className="loader">
                  <CircularProgress />
                </div>
              ) :
        (<div className="bottom">
          <form onSubmit={handleSubmit}>
            <div>Tour Categories</div>
            <div className="formGroup">
              <input
                type="checkbox"
                name="isStandard"
                checked={tourData.isStandard}
                onChange={(e) =>
                  setTourData((prevData) => ({
                    ...prevData,
                    isStandard: e.target.checked,
                  }))
                }
              />
              <span> Include standard</span>
            </div>
            <div className="formGroup">
              <input
                type="checkbox"
                name="isDeluxe"
                checked={tourData.isDeluxe}
                onChange={(e) =>
                  setTourData((prevData) => ({
                    ...prevData,
                    isDeluxe: e.target.checked,
                  }))
                }
              />
              <span> Include deluxe</span>
            </div>
            <div className="formGroup">
              <input
                type="checkbox"
                name="isPremium"
                checked={tourData.isPremium}
                onChange={(e) =>
                  setTourData((prevData) => ({
                    ...prevData,
                    isPremium: e.target.checked,
                  }))
                }
              />
              <span> Include premium</span>
            </div>
            <div className="formGroup">
              <label>Tour Name</label>
              <input
                type="text"
                name="name"
                value={tourData.name}
                onChange={handleChange}
                placeholder="Enter tour name"
                required
              />
            </div>

            <div className="formGroup">
              <label>
                <input
                  type="checkbox"
                  name="fixedDates"
                  checked={tourData.fixedDates?.enabled}
                  onChange={(e) =>
                    setTourData((prevState) => ({
                      ...prevState,
                      fixedDates: {
                        ...prevState.fixedDates,
                        enabled: e.target.checked,
                      },
                    }))
                  }
                />
                Fixed Dates Tour
              </label>
            </div>

            {tourData.fixedDates?.enabled && (
              <div className="fixedDatesBox">
                <h4>Fixed Dates Tour Details</h4>
                <div className="formGroup">
                  <label>Seats Available</label>
                  <input
                    type="number"
                    value={tourData.fixedDates?.seatsAvailable || ""}
                    onChange={(e) =>
                      setTourData((prevState) => ({
                        ...prevState,
                        fixedDates: {
                          ...prevState.fixedDates,
                          seatsAvailable: e.target.value,
                        },
                      }))
                    }
                    placeholder="Enter seats available"
                  />
                </div>

                <div className="formGroup">
                  <label>Price Change Per Person</label>
                  <input
                    type="number"
                    value={tourData.fixedDates?.priceChangePerPerson || ""}
                    onChange={(e) =>
                      setTourData((prevState) => ({
                        ...prevState,
                        fixedDates: {
                          ...prevState.fixedDates,
                          priceChangePerPerson: e.target.value,
                        },
                      }))
                    }
                    placeholder="Enter price change per person"
                  />
                </div>
              </div>
            )}

            <div className="formGroup">
              <input
                type="checkbox"
                name="transportation"
                checked={tourData.transportation}
                onChange={(e) =>
                  setTourData((prevData) => ({
                    ...prevData,
                    transportation: e.target.checked,
                  }))
                }
              />
              <span> Include Transportation</span>
            </div>
            <div className="formGroup">
              <input
                type="checkbox"
                name="activities"
                checked={tourData.activities}
                onChange={(e) =>
                  setTourData((prevData) => ({
                    ...prevData,
                    activities: e.target.checked,
                  }))
                }
              />
              <span> Include activities</span>
            </div>
            <div className="formGroup">
              <input
                type="checkbox"
                name="siteSeen"
                checked={tourData.siteSeen}
                onChange={(e) =>
                  setTourData((prevData) => ({
                    ...prevData,
                    siteSeen: e.target.checked,
                  }))
                }
              />
              <span> Include Site Seen</span>
            </div>

            <div className="formGroup">
              <input
                type="checkbox"
                name="welcomeDrinks"
                checked={tourData.welcomeDrinks}
                onChange={(e) =>
                  setTourData((prevData) => ({
                    ...prevData,
                    welcomeDrinks: e.target.checked,
                  }))
                }
              />
              <span> Include Welcome Drinks</span>
            </div>

            <div className="formGroup">
              <input
                type="checkbox"
                name="meals"
                checked={tourData.meals}
                onChange={(e) =>
                  setTourData((prevData) => ({
                    ...prevData,
                    meals: e.target.checked,
                  }))
                }
              />
              <span> Include Meal</span>
            </div>

            <div className="formGroup">
              <input
                type="checkbox"
                name="hotel"
                checked={tourData.hotel}
                onChange={(e) =>
                  setTourData((prevData) => ({
                    ...prevData,
                    hotel: e.target.checked,
                  }))
                }
              />
              <span> Include Hotel</span>
            </div>

            <div className="formGroup">
              <label>Overview</label>
              <ReactQuill
                type="text"
                name="overview"
                value={tourData?.overview}
                onChange={(value) => handleQuillChange(value, "overview")}
                placeholder="Enter overview"
                required
              />
            </div>
            <div className="formGroup">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={tourData?.location}
                onChange={handleChange}
                placeholder="Enter location"
                required
              />
            </div>

            <div className="formGroup">
              <label>Terms and Conditions</label>
              <ReactQuill
                type="text"
                name="termsAndConditions"
                value={tourData?.termsAndConditions}
                onChange={(value) =>
                  handleQuillChange(value, "termsAndConditions")
                }
                placeholder="Terms and Conditions"
              />
            </div>

            <div className="formGroup">
              <label>Duration</label>
              <input
                type="number"
                name="duration"
                value={tourData.duration}
                onChange={handleChange}
                placeholder="Enter duration"
                required
              />
            </div>

            <div className="formGroup">
              <input
                type="checkbox"
                name="welcomeDrinks"
                checked={tourData.welcomeDrinks}
                onChange={(e) =>
                  setTourData((prevData) => ({
                    ...prevData,
                    welcomeDrinks: e.target.checked,
                  }))
                }
              />
              <span> Include Welcome Drinks</span>
            </div>

            <div className="formGroup">
              <label>Departure Details</label>
              <ReactQuill
                type="text"
                name="departureDetails"
                value={tourData?.departureDetails}
                onChange={(value) =>
                  handleQuillChange(value, "departureDetails")
                }
                placeholder="Enter departure details"
                required
              />
            </div>

            <div className="formGroup">
              <label>Know Before You Go</label>
              <ReactQuill
                type="text"
                name="knowBeforeYouGo"
                value={tourData?.knowBeforeYouGo}
                onChange={(value) =>
                  handleQuillChange(value, "knowBeforeYouGo")
                }
                placeholder="Enter information that travelers should know before they go"
              />
            </div>

            <div className="formGroup">
              <label>Additional Information</label>
              <ReactQuill
                type="text"
                name="additionalInfo"
                value={tourData?.additionalInfo}
                onChange={(value) => handleQuillChange(value, "additionalInfo")}
                placeholder="Enter any additional information"
              />
            </div>
            <div className="formGroup">
              <label>Upload Banner Image</label>
              <input
                type="file"
                name="bannerImage"
                onChange={handleBannerImageChange}
              />

              {tourData.bannerImage && (
                <div className="banner-preview">
                  <img src={tourData.bannerImage} alt="Banner Preview" />
                  <button
                    className="delete-banner"
                    onClick={handleDeleteBanner}
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>

            <div className="formGroup" style={{ position: "relative" }}>
              <label htmlFor="categoriesInput">Categories</label>
              <div>
                <select
                  id="categoriesInput"
                  name="categories"
                  value=""
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
                {tourData.categories?.map((categoryId) => {
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
                  {destinations &&
                    destinations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.country?.label}
                      </option>
                    ))}
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
                  {destinations &&
                    destinations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.city?.label}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="formGroup" style={{ position: "relative" }}>
              <label htmlFor="attributesInput">Attributes</label>
              <div>
                <select
                  id="categoriesInput"
                  name="attributes"
                  value=""
                  onChange={(e) => handleAttributeSelect(e.target.value)}
                >
                  <option value="">Select Attributes</option>
                  {attributes.map((attribute) => (
                    <option key={attribute.id} value={attribute.id}>
                      {attribute.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="selectedAttributes">
                {tourData.attributes?.map((attributeId) => {
                  return (
                    <div key={attributeId} className="attributeTag">
                      {attributeId}
                      <button
                        type="button"
                        onClick={() => handleAttributeRemove(attributeId)}
                        className="deleteIcon"
                      >
                        &#10006;
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="formGroup">
              <label>Upload Photos</label>
              <input
                type="file"
                multiple
                name="photos"
                accept="image/*"
                onChange={handleFileChange}
              />

              {tourData.images?.length > 0 && (
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
              <label>Languages</label>
              {tourData.languages?.map((language, index) => (
                <div key={index} className="formItem">
                  <input
                    type="text"
                    value={language}
                    onChange={(e) =>
                      handleArrayChangeLanguage(index, e.target.value)
                    }
                    placeholder="Enter language"
                  />
                  <button
                    type="button"
                    className="deleteButton"
                    onClick={() => removeLanguage(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="add-more"
                onClick={addLanguageField}
              >
                Add More Languages
              </button>
            </div>
            <div className="formGroup">
              <label>Seo content</label>
              <input
                type="text"
                name="metaTitle"
                value={tourData.metaTitle}
                onChange={handleChange}
                placeholder="Enter Meta title"
                required
              />
              <input
                type="text"
                name="metaDescription"
                value={tourData.metaDescription}
                onChange={handleChange}
                placeholder="Enter Meta Description"
                required
              />
            </div>

            <div className="tourTypeButtons">
              <button
                type="button"
                onClick={() => setSelectedTourType("standard")}
                className={selectedTourType === "standard" ? "active" : ""}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => setSelectedTourType("deluxe")}
                className={selectedTourType === "deluxe" ? "active" : ""}
              >
                Deluxe
              </button>
              <button
                type="button"
                onClick={() => setSelectedTourType("premium")}
                className={selectedTourType === "premium" ? "active" : ""}
              >
                Premium
              </button>
            </div>

            {selectedTourType === "standard" && renderStandardDetails()}
            {selectedTourType === "deluxe" && renderDeluxeDetails()}
            {selectedTourType === "premium" && renderPremiumDetails()}

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
        </div>)}
      </div>
    </div>
  );
};

export default NewTour;

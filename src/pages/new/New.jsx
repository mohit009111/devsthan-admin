import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./new.css";
import { BASE_URL } from "../../utils/headers";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
// import { v2 as cloudinary } from 'cloudinary';

const NewTour = ({ title }) => {
  const [openTranportation, setOpenTranportation] = useState(false);
  const [openPremiumTranportation, setOpenPremiumTranportation] = useState(false);
  const [openStandardTransportation, setOpenStandardTransportation] = useState(false);
  const [selectedTourType, setSelectedTourType] = useState("standard");
  const [categories, setCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [destinations, setDestinations] = useState("");
  

  const [tourData, setTourData] = useState({
    uuid: uuidv4(),
    name: "",
    overview: "",
    location: "",
    welcomeDrinks: false,
    duration: "",
    transportation: false,
    groupSize: "",
    categories: [],
    attributes: [],
    languages: [""],
    country:"",
    city:"",
    state:"",
    availableDates: "",
    fixedDates: {
      enabled: false,
      seatsAvailable: 0,
      priceChangePerPerson: 0,
    },
    openHours: {
      enabled: false,
      pricePerPerson: 0,
      groupSize: 0,
      maxPeople: 0,
    },
    departureDetails: "",
    knowBeforeYouGo: [""],
    additionalInfo: [""],
    bannerImage: "",
    images: [],

    standardDetails: {
      itineraries: [
        {
          title: "",
          duration: "",
          meals: {
            breakfast: {
              isAvailable: false,
              name: "",
              photos: []
            }, lunch: {
              isAvailable: false,
              name: "",
              photos: []
            }, dinner: {
              isAvailable: false,
              name: "",
              photos: []
            }
          },
          hotelPhotos: [

          ],
          image: "",
          description: "",
          day: 1,
          hotelName: "",
          hotelUrl: "",
          siteSeenPhotos: [],
          transportation: false, // Ensure this is initialized
          carName: "",
          carPhotos: [],
          managerName: "",
          managerImage: "",
        },
      ],
      highlights: [""],
      whatsIncluded: [""],
      whatsExcluded: [""],
      pricing: [
        {
          person: 1,
          price: ""
        }
      ]

      ,

      inclusions: [""],
      exclusions: [""],
      cancellationPolicy: "",
    },

    deluxeDetails: {
      itineraries: [
        {
          title: "",
          duration: "",
          meals: {
            breakfast: {
              isAvailable: false,
              name: "",
              photos: []
            }, lunch: {
              isAvailable: false,
              name: "",
              photos: []
            }, dinner: {
              isAvailable: false,
              name: "",
              photos: []
            }
          },
          image: "",
          description: "",
          day: 1,
          hotelPhotos: [],
          hotelName: "",
          hotelUrl: "",
          siteSeenPhotos: [],
          transportation: false, // Ensure this is initialized
          carName: "",
          carPhotos: [],
          managerName: "",
          managerImage: "",
        },
      ],
      highlights: [""],
      whatsIncluded: [""],
      whatsExcluded: [""],
      pricing: [
        {
          person: 1,
          price: ""
        }
      ]

      ,
      cancellationPolicy: "",
      inclusions: [""],
      exclusions: [""],
    },

    premiumDetails: {
      itineraries: [
        {
          title: "",
          duration: "",
          meals: {
            breakfast: {
              isAvailable: false,
              name: "",
              photos: []
            }, lunch: {
              isAvailable: false,
              name: "",
              photos: []
            }, dinner: {
              isAvailable: false,
              name: "",
              photos: []
            }
          },
          image: "",
          description: "",
          day: 1,
          hotelName: "",
          hotelUrl: "",
          hotelPhotos: [],
          siteSeenPhotos: [],
          transportation: false, // Ensure this is initialized
          carName: "",
          carPhotos: [],
          managerName: "",
          managerImage: "",
        },
      ],
      highlights: [""],
      whatsIncluded: [""],
      whatsExcluded: [""],
      pricing: [
        {
          person: 1,
          price: ""
        }
      ]

      ,

      inclusions: [""],
      cancellationPolicy: "",
      exclusions: [""],
    },
  });

  // Function to handle meal photo changes
  const handleMealPhotosChange = (e, itineraryIndex, mealType, tourDetailType) => {
    const files = Array.from(e.target.files); // Get the uploaded files
    setTourData((prevState) => {
      const updatedItineraries = [...prevState[tourDetailType].itineraries];
      const updatedItinerary = { ...updatedItineraries[itineraryIndex] };

      if (!updatedItinerary.meals[mealType]) {
        updatedItinerary.meals[mealType] = { isAvailable: true, name: "", photos: [] }; // Initialize mealType if it doesn't exist
      }

      updatedItinerary.meals[mealType].photos = [...updatedItinerary.meals[mealType].photos, ...files];
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


  const handleDeleteMealPhoto = (itineraryIndex, photoIndex, mealType, tourDetailType) => {
    setTourData((prevState) => {
      const updatedItineraries = [...prevState[tourDetailType].itineraries];
      const updatedItinerary = { ...updatedItineraries[itineraryIndex] };

      updatedItinerary.meals[mealType].photos = updatedItinerary.meals[mealType].photos.filter((_, index) => index !== photoIndex);
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
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      setTourData((prevState) => ({
        ...prevState,
        bannerImage: file, // Store the File object itself
      }));
    }
  };

  const handleDeleteBanner = () => {
    setTourData((prevState) => ({
      ...prevState,
      bannerImage: "", // Clear the banner image
    }));
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


  const handleCategorySelect = (categoryId) => {
    if (!tourData.categories.includes(categoryId)) {
      setTourData((prevData) => ({
        ...prevData,
        categories: [...prevData.categories, categoryId],
      }));
    }
  };
  const addItinerary = (category) => {
    const newItineraryIndex = tourData[category].itineraries.length;
    const newItinerary = {
      day: newItineraryIndex + 1, // Increment day number
      title: '',
      description: '',
      hotelName: '',
      hotelUrl: '',
      hotelPhotos: [],
      siteSeenPhotos: [],
      meals: {
        breakfast: {
          isAvailable: false,
          name: '',
          photos: [],
        },
        lunch: {
          isAvailable: false,
          name: '',
          photos: [],
        },
        dinner: {
          isAvailable: false,
          name: '',
          photos: [],
        },
      },
      managerName: '',
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
        siteSeenPhotos: [...updatedItineraries[itineraryIndex].siteSeenPhotos, ...files], // Append new photos
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
        hotelPhotos: [...updatedItineraries[itineraryIndex].hotelPhotos, ...files], // Append new photos
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

  const handleDeleteSiteSeenPhoto = (itineraryIndex, photoIndex, itineraryType) => {
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
  const handleDeleteHotelPhoto = (itineraryIndex, photoIndex, itineraryType) => {
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

  const handleCarPhotosChange = (e, index, packageType) => {
    const files = Array.from(e.target.files); // Convert the FileList to an array
    const updatedItineraries = [...tourData[packageType].itineraries];

    // Append the new files to the existing carPhotos array
    updatedItineraries[index].carPhotos = [...updatedItineraries[index].carPhotos, ...files];

    setTourData((prevState) => ({
      ...prevState,
      [packageType]: {
        ...prevState[packageType],
        itineraries: updatedItineraries,
      },
    }));
  };


  const handleDeletePhoto = (index) => {
    // Remove the photo at the specified index
    setTourData((prevState) => {
      const newImages = prevState.images.filter((_, i) => i !== index);
      return {
        ...prevState,
        images: newImages, // Update the images state
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
      const nextPerson = updatedPricing.length > 0 ? updatedPricing.length + 1 : 1;

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
    updatedCategory[field] = updatedCategory[field].filter((_, i) => i !== index);

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
  const removePricingArrayField = (index, field, category, itineraryIndex) => {
    setTourData((prev) => {
      // Clone the data
      const updatedCategory = { ...prev[category] };

      // Access the correct itinerary's pricing array
      const updatedItineraries = [...updatedCategory.itineraries];
      const selectedItinerary = updatedItineraries[itineraryIndex];

      // Remove the pricing entry at the specified index
      selectedItinerary[field] = selectedItinerary[field].filter((_, i) => i !== index);

      // Update the selected itinerary's field (e.g., pricing)
      updatedItineraries[itineraryIndex] = selectedItinerary;

      return {
        ...prev,
        [category]: {
          ...updatedCategory,
          itineraries: updatedItineraries,
        },
      };
    });
  };


  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setTourData((prevState) => ({
      ...prevState,
      images: [...prevState.images, ...files], // Append new files to the existing ones
    }));
  };
  console.log(tourData)
  const handleItineraryMealsChange = (itineraryIndex, mealType, field, files, tourDetailType) => {
    setTourData((prevState) => {
      const updatedItineraries = [...prevState[tourDetailType].itineraries];
      const updatedItinerary = { ...updatedItineraries[itineraryIndex] };

      if (field === "photos") {
        // Get the current list of photos
        const currentPhotos = updatedItinerary.meals[mealType][field];

        // Filter out duplicates by comparing the name and size of each file
        const newFiles = Array.from(files).filter((newFile) => {
          return !currentPhotos.some(
            (existingFile) => existingFile.name === newFile.name && existingFile.size === newFile.size
          );
        });

        // Append only the new files (without duplicates)
        updatedItinerary.meals[mealType][field] = [...currentPhotos, ...newFiles];
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
      try {
        const response = await fetch(`${BASE_URL}/api/categories`);
        const responseAttribute = await fetch(`${BASE_URL}/api/attributes`);
        const responseADestinations = await fetch(`${BASE_URL}/api/getAllDestinations`);
        const attributeData = await responseAttribute.json();
        const destinationData = await responseADestinations.json();
        const data = await response.json();
       
        setAttributes(attributeData)
        setCategories(data);
        setDestinations(destinationData)

      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();

    const handleSaveChanges = async () => {
      try {
        const formData = new FormData();
        const uploadedImageUrls = []; // Array to store uploaded image URLs

        // Helper function to upload images to Cloudinary
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
            return data.secure_url; // Return the uploaded image URL
          } else {
            throw new Error('Failed to upload image to Cloudinary');
          }
        };

        // Function to append images to itineraries
      // Function to append images to itineraries
const appendImagesToItinerary = async (itinerary) => {
  const uploadPhotos = async (photos, field) => {
    if (photos) {
      // Ensure the target field exists and is initialized as an array
      if (!Array.isArray(itinerary[field])) {
        itinerary[field] = [];
      }

      for (const photo of photos) {
        if (photo instanceof File) {
          const uploadedUrl = await uploadImageToCloudinary(photo);
          uploadedImageUrls.push(uploadedUrl); // Store the uploaded URL
          // Only push if the URL is a valid string
          if (uploadedUrl) {
            itinerary[field].push(uploadedUrl);
          }
        } else if (typeof photo === 'string' && photo.trim() !== '') {
          // Push only valid URLs
          itinerary[field].push(photo);
        }
      }
    }
  };

  // Safely check and upload only if the fields are defined, else default to empty arrays
  await uploadPhotos(itinerary.siteSeenPhotos?.filter(Boolean) || [], 'siteSeenPhotos'); // Filter out empty values
  await uploadPhotos(itinerary.hotelPhotos?.filter(Boolean) || [], 'hotelPhotos'); // Filter out empty values
  await uploadPhotos(itinerary.carPhotos?.filter(Boolean) || [], 'carPhotos'); // Filter out empty values

  // Ensure meals exist, and default to empty arrays if not
  itinerary.meals = itinerary.meals || {}; // Initialize meals object if undefined
  itinerary.meals.breakfast = itinerary.meals.breakfast || { photos: [] }; // Ensure breakfast and photos array are initialized
  itinerary.meals.lunch = itinerary.meals.lunch || { photos: [] }; // Ensure lunch and photos array are initialized
  itinerary.meals.dinner = itinerary.meals.dinner || { photos: [] }; // Ensure dinner and photos array are initialized

  await uploadPhotos(itinerary.meals.breakfast.photos?.filter(Boolean) || [], 'meals.breakfast.photos');
  await uploadPhotos(itinerary.meals.lunch.photos?.filter(Boolean) || [], 'meals.lunch.photos');
  await uploadPhotos(itinerary.meals.dinner.photos?.filter(Boolean) || [], 'meals.dinner.photos');

  // Filter out any empty objects or invalid URLs from the itinerary fields
  itinerary.siteSeenPhotos = itinerary.siteSeenPhotos?.filter(photo => typeof photo === 'string' && photo.trim() !== '') || [];
  itinerary.hotelPhotos = itinerary.hotelPhotos?.filter(photo => typeof photo === 'string' && photo.trim() !== '') || [];
  itinerary.carPhotos = itinerary.carPhotos?.filter(photo => typeof photo === 'string' && photo.trim() !== '') || [];
  itinerary.meals.breakfast.photos = itinerary.meals.breakfast.photos?.filter(photo => typeof photo === 'string' && photo.trim() !== '') || [];
  itinerary.meals.lunch.photos = itinerary.meals.lunch.photos?.filter(photo => typeof photo === 'string' && photo.trim() !== '') || [];
  itinerary.meals.dinner.photos = itinerary.meals.dinner.photos?.filter(photo => typeof photo === 'string' && photo.trim() !== '') || [];
};

        // Append images for standard itineraries
        if (tourData.standardDetails?.itineraries) {
          for (const itinerary of tourData.standardDetails.itineraries) {
            await appendImagesToItinerary(itinerary);
          }
        }

        // Repeat for deluxe itineraries
        if (tourData.deluxeDetails?.itineraries) {
          for (const itinerary of tourData.deluxeDetails.itineraries) {
            await appendImagesToItinerary(itinerary);
          }
        }

        // Repeat for premium itineraries
        if (tourData.premiumDetails?.itineraries) {
          for (const itinerary of tourData.premiumDetails.itineraries) {
            await appendImagesToItinerary(itinerary);
          }
        }

        // Add banner image
        if (tourData.bannerImage) {
          const bannerImageUrl = await uploadImageToCloudinary(tourData.bannerImage);
          uploadedImageUrls.push(bannerImageUrl);
          formData.append('bannerImage', bannerImageUrl);
        }

        // Add other images (not the file, just URLs)
        if (tourData.images && Array.isArray(tourData.images)) {
          for (const image of tourData.images) {
            if (image instanceof File) {
              const uploadedUrl = await uploadImageToCloudinary(image);
              uploadedImageUrls.push(uploadedUrl);
              formData.append('images', uploadedUrl); // Append only the URL
            }
          }
        }

        // Reset image fields in tourData to prevent sending files
        setTourData(prevData => ({
          ...prevData,
          standardDetails: {
            ...prevData.standardDetails,
            itineraries: prevData.standardDetails.itineraries.map(itinerary => ({
              ...itinerary,
              siteSeenPhotos: [],
              hotelPhotos: [],
              carPhotos: [],
              meals: {
                breakfast: {
                  ...itinerary.meals.breakfast,
                  photos: [],
                },
                lunch: {
                  ...itinerary.meals.lunch,
                  photos: [],
                },
                dinner: {
                  ...itinerary.meals.dinner,
                  photos: [],
                },
              },
            })),
          },
          deluxeDetails: {
            ...prevData.deluxeDetails,
            itineraries: prevData.deluxeDetails.itineraries.map(itinerary => ({
              ...itinerary,
              siteSeenPhotos: [],
              hotelPhotos: [],
              carPhotos: [],
              meals: {
                breakfast: {
                  ...itinerary.meals.breakfast,
                  photos: [],
                },
                lunch: {
                  ...itinerary.meals.lunch,
                  photos: [],
                },
                dinner: {
                  ...itinerary.meals.dinner,
                  photos: [],
                },
              },
            })),
          },
          premiumDetails: {
            ...prevData.premiumDetails,
            itineraries: prevData.premiumDetails.itineraries.map(itinerary => ({
              ...itinerary,
              siteSeenPhotos: [],
              hotelPhotos: [],
              carPhotos: [],
              meals: {
                breakfast: {
                  ...itinerary.meals.breakfast,
                  photos: [],
                },
                lunch: {
                  ...itinerary.meals.lunch,
                  photos: [],
                },
                dinner: {
                  ...itinerary.meals.dinner,
                  photos: [],
                },
              },
            })),
          },
        }));

        // Append other tour data fields to formData
        for (const key in tourData) {
          if (
            key !== 'images' &&
            key !== 'bannerImage' &&
            key !== 'standardDetails' &&
            key !== 'deluxeDetails' &&
            key !== 'premiumDetails'
          ) {
            formData.append(key, tourData[key]);
          }
        }

        // Serialize and append nested objects
        formData.append('standardDetails', JSON.stringify(tourData.standardDetails));
        formData.append('deluxeDetails', JSON.stringify(tourData.deluxeDetails));
        formData.append('premiumDetails', JSON.stringify(tourData.premiumDetails));
        formData.append('openHours', JSON.stringify(tourData.openHours));
        formData.append('fixedDates', JSON.stringify(tourData.fixedDates));

        // Log all uploaded image URLs
        console.log("Uploaded Image URLs:", uploadedImageUrls);
        console.log("form data", formData);

        // Send formData to the server
        const response = await fetch(`${BASE_URL}/api/createTours`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorResponse = await response.json();
          throw new Error(`Failed to create tour: ${errorResponse.error}`);
        }

        const responseData = await response.json();
        console.log("API response:", responseData);
        toast.success("Tour created successfully!");
      } catch (error) {
        console.error("Error:", error);
        toast.error(error.message);
      }
    };

    // Call the function
    handleSaveChanges();
  };

  const renderStandardDetails = () => (
    <div className="standardDetails">
      <h3>Standard Tour Details</h3>

      {/* Price Field */}


      {/* Pricing Field */}
      <div className="formGroup">
        <label>Pricing</label>
        {tourData.standardDetails.pricing.map((priceObj, index) => (
          <div key={index}>
            <input
              type="number"
              value={priceObj.price}
              onChange={(e) =>
                handlePricingArrayChange(index, { ...priceObj, price: e.target.value }, "standardDetails")
              }
              placeholder={`Price for ${priceObj.person} person`}
            />
            {tourData.standardDetails.pricing.length > 1 && (
              <button
                type="button"
                className="deleteButton"
                onClick={() => removeArrayField(index, "pricing", "standardDetails")}
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
        <input
          type="text"
          name="cancellationPolicy"
          value={tourData.standardDetails.cancellationPolicy}
          onChange={(e) => handleFieldChange("cancellationPolicy", e.target.value, "standardDetails")}
          placeholder="Enter cancellation policy"
        />
      </div>


      {/* Highlights Field */}
      <div className="formGroup">
        <label>Highlights</label>
        {tourData.standardDetails.highlights.map((highlight, index) => (
          <div key={index}>
            <input
              type="text"
              value={highlight}
              onChange={(e) =>
                handleArrayChange(index, "highlights", e.target.value, "standardDetails")
              }
              placeholder="Enter highlight"
            />
            {tourData.standardDetails.highlights.length > 1 && (
              <button
                type="button"
                className="deleteButton"
                onClick={() => removeArrayField(index, "highlights", "standardDetails")}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addArrayField("highlights", "standardDetails")} className="add-more">
          Add More Highlights
        </button>
      </div>

      {/* What's Included Field */}
      <div className="formGroup">
        <label>What's Included</label>
        {tourData.standardDetails.whatsIncluded.map((item, index) => (
          <div key={index} className="formItem">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                handleArrayChange(index, "whatsIncluded", e.target.value, "standardDetails")
              }
              placeholder="Enter item included"
            />
            {tourData.standardDetails.whatsIncluded.length > 1 && (
              <button
                type="button"
                className="deleteButton"
                onClick={() => removeArrayField(index, "whatsIncluded", "standardDetails")}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addArrayField("whatsIncluded", "standardDetails")} className="add-more">
          Add More Items
        </button>
      </div>

      {/* What's Excluded Field */}
      <div className="formGroup">
        <label>What's Excluded</label>
        {tourData.standardDetails.whatsExcluded.map((item, index) => (
          <div key={index} className="formItem">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                handleArrayChange(index, "whatsExcluded", e.target.value, "standardDetails")
              }
              placeholder="Enter item excluded"
            />
            {tourData.standardDetails.whatsExcluded.length > 1 && (
              <button
                type="button"
                className="deleteButton"
                onClick={() => removeArrayField(index, "whatsExcluded", "standardDetails")}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addArrayField("whatsExcluded", "standardDetails")} className="add-more">
          Add More Items
        </button>
      </div>

      {/* Inclusions Field */}
      <div className="formGroup">
        <label>Inclusions</label>
        {tourData.standardDetails.inclusions.map((item, index) => (
          <div key={index} className="formItem">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                handleArrayChange(index, "inclusions", e.target.value, "standardDetails")
              }
              placeholder="Enter inclusion"
            />
            {tourData.standardDetails.inclusions.length > 1 && (
              <button
                type="button"
                className="deleteButton"
                onClick={() => removeArrayField(index, "inclusions", "standardDetails")}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addArrayField("inclusions", "standardDetails")} className="add-more">
          Add More Inclusions
        </button>
      </div>

      {/* Exclusions Field */}
      <div className="formGroup">
        <label>Exclusions</label>
        {tourData.standardDetails.exclusions.map((item, index) => (
          <div key={index} className="formItem">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                handleArrayChange(index, "exclusions", e.target.value, "standardDetails")
              }
              placeholder="Enter exclusion"
            />
            {tourData.standardDetails.exclusions.length > 1 && (
              <button
                type="button"
                className="deleteButton"
                onClick={() => removeArrayField(index, "exclusions", "standardDetails")}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addArrayField("exclusions", "standardDetails")} className="add-more">
          Add More Exclusions
        </button>
      </div>
      <div className="formGroup">
        <h3>Standard Itineraries</h3>
        {tourData.standardDetails.itineraries.map((itinerary, index) => (
          <div key={index} className="itinerary">
            <label>Day {itinerary.day}</label>
            <input
              type="text"
              name="title"
              value={itinerary.title}
              onChange={(e) => handleItineraryChange(index, "title", e.target.value, "standardDetails")}
              placeholder="Enter itinerary title"
            />
            <input
              name="description"
              value={itinerary.description}
              onChange={(e) => handleItineraryChange(index, "description", e.target.value, "standardDetails")}
              placeholder="Enter itinerary description"
            />

            {/* Hotel Name */}
            <input
              type="text"
              name="hotelName"
              value={itinerary.hotelName}
              onChange={(e) => handleItineraryChange(index, "hotelName", e.target.value, "standardDetails")}
              placeholder="Enter hotel name"
            />

            {/* Hotel URL */}
            <input
              type="text"
              name="hotelUrl"
              value={itinerary.hotelUrl}
              onChange={(e) => handleItineraryChange(index, "hotelUrl", e.target.value, "standardDetails")}
              placeholder="Enter hotel URL"
            />

            {/* Siteseen Photos */}
            <label>Siteseen Photos</label>
            <input
              type="file"
              name="siteSeenPhotos"
              multiple
              onChange={(e) => handleSiteSeenPhotoChange(e, index, "standardDetails")} // Pass index correctly
            />

            {/* Display site seen photos */}
            {itinerary.siteSeenPhotos.length > 0 && (
              <div className="photo-preview">
                {itinerary.siteSeenPhotos.map((photo, photoIndex) => (
                  <div key={photoIndex} className="photo-container">
                    <img src={URL.createObjectURL(photo)} alt={`Siteseen ${photoIndex}`} />
                    <button
                      className="delete-photo"
                      onClick={() => handleDeleteSiteSeenPhoto(index, photoIndex, "standardDetails")}
                    >
                      &times; {/* Delete button */}
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label>Hotel Photos</label>
            <input
              type="file"
              name="hotelphotos"
              multiple
              onChange={(e) => handleHotelPhotoChange(e, index, "standardDetails")} // Pass index correctly
            />

            {/* Display site seen photos */}
            {itinerary.hotelPhotos.length > 0 && (
              <div className="photo-preview">
                {itinerary.hotelPhotos.map((photo, photoIndex) => (
                  <div key={photoIndex} className="photo-container">
                    <img src={URL.createObjectURL(photo)} alt={`Hotel ${photoIndex}`} />
                    <button
                      className="delete-photo"
                      onClick={() => handleDeleteHotelPhoto(index, photoIndex, "standardDetails")}
                    >
                      &times; {/* Delete button */}
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="meals-checkbox">
              <label>
                <input
                  type="checkbox"
                  value="breakfast"
                  checked={itinerary.meals.breakfast.isAvailable}
                  onChange={(e) => handleMealChange(e, index, "breakfast", "standardDetails")}
                />
                Breakfast
              </label>
              {itinerary.meals.breakfast.isAvailable == true && (
                <div className="meal-details">
                  <label>Breakfast Name</label>
                  <input
                    type="text"
                    name="breakfastName"
                    value={itinerary.meals.breakfast.name}
                    onChange={(e) => handleItineraryMealsChange(index, "breakfast", "name", e.target.value, "standardDetails")}
                    placeholder="Enter breakfast name"
                  />
                  <label>Breakfast Photos</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleItineraryMealsChange(index, "breakfast", "photos", Array.from(e.target.files), "standardDetails")}
                  />

                  {itinerary.meals.breakfast.photos?.length > 0 && (
                    <div className="photo-preview">
                      {itinerary.meals.breakfast.photos.map((photo, photoIndex) => (
                        <div key={photoIndex} className="photo-container">
                          {/* If the item is a File object, use createObjectURL, otherwise assume it's a string URL */}
                          <img
                            src={photo instanceof File ? URL.createObjectURL(photo) : photo}
                            alt={`Breakfast ${photoIndex}`}
                          />
                          <button
                            className="delete-photo"
                            onClick={() => handleDeleteMealPhoto(index, photoIndex, "breakfast", "standardDetails")}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <label>
                <input
                  type="checkbox"
                  value="lunch"
                  checked={itinerary.meals.lunch.isAvailable}
                  onChange={(e) => handleMealChange(e, index, "lunch", "standardDetails")}
                />
                Lunch
              </label>


              {itinerary.meals.lunch.isAvailable == true && (
                <div className="meal-details">
                  <label>LunchName</label>
                  <input
                    type="text"
                    name="lunchName"
                    value={itinerary.meals.lunch.name}
                    onChange={(e) => handleItineraryMealsChange(index, "lunch", "name", e.target.value, "standardDetails")}
                    placeholder="Enter lunch name"
                  />
                  <label>Breakfast Photos</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleItineraryMealsChange(index, "lunch", "photos", Array.from(e.target.files), "standardDetails")}
                  />
                  {itinerary.meals.lunch.photos?.length > 0 && (
                    <div className="photo-preview">
                      {itinerary.meals.lunch.photos.map((photo, photoIndex) => (
                        <div key={photoIndex} className="photo-container">
                          <img src={URL.createObjectURL(photo)} alt={`Linch ${photoIndex}`} />
                          <button
                            className="delete-photo"
                            onClick={() => handleDeleteMealPhoto(index, photoIndex, "breakfastPhotos", "standardDetails")}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}


              <label>
                <input
                  type="checkbox"
                  value="Dinner"
                  checked={itinerary.meals.dinner.isAvailable}
                  onChange={(e) => handleMealChange(e, index, "dinner", "standardDetails")}
                />
                Dinner
              </label>
              {itinerary.meals.dinner.isAvailable == true && (
                <div className="meal-details">
                  <label>Dinner Name</label>
                  <input
                    type="text"
                    name="dinnerName"
                    value={itinerary.meals.dinner.name}
                    onChange={(e) => handleItineraryMealsChange(index, "dinner", "name", e.target.value, "standardDetails")}
                    placeholder="Enter dinner name"
                  />
                  <label>Dinner Photos</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleItineraryMealsChange(index, "dinner", "photos", Array.from(e.target.files), "standardDetails")}
                  />
                  {itinerary.meals.dinner.photos?.length > 0 && (
                    <div className="photo-preview">
                      {itinerary.meals.dinner.photos.map((photo, photoIndex) => (
                        <div key={photoIndex} className="photo-container">
                          <img src={URL.createObjectURL(photo)} alt={`Linch ${photoIndex}`} />
                          <button
                            className="delete-photo"
                            onClick={() => handleDeleteMealPhoto(index, photoIndex, "dinnerPhotos", "standardDetails")}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>


            <input
              type="text"
              name="managerName"
              value={itinerary.managerName}
              onChange={(e) => handleItineraryChange(index, "managerName", e.target.value, "standardDetails")}
              placeholder="Enter manager name"
            />
            <label>
              <input
                type="checkbox"
                name="transportation"
                checked={itinerary.transportation || false}
                onChange={(e) => {
                  setOpenStandardTransportation(!openStandardTransportation);
                }}
              />
              Include Transportation
            </label>

            {openStandardTransportation && (
              <div className="transportation-section">
                {/* Car Name */}
                <label>Car Name</label>
                <input
                  type="text"
                  name="carName"
                  value={itinerary.carName}
                  onChange={(e) => handleItineraryChange(index, "carName", e.target.value, "standardDetails")}
                  placeholder="Enter car name"
                />

                {/* Car Photos */}
                <label>Car Photos</label>
                <input
                  type="file"
                  name="carPhotos"
                  multiple
                  onChange={(e) => handleCarPhotosChange(e, index, "standardDetails")}
                />

                {/* Display car photos */}
                {itinerary.carPhotos && itinerary.carPhotos.length > 0 && (
                  <div className="photo-preview">
                    {itinerary.carPhotos.map((photo, photoIndex) => (
                      <div key={photoIndex} className="photo-container">
                        <img src={URL.createObjectURL(photo)} alt={`Car ${photoIndex}`} />
                        <button
                          className="delete-photo"
                          onClick={() => handleDeleteCarPhoto(index, photoIndex, "standardDetails")}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button type="button" onClick={() => removeItinerary("standardDetails", index)} className="deleteButton">
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
        {tourData.deluxeDetails.pricing.map((priceObj, index) => (
          <div key={index}>
            <input
              type="number"
              value={priceObj.price}
              onChange={(e) =>
                handlePricingArrayChange(index, { ...priceObj, price: e.target.value }, "deluxeDetails")
              }
              placeholder={`Price for ${priceObj.person} person`}
            />
            {tourData.deluxeDetails.pricing.length > 1 && (
              <button
                type="button"
                className="deleteButton"
                onClick={() => removeArrayField(index, "pricing", "deluxeDetails")}
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
        <input
          type="text"
          name="cancellationPolicy"
          value={tourData.deluxeDetails.cancellationPolicy}
          onChange={(e) => handleFieldChange("cancellationPolicy", e.target.value, "deluxeDetails")}
          placeholder="Enter cancellation policy"
        />
      </div>

      {/* Highlights */}
      <div className="formGroup">
        <label>Highlights</label>
        {tourData.deluxeDetails.highlights.map((highlight, index) => (
          <div key={index} className="formItem">
            <input
              type="text"
              value={highlight}
              onChange={(e) =>
                handleArrayChange(index, "highlights", e.target.value, "deluxeDetails")
              }
              placeholder="Enter highlight"
            />
            {tourData.deluxeDetails.highlights.length > 1 && (
              <button
                type="button"
                className="deleteButton"
                onClick={() => removeArrayField(index, "highlights", "deluxeDetails")}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addArrayField("highlights", "deluxeDetails")} className="add-more">
          Add More Highlights
        </button>
      </div>

      {/* What's Included */}
      <div className="formGroup">
        <label>What's Included</label>
        {tourData.deluxeDetails.whatsIncluded.map((item, index) => (
          <div key={index} className="formItem">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                handleArrayChange(index, "whatsIncluded", e.target.value, "deluxeDetails")
              }
              placeholder="Enter included item"
            />
            {tourData.deluxeDetails.whatsIncluded.length > 1 && (
              <button
                type="button"
                className="deleteButton"
                onClick={() => removeArrayField(index, "whatsIncluded", "deluxeDetails")}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addArrayField("whatsIncluded", "deluxeDetails")} className="add-more">
          Add More Items
        </button>
      </div>

      {/* What's Excluded */}
      <div className="formGroup">
        <label>What's Excluded</label>
        {tourData.deluxeDetails.whatsExcluded.map((item, index) => (
          <div key={index} className="formItem">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                handleArrayChange(index, "whatsExcluded", e.target.value, "deluxeDetails")
              }
              placeholder="Enter excluded item"
            />
            {tourData.deluxeDetails.whatsExcluded.length > 1 && (
              <button
                type="button"
                className="deleteButton"
                onClick={() => removeArrayField(index, "whatsExcluded", "deluxeDetails")}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addArrayField("whatsExcluded", "deluxeDetails")} className="add-more">
          Add More Items
        </button>
      </div>

      {/* Inclusions */}
      <div className="formGroup">
        <label>Inclusions</label>
        {tourData.deluxeDetails.inclusions.map((item, index) => (
          <div key={index} className="formItem">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                handleArrayChange(index, "inclusions", e.target.value, "deluxeDetails")
              }
              placeholder="Enter inclusion"
            />
            {tourData.deluxeDetails.inclusions.length > 1 && (
              <button
                type="button"
                className="deleteButton"
                onClick={() => removeArrayField(index, "inclusions", "deluxeDetails")}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addArrayField("inclusions", "deluxeDetails")} className="add-more">
          Add More Inclusions
        </button>
      </div>

      {/* Exclusions */}
      <div className="formGroup">
        <label>Exclusions</label>
        {tourData.deluxeDetails.exclusions.map((item, index) => (
          <div key={index} className="formItem">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                handleArrayChange(index, "exclusions", e.target.value, "deluxeDetails")
              }
              placeholder="Enter exclusion"
            />
            {tourData.deluxeDetails.exclusions.length > 1 && (
              <button
                type="button"
                className="deleteButton"
                onClick={() => removeArrayField(index, "exclusions", "deluxeDetails")}
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addArrayField("exclusions", "deluxeDetails")} className="add-more">
          Add More Exclusions
        </button>
      </div>
      <div className="formGroup">
        <h3>Deluxe Itineraries</h3>
        {tourData.deluxeDetails.itineraries.map((itinerary, index) => (
          <div key={index} className="itinerary">
            <label>Day {itinerary.day}</label>
            <input
              type="text"
              name="title"
              value={itinerary.title}
              onChange={(e) => handleItineraryChange(index, "title", e.target.value, "deluxeDetails")}
              placeholder="Enter itinerary title"
            />
            <input
              name="description"
              value={itinerary.description}
              onChange={(e) => handleItineraryChange(index, "description", e.target.value, "deluxeDetails")}
              placeholder="Enter itinerary description"
            />

            {/* Hotel Name */}
            <input
              type="text"
              name="hotelName"
              value={itinerary.hotelName}
              onChange={(e) => handleItineraryChange(index, "hotelName", e.target.value, "deluxeDetails")}
              placeholder="Enter hotel name"
            />

            {/* Hotel URL */}
            <input
              type="text"
              name="hotelUrl"
              value={itinerary.hotelUrl}
              onChange={(e) => handleItineraryChange(index, "hotelUrl", e.target.value, "deluxeDetails")}
              placeholder="Enter hotel URL"
            />


            <div>
              {/* Other itinerary details */}
              <label>Siteseen Photos</label>
              <input
                type="file"
                name="siteSeenPhotos"
                multiple
                onChange={(e) => handleSiteSeenPhotoChange(e, index, "deluxeDetails")} // Pass index correctly
              />

              {/* Display site seen photos */}
              {itinerary.siteSeenPhotos.length > 0 && (
                <div className="photo-preview">
                  {itinerary.siteSeenPhotos.map((photo, photoIndex) => (
                    <div key={photoIndex} className="photo-container">
                      <img src={URL.createObjectURL(photo)} alt={`Siteseen ${photoIndex}`} />
                      <button
                        className="delete-photo"
                        onClick={() => handleDeleteSiteSeenPhoto(index, photoIndex, "deluxeDetails")}
                      >
                        &times; {/* Delete button */}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>


            <label>Hotel Photos</label>
            <input
              type="file"
              name="hotelphotos"
              multiple
              onChange={(e) => handleHotelPhotoChange(e, index, "deluxeDetails")} // Pass index correctly
            />

            {/* Display site seen photos */}
            {itinerary.hotelPhotos.length > 0 && (
              <div className="photo-preview">
                {itinerary.hotelPhotos.map((photo, photoIndex) => (
                  <div key={photoIndex} className="photo-container">
                    <img src={URL.createObjectURL(photo)} alt={`Hotel ${photoIndex}`} />
                    <button
                      className="delete-photo"
                      onClick={() => handleDeleteHotelPhoto(index, photoIndex, "deluxeDetails")}
                    >
                      &times; {/* Delete button */}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Meals Checkboxes */}
            <div className="meals-checkbox">
              <label>
                <input
                  type="checkbox"
                  value="breakfast"
                  checked={itinerary.meals.breakfast.isAvailable}
                  onChange={(e) => handleMealChange(e, index, "breakfast", "deluxeDetails")}
                />
                Breakfast
              </label>
              {itinerary.meals.breakfast.isAvailable == true && (
                <div className="meal-details">
                  <label>Breakfast Name</label>
                  <input
                    type="text"
                    name="breakfastName"
                    value={itinerary.meals.breakfast.name}
                    onChange={(e) => handleItineraryMealsChange(index, "breakfast", "name", e.target.value, "deluxeDetails")}
                    placeholder="Enter breakfast name"
                  />
                  <label>Breakfast Photos</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleItineraryMealsChange(index, "breakfast", "photos", Array.from(e.target.files), "deluxeDetails")}
                  />

                  {itinerary.meals.breakfast.photos?.length > 0 && (
                    <div className="photo-preview">
                      {itinerary.meals.breakfast.photos.map((photo, photoIndex) => (
                        <div key={photoIndex} className="photo-container">
                          {/* If the item is a File object, use createObjectURL, otherwise assume it's a string URL */}
                          <img
                            src={photo instanceof File ? URL.createObjectURL(photo) : photo}
                            alt={`Breakfast ${photoIndex}`}
                          />
                          <button
                            className="delete-photo"
                            onClick={() => handleDeleteMealPhoto(index, photoIndex, "breakfast", "deluxeDetails")}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <label>
                <input
                  type="checkbox"
                  value="lunch"
                  checked={itinerary.meals.lunch.isAvailable}
                  onChange={(e) => handleMealChange(e, index, "lunch", "deluxeDetails")}
                />
                Lunch
              </label>


              {itinerary.meals.lunch.isAvailable == true && (
                <div className="meal-details">
                  <label>LunchName</label>
                  <input
                    type="text"
                    name="lunchName"
                    value={itinerary.meals.lunch.name}
                    onChange={(e) => handleItineraryMealsChange(index, "lunch", "name", e.target.value, "deluxeDetails")}
                    placeholder="Enter lunch name"
                  />
                  <label>Breakfast Photos</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleItineraryMealsChange(index, "lunch", "photos", Array.from(e.target.files), "deluxeDetails")}
                  />
                  {itinerary.meals.lunch.photos?.length > 0 && (
                    <div className="photo-preview">
                      {itinerary.meals.lunch.photos.map((photo, photoIndex) => (
                        <div key={photoIndex} className="photo-container">
                          <img src={URL.createObjectURL(photo)} alt={`Linch ${photoIndex}`} />
                          <button
                            className="delete-photo"
                            onClick={() => handleDeleteMealPhoto(index, photoIndex, "breakfastPhotos", "deluxeDetails")}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}


              <label>
                <input
                  type="checkbox"
                  value="Dinner"
                  checked={itinerary.meals.dinner.isAvailable}
                  onChange={(e) => handleMealChange(e, index, "dinner", "deluxeDetails")}
                />
                Dinner
              </label>
              {itinerary.meals.dinner.isAvailable == true && (
                <div className="meal-details">
                  <label>Dinner Name</label>
                  <input
                    type="text"
                    name="dinnerName"
                    value={itinerary.meals.dinner.name}
                    onChange={(e) => handleItineraryMealsChange(index, "dinner", "name", e.target.value, "deluxeDetails")}
                    placeholder="Enter dinner name"
                  />
                  <label>Dinner Photos</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleItineraryMealsChange(index, "dinner", "photos", Array.from(e.target.files), "deluxeDetails")}
                  />
                  {itinerary.meals.dinner.photos?.length > 0 && (
                    <div className="photo-preview">
                      {itinerary.meals.dinner.photos.map((photo, photoIndex) => (
                        <div key={photoIndex} className="photo-container">
                          <img src={URL.createObjectURL(photo)} alt={`Linch ${photoIndex}`} />
                          <button
                            className="delete-photo"
                            onClick={() => handleDeleteMealPhoto(index, photoIndex, "dinnerPhotos", "deluxeDetails")}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>


            {/* Manager Name */}
            <input
              type="text"
              name="managerName"
              value={itinerary.managerName}
              onChange={(e) => handleItineraryChange(index, "managerName", e.target.value, "deluxeDetails")}
              placeholder="Enter manager name"
            />
            <label>
              <input
                type="checkbox"
                name="transportation"
                checked={itinerary.transportation || false}
                onChange={(e) => {
                  setOpenTranportation(!openTranportation);
                }}
              />
              Include Transportation
            </label>

            {openTranportation && (
              <div className="transportation-section">
                {/* Car Name */}
                <label>Car Name</label>
                <input
                  type="text"
                  name="carName"
                  value={itinerary.carName || ""}
                  onChange={(e) => handleItineraryChange(index, "carName", e.target.value, "deluxeDetails")}
                  placeholder="Enter car name"
                />

                {/* Car Photos */}
                <label>Car Photos</label>
                <input
                  type="file"
                  name="carPhotos"
                  multiple
                  onChange={(e) => handleCarPhotosChange(e, index, "deluxeDetails")}
                />

                {/* Display car photos */}
                {itinerary.carPhotos && itinerary.carPhotos.length > 0 && (
                  <div className="photo-preview">
                    {itinerary.carPhotos.map((photo, photoIndex) => (
                      <div key={photoIndex} className="photo-container">
                        <img src={URL.createObjectURL(photo)} alt={`Car ${photoIndex}`} />
                        <button
                          className="delete-photo"
                          onClick={() => handleDeleteCarPhoto(index, photoIndex, "deluxeDetails")}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <button type="button" onClick={() => removeItinerary("deluxeDetails", index)} className="deleteButton">
              Remove Itinerary
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addItinerary("deluxeDetails")}>
          Add Deluxe Itinerary
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
                handlePricingArrayChange(index, { ...priceObj, price: e.target.value }, "premiumDetails")
              }
              placeholder={`Price for ${priceObj.person} person`}
            />
            {tourData.premiumDetails.pricing.length > 1 && (
              <button
                type="button"
                className="deleteButton"
                onClick={() => removeArrayField(index, "pricing", "premiumDetails")}
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
        <input
          type="text"
          name="cancellationPolicy"
          value={tourData.premiumDetails.cancellationPolicy}
          onChange={(e) => handleFieldChange("cancellationPolicy", e.target.value, "premiumDetails")}
          placeholder="Enter cancellation policy"
        />
      </div>

      {/* Highlights Field */}
      <div className="formGroup">
        <label>Highlights</label>
        {tourData.premiumDetails.highlights.map((highlight, index) => (
          <div key={index} className="formItem">
            <input
              type="text"
              value={highlight}
              onChange={(e) =>
                handleArrayChange(index, "highlights", e.target.value, "premiumDetails")
              }
              placeholder="Enter highlight"
            />
            {tourData.premiumDetails.highlights.length > 1 && (
              <button type="button" onClick={() => removeArrayField(index, "highlights", "premiumDetails")} className="deleteButton">
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addArrayField("highlights", "premiumDetails")} className="add-more">
          Add More Highlights
        </button>
      </div>

      {/* What's Included Field */}
      <div className="formGroup">
        <label>What's Included</label>
        {tourData.premiumDetails.whatsIncluded.map((item, index) => (
          <div key={index} className="formItem">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                handleArrayChange(index, "whatsIncluded", e.target.value, "premiumDetails")
              }
              placeholder="Enter item included"
            />
            {tourData.premiumDetails.whatsIncluded.length > 1 && (
              <button type="button" onClick={() => removeArrayField(index, "whatsIncluded", "premiumDetails")} className="deleteButton">
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addArrayField("whatsIncluded", "premiumDetails")} className="add-more">
          Add More Items
        </button>
      </div>

      {/* What's Excluded Field */}
      <div className="formGroup">
        <label>What's Excluded</label>
        {tourData.premiumDetails.whatsExcluded.map((item, index) => (
          <div key={index} className="formItem">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                handleArrayChange(index, "whatsExcluded", e.target.value, "premiumDetails")
              }
              placeholder="Enter item excluded"
            />
            {tourData.premiumDetails.whatsExcluded.length > 1 && (
              <button type="button" onClick={() => removeArrayField(index, "whatsExcluded", "premiumDetails")} className="deleteButton">
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addArrayField("whatsExcluded", "premiumDetails")} className="add-more">
          Add More Items
        </button>
      </div>

      {/* Inclusions Field */}
      <div className="formGroup">
        <label>Inclusions</label>
        {tourData.premiumDetails.inclusions.map((item, index) => (
          <div key={index} className="formItem">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                handleArrayChange(index, "inclusions", e.target.value, "premiumDetails")
              }
              placeholder="Enter inclusion"
            />
            {tourData.premiumDetails.inclusions.length > 1 && (
              <button type="button" onClick={() => removeArrayField(index, "inclusions", "premiumDetails")} className="deleteButton">
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addArrayField("inclusions", "premiumDetails")} className="add-more">
          Add More Inclusions
        </button>
      </div>

      {/* Exclusions Field */}
      <div className="formGroup">
        <label>Exclusions</label>
        {tourData.premiumDetails.exclusions.map((item, index) => (
          <div key={index} className="formItem">
            <input
              type="text"
              value={item}
              onChange={(e) =>
                handleArrayChange(index, "exclusions", e.target.value, "premiumDetails")
              }
              placeholder="Enter exclusion"
            />
            {tourData.premiumDetails.exclusions.length > 1 && (
              <button type="button" onClick={() => removeArrayField(index, "exclusions", "premiumDetails")} className="deleteButton">
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addArrayField("exclusions", "premiumDetails")} className="add-more">
          Add More Exclusions
        </button>
      </div>
      {/* Premium Itineraries */}
      <div className="formGroup">
        <h3>Premium Itineraries</h3>
        {tourData.premiumDetails.itineraries.map((itinerary, index) => (
          <div key={index} className="itinerary">
            <label>Day {itinerary.day}</label>
            <input
              type="text"
              name="title"
              value={itinerary.title}
              onChange={(e) => handleItineraryChange(index, "title", e.target.value, "premiumDetails")}
              placeholder="Enter itinerary title"
            />
            <input
              name="description"
              value={itinerary.description}
              onChange={(e) => handleItineraryChange(index, "description", e.target.value, "premiumDetails")}
              placeholder="Enter itinerary description"
            />

            {/* Hotel Name */}
            <input
              type="text"
              name="hotelName"
              value={itinerary.hotelName}
              onChange={(e) => handleItineraryChange(index, "hotelName", e.target.value, "premiumDetails")}
              placeholder="Enter hotel name"
            />

            {/* Hotel URL */}
            <input
              type="text"
              name="hotelUrl"
              value={itinerary.hotelUrl}
              onChange={(e) => handleItineraryChange(index, "hotelUrl", e.target.value, "premiumDetails")}
              placeholder="Enter hotel URL"
            />

            {/* Site Seen Photos */}

            <label>Siteseen Photos</label>
            <input
              type="file"
              name="siteSeenPhotos"
              multiple
              onChange={(e) => handleSiteSeenPhotoChange(e, index, "premiumDetails")}
            />

            {/* Display site seen photos */}
            {itinerary.siteSeenPhotos.length > 0 && (
              <div className="photo-preview">
                {itinerary.siteSeenPhotos.map((photo, photoIndex) => (
                  <div key={photoIndex} className="photo-container">
                    <img src={URL.createObjectURL(photo)} alt={`Siteseen ${photoIndex}`} />
                    <button
                      className="delete-photo"
                      onClick={() => handleDeleteSiteSeenPhoto(index, photoIndex, "premiumDetails")}
                    >
                      &times; {/* Delete button */}
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label>Hotel Photos</label>
            <input
              type="file"
              name="hotelphotos"
              multiple
              onChange={(e) => handleHotelPhotoChange(e, index, "premiumDetails")} // Pass index correctly
            />

            {/* Display site seen photos */}
            {itinerary.hotelPhotos.length > 0 && (
              <div className="photo-preview">
                {itinerary.hotelPhotos.map((photo, photoIndex) => (
                  <div key={photoIndex} className="photo-container">
                    <img src={URL.createObjectURL(photo)} alt={`Hotel ${photoIndex}`} />
                    <button
                      className="delete-photo"
                      onClick={() => handleDeleteHotelPhoto(index, photoIndex, "premiumDetails")}
                    >
                      &times; {/* Delete button */}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Display site seen photos */}



            {/* Meals Checkboxes */}
            <div className="meals-checkbox">
              <label>
                <input
                  type="checkbox"
                  value="breakfast"
                  checked={itinerary.meals.breakfast.isAvailable}
                  onChange={(e) => handleMealChange(e, index, "breakfast", "premiumDetails")}
                />
                Breakfast
              </label>
              {itinerary.meals.breakfast.isAvailable == true && (
                <div className="meal-details">
                  <label>Breakfast Name</label>
                  <input
                    type="text"
                    name="breakfastName"
                    value={itinerary.meals.breakfast.name}
                    onChange={(e) => handleItineraryMealsChange(index, "breakfast", "name", e.target.value, "premiumDetails")}
                    placeholder="Enter breakfast name"
                  />
                  <label>Breakfast Photos</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleItineraryMealsChange(index, "breakfast", "photos", Array.from(e.target.files), "premiumDetails")}
                  />

                  {itinerary.meals.breakfast.photos?.length > 0 && (
                    <div className="photo-preview">
                      {itinerary.meals.breakfast.photos.map((photo, photoIndex) => (
                        <div key={photoIndex} className="photo-container">
                          {/* If the item is a File object, use createObjectURL, otherwise assume it's a string URL */}
                          <img
                            src={photo instanceof File ? URL.createObjectURL(photo) : photo}
                            alt={`Breakfast ${photoIndex}`}
                          />
                          <button
                            className="delete-photo"
                            onClick={() => handleDeleteMealPhoto(index, photoIndex, "breakfast", "premiumDetails")}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <label>
                <input
                  type="checkbox"
                  value="lunch"
                  checked={itinerary.meals.lunch.isAvailable}
                  onChange={(e) => handleMealChange(e, index, "lunch", "premiumDetails")}
                />
                Lunch
              </label>


              {itinerary.meals.lunch.isAvailable == true && (
                <div className="meal-details">
                  <label>LunchName</label>
                  <input
                    type="text"
                    name="lunchName"
                    value={itinerary.meals.lunch.name}
                    onChange={(e) => handleItineraryMealsChange(index, "lunch", "name", e.target.value, "premiumDetails")}
                    placeholder="Enter lunch name"
                  />
                  <label>Breakfast Photos</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleItineraryMealsChange(index, "lunch", "photos", Array.from(e.target.files), "premiumDetails")}
                  />
                  {itinerary.meals.lunch.photos?.length > 0 && (
                    <div className="photo-preview">
                      {itinerary.meals.lunch.photos.map((photo, photoIndex) => (
                        <div key={photoIndex} className="photo-container">
                          <img src={URL.createObjectURL(photo)} alt={`Linch ${photoIndex}`} />
                          <button
                            className="delete-photo"
                            onClick={() => handleDeleteMealPhoto(index, photoIndex, "breakfastPhotos", "premiumDetails")}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}


              <label>
                <input
                  type="checkbox"
                  value="Dinner"
                  checked={itinerary.meals.dinner.isAvailable}
                  onChange={(e) => handleMealChange(e, index, "dinner", "premiumDetails")}
                />
                Dinner
              </label>
              {itinerary.meals.dinner.isAvailable == true && (
                <div className="meal-details">
                  <label>Dinner Name</label>
                  <input
                    type="text"
                    name="dinnerName"
                    value={itinerary.meals.dinner.name}
                    onChange={(e) => handleItineraryMealsChange(index, "dinner", "name", e.target.value, "premiumDetails")}
                    placeholder="Enter dinner name"
                  />
                  <label>Dinner Photos</label>
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleItineraryMealsChange(index, "dinner", "photos", Array.from(e.target.files), "premiumDetails")}
                  />
                  {itinerary.meals.dinner.photos?.length > 0 && (
                    <div className="photo-preview">
                      {itinerary.meals.dinner.photos.map((photo, photoIndex) => (
                        <div key={photoIndex} className="photo-container">
                          <img src={URL.createObjectURL(photo)} alt={`Linch ${photoIndex}`} />
                          <button
                            className="delete-photo"
                            onClick={() => handleDeleteMealPhoto(index, photoIndex, "dinnerPhotos", "premiumDetails")}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>



            <input
              type="text"
              name="managerName"
              value={itinerary.managerName}
              onChange={(e) => handleItineraryChange(index, "managerName", e.target.value, "premiumDetails")}
              placeholder="Enter manager name"
            />
            <label>
              <input
                type="checkbox"
                name="transportation"
                checked={itinerary.transportation || false}
                onChange={(e) => {
                  setOpenPremiumTranportation(!openPremiumTranportation);
                }}
              />
              Include Transportation
            </label>

            {openPremiumTranportation && (
              <div className="transportation-section">
                {/* Car Name */}
                <label>Car Name</label>
                <input
                  type="text"
                  name="carName"
                  value={itinerary.carName || ""}
                  onChange={(e) => handleItineraryChange(index, "carName", e.target.value, "premiumDetails")}
                  placeholder="Enter car name"
                />

                {/* Car Photos */}
                <label>Car Photos</label>
                <input
                  type="file"
                  name="carPhotos"
                  multiple
                  onChange={(e) => handleCarPhotosChange(e, index, "premiumDetails")}
                />

                {/* Display car photos */}
                {itinerary.carPhotos && itinerary.carPhotos.length > 0 && (
                  <div className="photo-preview">
                    {itinerary.carPhotos.map((photo, photoIndex) => (
                      <div key={photoIndex} className="photo-container">
                        <img src={URL.createObjectURL(photo)} alt={`Car ${photoIndex}`} />
                        <button
                          className="delete-photo"
                          onClick={() => handleDeleteCarPhoto(index, photoIndex, "premiumDetails")}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <button
              type="button"
              className="deleteButton"
              onClick={() => removeItinerary("premiumDetails", index)}
            >
              Remove Itinerary
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addItinerary("premiumDetails")}>
          Add Premium Itinerary
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

        {/* Form Fields */}
        <div className="bottom">
          <form onSubmit={handleSubmit} >
            {/* Common fields */}
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
                  checked={tourData.fixedDates.enabled}
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



            {/* Conditionally render additional fields for Fixed Dates Tour */}
            {tourData.fixedDates.enabled && (
              <div className="fixedDatesBox">
                <h4>Fixed Dates Tour Details</h4>
                <div className="formGroup">
                  <label>Seats Available</label>
                  <input
                    type="number"
                    value={tourData.fixedDates.seatsAvailable || ''}
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
                    value={tourData.fixedDates.priceChangePerPerson || ''}
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


              <label>
                <input
                  type="checkbox"
                  name="openHours"
                  checked={tourData.openHours.enabled}
                  onChange={(e) => {
                    setTourData((prevState) => ({
                      ...prevState,
                      openHours: {
                        ...prevState.openHours,
                        enabled: e.target.checked,
                      },
                    }));
                  }}
                />
                Open Hours Tour
              </label>

            </div>
            {tourData.openHours.enabled && (
              <div className="openHoursBox">
                <h4>Open Hours Tour Details</h4>
                <div className="formGroup">
                  <label>Price Per Person</label>
                  <input
                    type="number"
                    value={tourData.openHours.pricePerPerson || ''}
                    onChange={(e) =>
                      setTourData((prevState) => ({
                        ...prevState,
                        openHours: {
                          ...prevState.openHours,
                          pricePerPerson: e.target.value,
                        },
                      }))
                    }
                    placeholder="Enter price per person"
                  />
                </div>

                <div className="formGroup">
                  <label>Group Size</label>
                  <input
                    type="number"
                    value={tourData.openHours.groupSize || ''}
                    onChange={(e) =>
                      setTourData((prevState) => ({
                        ...prevState,
                        openHours: {
                          ...prevState.openHours,
                          groupSize: e.target.value,
                        },
                      }))
                    }
                    placeholder="Enter group size"
                  />
                </div>

                <div className="formGroup">
                  <label>Max People</label>
                  <input
                    type="number"
                    value={tourData.openHours.maxPeople || ''}
                    onChange={(e) =>
                      setTourData((prevState) => ({
                        ...prevState,
                        openHours: {
                          ...prevState.openHours,
                          maxPeople: e.target.value,
                        },
                      }))
                    }
                    placeholder="Enter max people"
                  />
                </div>
              </div>
            )}


            <div className="formGroup">
              <label>Overview</label>
              <input
                type="text"
                name="overview"
                value={tourData.overview}
                onChange={handleChange}
                placeholder="Enter overview"
                required
              />
            </div>

            <div className="formGroup">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={tourData.location}
                onChange={handleChange}
                placeholder="Enter location"
                required
              />
            </div>

            <div className="formGroup">
              <label>Duration</label>
              <input
                type="text"
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
                onChange={(e) => setTourData((prevData) => ({
                  ...prevData,
                  welcomeDrinks: e.target.checked
                }))}
              />
              <span> Include Welcome Drinks</span>
            </div>

            <div className="formGroup">
              <label>Departure Details</label>
              <input
                type="text"
                name="departureDetails"
                value={tourData.departureDetails}
                onChange={handleChange}
                placeholder="Enter departure details"
              />
            </div>

            <div className="formGroup">
              <label>Know Before You Go</label>
              <input
                name="knowBeforeYouGo"
                value={tourData.knowBeforeYouGo}
                onChange={handleChange}
                placeholder="Enter information that travelers should know before they go"
              />
            </div>

            <div className="formGroup">
              <label>Additional Information</label>
              <input
                name="additionalInfo"
                value={tourData.additionalInfo}
                onChange={handleChange}
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

              {/* Display banner image preview only when it's uploaded */}
              {tourData.bannerImage && (
                <div className="banner-preview">
                  <img src={tourData.bannerImage} alt="Banner Preview" />
                  <button className="delete-banner" onClick={handleDeleteBanner}>
                    &times; {/* Delete icon for the banner image */}
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
                {tourData.categories.map((categoryId) => {

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
    onChange={(e) => handleLocationSelect('country', e.target.value)}
  >
    <option value="">Select a country</option>
    {destinations && destinations.map((d) => (
      <option key={d.id} value={d.id}>
        {d.country?.label}
      </option>
    ))}
  </select>

  <select
    name="state"
    onChange={(e) => handleLocationSelect('state', e.target.value)}
  >
    <option value="">Select a state</option>
    {destinations && destinations.map((d) => (
      <option key={d.id} value={d.id}>
        {d.state?.label}
      </option>
    ))}
  </select>

  <select
    name="city"
    onChange={(e) => handleLocationSelect('city', e.target.value)}
  >
    <option value="">Select a city</option>
    {destinations && destinations.map((d) => (
      <option key={d.id} value={d.id}>
        {d.city?.label}
      </option>
    ))}
  </select>
</div>


              <div className="selectedCategories">
                {tourData.categories.map((categoryId) => {

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
              <label htmlFor="attributesInput">Attributes</label>
              <div>
                <select
                  id="categoriesInput"
                  name="attributes"
                  value="" // Keep this empty to allow selecting multiple attributes
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

              {/* Selected Attributes */}
              <div className="selectedAttributes">
                {tourData.attributes.map((attributeId) => {

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
                onChange={handleFileChange}
              />

              {/* Display image previews only when there are uploaded images */}
              {tourData.images.length > 0 && (
                <div className="photo-preview">
                  {tourData.images.map((photo, index) => (
                    <div key={index} className="photo-container">
                      <img src={photo} alt={`Uploaded preview ${index}`} />
                      <button
                        className="delete-photo"
                        onClick={() => handleDeletePhoto(index)}
                      >
                        &times; {/* You can replace this with an icon if you prefer */}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="formGroup">
              <label>Group Size</label>
              <input
                type="text"
                name="groupSize"
                value={tourData.groupSize}
                onChange={handleChange}
                placeholder="Enter group size"
              />
            </div>

            <div className="formGroup">
              <label>Transportation</label>
              <input
                type="checkbox"
                name="transportation"
                checked={tourData.transportation}
                onChange={(e) =>
                  setTourData({ ...tourData, transportation: e.target.checked })
                }
              />
            </div>

            <div className="formGroup">
              <label>Languages</label>
              {tourData.languages.map((language, index) => (
                <div key={index} className="formItem">
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => handleArrayChangeLanguage(index, e.target.value)}
                    placeholder="Enter language"
                  />
                  <button
                    type="button"
                    className="deleteButton"
                    onClick={() => removeLanguage(index)} // Ensure removeLanguage correctly removes from the languages array
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                className="add-more"
                onClick={addLanguageField} // Function to add a new language field
              >
                Add More Languages
              </button>
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

            {/* Conditionally Render Fields Based on Selected Tour Type */}
            {selectedTourType === "standard" && renderStandardDetails()}
            {selectedTourType === "deluxe" && renderDeluxeDetails()}
            {selectedTourType === "premium" && renderPremiumDetails()}



            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewTour;

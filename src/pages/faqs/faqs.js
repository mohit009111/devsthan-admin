import React, { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import "./faqs.css";
import { BASE_URL } from "../../utils/headers";

const tours = [
    { id: 1, name: "Tour A", faqs: [{ question: "What is included?", answer: "Meals and accommodation.", category: "General" }] },
    { id: 2, name: "Tour B", faqs: [{ question: "Is food provided?", answer: "Yes, all meals are included.", category: "Food" }] },
    { id: 3, name: "Tour C", faqs: [{ question: "Can I cancel?", answer: "Yes, up to 48 hours before departure.", category: "Cancellation" }] },
];

const categories = ["General", "Food", "Cancellation", "Pricing", "Other"];

const Faqs = () => {
    const [selectedTour, setSelectedTour] = useState(null);
    const [newData, setNewData] = useState({
        question: "",
        answer: "",

    });
    const [allTours, setAllTours] = useState([]);
    const [faqs, setFaqs] = useState([]);
    const [newCategory, setNewCategory] = useState("General");
    const handleTourClick = async (tour) => {
        setSelectedTour(tour);

        try {
            const response = await fetch(`${BASE_URL}/api/getFaqs/${tour.uuid}`);
            const faqs = await response.json();
            console.log(faqs)
            setFaqs(faqs)
            // setSelectedTour({ ...tour, faqs }); // Update tour with fetched FAQs
        } catch (error) {
            console.error("Error fetching FAQs:", error);
        }
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const fixedTourResponse = await fetch(`${BASE_URL}/api/allTours`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ fixedTour: true }),
                });

                const openHourTourResponse = await fetch(`${BASE_URL}/api/allTours`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ fixedTour: false }),
                });

                const fixedTour = await fixedTourResponse.json();
                const openHourTour = await openHourTourResponse.json();

                setAllTours([...fixedTour, ...openHourTour]); // Correct way to merge two arrays


            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);


    const handleAddFaq = async () => {
        if (!newData.question.trim() || !newData.answer.trim() || !selectedTour) {
            alert("Please fill all fields.");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/api/createFaq`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    tourId: selectedTour.uuid, // Sending tour ID
                    question: newData.question,
                    answer: newData.answer,
                    category: newCategory,
                }),
            });

            if (!response.ok) throw new Error("Failed to add FAQ");

            const newFaq = await response.json();

            // Update UI with new FAQ
            setFaqs((prevFaqs) => [...prevFaqs, newFaq]);

            // Clear inputs
            setNewData({ question: "", answer: "" });
            setNewCategory("General");
        } catch (error) {
            console.error("Error adding FAQ:", error);
        }
    };

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>Create FAQs</h1>
                </div>
                <div className="tourList">
                    <h2>Select a Tour</h2>
                    <ul>
                        {allTours?.map((tour) => (
                            <li key={tour.id} onClick={() => handleTourClick(tour)}>
                                {tour.name}
                            </li>
                        ))}
                    </ul>
                </div>
                {selectedTour && (
                    <div className="faqSection">
                        <h2>FAQs for {selectedTour.name}</h2>
                        <ul>
                            {faqs?.map((faq, index) => (
                                <li key={index}><strong>{faq.category} - {faq.question}</strong>: {faq.answer}</li>
                            ))}
                        </ul>
                        <input
                            type="text"
                            placeholder="Enter question"
                            name="question"
                            value={newData.question}
                            onChange={handleInputChange}
                        />
                        <input
                            type="text"
                            placeholder="Enter answer"
                            name="answer"
                            value={newData.answer}
                            onChange={handleInputChange}
                        />
                        <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                            {categories.map((category, index) => (
                                <option key={index} value={category}>{category}</option>
                            ))}
                        </select>
                        <button onClick={handleAddFaq}>Add FAQ</button>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Faqs;
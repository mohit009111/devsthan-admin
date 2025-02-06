import React, { useState, useEffect } from 'react';
import './CreateCoupons.css';
import { BASE_URL } from '../../utils/headers';

const CreateCoupons = () => {
  const [couponData, setCouponData] = useState({
    code: '',
    discount: '',
    influencerEmail: '',
    applicableTours: 'all', // 'all' or 'specific'
    specificTours: [],
    comission:'' // comma-separated UUIDs for specific tours
  });
  console.log(couponData)
  const [coupons, setCoupons] = useState([]); // List of coupons
  const [loading, setLoading] = useState(false);
  const [tours, setTours] = useState([]);
  const [selectedTours, setSelectedTours] = useState([]);

  const handleOptionClick = (uuid) => {
    setSelectedTours((prevSelectedTours) => {
      const updatedSelectedTours = prevSelectedTours.includes(uuid)
        ? prevSelectedTours.filter((id) => id !== uuid)
        : [...prevSelectedTours, uuid];

      // Update specificTours field in couponData as an array
      setCouponData((prevCouponData) => ({
        ...prevCouponData,
        specificTours: updatedSelectedTours, // Keep it as an array
      }));

      return updatedSelectedTours;
    });
  };
  const selectedTourNames = tours
    .filter((tour) => selectedTours.includes(tour.uuid))
    .map((tour) => tour.name)
    .join(', ');


  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCouponData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);


    // Add the selected tours to couponData if 'specific' is chosen
    if (couponData.applicableTours === 'specific') {
      setCouponData((prevData) => ({
        ...prevData,
        specificTours: selectedTours.join(', '),
      }));
    }


    try {
      const response = await fetch(`${BASE_URL}/api/createCoupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(couponData),
      });

      if (response.ok) {
        alert('Coupon created successfully!');
        setCouponData({
          code: '',
          discount: '',
          influencerEmail: '',
          applicableTours: 'all',
          specificTours: '',
        });

        setSelectedTours([]); // Reset selected tours

        fetchCoupons(); // Refresh the list of coupons
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error creating coupon:', error);
      alert('Failed to create coupon. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch the list of coupons
  const fetchCoupons = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/getCoupons`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      } else {
        console.error('Failed to fetch coupons');
      }
    } catch (error) {
      console.error('Error fetching coupons:', error);
    } finally {
      setLoading(false);
    }
  };


  // Fetch tours
  const fetchTours = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/api/tourSelectedDetails`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setTours(data.data);
      } else {
        console.error('Failed to fetch tours');
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a coupon
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/api/deleteCoupon/${id}`, {

        method: 'DELETE',
      });

      if (response.ok) {
        alert('Coupon deleted successfully!');
        fetchCoupons(); // Refresh the list
      } else {
        alert('Failed to delete coupon.');
      }
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };


  // Fetch coupons and tours on component mount
  useEffect(() => {
    fetchCoupons();
    fetchTours();

  }, []);

  return (
    <div className="coupon-page">
      <h2>Create Coupon</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="code">Coupon Code:</label>
          <input
            type="text"
            id="code"
            name="code"
            value={couponData.code}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="discount">Discount (%):</label>
          <input
            type="number"
            id="discount"
            name="discount"
            value={couponData.discount}
            onChange={handleChange}
            required
            min="1"
            max="100"
          />
        </div>
        <div className="form-group">
          <label htmlFor="discount">Comission (%):</label>
          <input
            type="number"
            id="comission"
            name="comission"
            value={couponData.comission}
            onChange={handleChange}
            required
            min="1"
            max="100"
          />
        </div>
        <div className="form-group">
          <label htmlFor="influencerEmail">Influencer Email:</label>
          <input
            type="email"
            id="influencerEmail"
            name="influencerEmail"
            value={couponData.influencerEmail}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="applicableTours">Apply Coupon To:</label>
          <select
            id="applicableTours"
            name="applicableTours"
            value={couponData.applicableTours}

            onChange={(e) =>
              setCouponData((prev) => ({
                ...prev,
                applicableTours: e.target.value,
              }))
            }

          >
            <option value="all">All Tours</option>
            <option value="specific">Specific Tours</option>
          </select>
        </div>


        {/* Custom dropdown for selecting specific tours */}
        {couponData.applicableTours === 'specific' && (
          <div className="form-group">
            <label htmlFor="specificTours">Select Tours:</label>
            <div className="custom-dropdown">
              <input
                type="text"
                id="specificTours"
                name="specificTours"
                placeholder="Click to select tours"
                value={selectedTourNames}
                readOnly
              />
              <select multiple>
                <option disabled>Select Tours</option>
                {tours.map((tour) => (
                  <option
                    key={tour.uuid}
                    value={tour.uuid}
                    onClick={() => handleOptionClick(tour.uuid)}
                    className={selectedTours.includes(tour.uuid) ? 'selected' : ''}
                  >
                    {tour.name}
                  </option>
                ))}
              </select>
              <div>
                <h4>Selected Tours:</h4>
                <ul>
                  {tours
                    .filter((tour) => selectedTours.includes(tour.uuid))
                    .map((tour) => (
                      <li key={tour.uuid}>{tour.name}</li>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        )}


        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Coupon'}
        </button>
      </form>

      <h2>Existing Coupons</h2>
      {loading && <p>Loading coupons...</p>}
      {!loading && coupons.length === 0 && <p>No coupons found.</p>}

      {console.log(coupons
      )}
      <ul className="coupon-list">
        {coupons.map((coupon) => (

          <>
            <a href={`/admin/createCoupon/couponDetails/${coupon.code}`}>
              <li key={coupon.id} className="coupon-item">
                <p><strong>Code:</strong> {coupon.code}</p>
                <p><strong>Discount:</strong> {coupon.discount}%</p>
                <p><strong>Influencer Email:</strong> {coupon.influencerEmail}</p>
                <p><strong>Applicable Tours:</strong> {coupon.applicableTours}</p>
                <button onClick={() => handleDelete(coupon._id)} className="delete-button">
                  Delete
                </button>
              </li>
            </a>
          </>

        ))}
      </ul>
    </div>
  );
};

export default CreateCoupons;

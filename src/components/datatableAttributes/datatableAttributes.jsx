import React, { useState, useEffect } from 'react';
import './datatableAttributes.css'; // Your styling file
import { BASE_URL } from '../../utils/headers';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DatatableAttributes = () => {
  const [attributeName, setAttributeName] = useState('');
  const [subAttributeNames, setSubAttributeNames] = useState({});
  const [attributes, setAttributes] = useState([]);

  // Function to add a new attribute with sub-attributes
  const handleAddAttribute = async () => {
    if (!attributeName.trim()) {
      toast.error('Attribute name is required');
      return;
    }

    const newAttribute = {
      name: attributeName,
      subAttributes: [],
    };

    try {
      const response = await fetch(`${BASE_URL}/api/attributes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAttribute),
      });

      if (response.ok) {
        toast.success('Attribute added successfully!');
        setAttributeName(''); // Clear input field
        fetchAttributes(); // Refresh the list of attributes
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error adding attribute:', error);
      toast.error('Error adding attribute');
    }
  };

  // Function to fetch all attributes from the database
  const fetchAttributes = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/attributes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAttributes(data); // Update attributes state
      } else {
        console.error('Failed to fetch attributes');
      }
    } catch (error) {
      console.error('Error fetching attributes:', error);
    }
  };

  // Function to add a sub-attribute to an existing attribute
  const handleAddSubAttribute = async (attributeId) => {
    const subAttributeName = subAttributeNames[attributeId]; // Get the sub-attribute name for the specific attribute

    if (!subAttributeName || !subAttributeName.trim()) {
      toast.error("Sub-attribute name is required");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/attributes/${attributeId}/sub-attributes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: subAttributeName }),
      });

      if (response.ok) {
        toast.success("Sub-attribute added successfully!");
        setSubAttributeNames((prev) => ({ ...prev, [attributeId]: "" })); // Clear the input for the specific attribute
        fetchAttributes(); // Refresh the list of attributes
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding sub-attribute:", error);
      toast.error("Error adding sub-attribute");
    }
  };

  // Function to delete an attribute
  const handleDeleteAttribute = async (attributeId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/attributes/${attributeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Attribute deleted successfully!');
        fetchAttributes(); // Refresh the list of attributes
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting attribute:', error);
      toast.error('Error deleting attribute');
    }
  };

  // Function to delete a sub-attribute
  const handleDeleteSubAttribute = async (attributeId, subAttributeId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/attributes/${attributeId}/sub-attributes/${subAttributeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Sub-attribute deleted successfully!');
        fetchAttributes(); // Refresh the list of attributes
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting sub-attribute:', error);
      toast.error('Error deleting sub-attribute');
    }
  };

  // Fetch attributes when the component mounts
  useEffect(() => {
    fetchAttributes();
  }, []);

  return (
    <div className="datatableAttributes">
      {/* Add Attribute Section */}
      <div className="attribute-add-box">
        <h3>Add Attribute</h3>
        <input
          type="text"
          value={attributeName}
          onChange={(e) => setAttributeName(e.target.value)}
          placeholder="Enter attribute name"
        />
        <button onClick={handleAddAttribute}>Add Attribute</button>
      </div>

      {/* Attributes List Section */}
      <div className="attribute-list-box">
        <h3>All Attributes</h3>
        {attributes.length > 0 ? (
          <ul>
            {attributes.map((attribute) => (
              <li key={attribute._id}>
                {attribute.name}
                <button className="delete-button" onClick={() => handleDeleteAttribute(attribute._id)}>Delete Attribute</button>

                <div className="sub-attribute-add">
                  <input
                    type="text"
                    value={subAttributeNames[attribute._id] || ""} // Get the value for the specific attribute
                    onChange={(e) => setSubAttributeNames((prev) => ({ ...prev, [attribute._id]: e.target.value }))} // Update the value for the specific attribute
                    placeholder="Enter sub-attribute name"
                  />
                  <button onClick={() => handleAddSubAttribute(attribute._id)}>Add Sub-Attribute</button>
                </div>
                {/* Render sub-attributes */}
                {attribute.subAttributes.length > 0 && (
                  <ul>
                    {attribute.subAttributes.map((sub) => (
                      <li key={sub._id}>
                        {sub.name}
                        <button className="delete-button" onClick={() => handleDeleteSubAttribute(attribute._id, sub._id)}>Delete Sub-Attribute</button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No attributes found.</p>
        )}
      </div>
    </div>
  );
};

export default DatatableAttributes;

import "./datatableDestinations.css";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/headers";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress"; // Import CircularProgress

const Datatable = () => {
  const [allTours, setAllTours] = useState([]); // State for storing all tours
  const [data, setData] = useState([]); // State for the data displayed in DataGrid
  const [openDialog, setOpenDialog] = useState(false);
  const [tourIdToDelete, setTourIdToDelete] = useState(null);
  const [loading, setLoading] = useState(true); // State for loader visibility

  const fetchAllTours = async () => {
    try {
      setLoading(true); // Show loader
      const response = await fetch(`${BASE_URL}/api/getAllDestinations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      
      const mappedData = data.map((tour, index) => ({
        id: tour.uuid || index,
        name: tour.country?.label || "N/A", // Ensure fallback
        location: tour.location || "N/A",
        city: tour.city?.label || "N/A", // Safely access `label`
        state: tour.state?.label || "N/A",
        country: tour.country?.label || "N/A",
        date: tour.createdAt,
      }));
      

      setAllTours(mappedData);
      setData(mappedData);
    } catch (error) {
      console.error("Error fetching tours:", error);
    } finally {
      setLoading(false); // Hide loader after fetch or error
    }
  };

  useEffect(() => {
    fetchAllTours();
  }, []);

  const handleDeleteClick = (id) => {
    setTourIdToDelete(id);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setTourIdToDelete(null);
  };

  const handleConfirmDelete = async () => {
    try {
      await fetch(`${BASE_URL}/api/deleteDestinationById/${tourIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      fetchAllTours();
    } catch (error) {
      console.error('Error deleting tour:', error);
    } finally {
      setOpenDialog(false);
      setTourIdToDelete(null);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <Link to={`/admin/editDestination/${params.row.id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">Edit</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDeleteClick(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  const tourColumns = [
    { field: "location", headerName: "Location", width: 350 },
    { field: "city", headerName: "City Name", width: 150 }, // Correct field
    { field: "state", headerName: "State Name", width: 120 },
    { field: "country", headerName: "Country Name", width: 160 },
  ];
  

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New Tour
        <Link to="/admin/destinations/new" className="link">
          Add New
        </Link>
      </div>

      {/* Loader */}
      {loading ? (
        <div className="loader">
          <CircularProgress size={50} color="primary" />
        </div>
      ) : (
        <DataGrid
          className="datagrid"
          rows={data}
          columns={tourColumns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
        />
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this tour?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Datatable;

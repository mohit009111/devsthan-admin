import "./datatable.css";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { BASE_URL } from "../../utils/headers";

const Datatable = () => {
  const [allTours, setAllTours] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [tourIdToDelete, setTourIdToDelete] = useState(null);

  const fetchAllTours = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/allTours`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      const mappedData = data.map((tour, index) => ({
        id: tour.uuid || index,
        name: tour.name,
        location: tour.location,
        price: tour.standardDetails?.price || 0, // Default to 0 if no price
        date: new Date(tour.createdAt).toLocaleDateString(), // Format date
      }));

      setAllTours(mappedData);
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };

  useEffect(() => {
    fetchAllTours();
  }, []);

  const handleDeleteClick = (id) => {
    setTourIdToDelete(id); // Set the tour ID to be deleted
    setOpenDialog(true); // Open the confirmation dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
  };

  const handleConfirmDelete = async () => {
    try {
      // Call delete API
      await fetch(`${BASE_URL}/api/deleteTour/${tourIdToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Fetch all tours again to update the list
      fetchAllTours();
    } catch (error) {
      console.error("Error deleting tour:", error);
    } finally {
      setOpenDialog(false); // Close the dialog
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        const { id } = params.row; // Get the current row's id
        return (
          <div className="cellAction">
            <Link to={`/admin/editTour/${id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">Edit</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDeleteClick(id)} // Pass the ID of the tour to delete
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  const tourColumns = [
    { field: "name", headerName: "Tour Name", width: 200 },
    { field: "location", headerName: "Location", width: 150 },
    { field: "price", headerName: "Price", width: 120 },
    { field: "date", headerName: "Date", width: 160 },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New Tour
        <Link to="/admin/tours/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={allTours}
        columns={tourColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
      {/* Confirmation Dialog */}
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

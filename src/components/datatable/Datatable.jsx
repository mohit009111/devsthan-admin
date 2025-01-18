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
  CircularProgress, // Importing the CircularProgress component
} from "@mui/material";
import { BASE_URL } from "../../utils/headers";

const Datatable = () => {
  const [allTours, setAllTours] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [tourIdToDelete, setTourIdToDelete] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  const fetchAllTours = async () => {
    setLoading(true); // Start loading
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
        price: tour.standardDetails?.price || 0,
        date: new Date(tour.createdAt).toLocaleDateString(),
      }));

      setAllTours(mappedData);
    } catch (error) {
      console.error("Error fetching tours:", error);
    } finally {
      setLoading(false); // Stop loading after data is fetched
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
  };

  const handleConfirmDelete = async () => {
    try {
      await fetch(`${BASE_URL}/api/deleteTour/${tourIdToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      fetchAllTours(); // Refresh data after delete
    } catch (error) {
      console.error("Error deleting tour:", error);
    } finally {
      setOpenDialog(false);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        const { id } = params.row;
        return (
          <div className="cellAction">
            <Link to={`/admin/editTour/${id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">Edit</div>
            </Link>
            <div className="deleteButton" onClick={() => handleDeleteClick(id)}>
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
      {loading ? ( // Conditional rendering for the loader
        <div className="loader">
          <CircularProgress />
        </div>
      ) : (
        <DataGrid
          className="datagrid"
          rows={allTours}
          columns={tourColumns.concat(actionColumn)}
          pageSize={9}
          rowsPerPageOptions={[9]}
          checkboxSelection
        />
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this tour?</DialogContentText>
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

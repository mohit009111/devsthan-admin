import "./datatableAboutus.css";
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

const Datatable = () => {
  const [allTours, setAllTours] = useState([]);
  const [data, setData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [tourIdToDelete, setTourIdToDelete] = useState(null);

  const fetchAllTours = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/getAllDestinations`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      const mappedData = data.map((tour, index) => ({
        id: tour.uuid || index,
        name: tour.country.label,
        location: tour.state.label,
        // price: tour.standardDetails.price,
        date: tour.createdAt,
      }));

      setAllTours(mappedData);
      setData(mappedData);
    } catch (error) {
      console.error("Error fetching tours:", error);
    }
  };
console.log(allTours)
  useEffect(() => {
    fetchAllTours();
  }, []);

  const handleDeleteClick = () => {
  
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close the dialog
  };

  const handleConfirmDelete = async () => {
    try {
      // Call delete API
      await fetch(`${BASE_URL}/api/deleteTour/${allTours[0].id}`, {
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
      renderCell: () => {
        return (
          <div className="cellAction">
            <Link to={`/editTour/${allTours[0].id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">Edit</div>
            </Link>
            <div
              className="deleteButton"
              onClick={() => handleDeleteClick()} // Pass the ID of the tour to delete
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  const tourColumns = [
    { field: "location", headerName: "Location", width: 200 },
    { field: "City Name", headerName: "City Name", width: 150 },
    { field: "State Name", headerName: "State Name", width: 120 },
    { field: "Country Name", headerName: "Country Name", width: 160 },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New Tour
        <Link to="/admin/about-us/new" className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={data}
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

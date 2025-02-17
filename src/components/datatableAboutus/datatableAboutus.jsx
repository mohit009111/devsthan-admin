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
      const response = await fetch(`${BASE_URL}/api/getAllWhyChoose`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseData = await response.json();
      const tours = Array.isArray(responseData.data) ? responseData.data : [];

      const mappedData = tours.map((tour, index) => ({
        id: tour.uuid || index,
        title: tour.title,
      }));

      setAllTours(mappedData);
      setData(mappedData);
    } catch (error) {
      console.error("Error fetching tours:", error);
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
    if (!tourIdToDelete) return;

    try {
      await fetch(`${BASE_URL}/api/deleteTour/${tourIdToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      fetchAllTours();
    } catch (error) {
      console.error("Error deleting tour:", error);
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
            <Link to={`/admin/about-us/edit/${params.row.id}`} style={{ textDecoration: "none" }}>
              <div className="viewButton">Edit</div>
            </Link>
            <div className="deleteButton" onClick={() => handleDeleteClick(params.row.id)}>
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  const tourColumns = [{ field: "title", headerName: "Title", width: 350 }];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New Why Choose
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

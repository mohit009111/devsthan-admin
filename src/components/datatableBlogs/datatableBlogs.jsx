import "./datatableBlogs.css";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BASE_URL } from "../../utils/headers";
import { toast } from "react-hot-toast";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
} from "@mui/material";

const Datatable = () => {
  const [allTours, setAllTours] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [tourIdToDelete, setTourIdToDelete] = useState(null);
  const [loading, setLoading] = useState(false); // Loading state for data fetch

  // Function to fetch all tours (blogs)
  const fetchAllTours = async () => {
    setLoading(true); // Start loader while fetching data
    try {
      const response = await fetch(`${BASE_URL}/api/getAllBlogs`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.data) {
        const mappedData = data.data.map((tour) => ({
          id: tour.uuid,
          name: tour.title,
          city: tour.city || "N/A",
          state: tour.state || "N/A",
          country: tour.country || "N/A",
          date: new Date(tour.createdAt).toLocaleDateString(),
        }));
        setAllTours(mappedData);
      }
    } catch (error) {
      console.error("Error fetching tours:", error);
      toast.error("Error fetching data!"); // Show toast for errors
    } finally {
      setLoading(false); // Stop loader once data is fetched
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
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/api/deleteBlog/${tourIdToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success("Blog deleted successfully!");
        fetchAllTours();
      } else {
        toast.error("Error deleting blog!");
      }
    } catch (error) {
      toast.error("Error deleting blog!");
      console.error("Error deleting tour:", error);
    } finally {
      setOpenDialog(false);
      setTourIdToDelete(null);
      setLoading(false);
    }
  };

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <div className="cellAction">
          <Link to={`/admin/editBlog/${params.row.id}`} style={{ textDecoration: "none" }}>
            <div className="viewButton">Edit</div>
          </Link>
          <div className="deleteButton" onClick={() => handleDeleteClick(params.row.id)}>
            Delete
          </div>
        </div>
      ),
    },
  ];

  const tourColumns = [
    { field: "name", headerName: "Title", width: 350 },
   
    { field: "date", headerName: "Date Created", width: 180 },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Add New Blog
        <Link to="/admin/blogs/new" className="link">
          Add New
        </Link>
      </div>
      {loading ? ( // Show loader while fetching data
        <div className="loader-container">
          <CircularProgress />
        </div>
      ) : (
        <DataGrid
          rows={allTours}
          columns={tourColumns.concat(actionColumn)}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
        />
      )}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this blog? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="error">
            {loading ? <CircularProgress size={24} color="inherit" /> : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Datatable;

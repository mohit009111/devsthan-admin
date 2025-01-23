import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import CategoryList from "./pages/CategoryList/CategoryList";
import AttributesList from "./pages/attributesList/attributesList";
import DestinationsList from "./pages/destinationsList/destinationsList";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import NewDestination from "./pages/newDestination/newDestination";
import CreateCoupon from "./pages/coupon/index";
import CouponDetails from "./pages/couponDetails/couponDetails";
import CustomizedQueries from "./pages/customizedQueries/customizedQueries";
import Orders from "./pages/orders/orders";
import NewAboutUs from "./pages/about-us/aboutUs";
import Aboutus from "./pages/about-us/aboutUs";
import NewBlog from "./pages/newBlog/newBlog";
import ContactsList from "./pages/contacts/contactsList";
import BlogsList from "./pages/blogs/blogsList";
import InquiriesList from './pages/inquiries/inquiryList'
import AddBanners from './pages/addBanners/addBanners'
import EditTour from "./pages/edit/EditTour";
import EditDestination from "./pages/editDestination/editDestination";
import EditBlog from "./pages/editBlog/editBlog";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { ToastContainer } from 'react-toastify';
import { Toaster } from 'react-hot-toast';
function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <ToastContainer />
      <Toaster />
      <BrowserRouter>
        <Routes>

          <Route path="/admin" element={<Navigate to="/admin/login" />} />


          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/home" element={<Home />} />
          <Route path="/admin/category">
            <Route index element={<CategoryList />} />



          </Route>
          <Route path="/admin/attributes">
            <Route index element={<AttributesList />} />



          </Route>




          <Route path="/admin/createCoupon">
            <Route index element={<CreateCoupon />} />



          </Route>
          <Route path="/admin/createCoupon/couponDetails/:id">
            <Route index element={<CouponDetails />} />



          </Route>

          <Route path="/admin/contacts">
            <Route index element={<ContactsList />} />



          </Route>
          <Route path="/admin/inquiries">
            <Route index element={<InquiriesList />} />



          </Route>
         
          <Route path="/admin/blogs">
            <Route index element={<BlogsList />} />
            <Route path=":userId" element={<Single />} />
            <Route
              path="new"
              element={<NewBlog title="Add New Blog" />}
            />
            {/* <Route
              path="editBlog/:id"
              element={<EditBlog title="Add New Blog" />}
            /> */}

          </Route>
          <Route path="/admin/tours">
            <Route index element={<List />} />
            <Route path=":userId" element={<Single />} />
            <Route
              path="new"
              element={<New title="Add New Tour" />}
            />

          </Route>
          <Route path="/admin/destinations">
            <Route index element={<DestinationsList />} />
            <Route path=":userId" element={<Single />} />
            <Route
              path="new"
              element={<NewDestination title="Add New Destination" />}
            />

          </Route>

          <Route path="/admin/about-us">
            <Route index element={<Aboutus />} />
            <Route path=":userId" element={<Single />} />
            <Route
              path="new"
              element={<NewAboutUs title="Add New about" />}
            />

          </Route>

          <Route path="/admin/customizedQueries">
            <Route index element={<CustomizedQueries />} />
          
          </Route>
          <Route path="/admin/orders">
            <Route index element={<Orders />} />
          
          </Route>
          <Route path="/admin/editDestination/:id"
            element={<EditDestination title="Edit Tour" />}
          >

          </Route>

              <Route path="/admin/editBlog/:id"
            element={<EditBlog title="Edit Tour" />}
          ></Route>

          <Route path="/admin/banners">
            <Route index element={<AddBanners />} />
           

          </Route>


          <Route path="/admin/editTour/:id"
            element={<EditTour title="Edit Tour" />}
          >
            
               


          </Route>
          <Route path="/admin/products">
            <Route index element={<List />} />
            <Route path=":productId" element={<Single />} />
            <Route
              path="new"
              element={<New inputs={productInputs} title="Add New Product" />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

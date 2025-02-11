import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import FixedTours from "./pages/fixedTours/fixedTours";
import CategoryList from "./pages/CategoryList/CategoryList";
import AttributesList from "./pages/attributesList/attributesList";
import DestinationsList from "./pages/destinationsList/destinationsList";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import NewDestination from "./pages/newDestination/newDestination";
import CreateCoupon from "./pages/coupon/index";
import NewFixedTour from './pages/newFixedTour/newFixedTour'
import EditFixedTour from './pages/editFixedTours/editFixedTours'
import CouponDetails from "./pages/couponDetails/couponDetails";

import CustomizedQueries from "./pages/customizedQueries/customizedQueries";
import Orders from "./pages/orders/orders";
import NewAboutUs from "./pages/about-us/aboutUs";
import Aboutus from "./pages/about-us/aboutUs";
import NewBlog from "./pages/newBlog/newBlog";
import ContactsList from "./pages/contacts/contactsList";
import BlogsList from "./pages/blogs/blogsList";

import InquiriesList from "./pages/inquiries/inquiryList";
import AddBanners from "./pages/addBanners/addBanners";

import EditTour from "./pages/edit/EditTour";
import EditDestination from "./pages/editDestination/editDestination";
import EditBlog from "./pages/editBlog/editBlog";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";

import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <ToastContainer />
      <Toaster />
      <BrowserRouter>
        <Routes>

          <Route
            path="/"
            element={
              <Navigate
                to={
                  localStorage.getItem("userToken")
                    ? "/admin/home"
                    : "/admin/login"
                }
              />
            }
          />

          <Route path="/admin" element={<Navigate to="/admin/login" />} />

          <Route path="/admin/login" element={<Login />} />
          <Route
            path="/admin/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />

          <Route path="/admin/category">
            <Route
              index
              element={
                <ProtectedRoute>
                  <CategoryList />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/admin/attributes">
            <Route
              index
              element={
                <ProtectedRoute>
                  <AttributesList />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/admin/createCoupon">
            <Route
              index
              element={
                <ProtectedRoute>
                  <CreateCoupon />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/admin/contacts">
            <Route
              index
              element={
                <ProtectedRoute>
                  <ContactsList />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/admin/inquiries">
            <Route
              index
              element={
                <ProtectedRoute>
                  <InquiriesList />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/admin/blogs">
            <Route
              index
              element={
                <ProtectedRoute>
                  <BlogsList />
                </ProtectedRoute>
              }
            />
            <Route
              path=":userId"
              element={
                <ProtectedRoute>
                  <Single />
                </ProtectedRoute>
              }
            />
            <Route
              path="new"
              element={
                <ProtectedRoute>
                  <NewBlog title="Add New Blog" />
                </ProtectedRoute>
              }
          >
          </Route>
          </Route>
          <Route path="/admin/createCoupon/couponDetails/:id">
            <Route index element={ <ProtectedRoute>
              <CouponDetails />
            </ProtectedRoute>} />
          </Route>
          <Route path="/admin/tours">
            <Route
              index
              element={
                <ProtectedRoute>
                  <List />
                </ProtectedRoute>
              }
            />
            
            <Route
              path=":userId"
              element={
                <ProtectedRoute>
                  <Single />
                </ProtectedRoute>
              }
            />
            <Route
              path="new"
              element={
                <ProtectedRoute>
                  <New title="Add New Tour" />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/admin/fixedTours">
            <Route
              index
              element={
                <ProtectedRoute>
                  <FixedTours />
                </ProtectedRoute>
              }
            />
            
          
            <Route
              path="new"
              element={
                <ProtectedRoute>
                  <NewFixedTour title="Add New Tour" />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/admin/destinations">
            <Route
              index
              element={
                <ProtectedRoute>
                  <DestinationsList />
                </ProtectedRoute>
              }
            />
            <Route
              path=":userId"
              element={
                <ProtectedRoute>
                  <Single />
                </ProtectedRoute>
              }
            />
            <Route
              path="new"
              element={
                <ProtectedRoute>
                  <NewDestination title="Add New Destination" />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="/admin/about-us">
            <Route
              index
              element={
                <ProtectedRoute>
                  <Aboutus />
                </ProtectedRoute>
              }
            />
            <Route
              path=":userId"
              element={
                <ProtectedRoute>
                  <Single />
                </ProtectedRoute>
              }
            />
            <Route
              path="new"
              element={
                <ProtectedRoute>
                  <NewAboutUs title="Add New about" />
                </ProtectedRoute>
              }
            />
          </Route>
          

          

          <Route path="/admin/customizedQueries">
            <Route
              index
              element={
                <ProtectedRoute>
                  <CustomizedQueries />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/admin/orders">
            <Route
              index
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="/admin/editDestination/:id"
            element={
              <ProtectedRoute>
                <EditDestination title="Edit Tour" />
              </ProtectedRoute>
            }
          ></Route>

          <Route
            path="/admin/editBlog/:id"
            element={
              <ProtectedRoute>
                <EditBlog title="Edit Tour" />
              </ProtectedRoute>
            }
          ></Route>

          <Route path="/admin/banners">
            <Route
              index
              element={
                <ProtectedRoute>
                  <AddBanners />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="/admin/editfixedTour/:id"
              element={
                <ProtectedRoute>
                  <EditFixedTour />
                </ProtectedRoute>
              }>
              
            </Route>
          <Route
            path="/admin/editTour/:id"
            element={
              <ProtectedRoute>
                <EditTour title="Edit Tour" />
              </ProtectedRoute>
            }
          ></Route>
          <Route path="/admin/products">
            <Route
              index
              element={
                <ProtectedRoute>
                  <List />
                </ProtectedRoute>
              }
            />
            <Route
              path=":productId"
              element={
                <ProtectedRoute>
                  <Single />
                </ProtectedRoute>
              }
            />
            <Route
              path="new"
              element={
                <ProtectedRoute>
                  <New inputs={productInputs} title="Add New Product" />
                </ProtectedRoute>
              }

            />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;



import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import List from "./pages/list/List";
import CategoryList from "./pages/CategoryList/CategoryList";
import AttributesList from "./pages/attributesList/attributesList";
import DestinationsList from "./pages/destinationsList/destinationsList";
import Single from "./pages/single/Single";
import New from "./pages/new/New";
import NewDestination from "./pages/newDestination/newDestination";
import EditTour from "./pages/new/New";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { productInputs, userInputs } from "./formSource";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import { ToastContainer } from 'react-toastify';

function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <ToastContainer />
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
          <Route path="/admin/destinations">
            <Route index element={<DestinationsList />} />



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
            <Route index element={<List />} />
            <Route path=":userId" element={<Single />} />
            <Route
              path="new"
              element={<NewDestination title="Add New Destination" />}
            />

          </Route>
          <Route path="/admin/editTour/:id"
            element={<EditTour title="Add New Tour" />}
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

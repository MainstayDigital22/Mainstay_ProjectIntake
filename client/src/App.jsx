import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Protected, Header } from "./components";
import {
  Review,
  Login,
  Create,
  Page403,
  Home,
  Details,
  Users,
  SignUp,
} from "./pages";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/403" element={<Page403 />} />
        <Route
          path="/review"
          element={
            <Protected perms={["admin"]}>
              <Header />
              <Review />
            </Protected>
          }
        />
        <Route
          path="/review/:id"
          element={
            <Protected perms={["admin"]}>
              <Header />
              <Details />
            </Protected>
          }
        />
        <Route
          path="/create"
          element={
            <Protected perms={["admin", "staff", "user"]}>
              <Header />
              <Create />
            </Protected>
          }
        />
        <Route
          path="/users"
          element={
            <Protected perms={["admin"]}>
              <Header />
              <Users />
            </Protected>
          }
        />
        <Route
          path="/"
          element={
            <Protected perms={["admin", "staff", "user"]}>
              <Header />
              <Home />
            </Protected>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;

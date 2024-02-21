import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { Header, Protected } from "./components";
import {
  Details,
  Home,
  Login,
  OnBoard,
  Page403,
  Review,
  SignUp,
  Ticket,
  Users,
} from "./pages";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/403" element={<Page403 />} />
        <Route
          path="/review"
          element={
            <Protected perms={["admin","staff","client"]}>
              <Header />
              <Review />
            </Protected>
          }
        />
        <Route
          path="/review/:id"
          element={
            <Protected perms={["admin","staff","client"]}>
              <Header />
              <Details />
            </Protected>
          }
        />
        <Route
          path="/new-ticket"
          element={
            <Protected perms={["admin", "staff", "client"]}>
              <Header />
              <Ticket />
            </Protected>
          }
        />
        <Route
          path="/edit/:id"
          element={
            <Protected perms={["admin", "staff", "client"]}>
              <Header />
              <Ticket />
            </Protected>
          }
        />
        <Route
          path="/onboard"
          element={
            <Protected perms={["admin", "staff", "client"]}>
              <Header />
              <OnBoard />
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
            <Protected perms={["admin", "staff", "client"]}>
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

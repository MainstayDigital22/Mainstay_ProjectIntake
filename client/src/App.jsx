import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { Protected, Header } from "./components";
import { Review, Login, Create, Page403, Home, Details, Users } from "./pages";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/403" element={<Page403 />} />
        <Route
          path="/review"
          element={
            <Protected minauth={2}>
              <Header />
              <Review />
            </Protected>
          }
        />
        <Route
          path="/review/:id"
          element={
            <Protected minauth={2}>
              <Header />
              <Details />
            </Protected>
          }
        />
        <Route
          path="/create"
          element={
            <Protected minauth={2}>
              <Header />
              <Create />
            </Protected>
          }
        />
        <Route
          path="/users"
          element={
            <Protected minauth={0}>
              <Header />
              <Users />
            </Protected>
          }
        />
        <Route
          path="/"
          element={
            <Protected minauth={3}>
              <Header />
              <Home />
            </Protected>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;

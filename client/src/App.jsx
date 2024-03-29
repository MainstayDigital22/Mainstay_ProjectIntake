import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import { HeaderWrapper, Protected } from "./components";
import {
  Home,
  Login,
  OnBoard,
  Orgs,
  Page403,
  Review,
  SignUp,
  Ticket,
  Users,
} from "./pages";
import Details from "./pages/details";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/403" element={<Page403 />} />
        {[
          "/",
          "/review",
          "/review/:id",
          "/new-ticket",
          "/edit/:id",
          "/onboard",
          "/users",
          "/orgs",
        ].map((path, index) => (
          <Route
            key={index}
            path={path}
            element={
              <HeaderWrapper>
                {path === "/" && (
                  <Protected perms={["admin", "staff", "client"]}>
                    <Home />
                  </Protected>
                )}
                {path === "/review" && (
                  <Protected perms={["admin", "staff", "client"]}>
                    <Review />
                  </Protected>
                )}
                {path.startsWith("/review") && path !== "/review" && (
                  <Protected perms={["admin", "staff", "client"]}>
                    <Details />
                  </Protected>
                )}
                {path === "/new-ticket" && (
                  <Protected perms={["admin", "staff", "client"]}>
                    <Ticket />
                  </Protected>
                )}
                {path.startsWith("/edit") && (
                  <Protected perms={["admin", "staff", "client"]}>
                    <Ticket />
                  </Protected>
                )}
                {path === "/onboard" && (
                  <Protected perms={["admin", "staff", "client"]}>
                    <OnBoard />
                  </Protected>
                )}
                {path === "/users" && (
                  <Protected perms={["admin"]}>
                    <Users />
                  </Protected>
                )}
                {path === "/orgs" && (
                  <Protected perms={["admin"]}>
                    <Orgs />
                  </Protected>
                )}
              </HeaderWrapper>
            }
          />
        ))}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
};

export default App;

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Protected, HeaderWrapper } from "./components";
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
        {[
          "/",
          "/review",
          "/review/:id",
          "/new-ticket",
          "/edit/:id",
          "/onboard",
          "/users",
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
                {path.startsWith("/review") && (
                  <Protected perms={["admin", "staff", "client"]}>
                    <Review />
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

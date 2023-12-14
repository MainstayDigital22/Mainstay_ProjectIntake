import React, { Component } from "react";
import { getAuthLevel } from "../components/auth";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { HOST } from "../const";
import { getAuthUser, getAuthToken } from "../components/auth";

class Header extends Component {
  logout = () => {
    localStorage.removeItem("user");
    window.location.replace("/login");
  };
  componentDidMount() {
    let isPaused = false;
    this.interval = setInterval(() => {
      const storage = JSON.parse(localStorage.getItem("user"));
      let expireTime = jwt_decode(storage.token).exp;
      //console.log(expireTime)
      //console.log(Date.now())
      if (expireTime * 1000 < Date.now()) {
        this.logout();
        isPaused = true;
      }
      if (!isPaused) {
        if (expireTime * 1000 < Date.now() + 5 * 60000) {
          isPaused = true;
          if (
            confirm(`The Session will expire in 5 minutes,\nContinue session?`)
          ) {
            axios.post(
              `http://${HOST}:8080/user/refresh`,
              {
                username: getAuthUser(),
              },
              { headers: { Authorization: `Bearer ${getAuthToken()}` } }
            );
          } else {
            this.logout();
          }
        }
      }
    }, 1000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    return (
      <header id="myHeader" className="navbar bg-white position-sticky">
        <div className="container">
          <div className="row w-100-nav ">
            <div className="">
              <div className="navbar-item">
                <div>
                  <div
                    className="dropdown-custom  btn"
                    onClick={() => window.open(`/`, "_self")}>
                    Home
                  </div>
                  <div
                    className="dropdown-custom  btn"
                    onClick={() => window.open(`/review`, "_self")}>
                    Review
                  </div>
                  <div
                    className="dropdown-custom  btn"
                    onClick={() => window.open(`/create`, "_self")}>
                    Create
                  </div>
                  {getAuthLevel() == 0 ? (
                    <div
                      className="dropdown-custom  btn"
                      onClick={() => window.open(`/users`, "_self")}>
                      Users
                    </div>
                  ) : (
                    <></>
                  )}
                  <div className="dropdown-custom  btn" onClick={this.logout}>
                    Logout
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }
}
export default Header;

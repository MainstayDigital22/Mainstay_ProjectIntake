import React, { Component } from "react";
import { textLogo, homeIcon } from "../assets";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { getAuthLevel, getAuthToken, getAuthUser } from "../components/auth";
import { HOST } from "../const";

const navLinks = [
  { href: "/", text: "Home", icon: homeIcon },
  { href: "/review", text: "Review", icon: homeIcon },
  { href: "/onboard", text: "Onboard", icon: homeIcon },
  { href: "/new-ticket", text: "New Ticket", icon: homeIcon },
  ...(getAuthLevel() === "admin"
    ? [{ href: "/users", text: "Users", icon: homeIcon }]
    : []),
];

const navLinks2 = [];

class HeaderWrapper extends Component {
  logout = () => {
    localStorage.removeItem("user");
    window.location.replace("/login");
  };

  componentDidMount() {
    const ignoredPaths = ["/403", "/login", "/signup"];
    if (ignoredPaths.includes(window.location.pathname)) {
      return;
    }
    let isPaused = false;
    this.interval = setInterval(() => {
      const storage = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user"))
        : null;
      if (storage) {
        let expireTime = jwt_decode(storage.token).exp;
        if (expireTime * 1000 < Date.now()) {
          this.logout();
          isPaused = true;
        }
        if (!isPaused && expireTime * 1000 < Date.now() + 5 * 60000) {
          isPaused = true;
          if (
            window.confirm(
              `The Session will expire in 5 minutes,\nContinue session?`
            )
          ) {
            axios
              .post(
                `${HOST}:8080/user/refresh`,
                { username: getAuthUser() },
                { headers: { Authorization: `Bearer ${getAuthToken()}` } }
              )
              .then((res) => {
                const user = JSON.stringify(res.data);
                localStorage.setItem("user", user);
              })
              .catch((error) => {
                console.error("Session refresh failed:", error);
                //this.logout();
              });
          } else {
            //this.logout();
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
      <div className="row">
        <div id="myHeader" className="col nav-container">
          <div className="vertical-header">
            <div className="vertical-flex">
              <img src={textLogo} alt="Text Logo"></img>
              <div className="navmenu">
                <h4>Dashboard</h4>
                <div className="navlinks">
                  {navLinks.map((link, index) => (
                    <a key={index} href={link.href}>
                      <div className="row">
                        {link.icon && (
                          <div className="icon">
                            <img src={link.icon} alt={`${link.text} Icon`} />
                          </div>
                        )}
                        <p className="col">{link.text}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              <div className="navmenu">
                <h4>Account</h4>
                <div className="navlinks">
                  {navLinks2.map((link, index) => (
                    <a key={index} href={link.href}>
                      <div className="row">
                        {link.icon && (
                          <div className="icon">
                            <img src={link.icon} alt={`${link.text} Icon`} />
                          </div>
                        )}
                        <p className="col">{link.text}</p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
              <div className="navmenu navend">
                <div className="navlinks">
                  <div onClick={this.logout} className="row">
                    <div className="icon">
                      <img src={homeIcon} />
                    </div>
                    <p className="col">Logout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col container">{this.props.children}</div>
      </div>
    );
  }
}

export default HeaderWrapper;

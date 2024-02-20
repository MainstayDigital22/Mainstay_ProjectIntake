import axios from "axios";
import React, { Component } from "react";
import { useParams } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { getAuthLevel, getAuthToken, getAuthUser } from "../components/auth";
import { HOST } from "../const";
function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}

const GlobalStyles = createGlobalStyle`
  header#myHeader.navbar.white {
    background: #fff;
    border-bottom: solid 1px #dddddd;
  }
  @media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #111;
    }
    .item-dropdown .dropdown a{
      color: #111 !important;
    }
  }
`;

class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ticket: undefined,
      id: "",
      actionLock: false,
    };
  }
  async fetchData(id) {
    this.setState({
      id: id,
    });
    await axios
      .get(`http://${HOST}:8080/ticket/${id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then((res) => {
        this.setState({
          ticket: res.data,
        });
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  }
  componentDidMount() {
    const { id } = this.props.params;
    this.fetchData(id);
  }
  archive = () => {
    if (this.state.actionLock) {
      return;
    }
    this.setState({
      actionLock: true,
    });
    axios
      .post(
        `http://${HOST}:8080/ticket/update/${this.state.id}`,
        { status: 'archived'},
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      )
      .then((res) => {
        console.log(res);
        window.location.reload(false);
        alert("Ticket Archived!");
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };
  open = () => {
    if (this.state.actionLock) {
      return;
    }
    this.setState({
      actionLock: true,
    });
    axios
      .post(
        `http://${HOST}:8080/ticket/update/${this.state.id}`,
        { status: 'open'},
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      )
      .then((res) => {
        console.log(res);
        window.location.reload(false);
        alert("Ticket Reopened!");
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };
  close = () => {
    if (this.state.actionLock) {
      return;
    }
    this.setState({
      actionLock: true,
    });
    axios
      .post(
        `http://${HOST}:8080/ticket/update/${this.state.id}`,
        { status: 'close'},
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      )
      .then((res) => {
        console.log(res);
        window.location.reload(false);
        alert("Ticket Closed!");
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };
  delete = () => {
    if (this.state.actionLock) {
      return;
    }
    this.setState({
      actionLock: true,
    });
    axios
      .delete(`http://${HOST}:8080/ticket/${this.state.id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then((res) => {
        console.log(res);
        window.location.replace("/review");
        alert("Ticket Deleted!");
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  };
  edit = () => {
    window.location.replace(`/edit/${this.state.id}`);
  };
  render() {
    return (
      <div>
        
        <GlobalStyles />
        {this.state.ticket ? (
          <>
            {this.state.ticket[0].username === getAuthUser() || getAuthLevel() <= 1 ? (
              <div className="container">
                <div className="row mt-md-5 pt-md-4">
                  <ul>
                    {Object.keys(this.state.ticket[0]).map((key) => {
                      if (this.state.ticket[0][key] && typeof this.state.ticket[0][key] === 'object' && !Array.isArray(this.state.ticket[0][key])) {
                        // For nested objects like branding, hosting, etc.
                        return (
                          <li key={key}>
                            <strong>{key}:</strong>
                            <ul>
                              {Object.keys(this.state.ticket[0][key]).map(subKey => {
                                if (this.state.ticket[0][key][subKey]) {
                                  return <li key={subKey}><strong>{subKey}:</strong> {JSON.stringify(this.state.ticket[0][key][subKey])}</li>;
                                }
                                return null;
                              })}
                            </ul>
                          </li>
                        );
                      } else if (this.state.ticket[0][key]) {
                        // For simple fields
                        return <li key={key}><strong>{key}:</strong> {this.state.ticket[0][key]}</li>;
                      }
                      return null;
                    })}
                  </ul>
                </div>
                <div className="row">
                        {['admin','staff'].includes(getAuthLevel()) ? (
                          <>
                            {this.state.ticket[0].status != 'open' ? (
                              <input
                                type="button"
                                id="submit"
                                onClick={this.open}
                                className="btn-main col m-1"
                                value="Reopen"
                              />
                            ) : (
                              <></>
                            )}
                            {this.state.ticket[0].status != 'close' ? (
                              <input
                                type="button"
                                id="submit"
                                onClick={this.close}
                                className="btn-main col m-1"
                                value="Close"
                              />
                            ) : (
                              <></>
                            )}
                            {this.state.ticket[0].status != 'archived' ? (
                              <input
                                type="button"
                                id="submit"
                                onClick={this.archive}
                                className="btn-main col m-1"
                                value="Archive"
                              />
                            ) : (
                              <></>
                            )}
                          </>
                        ) : (
                          <></>
                        )}
                        <input
                          type="button"
                          id="submit"
                          onClick={this.edit}
                          className="btn-main col m-1"
                          value="Edit"
                        />
                        {getAuthLevel() == 'admin' ? (
                          <input
                            type="button"
                            id="submit"
                            onClick={this.delete}
                            className="btn-main col m-1"
                            value="Delete"
                          />
                        ) : (
                          <></>
                        )}
                      </div>
              </div>
            ) : (
              <h2>Access Denied</h2>
            )}
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    );
    
  }
}

export default withParams(Details);

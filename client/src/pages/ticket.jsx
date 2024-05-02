import axios from "axios";
import React, { Component } from "react";
import { useParams } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { getAuthId, getAuthToken, getAuthUser } from "../components/auth";
import { HOST } from "../const";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}
class Ticket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actionLock: false,
      errors: {},
      deadline: new Date(),
      category: 1,
      priority: "medium",
      org: "select",
      orgs: [],
      categories: [],
      companyUrls: [],
    };
  }
  validateForm = () => {
    const errors = {};
    const requiredFields = ["title"]; // List of required field names
    requiredFields.forEach((fieldName) => {
      if (!this.state[fieldName] || this.state[fieldName].trim() === "") {
        errors[fieldName] = `${fieldName} cannot be empty`; // Customize the error message as needed
      }
    });

    this.setState({ errors });
    console.log(errors);
    return Object.keys(errors).length === 0; // Form is valid if there are no errors
  };
  handleDateChange = (date) => {
    this.setState({
      deadline: new Date(date),
    });
  };
  handleChangeOrg = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
    const categories =
      this.state.orgs.find((item) => item._id === value).categories || [];
    const companyUrls =
      this.state.orgs.find((item) => item._id === value).companyWebsite || [];
    const domainURL = this.state.domainURL || companyUrls[0] || undefined;
    this.setState({ categories, companyUrls, domainURL });
  };
  handleChange = (event) => {
    const { name, value } = event.target;
    const nameParts = name.split(".");
    if (nameParts.length > 1) {
      this.setState((prevState) => {
        let updatedState = { ...prevState };
        let currentPart = updatedState;

        for (let i = 0; i < nameParts.length - 1; i++) {
          if (!currentPart[nameParts[i]]) {
            currentPart[nameParts[i]] = {};
          }
          currentPart = currentPart[nameParts[i]];
        }
        currentPart[nameParts[nameParts.length - 1]] = value;

        return updatedState;
      });
    } else {
      this.setState({ [name]: value });
    }
  };

  componentDidMount() {
    this.fetchOrgs();
    const { id } = this.props.params;
    if (id) {
      this.fetchData(id);
    }
  }

  async fetchOrgs() {
    axios
      .get(`${HOST}/organization/userorgs/${getAuthId()}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then((res) => {
        this.setState({ orgs: res.data, domainURL: undefined });
      });
  }

  async fetchData(id) {
    this.setState({
      id: id,
    });
    await axios
      .get(`${HOST}/ticket/${id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then((res) => {
        console.log(res.data[0]);
        this.setState((prevState) => ({
          ...prevState,
          ...res.data[0],
        }));
        this.setState({
          org: res.data[0].organization._id,
        });
        const categories = res.data[0].organization.categories || [];
        const companyUrls = res.data[0].organization.companyWebsite || [];
        this.setState({ categories, companyUrls });
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  }

  submit = () => {
    if (this.state.actionLock) {
      return;
    }
    if (this.state.orgs.length == 0) {
      alert("You must be in an organization to create tickets");
      return;
    }
    if (this.state.org == "select") {
      alert("You must select an organization");
      return;
    }
    if (!this.validateForm()) {
      alert("Please fill out all required fields");
      return;
    }
    this.setState({
      actionLock: true,
    });

    axios
      .post(
        `${HOST}/ticket/${this.state._id ? `update/${this.state._id}` : "add"}`,
        {
          username: getAuthUser(),
          category: this.state.category,
          domainURL: this.state.domainURL,
          title: this.state.title,
          priority: this.state.priority,
          deadline: this.state.deadline,
          organization: this.state.org,
          comments: this.state.comments,
        },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      )
      .then((res) => {
        this.setState({ actionLock: false });
        if (res.status == 200) {
          alert(this.state._id ? "Ticket Edited!" : "Ticket Created!");
          window.location.href = `/review`;
        }
      });
  };
  render() {
    return (
      <div>
        <div className="container">
          <h1 className="page-title">Create New Ticket</h1>
          <div className="form-panel">
            <div className="row">
              <div className="col mb-5">
                <form className="form-border">
                  {this.state.orgs && (
                    <div className="row">
                      <div className="col">
                        <h5>Organization</h5>
                        <select
                          name="org"
                          onChange={this.handleChangeOrg}
                          className="form-control">
                          <option
                            value={"select"}
                            selected={this.state.org == "select"}>
                            Select Organization
                          </option>
                          {this.state.orgs.map((org) => {
                            return (
                              <option
                                value={org._id}
                                selected={
                                  this.state.org == org._id
                                }>{`${org.companyName}`}</option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  )}
                  <h5>Title *</h5>
                  <input
                    type="text"
                    name="title"
                    defaultValue={this.state.title}
                    className={`form-control ${
                      this.state.errors.title && "error"
                    }`}
                    placeholder=""
                    onChange={this.handleChange}
                  />
                  {this.state.errors.title && (
                    <p className="form-error">{"Title is required"}</p>
                  )}
                  <h5>Domain URL</h5>

                  <select
                    name="domainURL"
                    onChange={this.handleChange}
                    className="form-control">
                    {this.state.companyUrls?.map((domain) => (
                      <option
                        value={domain}
                        selected={domain == this.state.domainURL}>
                        {domain}
                      </option>
                    ))}
                  </select>
                  <div className="row">
                    <div className="col">
                      <h5>Category</h5>
                      <select
                        name="category"
                        onChange={this.handleChange}
                        className="form-control">
                        {this.state.categories.includes("1") && (
                          <option value={1} selected={this.state.category == 1}>
                            PBC
                          </option>
                        )}
                        {this.state.categories.includes("2") && (
                          <option value={2} selected={this.state.category == 2}>
                            SEO
                          </option>
                        )}
                        {this.state.categories.includes("3") && (
                          <option value={3} selected={this.state.category == 3}>
                            Web Maintenance and Governance
                          </option>
                        )}
                        {this.state.categories.includes("4") && (
                          <option value={4} selected={this.state.category == 4}>
                            New Website Build
                          </option>
                        )}
                        {this.state.categories.includes("5") && (
                          <option value={5} selected={this.state.category == 5}>
                            New App Build
                          </option>
                        )}
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <h5>Priority</h5>
                      <select
                        name="priority"
                        value={this.state.priority}
                        defaultValue={this.state.priority}
                        onChange={this.handleChange}
                        className="form-control">
                        <option
                          value="ASAP"
                          selected={this.state.category == "ASAP"}>
                          ASAP
                        </option>
                        <option
                          value="high"
                          selected={this.state.category == "high"}>
                          High
                        </option>
                        <option
                          value="medium"
                          selected={
                            !["ASAP", "low", "high"].includes(
                              this.state.priority
                            )
                          }>
                          Medium
                        </option>
                        <option
                          value="low"
                          selected={this.state.category == "low"}>
                          Low
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="field-set">
                    <h5 htmlFor="deadline">Deadline</h5>
                    <DatePicker
                      selected={this.state.deadline}
                      onChange={this.handleDateChange}
                      dateFormat="MMMM d, yyyy"
                      timeCaption="time"
                      className="form-control"
                    />

                    <h5>Additional Comments</h5>
                    <input
                      type="text"
                      name="comments"
                      defaultValue={this.state.comments}
                      className={`form-control ${
                        this.state.nameError && "error"
                      }`}
                      placeholder=""
                      onChange={this.handleChange}
                    />
                    <input
                      id="submit"
                      onClick={this.submit}
                      className="btn-onboard"
                      value={this.state._id ? "Edit Ticket" : "Create Ticket"}
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withParams(Ticket);

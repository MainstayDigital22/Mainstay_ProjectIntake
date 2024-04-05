import axios from "axios";
import React, { Component } from "react";
import { createGlobalStyle } from "styled-components";
import { getAuthLevel, getAuthToken, getAuthUser } from "../components/auth";
import { HOST } from "../const";

export default class OnBoard extends Component {
  constructor() {
    super();
    this.state = {
      errors: [],
      legalDocuments: [],
      actionLock: false,
      username: getAuthUser(),
    };
  }
  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };
  deleteLegalDocuments = () => {
    this.setState({ legalDocuments: [] });
    document.getElementById("delete_ld").classList.add("hide");
    document.getElementById("delete_ld").classList.remove("show");
  };
  onChangeLegalDocuments = async (e) => {
    const legalDocuments = Array.from(e.target.files);
    await this.setState({ legalDocuments });
    const deleteBtn = document.getElementById("delete_ld");
    if (this.state.legalDocuments.length > 0) {
      deleteBtn.classList.add("show");
      deleteBtn.classList.remove("hide");
    } else {
      deleteBtn.classList.remove("show");
      deleteBtn.classList.add("hide");
    }
  };
  componentDidMount() {
    axios
      .get(`${HOST}/user`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then((res) => {
        const users = res.data.filter((user) => {
          return user.permission == "client";
        });
        this.setState({
          users,
          username: users.length == 0 ? "__new_user" : users[0]._id,
        });
        console.log(users[0]._id);
      });
    axios
      .get(`${HOST}/organization`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then((res) => {
        this.setState({
          orgs: res.data,
          org: res.data.length == 0 ? "__new_org" : res.data[0]._id,
        });
      });
  }
  validateForm = () => {
    const errors = {};
    let formIsValid = true;
    const newUserFields = [
      "newusername",
      "firstName",
      "lastName",
      "email",
      "password",
      "phone",
    ];
    const newOrgFields = [
      "companyName",
      "primaryContactName",
      "websiteURL",
      "contactEmail",
    ];

    const emailPattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    const phonePattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    if (this.state.email && !emailPattern.test(this.state.email)) {
      formIsValid = false;
      errors["email"] = "Invalid email format.";
    }
    if (
      this.state.contactEmail &&
      !emailPattern.test(this.state.contactEmail)
    ) {
      formIsValid = false;
      errors["contactEmail"] = "Invalid email format.";
    }
    if (this.state.phone && !phonePattern.test(this.state.phone)) {
      formIsValid = false;
      errors["phone"] =
        "Invalid phone format. Include only numbers and basic symbols.";
    }
    const requiredFields =
      this.state.username === "__new_user" && this.state.org === "__new_org"
        ? [...newUserFields, ...newOrgFields]
        : this.state.org === "__new_org"
        ? newOrgFields
        : this.state.username === "__new_user"
        ? newUserFields
        : [];

    requiredFields.forEach((field) => {
      if (!this.state[field]) {
        formIsValid = false;
        errors[field] = `${field} is required.`;
      }
    });
    console.log(errors);
    this.setState({ errors });
    return formIsValid;
  };

  submit = async () => {
    if (this.state.actionLock) {
      return;
    }
    if (!this.validateForm()) {
      alert("There are errors in the form.");
      return;
    }
    this.setState({
      actionLock: true,
    });
    let formData = new FormData();
    for (let i = 0; i < this.state.legalDocuments.length; i += 1) {
      formData.append("files", this.state.legalDocuments[i]);
    }

    let organizationId = this.state.org;
    let userId = this.state.username;

    if (this.state.username == "__new_user") {
      let res = await axios
        .post(`${HOST}/user/signup`, {
          username: this.state.newusername,
          firstName: this.state.firstName,
          lastName: this.state.lastName,
          password: this.state.password,
          email: this.state.email,
          phone: this.state.phone,
        })
        .catch((err) => {
          alert(err.response.data);
          this.setState({ actionLock: false });
        });
      if (res.status == 200) {
        userId = res.data.id;
      } else {
        alert("can not create new user");
        this.setState({ actionLock: false });
        return;
      }
    }

    if (this.state.org == "__new_org") {
      try {
        const uploadResponse = await axios.post(
          `${HOST}/file/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        const orgResponse = await axios.post(`${HOST}/organization/add`, {
          companyName: this.state.companyName,
          companyWebsite: this.state.websiteURL,
          contactName: this.state.primaryContactName,
          contactEmail: this.state.contactEmail,
          socials: [],
          legalDocuments: uploadResponse.data,
          description: this.state.description,
        });

        if (orgResponse.status === 200) {
          organizationId = orgResponse.data.id;
        } else {
          alert("Cannot create new organization");
          this.setState({ actionLock: false });
        }
      } catch (err) {
        alert(err.response ? err.response.data : "An error occurred");
        this.setState({ actionLock: false });
      }
    }
    console.log(organizationId);
    console.log(userId);
    axios
      .post(
        `${HOST}/organization/adduser`,
        {
          organizationId,
          userId,
        },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      )
      .then((res) => {
        this.setState({ actionLock: false });
        if (res.status == 200) {
          alert("User Linked");
          window.location.href = "/";
        }
      });
  };
  render() {
    return (
      <div>
        <div className="container">
          <h1 className="page-title">Onboarding</h1>
          <div className="form-panel">
            <div className="row">
              <div className="col mb-5">
                <form className="form-border">
                  <div className="field-set">
                    {getAuthLevel() == "admin" && this.state.orgs && (
                      <div className="row">
                        <div className="col">
                          <h5>Organization</h5>
                          <select
                            name="org"
                            onChange={this.handleChange}
                            className="form-control">
                            <option
                              value={"__new_org"}
                              selected={this.state.org == "__new_org"}>
                              Create new organization
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
                    {this.state.org == "__new_org" && (
                      <>
                        <div className="row">
                          <div className="col-6">
                            <h5>Company Name</h5>
                            <input
                              type="text"
                              name="companyName"
                              className={`form-control ${
                                this.state.errors.companyName && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-6">
                            <h5>Primary Contact Name</h5>
                            <input
                              type="text"
                              name="primaryContactName"
                              className={`form-control ${
                                this.state.errors.primaryContactName && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-6">
                            <h5>Website URL</h5>
                            <input
                              type="text"
                              name="websiteURL"
                              className={`form-control ${
                                this.state.errors.websiteURL && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-6">
                            <h5>Contact Email</h5>
                            <input
                              type="text"
                              name="contactEmail"
                              className={`form-control ${
                                this.state.errors.contactEmail && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>

                        <div className="row">
                          <div className="col">
                            <h5>Legal Documents</h5>
                            <div className="d-create-file">
                              <p id="file_name">
                                Upload Your Legal Documents Here
                              </p>
                              {this.state.legalDocuments.map((x) => (
                                <p key={x.name}>{x.name}</p>
                              ))}
                              <div className="browse">
                                <input
                                  type="button"
                                  className="btn-main"
                                  id="get_file"
                                  value="Browse"
                                />
                                <input
                                  id="upload_file"
                                  type="file"
                                  multiple
                                  onChange={this.onChangeLegalDocuments}
                                />
                              </div>
                            </div>
                            <div
                              id="delete_ld"
                              className="btn-main hide mt-2"
                              style={{ backgroundColor: "#900000" }}
                              onClick={this.deleteLegalDocuments}>
                              Delete Files
                            </div>
                          </div>
                        </div>
                        <h5>Company Description</h5>
                        <textarea
                          name="description"
                          className={`form-control ${
                            this.state.nameError && "error"
                          }`}
                          placeholder=""
                          onChange={this.handleChange}
                        />
                      </>
                    )}
                    {getAuthLevel() == "admin" && this.state.users && (
                      <div className="row">
                        <div className="col">
                          <h5>User</h5>
                          <select
                            name="username"
                            onChange={this.handleChange}
                            className="form-control">
                            <option
                              value={"__new_user"}
                              selected={this.state.username == "__new_user"}>
                              Create new user
                            </option>
                            {this.state.users.map((user) => {
                              return (
                                <option
                                  value={user._id}
                                  selected={
                                    this.state.username == user._id
                                  }>{`${user.username} - ${user.firstName} ${user.lastName}`}</option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    )}
                    {this.state.username == "__new_user" && (
                      <>
                        <div className="row">
                          <div className="col-4">
                            <h5>Username</h5>
                            <input
                              type="text"
                              name="newusername"
                              className={`form-control ${
                                this.state.errors.newusername && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-4">
                            <h5>First Name</h5>
                            <input
                              type="text"
                              name="firstName"
                              className={`form-control ${
                                this.state.errors.firstName && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-4">
                            <h5>Last Name</h5>
                            <input
                              type="text"
                              name="lastName"
                              className={`form-control ${
                                this.state.errors.lastName && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-4">
                            <h5>Email</h5>
                            <input
                              type="text"
                              name="email"
                              className={`form-control ${
                                this.state.errors.email && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-4">
                            <h5>Password</h5>
                            <input
                              type="text"
                              name="password"
                              className={`form-control ${
                                this.state.errors.password && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                          </div>
                          <div className="col-4">
                            <h5>Phone</h5>
                            <input
                              type="text"
                              name="phone"
                              className={`form-control ${
                                this.state.errors.phone && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                      </>
                    )}
                    <input
                      type="button"
                      id="submit"
                      onClick={this.submit}
                      className="btn-main"
                      value="Update Client"
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

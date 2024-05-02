import axios from "axios";
import React, { Component } from "react";
import { createGlobalStyle } from "styled-components";
import CreatableSelect from "react-select/creatable";
import { getAuthLevel, getAuthToken, getAuthUser } from "../components/auth";
import { HOST } from "../const";

export default class OnBoard extends Component {
  constructor() {
    super();
    this.state = {
      errors: [],
      categories: [],
      legalDocuments: [],
      brandingFiles: [],
      brandingDesignDocuments: [],
      actionLock: false,
      username: getAuthUser(),
      urls: [],
    };
  }
  onChangeURLs = (newURLs) => {
    this.setState({ urls: newURLs || [] });
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
  handleCheckboxChange = (event) => {
    const target = event.target;
    const value = target.value;
    const checked = target.checked;

    this.setState((prevState) => {
      const newCategories = new Set(prevState.categories);
      if (checked) {
        newCategories.add(value);
      } else {
        newCategories.delete(value);
      }
      return { categories: Array.from(newCategories) };
    });
  };
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
      "urls",
      "contactEmail",
    ];

    let urls = this.state.urls.map((site) => site.value);
    const urlPattern =
      /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;

    const emailPattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    const phonePattern = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    if (this.state.email && !emailPattern.test(this.state.email)) {
      formIsValid = false;
      errors["email"] = "Invalid email format";
    }
    if (
      this.state.contactEmail &&
      !emailPattern.test(this.state.contactEmail)
    ) {
      formIsValid = false;
      errors["contactEmail"] = "Invalid email format";
    }
    if (this.state.phone && !phonePattern.test(this.state.phone)) {
      formIsValid = false;
      errors["phone"] = "Invalid phone format";
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
      if (
        !this.state[field] ||
        (this.state[field] instanceof Array && this.state[field].length == 0)
      ) {
        formIsValid = false;
        errors[field] = `required`;
      }
    });
    if (urls && Array.isArray(urls)) {
      const invalidUrls = urls.filter((url) => !urlPattern.test(url));
      if (invalidUrls.length > 0) {
        formIsValid = false;
        errors["urls"] = "One or more URLs are invalid";
      }
    }
    if (this.state.categories.length == 0 && this.state.org == "__new_org") {
      formIsValid = false;
      errors["categories"] = "Must select a service";
    }
    console.log(errors);
    this.setState({ errors });
    return formIsValid;
  };
  deleteDesignDocuments = () => {
    this.setState({ brandingDesignDocuments: [] });
    document.getElementById("delete_dd").classList.add("hide");
    document.getElementById("delete_dd").classList.remove("show");
  };
  onChangeDesignDocuments = async (e) => {
    const brandingDesignDocuments = Array.from(e.target.files);
    await this.setState({ brandingDesignDocuments });
    const deleteBtn = document.getElementById("delete_dd");
    if (this.state.brandingDesignDocuments.length > 0) {
      deleteBtn.classList.add("show");
      deleteBtn.classList.remove("hide");
    } else {
      deleteBtn.classList.remove("show");
      deleteBtn.classList.add("hide");
    }
  };
  deleteBrandingFiles = () => {
    this.setState({ brandingFiles: [] });
    document.getElementById("delete_bf").classList.add("hide");
    document.getElementById("delete_bf").classList.remove("show");
  };
  onChangeBrandingFiles = async (e) => {
    const brandingFiles = Array.from(e.target.files);
    await this.setState({ brandingFiles });
    const deleteBtn = document.getElementById("delete_bf");
    if (this.state.brandingFiles.length > 0) {
      deleteBtn.classList.add("show");
      deleteBtn.classList.remove("hide");
    } else {
      deleteBtn.classList.remove("show");
      deleteBtn.classList.add("hide");
    }
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
    for (let i = 0; i < this.state.brandingFiles.length; i += 1) {
      formData.append("files", this.state.brandingFiles[i]);
    }
    for (let i = 0; i < this.state.brandingDesignDocuments.length; i += 1) {
      formData.append("files", this.state.brandingDesignDocuments[i]);
    }
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
        console.log(uploadResponse);
        const orgResponse = await axios.post(`${HOST}/organization/add`, {
          companyName: this.state.companyName,
          companyWebsite: this.state.urls.map((site) => site.value),
          contactName: this.state.primaryContactName,
          contactEmail: this.state.contactEmail,
          socials: [],
          legalDocuments:
            this.state.legalDocuments.length != 0
              ? uploadResponse.data.slice(
                  this.state.brandingFiles.length +
                    this.state.brandingDesignDocuments.length,
                  this.state.brandingFiles.length +
                    this.state.brandingDesignDocuments.length +
                    this.state.legalDocuments.length
                )
              : undefined,
          description: this.state.description,
          categories: this.state.categories,
          branding: {
            files:
              this.state.brandingFiles.length != 0
                ? uploadResponse.data.slice(0, this.state.brandingFiles.length)
                : undefined,
            colorCodes: this.state.branding?.colorCodes,
            fonts: this.state.branding?.fonts,
            designDocument:
              this.state.brandingDesignDocuments.length != 0
                ? uploadResponse.data.slice(
                    this.state.brandingFiles.length,
                    this.state.brandingFiles.length +
                      this.state.brandingDesignDocuments.length
                  )
                : undefined,
          },
          hosting: this.state.hosting,
          FTP: this.state.FTP,
          controlPanel: this.state.controlPanel,
          domain: this.state.domain,
          SEOKeywords: this.state.seoKeywords,
        });

        if (orgResponse.status === 200) {
          organizationId = orgResponse.data.id;
        } else {
          console.log(orgResponse);
          alert("Cannot create new organization");
          this.setState({ actionLock: false });
        }
      } catch (err) {
        alert(err);
        console.log(err);
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
                            <h5>Company Name *</h5>
                            <input
                              type="text"
                              name="companyName"
                              className={`form-control`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                            {this.state.errors.companyName && (
                              <p className="form-error">
                                {"Company Name is required"}
                              </p>
                            )}
                          </div>
                          <div className="col-6">
                            <h5>Primary Contact Name *</h5>
                            <input
                              type="text"
                              name="primaryContactName"
                              className={`form-control ${
                                this.state.errors.primaryContactName && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                            {this.state.errors.primaryContactName && (
                              <p className="form-error">
                                {"Primary Contact Name is required"}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-6">
                            <h5>Website URLs *</h5>
                            <CreatableSelect
                              className={`form-control`}
                              isMulti
                              onChange={this.onChangeURLs}
                              options={this.state.urls}
                              value={this.state.urls}
                              placeholder="Type or paste URL here and press enter..."
                            />
                            {this.state.errors.urls && (
                              <p className="form-error">
                                {this.state.errors.urls == "required"
                                  ? "URLs are required"
                                  : this.state.errors.urls}
                              </p>
                            )}
                          </div>

                          <div className="col-6">
                            <h5>Contact Email *</h5>
                            <input
                              type="text"
                              name="contactEmail"
                              className={`form-control ${
                                this.state.errors.contactEmail && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                            {this.state.errors.contactEmail && (
                              <p className="form-error">
                                {this.state.errors.contactEmail == "required"
                                  ? "URLs are required"
                                  : this.state.errors.contactEmail}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col">
                            <h5>Documents</h5>
                            <div className="d-create-file">
                              <p id="file_name">
                                Upload Your Company Documents Here
                              </p>
                              {this.state.legalDocuments.map((x) => (
                                <p key={x.name}>{x.name}</p>
                              ))}
                              <div className="browse">
                                <input
                                  type="button"
                                  className="btn-onboard"
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
                        <h5 style={{ marginTop: 20 }}>Services</h5>
                        <div className="row" style={{ marginBottom: 24 }}>
                          <div className="col">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value="1"
                                id="pbc"
                                onChange={this.handleCheckboxChange}
                              />
                              <label className="form-check-label" htmlFor="pbc">
                                PBC
                              </label>
                            </div>
                          </div>
                          <div className="col">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value="2"
                                id="seo"
                                onChange={this.handleCheckboxChange}
                              />
                              <label className="form-check-label" htmlFor="seo">
                                SEO
                              </label>
                            </div>
                          </div>
                          <div className="col">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value="3"
                                id="websiteMaintenance"
                                onChange={this.handleCheckboxChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="websiteMaintenance">
                                Website Maintenance
                              </label>
                            </div>
                          </div>
                          <div className="col">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value="4"
                                id="newWebsiteBuild"
                                onChange={this.handleCheckboxChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="newWebsiteBuild">
                                New Website Build
                              </label>
                            </div>
                          </div>
                          <div className="col">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value="5"
                                id="newAppBuild"
                                onChange={this.handleCheckboxChange}
                              />
                              <label
                                className="form-check-label"
                                htmlFor="newAppBuild">
                                New App Build
                              </label>
                            </div>
                          </div>
                        </div>
                        {this.state.errors.categories && (
                          <p className="form-error">
                            {this.state.errors.categories}
                          </p>
                        )}
                        {(this.state.categories.includes("4") ||
                          this.state.categories.includes("5")) && (
                          <div style={{ marginBottom: 20 }} id="dropdown">
                            <div className="tabupper no-select">
                              <h5 className="dropdown-label">Branding</h5>
                            </div>
                            <div
                              className="row tab no-select "
                              style={{ paddingBottom: 20 }}>
                              <div className="row">
                                <div className="col">
                                  <h5>Color Codes</h5>
                                  <input
                                    type="text"
                                    name="branding.colorCodes"
                                    defaultValue={
                                      this.state.branding?.colorCodes
                                    }
                                    className={`form-control ${
                                      this.state.nameError && "error"
                                    }`}
                                    placeholder=""
                                    onChange={this.handleChange}
                                  />
                                </div>
                                <div className="col">
                                  <h5>Fonts</h5>
                                  <input
                                    type="text"
                                    name="branding.fonts"
                                    defaultValue={this.state.branding?.fonts}
                                    className={`form-control ${
                                      this.state.nameError && "error"
                                    }`}
                                    placeholder=""
                                    onChange={this.handleChange}
                                  />
                                </div>
                              </div>
                              <div className="row">
                                <div className="col">
                                  <h5>Logos</h5>
                                  <div className="d-create-file">
                                    <p id="file_name">
                                      Upload Your Branding Files Here
                                    </p>
                                    {this.state.brandingFiles.map((x) => (
                                      <p key={x.name}>{x.name}</p>
                                    ))}
                                    <div className="browse">
                                      <input
                                        type="button"
                                        className="btn-onboard"
                                        id="get_file"
                                        value="Browse"
                                      />
                                      <input
                                        id="upload_file"
                                        type="file"
                                        multiple
                                        onChange={this.onChangeBrandingFiles}
                                      />
                                    </div>
                                  </div>
                                  <div
                                    id="delete_bf"
                                    className="btn-main hide mt-2"
                                    style={{ backgroundColor: "#900000" }}
                                    onClick={this.deleteBrandingFiles}>
                                    Delete Files
                                  </div>
                                </div>
                                <div className="col">
                                  <h5>Branding Documents</h5>
                                  <div className="d-create-file">
                                    <p id="file_name">
                                      Upload Your Designs Here
                                    </p>
                                    {this.state.brandingDesignDocuments.map(
                                      (x) => (
                                        <p key={x.name}>{x.name}</p>
                                      )
                                    )}
                                    <div className="browse">
                                      <input
                                        type="button"
                                        className="btn-onboard"
                                        id="get_file"
                                        value="Browse"
                                      />
                                      <input
                                        id="upload_file"
                                        type="file"
                                        multiple
                                        onChange={this.onChangeDesignDocuments}
                                      />
                                    </div>
                                  </div>
                                  <div
                                    id="delete_dd"
                                    className="btn-main hide mt-2"
                                    style={{ backgroundColor: "#900000" }}
                                    onClick={this.deleteDesignDocuments}>
                                    Delete Files
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {(this.state.categories.includes("3") ||
                          this.state.categories.includes("4")) && (
                          <div style={{ marginBottom: 20 }} id="dropdown">
                            <div className="tabupper no-select">
                              <h5 className="dropdown-label">Hosting</h5>
                            </div>
                            <div className="row tab no-select">
                              <div className="row">
                                <div className="col">
                                  <h5>Provider</h5>
                                  <input
                                    type="text"
                                    name="hosting.provider"
                                    defaultValue={this.state.hosting?.provider}
                                    className={`form-control`}
                                    placeholder=""
                                    onChange={this.handleChange}
                                  />
                                </div>
                                <div className="col">
                                  <h5>Username</h5>
                                  <input
                                    type="text"
                                    name="hosting.username"
                                    defaultValue={this.state.hosting?.username}
                                    className={`form-control ${
                                      this.state.nameError && "error"
                                    }`}
                                    placeholder=""
                                    onChange={this.handleChange}
                                  />
                                </div>
                                <div className="col">
                                  <h5>Password</h5>
                                  <input
                                    type="text"
                                    name="hosting.password"
                                    defaultValue={this.state.hosting?.password}
                                    className={`form-control`}
                                    placeholder=""
                                    onChange={this.handleChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {(this.state.categories.includes("3") ||
                          this.state.categories.includes("4") ||
                          this.state.categories.includes("5")) && (
                          <div style={{ marginBottom: 20 }} id="dropdown">
                            <div className="tabupper no-select">
                              <h5 className="dropdown-label">FTP</h5>
                            </div>
                            <div className="row tab no-select">
                              <div className="row">
                                <div className="col">
                                  <h5>Provider</h5>
                                  <input
                                    type="text"
                                    name="FTP.provider"
                                    defaultValue={this.state.FTP?.provider}
                                    className={`form-control ${
                                      this.state.nameError && "error"
                                    }`}
                                    placeholder=""
                                    onChange={this.handleChange}
                                  />
                                </div>
                                <div className="col">
                                  <h5>Username</h5>
                                  <input
                                    type="text"
                                    name="FTP.username"
                                    defaultValue={this.state.FTP?.username}
                                    className={`form-control ${
                                      this.state.nameError && "error"
                                    }`}
                                    placeholder=""
                                    onChange={this.handleChange}
                                  />
                                </div>
                              </div>
                              <div className="row">
                                <div className="col">
                                  <h5>Password</h5>
                                  <input
                                    type="text"
                                    name="FTP.password"
                                    defaultValue={this.state.FTP?.password}
                                    className={`form-control ${
                                      this.state.nameError && "error"
                                    }`}
                                    placeholder=""
                                    onChange={this.handleChange}
                                  />
                                </div>
                                <div className="col">
                                  <h5>Live Directory Path</h5>
                                  <input
                                    type="text"
                                    name="FTP.liveDirectory"
                                    defaultValue={this.state.FTP?.liveDirectory}
                                    className={`form-control ${
                                      this.state.nameError && "error"
                                    }`}
                                    placeholder=""
                                    onChange={this.handleChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {this.state.categories.length > 0 && (
                          <div style={{ marginBottom: 20 }} id="dropdown">
                            <div className="tabupper no-select">
                              <h5
                                onClick={() =>
                                  this.toggleDropdown("showControlDropdown")
                                }
                                className="dropdown-label">
                                Admin Control Panel
                              </h5>
                            </div>
                            <div className="row tab no-select">
                              <div className="row">
                                <div className="col">
                                  <h5>URL</h5>
                                  <input
                                    type="text"
                                    name="controlPanel.url"
                                    defaultValue={this.state.controlPanel?.url}
                                    className={`form-control ${
                                      this.state.nameError && "error"
                                    }`}
                                    placeholder=""
                                    onChange={this.handleChange}
                                  />
                                </div>
                                <div className="col">
                                  <h5>Username</h5>
                                  <input
                                    type="text"
                                    name="controlPanel.username"
                                    defaultValue={
                                      this.state.controlPanel?.username
                                    }
                                    className={`form-control ${
                                      this.state.nameError && "error"
                                    }`}
                                    placeholder=""
                                    onChange={this.handleChange}
                                  />
                                </div>
                                <div className="col">
                                  <h5>Password</h5>
                                  <input
                                    type="text"
                                    name="controlPanel.password"
                                    defaultValue={
                                      this.state.controlPanel?.password
                                    }
                                    className={`form-control ${
                                      this.state.nameError && "error"
                                    }`}
                                    placeholder=""
                                    onChange={this.handleChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {(this.state.categories.includes("1") ||
                          this.state.categories.includes("4")) && (
                          <div style={{ marginBottom: 20 }} id="dropdown">
                            <div className="tabupper no-select">
                              <h5 className="dropdown-label">
                                Domain Management
                              </h5>
                            </div>
                            <div className="row tab no-select">
                              <div className="row">
                                <div className="col">
                                  <h5>Provider</h5>
                                  <input
                                    type="text"
                                    name="domain.provider"
                                    defaultValue={this.state.domain?.provider}
                                    className={`form-control ${
                                      this.state.nameError && "error"
                                    }`}
                                    placeholder=""
                                    onChange={this.handleChange}
                                  />
                                </div>
                                <div className="col">
                                  <h5>Username</h5>
                                  <input
                                    type="text"
                                    name="domain.username"
                                    defaultValue={this.state.domain?.username}
                                    className={`form-control ${
                                      this.state.nameError && "error"
                                    }`}
                                    placeholder=""
                                    onChange={this.handleChange}
                                  />
                                </div>
                                <div className="col">
                                  <h5>Password</h5>
                                  <input
                                    type="text"
                                    name="domain.password"
                                    defaultValue={this.state.domain?.password}
                                    className={`form-control ${
                                      this.state.nameError && "error"
                                    }`}
                                    placeholder=""
                                    onChange={this.handleChange}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {this.state.categories.includes("2") && (
                          <>
                            <h5>SEO Keywords</h5>
                            <input
                              type="text"
                              name="seoKeywords"
                              defaultValue={this.state.seoKeywords}
                              className={`form-control ${
                                this.state.nameError && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                          </>
                        )}
                        <div style={{ marginTop: 8 }}></div>
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
                            <h5>Username *</h5>
                            <input
                              type="text"
                              name="newusername"
                              className={`form-control ${
                                this.state.errors.newusername && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                            {this.state.errors.newusername && (
                              <p className="form-error">
                                {"Username is required"}
                              </p>
                            )}
                          </div>
                          <div className="col-4">
                            <h5>First Name *</h5>
                            <input
                              type="text"
                              name="firstName"
                              className={`form-control ${
                                this.state.errors.firstName && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                            {this.state.errors.firstName && (
                              <p className="form-error">
                                {"First Name is required"}
                              </p>
                            )}
                          </div>
                          <div className="col-4">
                            <h5>Last Name *</h5>
                            <input
                              type="text"
                              name="lastName"
                              className={`form-control ${
                                this.state.errors.lastName && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                            {this.state.errors.lastName && (
                              <p className="form-error">
                                {"Last Name is required"}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-4">
                            <h5>Email *</h5>
                            <input
                              type="text"
                              name="email"
                              className={`form-control ${
                                this.state.errors.email && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                            {this.state.errors.email && (
                              <p className="form-error">
                                {this.state.errors.email == "required"
                                  ? "Email is required"
                                  : this.state.errors.email}
                              </p>
                            )}
                          </div>
                          <div className="col-4">
                            <h5>Password *</h5>
                            <input
                              type="text"
                              name="password"
                              className={`form-control ${
                                this.state.errors.password && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                            {this.state.errors.password && (
                              <p className="form-error">
                                "Password is required"
                              </p>
                            )}
                          </div>
                          <div className="col-4">
                            <h5>Phone *</h5>
                            <input
                              type="text"
                              name="phone"
                              className={`form-control ${
                                this.state.errors.phone && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                            {this.state.errors.phone && (
                              <p className="form-error">
                                {this.state.errors.phone == "required"
                                  ? "Phone is required"
                                  : this.state.errors.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                    <input
                      type="button"
                      id="submit"
                      onClick={this.submit}
                      className="btn-onboard"
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

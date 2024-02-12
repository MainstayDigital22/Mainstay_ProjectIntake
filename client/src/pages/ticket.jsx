import axios from "axios";
import React, { Component } from "react";
import { createGlobalStyle } from "styled-components";
import { getAuthToken, getAuthUser } from "../components/auth";
import { HOST } from "../const";
const GlobalStyles = createGlobalStyle`
.error {
  border-color: red;
}
.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
}
h5{
  font-weight:500;
  font-size:18px;
}
@media only screen and (max-width: 1199px) {
    .navbar{
      background: #403f83;
    }
    .navbar .menu-line, .navbar .menu-line1, .navbar .menu-line2{
      background: #fff;
    }
    .item-dropdown .dropdown a{
      color: #fff !important;
    }
  }
  .gap{
    padding:10px;
  }
  .tab{
    padding:30px;
    margin: auto;
    gap: 30px;
    border-bottom-left-radius:15px;
    border-bottom-right-radius:15px;
    border: 1px solid #dddddd;
    background-color: #fafafa;
  }
  .tabupper{
    margin: auto;
    padding-left:10px;
    padding-top:7px;
    border-top-left-radius:15px;
    border-top-right-radius:15px;
    border: 1px solid #dddddd;
    background-color: #ffffff;
  }
  .no-select {
    -webkit-user-select: none; 
    -moz-user-select: none;
    -ms-user-select: none; 
    user-select: none;
  }
`;

export default class Ticket extends Component {
  constructor() {
    super();
    this.state = {
      showBrandingDropdown: false,
      showHostingDropdown: false,
      showFTPDropdown: false,
      showControlDropdown: false,
      showDomainDropdown: false,
      companyName: "",
      primaryContactName: "",
      websiteURL: "",

      email: "",
      colorCodes: "",
      fonts: "",
      brandingFiles: [],
      brandingDesignDocuments: [],
      legalDocuments: [],
      hostingProvider: "",
      hostingUsername: "",
      hostingPassword: "",
      ftpProvider: "",
      ftpUsername: "",
      ftpPassword: "",
      ftpLiveDirectory: "",
      controlURL: "",
      controlUsername: "",
      controlPassword: "",
      domainProvider: "",
      domainUsername: "",
      domainPassword: "",
      seoKeywords: "",
      comments: "",
      actionLock: false,
    };
  }
  toggleDropdown = (dropdown) => {
    this.setState((prevState) => ({
      [dropdown]: !prevState[dropdown],
    }));
  };
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
  submit = () => {
    if (this.state.actionLock) {
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

    axios
      .post(`http://${HOST}:8080/file/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        axios
          .post(
            `http://${HOST}:8080/ticket/add`,
            {
              username: getAuthUser(),
              companyName: this.state.companyName,
              websiteUrl: this.state.companyName,
              primaryContactName: this.state.primaryContactName,
              name: this.state.name,
              email: this.state.email,
              socials: [],
              branding: {
                files: res.data.slice(0, this.state.brandingFiles.length),
                colorCodes: this.state.colorCodes,
                fonts: this.state.fonts,
                designDocument: res.data.slice(
                  this.state.brandingFiles.length,
                  this.state.brandingFiles.length +
                    this.state.brandingDesignDocuments.length
                ),
              },
              hosting: {
                proivider: this.state.hostingProvider,
                username: this.state.hostingUsername,
                password: this.state.hostingPassword,
              },
              FTP: {
                provider: this.state.ftpProvider,
                username: this.state.ftpUsername,
                password: this.state.ftpPassword,
                liveDirectory: this.state.ftpLiveDirectory,
              },
              controlPanel: {
                url: this.state.controlURL,
                username: this.state.controlUsername,
                password: this.state.controlPassword,
              },
              domain: {
                provider: this.state.domainProvider,
                username: this.state.domainUsername,
                password: this.state.domainPassword,
              },
              SEOKeywords: this.state.seoKeywords,
              legalDocuments: res.data.slice(
                this.state.brandingFiles.length +
                  this.state.brandingDesignDocuments.length,
                this.state.brandingFiles.length +
                  this.state.brandingDesignDocuments.length +
                  this.state.legalDocuments.length
              ),
              comments: this.state.comments,
            },
            { headers: { Authorization: `Bearer ${getAuthToken()}` } }
          )
          .then(alert("post added!"));
      })
      .catch((err) => alert(err));
  };
  render() {
    return (
      <div>
        <GlobalStyles />
        <div className="container">
          <div className="row">
            <div className="col mb-5">
              <form className="form-border">
                <div className="field-set">
                  <div className="row">
                    <div className="col-6">
                      <h5>Company Name</h5>
                      <input
                        type="text"
                        name="companyName"
                        className={`form-control ${
                          this.state.nameError && "error"
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
                          this.state.nameError && "error"
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
                          this.state.nameError && "error"
                        }`}
                        placeholder=""
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="col-6">
                      <h5>Contact Email</h5>
                      <input
                        type="text"
                        name="email"
                        className={`form-control ${
                          this.state.nameError && "error"
                        }`}
                        placeholder=""
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                  <div style={{ marginBottom: 20 }} id="dropdown">
                    <div className="tabupper no-select">
                      <h5
                        onClick={() =>
                          this.toggleDropdown("showBrandingDropdown")
                        }
                        className="dropdown-label">
                        {this.state.showBrandingDropdown
                          ? "Branding ▲"
                          : "Branding ▼"}
                      </h5>
                    </div>
                    {this.state.showBrandingDropdown && (
                      <div className="tab no-select">
                        <div className="row">
                          <div className="col">
                            <h5>Color Codes</h5>
                            <input
                              type="text"
                              name="colorCodes"
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
                              name="fonts"
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
                                  className="btn-main"
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
                              <p id="file_name">Upload Your Designs Here</p>
                              {this.state.brandingDesignDocuments.map((x) => (
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
                    )}
                  </div>
                  <div style={{ marginBottom: 20 }} id="dropdown">
                    <div className="tabupper no-select">
                      <h5
                        onClick={() =>
                          this.toggleDropdown("showHostingDropdown")
                        }
                        className="dropdown-label">
                        {this.state.showHostingDropdown
                          ? "Hosting ▲"
                          : "Hosting ▼"}
                      </h5>
                    </div>
                    {this.state.showHostingDropdown && (
                      <div className="row tab no-select">
                        <div className="row">
                          <div className="col">
                            <h5>Provider</h5>
                            <input
                              type="text"
                              name="hostingProvider"
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
                              name="hostingUsername"
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
                              name="hostingPassword"
                              className={`form-control ${
                                this.state.nameError && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ marginBottom: 20 }} id="dropdown">
                    <div className="tabupper no-select">
                      <h5
                        onClick={() => this.toggleDropdown("showFTPDropdown")}
                        className="dropdown-label">
                        {this.state.showFTPDropdown ? "FTP ▲" : "FTP ▼"}
                      </h5>
                    </div>
                    {this.state.showFTPDropdown && (
                      <div className="row tab no-select">
                        <div className="row">
                          <div className="col">
                            <h5>Provider</h5>
                            <input
                              type="text"
                              name="ftpProvider"
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
                              name="ftpUsername"
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
                              name="ftpPassword"
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
                              name="ftpLiveDirectory"
                              className={`form-control ${
                                this.state.nameError && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ marginBottom: 20 }} id="dropdown">
                    <div className="tabupper no-select">
                      <h5
                        onClick={() =>
                          this.toggleDropdown("showControlDropdown")
                        }
                        className="dropdown-label">
                        {this.state.showControlDropdown
                          ? "Admin Control Panel ▲"
                          : "Admin Control Panel ▼"}
                      </h5>
                    </div>
                    {this.state.showControlDropdown && (
                      <div className="row tab no-select">
                        <div className="row">
                          <div className="col">
                            <h5>URL</h5>
                            <input
                              type="text"
                              name="controlURL"
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
                              name="controlUsername"
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
                              name="controlPassword"
                              className={`form-control ${
                                this.state.nameError && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div style={{ marginBottom: 20 }} id="dropdown">
                    <div className="tabupper no-select">
                      <h5
                        onClick={() =>
                          this.toggleDropdown("showDomainDropdown")
                        }
                        className="dropdown-label">
                        {this.state.showDomainDropdown
                          ? "Domain ▲"
                          : "Domain ▼"}
                      </h5>
                    </div>
                    {this.state.showDomainDropdown && (
                      <div className="row tab no-select">
                        <div className="row">
                          <div className="col">
                            <h5>Provider</h5>
                            <input
                              type="text"
                              name="domainProvider"
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
                              name="domainUsername"
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
                              name="domainPassword"
                              className={`form-control ${
                                this.state.nameError && "error"
                              }`}
                              placeholder=""
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="row">
            
                    <div className="col">
                      <h5>Legal Documents</h5>
                      <div className="d-create-file">
                        <p id="file_name">Upload Your Legal Documents Here</p>
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
                  <h5>Seo Keywords</h5>
                  <input
                    type="text"
                    name="seoKeywords"
                    className={`form-control ${
                      this.state.nameError && "error"
                    }`}
                    placeholder=""
                    onChange={this.handleChange}
                  />
                  <h5>Additional Comments</h5>
                  <input
                    type="text"
                    name="comments"
                    className={`form-control ${
                      this.state.nameError && "error"
                    }`}
                    placeholder=""
                    onChange={this.handleChange}
                  />
                  <input
                    type="button"
                    id="submit"
                    onClick={this.submit}
                    className="btn-main"
                    value="Create Ticket"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

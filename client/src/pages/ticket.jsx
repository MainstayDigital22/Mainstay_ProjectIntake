import axios from "axios";
import React, { Component } from "react";
import { useParams } from "react-router-dom";
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
function withParams(Component) {
  return (props) => <Component {...props} params={useParams()} />;
}
class Ticket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      actionLock: false,
      errors: {},
      category: 1,
      brandingFiles: [],
      brandingDesignDocuments: [],
      priority: "medium",
    };
  }
  validateForm = () => {
    const errors = {};
    const requiredFields = ["title", "domainURL"]; // List of required field names
    requiredFields.forEach((fieldName) => {
      if (!this.state[fieldName] || this.state[fieldName].trim() === "") {
        errors[fieldName] = `${fieldName} cannot be empty`; // Customize the error message as needed
      }
    });

    this.setState({ errors });
    return Object.keys(errors).length === 0; // Form is valid if there are no errors
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
    const { id } = this.props.params;
    if (id) {
      this.fetchData(id);
    }
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
        this.setState((prevState) => ({
          ...prevState,
          ...res.data[0],
        }));
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  }
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
    if (!this.validateForm()) {
      alert("Please fill out all required fields");
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

    axios
      .post(`${HOST}/file/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        axios
          .post(
            `${HOST}/ticket/${
              this.state._id ? `update/${this.state._id}` : "add"
            }`,
            {
              username: getAuthUser(),
              category: this.state.category,
              domainURL: this.state.domainURL,
              title: this.state.title,
              priority: this.state.priority,
              branding: {
                files:
                  this.state._id && this.state.branding?.files
                    ? this.state.branding.files.concat(
                        res.data.slice(0, this.state.brandingFiles.length)
                      )
                    : this.state.brandingFiles.length != 0
                    ? res.data.slice(0, this.state.brandingFiles.length)
                    : undefined,
                colorCodes: this.state.branding?.colorCodes,
                fonts: this.state.branding?.fonts,
                designDocument:
                  this.state._id && this.state.branding?.files
                    ? this.state.branding.designDocument.concat(
                        res.data.slice(
                          this.state.brandingFiles.length,
                          this.state.brandingFiles.length +
                            this.state.brandingDesignDocuments.length
                        )
                      )
                    : this.state.brandingDesignDocuments.length != 0
                    ? res.data.slice(
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
              comments: this.state.comments,
            },
            { headers: { Authorization: `Bearer ${getAuthToken()}` } }
          )
          .then((res) => {
            this.setState({ actionLock: false });
            if (res.status == 200) {
              alert(this.state._id ? "Ticket Edited!" : "Ticket Created!");
              window.location.href = `/review/${this.state._id || res.data.id}`;
            }
          });
      })
      .catch((err) => {
        alert(err);
        this.setState({ actionLock: false });
      });
  };
  render() {
    return (
      <div>
        <GlobalStyles />
        <div className="container">
          <div className="row">
            <div className="col mb-5">
              <form className="form-border">
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
                <h5>Domain URL *</h5>
                <input
                  type="text"
                  name="domainURL"
                  defaultValue={this.state.domainURL}
                  className={`form-control ${
                    this.state.errors.domainURL && "error"
                  }`}
                  placeholder=""
                  onChange={this.handleChange}
                />
                <div className="row">
                  <div className="col">
                    <h5>Category</h5>
                    <select
                      name="category"
                      onChange={this.handleChange}
                      className="form-control">
                      <option
                        value={1}
                        selected={![2, 3, 4, 5].includes(this.state.category)}>
                        PBC
                      </option>
                      <option value={2} selected={this.state.category == 2}>
                        SEO
                      </option>
                      <option value={3} selected={this.state.category == 3}>
                        Web Maintenance and Governance
                      </option>
                      <option value={4} selected={this.state.category == 4}>
                        New Website Build
                      </option>
                      <option value={5} selected={this.state.category == 5}>
                        New App Build
                      </option>
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
                          !["ASAP", "low", "high"].includes(this.state.priority)
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
                  {[4, 5].includes(parseInt(this.state.category)) && (
                    <div style={{ marginBottom: 20 }} id="dropdown">
                      <div className="tabupper no-select">
                        <h5 className="dropdown-label">Branding</h5>
                      </div>
                      <div className="tab no-select">
                        <div className="row">
                          <div className="col">
                            <h5>Color Codes</h5>
                            <input
                              type="text"
                              name="branding.colorCodes"
                              defaultValue={this.state.branding?.colorCodes}
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
                    </div>
                  )}
                  {[3, 4].includes(parseInt(this.state.category)) && (
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
                  {[3, 4, 5].includes(parseInt(this.state.category)) && (
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
                  {[1, 2, 3, 4, 5].includes(parseInt(this.state.category)) && (
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
                              defaultValue={this.state.controlPanel?.username}
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
                              defaultValue={this.state.controlPanel?.password}
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
                  {[1, 4].includes(parseInt(this.state.category)) && (
                    <div style={{ marginBottom: 20 }} id="dropdown">
                      <div className="tabupper no-select">
                        <h5 className="dropdown-label">Domain</h5>
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
                  {[2].includes(parseInt(this.state.category)) && (
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
                    type="button"
                    id="submit"
                    onClick={this.submit}
                    className="btn-main"
                    value={this.state._id ? "Edit Ticket" : "Create Ticket"}
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

export default withParams(Ticket);

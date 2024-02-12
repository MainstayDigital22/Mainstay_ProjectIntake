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

export default class OnBoard extends Component {
  constructor() {
    super();
    this.state = {
      legalDocuments: [],
      actionLock: false,
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
 
  submit = () => {
    if (this.state.actionLock) {
      return;
    }
    this.setState({
      actionLock: true,
    });
    let formData = new FormData();
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
            `http://${HOST}:8080/user/onboard`,
            {
              username: getAuthUser(),
              companyName: this.state.companyName,
              companyWebsite: this.state.websiteURL,
              contactName: this.state.primaryContactName,
              contactEmail: this.state.email,
              socials: [],
              legalDocuments: res.data,
              comments: this.state.comments
            },
            { headers: { Authorization: `Bearer ${getAuthToken()}` } }
          )
          .then((res)=>{this.setState({actionLock:false});
          if(res.status==200){alert("Client Updated!");window.location.href = "/";}});
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
                    value="Update Client"
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

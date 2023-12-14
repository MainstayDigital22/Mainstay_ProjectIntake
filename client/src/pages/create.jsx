import React, { Component } from "react";
import { createGlobalStyle } from "styled-components";
import axios from "axios";
import { getAuthToken, getAuthUser } from "../components/auth";
import { HOST } from "../const";
import { Editor } from "@tinymce/tinymce-react";
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
  font-weight:1000;
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
`;

export default class Create extends Component {
  constructor() {
    super();
    this.onChangeMultiple = this.onChangeMultiple.bind(this);
    this.state = {
      files: [],
      tab: 1,
      title: "",
      subtitle: "",
      desc: "",
      name: "",
      tags: [],
      englishName: "",
      year: undefined,
      nameError: "",
      titleError: "",
      englishNameError: "",
      yearError: "",
      descError: "",
      actionLock: false,
      type: 1,
    };
  }
  handleEditorChange = (content, editor) => {
    this.setState({ desc: content });
    if (!content.trim()) {
      this.setState({ descError: "Description cannot be blank" });
    } else {
      this.setState({ descError: "" });
    }
  };
  deleteFiles = () => {
    this.setState({ files: [] });
    document.getElementById("delete_btn").classList.add("hide");
    document.getElementById("delete_btn").classList.remove("show");
  };

  async onChangeMultiple(e) {
    var files = e.target.files;
    var filesArr = await Array.prototype.slice.call(files);
    let i = 0;
    while (i < filesArr.length) {
      if (
        filesArr[i].type !== "image/jpeg" &&
        filesArr[i].type !== "image/png" &&
        filesArr[i].type !== "video/mp4"
      ) {
        alert("Type error: Only accepting PNG, JPG/JPEG, and MP4");
        await filesArr.splice(i, 1);
      } else {
        i += 1;
      }
    }
    await this.setState({ files: [...filesArr] });
    if (this.state.files.length != 0) {
      document.getElementById("delete_btn").classList.add("show");
      document.getElementById("delete_btn").classList.remove("hide");
    }
  }
  onChangeTitle = (e) => {
    this.setState({ title: e.target.value });
    if (!e.target.value.trim() && this.state.type == 3) {
      this.setState({ titleError: "Title cannot be blank" });
    } else {
      this.setState({ titleError: "" });
    }
  };
  onChangeSubtitle = (e) => {
    this.setState({ subtitle: e.target.value });
  };

  onChangeName = (e) => {
    const name = e.target.value;
    this.setState({ name: name });
    if (!name.trim()) {
      this.setState({ nameError: "Name cannot be blank" });
    } else if (/\d/.test(name)) {
      this.setState({ nameError: "Name cannot contain numbers" });
    } else {
      this.setState({ nameError: "" });
    }
  };
  onChangeEnglishName = (e) => {
    const englishName = e.target.value;
    this.setState({ englishName });
  };

  onChangeYear = (e) => {
    const year = e.target.value;
    const currentYear = new Date().getFullYear();
    this.setState({ year });
    const validYearRegex = /^\d{4}$/; // Only accepts a 4-digit number
    if (!validYearRegex.test(year) || year > currentYear) {
      this.setState({ yearError: "Please enter a valid 4-digit year" });
    } else {
      this.setState({ yearError: "" });
    }
  };

  onChangeTags = (e) => {
    const lower = e.target.value
      .replace(/\s/g, "")
      .split(",")
      .map((element) => {
        return element.toLowerCase();
      });
    this.setState({ tags: lower });
  };

  submit = () => {
    if (this.state.actionLock) {
      return;
    }
    this.setState({
      actionLock: true,
    });
    let error = false;
    if (!this.state.title && this.state.type == 3) {
      this.setState({ titleError: "Title cannot be blank" });
      error = true;
    } else {
      this.setState({ titleError: "" });
    }
    if (!this.state.name.trim()) {
      this.setState({ nameError: "Name cannot be blank" });
      error = true;
    } else if (/\d/.test(this.state.name)) {
      this.setState({ nameError: "Name cannot contain numbers" });
      error = true;
    } else {
      this.setState({ nameError: "" });
    }
    const validYearRegex = /^\d{4}$/; // Only accepts a 4-digit number
    const currentYear = new Date().getFullYear();
    if (
      !validYearRegex.test(this.state.year) ||
      this.state.year > currentYear
    ) {
      this.setState({ yearError: "Please enter a valid 4-digit year" });
      error = true;
    } else {
      this.setState({ yearError: "" });
    }
    if (error) {
      alert("There are errors in the form");
      this.setState({
        actionLock: false,
      });
      return;
    }
    let formData = new FormData();
    for (let i = 0; i < this.state.files.length; i += 1) {
      formData.append("files", this.state.files[i]);
    }
    if (this.state.files.length == 0) {
      axios
        .post(
          `http://${HOST}:8080/post/add`,
          {
            user: getAuthUser(),
            name: this.state.name,
            englishName: this.state.englishName,
            year: this.state.year,
            title: this.state.title,
            subtitle: this.state.subtitle,
            description: this.state.desc,
            media: [],
            category: [
              ...this.state.tags,
              this.state.type == 1
                ? "outstanding"
                : this.state.type == 2
                ? "regular"
                : this.state.type == 3
                ? "research"
                : "honor",
            ],
            layout: 0,
            created: Date.now,
            updated: Date.now,
            status: 0,
            order: 0,
          },
          { headers: { Authorization: `Bearer ${getAuthToken()}` } }
        )
        .then(async (res) => {
          axios.post(`http://${HOST}:8080/log/add`, {
            username: getAuthUser(),
            postid: res.data.id,
            postTitle: this.state.name,
            action: "Create Post",
            comments: `User ${getAuthUser()} created post titled ${
              this.state.name
            } with the post ID of ${res.data.id}`,
          });
          alert(res.data.message);
          window.location.reload(false);
        });
      return;
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
            `http://${HOST}:8080/post/add`,
            {
              user: getAuthUser(),
              name: this.state.name,
              englishName: this.state.englishName,
              year: this.state.year,
              title: this.state.title,
              subtitle: this.state.subtitle,
              description: this.state.desc,
              media: res.data,
              category: [
                ...this.state.tags,
                this.state.type == 1
                  ? "outstanding"
                  : this.state.type == 2
                  ? "regular"
                  : this.state.type == 3
                  ? "research"
                  : "honor",
              ],
              layout: 0,
              created: Date.now,
              updated: Date.now,
              status: 0,
              order: 0,
            },
            { headers: { Authorization: `Bearer ${getAuthToken()}` } }
          )
          .then(async (res) => {
            axios.post(`http://${HOST}:8080/log/add`, {
              username: getAuthUser(),
              postid: res.data.id,
              postTitle: this.state.name,
              action: "Create Post",
              comments: `User ${getAuthUser()} created post titled ${
                this.state.name
              } with the post ID of ${res.data.id}`,
            });
            alert(res.data.message);
            window.location.reload(false);
          });
      })
      .catch((err) => alert(err));
  };
  state = {
    isActive: false,
  };
  unlockClick = () => {
    this.setState({
      isActive: true,
    });
  };
  unlockHide = () => {
    this.setState({ isActive: false });
  };
  onCheck = (e) => {
    let newType;
    if (e.target.checked) {
      switch (e.target.id) {
        case "outstanding":
          newType = 1;
          break;
        case "regular":
          newType = 2;
          break;
        case "research":
          newType = 3;
          break;
        case "honor":
          newType = 4;
          break;
      }
    }
    this.setState({ type: newType });
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
                  <h5>內容分類</h5>
                  <div>
                    <input
                      id="outstanding"
                      onChange={this.onCheck}
                      checked={this.state.type == 1}
                      type="checkbox"
                    />
                    <label>&nbsp;&nbsp;傑出校友&nbsp;&nbsp;</label>
                    <input
                      id="regular"
                      onChange={this.onCheck}
                      checked={this.state.type == 2}
                      type="checkbox"
                    />
                    <label>&nbsp;&nbsp;一般校友&nbsp;&nbsp;</label>
                    <input
                      id="research"
                      onChange={this.onCheck}
                      checked={this.state.type == 3}
                      type="checkbox"
                    />
                    <label>&nbsp;&nbsp;研究成果&nbsp;&nbsp;</label>
                    <input
                      id="honor"
                      onChange={this.onCheck}
                      checked={this.state.type == 4}
                      type="checkbox"
                    />
                    <label>&nbsp;&nbsp;名譽博士&nbsp;&nbsp;</label>
                  </div>
                  <div className="spacer-single"></div>
                  <h5>校友名字</h5>
                  <input
                    type="text"
                    name="item_title"
                    id="item_title"
                    className={`form-control ${
                      this.state.nameError && "error"
                    }`}
                    placeholder=""
                    onChange={this.onChangeName}
                  />
                  {this.state.nameError && (
                    <p className="error-message">{this.state.nameError}</p>
                  )}
                  <h5>校友英文名</h5>
                  <input
                    type="text"
                    name="item_title"
                    id="item_title"
                    className="form-control"
                    placeholder=""
                    onChange={this.onChangeEnglishName}
                  />
                  <h5>標題</h5>
                  <input
                    type="text"
                    name="item_title"
                    id="item_title"
                    className={`form-control ${
                      this.state.titleError && "error"
                    }`}
                    placeholder=""
                    onChange={this.onChangeTitle}
                  />
                  {this.state.titleError && (
                    <p className="error-message">{this.state.titleError}</p>
                  )}
                  <h5>副標題</h5>
                  <input
                    type="text"
                    name="item_title"
                    id="item_title"
                    className="form-control"
                    placeholder=""
                    onChange={this.onChangeSubtitle}
                  />
                  <h5>詳細描述</h5>
                  <div className="editor-container">
                    <Editor
                      name="item_desc"
                      id="item_desc"
                      className={`form-control ${
                        this.state.descError && "error"
                      }`}
                      init={{
                        height: 500,
                        selector: "#editor",
                        menubar: true,
                        plugins:
                          "powerpaste casechange searchreplace autolink directionality visualblocks visualchars image link media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount editimage help formatpainter permanentpen charmap linkchecker emoticons advtable export autosave advcode fullscreen",
                        toolbar:
                          "undo redo print spellcheckdialog formatpainter | blocks fontfamily fontsize | bold italic underline forecolor backcolor | link image | alignleft aligncenter alignright alignjustify | code",
                        extended_valid_elements: "iframe[*]",
                        advcode_inline: true,
                      }}
                      onEditorChange={this.handleEditorChange}
                    />
                  </div>
                  <div className="spacer-10"></div>
                  <h5>標籤</h5>
                  <input
                    type="text"
                    name="item_title"
                    id="item_title"
                    className="form-control"
                    placeholder=""
                    onChange={this.onChangeTags}
                  />
                  <h5>
                    {this.state.type == 1
                      ? "獲獎年份"
                      : this.state.type == 2
                      ? "入學年份"
                      : this.state.type == 3
                      ? "發表年份"
                      : "獲獎年份"}
                  </h5>
                  <input
                    type="number"
                    name="item_title"
                    id="item_title"
                    className={`form-control ${
                      this.state.yearError && "error"
                    }`}
                    placeholder=""
                    onChange={this.onChangeYear}
                  />
                  {this.state.yearError && (
                    <p className="error-message">{this.state.yearError}</p>
                  )}
                  <div className="spacer-single"></div>
                  <div>
                    <h5>檔案</h5>
                    <div className="d-create-file">
                      <p id="file_name">PNG, JPG/JPEG or MP4. Max 200mb.</p>
                      {this.state.files.map((x) => (
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
                          onChange={this.onChangeMultiple}
                          accept=".mp4,.png,.jpg,.jpeg"
                        />
                      </div>
                    </div>
                    <div
                      id="delete_btn"
                      className="btn-main hide mt-2"
                      style={{ backgroundColor: "#900000" }}
                      onClick={this.deleteFiles}>
                      Delete Files
                    </div>
                    <div className="spacer-10"></div>
                  </div>
                  <div className="spacer-5"></div>
                  <input
                    type="button"
                    id="submit"
                    onClick={this.submit}
                    className="btn-main"
                    value="Create Post"
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

import React, { Component } from "react";
import { MaterialReactTable } from "material-react-table";
import { getAuthToken, getAuthUser } from "../components/auth";
import { Box } from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import ReactPlayer from "react-player";
import { HOST } from "../const";
class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusFilter: [],
      tagFilter: [],
      tagInput: [],
      posts: [],
      height: 0,
      toggleList: true,
    };
    this.onImgLoad = this.onImgLoad.bind(this);
  }
  columns = [
    {
      accessorKey: "title",
      header: "Title",
      muiTableHeadCellProps: { sx: { color: "black" } },
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
    {
      accessorKey: "user",
      header: "Username",
      muiTableHeadCellProps: { sx: { color: "black" } },
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
    {
      accessorKey: "name",
      header: "Name",
      muiTableHeadCellProps: { sx: { color: "black" } },
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
    {
      accessorKey: "englishName",
      header: "English Name",
      muiTableHeadCellProps: { sx: { color: "black" } },
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },

    {
      accessorKey: "year",
      header: "Year",
      muiTableHeadCellProps: { sx: { color: "black" } },
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
    {
      accessorKey: "status",
      header: "Status",
      filterFn: "equals",
      filterSelectOptions: [
        { text: "Pending", value: "0" },
        { text: "Approved", value: "1" },
        { text: "Rejected", value: "2" },
        { text: "Archived", value: "3" },
      ],
      filterVariant: "select",
      muiTableHeadCellProps: { sx: { color: "black" } },
      Cell: ({ renderedCellValue }) => (
        <div
          className="item_info_type col-auto m-2 rounded"
          style={{
            backgroundColor: `${
              renderedCellValue == 0
                ? "#fffcd4"
                : renderedCellValue == 1
                ? "#ddffd4"
                : renderedCellValue == 2
                ? "#ffd4f6"
                : "#d4d4ff"
            }`,
          }}>
          <strong>
            {renderedCellValue == 0
              ? "Pending"
              : renderedCellValue == 1
              ? "Approved"
              : renderedCellValue == 2
              ? "Rejected"
              : "Archived"}
          </strong>
        </div>
      ),
    },
  ];
  onImgLoad({ target: img }) {
    let currentHeight = this.state.height;
    if (currentHeight < img.offsetHeight) {
      this.setState({
        height: img.offsetHeight,
      });
    }
  }
  async updatePosts() {
    //console.log(getAuthUser())
    await axios
      .post(
        `http://${HOST}:8080/post`,
        { user: getAuthUser() },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      )
      .then((res) => {
        this.setState({
          posts: res.data,
        });
      })
      .catch((err) => {
        console.log(err.response || err);
      });
  }

  getPosts() {
    return this.state.posts;
  }
  componentDidMount() {
    this.updatePosts();
  }
  onChangeTags = (e) => {
    if (!e.target.value) {
      this.setState({ tagInput: null });
    } else {
      const lower = e.target.value
        .replace(/\s/g, "")
        .split(",")
        .map((element) => {
          return element.toLowerCase();
        });
      this.setState({ tagInput: lower });
    }
  };
  onSubmitTags = () => {
    let newTagFilter = this.state.tagFilter;
    this.state.tagInput.map((element) => {
      if (!this.state.tagFilter.includes(element)) {
        newTagFilter.push(element);
      }
    });
    this.setState({ tagFilter: newTagFilter });
  };
  onClickTag = (element) => {
    let newTagFilter = this.state.tagFilter;
    if (!this.state.tagFilter.includes(element)) {
      newTagFilter.push(element);
    }
    this.setState({ tagFilter: newTagFilter });
  };
  deleteTag = (element) => {
    let newTagFilter = this.state.tagFilter;
    newTagFilter = newTagFilter.filter((item) => item !== element);
    this.setState({ tagFilter: newTagFilter });
  };
  intersec = (arr1, arr2) => {
    const set2 = new Set(arr2);
    for (const element of arr1) {
      if (set2.has(element)) {
        return true;
      }
    }
    return false;
  };

  onCheck = (e) => {
    let newStatusFilter = this.state.statusFilter;
    if (e.target.checked) {
      switch (e.target.id) {
        case "pending":
          newStatusFilter.push(0);
          break;
        case "approved":
          newStatusFilter.push(1);
          break;
        case "rejected":
          newStatusFilter.push(2);
          break;
        case "archived":
          newStatusFilter.push(3);
          break;
      }
    } else {
      switch (e.target.id) {
        case "pending":
          newStatusFilter = newStatusFilter.filter((item) => item !== 0);
          break;
        case "approved":
          newStatusFilter = newStatusFilter.filter((item) => item !== 1);
          break;
        case "rejected":
          newStatusFilter = newStatusFilter.filter((item) => item !== 2);
          break;
        case "archived":
          newStatusFilter = newStatusFilter.filter((item) => item !== 3);
          break;
      }
    }
    this.setState({ statusFilter: newStatusFilter });
  };
  render() {
    return (
      <div>
        <div style={{ paddingLeft: "120px" }}>
          <input
            type="button"
            id="submit"
            onClick={() => {
              this.setState({ toggleList: !this.state.toggleList });
              this.updatePosts();
            }}
            className="btn-main col"
            value="Switch View"
          />
        </div>

        <div className="container">
          {this.state.toggleList ? (
            <div className="row">
              <div className="col-md-3">
                <div className="item_filter_group position-fixed">
                  <h4>Select Categories</h4>
                  <div>
                    <input
                      id="pending"
                      onChange={this.onCheck}
                      checked={this.state.statusFilter.includes(0)}
                      type="checkbox"
                    />
                    <label>Pending</label>
                  </div>
                  <div>
                    <input
                      id="approved"
                      onChange={this.onCheck}
                      checked={this.state.statusFilter.includes(1)}
                      type="checkbox"
                    />
                    <label>Approved</label>
                  </div>
                  <div>
                    <input
                      id="rejected"
                      onChange={this.onCheck}
                      checked={this.state.statusFilter.includes(2)}
                      type="checkbox"
                    />
                    <label>Rejected</label>
                  </div>
                  <div>
                    <input
                      id="archived"
                      onChange={this.onCheck}
                      checked={this.state.statusFilter.includes(3)}
                      type="checkbox"
                    />
                    <label>Archived</label>
                  </div>
                  <input
                    type="text"
                    name="item_title"
                    id="item_title"
                    className="form-control mt-1"
                    placeholder="Tags for sorting comma separated"
                    onChange={this.onChangeTags}
                  />
                  <button
                    type="submit"
                    className="btn-main"
                    onClick={this.onSubmitTags}>
                    Add Tags
                  </button>
                  <div className="item_info_counts row ml-2">
                    {this.state.tagFilter.map((tag) => (
                      <div
                        className="item_info_type col-auto m-2 rounded"
                        onClick={() => {
                          this.deleteTag(tag);
                        }}
                        style={{ backgroundColor: "#d4efff" }}>
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="col-md-9">
                <div className="row">
                  {this.state.posts.length != 0 ? (
                    this.state.posts.map((post, index) =>
                      ((this.state.statusFilter.length == 0 &&
                        post.status != 3) ||
                        this.state.statusFilter.includes(post.status)) &&
                      (this.state.tagFilter.length == 0 ||
                        this.intersec(this.state.tagFilter, post.category)) ? (
                        <div
                          key={index}
                          className="d-item col-lg-4 col-md-6 col-sm-6 col-xs-12 mb-4">
                          <div className="nft__item m-0">
                            <div
                              className="nft__item_wrap p-4"
                              style={{ height: `${this.state.height}px` }}>
                              <a
                                onClick={() =>
                                  window.open(`/review/${post._id}`, "_self")
                                }
                                style={{ cursor: "pointer" }}>
                                {post.media[0] ? (
                                  post.media[0].extension == "mp4" ? (
                                    <ReactPlayer
                                      width="300"
                                      url={post.media[0].link}
                                    />
                                  ) : (
                                    <img
                                      onLoad={this.onImgLoad}
                                      src={post.media[0].link}
                                      className="lazy nft__item_preview"
                                      alt=""
                                    />
                                  )
                                ) : (
                                  <></>
                                )}
                              </a>
                            </div>
                            <div className="mt-2"></div>
                            <div className="nft__item_info mb-1">
                              <span
                                onClick={() =>
                                  window.open(`/review/${post._id}`, "_self")
                                }>
                                <h4>{post.title}</h4>
                              </span>
                              <div className="nft__item_price">
                                <a
                                  onClick={() =>
                                    window.open(`/review/${post._id}`, "_self")
                                  }>
                                  {post.name}{" "}
                                  {`${
                                    post.englishName
                                      ? "(" + post.englishName + ")"
                                      : ""
                                  }`}
                                  - {post.year}
                                </a>
                              </div>
                              <div className="item-info ">
                                <div className="item_info_counts row ml-2">
                                  {post.category.map((tag) => (
                                    <div
                                      className="item_info_type col-auto m-2 rounded"
                                      onClick={() => {
                                        this.onClickTag(tag);
                                      }}
                                      style={{ backgroundColor: "#d4efff" }}>
                                      {tag}
                                    </div>
                                  ))}
                                  <div
                                    className="item_info_type col-auto m-2 rounded"
                                    style={{
                                      backgroundColor: `${
                                        post.status == 0
                                          ? "#fffcd4"
                                          : post.status == 1
                                          ? "#ddffd4"
                                          : post.status == 2
                                          ? "#ffd4f6"
                                          : "#d4d4ff"
                                      }`,
                                    }}>
                                    {post.status == 0
                                      ? "Pending"
                                      : post.status == 1
                                      ? "Approved"
                                      : post.status == 2
                                      ? "Rejected"
                                      : "Archived"}
                                  </div>
                                </div>{" "}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <></>
                      )
                    )
                  ) : (
                    <p>No Results</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <>
              {this.state.posts ? (
                <div>
                  <MaterialReactTable
                    columns={this.columns}
                    data={this.state.posts}
                    editingMode="modal"
                    enableEditing
                    onEditingRowSave={this.handleSaveRow}
                    renderRowActions={({ row, table }) => (
                      <Box sx={{ display: "flex", gap: "1rem" }}>
                        <input
                          type="button"
                          onClick={() =>
                            window.open(`/review/${row.original._id}`, "_self")
                          }
                          className="btn-main"
                          value="View"
                        />
                      </Box>
                    )}
                  />
                </div>
              ) : (
                <></>
              )}
            </>
          )}
        </div>
      </div>
    );
  }
}
export default Review;

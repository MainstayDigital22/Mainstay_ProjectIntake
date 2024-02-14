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
      accessorKey: "username",
      header: "Username",
      muiTableHeadCellProps: { sx: { color: "black" } },
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
    {
      accessorKey: "domainURL",
      header: "Domain",
      muiTableHeadCellProps: { sx: { color: "black" } },
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
    {
      accessorKey: "category",
      header: "Service Type",
      filterFn: "equals",
      filterSelectOptions: [
        { text: "PBC", value: "1" },
        { text: "SEO", value: "2" },
        { text: "Web Maintain & Gov", value: "3" },
        { text: "Website Build", value: "4" },
        { text: "App Build", value: "5" },
      ],
      filterVariant: "select",
      muiTableHeadCellProps: { sx: { color: "black" } },
      Cell: ({ renderedCellValue }) => (
        <strong>
          {renderedCellValue == 1
            ? "PBC"
            : renderedCellValue == 2
            ? "SEO"
            : renderedCellValue == 3
            ? "Web Maintain & Gov"
            : renderedCellValue == 4
            ? "Website Build"
            : "App Build"}
        </strong>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      filterFn: "equals",
      filterSelectOptions: [
        { text: "ASAP", value: "ASAP" },
        { text: "high", value: "high" },
        { text: "medium", value: "medium" },
        { text: "low", value: "low" },
      ],
      filterVariant: "select",
      muiTableHeadCellProps: { sx: { color: "black" } },
      Cell: ({ renderedCellValue }) => (
        <div
          className="item_info_type col-auto m-2 rounded"
          style={{
            backgroundColor: `${
              renderedCellValue == "ASAP"
                ? "#ee8888"
                : renderedCellValue == "high"
                ? "#ffccaa"
                : renderedCellValue == "medium"
                ? "#f5f555"
                : "#55bbff"
            }`,
          }}>
          <strong>{renderedCellValue}</strong>
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
    await axios
      .post(
        `http://${HOST}:8080/ticket`,
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

  render() {
    return (
      <div className="container">
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
      </div>
    );
  }
}
export default Review;

import { Box } from "@mui/material";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { MaterialReactTable } from "material-react-table";
import React, { Component } from "react";
import { getAuthLevel, getAuthToken, getAuthUser } from "../components/auth";
import { HOST } from "../const";
class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      statusFilter: [],
      tagFilter: [],
      tagInput: [],
      posts: [],
      status: 'open',
      height: 0,
      toggleList: true,
    };
    this.onImgLoad = this.onImgLoad.bind(this);
  }
  columns = [
    {
      accessorKey: "title",
      size:200,
      header: "Title",
      muiTableHeadCellProps: { sx: { color: "black"}},
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
    {
      accessorKey: "username",
      header: "Username",
      size:50,
      muiTableHeadCellProps: { sx: { color: "black"} },
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
    {
      accessorKey: "domainURL",
      header: "Domain",
      size:70,
      muiTableHeadCellProps: { sx: { color: "black"} },
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
    {
      accessorKey: "category",
      header: "Service Type",
      filterFn: "equals",
      size:50,
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
          className="item_info_type col-auto m-2 rounded priority"
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
  handleDelete = (id) => {
    if (!window.confirm(`Delete this ticket?`)) {
      return;
    }

    axios
      .delete(`http://${HOST}:8080/ticket/${id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then((res) => {
        alert('Ticket deleted');
        window.location.reload(false);
      })
      .catch((err) => alert(err.response.data));
  };
  async updatePosts() {
    await axios
      .post(
        `http://${HOST}:8080/ticket`,
        { user: getAuthUser(), status: this.state.status },
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
              layoutMode="semantic"
              onEditingRowSave={this.handleSaveRow}
              renderRowActions={({ row, table }) => (
                <Box sx={{ display: "flex", gap: "1rem"}}>
                  <button
  onClick={() => window.open(`/review/${row.original._id}`, "_self")}
  className="btn-action"
  title="View">
  <i class="fas fa-eye"></i> 
</button>

{getAuthLevel()=='admin'&&<button
  onClick={() => this.handleDelete(row.original._id)}
  className="btn-action"
  title="Delete">
  <i class="fas fa-trash"></i>
</button>
}
<button
  onClick={() => window.open(`/edit/${row.original._id}`, "_self")}
  className="btn-action"
  title="Edit">
  <i class="fas fa-pencil-alt"></i>
</button>

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

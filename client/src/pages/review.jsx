import { Box } from "@mui/material";
import axios from "axios";
import { asterisk } from "../assets";
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
      showAction: true,
      showClosed: false,
      showOverdue: false,
      showProgress: false,
      height: 0,
      toggleList: true,
    };
    this.onImgLoad = this.onImgLoad.bind(this);
  }
  columns = [
    {
      accessorKey: "title",
      size: 200,
      header: "Title",
      muiTableHeadCellProps: { sx: { color: "black" } },
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
    {
      accessorKey: "username",
      header: "Username",
      size: 50,
      muiTableHeadCellProps: { sx: { color: "black" } },
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
    {
      accessorKey: "domainURL",
      header: "Domain",
      size: 70,
      muiTableHeadCellProps: { sx: { color: "black" } },
      Cell: ({ renderedCellValue }) => <strong>{renderedCellValue}</strong>,
    },
    {
      accessorKey: "category",
      header: "Service Type",
      filterFn: "equals",
      size: 50,
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
    if (!window.confirm(`Are you sure you want to delete this ticket?`)) {
      return;
    }

    axios
      .delete(`${HOST}/ticket/${id}`, {
        headers: { Authorization: `Bearer ${getAuthToken()}` },
      })
      .then((res) => {
        alert("Ticket deleted");
        window.location.reload(false);
      })
      .catch((err) => alert(err.response.data));
  };
  async updatePosts() {
    const filters = [];
    if (this.state.showAction) filters.push("new", "pending review");
    if (this.state.showProgress) filters.push("pending response");
    if (this.state.showClosed) filters.push("completed", "closed");

    await axios
      .post(
        `${HOST}/ticket`,
        {
          username: getAuthUser(),
          //status: filters,
        },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      )
      .then((res) => {
        const posts = res.data;
        const actionNeededCount = posts.filter(
          (post) => post.status === "new" || post.status === "pending review"
        ).length;
        const inProgressCount = posts.filter(
          (post) => post.status === "pending response"
        ).length;
        const overdueCount = posts.filter(
          (post) => post.status === "overdue"
        ).length; // Adjust based on actual logic
        const closedCount = posts.filter(
          (post) => post.status === "completed" || post.status === "closed"
        ).length;

        this.setState({
          posts: posts.filter((post) => filters.includes(post.status)),
          actionNeededCount,
          inProgressCount,
          overdueCount,
          closedCount,
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
        <div className="row welcome-ticket">
          <div className="col title">
            <h1>Welcome {getAuthUser()}!</h1>
          </div>
          <div className="create col">
            <a href="/new-ticket">
              <div className="btn">
                <div className="row">
                  <div className="icon col-2">
                    <img src={asterisk} />
                  </div>
                  <p className="col">Create a Ticket</p>
                </div>
              </div>
            </a>
          </div>
        </div>

        {this.state.posts ? (
          <>
            <div className="row status">
              <button
                className={`col ${
                  this.state.showAction ? "status-active" : "status-inactive"
                }`}
                onClick={() => {
                  this.setState({ showAction: !this.state.showAction }, () =>
                    this.updatePosts()
                  );
                }}>
                <h1>{this.state.actionNeededCount}</h1>
                <h3>Action Needed</h3>
              </button>

              <button
                className={`col ${
                  this.state.showProgress ? "status-active" : "status-inactive"
                }`}
                onClick={() => {
                  this.setState(
                    { showProgress: !this.state.showProgress },
                    () => this.updatePosts()
                  );
                }}>
                <h1>{this.state.inProgressCount}</h1>
                <h3>In Progress</h3>
              </button>
              <button
                className={`col ${
                  this.state.showOverdue ? "status-active" : "status-inactive"
                }`}
                onClick={() => {
                  this.setState({ showOverdue: !this.state.showOverdue }, () =>
                    this.updatePosts()
                  );
                }}>
                <h1>{this.state.overdueCount}</h1>
                <h3>Overdue</h3>
              </button>
              <button
                className={`col ${
                  this.state.showClosed ? "status-active" : "status-inactive"
                }`}
                onClick={() => {
                  this.setState({ showClosed: !this.state.showClosed }, () =>
                    this.updatePosts()
                  );
                }}>
                <h1>{this.state.closedCount}</h1>
                <h3>Closed</h3>
              </button>
            </div>
            <div>
              <MaterialReactTable
                columns={this.columns}
                data={this.state.posts}
                editingMode="modal"
                enableEditing
                layoutMode="semantic"
                onEditingRowSave={this.handleSaveRow}
                renderRowActions={({ row, table }) => (
                  <Box sx={{ display: "flex", gap: "1rem" }}>
                    <button
                      onClick={() =>
                        window.open(`/review/${row.original._id}`, "_self")
                      }
                      className="btn-action"
                      title="View">
                      <i className="fas fa-eye"></i>
                    </button>

                    {getAuthLevel() == "admin" && (
                      <button
                        onClick={() => this.handleDelete(row.original._id)}
                        className="btn-action"
                        title="Delete">
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                    <button
                      onClick={() =>
                        window.open(`/edit/${row.original._id}`, "_self")
                      }
                      className="btn-action"
                      title="Edit">
                      <i className="fas fa-pencil-alt"></i>
                    </button>
                  </Box>
                )}
              />
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    );
  }
}
export default Review;

import React from "react";
export function Label({ status }) {
  return (
    <div
      className="status-label"
      style={{
        backgroundColor:
          status == "pending response"
            ? "#EAC6B7"
            : status == "pending review"
            ? "#EADCAB"
            : status == "new"
            ? "#C7EAB7"
            : "#DEE4EF",
      }}>
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor:
            status == "pending response"
              ? "#625D4D"
              : status == "pending review"
              ? "#625D4D"
              : status == "new"
              ? "#56873F"
              : "#4D70B1",
        }}></div>
      <p
        className="status-label-p"
        style={{
          color:
            status == "pending response"
              ? "#625D4D"
              : status == "pending review"
              ? "#624D4D"
              : status == "new"
              ? "#56873F"
              : "#4D70B1",
        }}>
        {status
          .split(" ")
          [status.split(" ").length - 1].charAt(0)
          .toUpperCase() +
          status.split(" ")[status.split(" ").length - 1].slice(1)}
      </p>
    </div>
  );
}

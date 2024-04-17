import React from "react";
import { getAuthLevel } from "./auth";
export function Label({ status }) {
  return (
    <div
      className="status-label"
      style={{
        backgroundColor: ["closed", "completed"].includes(status)
          ? "#DEE4EF"
          : status == "new" || getAuthLevel() == "client"
          ? "#C7EAB7"
          : status == "pending response"
          ? "#EAC6B7"
          : "#EADCAB",
      }}>
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: ["closed", "completed"].includes(status)
            ? "#4D70B1"
            : status == "new" || getAuthLevel() == "client"
            ? "#56873F"
            : status == "pending response"
            ? "#625D4D"
            : "#624D4D",
        }}></div>
      <p
        className="status-label-p"
        style={{
          color: ["closed", "completed"].includes(status)
            ? "#4D70B1"
            : status == "new" || getAuthLevel() == "client"
            ? "#56873F"
            : status == "pending response"
            ? "#625D4D"
            : "#624D4D",
        }}>
        {getAuthLevel() == "client"
          ? ["closed", "completed"].includes(status)
            ? "Closed"
            : "Open"
          : status
              .split(" ")
              [status.split(" ").length - 1].charAt(0)
              .toUpperCase() +
            status.split(" ")[status.split(" ").length - 1].slice(1)}
      </p>
    </div>
  );
}

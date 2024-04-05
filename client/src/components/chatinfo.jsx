import React from "react";
import { Label } from "./label";

export function ChatInfo({ post }) {
  const options = {
    timeZone: "America/Chicago",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };
  const dateonly = {
    timeZone: "America/Chicago",
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  return (
    <div className="chat-infos">
      <div className="chat-info-1">
        <div>
          <p>{new Date(post.created).toLocaleString("en-US", options)}</p>
        </div>
        <div style={{ marginLeft: 24 }}>
          <p>{post._id}</p>
        </div>
      </div>
      <div className="chat-info-2">
        <div>
          <h1>{post.title}</h1>
        </div>
        <Label status={post.status} />
      </div>
      <div className="chat-info-3">
        <div>
          <p>{post.organization.companyName}</p>
        </div>
        <div>
          <p>
            Deadline:{" "}
            {new Date(post.deadline).toLocaleString("en-US", dateonly)}
          </p>
        </div>
        <div>
          <p>{post.domainURL}</p>
        </div>
      </div>
    </div>
  );
}

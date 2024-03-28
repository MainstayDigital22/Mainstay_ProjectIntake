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
  return (
    <div className="chat-infos">
      <div className="chat-info-1">
        <div>
          <p>{new Date(post.deadline).toLocaleString("en-US", options)}</p>
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
          <p>{post.username}</p>
        </div>
        <div>
          <p>{new Date(post.deadline).toLocaleString("en-US", options)}</p>
        </div>
        <div>
          <p>{post.domainURL}</p>
        </div>
      </div>
    </div>
  );
}

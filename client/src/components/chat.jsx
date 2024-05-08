import React, { useState } from "react";
import "react-chat-elements/dist/main.css";
import axios from "axios";
import { HOST } from "../const";
import {
  msgcode,
  msgfile,
  msgimg,
  msgmic,
  profilePlaceholder,
  threedots,
} from "../assets";
import { getAuthLevel, getAuthUser, getAuthToken } from "./auth";

export function Chat({ post, callback }) {
  const [chat, setChat] = useState(post.chat);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  let message =
    chat.length !== 0
      ? chat
          .filter((msg) => msg.messageType === "text")
          .map((msg) => ({
            type: "text",
            user: msg.username,
            content: msg.content,
            time: msg.time,
            isClient: msg.isClient,
          }))
      : undefined;

  const handleInputChange = (e) => {
    setChatInput(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    await addChat(chatInput, "text"); // Add the chat message as text
    setChatInput(""); // Clear the input after sending
  };

  const addChat = async (text, type) => {
    if (isSendingChat || !text.trim()) return;

    const newChatMessage = {
      isClient: getAuthLevel() === "client",
      content: text,
      messageType: type, // Specify the type of the message
      username: getAuthUser(),
      time: Date.now(),
    };

    // Optimistic UI update
    setChat((prevChat) => [...prevChat, newChatMessage]);
    setIsSendingChat(true);

    try {
      const response = await axios.post(
        `${HOST}/ticket/update/${post._id}`,
        {
          chat: [...chat, newChatMessage],
          status:
            getAuthLevel() === "client" ? "pending review" : "pending response",
        },
        { headers: { Authorization: `Bearer ${getAuthToken()}` } }
      );
      // Handle successful response if necessary
    } catch (err) {
      console.error(err.response || err);
      // Handle error (e.g., rollback optimistic update)
    } finally {
      setIsSendingChat(false);
      callback();
    }
  };

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
    <div className="chat-messenger">
      {message &&
        message.map((msg) => {
          const isRight = msg.isClient == (getAuthLevel() === "client");
          return (
            <div className="chat-msg">
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexDirection: isRight ? "row-reverse" : "row",
                }}>
                {isRight && (
                  <div className="threedots">
                    <img src={threedots} />
                  </div>
                )}
                <img src={profilePlaceholder} />
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "calc(100% - 85px)",
                  }}>
                  <div
                    className="chat-msg-title"
                    style={{ flexDirection: isRight ? "row-reverse" : "row" }}>
                    <h3>{msg.user}</h3>
                  </div>
                  <div
                    className="chat-msg-date"
                    style={{ flexDirection: isRight ? "row-reverse" : "row" }}>
                    <div>
                      <p>
                        {new Date(msg.time).toLocaleString("en-US", options)}
                      </p>
                    </div>
                  </div>
                  <div className="chat-msg-description">
                    <p
                      style={{
                        textAlign: isRight ? "right" : "left",
                      }}>
                      {msg.content}
                    </p>
                  </div>
                </div>

                {!isRight && (
                  <div className="threedots">
                    <img src={threedots} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      <div className="chat-input">
        <div style={{ display: "flex", gap: 12 }}>
          <img src={profilePlaceholder} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}>
            <textarea
              value={chatInput}
              onChange={handleInputChange}
              disabled={post.status === "closed"}
              placeholder={post.status === "closed" ? "Ticket is closed" : ""}
            />
            <form
              onSubmit={handleFormSubmit}
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}>
              <div className="chat-toolbar">
                <img src={msgimg} style={{ width: 13 }} />
                <img src={msgmic} style={{ width: 17 }} />
                <img src={msgcode} style={{ width: 16 }} />
                <img src={msgfile} style={{ width: 15 }} />
              </div>
              <button className="chat-btn" type="submit">
                <p>Send Response</p>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

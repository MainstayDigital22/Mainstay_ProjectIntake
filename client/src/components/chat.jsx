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

export function Chat({ post }) {
  const [chat, setChat] = useState(post.chat);
  const [isSendingChat, setIsSendingChat] = useState(false);
  const [chatInput, setChatInput] = useState("");
  let message =
    chat.length !== 0
      ? chat.map((msg) => ({
          type: "text",
          user: msg.username,
          text: msg.message,
        }))
      : undefined;
  const handleInputChange = (e) => {
    setChatInput(e.target.value);
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    await addChat(chatInput); // Add the chat message
    setChatInput(""); // Clear the input after sending
  };
  const addChat = async (text) => {
    if (isSendingChat || !text.trim()) return;

    const newChatMessage = {
      isClient: getAuthLevel() === "client",
      message: text,
      username: getAuthUser(),
    };

    // Optimistic UI update
    setChat((prevChat) => [...prevChat, newChatMessage]);
    setIsSendingChat(true);
    setChatInput(""); // Clear input for immediate feedback

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
    }
  };
  return (
    <div className="chat-messenger">
      {message &&
        message.map((msg) => (
          <div className="chat-msg">
            <div style={{ display: "flex", gap: 12 }}>
              <img src={profilePlaceholder} />
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "100%",
                }}>
                <div className="chat-msg-title">
                  <h3>{msg.user}</h3>
                  <img src={threedots} />
                </div>
                <div className="chat-msg-date">
                  <div>
                    <p>{msg.text}</p>
                  </div>
                  <div>
                    <p>{msg.text}</p>
                  </div>
                </div>
                <div className="chat-msg-description">
                  <p>{msg.text}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      <div className="chat-input">
        <div style={{ display: "flex", gap: 12 }}>
          <img src={profilePlaceholder} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
            }}>
            <textarea value={chatInput} onChange={handleInputChange} />
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

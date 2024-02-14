import React, { useState, useEffect } from "react";
import logo from "./logo.svg";
import noimage from "./user.jpg";
import "./App.css";
import { socket } from "./socket";

function App() {
  let [isOnline, setIsOnline] = useState(false);
  let [userStage, setUserStage] = useState(1);
  let [userNotyNumber, setUserNotyNumber] = useState(1);
  let [msgValue, setMsgValue] = useState("");
  let [allChatMessages, setAllChateMessages] = useState([]);

  const sendMessage = (evt) => {
    evt.preventDefault();
    if (msgValue.trim() == "") return;
    console.log("sending message");
    var msgData = {
      from: "Machine",
      to: "David",
      msg: msgValue,
      time: new Date().toLocaleTimeString(),
    };
    socket.emit("sendMessage", msgData);
  };

  useEffect(
    function () {
      socket.connect();

      socket.emit("setUserUp", {
        name: "David",
        isOnline: false,
        id: 1234,
      });

      socket.on("finishUserSetUp", (data) => {
        if (data.isOnline != null) {
          setIsOnline(data.isOnline);
        }
      });

      socket.on("showUserStage", (data) => {
        setUserStage(data.stage);
      });

      socket.on("updateNoty", (data) => {
        setUserNotyNumber(data);
      });

      socket.on("getGroupMessages", (data) => {
        setAllChateMessages(data);
      });
    },
    [allChatMessages]
  );

  return (
    <>
      <div className="main-wrapper">
        <h3>
          David{" "}
          <span
            id="online-color"
            className={`${isOnline ? "c-green" : "c-gold"}`}
          >
            o
          </span>
        </h3>
        <img src={noimage} />
        <button>Chat</button>
        <br />
        <p>Stage: {userStage}</p>
        <p>Notifications: {userNotyNumber}</p>
        <button id="clearbtn" onClick={() => setAllChateMessages([])}>Clear messages</button>

      </div>
      <form onSubmit={sendMessage}>
        <input
          onChange={(evt) => setMsgValue(evt.target.value)}
          placeholder="send message"
        />
        <button type="submit">Send</button>
        <br/>

        <p>Messages:</p>
        {allChatMessages.map((m) => (
          <div className="msgCotent">
            <small>msg: {m.msg}</small>
            <br/>
            <small>from: {m.from}</small>
            <br />
            <small>time: {m.time}</small>
          </div>
        ))}
      </form>
      <br />
      <hr />
    </>
  );
}

export default App;

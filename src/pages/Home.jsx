import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
const Home = () => {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();
  function createNewRoom(e) {
    e.preventDefault();
      setRoomId(uuidv4());
      toast.success("Created a new room");
  }
  function joinRoom() {
      if (!roomId || !username) {
           toast.error("ROOM ID & username is required");
          return;
      }
      navigate(`/editor/${roomId}`,
          { state: { username } }
      );
    }
    function handleInputEnter(e) {
      if (e.code === "Enter") {
        joinRoom();
      }
    }
  return (
    <>
      <div className="homePageWrapper">
        <div className="formWrapper">
          <img
            src="/images/interview-sync-logo.png"
            alt="interview-sync-logo"
            className="homePageLogo"
          />

          <h4 className="mainLabel">Paste invitation ROOM ID</h4>
          {/* input group box */}
          <div className="inputGroup">
            <input
              type="text"
              className="inputBox"
              placeholder="ROOM ID"
              onChange={(e) => setRoomId(e.target.value)}
              value={roomId}
              onKeyUp={handleInputEnter}
            />
            <input
              type="text"
              className="inputBox"
              placeholder="USERNAME"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              onKeyUp={handleInputEnter}
            />
            <button className="btn joinBtn" onClick={joinRoom}>
              Join
            </button>
            <span className="createInfo">
              If you don't have an invite then create &nbsp;
              <a
                href="#"
                className="createNewBtn gradientText"
                onClick={createNewRoom}
              >
                new room
              </a>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

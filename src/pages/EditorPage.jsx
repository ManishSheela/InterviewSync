import React, { useState, useRef, useEffect } from "react";
import Editor from "../components/Editor";
import Client from "../components/Client";
import { initSocket } from "../socket";
import ACTIONS, { JOINED } from "../Action";
import toast from "react-hot-toast";
import {
  useLocation,
  useNavigate,
  Navigate,
  useParams,
} from "react-router-dom";

const EditorPage = () => {
  const [clients, setClients] = useState([]);

  const { roomId } = useParams(); // get roomId from URL
  // useRef to store data on multiple render and after changing the data component won't re-render
  const socketRef = useRef(null);
  const location = useLocation(); // to get the data from Home page navigate() state
  const reactNavigator = useNavigate();

  // handling error when socket.io has some problem
  function handleError(e) {
    console.log("socket_error", e);
    toast.error("Socket connection failed, try again later.");
    reactNavigator("/");
  }
  // useEffect render only once when there is no dependency array
  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket(); // .current when using useRef
      console.log("-->", socketRef.current);
      // error handling
      socketRef.current.on("connect_error", (err) => handleError(err));
      socketRef.current.on("connect_failed", (err) => handleError(err));

      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username, // for some reason we don't get username then we handle error using ?
      });
      // Listeing for joined event
      socketRef.current.on(
        ACTIONS.JOINED,
        ({ clients, username, socketId }) => {
          if (username !== location.state.username) {
            toast.success(`${username} joined the room.`, { duration: 4000});
            console.log(`${username} joined`);
          }
          setClients(clients);
        }
      );

      // listening for disconnecting
      socketRef.current.on(
        ACTIONS.DISCONNECTED,
        ({ username, socketId }) => {
         
            toast.success(`${username} left the room.`, { duration: 4000 });        
          setClients((prev) => {
            return prev.filter((client) => client.socketId !== socketId);
          });
        }
      );

    };
    init();
    // clear the listners --> cleaning functions
    return () => {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);


    }
  }, []);
  if (!location.state) {
    // agar username nhi mila to home page pe redirect kr denge
    return <Navigate to="/" />;
  }


  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID has been copied to your clipboard");
    } catch (err) {
      toast.error("Could not copy the Room ID");
      console.error(err);
    }
  }
  function leaveRoom() {
    reactNavigator("/");
  }
  return (
    <>
      <div className="mainWrapper">
        {/* // left side bar */}
        <div className="left-side-bar">
          <div className="asideInner">
            <div className="logo">
              <img
                className="logoImage"
                src="/images/interview-sync-logo.png"
                alt="interview-sync-logo"
              />
            </div>
            <h3>Connected</h3>
            <div className="clientsList">
              {clients.map((items) => (
                <Client key={items.socketId} username={items.username} />
              ))}
            </div>
          </div>

          <button className="btn copyBtn" onClick={copyRoomId}>
            Copy ROOM ID
          </button>
          <button className="btn leaveBtn" onClick={leaveRoom}>
            Leave
          </button>
        </div>
        {/* // Editor  */}
        <div className="editorWrapper">
          <Editor />
        </div>
        {/* // right side bar  */}
        <div className="right-side-bar">
          <div>
            <label htmlFor="input">Input</label>
            <textarea id="input"></textarea>
          </div>
          <div>
            <label htmlFor="output">Output</label>
            <textarea id="output"></textarea>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditorPage;

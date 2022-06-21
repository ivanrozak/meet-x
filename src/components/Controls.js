import { useContext, useState } from "react";
import { SocketContext } from "../contexts/SocketContext";
import CopyToClipboard from "react-copy-to-clipboard";
import Alert from "./Alert";
import IconButton from "./IconButton";
import {
  Mic,
  MicMute,
  Camera,
  CameraDisabled,
  Menu,
  Clipboard,
  Call,
  HangUp,
} from "./Icons";

const Controls = ({ myVideo }) => {
  const {
    me,
    callAccepted,
    name,
    setName,
    callEnded,
    leaveCall,
    callUser,
    call,
  } = useContext(SocketContext);

  const [idToCall, setIdToCall] = useState("");
  const [micEnabled, setMicEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [showCallMenu, setShowCallMenu] = useState(false);

  const toggleAudio = () => {
    myVideo.current.srcObject.getAudioTracks()[0].enabled =
      !myVideo.current.srcObject.getAudioTracks()[0].enabled;
    setMicEnabled((prev) => !prev);
    setShowCallMenu(false);
    setShowMenu(false);
  };

  const toggleVideo = () => {
    myVideo.current.srcObject.getVideoTracks()[0].enabled =
      !myVideo.current.srcObject.getVideoTracks()[0].enabled;
    setVideoEnabled((prev) => !prev);
    setShowCallMenu(false);
    setShowMenu(false);
  };

  const onNameChange = (e) => {
    setName(e.target.value);
    window.localStorage.setItem("name", e.target.value);
  };

  return (
    <>
      <div className="fixed bottom-20 bg-actionBackgroundHover rounded-md mb-2">
        <Alert />
        {showMenu && !callAccepted && !call.isReceivingCall && (
          <div className="flex flex-col gap-1 p-4">
            <label className="text-sm">Name </label>
            <input
              type="text"
              placeholder="Enter name here"
              className="pl-2 h-10 rounded-md"
              value={name}
              onChange={onNameChange}
            />
          </div>
        )}
        {showCallMenu && !call.isReceivingCall && !callAccepted && (
          <div className="p-4 flex items-center">
            <input
              type="text"
              placeholder="ID to call"
              className="pl-2 h-10 rounded-md"
              value={idToCall}
              onChange={(e) => setIdToCall(e.target.value)}
            />
            {callAccepted && !callEnded ? (
              <button
                className="rounded-md px-4 py-2 ml-4 cursor-pointer bg-actionBackgroundHover"
                onClick={leaveCall}
              >
                <HangUp />
              </button>
            ) : (
              <button
                className="rounded-md px-4 py-2 ml-4 cursor-pointer bg-actionBackgroundHover"
                onClick={() => callUser(idToCall)}
              >
                <Call />
              </button>
            )}
          </div>
        )}
      </div>
      <div className="fixed bottom-4 flex justify-center items-center bg-actionBackground rounded-xl overflow-hidden">
        <IconButton onClick={toggleAudio}>
          {micEnabled ? <Mic /> : <MicMute />}
        </IconButton>
        <IconButton onClick={toggleVideo}>
          {videoEnabled ? <Camera /> : <CameraDisabled />}
        </IconButton>
        {!callAccepted && (
          <CopyToClipboard text={me}>
            <IconButton
              onClick={() => {
                setShowCallMenu(false);
                setShowMenu(false);
                alert("ID copied to clipboard");
              }}
            >
              <Clipboard />
            </IconButton>
          </CopyToClipboard>
        )}
        {callAccepted && !callEnded && (
          <IconButton onClick={leaveCall}>
            <HangUp />
          </IconButton>
        )}
        {!callAccepted && (
          <>
            <IconButton
              onClick={() => {
                setShowMenu(false);
                setShowCallMenu((prev) => !prev);
              }}
            >
              <Call />
            </IconButton>
            <IconButton
              onClick={() => {
                setShowCallMenu(false);
                setShowMenu((prev) => !prev);
              }}
            >
              <Menu />
            </IconButton>
          </>
        )}
      </div>
    </>
  );
};

export default Controls;

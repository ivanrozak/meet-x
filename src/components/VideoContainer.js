import { useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";
import Controls from "./Controls";

const VideoContainer = () => {
  const { callAccepted, myVideo, userVideo, callEnded, stream, inputDevices, selectedDevice, setSelectedDevice, switchDevice, localPeer } =
    useContext(SocketContext);

  function handleChange(e) {
    const value = e.target.value
    console.log('switch device button', value)
    switchDevice(value)
    setSelectedDevice(value)
  }

  return (
    <>
      <div className="bg-white fixed max-w-full z-30">
        <div>{stream && stream.getTracks().map((item, index) => (
          <div key={index}>{item.getSettings().deviceId}</div>
        ))}</div>
        <div className="w-full overflow-auto">{localPeer && JSON.stringify(localPeer.streams[0].getAudioTracks()[0].getSettings())}</div>
        <div className="w-full overflow-auto">{localPeer && JSON.stringify(localPeer.streams[0].getVideoTracks()[0].getSettings())}</div>
        <select value={selectedDevice} onChange={handleChange}>
          {inputDevices.map((item, index) => (
            <option value={item.deviceId} key={index}>{item.label}</option>
          ))}
        </select>
      </div>
      <main className="h-full w-full flex flex-col md:flex-row items-center justify-center relative bg-gray-900">
        {stream && (
          <div
            className={`${
              callAccepted && "absolute w-40 right-2 bottom-20 md:static"
            } md:h-full md:w-full bg-black rounded-md`}
          >
            <video
              className="h-full w-full object-cover rounded-lg md:rounded-none"
              muted
              playsInline
              ref={myVideo}
              autoPlay
            />
          </div>
        )}
        {callAccepted && !callEnded && (
          <div className="h-full w-full bg-black rounded-lg">
            <video
              className="h-full w-full object-cover"
              playsInline
              ref={userVideo}
              autoPlay
            />
          </div>
        )}
        {stream && <Controls myVideo={myVideo} />}
      </main>
      <div className="bg-white fixed z-30 bottom-0 left-0">
        Version 2.1.1
      </div>
    </>
  );
};

export default VideoContainer;

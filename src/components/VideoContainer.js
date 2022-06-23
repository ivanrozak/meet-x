import { useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";
import Controls from "./Controls";

const VideoContainer = () => {
  const { callAccepted, myVideo, userVideo, callEnded, stream, inputDevices, setSelectedDevice, disable } =
    useContext(SocketContext);

  function handleChange(e) {
    const value = JSON.parse(e.target.value)
    setSelectedDevice(value)
  }

  return (
    <>
      <div className="bg-white fixed z-30">
        <select onChange={handleChange} disabled={disable}>
          {inputDevices.map((item, index) => (
            <option value={JSON.stringify(item)} key={index}>{item.label}</option>
          ))}
        </select>
        <div>{JSON.stringify(inputDevices)}</div>
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
        Version 1.1.7
      </div>
    </>
  );
};

export default VideoContainer;

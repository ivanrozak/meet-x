import { useContext } from "react";
import { SocketContext } from "../contexts/SocketContext";

const Alert = () => {
  const { answerCall, call, callAccepted } = useContext(SocketContext);
  return (
    <>
      {call.isReceivingCall && !callAccepted && (
        <div className="px-4 py-2 flex items-center">
          <h1 className="text-lg">{call.name} is calling....</h1>
          <button
            className="rounded-md px-4 py-2 ml-4 cursor-pointer bg-actionBackgroundHover"
            onClick={answerCall}
          >
            Answer
          </button>
        </div>
      )}
    </>
  );
};

export default Alert;

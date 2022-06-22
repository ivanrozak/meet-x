import { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

const socket = io("https://meetx-backend.herokuapp.com/");
// const socket = io("http://localhost:5000");

let localPeer;

const ContextProvider = ({ children }) => {
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState("Unknown Person");
  const [call, setCall] = useState({});
  const [me, setMe] = useState("");
  const [inputDevices, setInputDevices] = useState([])
  const [selectedDevice, setSelectedDevice] = useState({})

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    const nameInStorage = window.localStorage.getItem("name");

    if (nameInStorage) {
      setName(nameInStorage);
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        // console.log(currentStream.getTracks())
        const currentAudioTrack = currentStream.getAudioTracks()[0]
        console.log('First Audio track', currentAudioTrack)
        const currentVideoTrack = currentStream.getVideoTracks()[0]
        console.log('First Video track', currentVideoTrack)
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
        enumerateDevice();
      });

    socket.on("me", (id) => setMe(id));

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    socket.on("reload", () => {
      window.location.reload();
    });
  }, []);

  useEffect(() => {
    // if (selectedDevice && localPeer) {
    // }
    switchAudio()
  }, [selectedDevice])

  // handle for IPAD devices
  // const switchAudio = async () => {
  //   try {
  //     console.log('jalan disini')
  //     const currentTrack = stream.getTracks()
  //     console.log('current Tracks', currentTrack)
  //     const currentAudioTrack = stream.getAudioTracks()
  //     const currentVideoTracks = stream.getVideoTracks()

  //     // stop sending tracks to peers
  //     currentTrack.forEach((t) => t.stop())

  //     // new stream with new device
  //     await navigator.mediaDevices.getUserMedia({
  //       video: true,
  //       audio: {
  //         deviceId: selectedDevice.deviceId
  //       }
  //     }).then((newStream) => {
  //       console.log('jalan nih', newStream)
  //       stream.removeTrack(currentAudioTrack[0])
  //       stream.removeTrack(currentVideoTracks[0])
  //       // stream.addTrack(newStream.getTracks())
  //       const newAudioTracks = newStream.getAudioTracks()[0]
  //       const newVideoTracks = newStream.getVideoTracks()[0]
  //       console.log('after audio', newAudioTracks)
  //       console.log('after video', newVideoTracks)
  //       stream.addTrack(newAudioTracks)
  //       stream.addTrack(newVideoTracks)

  //       let newTracks = []
  //       newTracks.push(newAudioTracks)
  //       newTracks.push(newVideoTracks)

  //       console.log('==========>')
  //       console.log(currentTrack)
  //       console.log(newTracks)
  //       console.log(JSON.stringify(currentTrack))
  //       console.log(JSON.stringify(newTracks))

  //       // setTimeout(() => {
  //       // }, 1000)
  //       localPeer.replaceTrack(currentTrack, newTracks, stream)

  //     }).catch((err) => {
  //       console.log('userMedia', err)
  //     })
  //   } catch (error) {
  //     console.log('Switch Audio Error', error)
  //   }
  // }

  // Code support smoothly for desktop / android
  const switchAudio = async () => {
    try {
      console.log('jalan disini')
      const currentTrack = stream.getAudioTracks()
      const currentVideoTrack = stream.getAudioTracks()
      console.log('current Track', currentTrack)

      // stop sending tracks to peers
      currentTrack.forEach((t) => t.stop())
      currentVideoTrack.forEach((t) => t.stop())

      // new stream with new device
      await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
          deviceId: selectedDevice.deviceId
        }
      }).then((newStream) => {
        // console.log('jalan nih', newStream.getTracks())
        // stream.removeTrack(currentTrack[0])
        // stream.removeTrack(currentVideoTrack[0])
        // stream.addTrack(newStream.getAudioTracks()[0])
        // stream.addTrack(newStream.getVideoTracks()[0])
        myVideo.current.srcObject = newStream;
        myVideo.current.play()
        // localPeer.replaceTrack(currentTrack[0], newStream.getAudioTracks()[0], stream)
      }).catch((err) => {
        console.log('userMedia', err)
      })
    } catch (error) {
      console.log('Switch Audio Error', error)
    }
  }

  const enumerateDevice = () => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      console.log('================')
      console.log(devices)
      devices.forEach((deviceInfo) => {
        if (deviceInfo.kind === 'audioinput') {
          setInputDevices(prevState => [...prevState, deviceInfo])
        }
        // } else if (deviceInfo.kind === 'audiooutput') {
        //   console.log('audio output', deviceInfo)
        // } else if (deviceInfo.kind === 'videoinput') {
        //   console.log('video', deviceInfo)
        // } else {
        //   console.log('Some other kind of source/device: ', deviceInfo);
        // }
      })
      if (Object.keys(selectedDevice).length === 0) {
        console.log('set dulu dag')
        setSelectedDevice(inputDevices[0])
      }
    })
  }

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: call.from });
    });

    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    // const peer = new Peer({ initiator: true, trickle: false, stream });
    localPeer = new Peer({ initiator: true, trickle: false, stream });

    localPeer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });

    localPeer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);

      localPeer.signal(signal);
    });

    connectionRef.current = localPeer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    socket.emit("endCall", { to: call.from });

    window.location.reload();
  };

  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        inputDevices,
        selectedDevice,
        setSelectedDevice
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };

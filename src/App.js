import React, { useEffect, useRef } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import { Container ,makeStyles} from "@material-ui/core";

const Usestyle = makeStyles({
  root : {
    display : "flex",
    flexDirection : "column",
    alignItems : "center",
    justifyContent : "center",
    height : "100vh",
    width : "100wh",
    backgroundColor : "gray"
  }
})

function App() {
  const myVideo = useRef(null);
  const myCanvas = useRef(null);
  const setupCamera = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: { width: 300,height : 500},
        audio: false,
      })
      .then((stream) => {
        myVideo.current.srcObject = stream;
        // console.log(myVideo.current.srcObject)
        myVideo.current.play();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const runCanvas = async () => {
    setupCamera();
    const net = await cocossd.load();
    // console.log(net);
    setInterval(() => setCanvas(net), 10);
  };
  const setCanvas = async (net) => {
    if (myVideo.current.readyState === 4) {
      const ctx = myCanvas.current.getContext("2d");
      myCanvas.current.width = 300;
      myCanvas.current.height = 500;

      const obj = await net.detect(myVideo.current);
      ctx.drawImage(myVideo.current, 0, 0, 300,500);

      // to prediction
      obj.forEach((pred) => {
        const [x, y, width, height] = pred["bbox"];
        const text = pred["class"];
        ctx.font = "35px Arial";
        // ctx.fillStyle("red");
        ctx.beginPath();
        ctx.fillText(text, x, y);
        ctx.rect(x, y, width, height);
        ctx.stroke();
      });
    }
  };

  useEffect(() => {
    runCanvas();
  }, []);
  const classes = Usestyle();
  return (
    <Container className={classes.root}>
      <h1>Rakesh</h1>
      <h1>🙂🙂🙂🙂</h1>
      <video
        ref={myVideo}
        height="500"
        width="500"
        style={{ display: "none" }}
      ></video>
      <canvas ref={myCanvas}></canvas>
    </Container>
  );
}

export default App;

import React, { useState, useEffect, useRef } from 'react';
import './App.css';

import FrameBuffer from './FrameBuffer'

import Scenes from './Scenes'
import RayTracer from './RayTracer'

import Camera from './Camera';

interface AppProps {
  key: number;
  pixelSize: number;
  setPixelSize: (size: number) => void;
  sceneName: string;
}

const frameBufferSize = [1280, 720];



let camera = new Camera();
function App({ key, pixelSize, setPixelSize, sceneName }: AppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);



  const [frameBuffer, setFrameBuffer] = useState(new FrameBuffer(frameBufferSize[0] / pixelSize, frameBufferSize[1] / pixelSize));
  const [renderer, setRenderer] = useState(new RayTracer(frameBuffer));

  const [frameNumber, setFrameNumber] = useState(0);


  function startEverything() {
    nextFrame();
    setFrameNumber(frameNumber + 1);
  }

  useEffect(() => {
    console.log('pixelSize changed');
    startEverything();
  }
    , [pixelSize]);




  // make sure the render happens on start up.
  useEffect(() => {

    const modelNames = Scenes.getScenes();

    startEverything();
  }, []);





  /**
   *  A callback to handle changes to the pixel size slider
   * @param event 
   */
  function onPixelSizeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const slider = event.currentTarget;
    const size = parseInt(slider.value);

  }




  function nextFrame() {

    renderer.render(camera, sceneName);
  }
  nextFrame();
  /** 
   * Get the image from the frame buffer and draw it on the canvas
   * 
   */
  function bufferImage() {
    renderer.render(camera, sceneName);
    const data = frameBuffer.getImageData(pixelSize);
    // now construct an image from the data
    const ctx = canvasRef.current?.getContext('2d');
    // clear the canvas

    if (ctx) {
      // clear the canvas to a background color to mid black
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvasRef.current?.width || 0, canvasRef.current?.height || 0); // fill the entire canvas with black

      const imageData = new ImageData(data, frameBuffer.width * pixelSize, frameBuffer.height * pixelSize);

      const image_width = frameBuffer.width * pixelSize;
      const image_height = frameBuffer.height * pixelSize;
      // center the image on the canvas


      ctx.putImageData(imageData, 0, 0);

    }
    return (
      <canvas ref={canvasRef} width={frameBuffer.width * pixelSize} height={frameBuffer.height * pixelSize} />
    );
  }



  // draw the model
  // modelManager.drawModel(selectedModel, frame, drawBorder, borderColor);

  return (
    <div className="App">

      {bufferImage()}




    </div>
  );
}

export default App;

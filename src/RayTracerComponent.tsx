import React, { useState, useEffect, useRef } from 'react';
import './App.css';

import FrameBuffer from './FrameBuffer'

import Scenes from './Scenes'
import RayTracer from './RayTracer'
import { buffer } from 'stream/consumers';
import StatsContainer from './StatsContainer';

interface AppProps {
  pixelSize: number;
  setPixelSize: (size: number) => void;
  sceneName: string;
  rayDepth: number;
  updateStats: () => void;
}

const frameBufferSize = [1280, 720];



function RayTracerComponent({ pixelSize, setPixelSize, sceneName, updateStats }: AppProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);



  const [frameBuffer, setFrameBuffer] = useState(new FrameBuffer(frameBufferSize[0] / pixelSize, frameBufferSize[1] / pixelSize));
  const [renderer, setRenderer] = useState(new RayTracer(frameBuffer));
  const [renderingInProgress, setRenderingInProgress] = useState(false);
  const [frameNumber, setFrameNumber] = useState(0);
  const [progress, setProgress] = useState(0);
  const [imageVersion, setImageVersion] = useState(0);

  let imageRendered = false;  // this gets called twice, so we need to make sure we only render once.

  // make sure the render happens on start up.
  useEffect(() => {

    const modelNames = Scenes.getScenes();

    startEverything();
  }, []);



  useEffect(() => {
    console.log('pixelSize changed');
    startEverything();

  }, [pixelSize, sceneName]);



  function startEverything() {
    nextFrame();
    setFrameNumber(frameNumber + 1);
  }

  function updateImage() {
    bufferImage();
    setImageVersion(imageVersion + 1);
  }


  function nextFrame() {
    if (imageRendered) {
      return;
    }
    imageRendered = true;
    console.log('nextFrame');
    bufferImage();
    //const intervalId = setInterval(bufferImage, 1000 / 30); // Approximately every 30th of a second

    renderer.render(sceneName, (progress) => {
      setProgress(progress);
      updateImage();
    }).then((elapsedTime) => {
      console.log('render complete in ' + elapsedTime + ' seconds');
      imageRendered = true;

      let statsContainer = StatsContainer.getInstance();
      statsContainer.elapsedTime = elapsedTime;
      updateStats();
      //clearInterval(intervalId);
    });
  }
  //nextFrame();
  /** 
   * Get the image from the frame buffer and draw it on the canvas
   * 
   */
  function bufferImage() {
    console.log('bufferImage')
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

  }



  // call the ray tracer to render the frame

  return (
    <div >
      <canvas ref={canvasRef} width={frameBuffer.width * pixelSize} height={frameBuffer.height * pixelSize} />
    </div>
  );
}

export default RayTracerComponent;

import React, { useState, useEffect, useRef } from 'react';
import './App.css';

import FrameBuffer from './FrameBuffer'

import Scenes from './Scenes'
import RayTracer from './RayTracer'
import { buffer } from 'stream/consumers';
import StatsContainer from './StatsContainer';
import { Stats, stat } from 'fs';

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

  let imageRendering = false;  // this gets called twice, so we need to make sure we only render once.
  let startTime = 0

  // make sure the render happens on start up.
  useEffect(() => {
    startEverything();
  }, []);



  useEffect(() => {
    // StatsContainer.getInstance().requestStopRender();
    startEverything();

  }, [pixelSize, sceneName]);



  function startEverything() {
    startTime = performance.now();
    startRender();
    setFrameNumber(frameNumber + 1);

  }

  function updateImage() {
    bufferImage();
    setImageVersion(imageVersion + 1);
  }
  // set up a timer that will update the bufferImage every 1/30th of a second
  // this will cause the canvas to be updated with the new image
  // this will not cause the ray tracer to be called again.

  // useEffect(() => {
  //   const intervalId = setInterval(updateImage, 1000 / 30); // Approximately every 30th of a second
  //   return () => clearInterval(intervalId);
  // }, [frameNumber]);

  async function renderScanLines(scanLine: number) {

    // check to see if a stop has been requested
    if (StatsContainer.getInstance().stopRenderRequested()) {
      StatsContainer.getInstance().clearStopRenderRequest();
      return;
    }

    // this is a demo ray tracer and thus showing progress is more important than speed.
    // so we will render one scan line at a time.
    const nextScanLine = await renderer.render(sceneName, scanLine);


    // JavaScript is single threaded, so we need to yield to the browser to allow it to update the screen.
    // This is the price we pay for having a single threaded environment.
    await new Promise(resolve => setTimeout(resolve, 2))
      .then(() => {
        // update the stats. since we have given control back to the browser, the stats will be updated.
        updateStats();
        // update the image
        bufferImage();
        
      });
    //setProgress(nextScanLine);

    if (nextScanLine < 0) {
      return;
    }
    renderScanLines(nextScanLine);
  }

  function startRender() {

    // we do not want two ray tracers running at the same time.
    if (imageRendering) {
      return;
    }

    StatsContainer.getInstance().clearStopRenderRequest();

    StatsContainer.getInstance().startTimer();



    imageRendering = true;

    // const renderingScanLines = true;

    // if (renderingScanLines) {
    //   renderScanLines(0).then(() => {
    //     imageRendering = false;

    //   });
    // }

    renderScanLines(0);

  }


  //nextFrame();
  /** 
   * Get the image from the frame buffer and draw it on the canvas
   * 
   */
  function bufferImage() {
    // get the image data from the frame buffer
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

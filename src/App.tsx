import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Color from './Color';
import FrameBuffer from './FrameBuffer'
import FrameBufferComponent from './FrameBufferComponent'
import Scenes from './Scenes'
import RayTracer from './RayTracer'
import ControlComponent from './ControlComponent';
import CameraControlComponent from './CameraControlComponent';
import Camera from './Camera';



const frameBufferSize = [1280, 720];


const borderColor = [10, 10, 10];

let camera = new Camera();
function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);


  const [selectedModel, setSelectedModel] = useState("");
  const [borderColor, setBorderColor] = useState([10, 10, 10]);
  const [maxPixelSize, setMaxPixelSize] = useState(4);
  const [pixelSize, setPixelSize] = useState(maxPixelSize);
  const [frameBuffer, setFrameBuffer] = useState(new FrameBuffer(frameBufferSize[0] / maxPixelSize, frameBufferSize[1] / maxPixelSize));
  const [renderer, setRenderer] = useState(new RayTracer(frameBuffer));

  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [rotateZ, setRotateZ] = useState(0);

  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [translateZ, setTranslateZ] = useState(0);

  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);
  const [scaleZ, setScaleZ] = useState(1);
  const [frameNumber, setFrameNumber] = useState(0);






  // a call back to set the model to draw

  function setModel(event: React.MouseEvent<HTMLButtonElement>): void {
    const button = event.currentTarget;
    const model = button.textContent;
    if (model) {
      setSelectedModel(model);
    }
  }

  // make sure the render happens on start up.
  useEffect(() => {

    const modelNames = Scenes.getScenes();

    setSelectedModel("sphere");
    camera.setViewPortWidth(200);
    camera.setViewPortHeight(200);
  }, []);

  function updateCamera(newCamera: Camera) {
    camera = newCamera;
    nextFrame();
    setFrameNumber(frameNumber + 1);
  }

  function updateTranslate(x: number, y: number, z: number) {

    setTranslateX(x);
    setTranslateY(y);
    setTranslateZ(z);
    console.log(`updateTranslate: ${x}, ${y}, ${z}`);
  }

  function updateShader(shader: string) {
    nextFrame();
    setFrameNumber(frameNumber + 1);
  }

  function updateRotate(x: number, y: number, z: number) {

    setRotateX(x);
    setRotateY(y);
    setRotateZ(z);

    console.log(`updateRotate: ${x}, ${y}, ${z}`);
  }

  function updateScale(x: number, y: number, z: number) {

    setScaleX(x);
    setScaleY(y);
    setScaleZ(z);

    console.log(`updateScale (APP)_: ${x}, ${y}, ${z}`);
  }
  // a Component that calls models.getModels and produces buttons for selecting models
  function ModelSelectionComponent() {
    const modelNames = Scenes.getScenes();

    return (
      <div>
        {modelNames.map((modelName, index) => {
          return (
            <button key={index} onClick={setModel}>{modelName}</button>
          );
        })}
      </div>
    );
  }



  /**
   *  A callback to handle changes to the pixel size slider
   * @param event 
   */
  function onPixelSizeChange(event: React.ChangeEvent<HTMLInputElement>) {
    const slider = event.currentTarget;
    const size = parseInt(slider.value);
    setPixelSize(size);
  }

  function makePixelResolution(size: number) {
  }


  // put 4 buttons up for selecting the image resolution
  // 1280 x 720 (720p)
  //640 x 480 (VGA)
  //320 x 240 (QVGA)
  // 160 x 120 (QQVGA)
  function ResolutionComponent() {
    return (
      <div>
        <button onClick={() => makePixelResolution(1)}>1280 x 720</button>
        <button onClick={() => makePixelResolution(2)}>640 x 480</button>
        <button onClick={() => makePixelResolution(4)}>320 x 240</button>

        <button onClick={() => makePixelResolution(8)}>160 x 120</button>
      </div>
    );
  }

  // define a slider that goes from 1 to maxPixelSize
  function PixelSizeComponent() {
    return (
      <div>
        <input
          type="range"
          id="pixelSize"
          name="pixelSize"
          min="1"
          max={maxPixelSize.toString()}
          value={pixelSize}
          onChange={onPixelSizeChange}
        />
        <label htmlFor="pixelSize" style={{ fontSize: "14px" }}>
          Pixel Size = {pixelSize}
        </label>
      </div>
    );
  }

  function nextFrame() {

    renderer.render(camera, selectedModel);
  }
  nextFrame();
  /** 
   * Get the image from the frame buffer and draw it on the canvas
   * 
   */
  function bufferImage() {
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

      const x_offset = (frameBuffer.width * maxPixelSize - image_width) / 2;
      const y_offset = (frameBuffer.height * maxPixelSize - image_height) / 2;
      ctx.putImageData(imageData, x_offset, y_offset);

    }
    return (
      <canvas ref={canvasRef} width={frameBuffer.width * maxPixelSize} height={frameBuffer.height * maxPixelSize} />
    );
  }



  // draw the model
  // modelManager.drawModel(selectedModel, frame, drawBorder, borderColor);

  return (
    <div className="App">
      <header className="App-header">
        {bufferImage()}
        <ResolutionComponent />
        <ModelSelectionComponent />
        <PixelSizeComponent />

      </header>
    </div>
  );
}

export default App;

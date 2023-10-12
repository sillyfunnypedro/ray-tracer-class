import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Color from './Color';
import FrameBuffer from './FrameBuffer'
import FrameBufferComponent from './FrameBufferComponent'
import GeometricProcessor from './GeometricProcessor'
import { ModelManager } from './ModelManager'
import { GL } from './MinimalGL'
import RenderTest from './RenderTest';
import ControlComponent from './ControlComponent';
import CameraControlComponent from './CameraControlComponent';
import Camera from './Camera';


const modelManager = new ModelManager();
const maxPixelSize = 4;
const frame = new FrameBuffer(320, 200);
const borderColor = [10, 10, 10];
const renderer = new RenderTest(frame, true, borderColor);
let camera = new Camera();
function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);


  const [drawBorder, setDrawBorder] = useState(true);
  const [selectedModel, setSelectedModel] = useState("");
  const [borderColor, setBorderColor] = useState([10, 10, 10]);
  const [pixelSize, setPixelSize] = useState(4);

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
    const modelNames = modelManager.getModels();
    setSelectedModel("triangleMesh2d");
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
    renderer.setShader(shader);
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
    const modelNames = modelManager.getModels();

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

  function BorderControlComponent() {
    return (
      <div>
        <input
          type="checkbox"
          id="border"
          name="border"
          value="border"
          checked={drawBorder}
          onChange={(event) => setDrawBorder(event.target.checked)}
        />
        <label htmlFor="border" style={{ fontSize: "14px" }}>
          Draw Border
        </label>
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

    renderer.render(selectedModel, rotateX, rotateY, rotateZ, translateX, translateY, translateZ, scaleX, scaleY, scaleZ, camera);
  }
  nextFrame();
  /** 
   * Get the image from the frame buffer and draw it on the canvas
   * 
   */
  function bufferImage() {
    const data = frame.getImageData(pixelSize);
    // now construct an image from the data
    const ctx = canvasRef.current?.getContext('2d');
    // clear the canvas

    if (ctx) {
      // clear the canvas to a background color to mid black
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvasRef.current?.width || 0, canvasRef.current?.height || 0); // fill the entire canvas with black

      const imageData = new ImageData(data, frame.width * pixelSize, frame.height * pixelSize);

      const image_width = frame.width * pixelSize;
      const image_height = frame.height * pixelSize;
      // center the image on the canvas

      const x_offset = (frame.width * maxPixelSize - image_width) / 2;
      const y_offset = (frame.height * maxPixelSize - image_height) / 2;
      ctx.putImageData(imageData, x_offset, y_offset);

    }
    return (
      <canvas ref={canvasRef} width={frame.width * maxPixelSize} height={frame.height * maxPixelSize} />
    );
  }



  // draw the model
  // modelManager.drawModel(selectedModel, frame, drawBorder, borderColor);

  return (
    <div className="App">
      <header className="App-header">
        {bufferImage()}
        <ModelSelectionComponent />
        <BorderControlComponent />
        <PixelSizeComponent />
        <ControlComponent updateTranslate={updateTranslate} updateRotate={updateRotate} updateScale={updateScale} updateShader={updateShader} />
        <CameraControlComponent camera={camera} updateCamera={updateCamera} />

      </header>
    </div>
  );
}

export default App;

import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Color from './Color';
import FrameBuffer from './FrameBuffer'
import FrameBufferComponent from './FrameBufferComponent'
import GeometricProcessor from './GeometricProcessor'
import ModelManager from './ModelManager'


const modelManager = new ModelManager();
const maxPixelSize = 7;

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [frame, setFrame] = useState(new FrameBuffer(320, 200));
  const [drawBorder, setDrawBorder] = useState(true);
  const [selectedModel, setSelectedModel] = useState("");
  const [borderColor, setBorderColor] = useState(new Color(20, 20, 20));
  const [pixelSize, setPixelSize] = useState(4);


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
    setSelectedModel("mesh");
  }, []);


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
  modelManager.drawModel(selectedModel, frame, drawBorder, borderColor);

  return (
    <div className="App">
      <header className="App-header">
        {bufferImage()}
        <ModelSelectionComponent />
        <BorderControlComponent />
        <PixelSizeComponent />
      </header>
    </div>
  );
}

export default App;

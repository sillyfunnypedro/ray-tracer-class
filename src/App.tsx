import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Color from './Color';
import FrameBuffer from './FrameBuffer'
import FrameBufferComponent from './FrameBufferComponent'
import GeometricProcessor from './GeometricProcessor'
import ModelManager from './ModelManager'


const modelManager = new ModelManager();

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
        <label htmlFor="border" style={{ fontSize: "10px" }}>
          Draw Border
        </label>
      </div>
    );
  }



  function bufferImage() {
    const pixelSize = 4;
    const data = frame.getImageData(pixelSize);
    // now construct an image from the data
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      const imageData = new ImageData(data, frame.width * pixelSize, frame.height * pixelSize);
      ctx.putImageData(imageData, 0, 0);


    }
    return (
      <canvas ref={canvasRef} width={frame.width * 4} height={frame.height * 4} />
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

      </header>
    </div>
  );
}

export default App;

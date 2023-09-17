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
  const [borderColor, setBorderColor] = useState(new Color(0, 0, 0));
  const [selectedModel, setSelectedModel] = useState("mesh");


  // a call back to set the model to draw

  function setModel(event: React.MouseEvent<HTMLButtonElement>): void {
    const button = event.currentTarget;
    const model = button.textContent;
    if (model) {
      setSelectedModel(model);
    }
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
        <label htmlFor="border" style={{ fontSize: "10px" }}>
          Draw Border
        </label>
      </div>
    );
  }



  modelManager.drawModel(selectedModel, frame, drawBorder, borderColor);

  return (
    <div className="App">
      <header className="App-header">
        <h5> The slowest frame buffer in the world.</h5>
        <FrameBufferComponent frameBuffer={frame} frameNumber={1} />
        <ModelSelectionComponent />
        <BorderControlComponent />
      </header>
    </div>
  );
}

export default App;

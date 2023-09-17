import React, { useState, } from 'react';
import './App.css';
import Color from './Color';
import FrameBuffer from './FrameBuffer'
import FrameBufferComponent from './FrameBufferComponent'
import GeometricProcessor from './GeometricProcessor'
import ModelManager from './ModelManager'


const modelManager = new ModelManager();

function App() {

  const [frame, setFrame] = useState(new FrameBuffer(320, 200));
  const [drawBorder, setDrawBorder] = useState(true);
  const [borderColor, setBorderColor] = useState(new Color(255, 255, 255));
  const [selectedModel, setSelectedModel] = useState("mesh");


  // a call back to set the model to draw
  // the parameter is a button
  // the model is the name of the string in the button
  function setModel(event: React.MouseEvent<HTMLButtonElement>): void {
    const button = event.currentTarget;
    const model = button.textContent;
    if (model) {
      setSelectedModel(model);
    }
  }


  // a function that calls models.getModels and produces buttons for selecting models
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





  modelManager.drawModel(selectedModel, frame, drawBorder, borderColor);

  return (
    <div className="App">
      <header className="App-header">
        <FrameBufferComponent frameBuffer={frame} frameNumber={1} />
        <ModelSelectionComponent />
      </header>
    </div>
  );
}

export default App;

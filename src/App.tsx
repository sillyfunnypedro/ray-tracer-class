import React, { useState, } from 'react';
import './App.css';
import Color from './Color';
import FrameBuffer from './FrameBuffer'
import FrameBufferComponent from './FrameBufferComponent'
import GeometricProcessor from './GeometricProcessor'

function App() {

  const [frame, setFrame] = useState(new FrameBuffer(100, 100));

  GeometricProcessor.drawLine(0, 0, 0, 99, new Color(128, 128, 128), frame);
  GeometricProcessor.drawLine(0, 0, 99, 0, new Color(128, 128, 128), frame);
  GeometricProcessor.drawLine(99, 0, 99, 99, new Color(128, 128, 128), frame);
  GeometricProcessor.drawLine(0, 99, 99, 99, new Color(128, 128, 128), frame);

  GeometricProcessor.fillRect(5, 75, 20, 20, new Color(255, 0, 255), frame);

  GeometricProcessor.fillTriangle(10, 10, 90, 30, 20, 89, new Color(255, 0, 0), new Color(0, 0, 255), frame);
  GeometricProcessor.fillTriangle(95, 95, 90, 30, 20, 89, new Color(255, 0, 0), new Color(0, 255, 255), frame);


  // 
  return (
    <div className="App">
      <header className="App-header">
        <FrameBufferComponent frameBuffer={frame} />
      </header>
    </div>
  );
}

export default App;

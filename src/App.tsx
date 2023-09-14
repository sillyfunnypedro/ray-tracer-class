import React, { useState, } from 'react';
import logo from './logo.svg';
import './App.css';
import Color from './Color';
import FrameBuffer from './FrameBuffer'
import FrameBufferComponent from './FrameBufferComponent'

function App() {

  const [frame, setFrame] = useState(new FrameBuffer(80, 80));

  // 
  return (
    <div className="App">
      <header className="App-header">

        <FrameBufferComponent width={10} height={10} frameBuffer={frame} />
      </header>
    </div>
  );
}

export default App;

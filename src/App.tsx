import React, { useState, } from 'react';
import './App.css';
import Color from './Color';
import FrameBuffer from './FrameBuffer'
import FrameBufferComponent from './FrameBufferComponent'
import GeometricProcessor from './GeometricProcessor'
import Models from './Models'


const models = new Models();

function App() {

  const [frame, setFrame] = useState(new FrameBuffer(320, 200));

  frame.clear(100, 100, 100);
  // GeometricProcessor.drawLine(0, 0, 0, 99, new Color(128, 128, 128), frame);
  // GeometricProcessor.drawLine(0, 0, 99, 0, new Color(128, 128, 128), frame);
  // GeometricProcessor.drawLine(99, 0, 99, 99, new Color(128, 128, 128), frame);
  // GeometricProcessor.drawLine(0, 99, 99, 99, new Color(128, 128, 128), frame);


  // GeometricProcessor.fillTriangle(10, 10, 90, 30, 20, 89, new Color(255, 0, 0), new Color(0, 0, 255), frame);
  // GeometricProcessor.fillTriangle(95, 95, 90, 30, 20, 89, new Color(255, 0, 0), new Color(0, 255, 255), frame);

  const drawBorder = true;
  const borderColor: Color = new Color(255, 255, 255);

  // GeometricProcessor.fillTriangles(
  //   [
  //     10, 10, 0, 255, 0, 0,
  //     10, 35, 0, 255, 0, 0,
  //     10, 60, 0, 255, 0, 0,
  //     10, 85, 0, 255, 0, 0,
  //     10, 110, 0, 255, 0, 0,
  //     40, 10, 0, 212, 42, 0,
  //     40, 35, 0, 212, 31, 10,
  //     40, 60, 0, 212, 21, 21,
  //     40, 85, 0, 212, 10, 31,
  //     40, 110, 0, 212, 0, 42,
  //     70, 10, 0, 170, 85, 0,
  //     70, 35, 0, 170, 63, 21,
  //     70, 60, 0, 170, 42, 42,
  //     70, 85, 0, 170, 21, 63,
  //     70, 110, 0, 170, 0, 85,
  //     100, 10, 0, 127, 127, 0,
  //     100, 35, 0, 127, 95, 31,
  //     100, 60, 0, 127, 63, 63,
  //     100, 85, 0, 127, 31, 95,
  //     100, 110, 0, 127, 0, 127,
  //     130, 10, 0, 85, 170, 0,
  //     130, 35, 0, 85, 127, 42,
  //     130, 60, 0, 85, 85, 85,
  //     130, 85, 0, 85, 42, 127,
  //     130, 110, 0, 85, 0, 170,
  //     160, 10, 0, 42, 212, 0,
  //     160, 35, 0, 42, 159, 53,
  //     160, 60, 0, 42, 106, 106,
  //     160, 85, 0, 42, 53, 159,
  //     160, 110, 0, 42, 0, 212,
  //     190, 10, 0, 0, 255, 0,
  //     190, 35, 0, 0, 191, 63,
  //     190, 60, 0, 0, 127, 127,
  //     190, 85, 0, 0, 63, 191,
  //     190, 110, 0, 0, 0, 255,
  //   ],
  //   [0, 1, 5, 1, 6, 5, 1, 2, 6, 2, 7, 6, 2, 3, 7, 3, 8, 7, 3, 4, 8, 4, 9, 8, 5, 6, 10, 6, 11, 10, 6, 7, 11, 7, 12, 11, 7, 8, 12, 8, 13, 12, 8, 9, 13, 9, 14, 13, 10, 11, 15, 11, 16, 15, 11, 12, 16, 12, 17, 16, 12, 13, 17, 13, 18, 17, 13, 14, 18, 14, 19, 18, 15, 16, 20, 16, 21, 20, 16, 17, 21, 17, 22, 21, 17, 18, 22, 18, 23, 22, 18, 19, 23, 19, 24, 23, 20, 21, 25, 21, 26, 25, 21, 22, 26, 22, 27, 26, 22, 23, 27, 23, 28, 27, 23, 24, 28, 24, 29, 28, 25, 26, 30, 26, 31, 30, 26, 27, 31, 27, 32, 31, 27, 28, 32, 28, 33, 32, 28, 29, 33, 29, 34, 33], 48
  //   , frame, drawBorder, borderColor);
  models.drawModel("mesh", frame, drawBorder, borderColor);
  // 
  return (
    <div className="App">
      <header className="App-header">
        <FrameBufferComponent frameBuffer={frame} frameNumber={1} />
      </header>
    </div>
  );
}

export default App;

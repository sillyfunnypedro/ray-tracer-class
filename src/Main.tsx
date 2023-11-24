import React, { useState, useEffect, useRef } from 'react';

import App from './App';
import Scenes from './Scenes'


function Main() {

    const [pixelSize, setPixelSize] = useState(4)
    const [sceneName, setSelectedModel] = useState('sphere');

    function makePixelResolution(size: number) {
        setPixelSize(size);
    }


    // a call back to set the model to draw

    function sceneScelect(event: React.MouseEvent<HTMLButtonElement>): void {
        const button = event.currentTarget;
        const scene = button.textContent;
        if (scene) {
            setSelectedModel(scene);
        }
    }
    // a Component that calls models.getModels and produces buttons for selecting models
    function SceneSelectionComponent() {
        const modelNames = Scenes.getScenes();

        return (
            <div>
                {modelNames.map((modelName, index) => {
                    return (
                        <button
                            style={{
                                backgroundColor: modelName === sceneName ? 'green' : 'gray',
                            }}
                            key={index} onClick={sceneScelect}>{modelName}</button>
                    );
                })}
            </div>
        );
    }


    // put 4 buttons up for selecting the image resolution
    // 1280 x 720 (720p)
    //640 x 480 (VGA)
    //320 x 240 (QVGA)
    // 160 x 120 (QQVGA)
    function ResolutionComponent() {
        return (
            <div>

                <button
                    onClick={() => makePixelResolution(1)}
                    style={{
                        backgroundColor: pixelSize === 1 ? 'green' : 'gray',
                    }}>1280 x 720</button>
                <button onClick={() => makePixelResolution(2)}
                    style={{
                        backgroundColor: pixelSize === 2 ? 'green' : 'gray',
                    }}>640 x 360</button>
                <button onClick={() => makePixelResolution(4)} style={{
                    backgroundColor: pixelSize === 4 ? 'green' : 'gray',
                }}>320 x 180</button>

                <button onClick={() => makePixelResolution(8)} style={{
                    backgroundColor: pixelSize === 8 ? 'green' : 'gray',
                }}>160 x 90</button>
                <button onClick={() => makePixelResolution(16)} style={{
                    backgroundColor: pixelSize === 16 ? 'green' : 'gray',
                }}>80 x 45</button>
            </div>
        );
    }
    return (
        <div className="App">
            <header className="App-header">

                <ResolutionComponent />
                <SceneSelectionComponent />
                <App key={pixelSize}
                    pixelSize={pixelSize}
                    setPixelSize={setPixelSize}
                    sceneName={sceneName} />
            </header>
        </div>
    );
}

export default Main;
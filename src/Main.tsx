import React, { useState, useEffect, useRef } from 'react';

import RayTracerComponent from './RayTracerComponent';
import Scenes from './Scenes'
import StatsContainer from './StatsContainer';

const statsContainer = StatsContainer.getInstance();
function Main() {

    const [pixelSize, setPixelSize] = useState(4)
    const [sceneName, setSelectedModel] = useState('sphere');
    const [rayDepth, setRayDepth] = useState(1);
    const [useBoundingBox, setUseBoundingBox] = useState(true);
    const [elapsedTime, setElapsedTime] = useState(0);

    function makePixelResolution(size: number) {
        setPixelSize(size);
    }


    // a call back to set the model to draw

    function sceneScelect(event: React.MouseEvent<HTMLButtonElement>): void {
        const button = event.currentTarget;
        const scene = button.textContent;
        if (scene) {
            let currentScene = Scenes.getScene(scene);
            if (currentScene) {
                setRayDepth(currentScene.rayDepth);
            }
            setSelectedModel(scene);
        }
    }

    function updateUseBoundingBox() {
        let currentScene = Scenes.getScene(sceneName);
        if (currentScene) {
            currentScene.useBoundingBox = !currentScene.useBoundingBox;
            setUseBoundingBox(currentScene.useBoundingBox);
            setElapsedTime(statsContainer.getElapsedTime());

        }
    }
    function updateStats() {
        setElapsedTime(statsContainer.getElapsedTime());
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

    function RenderingOptionsComponent() {
        let currentScene = Scenes.getScene(sceneName);
        let elapsedTimeText = `Elapsed Time: ${(elapsedTime / 1000.0).toFixed(4)} seconds`
        if (currentScene) {
            return (
                <div style={{ fontSize: '20px' }}>
                    {elapsedTimeText} <br />
                    <input type="checkbox" onChange={updateUseBoundingBox} checked={currentScene.useBoundingBox} /> Use Bounding Box
                </div>
            );

        }
        return (<div></div>);
    }

    function rayDepthCallback(depth: number): void {
        let currentScene = Scenes.getScene(sceneName);
        if (currentScene) {
            currentScene.rayDepth = depth;
        }
        setRayDepth(depth);
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

    function RayDepthComponent() {
        return (
            <div>
                <button
                    onClick={() => rayDepthCallback(1)}
                    style={{
                        backgroundColor: rayDepth === 1 ? 'green' : 'gray',
                    }}>1</button>
                <button onClick={() => rayDepthCallback(2)}
                    style={{
                        backgroundColor: rayDepth === 2 ? 'green' : 'gray',
                    }}>2</button>
                <button onClick={() => rayDepthCallback(3)} style={{
                    backgroundColor: rayDepth === 3 ? 'green' : 'gray',
                }}>3</button>

                <button onClick={() => rayDepthCallback(4)} style={{
                    backgroundColor: rayDepth === 4 ? 'green' : 'gray',
                }}>4</button>
                <button onClick={() => rayDepthCallback(5)} style={{
                    backgroundColor: rayDepth === 5 ? 'green' : 'gray',
                }}>5</button>
                <button onClick={() => rayDepthCallback(6)} style={{
                    backgroundColor: rayDepth === 6 ? 'green' : 'gray',
                }}>6</button>
                <button onClick={() => rayDepthCallback(7)} style={{
                    backgroundColor: rayDepth === 7 ? 'green' : 'gray',
                }}>7</button>
                <button onClick={() => rayDepthCallback(8)} style={{
                    backgroundColor: rayDepth === 8 ? 'green' : 'gray',
                }}>8</button>
                <button onClick={() => rayDepthCallback(9)} style={{
                    backgroundColor: rayDepth === 9 ? 'green' : 'gray',
                }}>9</button>
            </div>
        );
    }

    return (
        <div className="App">
            <header className="App-header">

                <RenderingOptionsComponent />
                <RayDepthComponent />
                <ResolutionComponent />
                <SceneSelectionComponent />
                <RayTracerComponent key={pixelSize * rayDepth * (useBoundingBox ? 1 : 0)}
                    pixelSize={pixelSize}
                    setPixelSize={setPixelSize}
                    sceneName={sceneName}
                    rayDepth={rayDepth} updateStats={updateStats} />
            </header>
        </div>
    );
}

export default Main;
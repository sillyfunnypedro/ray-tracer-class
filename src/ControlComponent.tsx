
import React, { useState } from 'react';


import './ControlComponent.css';

/** two buttons for the first part of the assignment */


// define the ControlComponentProps interface
interface ControlComponentProps {




    // the callback functions to update the object and mode
    // updateRenderObject: (newObject: string) => void;
    // updateRenderMode: (newMode: string) => void;
    // updateProjectionMode: (newMode: string) => void;
    updateTranslate: (x: number, y: number, z: number) => void;
    updateRotate: (x: number, y: number, z: number) => void;
    updateScale: (x: number, y: number, z: number) => void;
    updateShader: (newShader: string) => void;
}

const scaleSteps = 50;
// define the ControlComponent
function ControlComponent({
    // updateRenderObject, updateRenderMode, updateProjectionMode, 
    updateTranslate, updateRotate, updateScale, updateShader }: ControlComponentProps) {

    const [translateX, setTranslateX] = useState(0);
    const [translateY, setTranslateY] = useState(0);
    const [translateZ, setTranslateZ] = useState(0);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [rotateZ, setRotateZ] = useState(0);
    const [scaleX, setScaleX] = useState(0.5);
    const [scaleY, setScaleY] = useState(0.5);
    const [scaleZ, setScaleZ] = useState(0.5);
    const [uniformScale, setUniformScale] = useState(true);

    const [eyeDistance, setEyeDistance] = useState(2);



    function handleSlideChangeRot(event: React.ChangeEvent<HTMLInputElement>, axis: string) {
        const valueString = event.target.value;
        const value = parseFloat(valueString);

        switch (axis) {
            case "x":
                setRotateX(value);
                break;
            case "y":
                setRotateY(value);
                break;
            case "z":
                setRotateZ(value);
                break;
        }
        updateRotate(rotateX, rotateY, rotateZ);
    }



    function handleSliderChangeTranslate(event: React.ChangeEvent<HTMLInputElement>, axis: string) {
        const value = event.target.value;
        switch (axis) {
            case "x":
                setTranslateX(parseFloat(value));
                break;
            case "y":
                setTranslateY(parseFloat(value));
                break;
            case "z":
                setTranslateZ(parseFloat(value));
                break;
        }
        console.log(`handleSliderChangeTranslate: ${translateX}, ${translateY}, ${translateZ}`);
        updateTranslate(translateX, translateY, translateZ);
    }


    function handleSlideChangeScale(event: React.ChangeEvent<HTMLInputElement>, axis: string) {
        // convert the string value to a number
        const value = event.target.value;
        const numValue = parseFloat(value);

        if (uniformScale) {
            setScaleX(numValue);
            setScaleY(numValue);
            setScaleZ(numValue);
        } else {
            switch (axis) {
                case "x":
                    setScaleX(parseFloat(value));
                    break;
                case "y":
                    setScaleY(parseFloat(value));
                    break;
                case "z":
                    setScaleZ(parseFloat(value));
                    break;
            }
        }
        updateScale(scaleX, scaleY, scaleZ);
    }



    function resetAllSliders() {
        setTranslateX(0);
        setTranslateY(0);
        setTranslateZ(0);
        updateTranslate(0, 0, 0);
        setRotateX(0);
        setRotateY(0);
        setRotateZ(0);
        updateRotate(0, 0, 0);
        setScaleX(1);
        setScaleY(1);
        setScaleZ(1);
        updateScale(1, 1, 1);
    }

    /**
     * 
     * @param string[]
     * 
     * @returns HTML component with as many buttons as there are strings in the array
     */
    function makeModeButtons(title: string, strings: string[], value: string, callback: (arg: string) => void) {
        return (
            <div>
                <table className="tableWidth">
                    <thead>
                        <tr>
                            <th className="leftAlign">
                                {title}
                            </th>
                            <th className="rightAlign">
                                {strings.map((string) => (
                                    <button
                                        key={string}
                                        onClick={() => callback(string)}
                                        style={{
                                            backgroundColor: value === string ? 'green' : 'gray',
                                        }}
                                    >
                                        {string}
                                    </button>
                                ))}
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>
        );
    }

    function makeTranslateSliders() {
        return (
            <div>
                <table className="tableWidth">
                    <thead>
                        <tr>
                            <th className="leftAlign">
                                Translate
                            </th>
                            <th className="rightAlign">
                                <label htmlFor="myRangeX">X:</label>
                                <input name="x" type="range" min="-5" max="5" step="any"
                                    value={translateX} className="slider"
                                    onChange={(event) => handleSliderChangeTranslate(event, "x")} id="myRangeX">

                                </input>
                                <br />
                                <label htmlFor="myRangeY">Y:</label>
                                <input name="y" type="range" min="-5" max="5" step="any"
                                    value={translateY} className="slider"
                                    onChange={(event) => handleSliderChangeTranslate(event, "y")} id="myRangeY">

                                </input>
                                <br />
                                <label htmlFor="myRangeZ">Z:</label>
                                <input name="z" type="range" min="-5" max="5" step="any"
                                    value={translateZ} className="slider"
                                    onChange={(event) => handleSliderChangeTranslate(event, "z")} id="myRangeZ">

                                </input>
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>
        );
    }
    // three buttons for the second part of the assignment
    // regularShader, rotate45Shader, and mirrorShader
    function makeShaderSelector() {
        return (
            <div>
                <table className="tableWidth">
                    <thead>
                        <tr>
                            <th className="leftAlign">
                                Shader
                            </th>
                            <th className="rightAlign">
                                <button onClick={() => updateShader("regularShader")}>Regular</button>
                                <button onClick={() => updateShader("rotate45Shader")}>Rotate 45</button>
                                <button onClick={() => updateShader("mirrorShader")}>Mirror</button>
                                <button onClick={() => updateShader("helixShader")}>Helix</button>
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>
        );
    }


    /**
     * 
     * @returns three sliders for scale plus a check box for uniform scaling
     */
    function makeScaleSliders() {
        return (
            <div>
                <table className="tableWidth">
                    <thead>
                        <tr>
                            <th className="leftAlign">Scale</th>
                            <th className="rightAlign">
                                <input type="checkbox" id="uniformScale" name="uniformScale"
                                    checked={uniformScale} onChange={() => setUniformScale(!uniformScale)}>

                                </input>
                                <label htmlFor="uniformScale">Uniform</label>
                            </th>
                            <th className="rightAlign">
                                <label htmlFor="scaleX">X:</label>
                                <input name="scaleX" type="range" min="0.1" max="2" step="any"
                                    value={scaleX} className="slider"
                                    onChange={(event) => handleSlideChangeScale(event, "x")} id="scaleX">

                                </input>
                                <br />
                                <label htmlFor="scaleY">Y:</label>
                                <input name="scaleY" type="range" min="0.1" max="2" step="any"
                                    value={scaleY} className="slider"
                                    onChange={(event) => handleSlideChangeScale(event, "y")} id="scaleY">

                                </input>
                                <br />
                                <label htmlFor="scaleZ">Z:</label>
                                <input name="scaleZ" type="range" min="0.1" max="2" step="any"
                                    value={scaleZ} className="slider"
                                    onChange={(event) => handleSlideChangeScale(event, "z")} id="scaleZ">

                                </input>
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>
        );
    }



    function makeRotationSliders() {
        return (
            <div>
                <table className="tableWidth">
                    <thead>
                        <tr>
                            <th className="leftAlign">Rotate</th>
                            <th className="rightAlign">
                                <label htmlFor="rotateX">X:</label>
                                <input name="rotz" type="range" min="0" max="360" step="any"
                                    value={rotateX} className="slider"
                                    onChange={(event) => handleSlideChangeRot(event, "x")} id="rotateX">
                                </input>
                                <br />
                                <label htmlFor="rotateY">Y:</label>
                                <input name="rotz" type="range" min="0" max="360" step="any"
                                    value={rotateY} className="slider"
                                    onChange={(event) => handleSlideChangeRot(event, "y")} id="rotateY">
                                </input>
                                <br />
                                <label htmlFor="rotateZ">Z:</label>
                                <input name="rotz" type="range" min="0" max="360" step="any"
                                    value={rotateZ} className="slider"
                                    onChange={(event) => handleSlideChangeRot(event, "z")} id="rotateZ">
                                </input>
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>
        );
    }


    /**
     * 
     * @param string[]
     * 
     * @returns HTML component with as many buttons as there are strings in the array
     */

    function makeControlButtons() {
        return (
            <div>
                <table className="tableWidth">
                    <thead>
                        <tr>
                            <th className="leftAlign">
                                Control
                            </th>
                            <th className="rightAlign">
                                <button onClick={resetAllSliders}>Reset</button>
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>
        );
    }


    // make a panel with two rows of buttons.
    // the first row has two buttons, one for the triangle and one for the square
    // the second row has one button for solid and one button for wireframe
    // return the html component that contains the buttons


    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th className="rightAlign">
                            <hr className="lineWidth" />

                            {makeTranslateSliders()}
                            <hr className="lineWidth" />
                            {makeRotationSliders()}
                            <hr className="lineWidth" />
                            {makeScaleSliders()}
                            <hr className="lineWidth" />
                            {makeControlButtons()}
                            <hr className="lineWidth" />
                            {makeShaderSelector()}
                            <hr className="lineWidth" />
                        </th>
                    </tr>

                </thead>
            </table>
        </div>


    );
}

// export the ControlComponent
export default ControlComponent;
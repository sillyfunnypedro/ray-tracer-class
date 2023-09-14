import React, { useState } from "react";

import Color from "./Color";
import FrameBuffer from "./FrameBuffer";
import "./FrameBufferComponent.css";

interface FrameBufferProps {
    width: number;
    height: number;
    frameBuffer: FrameBuffer
}

// 
const Pixel: React.FC<{ color: string }> = (props) => {
    return (
        <div className="pixel" style={{ backgroundColor: props.color }}></div>
    );
}

// 
const FrameBufferComponent: React.FC<FrameBufferProps> = (props) => {
    const [frame, setFrame] = useState(props.frameBuffer);

    return (
        <div>
            <h2>Frame Buffer</h2>
            <table>
                <tbody>
                    {frame.pixels.map((row, rowIndex) => {
                        return (
                            <tr key={rowIndex}>
                                {row.map((pixel, pixelIndex) => {
                                    return (
                                        <td key={pixelIndex}>
                                            <Pixel color={pixel.toHex()} />

                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    }
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default FrameBufferComponent;
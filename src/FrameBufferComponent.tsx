import React, { useState } from "react";

import Color from "./Color";
import FrameBuffer from "./FrameBuffer";
import "./FrameBufferComponent.css";

interface FrameBufferProps {
    frameBuffer: FrameBuffer
    frameNumber: number
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
            <table>
                <tbody>
                    {frame.pixels.map((row, rowIndex) => {
                        return (
                            <tr key={rowIndex}>
                                {row.map((pixel, pixelIndex) => {
                                    return (
                                        <td key={pixelIndex}
                                            style={{ padding: 0, margin: 0 }}>
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
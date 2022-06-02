import React from 'react';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import '../styles/toolbar.scss'
import Brush from '../tools/Brush';
import Circle from '../tools/Circle';
import Eraser from '../tools/Eraser';
import Line from '../tools/Line';
import Rect from '../tools/Rect';
const Toolbar = () => {

    const changeColor = (e) => {
        toolState.setFillColor(e.target.value)
        toolState.setStrokeColor(e.target.value)
    }

    // сохранение канваса
    const download = () => {
        const dataUrl = canvasState.canvas.toDataURL()
        const a = document.createElement('a')
        a.href = dataUrl
        a.download = canvasState.sessionid + '.jpg'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return (
        <div className='toolbar'>
            <button className='toolbar__btn brush' onClick={() => toolState.setTool(new Brush (canvasState.canvas, canvasState.socket, canvasState.sessionid))}></button>
            <button className='toolbar__btn rect' onClick={() => toolState.setTool(new Rect (canvasState.canvas, canvasState.socket, canvasState.sessionid))}></button>
            <button className='toolbar__btn circle' onClick={() => toolState.setTool(new Circle (canvasState.canvas))}></button>
            <button className='toolbar__btn eraser' onClick={() => toolState.setTool(new Eraser (canvasState.canvas))}></button>
            <button className='toolbar__btn line' onClick={() => toolState.setTool(new Line (canvasState.canvas))}></button>
            <input className='toolbar__btn' type='color' onChange={e => changeColor(e)}></input>
            {/* <button className='toolbar__btn color'></button> */}
            <button className='toolbar__btn undo' onClick={() => canvasState.undo()}></button>
            <button className='toolbar__btn redo' onClick={() => canvasState.redo()}></button>
            <button className='toolbar__btn save' onClick={() => download()}></button>
        </div> 
    );
}
 
export default Toolbar;
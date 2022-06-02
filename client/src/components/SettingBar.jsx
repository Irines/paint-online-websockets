import React from 'react';
import toolState from '../store/toolState';
import '../styles/toolbar.scss'
const SettingBar = () => {
    return (
        <div className='settingbar'>
            <label htmlFor='line-width'>Толщина линии</label>
            <input 
                onChange={(e) => toolState.setLineWidth(e.target.value)}
                style={{margin: '0 10px'}} 
                type="number" 
                id="line-width" 
                defaultValue={1} 
                min={1} 
                max={50}>
            </input>
            <label htmlFor='stroke-color'>Цвет обводки</label>
            <input 
                onChange={(e) => toolState.setStrokeColor(e.target.value)}
                style={{margin: '0 10px'}} 
                type="color" 
            >
            </input>
        </div> 
      );
}
 
export default SettingBar;
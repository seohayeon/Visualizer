import React, { useState,useEffect,useRef } from 'react';
import ReactDOM from "react-dom";

function Visualize(props){
    const visualObj = [];
    const radius = props.setting.radius;
    const circle=props.setting.circle
    const step = props.setting.circle / 150;
    const newData = props.setting.data;
    const artwork = props.meta.artWork;
    
    
    
    useEffect(() => {
        
    },[props.color])
     
    for (let deg = 0, i = 0; deg < circle; deg += step, i += 1) {
        const x = radius * Math.cos(deg);
        const y = radius * Math.sin(deg);
        const rad = deg - 1.57;// minus 90deg

        const styles = {
            Position:'absolute',
            left: x,
            top: y,
            height: 10 + (newData[i] * 0.35),
            width: 4,
            backgroundColor: props.color,
            transform: `rotate(${rad}rad)`,
        };

        visualObj.push(<div key={i} style={styles} />);
    }
    
    const artworkBlokStyle = {
      width: (radius * 2) - 20,
      height: (radius * 2) - 20,
      backgroundImage: `url(${artwork})`,
    };

    return(
    <div className='visualizer'>
        <div id="artwork" style={artworkBlokStyle} />
    {visualObj}
    </div>
    )
}

export default Visualize
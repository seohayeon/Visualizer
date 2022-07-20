import React, {useState,useEffect,useRef} from 'react';
import ReactDOM from "react-dom";

function ProgressBar(props){
    const rangeRef = useRef()
    const {audio} = props
    let [current,setCurrent] = useState('00:00')
    let [durate,setDurate] = useState('00:00')
    
    useEffect(() => {
        if(rangeRef.current){
            rangeRef.current.value='0'
        }
    }, []);
    
    useEffect(() => {  
        if(audio.current){
            audio.current.ontimeupdate = handleTimeUpdate
        }
    }, []);
    
    const handleTimeUpdate = () => {
        let el = rangeRef.current
        let currentTime = audio.current.currentTime
        let duration = audio.current.duration
        let percent = currentTime/duration*100
        var value = (percent-el.min)/(el.max-el.min)
        if(isNaN(value)){
            rangeRef.current.value = 0
            rangeRef.current.disabled = true
            var style = 'background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop(0, rgba(245,245,245,0.5)), color-stop(0, rgba(245,245,245,0.05)));';
            el.style = style;
            return
        }
        rangeRef.current.disabled = false
        rangeRef.current.value = percent
        setStyle(value)
        setCurrent(toMMSS(currentTime))
        if(durate==duration || isNaN(duration)) return;
        setDurate(toMMSS(duration))
    }
    
    const handleRange = (e) => {
        let Audio = audio.current
        let el = rangeRef.current
        var value = (el.value-el.min)/(el.max-el.min)
        setStyle(value)
        Audio.currentTime = value * Audio.duration;
    }
    
    const setStyle = (value) => {
        let el = rangeRef.current
        el.value=value*100
        var style = 'background-image: -webkit-gradient(linear, 0% 0%, 100% 0%, color-stop('+ value+', rgba(245,245,245,0.5)), color-stop('+ value+', rgba(245,245,245,0.05)));';
        el.style = style;
    }
    
    return(
        <div className='progressBlock'>
            <input type='range' id='range' min='0' max='100'  ref={rangeRef} onChange={handleRange}/>
            <div className='timeInfo'>
                <div id='currentTime'>{current}</div>
                <div id='durateTime'>{durate}</div>
            </div>
        </div>
        )
}

function toMMSS(value) {
    var sec_num = parseInt(value, 10);
    var minutes:any = Math.floor(sec_num / 60);
    var seconds:any = sec_num - (minutes * 60);
    
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return minutes+':'+seconds;
}

export default ProgressBar
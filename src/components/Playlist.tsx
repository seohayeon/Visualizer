import React, { useState,useEffect,useRef,useMemo } from 'react';
import ReactDOM from "react-dom";
import ProgressBar from './ProgressBar'

function Playlist(props){
    const { open, 
            close, 
            color,
            metaData, 
            paused, 
            audio,
            playlist,
            setMusicMeta,
            handleNext,
            musicState,
            setMusicState,
            setPlayList
          } = props;
    const style={
            backgroundColor:color.sub
    }
    const metaIndex = playlist.findIndex((e) => metaData.id == e.id )
    const artworkStyle = {
      backgroundImage: `url(${metaData.artWork})`,
    };
    const handlePause = (e) =>{
        e.stopPropagation()
        if(audio.current.paused){
            audio.current.play()
        }else{
            audio.current.pause()
        }
    }
    const handleRow=(data)=>{
        setMusicMeta(data)
    }
    const handlePrev=(e)=>{
        e.stopPropagation()
        const prevIndex = metaIndex - 1
        if(!playlist[prevIndex]) return;
        setMusicMeta(playlist[prevIndex])
    }
    
    const titleWidth = getTextWidth(metaData.title,  "600 30px Noto Sans CJK KR")
    const displayWidth = document.getElementById('title')?.offsetWidth
    
    const handleLoop = () => {
        if(musicState.loop == false){
            audio.current.loop=false
            setMusicState({
                ...musicState,
                loop:2
            })
        }else if(musicState.loop == 2){
            audio.current.loop=true
            setMusicState({
                ...musicState,
                loop:1
            })
        }else{
            audio.current.loop=false
            setMusicState({
                ...musicState,
                loop:false
            })
        }
    }
    const handleShuffle = () => {
        if(musicState.shuffle){
            setMusicState({
                ...musicState,
                shuffle:false
            })
            playlist.sort(function(a, b) { 
                return a['id'] - b['id'];
            });
        }else{
            setMusicState({
                ...musicState,
                shuffle:true
            })
            shuffleArray(playlist)
        }
    }
    return(
        <div className={open ? 'openModal':'closeModal'}>
        <div onClick={close} className='modal'>
        <div className='PlaylistBlock' style={style}
             onClick={e => e.stopPropagation()}>
            <div className='plBlockOverlap'>
                <div className='musicMeta'>
                <div id='artwork' style={artworkStyle}/>
                <div className='musicMetaData'>
                    <div id='title'>
                    {displayWidth < titleWidth?
                    <>
                    <span id='oriTitle'>{metaData.title}</span>
                    <span id='cloneTitle'>{metaData.title}</span>
                    </>
                    :<span>{metaData.title}</span>
                    }
                    </div>
                    <div id='artist'>{metaData.artist}</div>
                </div>
                <div className='setPlayState'>
                    <div id='desc'>바로 다음에 재생</div>
                    <div id='shuffle' onClick={handleShuffle} style={musicState.shuffle==false?{backgroundColor:'transparent'}:null}>
                        <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect fill="none" height="256" width="256"/><path d="M32,72H55.1a64,64,0,0,1,52,26.8l41.8,58.4a64,64,0,0,0,52,26.8H232" fill="none" stroke={musicState.shuffle==false?'rgba(245,245,245,0.5)':`rgb(0,0,0,0.5)`} stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline fill="none" points="208 48 232 72 208 96" stroke={musicState.shuffle==false?'rgba(245,245,245,0.5)':`rgb(0,0,0,0.5)`} stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><polyline fill="none" points="208 160 232 184 208 208" stroke={musicState.shuffle==false?'rgba(245,245,245,0.5)':`rgb(0,0,0,0.5)`} stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M147.7,100.5l1.2-1.7a64,64,0,0,1,52-26.8H232" fill="none" stroke={musicState.shuffle==false?'rgba(245,245,245,0.5)':`rgb(0,0,0,0.5)`} stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/><path d="M32,184H55.1a64,64,0,0,0,52-26.8l1.2-1.7" fill="none" stroke={musicState.shuffle==false?'rgba(245,245,245,0.5)':`rgb(0,0,0,0.5)`} stroke-linecap="round" stroke-linejoin="round" stroke-width="16"/></svg>
                    </div>
                    {musicState.loop==1?
                    <div id='loop' onClick={handleLoop}>
                        <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect fill="none" height="256" width="256"/><path fill={`rgb(0,0,0,0.5)`} d="M24,128A72.1,72.1,0,0,1,96,56h96V40a8,8,0,0,1,4.9-7.4,8.4,8.4,0,0,1,8.8,1.7l24,24a8.1,8.1,0,0,1,0,11.4l-24,24A8.3,8.3,0,0,1,200,96a8.5,8.5,0,0,1-3.1-.6A8,8,0,0,1,192,88V72H96a56,56,0,0,0-56,56,8,8,0,0,1-16,0Zm200-8a8,8,0,0,0-8,8,56,56,0,0,1-56,56H64V168a8,8,0,0,0-4.9-7.4,8.4,8.4,0,0,0-8.8,1.7l-24,24a8.1,8.1,0,0,0,0,11.4l24,24A8.3,8.3,0,0,0,56,224a8.5,8.5,0,0,0,3.1-.6A8,8,0,0,0,64,216V200h96a72.1,72.1,0,0,0,72-72A8,8,0,0,0,224,120Zm-92,40a8,8,0,0,0,8-8V104a7.9,7.9,0,0,0-3.8-6.8,8,8,0,0,0-7.8-.4l-16,8a8.2,8.2,0,0,0-3.6,10.8,8.1,8.1,0,0,0,10.8,3.5l4.4-2.2V152A8,8,0,0,0,132,160Z"/></svg>
                    </div>
                    :
                    <div id='loop' onClick={handleLoop} style={musicState.loop==false?{backgroundColor:'transparent'}:null}>
                        <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><rect fill="none" height="256" width="256"/><path fill={musicState.loop==false?'rgba(245,245,245,0.5)':`rgb(0,0,0,0.5)`} d="M24,128A72.1,72.1,0,0,1,96,56h96V40a8,8,0,0,1,4.9-7.4,8.4,8.4,0,0,1,8.8,1.7l24,24a8.1,8.1,0,0,1,0,11.4l-24,24A8.3,8.3,0,0,1,200,96a8.5,8.5,0,0,1-3.1-.6A8,8,0,0,1,192,88V72H96a56,56,0,0,0-56,56,8,8,0,0,1-16,0Zm200-8a8,8,0,0,0-8,8,56,56,0,0,1-56,56H64V168a8,8,0,0,0-4.9-7.4,8.4,8.4,0,0,0-8.8,1.7l-24,24a8.1,8.1,0,0,0,0,11.4l24,24A8.3,8.3,0,0,0,56,224a8.5,8.5,0,0,0,3.1-.6A8,8,0,0,0,64,216V200h96a72.1,72.1,0,0,0,72-72A8,8,0,0,0,224,120Z"/></svg>
                    </div>
                    }
                </div>
                </div>
                <div className='queueBlock'>
                { 
                    playlist.slice(metaIndex+1).map((e)=>
                        <div className='queueRow' onClick={()=>{handleRow(e)}} key={e.id}>
                            <div className='queueMeta'>
                                <div id='artwork' style={{backgroundImage: `url(${e.artWork})`}}/>
                                <div className='queueMetaData'>
                                <div id='title'>{e.title}</div>
                                <div id='artist'>{e.artist}</div>
                                </div>
                            </div>
                        </div>
                        
                    )
                }
                </div>
                <div className='queueControllerBlock'>
                    <ProgressBar audio={audio}/>
                    <div className='queueController'>
                    <div id='queuePrev' onClick={handlePrev}>
                        <svg version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="info"/><g id="icons"><path width='40px' height='40px' fill='#ffffff' d="M22.2,10.6l-9-5.4c-1-0.6-2.2,0.2-2.2,1.4v3.2L3.2,5.2C2.2,4.6,1,5.4,1,6.6v10.7c0,1.2,1.2,2,2.2,1.4l7.8-4.6   v3.2c0,1.2,1.2,2,2.2,1.4l9-5.4C23.3,12.8,23.3,11.2,22.2,10.6z" id="next"/></g></svg>
                    </div>
                    <div id='queuePlay' onClick={handlePause}>
                {paused?
                        <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><title/><g id="Play"><path width='40px' height='40px' fill='#ffffff' d="M26.78,13.45,11.58,4A3,3,0,0,0,7,6.59V25.41a3,3,0,0,0,3,3A3,3,0,0,0,11.58,28l15.2-9.41a3,3,0,0,0,0-5.1Z"/></g></svg>
                        :
                        <svg id='queuePause' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><title/><rect width="6" height="16" x="3" y="2" rx="1" ry="1" fill='#ffffff'/><rect width="6" height="16" x="11" y="2" rx="1" ry="1" fill='#ffffff'/>
                        </svg>}
                    </div>
                    <div id='queueNext' onClick={handleNext}>
                        <svg version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="info"/><g id="icons"><path width='40px' height='40px' fill='#ffffff' d="M22.2,10.6l-9-5.4c-1-0.6-2.2,0.2-2.2,1.4v3.2L3.2,5.2C2.2,4.6,1,5.4,1,6.6v10.7c0,1.2,1.2,2,2.2,1.4l7.8-4.6   v3.2c0,1.2,1.2,2,2.2,1.4l9-5.4C23.3,12.8,23.3,11.2,22.2,10.6z" id="next"/></g></svg>
                    </div>
                    </div>
                </div>
            </div> 
        </div>
      
    </div>
    </div>
        )
        
        
        function getTextWidth(text, font) {
  // re-use canvas object for better performance
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const metrics = context.measureText(text);
  return metrics.width;
}

function getCssStyle(element, prop) {
    return window.getComputedStyle(element, null).getPropertyValue(prop);
}

function getCanvasFont(el = document.body) {
  const fontWeight = getCssStyle(el, 'font-weight') || '800';
  const fontSize = getCssStyle(el, 'font-size') || '2.8rem';
  const fontFamily = getCssStyle(el, 'font-family') || 'Noto Sans CJK KR';
  
  return `${fontWeight} ${fontSize} ${fontFamily}`;
}


}

function shuffleArray(array) {
        let currentIndex = array.length,  randomIndex;
        while (currentIndex != 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
        return array;
    }
export default Playlist

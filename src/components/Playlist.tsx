import React, { useState,useEffect,useRef,useMemo } from 'react';
import ReactDOM from "react-dom";

function Playlist(props){
    const { open, 
            close, 
            color,
            metaData, 
            paused, 
            audio,
            playlist,
            setMusicMeta,
            handleNext
          } = props;
    const style={
            backgroundColor:color.sub
    }
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
        const index = playlist.findIndex((e) => metaData.id == e.id )
        const prevIndex = index - 1
        if(!playlist[prevIndex]) return;
        setMusicMeta(playlist[prevIndex])
    }
    return(
        <div className={open ? 'openModal modal' : 'modal'} onClick={close}>
      {open ? (
        <div className='PlaylistBlock' style={style}
             onClick={e => e.stopPropagation()}>
            <div className='plBlockOverlap'>
                <div className='musicMeta'>
                <div id='artwork' style={artworkStyle}/>
                <div className='musicMetaData'>
                    <div id='title'>{metaData.title}</div>
                    <div id='artist'>{metaData.artist}</div>
                </div>
                </div>
                <div className='queueBlock'>
                { 
                    playlist.map((e)=>
                        <div className='queueRow' onClick={()=>{handleRow(e)}}>
                            <div className='queueMeta'>
                                
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
      ) : null}
    </div>
        )
}

export default Playlist

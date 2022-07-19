import React, { useState,useEffect,useRef } from 'react';
import ReactDOM from "react-dom";
import Playlist from './Playlist'

function Controller(props){
    const CAStyle = {
      backgroundImage: `url(${props.data.artWork})`,
    };
    const [paused,setPaused] = useState(true)
    const {audio,playlist,setMusicMeta,data} = props
    
    useEffect(() => {
        audio.current?.addEventListener("pause", function(){ 
            setPaused(true)
        })
        audio.current?.addEventListener("play", function(){ 
            setPaused(false)
        })
        
    }, [audio.current]);
    
    const handlePause = (e) =>{
        e.stopPropagation()
        if(audio.current.paused){
            audio.current.play()
        }else{
            audio.current.pause()
        }
    }
    
    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => {
    setModalOpen(true);
    };
    const closeModal = () => {
    setModalOpen(false);
    };
    const handleNext=(e)=>{
        e.stopPropagation()
        const index = playlist.findIndex((e) => data.id == e.id )
        const nextIndex = index + 1
        if(!playlist[nextIndex]) return;
        setMusicMeta(playlist[nextIndex])
    }
    return(
        <>
        <Playlist open={modalOpen} 
                  close={closeModal} 
                  color={props.color} 
                  metaData={data}
                  paused={paused}
                  audio={audio}
                  playlist={playlist}
                  setMusicMeta={setMusicMeta}
                  handleNext={handleNext}/>
        <div className='controller' onClick={openModal}>
            <div id='controllerArtWork'style={CAStyle}/>
            <div className='title'>{props.data.title}</div>
            <div className='musicControll'>
            <div id='play' onClick={handlePause}>
            {paused?
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><title/><g id="Play"><path width='40px' height='40px' fill='#ffffff' d="M26.78,13.45,11.58,4A3,3,0,0,0,7,6.59V25.41a3,3,0,0,0,3,3A3,3,0,0,0,11.58,28l15.2-9.41a3,3,0,0,0,0-5.1Z"/></g></svg>
                :
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                    <title/>
                    <rect width="6" height="16" x="3" y="2" rx="1" ry="1" fill='#ffffff'/>
                    <rect width="6" height="16" x="11" y="2" rx="1" ry="1" fill='#ffffff'/>
                </svg>}
            </div>
            <div id='next' onClick={handleNext}>
               <svg version="1.1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><g id="info"/><g id="icons"><path width='40px' height='40px' fill='#ffffff' d="M22.2,10.6l-9-5.4c-1-0.6-2.2,0.2-2.2,1.4v3.2L3.2,5.2C2.2,4.6,1,5.4,1,6.6v10.7c0,1.2,1.2,2,2.2,1.4l7.8-4.6   v3.2c0,1.2,1.2,2,2.2,1.4l9-5.4C23.3,12.8,23.3,11.2,22.2,10.6z" id="next"/></g></svg>
            </div>
            </div>
        </div>
        </>
        )
}

export default Controller

import React, { useState,useEffect,useRef } from 'react';
import ReactDOM from "react-dom";
import jsmediatags from 'jsmediatags/dist/jsmediatags.min';
import ColorThief from 'color-thief-standalone';
import Visualize from './components/Visualize'
import Controller from './components/Controller'
import './App.css'

type visualizeType = {
    circle: number;
    radius: number;
    objWidth:number;
    objCount:number;
    data:Uint8Array | [];
}

type musicMetaType = {
    id:number | null;
    title: string | null;
    artist:string | null;
    artWork:string | null;
    src:string | null;
}

function App(){
        const audioRef=useRef<HTMLAudioElement>()
        const [visualizeSet,setVisualizeSet] = useState<visualizeType>({
                circle: 2 * Math.PI,
                radius: 200,
                objWidth: 4,
                objCount: 150,
                data: []
            })
        const [musicMeta,setMusicMeta] = useState<musicMetaType>({
            id:null,
            title:'---',
            artist:'---',
            artWork:null,
            src:null
        })
        const [color,setColor] = useState({main:'',sub:'rgb(0,0,0)'})
        const audioContextRef = useRef<AudioContext>();
        const frequencyDataRef = useRef<Uint8Array>();
        const analyserRef = useRef<AnalyserNode>();
        const [playlist,setPlayList] = useState([])
        const nextId = useRef(0);
        
        const thiefColor = (img) => {
            if (img) {
                const coverImage = new Image();
                coverImage.src = img;
                coverImage.onload = () => {
                    const colorThief = new ColorThief();
                    const colorArray = colorThief.getPalette(coverImage, 2);
                    setColor({main:`rgb(${String(colorArray[1])})`,sub:`rgb(${String(colorArray[0])})`})
                }
                
            }
        }
        var source=null
        const handleFile = (e) => {
            const files=e.target.files
            for (let i = 0; i < files.length; i += 1) {
            const file = files[i]
            const urlObj = URL.createObjectURL(file);
            
            jsmediatags.read(file, {
                onSuccess: (tag) => {
                    const tags = tag.tags;
                    const tagAlbum = tags.album;
                    const tagTitle = tags.title;
                    const tagArtist = tags.artist;
                    let tagCover = tags.picture;

                    if (tagCover) {
                        let base64String = '';
                        tagCover.data.forEach((data) => { base64String += String.fromCharCode(data); });
                        tagCover = `data:${tagCover.format};base64,${window.btoa(base64String)}`;
                    }
                    const music={
                                    id:nextId.current,
                                    title:tagTitle,
                                    artist:tagArtist,
                                    artWork:tagCover,
                                    src:urlObj
                                }
                    setPlayList(playlist => [...playlist, music]);
                    nextId.current += 1;
                },
                onError: () => {
                },
            })
            }
            const audioContext = audioContextRef.current
            audioContext.resume().then(() => {
                 const audio:HTMLAudioElement = audioRef.current;
            })
            //audio.play()
        }
        
        useEffect(() => {
            thiefColor(musicMeta.artWork)
            if(audioRef.current){
                audioRef.current.src = musicMeta.src
                audioRef.current.load()
                audioRef.current.play()
                .then((e)=>{
                    updateMediaData(musicMeta)
                })
            }
        },[musicMeta])
        
        const updateMediaData = (m) => {
        if ("mediaSession" in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
            title: m.title,
            artist: m.artist,
            artwork: [
                { src: m.artWork, sizes: '128x128', type: 'image/png' }
                ]
            });
            
            navigator.mediaSession.setActionHandler('previoustrack', function() {
                
                let index = playlist.findIndex((e) => e.id==m.id);
                let info = playlist[index - 1]
                if(!info) return;
                setMusicMeta(info)
            });
            navigator.mediaSession.setActionHandler('nexttrack', function() {
                let index = playlist.findIndex((e) => e.id==m.id);
                let info = playlist[index + 1]
                if(!info) return;
                setMusicMeta(info)
            });
            navigator.mediaSession.setActionHandler('seekbackward', function() {
                let currentTime = audioRef.current.currentTime
                audioRef.current.currentTime = audioRef.current.currentTime - 5 
            });
            navigator.mediaSession.setActionHandler('seekforward', function() {
                let currentTime = audioRef.current.currentTime
                audioRef.current.currentTime = audioRef.current.currentTime + 5 
            });
  
            
        }
    }
        
        const visualizing = () => {
            const {data}=visualizeSet
            const frequencyData = frequencyDataRef.current;
            const analyser = analyserRef.current;
            requestAnimationFrame(visualizing);
            analyser.getByteFrequencyData(frequencyData);
            setVisualizeSet({
                ...visualizeSet,
                data: frequencyData
            });
        }
        useEffect(() => {
            const audioContext = new AudioContext();
            const analyser = audioContext.createAnalyser();
            analyser.smoothingTimeConstant = 0.7;
            analyser.fftSize = 2048;
            const frequencyData = new Uint8Array(analyser.frequencyBinCount);
            
            new Promise<void>((resolve, reject) => {
            audioContextRef.current = audioContext;
            frequencyDataRef.current = frequencyData;
            analyserRef.current = analyser
            resolve();
            }).then(() => {
                visualizing()
                const audio = audioRef.current
                const source = audioContext.createMediaElementSource(audio);
                source.connect(analyser);
                analyser.connect(audioContext.destination);
            }).catch(() => {
                console.log('Error!'); 
            })
        },[])
        
        const style={
            backgroundColor:color.main
        }
        return (
            <div className='wrap' style={style}>
            <input type='file' id='inputFile' onChange={handleFile} multiple/>
            <label for='inputFile'>
            <Visualize setting={visualizeSet} color={color.sub} meta={musicMeta}></Visualize>
            </label>
            <audio ref={audioRef} id='audio'></audio>
            <Controller playlist={playlist} 
                        audio={audioRef} 
                        data={musicMeta} 
                        color={color}
                        setMusicMeta={setMusicMeta}/>
            </div>
        )
    
}

export default App
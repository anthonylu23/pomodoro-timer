import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import PlayButton from './PlayButton';
import PauseButton from './PauseButton';
import SettingsButton from './SettingsButton';
import { useContext , useEffect, useState, useRef} from 'react';
import SettingsContext from './SettingsContext';
import ResetButton from './ResetButton';

function Timer() {
    const settingsInfo = useContext(SettingsContext);
   
    const [isPaused, setIsPaused] = useState(true);
    const [mode, setMode] = useState('work'); //work-break-null
    const [secondsLeft, setSecondsLeft] = useState(0);
    const [isReset, setIsReset] = useState(false);
    
    const secondsLeftRef = useRef(secondsLeft);
    const isPausedRef = useRef(isPaused);
    const modeRef = useRef(mode);
    const isResetRef = useRef(isReset)

    function initTimer() {
        setSecondsLeft(settingsInfo.workMinutes * 60);
        secondsLeftRef.current = settingsInfo.workMinutes * 60;
    }

    function tick() {
        secondsLeftRef.current--;
        setSecondsLeft(secondsLeftRef.current);
    }

    useEffect(() => {
        initTimer();
        const interval = setInterval(() => {
            if (isResetRef.current) {
                setSecondsLeft(totalSeconds);
                secondsLeftRef.current = totalSeconds;
                setIsPaused(true);
                isPausedRef.current = true;
                return;
            }
            if (isPausedRef.current) {
                return;
            }
            if (secondsLeftRef.current === 0) {
                return switchMode()
            }
            tick();
        }, 1000)

        return () => clearInterval(interval);
    }, [settingsInfo]);

    function switchMode() {
        const nextMode = modeRef.current === 'work' ? 'break' : 'work';
        const nextSeconds = (nextMode === 'work' ? settingsInfo.workMinutes * 60 : settingsInfo.breakMinutes * 60);
        setMode(nextMode);
        modeRef.current = nextMode;
        setSecondsLeft(nextSeconds);
        secondsLeftRef.current = nextSeconds;
    }

    const totalSeconds = mode === 'work' 
    ? settingsInfo.workMinutes * 60
    : settingsInfo.breakMinutes * 60;

    let minutes = Math.floor(secondsLeft / 60);

    const hours = Math.floor(minutes / 60);
    
    if (minutes > 59) {
        minutes = minutes - 60;
    }
    if(minutes < 10) {
        minutes = '0' + minutes;
    }
    let seconds = secondsLeft % 60;
    if (seconds < 10) {
        seconds = '0' + seconds;  
    }
    
    const phrase = mode === 'work' ? 'Keep Working!!!' : 'Enjoy your break!' 

    return (
        <div>
            <CircularProgressbar 
            value={Math.round((secondsLeft / totalSeconds) * 100)}
            text={'0' + hours + ':' + minutes + ':' + seconds} 
            styles={buildStyles({
                textColor: '#fff',
                tailColor: 'rgba(255,255,255,.8)',
                pathColor: mode === 'work' ? 'rgba(255,0,0,1)' : 'rgba(0,255,0,1)',
                textSize: '15px',
            })} />
            <div style = {{marginTop: '20px'}}>
                {phrase}
            </div>
            <div style={{marginTop: '20px'}}>
                {isPaused 
                ? <PlayButton onClick = {()=>{setIsPaused(false); isPausedRef.current = false; 
                    if (!isReset === false) {
                        setIsReset(false); isResetRef.current = false;
                }}}/> 
                : <PauseButton onClick = {()=>{setIsPaused(true); isPausedRef.current = true; 
                    if (isReset === false) {
                        setIsReset(false); isResetRef.current = false;
                }
                }}/>}
                <ResetButton onClick = {()=> {setIsReset(true); isResetRef.current = true;}}/>
            </div>
            
            <div style={{marginTop: '20px'}}>
                <SettingsButton onClick={() => settingsInfo.setShowSettings(true)}/>
            </div>
        </div>
    );
}

export default Timer;
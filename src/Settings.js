import ReactSlider from 'react-slider';
import './slider.css';
import {useContext} from 'react';
import SettingsContext from './SettingsContext';
import BackButton from './BackButton';

function Settings() {
    const settingsInfo = useContext(SettingsContext);

    const totalWorkTime = settingsInfo.workMinutes;
    let workHr = Math.floor(totalWorkTime / 60);
    if (workHr !== 0) {
        workHr = workHr + ' hours';
    }
    else {
        workHr = '';
    }
    let workMin = totalWorkTime % 60;
    if (workMin < 10) {
        workMin = '0' + workMin;
    }

    const totalBreakTime = settingsInfo.breakMinutes;
    let breakMin = totalBreakTime % 60;
    if (breakMin < 10) {
        breakMin = '0' + breakMin;
    }
    
    return (
        <div style = {{textAlign: 'left'}}>
            <label> set work length: {workHr} {workMin} minutes </label>
            <ReactSlider
                className = {'slider'}
                thumbClassName = {'thumb'}
                trackClassName={'track'}
                value = {settingsInfo.workMinutes}
                onChange = {newValue => settingsInfo.setWorkMinutes(newValue)}
                min = {1}
                max = {120} />
            <label> set break length: {breakMin} minutes</label>
            <ReactSlider
                className = {'slider green'}
                thumbClassName = {'thumb'}
                trackClassName={'track'}
                value = {settingsInfo.breakMinutes}
                onChange = {newValue => settingsInfo.setBreakMinutes(newValue)}
                min = {1}
                max = {30} />
                <div style = {{textAlign: 'center', marginTop: '20px'}}>
                    <BackButton onClick = {() => settingsInfo.setShowSettings(false)}/>
                </div>
        </div>
    )
}

export default Settings;
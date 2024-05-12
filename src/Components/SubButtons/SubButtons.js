import { MdMyLocation } from "react-icons/md";
import SignalOn from "../../Images/traffic-light_On.png";
import SignalOff from "../../Images/traffic-light_Off.png";
import './SubButtons.css';
import React, { useState, useEffect } from "react";
import { ChangeCenter } from "../../Services/TMapControls/ChangeCenter";
import useInterval from '../../Services/Hooks/useInterval';

const SubButtons = (props) => {
    const [isSignalOn, setIsSignalOn] = useState(false);

    useInterval(() => {
        props.markerUnitsControlHook.UpdateSignalMarker(props.mapInstance, props.signalHook.signalDatas, true);
    }, isSignalOn ? 1000 : null, [isSignalOn]);

    useEffect(() => {
        if (!isSignalOn) {
            props.markerUnitsControlHook.ClearSignalMarker();
        }
    }, [isSignalOn]);

    useEffect(() => {
        setIsSignalOn(false);
    }, [props.signalHook.isSearchDirectionOn])

    const setBottomLocation = () => {
        if (props.searchResultLength === 0) {
            return "0"
        }

        if (props.isSearchResultVisible) {
            return "40vh"
        } 
        else {
            return "10vh"
        }
    }

    const onChangeLocationClick = async () => {
        await props.GeolocationHook.get();
        ChangeCenter(props.mapInstance, props.GeolocationHook.location.latitude, props.GeolocationHook.location.longitude)
    }

    const onSignalOnOffClick = () => {
        setIsSignalOn(prevState => !prevState);
    }

    return (
        <div
            className="mylocation-container"
            style={{ bottom: setBottomLocation() }}>
            <button
                className="signal-btn"
                disabled={props.signalHook.isSearchDirectionOn}
                onClick={onSignalOnOffClick}
                style={{ 
                    backgroundImage: `url(${isSignalOn ? SignalOn : SignalOff})` 
                }}
            />
            <button
                className="mylocation-btn">
                <MdMyLocation
                    onClick={onChangeLocationClick}
                    size={35}
                />
            </button>
        </div>
    )
}

export default SubButtons;

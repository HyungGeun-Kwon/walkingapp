import { useState } from 'react';
import { MdSwapVert, MdClose, MdSearch } from 'react-icons/md';
import './StartEndSearchBar.css';
import useInterval from '../../Services/Hooks/useInterval';

const StartEndSearchBar = (props) => {
    const [isComponentVisible, setIsComponentVisible] = useState(true);
    const [isStartSubBtnVisible, setIsStartSubBtnVisible] = useState(false);
    const [isEndSubBtnVisible, setIsEndSubBtnVisible] = useState(false);

    const {
        mapInstance,
        markerUnitsControlHook,
        searchDirectionsHook,
        tMapSearchHook,
        GeolocationHook,
        setShowNormalSearch,
        signalHook
    } = props;

    const [isSearchActive, setIsSearchActive] = useState(false);

    useInterval(() => {
        markerUnitsControlHook.UpdateSignalMarker(mapInstance, signalHook.searchSignalDatas, false);
    }, isSearchActive ? 1000 : null, [isSearchActive]);

    const startSearch = () => {
        setIsSearchActive(true);
    }

    const stopSearch = () => {
        setIsSearchActive(false);
    }

    const onClickStartEndSearchBarExit = () => {
        setShowNormalSearch(true);
        signalHook.setIsSearchDirectionOn(false);
        tMapSearchHook.setTmapStartSearchKey("");
        tMapSearchHook.setTmapEndSearchKey("");
        tMapSearchHook.setSearchResult("");
        searchDirectionsHook.ClearDirections();
        markerUnitsControlHook.ClearIndexMarkers();
        markerUnitsControlHook.ClearStartMarkers();
        markerUnitsControlHook.ClearEndMarkers();
        markerUnitsControlHook.ClearSignalMarker();
        searchDirectionsHook.setStartpoi([]);
        searchDirectionsHook.setEndpoi([]);
    }

    const onStartSearchChanged = (e) => {

        if (e.key === "Enter") {
            tMapSearchHook.onTMapStartSearchClick(e);
        }
    }

    const onEndSearchChanged = (e) => {

        if (e.key === "Enter") {
            tMapSearchHook.onTMapEndSearchClick(e);
        }
    }

    const getMyLocationPoi = () => {
        const poi = [];

        GeolocationHook.get();
        poi.name = "내 위치";
        poi.frontLat = GeolocationHook.location.latitude;
        poi.frontLon = GeolocationHook.location.longitude;

        return poi;
    }

    const setStartPoiMyLocation = () => {
        const startpoi = getMyLocationPoi();
        tMapSearchHook.setTmapStartSearchKey(startpoi.name)
        searchDirectionsHook.setStartpoi(startpoi);
        markerUnitsControlHook.AddStartMarker(mapInstance, startpoi);
    }

    const setEndPoiMyLocation = () => {
        const endpoi = getMyLocationPoi();
        tMapSearchHook.setTmapEndSearchKey(endpoi.name)
        searchDirectionsHook.setEndpoi(endpoi);
        markerUnitsControlHook.AddEndMarker(mapInstance, endpoi);
    }

    const startSubBtnVisible = () => {
        // onClick하면 사라지는게 먼저 동작해서 이벤트 발생하지 않음.
        if (isStartSubBtnVisible) {
            return (
                <div
                    className="input-wrapper-sub">
                    <button
                        onMouseDown={() => { setStartPoiMyLocation() }}>내위치</button>
                    {/* <button
                        onMouseDown={() => { }}>지도에서선택</button> */}
                </div>
            )
        }
        else {
            return null;
        }
    }

    const endSubBtnVisible = () => {
        if (isEndSubBtnVisible) {
            return (
                <div
                    className="input-wrapper-sub">
                    <button
                        onMouseDown={() => { setEndPoiMyLocation() }}>내위치</button>
                    {/* <button
                        onMouseDown={() => { }}>지도에서선택</button> */}
                </div>
            )
        }
        else {
            return null;
        }
    }

    return (
        <div className='root-component'>
            <div className={`sesearch-bar-component ${isComponentVisible ? "" : "hidden"}`}>
                <button className="sesearch-bar-switch-button">
                    <MdSwapVert size={24} />
                </button>
                <div className="input-container">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={tMapSearchHook.tmapStartSearchKey}
                            onFocus={() => setIsStartSubBtnVisible(true)}
                            onBlur={() => setIsStartSubBtnVisible(false)}
                            onChange={(e) => {
                                searchDirectionsHook.setStartpoi([]);
                                searchDirectionsHook.ClearDirections();
                                markerUnitsControlHook.ClearStartMarkers();
                                markerUnitsControlHook.ClearSignalMarker();
                                signalHook.setIsSearchDirectionOn(false);
                                stopSearch();
                                tMapSearchHook.setTmapStartSearchKey(e.target.value);
                            }}
                            onKeyDown={onStartSearchChanged} />
                        <MdSearch
                            className="search-icon"
                            size={24}
                            onClick={(e) => {
                                tMapSearchHook.onTMapStartSearchClick(e);
                            }} />
                    </div>
                    {startSubBtnVisible()}
                    <div className="input-wrapper">
                        <input
                            type="text"
                            value={tMapSearchHook.tmapEndSearchKey}
                            onFocus={() => setIsEndSubBtnVisible(true)}
                            onBlur={() => setIsEndSubBtnVisible(false)}
                            onChange={(e) => {
                                searchDirectionsHook.setEndpoi([]);
                                searchDirectionsHook.ClearDirections();
                                markerUnitsControlHook.ClearEndMarkers();
                                markerUnitsControlHook.ClearSignalMarker();
                                signalHook.setIsSearchDirectionOn(false);
                                stopSearch();
                                tMapSearchHook.setTmapEndSearchKey(e.target.value)
                            }}
                            onKeyDown={onEndSearchChanged} />
                        <MdSearch
                            className="search-icon"
                            size={24}
                            onClick={(e) => {
                                tMapSearchHook.onTMapEndSearchClick(e);
                            }} />
                    </div>
                    {endSubBtnVisible()}
                    <div className='search-container'>
                        <div></div>
                        <button className='searchDirections-button' onClick={() => {
                            signalHook.setIsSearchDirectionOn(true);
                            startSearch();
                            searchDirectionsHook.SearchDirections(mapInstance, signalHook, markerUnitsControlHook);
                        }}>경로 검색</button>
                    </div>
                </div>
                <div className='right-container'>
                    <button className="close-button">
                        <MdClose size={24} onClick={() => {
                            stopSearch();
                            onClickStartEndSearchBarExit();
                        }} />
                    </button>
                </div>
            </div>

            <button
                className={`toggle-button ${isComponentVisible ? "" : "rotated"}`}
                onMouseDown={() => setIsComponentVisible(!isComponentVisible)}>
                ▲
            </button>
        </div>
    );
};

export default StartEndSearchBar;

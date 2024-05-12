import { useEffect, useState, useRef } from "react";
import ZindexSearchBar from "../Components/ZindexSearchBar/ZindexSearchBar";
import useTMapSearch from "../Services/Hooks/useTMapSearch";
import SearchResult from "../Components/SearchResult/SearchResult";
import StartEndSearchBar from "../Components/StartEndSearchBar/StartEndSearchBar";
import useMarkerUnitsControl from '../Services/Hooks/useMarkerUnitsControl';
import useSearchDirections from "../Services/Hooks/useSearchDirections";
import useGeolocation from "../Services/Hooks/usegeolocation";
import useSignal from "../Services/Hooks/useSignal";
import { ChangeCenter } from "../Services/TMapControls/ChangeCenter"
import axios from "axios";
import SubButtons from "../Components/SubButtons/SubButtons";

const TMapPage = () => {
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const [showNormalSearch, setShowNormalSearch] = useState(true);
    const [isSearchResultVisible, setIsSearchResultVisible] = useState(true);

    const markerUnitsControlHook = useMarkerUnitsControl();
    const tMapSearchHook = useTMapSearch();
    const searchDirectionsHook = useSearchDirections();
    const signalHook = useSignal();
    const GeolocationHook = useGeolocation(signalHook);


    useEffect(() => {
        console.log("지도 생성");
        // 지도 생성
        var lat = 37.566481622437934;
        var lon = 126.98502302169841;
        if (GeolocationHook.location.latitude != null || GeolocationHook.location.longitude != null) {
            lat = GeolocationHook.location.latitude;
            lon = GeolocationHook.location.longitude;
        }
        mapInstance.current = new window.Tmapv2.Map(mapRef.current, {
            center: new window.Tmapv2.LatLng(lat, lon),
            width: '100%',
            height: '100vh',
            zoomControl: false,
            zoom: 17,
        });

        GeolocationHook.get();

        return () => {
            // 컴포넌트가 언마운트될 때 지도 객체 제거
            mapInstance.current.destroy();
        };
    }, []);

    useEffect(() => {

        // null이라면 마커 제거.
        if (GeolocationHook.location.latitude == null || GeolocationHook.location.longitude == null) {
            markerUnitsControlHook.ClearGPSMarkers();
            return;
        }

        // null이 아니라면 위치에 마킹
        markerUnitsControlHook.UpdateGPSMarker(mapInstance, GeolocationHook.location.latitude, GeolocationHook.location.longitude);

        // CenterChange가 True라면 Center 변경
        // ChangeCenter(mapInstance, GeolocationHook.location.latitude, GeolocationHook.location.longitude);
    }, [GeolocationHook.location])

    return (
        <div style={{
            position: "relative",
            width: '100%',
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start'
        }}>
            <div ref={mapRef} />
            {showNormalSearch ?
                <ZindexSearchBar
                    width={"80vw"}
                    tMapSearchHook={tMapSearchHook} />
                :
                <StartEndSearchBar
                    signalHook={signalHook}
                    mapInstance={mapInstance}
                    markerUnitsControlHook={markerUnitsControlHook}
                    searchDirectionsHook={searchDirectionsHook}
                    tMapSearchHook={tMapSearchHook}
                    GeolocationHook={GeolocationHook}
                    setShowNormalSearch={setShowNormalSearch} />}
            <SubButtons
                mapInstance={mapInstance}
                searchResultLength={tMapSearchHook.searchResult.length}
                isSearchResultVisible={isSearchResultVisible}
                signalHook={signalHook}
                markerUnitsControlHook={markerUnitsControlHook}
                GeolocationHook={GeolocationHook} />
            <SearchResult
                markerUnitsControlHook={markerUnitsControlHook}
                searchDirectionsHook={searchDirectionsHook}
                mapInstance={mapInstance}
                tMapSearchHook={tMapSearchHook}
                setShowNormalSearch={setShowNormalSearch}
                isSearchResultVisible={isSearchResultVisible}
                setIsSearchResultVisible={setIsSearchResultVisible} />
        </div>
    )
}

export default TMapPage;
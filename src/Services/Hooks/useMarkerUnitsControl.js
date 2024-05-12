import { ChangeCenter } from '../TMapControls/ChangeCenter';
import defaultMarker from '../../Images/pngwing.com.png'
import blueCircle from '../../Images/circle.png'
import redLight from '../../Images/traffic-light_red.png'
import greenLight from '../../Images/traffic-light_green.png'

var _indexMarkers = [];
var _startMarker = [];
var _endMarker = [];
var _gpsMarker = [];
var _signalMarker = [];
var _infoWindowMarker = [];
var _stateDirections = ["ntPdsgStatNm", "etPdsgStatNm", "stPdsgStatNm", "wtPdsgStatNm", "nePdsgStatNm", "sePdsgStatNm", "swPdsgStatNm", "nwPdsgStatNm"];
var _secDirections = ["ntPdsgRmdrCs", "etPdsgRmdrCs", "stPdsgRmdrCs", "wtPdsgRmdrCs", "nePdsgRmdrCs", "sePdsgRmdrCs", "swPdsgRmdrCs", "nwPdsgRmdrCs"];
// 위도, 경도 1미터 변화값 (약)
const LAT_PER_METER = 0.000009 * 5;
const LON_PER_METER = 0.000011 * 5;

// 방향에 따른 위도, 경도 변화값 매핑
const directionToLatLngDelta = {
    "ntPdsgStatNm": { lat: LAT_PER_METER, lon: 0 },
    "etPdsgStatNm": { lat: 0, lon: LON_PER_METER },
    "stPdsgStatNm": { lat: -LAT_PER_METER, lon: 0 },
    "wtPdsgStatNm": { lat: 0, lon: -LON_PER_METER },
    // 북동, 남동, 남서, 북서는 대각선으로 이동
    "nePdsgStatNm": { lat: LAT_PER_METER, lon: LON_PER_METER },
    "sePdsgStatNm": { lat: -LAT_PER_METER, lon: LON_PER_METER },
    "swPdsgStatNm": { lat: -LAT_PER_METER, lon: -LON_PER_METER },
    "nwPdsgStatNm": { lat: LAT_PER_METER, lon: -LON_PER_METER },
}

export default function useMarkerUnitsControl() {
    const ClearGPSMarkers = () => {
        for (var i = 0; i < _gpsMarker.length; i++) {
            _gpsMarker[i].setMap(null);
        }
        _gpsMarker = [];
    }

    const ClearIndexMarkers = () => {
        for (var i = 0; i < _indexMarkers.length; i++) {
            _indexMarkers[i].setMap(null);
        }
        _indexMarkers = [];
    }

    const ClearStartMarkers = () => {
        for (var i = 0; i < _startMarker.length; i++) {
            _startMarker[i].setMap(null);
        }
        _startMarker = [];
    }

    const ClearEndMarkers = () => {
        for (var i = 0; i < _endMarker.length; i++) {
            _endMarker[i].setMap(null);
        }
        _endMarker = [];
    }

    const ClearSignalMarker = () => {
        for (var i = 0; i < _signalMarker.length; i++) {
            _signalMarker[i].setMap(null);
        }
        _signalMarker = [];

        for (var i = 0; i < _infoWindowMarker.length; i++) {
            _infoWindowMarker[i].setMap(null);
        }
        _infoWindowMarker = [];

    }

    const UpdateSignalMarker = (mapInstance, datas, isViewAll) => {
        ClearSignalMarker();

        datas.forEach(data => {
            if (isViewAll || data.itstId == 1820 || data.itstId == 1620) {
                for (let key in data) {
                    if (key.endsWith("PdsgStatNm") && directionToLatLngDelta[key]) {
                        const status = data[key];  // 보행신호 상태
                        let remaining = data[key.replace("StatNm", "RmdrCs")];  // 보행신호 잔여 센티초
                        const delta = directionToLatLngDelta[key];  // 위도, 경도 변화값

                        const icon = status === "stop-And-Remain" ? redLight : greenLight;

                        if (remaining == undefined) {
                            remaining = -1;
                        }
                        let latkey = "mapCtptIntLat";
                        let lonkey = "mapCtptIntLot";
                        if (data.hasOwnProperty(key.substring(0, 2) + "mapCtptIntLat")) {
                            latkey = key.substring(0, 2) + "mapCtptIntLat";
                        }
                        if (data.hasOwnProperty(key.substring(0, 2) + "mapCtptIntLot")) {
                            lonkey = key.substring(0, 2) + "mapCtptIntLot";
                        }
                        const marker = new window.Tmapv2.Marker({
                            position: new window.Tmapv2.LatLng(
                                parseFloat(data[latkey]),// + delta.lat,
                                parseFloat(data[lonkey])// + delta.lon
                            ),
                            icon: icon,
                            iconSize: new window.Tmapv2.Size(30, 30),
                            map: mapInstance.current,
                        });

                        const infoWindow = new window.Tmapv2.InfoWindow({
                            position: marker.getPosition(),
                            content: "<div style='padding:5px; background-color:transparent; border: none;'>" + remaining / 10 + "s" + "</div>",
                            background: "false",
                            map: mapInstance.current
                        });
                        _signalMarker.push(marker);
                        _infoWindowMarker.push(infoWindow);
                    }
                }
            }
        });
    }

    const UpdateGPSMarker = (mapInstance, lat, lon) => {
        ClearGPSMarkers();

        var marker = new window.Tmapv2.Marker({
            position: new window.Tmapv2.LatLng(parseFloat(lat), parseFloat(lon)),
            icon: blueCircle,
            iconSize: new window.Tmapv2.Size(20, 20),
            map: mapInstance.current
        });
        _gpsMarker.push(marker);
    }

    const AddIndexMarker = (mapInstance, poi, index) => {
        if (index == 0) {
            ClearIndexMarkers();
            ChangeCenter(mapInstance, poi.frontLat, poi.frontLon);
        }

        var label = "<span style='background-color: #46414E;color:white'>" + poi.name + "</span>";

        var marker = new window.Tmapv2.Marker({

            position: new window.Tmapv2.LatLng(parseFloat(poi.frontLat), parseFloat(poi.frontLon)),
            icon: defaultMarker,
            iconSize: new window.Tmapv2.Size(24, 38),
            label: label,
            map: mapInstance.current,
        });
        _indexMarkers.push(marker);
    }

    const AddStartMarker = (mapInstance, poi) => {
        ClearIndexMarkers();
        ClearStartMarkers();
        ChangeCenter(mapInstance, poi.frontLat, poi.frontLon);

        var marker = new window.Tmapv2.Marker({
            position: new window.Tmapv2.LatLng(parseFloat(poi.frontLat), parseFloat(poi.frontLon)),
            icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
            iconSize: new window.Tmapv2.Size(24, 38),
            title: poi.name,
            map: mapInstance.current
        });
        _startMarker.push(marker);
    }

    const AddEndMarker = (mapInstance, poi) => {
        ClearIndexMarkers();
        ClearEndMarkers()
        ChangeCenter(mapInstance, poi.frontLat, poi.frontLon);

        var marker = new window.Tmapv2.Marker({
            position: new window.Tmapv2.LatLng(parseFloat(poi.frontLat), parseFloat(poi.frontLon)),
            icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
            iconSize: new window.Tmapv2.Size(24, 38),
            title: poi.name,
            map: mapInstance.current
        });
        _endMarker.push(marker);
    }

    return {
        AddIndexMarker,
        AddStartMarker,
        AddEndMarker,
        UpdateGPSMarker,
        ClearEndMarkers,
        ClearStartMarkers,
        ClearIndexMarkers,
        ClearGPSMarkers,
        ClearSignalMarker,
        UpdateSignalMarker,
    }
}

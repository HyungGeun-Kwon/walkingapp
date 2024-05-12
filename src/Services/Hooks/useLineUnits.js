import { useState } from "react";

export default function useLineUnits() {

    const [polylines, setpolylines] = useState([]);

    const ClearLines = () => {
        for (var i = 0; i < polylines.length; i++) {
            polylines[i].setMap(null);
        }
        setpolylines([]);
    }

    const DrawLines = (mapInstance, resultData) => {
        var drawInfoArr = [];

        for (var i in resultData) {
            var geometry = resultData[i].geometry;
            var properties = resultData[i].properties;

            if (geometry.type == "LineString") {
                for (var j in geometry.coordinates) {
                    var latlon = new window.Tmapv2.LatLng(geometry.coordinates[j][1], geometry.coordinates[j][0]);
                    drawInfoArr.push(latlon);
                }
            }
        }

        var polyline_ = new window.Tmapv2.Polyline({
            path: drawInfoArr,
            strokeColor: "#DD0000",
            strokeWeight: 6,
            map: mapInstance.current
        });
        setpolylines(polylines => [...polylines, polyline_]);
    }

    const DrawRectangle = (mapInstance, p1_lat, p1_lon, p2_lat, p2_lon) => {
        var drawInfoArr = [];

        drawInfoArr.push(new window.Tmapv2.LatLng(p1_lon, p1_lat));
        drawInfoArr.push(new window.Tmapv2.LatLng(p2_lon, p1_lat));
        drawInfoArr.push(new window.Tmapv2.LatLng(p1_lon, p2_lat));
        drawInfoArr.push(new window.Tmapv2.LatLng(p2_lon, p2_lat));
        drawInfoArr.push(new window.Tmapv2.LatLng(p1_lon, p1_lat));

        var polyline_ = new window.Tmapv2.Polyline({
            path: drawInfoArr,
            strokeColor: "#DD0000",
            strokeWeight: 6,
            map: mapInstance.current
        });
    }


    return {
        ClearLines,
        DrawLines,
        DrawRectangle
    }
}

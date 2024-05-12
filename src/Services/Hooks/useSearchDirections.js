import React, { useState } from 'react';
import useLineUnits from './useLineUnits';
import axios from 'axios';
import { ChangeCenter } from "../../Services/TMapControls/ChangeCenter"

const useSearchDirections = () => {

    const [resultData, setResultData] = useState([]) // 경로 결과
    const [startpoi, setStartpoi] = useState([]); // 경로 출발지
    const [endpoi, setEndpoi] = useState([]); // 경로 도착지

    const { ClearLines, DrawLines, DrawRectangle } = useLineUnits();

    const ClearDirections = () => {
        ClearLines();
    }

    // 사각 영역 찾기
    const FindRectArea = async (responseDatas) => {
        var minLat = responseDatas[0].geometry.coordinates[1]
        var maxLat = responseDatas[0].geometry.coordinates[1]
        var minLon = responseDatas[0].geometry.coordinates[0]
        var maxLon = responseDatas[0].geometry.coordinates[0]

        for (var i = 1; i < responseDatas.length; i++) {
            var geometry = responseDatas[i].geometry;

            if (geometry.type == "Point") {

                minLat = Math.min(minLat, geometry.coordinates[1]);
                minLon = Math.min(minLon, geometry.coordinates[0]);

                maxLat = Math.max(maxLat, geometry.coordinates[1]);
                maxLon = Math.max(maxLon, geometry.coordinates[0]);
            }
            else {
                for (var coordinate of geometry.coordinates) {
                    minLat = Math.min(minLat, coordinate[1]);
                    minLon = Math.min(minLon, coordinate[0]);

                    maxLat = Math.max(maxLat, coordinate[1]);
                    maxLon = Math.max(maxLon, coordinate[0]);
                }
            }
        }
        DrawRectangle(minLat, minLon, maxLat, maxLon);
    }

    const FindBest = async (mapInstance, startData, endData, signalDatas) => {
    }

    const CleaningSignalData = async () => {
        const response = await axios.get("http://localhost:3002/api/test/data");
        const signalDatas = response.data;
        console.log("-----------");
        console.log(signalDatas);

        let newData = [];
        signalDatas.forEach(signalData => {
            if (signalData.itstId == 1820 || signalData.itstId == 1620) {
                let dataTemps = [];
                for (let key in signalData) {
                    if (key.endsWith("mapCtptIntLat")) {
                        if (key == "ntmapCtptIntLat") {
                            dataTemps.push({
                                "ntPdsgStatNm": signalData["ntPdsgStatNm"],
                                "mapCtptIntLat": signalData["ntmapCtptIntLat"],
                                "mapCtptIntLot": signalData["ntmapCtptIntLot"],
                                "ntPdsgRmdrCs": signalData["ntPdsgRmdrCs"],
                                "MaxStopntPdsgRmdrCs": signalData["MaxStopntPdsgRmdrCs"],
                                "protectedMaxAllowedntPdsgRmdrCs": signalData["protectedMaxAllowedntPdsgRmdrCs"],
                            });
                        }
                        else if (key == "etmapCtptIntLat") {
                            dataTemps.push({
                                "etPdsgStatNm": signalData["etPdsgStatNm"],
                                "mapCtptIntLat": signalData["etmapCtptIntLat"],
                                "mapCtptIntLot": signalData["etmapCtptIntLot"],
                                "etPdsgRmdrCs": signalData["etPdsgRmdrCs"],
                                "MaxStopetPdsgRmdrCs": signalData["MaxStopetPdsgRmdrCs"],
                                "protectedMaxAllowedetPdsgRmdrCs": signalData["protectedMaxAllowedetPdsgRmdrCs"],
                            });
                        }
                        else if (key == "stmapCtptIntLat") {
                            dataTemps.push({
                                "stPdsgStatNm": signalData["stPdsgStatNm"],
                                "mapCtptIntLat": signalData["stmapCtptIntLat"],
                                "mapCtptIntLot": signalData["stmapCtptIntLot"],
                                "stPdsgRmdrCs": signalData["stPdsgRmdrCs"],
                                "MaxStopstPdsgRmdrCs": signalData["MaxStopstPdsgRmdrCs"],
                                "protectedMaxAllowedstPdsgRmdrCs": signalData["protectedMaxAllowedstPdsgRmdrCs"],
                            });
                        }
                        else if (key == "wtmapCtptIntLat") {
                            dataTemps.push({
                                "wtPdsgStatNm": signalData["wtPdsgStatNm"],
                                "mapCtptIntLat": signalData["wtmapCtptIntLat"],
                                "mapCtptIntLot": signalData["wtmapCtptIntLot"],
                                "wtPdsgRmdrCs": signalData["wtPdsgRmdrCs"],
                                "MaxStopwtPdsgRmdrCs": signalData["MaxStopwtPdsgRmdrCs"],
                                "protectedMaxAllowedwtPdsgRmdrCs": signalData["protectedMaxAllowedwtPdsgRmdrCs"],
                            });
                        }
                    }
                }
                if (dataTemps.length == 0) {
                    newData.push({
                        "stPdsgStatNm": signalData["stPdsgStatNm"],
                        "stmapCtptIntLat": signalData["mapCtptIntLat"],
                        "stmapCtptIntLot": signalData["mapCtptIntLot"],
                        "stPdsgRmdrCs": signalData["stPdsgRmdrCs"],
                        "MaxStopstPdsgRmdrCs": signalData["MaxStopstPdsgRmdrCs"],
                        "protectedMaxAllowedstPdsgRmdrCs": signalData["protectedMaxAllowedstPdsgRmdrCs"],
                    });
                }
                else {
                    dataTemps.forEach(dataTemp => {
                        newData.push(dataTemp);
                    });
                }
            }
        });

        return newData;
    }

    // 첫 신호등 찾기
    const FindFirstSignal = async (mapInstance, startData, signalDatas) => {
        signalDatas.forEach(async signalData => {
            const headers = { "appKey": "rkJVjhvJH39Z6fV9vg7fK3RY7633ROTQ8aZAB0M0" };
            const data = {
                "startX": parseFloat(startData.frontLat),
                "startY": parseFloat(startData.frontLon),
                "endX": parseFloat(signalData.mapCtptIntLat),
                "endY": parseFloat(signalData.mapCtptIntLot),
                "startName": "출발지",
                "endName": "도착지"
            };

            var tDistance = "";
            var tTimeMin = "";

            try {
                const response = await axios.post(
                    "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&callback=result",
                    data,
                    { headers }
                );

                // 결과 출력
                setResultData(response.data.features);
                const currentData = response.data.features;
                CleaningSignalData(currentData);
                tDistance = ((currentData[0].properties.totalDistance) / 1000).toFixed(1) + "km,"; // 총 거리
                tTimeMin = ((currentData[0].properties.totalTime) / 60).toFixed(0) + "분"; // 소요 시간

                DrawLines(mapInstance, currentData);

            } catch (error) {
                console.log(error);
            }
        });
    }

    const SearchDirections = async (mapInstance, signalHook) => {
        ChangeCenter(mapInstance, startpoi.frontLat, startpoi.frontLon)

        if (startpoi == []) {

            return;
        }

        if (endpoi == []) {

            return;
        }

        ClearLines();

        const headers = { "appKey": "rkJVjhvJH39Z6fV9vg7fK3RY7633ROTQ8aZAB0M0" };
        const data = {
            "startX": parseFloat(startpoi.frontLon),
            "startY": parseFloat(startpoi.frontLat),
            "endX": parseFloat(endpoi.frontLon),
            "endY": parseFloat(endpoi.frontLat),
            // "startX": parseFloat(startpoi.frontLon),
            // "startY": parseFloat(startpoi.frontLat),
            // "endX": parseFloat(126.9876851),
            // "endY": parseFloat(37.5702056),
            "startName": "출발지",
            "endName": "도착지"
        };

        var tDistance = "";
        var tTimeMin = "";

        try {
            const response = await axios.post(
                "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&callback=result",
                data,
                { headers }
            );

            // 결과 출력
            setResultData(response.data.features);
            FindRectArea(currentData);
            const currentData = response.data.features;
            let newSignalDatas = CleaningSignalData(currentData);
            
            tDistance = ((currentData[0].properties.totalDistance) / 1000).toFixed(1) + "km,"; // 총 거리
            tTimeMin = ((currentData[0].properties.totalTime) / 60).toFixed(0) + "분"; // 소요 시간

            DrawLines(mapInstance, currentData);

        } catch (error) {
            console.log(error);
        }

        return { tDistance, tTimeMin };
    }
    return {
        startpoi,
        endpoi,
        setStartpoi,
        setEndpoi,
        SearchDirections,
        ClearDirections,
    }
}

export default useSearchDirections;


import React, { useState } from 'react';
import useLineUnits from './useLineUnits';
import axios from 'axios';
import { ChangeCenter } from "../../Services/TMapControls/ChangeCenter"

const useSearchDirections = () => {

    const [resultData, setResultData] = useState([]) // 경로 결과
    const [startpoi, setStartpoi] = useState([]); // 경로 출발지
    const [endpoi, setEndpoi] = useState([]); // 경로 도착지

    const { ClearLines, DrawLines, DrawRectangle, DrawLinesDirect } = useLineUnits();

    const ClearDirections = () => {
        ClearLines();
    }

    // 데이터 정제
    const CleaningSignalData = async () => {
        const response = await axios.get("http://localhost:3002/api/test/data");
        const signalDatas = response.data;

        let newData = [];
        signalDatas.forEach(signalData => {
            if (signalData.itstId == 1820 || signalData.itstId == 1620) {
                let dataTemps = [];
                for (let key in signalData) {
                    if (key.endsWith("mapCtptIntLat")) {
                        if (key == "ntmapCtptIntLat") {
                            dataTemps.push({
                                "PdsgStatNm": signalData["ntPdsgStatNm"],
                                "mapCtptIntLat": signalData["ntmapCtptIntLat"],
                                "mapCtptIntLot": signalData["ntmapCtptIntLot"],
                                "PdsgRmdrCs": parseFloat(signalData["ntPdsgRmdrCs"]) / 10,
                                "MaxStopPdsgRmdrCs": parseFloat(signalData["MaxStopntPdsgRmdrCs"]) / 10,
                                "protectedMaxAllowedPdsgRmdrCs": parseFloat(signalData["protectedMaxAllowedntPdsgRmdrCs"]) / 10,
                            });
                        }
                        else if (key == "etmapCtptIntLat") {
                            dataTemps.push({
                                "PdsgStatNm": signalData["etPdsgStatNm"],
                                "mapCtptIntLat": signalData["etmapCtptIntLat"],
                                "mapCtptIntLot": signalData["etmapCtptIntLot"],
                                "PdsgRmdrCs": parseFloat(signalData["etPdsgRmdrCs"])/10,
                                "MaxStopPdsgRmdrCs": parseFloat(signalData["MaxStopetPdsgRmdrCs"])/10,
                                "protectedMaxAllowedPdsgRmdrCs": parseFloat(signalData["protectedMaxAllowedetPdsgRmdrCs"])/10,
                            });
                        }
                        else if (key == "stmapCtptIntLat") {
                            dataTemps.push({
                                "PdsgStatNm": signalData["stPdsgStatNm"],
                                "mapCtptIntLat": signalData["stmapCtptIntLat"],
                                "mapCtptIntLot": signalData["stmapCtptIntLot"],
                                "PdsgRmdrCs": parseFloat(signalData["stPdsgRmdrCs"])/10,
                                "MaxStopPdsgRmdrCs": parseFloat(signalData["MaxStopstPdsgRmdrCs"])/10,
                                "protectedMaxAllowedPdsgRmdrCs": parseFloat(signalData["protectedMaxAllowedstPdsgRmdrCs"])/10,
                            });
                        }
                        else if (key == "wtmapCtptIntLat") {
                            dataTemps.push({
                                "PdsgStatNm": signalData["wtPdsgStatNm"],
                                "mapCtptIntLat": signalData["wtmapCtptIntLat"],
                                "mapCtptIntLot": signalData["wtmapCtptIntLot"],
                                "PdsgRmdrCs": parseFloat(signalData["wtPdsgRmdrCs"])/10,
                                "MaxStopPdsgRmdrCs": parseFloat(signalData["MaxStopwtPdsgRmdrCs"])/10,
                                "protectedMaxAllowedPdsgRmdrCs": parseFloat(signalData["protectedMaxAllowedwtPdsgRmdrCs"])/10,
                            });
                        }
                    }
                }
                if (dataTemps.length == 0) {
                    newData.push({ // 원래는 이래하면 안되는데 그냥 고정으로 이렇게 해버림. 여기도 위에처럼하면 코드 겁나길어짐.
                        "PdsgStatNm": signalData["stPdsgStatNm"],
                        "mapCtptIntLat": signalData["mapCtptIntLat"],
                        "mapCtptIntLot": signalData["mapCtptIntLot"],
                        "PdsgRmdrCs": signalData["stPdsgRmdrCs"],
                        "MaxStopPdsgRmdrCs": signalData["MaxStopstPdsgRmdrCs"],
                        "protectedMaxAllowedPdsgRmdrCs": signalData["protectedMaxAllowedstPdsgRmdrCs"],
                    });
                }
                else {
                    dataTemps.forEach(dataTemp => {
                        newData.push(dataTemp);
                    });
                }
            }
        });
        //console.log("정재된 데이터");
        //console.log(newData);
        return newData;
    }

    const FindBest = async (mapInstance, startpoi, endpoi, signalDatas, markerHook) => {
        let startData = {
            "mapCtptIntLat": startpoi.frontLat,
            "mapCtptIntLot": startpoi.frontLon,
            "totalTime": 0
        };
        let endData = {
            "mapCtptIntLat": endpoi.frontLat,
            "mapCtptIntLot": endpoi.frontLon,
        }
        let wayDatas = [];
        let finalDatas = [];
        let FirstDatas = await FindFirstSignals(mapInstance, startData, endData, signalDatas, markerHook, 0);
        let FirstSignals = FirstDatas.firstSignals;
        // console.log("처음 찾은 첫번째 신호등의 정보들 입니다.");
        // console.log(FirstSignals);
        // DrawLinesDirect(mapInstance, FirstSignals[0].lineDatas);
        // DrawLinesDirect(mapInstance, FirstSignals[1].lineDatas);
        let index = 0;

        if (FirstDatas.isFind == true) {

            TestMarking(mapInstance, markerHook, FirstSignals, index);
            index++;
            for (const firstSignal of FirstSignals) {
                wayDatas.push({
                    "startData": { "mapCtptIntLat": firstSignal.signalLat, "mapCtptIntLot": firstSignal.signalLon },
                    "sTime": firstSignal.totalTime,
                    "lineDatas": firstSignal.lineDatas
                });
                signalDatas = signalDatas.filter(item =>
                    !(item.mapCtptIntLat === firstSignal.signalLat && item.mapCtptIntLot === firstSignal.signalLon)
                );
            }

            while (true) {
                //console.log("while문 시작!")
                //console.log(wayDatas);
                if (wayDatas.length <= 0) { console.log("빠져나오기 성공"); break; } // wayDatas의 Count가 0이되면 빠져나옴

                const wayData = wayDatas.shift();
                // console.log("shift한 데이터");
                // console.log(wayData);
                // console.log(wayData.startData.mapCtptIntLat);


                FirstDatas = await FindFirstSignals(mapInstance, wayData.startData, endData, signalDatas, markerHook, wayData.sTime);
                FirstSignals = FirstDatas.firstSignals;
                
                if (FirstDatas.isFind == true) {
                    TestMarking(mapInstance, markerHook, FirstSignals, index);
                    index++;
                    // 다시 push
                    for (const firstSignal of FirstSignals) {
                        wayDatas.push({
                            "startData": { "mapCtptIntLat": firstSignal.signalLat, "mapCtptIntLot": firstSignal.signalLon },
                            "sTime": parseFloat(wayData.sTime) + parseFloat(firstSignal.totalTime),
                            "lineDatas": [...wayData.lineDatas, ...firstSignal.lineDatas]
                        });
                        signalDatas = signalDatas.filter(item =>
                            !(item.mapCtptIntLat === firstSignal.signalLat && item.mapCtptIntLot === firstSignal.signalLon)
                        );
                    }
                }
                else {
                    finalDatas.push({
                        "lineDatas": [...wayData.lineDatas, ...FirstSignals.lineDatas],
                        "time": parseFloat(wayData.sTime) + parseFloat(FirstSignals.totalTime)
                    });
                }

            }

            console.log("최종 경우의 수 데이터 입니다.");
            console.log(finalDatas);
            
            // finalDatas 오름차순 정렬해줘
            finalDatas.sort(function (a, b) {
                return b.time - a.time;
            });
            console.log("최종 경우의 수 데이터 입니다.");
            console.log(finalDatas);
            let i = 0;
            // 연한 회색 색상코드 알려줘
            


            let arr = ["#808080", "#808080", "#DD0000"]
            for(const finalData of finalDatas){
                DrawLinesDirect(mapInstance, finalData.lineDatas, arr[i]);
                i++;
            }
            alert("최적의 경로는 " + finalDatas[2].time + "초 입니다." + "\r\n" + "나머지 경로의 소요 시간은 " + finalDatas[0].time + "초, " + finalDatas[1].time + "초 입니다.");
        }
        else { // 횡단보도가 한개도 없다면
            DrawLinesDirect(mapInstance, FirstSignals.lineDatas);
        }
    }

    const TestMarking = (mapInstance, markerHook, signals, index) => {

        for (const signal of signals) { // <- Here's the change
            markerHook.AddIndexMarker(mapInstance, {
                "frontLat": signal.signalLat,
                "frontLon": signal.signalLon,
                "name": index,
            }, 1);
        }
    }

    const RunAPI = async (startLat, startLon, endLat, endLon) => {

        const headers = { "appKey": "pjLe1laNc23fdHAXTYHmS7XPMag2TXl31pRK5Ykl" };
        const data = {
            "startX": parseFloat(startLon),
            "startY": parseFloat(startLat),
            "endX": parseFloat(endLon),
            "endY": parseFloat(endLat),
            "startName": "출발지",
            "endName": "도착지"
        };

        var tTimeSec = 0;

        try {
            const response = await axios.post(
                "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&callback=result",
                data,
                { headers }
            );

            const currentData = response.data.features;
            tTimeSec = (currentData[0].properties.totalTime).toFixed(0); // 소요 시간 (초)
            let reVal = {
                "currentData": currentData,
                "timeSec": tTimeSec
            }

            return reVal;
        } catch (error) {
            console.log("api 호출 실패")
            console.log(error);
            return null;
        }
    }

    // 첫 신호등들 찾기
    const FindFirstSignals = async (mapInstance, startData, endData, signalDatas, markerHook, pastTime) => {
        console.log("함수들어옴");

        //console.log("SignalDatas 입니다.");
        //console.log(signalDatas);

        let firstSignals = [];
        let apiResults = await RunAPI(startData.mapCtptIntLat, startData.mapCtptIntLot, endData.mapCtptIntLat, endData.mapCtptIntLot)
        console.log("apiResults")
        console.log(apiResults)
        if (apiResults == null) {
            //에러
            console.log("길찾기 API 호출 Error");
        }

        let firstSignalData_StartToEnd = FindFirstSignalFromOne(mapInstance, markerHook, apiResults.currentData, signalDatas, true, pastTime);

        if (firstSignalData_StartToEnd.isEnd == false) {

            firstSignals.push(firstSignalData_StartToEnd);
            let ii = 0;
            for (const signalData of signalDatas) {
                let isDoFind = true;
                for (const alReadySignal of firstSignals) {
                    if (signalData.mapCtptIntLat == alReadySignal.signalLat && signalData.mapCtptIntLot == alReadySignal.signalLon) {
                        isDoFind = false;
                    }
                }

                if (isDoFind) {
                    apiResults = await RunAPI(startData.mapCtptIntLat, startData.mapCtptIntLot, signalData.mapCtptIntLat, signalData.mapCtptIntLot)

                    ii++;
                    let firstSignalDataTemp = FindFirstSignalFromOne(mapInstance, markerHook, apiResults.currentData, signalDatas, true, pastTime);
                    if (firstSignalDataTemp.isEnd == false) {
                        let isDoPush = true;
                        for (const alReadySignal of firstSignals) {
                            if (firstSignalDataTemp.signalLat == alReadySignal.signalLat && firstSignalDataTemp.signalLon == alReadySignal.signalLon) {
                                isDoPush = false;
                            }
                        }

                        if (isDoPush) {
                            firstSignals.push(firstSignalDataTemp);
                        }
                    }
                }
            }
            if (firstSignals.length > 0) {
                console.log("리턴하는부분1");
                console.log(firstSignals);
                return {
                    "isFind": true,
                    "firstSignals": firstSignals,
                    "apiResults": apiResults
                };
            }
        }
        // 출발지 -> 도착지에서도 신호등 0개일 경우.
        const lineDatas = getLineDatasFromApiResult(apiResults.currentData);
        const reVal = {
            "isFind": false,
            "firstSignals": {
                "isEnd": true,
                "signalLat": 0,
                "signalLon": 0,
                "totalTime": apiResults.currentData[0].properties.totalTime.toFixed(0),
                "lineDatas": lineDatas
            },
            "apiResults": apiResults
        }
        console.log("리턴하는부분2");
        console.log(reVal);
        console.log(reVal.firstSignals);
        console.log("----");
        return reVal;
    }

    const getLineDatasFromApiResult = (apiResults) => {
        let lineDatas = []
        for (const [index, data] of apiResults.entries()) {
            if (data.geometry.type != "Point") {
                lineDatas.push(data.geometry.coordinates);
            }
        }
        return lineDatas;
    }

    let indexsss = 0;
    // 하나의 경로에서 가장 빠른 신호등 찾기.
    const FindFirstSignalFromOne = (mapInstance, markerHook, datas, signalDatas, isEndPoint, pastTime) => {
        let lineDatas = [];
        let timeSec = 0;
        for (const [index, data] of datas.entries()) {
            if (data.geometry.type == "Point") {
                if (data.properties.turnType == 201) { // 종료지점 도착
                    return {
                        "isEnd": true,
                    }
                }
                else if (211 <= data.properties.turnType && data.properties.turnType <= 218) {
                    let lon = 0.0;
                    let lat = 0.0;
                    datas[index + 1].geometry.coordinates.forEach(point => {
                        lon += point[0];
                        lat += point[1];
                    });

                    lon = lon / datas[index + 1].geometry.coordinates.length;
                    lat = lat / datas[index + 1].geometry.coordinates.length;

                    for (const signalData of signalDatas) {
                        if ((lat - 0.0002 < signalData.mapCtptIntLat && signalData.mapCtptIntLat < lat + 0.0002) &&
                            (lon - 0.0002 < signalData.mapCtptIntLot && signalData.mapCtptIntLot < lon + 0.0002)) {
                            // 횡단보도 발견 (상하좌우 약 20m 수준)
                            // 여기에서 처음 발견한 횡단보도를 return 해준다.
                            let addTime = datas[index + 1].properties.time;
                            let crossTime = addTime; // 건너는 시간 timeSec : 움직이는데 걸리는 시간
                            
                            
                            let startTime = parseFloat(timeSec) + parseFloat(pastTime); // 신호등 출발지점 도착하는데까지 걸리는 시간
                            let plusTime = 0;// 신호등 반대편 도착 시간
                            console.log("signalData")
                            console.log(signalData)

                            let leftTime = parseFloat(signalData.PdsgRmdrCs) - parseFloat(startTime);
                            
                            // 도착했을 때 신호상태와 남은 시간. 계산
                            if (leftTime >= 0) {
                                // 신호 상태 유지되는 경우. // Heare
                                if(signalData.PdsgStatNm == "stop-And-Remain"){
                                    // 도착했을 때 빨간불이라면 남은시간만 더해주면됨.
                                    plusTime = parseFloat(leftTime);
                                }
                                else{
                                    // 도착했을 때 초록불이라면.
                                    if(crossTime < leftTime){
                                        // 도착했으나 건널 수 없는 경우
                                        plusTime = parseFloat(leftTime) + parseFloat(signalData.MaxStopPdsgRmdrCs)
                                    }
                                    else{
                                        // 도착했고 바로 건널 수 있는 경우
                                        plusTime = 0;
                                    }
                                }
                            }
                            else {
                                // 신호 상태 변경됨. 1번인지 2번인지 모름
                                leftTime = -leftTime; // 일딴 양수로 변경
                                if(signalData.PdsgStatNm == "stop-And-Remain"){ // 빨간불이라면
                                    while(true){
                                        if(leftTime < parseFloat(signalData.protectedMaxAllowedPdsgRmdrCs)){
                                            // 여기에 들어오면 Max - 차이 = 잔여시간이라고 생각하면됨.
                                            leftTime = parseFloat(signalData.protectedMaxAllowedPdsgRmdrCs) - leftTime;
                                            // 도착했을 때 초록불임.
                                            if(crossTime < leftTime){
                                                // 도착했으나 건널 수 없는 경우
                                                plusTime = parseFloat(leftTime) + parseFloat(signalData.MaxStopPdsgRmdrCs)
                                                break;
                                            }
                                            else{
                                                // 도착했고 바로 건널 수 있는 경우
                                                plusTime = 0;
                                                break;
                                            }
                                        }
                                        leftTime = leftTime - parseFloat(signalData.MaxStopPdsgRmdrCs);

                                        if(leftTime < parseFloat(signalData.MaxStopPdsgRmdrCs)){
                                            // 여기에 들어오면 Max - 차이 = 잔여시간이라고 생각하면됨.
                                            leftTime = parseFloat(signalData.MaxStopPdsgRmdrCs) - leftTime;
                                            // 도착했을 때 빨간불이라면 남은시간만 더해주면됨.
                                            plusTime = parseFloat(leftTime);
                                            break;
                                        }
                                        leftTime = leftTime - parseFloat(signalData.MaxStopPdsgRmdrCs);
                                    }
                                }
                                else{ // 초록불이라면
                                    while(true){
                                        if(leftTime < parseFloat(signalData.MaxStopPdsgRmdrCs)){
                                            // 여기에 들어오면 Max - 차이 = 잔여시간이라고 생각하면됨.
                                            leftTime = parseFloat(signalData.MaxStopPdsgRmdrCs) - leftTime;
                                            // 도착했을 때 빨간불이라면 남은시간만 더해주면됨.
                                            plusTime = parseFloat(leftTime);
                                            break;
                                        }
                                        leftTime = leftTime - parseFloat(signalData.MaxStopPdsgRmdrCs);

                                        if(leftTime < parseFloat(signalData.protectedMaxAllowedPdsgRmdrCs)){
                                            // 여기에 들어오면 Max - 차이 = 잔여시간이라고 생각하면됨.
                                            leftTime = parseFloat(signalData.protectedMaxAllowedPdsgRmdrCs) - leftTime;
                                            // 도착했을 때 초록불임.
                                            if(crossTime < leftTime){
                                                // 도착했으나 건널 수 없는 경우
                                                plusTime = parseFloat(leftTime) + parseFloat(signalData.MaxStopPdsgRmdrCs)
                                                break;
                                            }
                                            else{
                                                // 도착했고 바로 건널 수 있는 경우
                                                plusTime = 0;
                                                break;
                                            }
                                        }
                                        leftTime = leftTime - parseFloat(signalData.MaxStopPdsgRmdrCs);
                                    }
                                }

                            }

                            lineDatas.push(datas[index + 1].geometry.coordinates);
                            if (isEndPoint) {
                                addTime = addTime / 2;
                            }
                            return {
                                "isEnd": false,
                                "signalLat": signalData.mapCtptIntLat,
                                "signalLon": signalData.mapCtptIntLot,
                                "totalTime": (timeSec + addTime + plusTime).toFixed(0),
                                "lineDatas": lineDatas
                            }
                        }
                    }
                }
            }
            else {
                lineDatas.push(data.geometry.coordinates);
                timeSec += data.properties.time;
            }
        }
        return {
            "isEnd": true,
        }
    }


    const SearchDirections = async (mapInstance, signalHook, markerHook) => {
        ChangeCenter(mapInstance, startpoi.frontLat, startpoi.frontLon)

        if (startpoi == []) {

            return;
        }

        if (endpoi == []) {

            return;
        }

        ClearLines();

        const headers = { "appKey": "pjLe1laNc23fdHAXTYHmS7XPMag2TXl31pRK5Ykl" };
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
            const currentData = response.data.features;

            let newSignalDatas = await CleaningSignalData(currentData);
            FindBest(mapInstance, startpoi, endpoi, newSignalDatas, markerHook)

            tDistance = ((currentData[0].properties.totalDistance) / 1000).toFixed(1) + "km,"; // 총 거리
            tTimeMin = ((currentData[0].properties.totalTime) / 60).toFixed(0) + "분"; // 소요 시간
            // DrawLines(mapInstance, currentData);

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


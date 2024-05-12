import axios from "axios";
import { useEffect, useState } from "react";

export default function useSignal() {
    const [signalDatas, setSignalDatas] = useState([]); // 신호데이터 전체
    const [searchSignalDatas, setsearchSignalDatas] = useState([]); // 검색한 신호데이터
    const [isSearchDirectionOn, setIsSearchDirectionOn] = useState(false);
    const [mylocation, setMyLocation] = useState({ latitude: null, longitude: null });
    const [isUsingNormalData, setIsUsingNormalData] = useState(false);
    const [isUsingSearchData, setIsUsingSearchData] = useState(false);

    // // UI용 신호등 상태 업데이트
    useEffect(() => {
        const intervalID = setInterval(() => {
            axios.get("http://localhost:3002/api/test")
                .then((response) => {
                    const fetchedData = response.data;
                    setSignalDatas(fetchedData);
                })
                
            axios.get("http://localhost:3002/api/test/data")
                .then((response) => {
                    const fetchedData = response.data;
                    setsearchSignalDatas(fetchedData);
                })
        }, 1000)

        // 컴포넌트가 언마운트 될 때 정리 함수 실행
        return () => {
            clearInterval(intervalID);  // 정리 함수에서 setInterval을 clear 해줍니다.
        };
    })

    return {
        signalDatas, searchSignalDatas,
        isSearchDirectionOn,
        setSignalDatas,
        setIsSearchDirectionOn,
        setMyLocation
    }
}

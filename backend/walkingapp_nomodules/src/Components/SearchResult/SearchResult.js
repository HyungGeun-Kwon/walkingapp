import { useState } from 'react';
import './SearchResult.css';
import { ChangeCenter } from '../../Services/TMapControls/ChangeCenter';
import defaultMarker from '../../Images/pngwing.com.png'

const SearchResult = (props) => {
    const {
        markerUnitsControlHook,
        searchDirectionsHook,
        mapInstance,
        tMapSearchHook,
        setShowNormalSearch,
        isSearchResultVisible,
        setIsSearchResultVisible } = props;

    // 출발지와 도착지 설정 함수
    const setStartPoint = (poi) => {
        tMapSearchHook.setSearchResult("");
        tMapSearchHook.setTmapStartSearchKey(poi.name);
        markerUnitsControlHook.AddStartMarker(mapInstance, poi);
    };

    const setEndPoint = (poi) => {
        tMapSearchHook.setSearchResult("");
        tMapSearchHook.setTmapEndSearchKey(poi.name);
        markerUnitsControlHook.AddEndMarker(mapInstance, poi);
    };

    const handleItemClick = (poi) => {
        // 이 곳에서 아이템 클릭 이벤트를 처리합니다.
        ChangeCenter(mapInstance, poi.frontLat, poi.frontLon)
    };

    const onClickSetStartEnd = (isStart, value) => {
        // normal 검색 키 값 초기화, 검색창 출발지 도착지 검색하는 뷰로 변경.
        // 출발지 || 도착지 버튼 클릭 시 경로 설정. <- 출발지 도착지 검색어 변경 시 초기화시킴.

        tMapSearchHook.setTmapNormalSearchKey("");
        setShowNormalSearch(false);

        if (isStart) {
            tMapSearchHook.setTmapStartSearchKey(value.name)
            searchDirectionsHook.setStartpoi(value);
        }
        else {
            tMapSearchHook.setTmapEndSearchKey(value.name)
            searchDirectionsHook.setEndpoi(value);
        }
    }

    if (tMapSearchHook.searchResult.length === 0) return null;

    return (
        <div className="search-result-container" style={{ bottom: isSearchResultVisible ? "0" : "-30vh" }}>
            <button className="result-toggle-button" onClick={() => setIsSearchResultVisible(!isSearchResultVisible)}>
                <span style={{ transform: `rotate(${isSearchResultVisible ? "180deg" : "0deg"})` }}>▲</span>
            </button>
            <div className="result-list">
                {tMapSearchHook.searchResult.map((result, index) =>
                    <div key={index} className="result-item" onClick={() => handleItemClick(result)}>
                        {markerUnitsControlHook.AddIndexMarker(props.mapInstance, result, index)}
                        <img
                            src={defaultMarker}
                            alt={result.name}
                        />
                        <div>{result.name}</div>
                        <div className="item-actions">
                            <button onClick={(e) => { 
                                e.stopPropagation(); 
                                setStartPoint(result); 
                                onClickSetStartEnd(true, result);
                                }}>출발지</button>
                            <button onClick={(e) => { 
                                e.stopPropagation(); 
                                setEndPoint(result); 
                                onClickSetStartEnd(false, result);
                                 }}>도착지</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SearchResult;

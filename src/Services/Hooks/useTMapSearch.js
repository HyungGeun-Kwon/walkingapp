import { useState } from "react";
import { getTMapSearchResults } from "../TMapControls/api.js"

export default function useTMapSearch() {
    const [loading, setLoading] = useState(false);
    const [tmapNormalSearchKey, setTmapNormalSearchKey] = useState();
    const [tmapStartSearchKey, setTmapStartSearchKey] = useState();
    const [tmapEndSearchKey, setTmapEndSearchKey] = useState();
    const [searchResult, setSearchResult] = useState([]);

    const SearchAPI = (tmapSearchKey) => {
        setLoading(true);
        getTMapSearchResults(tmapSearchKey)
            .then((result) => { GetSearchResult(result); setLoading(false); })
            .catch((err) => { console.log("요청 실패" + err); setLoading(false);})
    }

    const GetSearchResult = (result) => {
        const results = result.data.searchPoiInfo.pois.poi;

        setSearchResult(results)
    }

    const onTMapNormalSearchClick = (event) => {
        event.preventDefault();
        SearchAPI(tmapNormalSearchKey);
    }
    const onTMapStartSearchClick = (event) => {
        event.preventDefault();
        SearchAPI(tmapStartSearchKey);
    }
    const onTMapEndSearchClick = (event) => {
        event.preventDefault();
        SearchAPI(tmapEndSearchKey);
    }

    return {
        searchResult,
        tmapNormalSearchKey,
        tmapStartSearchKey,
        tmapEndSearchKey,
        loading,
        setSearchResult,
        setTmapNormalSearchKey,
        setTmapStartSearchKey,
        setTmapEndSearchKey,
        onTMapNormalSearchClick,
        onTMapStartSearchClick,
        onTMapEndSearchClick,
    }
}
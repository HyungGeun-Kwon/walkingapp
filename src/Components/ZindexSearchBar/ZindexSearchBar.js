import './ZindexSearchBar.css';
import { MdSearch } from 'react-icons/md';

const ZindexSearchBar = (props) => {

    const { width, tMapSearchHook } = props;

    const onSearchChanged = (e) => {
        if (e.key === "Enter") {
            tMapSearchHook.onTMapNormalSearchClick(e);
        }
    }

    return (
        <div className="search-bar-container" style={{ width: width }}>
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search"
                    value={tMapSearchHook.tmapSearchKey}
                    onChange={(e) => { tMapSearchHook.setTmapNormalSearchKey(e.target.value); }}
                    onKeyDown={onSearchChanged}
                    className="search-input"
                />
                <button
                    className="search-button"
                    onClick={(e) => {
                        tMapSearchHook.onTMapNormalSearchClick(e);
                    }}>
                        <span></span>
                    <MdSearch
                        size={24} />
                </button>
            </div>
        </div>
    )
}

export default ZindexSearchBar;
import { BrowserRouter, Routes, Route, Link } from "react-router-dom"; 
import React, { useEffect } from 'react';
import TMapPage from './Pages/TMapPage';
import LoginPage from './Pages/LoginPage';

export default function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<TMapPage/>}/>
          <Route path='/Login' element={<LoginPage/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

// ISSUE
// 1. MarkerUnitsControl.js 에서 Clear 하면 잘 되는데 다른데서 Clear하면 한번 더 해야지 적용됨.
//    해서 현재는 무조건 MarkerUnits.Control.js에서 실행하는걸로 적용중.
// 2. 모바일에서 검색 진행 후 화면 터치할 때 마다 키판 열림.


// ** 최종 수정일 - 0530
// v0.0.5
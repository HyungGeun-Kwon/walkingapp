// const LoginPage = () => {
//     return (
//         <div style={{
//             background: "blue",
//             position: "absolute",
//             display: "flex",
//             flexDirection: "row",
//             width: "100vw",
//             height: "100vh"
//         }}>
//             <div style={{ background: 'red', }} >
//                 안녕하세요.
//                 </div>
//             <div style={{ background: 'green', flex: 1 }} />
//             <div style={{ background: 'blue', }} > 하이영
//                 </div>
//         </div>
//     )
// }

// export default LoginPage;

import React, { useEffect, useState } from "react";

const LoginPage = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
  });
  const [error, setError] = useState(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation이 지원되지 않습니다.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setError(null);
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        setError("위치 정보를 가져올 수 없습니다.");
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div>
      {error ? (
        <div>Error: {error}</div>
      ) : (
        <div>
          위도: {location.latitude}
          <br />
          경도: {location.longitude}
        </div>
      )}
    </div>
  );
};

export default LoginPage;

import { useEffect } from "react";

export const CreateMap = (mapInstance, mapRef, mapCenterLat, mapCenterLon) => {
    useEffect(() => {
        console.log("지도 생성");
        // 지도 생성
        mapInstance.current = new window.Tmapv2.Map(mapRef.current, {
            center: new window.Tmapv2.LatLng(mapCenterLat, mapCenterLon),
            width: '100%',
            height: '100vh',
            zoom: 17,
        });

        return () => {
            // 컴포넌트가 언마운트될 때 지도 객체 제거
            mapInstance.current.destroy();
        };
    }, []);
}
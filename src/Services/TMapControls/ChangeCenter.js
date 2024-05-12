export const ChangeCenter = (mapInstance, lat, lon) => {
    const center = new window.Tmapv2.LatLng(parseFloat(lat), parseFloat(lon));
    mapInstance.current.setCenter(center);
};
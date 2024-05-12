import { useState, useEffect, useRef, useCallback } from "react";

const useGeolocation = (signalHook) => {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [error, setError] = useState(null);
  const watchingId = useRef(null);

  const get = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        console.log("Geolocation이 지원되지 않습니다.");
        setError("Geolocation이 지원되지 않습니다.");
        reject("Geolocation이 지원되지 않습니다.");
        
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setError(null);
            // setLocation({
            //   latitude: position.coords.latitude,
            //   longitude: position.coords.longitude,
            // });
            setLocation({
              latitude: 37.57003727,
              longitude: 126.98707570,
            });
            signalHook.setMyLocation(location);
            console.log("내 위치 성공 : " + location.latitude + "/" + location.longitude);
            resolve();
          },
          (err) => {
            console.log("위치 정보를 가져올 수 없습니다.");
            console.log(err);
            setError("위치 정보를 가져올 수 없습니다.");
            reject("위치 정보를 가져올 수 없습니다.");
          }
        );
      }
    });
  };

  const start = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation이 지원되지 않습니다.");
      return;
    }

    watchingId.current = navigator.geolocation.watchPosition(
      (position) => {
        setError(null);
        // setLocation({
        //   latitude: position.coords.latitude,
        //   longitude: position.coords.longitude,
        // });
        setLocation({
          latitude: 37.56650983,
          longitude: 126.98293728,
        });
        signalHook.setMyLocation(location);
      },
      () => {
        setError("위치 정보를 가져올 수 없습니다.");
      }
    );
  }, []);

  const stop = useCallback(() => {
    if (watchingId.current) {
      navigator.geolocation.clearWatch(watchingId.current);
      watchingId.current = null;
      setLocation({ latitude: null, longitude: null });
      setError(null);
    }
  }, []);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return { location, error, get, start, stop };
};

export default useGeolocation;

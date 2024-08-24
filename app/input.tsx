import React, { Dispatch, SetStateAction } from 'react'
interface MyComponentProps {
    searchPlaces: () => void;
    setPoints: Dispatch<SetStateAction<{ point1: string; point2: string; }>>;
    
    points:{point1:string,point2:string};
  }
const InputDetails = ({searchPlaces,points,setPoints}:MyComponentProps) => {

    const getCurrentLocation = () => {

        return new Promise((resolve, reject) => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const latitude = position.coords.latitude;
                        const longitude = position.coords.longitude;
                        resolve({ latitude, longitude });
                    },
                    (error) => {
                        reject(error);
                    }
                );
            } else {
                reject(new Error("Geolocation is not supported by this browser."));
            }
        });
    };

    const currentLocation = () => {
    getCurrentLocation()
    .then((location:any) => {
        setPoints({...points,point1:`${location.latitude},${location.longitude}`});
    })
    .catch((error) => {
        console.error("Error getting location:", error);
    });
    }

    const handleChange = (e:any) => {
        console.log(points)
        setPoints({...points,[e.target.name]:e.target.value})
    }

    return (
    
    <div className=' h-[300px]  absolute top-0 left-0 z-50'>
        
        <div>
            <input onChange={handleChange} value={points.point1} type="text" name="point1" id = "" />
            <button onClick={currentLocation}>Current</button>
        </div>

        <div>
            {/* search */}
            <input onChange={handleChange} value={points.point2} type="text" name="point2" id = "" />
        </div>
        
        <button onClick={searchPlaces}>Search</button>
    
    </div>

)
}

export default InputDetails

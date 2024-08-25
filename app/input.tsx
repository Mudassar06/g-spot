import React, { Dispatch, SetStateAction } from 'react'
import AutocompleteInput from './autocomplete';
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
    
    <div className='flex flex-col gap-2 absolute top-4 left-4 z-50 p-2 rounded-md '>
        
        <div>
            <input className='p-2 rounded-md border border-neutral-500' onChange={handleChange} value={points.point1} type="text" name="point1" id = "" />
            <button className='ml-2 rounded-md p-2 px-4 bg-blue-600 text-white' onClick={currentLocation}>Current</button>
        </div>

        <div>
            {/* search */}
            <AutocompleteInput setPoints={setPoints} points={points}/>
            <input className='hidden'  onChange={handleChange} value={points.point2} type="text" name="point2" id = "" />
        </div>
        
        <button className='rounded-md p-2 px-4 bg-blue-600 w-full text-white' onClick={searchPlaces}>Search</button>
    
    </div>

)
}

export default InputDetails

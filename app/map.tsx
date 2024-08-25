"use client"
import  React, { ChangeEvent, useLayoutEffect, useRef, useState } from 'react'
import {OlaMaps} from '../maps/olamaps-js-sdk.es'
import axios from 'axios'
const MapBox = () => {

    
    const olaMaps = new OlaMaps({
        apiKey: process.env.NEXT_PUBLIC_OLA_MAPS_API_KEY!,
    })

    const [points,setPoints] = useState({point1:'',point2:''});
    const [locationData,setLocationData] = useState([])

    const handleChange = (e:any) => {
        console.log(points)
        setPoints({...points,[e.target.name]:e.target.value})
    }

    const mapRef = useRef()

    const getPlaces = async () => {
        // ?point1=${points.point1}&point2=${points.point2}
        try {
            const response = await axios.get(`/api/getspots`,{
                params:{
                    point1:points.point1,
                    point2:points.point2
                }
            });
            const locationDataLatLon =  response.data.locationData.map((e:any) => e.latlng);
            console.log(locationDataLatLon,"loc")
            setLocationData(response.data.locationData)
            console.log(response.data.locationData)



            locationDataLatLon.forEach((el:any) => {

                // olaMaps
                // .addMarker({ element: olaIcon, offset: [0, -1], anchor: 'bottom' })
                // .setLngLat([el.lat, el.lng])
                // .addTo(mapRef.current)    
            });

        } catch (error) {
            console.log(error)
        }

    }


    useLayoutEffect(()=>{
        const map =  olaMaps.init({
            style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
            container: 'map',
            center: [73.9477269, 18.5492945],
            zoom: 15
        })
        // var olaIcon = document.createElement('div')
        // olaIcon.classList.add('olalogo')
        
        olaMaps
        .addMarker({offset: [0, 0], anchor: 'top' })
        .setLngLat([73.9477269, 18.5492945])
        .addTo(map)
        olaMaps

        .addMarker({offset: [0, 0], anchor: 'top' })
        .setLngLat([73.9277269, 18.2492945])
        .addTo(map)
      

    },[])

        return (
            <>
                <div className=''>
                    <input name='point1' onChange={handleChange} type="text" />
                    <input name='point2' onChange={handleChange} type="text" />
                    <button onClick={getPlaces}>Get Places in between</button>
                </div>
                <div className="olalogo">ABC</div>
                <div id='map' style={{ height: '500px', width: '100%' }}></div>
            </>
        
        )
}

export default MapBox
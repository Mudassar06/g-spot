"use client"
import  React, { useLayoutEffect } from 'react'
import {OlaMaps} from '../maps/olamaps-js-sdk.es'

const MapBox = () => {

    useLayoutEffect(()=>{
        
        const olaMaps = new OlaMaps({
            apiKey: process.env.NEXT_PUBLIC_OLA_MAPS_API_KEY!,
        })
        
        const myMap = olaMaps.init({
            style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
            container: 'map',
            center: [73.9477269, 18.5492945],
            zoom: 15
        })

    },[])

        return (
            <>
                <div id='map' style={{ height: '500px', width: '100%' }}></div>
            </>
        
        )
}

export default MapBox
"use client";
import React, { useLayoutEffect, useRef, useState } from 'react';
import { OlaMaps } from '../maps/olamaps-js-sdk.es';
import axios from 'axios';
import { convertIntoFeatureCol } from '@/app/map-functions';
import InputDetails from './input'
import AutocompleteInput from './autocomplete';
const MapBox = () => {
    const [points,setPoints] = useState({point1:'',point2:''})
    const [featureCol, setFeatureCol] = useState<any[]>([]); 
    const myMapRef = useRef(null)

    const fetchData = async () => {
        try {
            const res:any = await axios.get('/api/getspots', {
                params: {
                    point1: points.point1,
                    point2: points.point2,
                }
            });
            return res.data.locationData;
        } catch (error) {
            console.error("ERROR IN MAP:", error);
            return [];
        }
    };

    const initializeMap = async (myMap:any) => {
        try {
            const raw = await fetchData();
            const features = convertIntoFeatureCol(raw);
            setFeatureCol(features);

            // myMap.on('load', () => {
                myMap.addSource('earthquakes', {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: features, 
                    },
                    cluster: true,
                    clusterMaxZoom: 14,
                    clusterRadius: 50,
                });

                myMap.addLayer({
                    id: 'clusters',
                    type: 'circle',
                    source: 'earthquakes',
                    filter: ['has', 'point_count'],
                    paint: {
                        'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 3, '#f1f075', 5, '#f28cb1'],
                        'circle-radius': ['step', ['get', 'point_count'], 20, 2, 30, 4, 40],
                    },
                });

                myMap.addLayer({
                    id: 'cluster-count',
                    type: 'symbol',
                    source: 'earthquakes',
                    filter: ['has', 'point_count'],
                    layout: {
                        'text-field': ['get', 'point_count'],
                        'text-size': 12,
                    },
                });

                myMap.addLayer({
                    id: 'unclustered-point',
                    type: 'circle',
                    source: 'earthquakes',
                    filter: ['!', ['has', 'point_count']],
                    paint: {
                        'circle-color': '#11b4da',
                        'circle-radius': 10,
                        'circle-stroke-width': 1,
                        'circle-stroke-color': '#fff',
                    },
                });
            // });
        } catch (error) {
            console.error("ERROR IN MAP INITIALIZATION:", error);
        }
    };


    const searchPlaces = () => {
        initializeMap(myMapRef.current);
    }

    useLayoutEffect(() => {

        const olaMaps = new OlaMaps({
            apiKey: process.env.NEXT_PUBLIC_OLA_MAPS_API_KEY!,
        });

        myMapRef.current = olaMaps.init({
            style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
            container: 'myMap',
            center: [73.86358689028958, 18.502145917948187],
            zoom: 15
        });


        return () => {
            
        };
    }, []); 

    return (
        <>
            <InputDetails setPoints={setPoints} points={points} searchPlaces={searchPlaces}/>
            <AutocompleteInput setPoints={setPoints} points={points}/>
            <div id='myMap' style={{ height: '100vh', width: '100%' }}></div>
        </>
    );
};

export default MapBox;

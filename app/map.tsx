"use client";
import React, { useLayoutEffect, useRef, useState } from 'react';
import { OlaMaps } from '../maps/olamaps-js-sdk.es';
import axios from 'axios';
import { convertIntoFeatureCol } from '@/app/map-functions';

const MapBox = () => {

    const [featureCol, setFeatureCol] = useState<any[]>([]); 

    const fetchData = async () => {
        try {
            const res = await axios.get('/api/getspots', {
                params: {
                    point1: `${process.env.NEXT_PUBLIC_TEST_POINT1}`,
                    point2: `${process.env.NEXT_PUBLIC_TEST_POINT2}`,
                }
            });
            return res.data.locationData;
        } catch (error) {
            console.error("ERROR IN MAP:", error);
            return [];
        }
    };

    useLayoutEffect(() => {
        const olaMaps = new OlaMaps({
            apiKey: process.env.NEXT_PUBLIC_OLA_MAPS_API_KEY!,
        });

        const myMap = olaMaps.init({
            style: "https://api.olamaps.io/tiles/vector/v1/styles/default-light-standard/style.json",
            container: 'myMap',
            center: [73.86358689028958, 18.502145917948187],
            zoom: 15
        });

        const initializeMap = async () => {
            try {
                const raw = await fetchData();
                const features = convertIntoFeatureCol(raw);
                setFeatureCol(features);

                myMap.on('load', () => {
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
                });
            } catch (error) {
                console.error("ERROR IN MAP INITIALIZATION:", error);
            }
        };

        initializeMap();

        return () => {
            
        };
    }, []); 

    return (
        <>
            <div id='myMap' style={{ height: '100vh', width: '100%' }}></div>
        </>
    );
};

export default MapBox;

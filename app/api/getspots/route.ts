import { NextRequest, NextResponse } from 'next/server';
import {getMidpoint, placesNearMidpoint, getLatLonFromPlaceId} from '../../map-functions'

// FE - browser function to get current position or places API

// coordinate --> List of places
// get 2 points  etc 
// calculate the coordinate between these two places

// search places around the central coordinate
// return the coordinates of these places in an array
// FE - display these on the map

export async function GET(request: NextRequest) {
  
  const requestUrl = request.url;
  
  const { searchParams } = new URL(request.url);

  const point1 = searchParams.get('point1'); 
  const point2 = searchParams.get('point2');

  const midpoint = getMidpoint(point1!,point2!)

  const places = await placesNearMidpoint(midpoint);


  const temp = await getLatLonFromPlaceId(places);

  return NextResponse.json({
    temp
  });
}
import { NextRequest, NextResponse } from 'next/server';



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
  const point2 = searchParams.get('pont2');
  const placeType = searchParams.get('pont2');

  // point1 - 'lat1,long1'   

  return NextResponse.json({
    message: "Hello from the API",
    request: requestUrl,
  });
}
import { strict } from "assert";
import axios from "axios";
import { Wire_One } from "next/font/google";

function toRadians(degrees:number) {
  return degrees * (Math.PI / 180);
}

function toDegrees(radians:number) {
  return radians * (180 / Math.PI);
}

function convertToLatLong(str:string) {
  // Split the string by comma and convert to numbers
  const [lat, lon] = str.split(',').map(Number);

  // Return the result as an object
  return { lat, lon };
}


export function getMidpoint(point1:string,point2:string) {
  const p1 = convertToLatLong(point1)
  const p2 = convertToLatLong(point2)

  const lat1Rad = toRadians(p1.lat);
  const lon1Rad = toRadians(p1.lon);
  const lat2Rad = toRadians(p2.lat);
  const lon2Rad = toRadians(p2.lon);

  const dLon = lon2Rad - lon1Rad;

  const Bx = Math.cos(lat2Rad) * Math.cos(dLon);
  const By = Math.cos(lat2Rad) * Math.sin(dLon);

  const latMid = Math.atan2(
    Math.sin(lat1Rad) + Math.sin(lat2Rad),
    Math.sqrt((Math.cos(lat1Rad) + Bx) ** 2 + By ** 2)
  );
  const lonMid = lon1Rad + Math.atan2(By, Math.cos(lat1Rad) + Bx);

  return {
    latitude: toDegrees(latMid),
    longitude: toDegrees(lonMid),
  };
}

export async function placesNearMidpoint(midpoint: {latitude: number, longitude: number}){
  const location = `${midpoint.latitude},${midpoint.longitude}`;

  try{
    const response = await axios.get('https://api.olamaps.io/places/v1/nearbysearch', {
      params: {
        layers: 'venue',
        types: 'movie_theater',
        location: location,
        // location: '18.531655170528808,73.8464479381058',
        api_key: process.env.NEXT_PUBLIC_OLA_MAPS_API_KEY!,
      },
      // headers: {
      //   'X-Request-Id': 
      // }    
    })
    const predictions = response.data.predictions;

    const extractedPlaces = predictions?.map((place:any)=> {
      return {
        description: place.description,
        place_id: place.place_id
      };
    });
    
    // console.log(extractedPlaces);

    return extractedPlaces;

  } catch (error) {
    console.log("\nError:", error)
  }
}

type obj = {description:string, place_id: string};
export async function getLatLonFromPlaceId(predArray: obj[]){

  const withLatLon: { description: string; place_id: string; latlng: string }[] = [];
  if(predArray?.length > 0){

  for (const element of predArray) {
    try {
      const response = await axios.get('https://api.olamaps.io/places/v1/details', {
        params: {
          place_id: element.place_id,
          api_key: process.env.NEXT_PUBLIC_OLA_MAPS_API_KEY!,
        },
      });

      // const { lat, lng } = response.data?.result?.geometry?.location;
      const latlng = response.data?.result?.geometry?.location;

      withLatLon.push({ ...element, latlng });
    } catch (error) {
      console.log('Error:', error);
    }
  }

  }

  console.log('ieihfiwhf', withLatLon);
  return withLatLon;
}
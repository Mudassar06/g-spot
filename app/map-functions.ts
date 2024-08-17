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

// const midpoint = getMidpoint(40.7128, -74.0060, 34.0522, -118.2437);

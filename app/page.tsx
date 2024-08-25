
import Image from "next/image";
import { useEffect } from "react";
import axios from "axios";
import MapBox from "./map";

export default function Home() {
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <MapBox/>
    </main>
  );
}

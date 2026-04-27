import { useEffect, useState } from "react"
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

const MapPage = () => {

    const [restaurants, setRestaurants] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getRestaurants = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + '/restaurants')
                const result = await response.json();
                setRestaurants(result)
            } catch (error) {
            console.error("Error fetching data:", error);
            } finally {
                setLoading(false)
            }
        };

    getRestaurants();
  }, []);

    return <div className="relative w-screen h-screen">
                <div className="absolute left-0 top-0 h-full w-80 bg-white overflow-y-auto z-10 shadow-lg p-4">
                    <h2 className="text-xl font-bold mb-4">Restaurants</h2>
                    {loading && <p>Loading...</p>}
                    {restaurants.map((restaurant) => (
                        <div key={restaurant.id} className="p-3 mb-2 border rounded-lg">
                            <h3 className="font-semibold">{restaurant.name}</h3>
                            <p className="text-sm text-gray-500">{restaurant.address}</p>
                            <p className="text-sm text-gray-500">{restaurant.halal_status}</p>
                        </div>
                    ))}
                </div>
                <div className="absolute inset-0">
                    <Map
                    
                        initialViewState={{
                        latitude: 43.6532,
                        longitude: -79.3832,
                        zoom: 11
                        }}
                        mapStyle="mapbox://styles/mapbox/streets-v12"
                        mapboxAccessToken={TOKEN}
                    >
                    </Map>
                </div>
            </div>
    }

export default MapPage
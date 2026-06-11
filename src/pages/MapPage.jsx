import { useEffect, useState, useMemo, useRef } from "react"
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'
import Pin from '../components/Pin'
import BottomSheet from "../components/BottomSheet"
import SearchBar from "../components/SearchBar"

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

const MapPage = () => {
    const [restaurants, setRestaurants] = useState([])
    const [loading, setLoading] = useState(true)
    const [selected, setSelected] = useState(null)
    const [search, setSearch] = useState('')
    const [userLocation, setUserLocation] = useState(null)
    const mapRef = useRef(null)
    const geolocateRef = useRef(null)

    const getRestaurants = async () => {
        try {
            const bounds = mapRef.current?.getBounds()
            const boundsParam = bounds
                ? `&bounds=${bounds.getSouth()},${bounds.getNorth()},${bounds.getWest()},${bounds.getEast()}`
                : ''
            const url = import.meta.env.VITE_API_URL + '/restaurants?' + 
                (search ? `name=${search}` : '') + boundsParam
            const response = await fetch(url)
            const result = await response.json()
            setRestaurants(result)
        } catch (error) {
            console.error("Error fetching data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            getRestaurants()
        }, 300)
        return () => clearTimeout(timer)
    }, [search])

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (!userLocation) {
                setUserLocation({ latitude: 43.6532, longitude: -79.3832 })
            }
        }, 3000)

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    clearTimeout(timeout)
                    const { latitude, longitude } = position.coords
                    setUserLocation({ latitude, longitude })
                },
                (error) => {
                    console.error("Error getting user location:", error)
                    clearTimeout(timeout)
                    setUserLocation({ latitude: 43.6532, longitude: -79.3832 })
                }
            )
        } else {
            clearTimeout(timeout)
            setUserLocation({ latitude: 43.6532, longitude: -79.3832 })
        }

        return () => clearTimeout(timeout)
    }, [])

    const pins = useMemo(
        () => restaurants.map((restaurant) => (
            <Marker
                key={restaurant.id}
                latitude={restaurant.lat}
                longitude={restaurant.lng}
                onClick={() => setSelected(restaurant)}            
            >
                <Pin />
            </Marker>
        )),
        [restaurants, setSelected]
    )

    if (!userLocation) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
                <p className="text-gray-500 text-sm">Finding your location...</p>
            </div>
        )
    }

    return (
        <div className="relative w-screen h-screen">
            <div className="absolute inset-0">
                <SearchBar search={search} onSearch={setSearch} />
                <Map
                    ref={mapRef}
                    onLoad={() => setTimeout(() => geolocateRef.current?.trigger(), 500)}
                    onMoveEnd={() => getRestaurants()}
                    initialViewState={{
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                        zoom: 13
                    }}
                    mapStyle="mapbox://styles/mapbox/streets-v12"
                    mapboxAccessToken={TOKEN}
                >
                    <GeolocateControl 
                        ref={geolocateRef}
                        position="top-right"
                        trackUserLocation={true}
                        showUserHeading={true}
                    />
                    <NavigationControl position="top-right" />
                    {pins}
                </Map>
                <BottomSheet 
                    restaurant={selected} 
                    onClose={() => setSelected(null)} 
                />
            </div>
        </div>
    )
}

export default MapPage
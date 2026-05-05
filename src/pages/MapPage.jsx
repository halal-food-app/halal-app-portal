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
    const mapRef = useRef(null)

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

    return <div className="relative w-screen h-screen">
                <div className="absolute inset-0">
                    <SearchBar search={search} onSearch={setSearch} />
                    <Map
                        ref={mapRef}
                        onMoveEnd={() => getRestaurants()}
                        initialViewState={{
                        latitude: 43.6532,
                        longitude: -79.3832,
                        zoom: 11
                        }}
                        mapStyle="mapbox://styles/mapbox/streets-v12"
                        mapboxAccessToken={TOKEN}
                    >
                        <GeolocateControl position="top-right" />
                        <NavigationControl position="top-right" />
                        {pins}
                    </Map>
                    <BottomSheet 
                        restaurant={selected} 
                        onClose={() => setSelected(null)} 
                    />
                </div>
            </div>
    }

export default MapPage
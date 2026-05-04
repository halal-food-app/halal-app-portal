import { useState, useEffect } from "react";

const BottomSheet = ({restaurant, onClose}) => {

    const [placeDetails, setPlaceDetails] = useState(null)
    const [placeLoading, setPlaceLoading] = useState(false)

    useEffect(() => {
        const getPlaceDetails = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_API_URL + '/places/' + restaurant.google_place_id)                
                const result = await response.json()
                setPlaceDetails(result)
            } catch (error) {
                console.error("Error fetching data:", error)
            } finally {
                setPlaceLoading(false)
            }
        }

        if (restaurant?.google_place_id) {
            getPlaceDetails()
        }

    }, [restaurant])

    if (!restaurant){
        return null
    }
    return <div className="fixed bottom-0 left-0 right-0 bg-white z-20 rounded-t-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold">{restaurant.name}</h2>
        <p className="text-gray-500 mt-1">{restaurant.address}</p>
        <p className="text-sm mt-1">{restaurant.halal_status}</p>
        {placeDetails && (
            <div className="mt-3">
                <p>⭐ {placeDetails.rating} · {placeDetails.userRatingCount} reviews</p>
                <p>{placeDetails.regularOpeningHours?.openNow ? '🟢 Open now' : '🔴 Closed'}</p>
                <p>{placeDetails.internationalPhoneNumber}</p>
            </div>
        )}
            <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${restaurant.lat},${restaurant.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-3 px-4 py-2 bg-green-500 text-white rounded-lg text-sm"
            >
                Get Directions
            </a>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500">
            ✕
        </button>
    </div>

}

export default BottomSheet;



const BottomSheet = ({restaurant, onClose}) => {

    if (!restaurant){
        return null
    }
    return <div className="fixed bottom-0 left-0 right-0 bg-white z-20 rounded-t-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold">{restaurant.name}</h2>
        <p className="text-gray-500 mt-1">{restaurant.address}</p>
        <p className="text-sm mt-1">{restaurant.halal_status}</p>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500">
            ✕
        </button>
    </div>

}

export default BottomSheet;

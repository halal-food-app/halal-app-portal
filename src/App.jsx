import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import MapPage from './pages/MapPage'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<MapPage />} />
    </Routes>
      

  );
}

export default App

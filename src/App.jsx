import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import MapPage from './pages/MapPage'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <MapPage />
        </ProtectedRoute>
      } />
    </Routes>
      

  );
}

export default App

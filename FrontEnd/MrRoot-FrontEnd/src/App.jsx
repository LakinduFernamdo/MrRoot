import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import ProtectedRoute from "./Components/ProtectedRoute";
import MapUI from "./Components/MapUI";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default login page */}
        <Route path="/" element={<LoginPage />} />

        {/* Map route after Google login */}
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <MapUI />
            </ProtectedRoute>
          }
        />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;

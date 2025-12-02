import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./Components/LoginPage";
import MapUI from "./Components/MapUI";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default login page */}
        <Route path="/" element={<LoginPage />} />

        {/* Map route after Google login */}
        <Route path="/map" element={<MapUI />} />
      </Routes>
    </Router>
  );
}

export default App;

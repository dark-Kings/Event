import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomeComponent from './component/HomeComponent'; 
 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeComponent />} /> 
        <Route path="/HomeComponent" element={<HomeComponent />} />
      </Routes>
    </Router>
  );
}

export default App;

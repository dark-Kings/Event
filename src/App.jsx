import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import HomeComponent from './component/HomeComponent';
import Login from './component/Login';
import Footer from './component/Footer';

function App() {
  return (
    <div className='d-flex flex-column' style={{ minHeight: '100vh' }}>
      <div className='flex-grow-1'>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="*" element={<HomeComponent />} />

          </Routes>

        </Router>
      </div>
      <Footer />
    </div>
  );
}

export default App;

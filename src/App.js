import Login from './pages/login'
import Dashboard from './pages/dashboard'

import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    Outlet
  } from 'react-router-dom';
  
  function App() {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    );
  }
export default App;

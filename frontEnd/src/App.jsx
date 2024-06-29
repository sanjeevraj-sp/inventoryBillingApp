import { BrowserRouter as Router } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import SideBar from './components/general/sideBar';
import Routes from './utils/routes'
import HeaderNav from './components/general/headerNav';

// import "./stylesheets/app.css";

function App() {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const userState = useSelector((state) => state.user);
  const theme = userState.theme;
  return (
    <div className={`app-${theme}`}>
      <Router>
        <HeaderNav/>
       <SideBar sidebarToggle={sidebarToggle} setSidebarToggle={setSidebarToggle}/>
       <Routes sidebarToggle={sidebarToggle} /> 
    </Router>
    </div>
  )
}

export default App

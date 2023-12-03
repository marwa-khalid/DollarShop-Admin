import React, { useState, useEffect } from 'react';
import './App.css';
import MainDash from './components/Pages/MainDash';
import Sidebar from './components/Sidebar';
import Customers from './components/Pages/Customers';
import Products from './components/Pages/Products';
import Login from './components/Pages/Login';
import Orders from './components/Pages/Orders';
import Franchise from './components/Pages/Franchises';
import Contact from './components/Pages/Contact';
import { useSelector, useDispatch } from 'react-redux';
import { selectLoggedIn, login, logout } from './components/redux/UserSlice';

const App = () => {

  const isLoggedIn = useSelector(selectLoggedIn);
  const dispatch = useDispatch();

  const pageComponents = {
    Customers: <Customers />,
    Dashboard: <MainDash />,
    Products: <Products />,
    Orders: <Orders />,
    Franchise: <Franchise/>,
    Contact: <Contact/>,
  };

  const handleMenuItemSelect = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  const [selectedMenuItem, setSelectedMenuItem] = useState(null);

  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    const user = localStorage.getItem("user");
    if (storedIsLoggedIn === "true") {
      dispatch(login({ user}));
    }
  }, []);
  
  return (
    <>
        {isLoggedIn ? (
            <>
            <div className="app">
              <Sidebar 
              onMenuItemSelect={handleMenuItemSelect}/>
              <div className="content">
                {selectedMenuItem && 
                  pageComponents[selectedMenuItem.heading]}
              </div>
            </div>
            </>
          ) : (
            <Login/>
          )}
    </>
  );
}

export default App;

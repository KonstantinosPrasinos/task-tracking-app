import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { IconButton } from '@mui/material'

import styles from './topAppBar.module.scss';
import { ScreenSizeContext } from '../../../context/ScreenSizeContext';

const TopAppBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const screenSizeContext = useContext(ScreenSizeContext);
  const [isMainPage, setIsMainPage] = useState(false);
  const currentLocation = location.pathname.slice(location.pathname.indexOf('/', 1) + 1, location.pathname.length).replaceAll('/', '');
  const capitalizedLocation = currentLocation.charAt(0).toUpperCase() + currentLocation.slice(1);

  useEffect(() => {
    console.log(location.pathname.split('/').length - 1 > 1)
    if (location.pathname.split('/').length - 1 > 1) {
      setIsMainPage(false);
    } else {
      setIsMainPage(true);
    }
  }, [location])

  return (screenSizeContext.state && <div className={styles.mainContainer}>
    {!isMainPage && <IconButton aria-label='Go back' onClick={() => navigate(-1)}><ArrowBackIosNewIcon /></IconButton>} 
    <div className={styles.locationText}>{capitalizedLocation}</div>
  </div>);
};

export default TopAppBar;

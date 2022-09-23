import HomeIcon from '@mui/icons-material/Home';
import TimerIcon from '@mui/icons-material/Timer';
import SettingsIcon from '@mui/icons-material/Settings';
import AddIcon from '@mui/icons-material/Add';

import styles from './BottomBar.module.scss';
import IconButton from "../../buttons/IconButton/IconButton";
import FilledButton from "../../buttons/FilledButton/FilledButton";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

const BottomBar = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [selected, setSelected] = useState(null);

    useEffect(() => {
        switch (location.pathname) {
            case '/':
            case '/home':
                setSelected('home')
                break;
            case '/timer':
                setSelected('timer')
                break;
            case '/settings':
                setSelected('settings')
                break;
            default:
                break;
        }
    }, [location]);

    return (
        <div className={styles.container}>
            <IconButton
                onClick={() => {
                    setSelected('home'); navigate('/');
                }}
                label={'Home'}
                selected={selected === 'home'}
            >
                <HomeIcon sx={{fontSize: '1.5em'}} />
            </IconButton>
            <IconButton
                onClick={() => {
                    setSelected('timer');
                    navigate('/timer');
                }}
                label={'Timer'}
                selected={selected === 'timer'}
            >
                <TimerIcon sx={{fontSize: '1.5em'}} />
            </IconButton>
            <IconButton
                onClick={() => {
                    setSelected('settings');
                    navigate('/settings');
                }}
                label={'Settings'}
                selected={selected === 'settings'}
            >
                <SettingsIcon sx={{fontSize: '1.5em'}} />
            </IconButton>
            <FilledButton
                onClick={() => {
                    navigate('/new-task')
                }}
                type='square'
            >
                <AddIcon sx={{fontSize: '2em'}} />
            </FilledButton>
        </div>
    );
};

export default BottomBar;

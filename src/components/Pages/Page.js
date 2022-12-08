import React, { useState } from 'react';
import {ThemeContext} from '../../common/Context';
import MainPage from '../Layout/MainPage';
import { userStore as user } from '../../common/UserStore';
import cookie from 'react-cookies';

function Page(props) {
    user.change(cookie.load('name'), cookie.load('isAdmin')); 
    const [theme, setTheme] = useState('light');  
    return(<> 
    <img className='theme-img' onClick={() =>setTheme(theme === 'light'?'dark':'light')}  src={theme === 'light'?require('../../img/sun.png'):require('../../img/moon.png') } />
    <ThemeContext.Provider value={theme}>
    <MainPage/>
    </ThemeContext.Provider> 
    </>)
}

export default Page;
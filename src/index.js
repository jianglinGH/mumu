import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import './style/index.css'; 
import './style/base.scss';
import './style/partial.scss';
import 'antd/dist/antd.css'; 
import './style/theme.less';
import './style/demo.scss';

import Page from './components/Pages/Page'; 
import reportWebVitals from './reportWebVitals';
import {apiPath} from './common/api'; 
 
const root = ReactDOM.createRoot(document.getElementById('root'));

 
root.render(
//   <React.StrictMode>
   <Page/>
//   </React.StrictMode>
);
  
// console.log(window);
// fetch(apiPath('/api/testAPI'))
//     .then(res => res.text())
//     .then(res => {
//         console.log(res)
//     }) 

// fetch(apiPath('/api/query'))
// .then(res => res.text())
// .then(res => {
//     console.log(JSON.parse(res))
// })
    

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

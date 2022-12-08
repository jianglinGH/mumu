import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CountTime, myTimer } from '../demo/CountTime';
import router from '../../common/router'; 
import { useContext, useState } from 'react'; 
  
function RouterEle() {

    return (
        <Routes>
            {/* <Route path="/time" element={<CountTime timer={myTimer} />} /> */}
            {router.map((ele) => {
                return (
                    <Route path={ele.path} exact element={<ele.components/>} key={ele.path}/>
                )
            })}

        </Routes>
    )
}

export default RouterEle;

import { useEffect, useState, createRef } from 'react'; 
import { observer } from 'mobx-react-lite';
import {apiOptions, apiPath, fetchOptions} from '../../common/api.js'
import { userStore as user } from '../../common/UserStore';
import { setExerciseCalendar } from '../../common/EcCalendar'
import {Radio, Space, Spin} from 'antd';
import { loginMsg } from "../../common/message";
import {getTime} from '../../common/interface';

function ExercisePage() { 
    const echartRef = createRef(null);
    const sleepRef = createRef(null); 
    const [refresh, setRefresh] = useState(false); 
    const [status, setStatus] = useState('awake');
    const [exercise, setExercise] = useState(0);
    const [showLoading, setShowLoading] = useState(true);

    let records, curYear;

    useEffect(() => {
        getTime().then(res => {
            let result = JSON.parse(res);
            const date = result.data.date;
       
            fetchOptions('/api/exerciseRecords', {user: user.name}) 
            .then(res => { 
                setShowLoading(false);
                const result = JSON.parse(res);
                const records_ = result.data.map(ele => {
                    return [ele.date, ele.exercise]
                });  
                records = records_;
                curYear = date.substring(0, 4);
                if(echartRef && echartRef.current) {
                    setExerciseCalendar(echartRef.current, records, curYear)
                }
            }) 
        })  
    }, [echartRef])
     
    useEffect(() => {
        if(refresh) {
            let num = 0;
            let timer = setInterval(() => { 
                num++;
                if(sleepRef.current) {
                    sleepRef.current.style.height = num + 'px';
                } 
                if(num === 80) {
                    setRefresh(false);
                    clearInterval(timer);
                }
            }, 50) 

            fetchOptions('/api/recordExercise', {user: user.name, exercise})  
            .then(res => {
           
            })
        }
        
    }, [refresh])
  
    function goToExercise() {
        if(!loginMsg()) {
            setRefresh(true);
            setStatus('asleep');
        }
    }

    function onChange(e) {
        let val = e.target.value;
        setExercise(val);
    }
   
    return( <div className="page-content">
                <div className='content-sleep-box'>
                    <div className='content-sleep-detail'> 
                        <Space size={'large'}>
                            <div className='content-sleep-record' status={status} onClick={goToExercise}>
                                <img src={require('../../img/exercise.png')}/>
                                <div className='content-sleep-shadow' ref={sleepRef}></div>
                            </div>
                            <Radio.Group onChange={onChange} defaultValue={exercise}>
                                <Radio value={1}>运动</Radio>
                                <Radio value={0}>无运动</Radio> 
                            </Radio.Group>
                        </Space> 
                        <div ref={echartRef} style={{height: '500px', width: '800px'}}></div>
                    </div>
                </div>
                {
                    showLoading ? <Spin className='page-loading-icon'/> : ''
                }
            </div>)
}

export default observer(ExercisePage);
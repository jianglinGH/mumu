
import { useEffect, useState, createRef } from 'react'; 
import { observer } from 'mobx-react-lite';
import {fetchOptions} from '../../common/api.js'
import { userStore as user } from '../../common/UserStore';
import { setStudyCalendar } from '../../common/EcCalendar'
import {InputNumber, Space, Spin} from 'antd';
import { loginMsg } from "../../common/message";
import {getTime} from '../../common/interface'; 

function StudyPage() { 
    const echartRef = createRef(null);
    const sleepRef = createRef(null); 
    const [refresh, setRefresh] = useState(false); 
    const [status, setStatus] = useState('awake');
    const [study, setStudy] = useState(0);
    const [showLoading, setShowLoading] = useState(true);

    let records, curYear;

    useEffect(() => {
        getTime().then(res => {
            let result = JSON.parse(res);
            const date = result.data.date;
       
            fetchOptions('/api/studyRecords', {user: user.name}) 
            .then(res => { 
                setShowLoading(false);
                const result = JSON.parse(res);
                const records_ = result.data.map(ele => {
                    return [ele.date, ele.study]
                });  
                records = records_;
                curYear = date.substring(0, 4);
                if(echartRef && echartRef.current) {
                    setStudyCalendar(echartRef.current, records, curYear)
                }
            }) 
        })  
    }, [echartRef])
  
    var dataE = [];		//运动量 1或0	
    dataE.push(["2022-11-28",0],["2022-11-29",0])
      
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
      
            fetchOptions('/api/recordStudy', {user: user.name, study}) 
            .then(res => {
           
            })
        }
        
    }, [refresh])
  
    function goToStudy() {
        if(!loginMsg()) {
            setRefresh(true);
            setStatus('asleep');
        }
    }

    function onChange(val) {
        setStudy(val);
    }
   
    return( <div className="page-content">
                <div className='content-sleep-box'>
                    <div className='content-sleep-detail'>
                        <Space size={'large'}>
                            <div className='content-sleep-record' status={status} onClick={goToStudy}>
                                <img src={require('../../img/clock.png')}/>
                                <div className='content-sleep-shadow' ref={sleepRef}></div>
                            </div>
                            <InputNumber min={0} max={10} defaultValue={0} onChange={onChange} />
                        </Space>
                        <div ref={echartRef} style={{height: '500px', width: '800px'}}></div>
                    </div>
                </div>
                {
                    showLoading ? <Spin className='page-loading-icon'/> : ''
                }
                
            </div>)
}

export default observer(StudyPage);
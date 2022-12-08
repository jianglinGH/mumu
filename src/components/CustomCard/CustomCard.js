 
import { observer } from "mobx-react-lite";
import {Card, Checkbox, Col, Row, Progress, Input} from 'antd';
import { useEffect, useRef, useState } from "react";
import { fetchOptions } from "../../common/api";
import {userStore as user} from '../../common/UserStore';
import {loginMsg} from '../../common/message';
import {getTime} from '../../common/interface';
import {compareDateSmall}  from '../../common/time';

function CustomCard(props) {

    const title = props.title;
    const classify = props.classify;
    const [newInputRender, setNewInputRender] = useState(false);
    const inputRef = useRef(null);
    const newInputRef = useRef(null);
 
    const [list, setList] = useState([]);
    const [donePercent, setDonePercent] = useState(0);
    
    function changeTaskStatus(e) {
        console.log(e.target);
        const checked = e.target.checked;
        const taskId =  e.target.taskId;
        const status = checked ? 1 : 0;
        editTask(taskId, undefined, status, undefined);
    }

    function getList() {
        fetchOptions('/api/getTasks', {user: user.name, classify}).then(res => {
            let result = JSON.parse(res);

            getTime().then(res => {
                let result_ = JSON.parse(res);
                const date = result_.data.date; 
                result.data.forEach(element => {
                    if(compareDateSmall(element.date, date)) {
                        element.delay = 1;
                    }else {
                        element.delay = 0;
                    }
                });
                setList(result.data);
                const count = result.data.length;
                const done = result.data.filter(ele => ele.status === 1).length;
                setDonePercent(parseInt(done/count * 100));
                setTimeout(() => {
                    if(inputRef.current) { 
                        inputRef.current.input.onblur = function() {
                            const value = inputRef.current.input.value;
                            const taskId = inputRef.current.input.getAttribute('taskid');
                            if(value) {
                                editTask(taskId, undefined, undefined, value); 
                            }else {
                                setNewInputRender(false);
                            } 
                        }
                    } 
                }, 100) 
            })

        })
    }

    function editTask(taskId, delay, status, taskName) {
        let obj = {};
        if(delay !== undefined){
            obj.delay = delay;
        }
        if(status !== undefined){
            obj.status = status;
        }
        if(taskName !== undefined){
            obj.taskName = taskName;
        }
        let param = Object.assign({taskId: Number(taskId)}, obj) 
        fetchOptions('/api/editTask', param).then(res => {
            let result = JSON.parse(res);
            if(result.code) {
                getList();
            }
        })
    }

    useEffect(() => {
        getList();
    }, [])
    
    function addItem() {
        if(!loginMsg()) {
            setNewInputRender(true);
            setTimeout(() => {
                if(newInputRef.current) {
                    newInputRef.current.focus();
                    newInputRef.current.input.onblur = function() {
                        const value = newInputRef.current.input.value;
                        if(value) {
                            fetchOptions('/api/addTask', {user: user.name, classify, taskName: value})
                            .then(res => { 
                                setNewInputRender(false);
                                let result = JSON.parse(res);
                                if(result.code) {
                                    getList();
                                }
                            })
                        }else {
                            setNewInputRender(false);
                        }
                    }
                } 
            }, 100) 
        } 
    }
 
    return(
        <Card title={
            <>
                <span className="todo-title">
                    {title}
                </span>
                <img className="todo-addicon" onClick={addItem} src={require('../../img/addIcon.png')}/>
            </>
            }> 
            <div className="todo-task">
                <ul className="todo-ul">
                    { list.length ? list.map(ele => {
                        return(
                            <li key={ele.taskId} className={ele.status == 1 ? 'todo-done' : ''}>
                                <Checkbox taskId={ele.taskId} onChange={changeTaskStatus} checked={ele.status == 1}>
                                    {ele.status === 1 ? <span className="todo-done-span">{ele.taskName}</span> : 
                                    <Input className="border-none todo-input-ordinary" defaultValue={ele.taskName} ref={inputRef} taskid={ele.taskId} delay={ele.delay} title={ele.delay===1?ele.date:''}/>}                                   
                                </Checkbox>
                            </li>
                            )
                        })
                    : ''}
                    {
                        newInputRender &&
                        <li key='new' >
                            <Input className="border-none todo-input-new" style={{marginLeft: '24px'}} ref={newInputRef} placeholder="add a task"/>
                        </li>
                    }
                </ul>
            </div> 
            <div className="todo-progress">
                <Progress type="circle" percent={donePercent} width={80} /> 
            </div> 
        </Card>)
}
export {CustomCard};
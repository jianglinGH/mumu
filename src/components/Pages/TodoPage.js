 
import { observer } from "mobx-react-lite";
import {Card, Col, Row, Progress, Input} from 'antd';
import {CustomCard} from '../CustomCard/CustomCard'
import {userStore as user} from '../../common/UserStore';
import { fetchOptions } from "../../common/api";
import { useEffect, useState, useRef} from "react";
import { loginMsg } from "../../common/message";

function TodoPage() {
    const [note, setNote] = useState('');
    const textareaRef = useRef(null);
    
    function saveNote() { 
        if(textareaRef.current) {
            if(!loginMsg()) {
                const val = textareaRef.current.resizableTextArea.props.value;
                setNote(val);  
                fetchOptions('/api/editNote', {user: user.name, note: val}).then(res => {
                })
            }
        }
      
    }

    useEffect(() => {
        fetchOptions('/api/getNote', {user: user.name}).then(res => {
            let result = JSON.parse(res);
            if(result.data[0]) {
                let note_ = result.data[0].note;
                setNote(note_);
            }
        })
    }, [])
  
    return(<div className="page-content">
        <div className="content-sleep-box todo-box">
            <div className="todo-card">
                <Row gutter={24} className="todo-row">
                    <Col span={10}>
                        <CustomCard title="important & urgent" classify="1"/>
                    </Col>
                    <Col span={10}>
                        <CustomCard title="important & not urgent" classify="2"/>
                    </Col>
                </Row>
               
                <Row gutter={24} className="todo-row">
                    <Col span={10}>
                        <CustomCard title="urgent & not important" classify="3"/>
                    </Col>
                    <Col span={10}> 
                        <Card title={
                            <>
                                <span className="todo-title">
                                    note
                                </span>
                                <img className="todo-addicon" onClick={saveNote} src={require('../../img/saveNote.png')}/>
                            </>
                            }>
                            <div style={{float: 'left', width: '100%'}}>
                                <Input.TextArea ref={textareaRef} defaultValue={note} key={note} style={{minHeight: '76px'}}></Input.TextArea>
                            </div> 
                            <div style={{float: 'left', width: '0%'}}>
                                <Progress type="circle" percent={0} width={80} style={{visibility: 'hidden'}}/> 
                            </div> 
                        </Card>
                    </Col>
                </Row>
                <Row gutter={24} style={{margin: 0, marginBottom: 8}}>
                </Row>
            </div> 
        </div>
    </div>)
}
export default observer(TodoPage);
import {useRef, useState} from 'react';
import {Input, Button} from 'antd';

function FancyInput() {
    const inputRef = useRef();
    const [val, setVal] = useState();
    function onFocus() {
        inputRef.current.focus();
    }
 
    return(<>
    <Input ref={inputRef} type='text' style={{width: '200px'}}/>
    <Button onClick={onFocus}>click to focus</Button>
    <Button onClick={() => {setVal(inputRef.current.input.value)}}>click to show val</Button>
    <span>{val}</span>
    </>)
}

export default FancyInput;
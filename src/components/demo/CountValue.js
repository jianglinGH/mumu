import {Button} from 'antd';
import {counterStore as cs} from './CounterStore'; 
import {observer} from 'mobx-react';
import OtherValue from './OtherValue';

const CountValue = observer(() => { 
    return (<div className='demo-countvalue'>
    <Button onClick={() => cs.decrease()}>-</Button>
    {cs.count}
    <Button onClick={() => cs.increase()}>+</Button>
    OtherValue:
    <OtherValue />
    <span>count: </span>
    {cs.total}
    </div>)
})  

export default CountValue;
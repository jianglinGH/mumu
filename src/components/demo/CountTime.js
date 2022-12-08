import React from 'react';
import {makeAutoObservable} from 'mobx';
import {observer} from 'mobx-react';
import {Button} from 'antd';
 
class Timer {
    seconds = 0;
    constructor() {
        makeAutoObservable(this);  // 监听实例对象
    }
    increase() {
        this.seconds += 1;
    }
    reset() {
        this.seconds = 0;
    }
}

const myTimer = new Timer();


const CountTime = observer(({timer}) => {  

    return (
        <Button type='primary'  onClick={() => timer.reset()}>Seconds passed: {timer.seconds}</Button>
    ) 
})

setInterval(() => {
    myTimer.increase();
}, 1000)

  

export {CountTime, myTimer};
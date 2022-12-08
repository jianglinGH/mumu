import {action, observable, makeObservable, computed, autorun} from 'mobx';

class CounterStore { 
    count = 0;
    price = 2;
    constructor(count) {
        // makeObservable 定义观察的内容 
        makeObservable(this, {
            count: observable,
            increase: action.bound,         // 绑定行为
            decrease: action.bound,         // 绑定行为
            total: computed                 // 计算值
        })
    }

    //  通过 action 改变被观察的值
    increase() { 
        this.count++;  
    }

    // 通过 action 改变被观察的值
    decrease() {
        if(this.count > 0) {
            this.count--;
        }  
    }

    // 被观察的值改变时自动触发 computed
    get total() {
        console.log('computed')
        return this.price * this.count;
    }
    
}
const counterStore = new CounterStore();

// 观察对象变化, 自动执行
autorun(() => {
    console.log('auto run')
    return counterStore.total; 
})
export {counterStore} ;

 
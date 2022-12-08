import {userStore as user} from './UserStore';
import {message} from 'antd';
const loginMsg = function() {
    if(!user.name) {
        message.info('请登录');
        return true;
    }else {
        return false;
    }
}
  
export {loginMsg}
import {makeObservable, observable,computed,action, autorun} from 'mobx';
class UserStore {
    name = '';
    isAdmin = '';
    constructor() {
        makeObservable(this, {
            name: observable,
            isAdmin: observable,
            change: action.bound,
            logout: action.bound,
            hasLogged: computed,
            isadmin: computed 
        })
    }

    change(name, isAdmin) {
        this.name = name;
        this.isAdmin = isAdmin;
    }

    logout() {
        this.name = '';
        this.isAdmin = '';
    }

    get hasLogged() {
        return this.name;
    }

    get isadmin() {
        return this.isAdmin === '1';
    }
}
const userStore = new UserStore();
export {userStore};
import {makeObservable, observable,action} from 'mobx';
class SearchCondStore {
    categoryid = 1;
    articlename = '';
    constructor() {
        makeObservable(this, {
            categoryid: observable,
            articlename: observable,
            changeId: action.bound,
            changeName: action.bound
        })
    }

    changeId(id) {
        this.categoryid = id; 
    }

    changeName(name) {
        this.articlename = name; 
    }
}
const searchCondStore = new SearchCondStore();
export {searchCondStore};
const getSpecialType = function (categoryid){
    switch(categoryid){
        case 21: return 'exercise';
        case 22: return 'study';
        case 23: return 'sleep';
        case 24: return 'todo';
        default: return '';
    }
}

export {getSpecialType}
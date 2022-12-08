// '2000-01-01'
const compareDateSmall = function(date, compareDate) {
    let date_ = date.split('-');
    let dateTime_ = new Date(date_[0], date_[1], date_[2]).getTime();
    let compareDate_ = compareDate.split('-');
    let compareDateTime_ = new Date(compareDate_[0], compareDate_[1], compareDate_[2]).getTime();
    if(dateTime_ < compareDateTime_) {
        return true;
    }else {
        return false;
    }
}

export {compareDateSmall}
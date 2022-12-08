const debounceFn = (callback, millsec) => {
    let timeout;
    if(timeout) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            callback();
        }, millsec ? millsec : 300)
    }
}

export {debounceFn}
const env = process.env.NODE_ENV;  // development or production
function apiPath(path) {
    if(env === 'development') {
        return `http://localhost:9000${path}`
    }
    if(env === 'production') {
        return path;
    }
}

// fetch 可传地址或 Requst 实例
const apiOptions = function(url, data) { 
    const requestInstance = new Request(url, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    
    return requestInstance;
}

const fetchOptions = function(url, data) {
    const promise = fetch(apiOptions(apiPath(url), data)).then(res => res.text());
    return promise;
}

export {apiPath, apiOptions, fetchOptions}; 
import { apiPath, apiOptions } from './api';

const getCategories = function() {
    let promise = fetch(apiPath('/api/categories')).then(res => res.text());
    return promise; 
};

const addArticle = function(param) {
    let promise = fetch(apiOptions(apiPath('/api/addArticle'), param)).then(res => res.text());
    return promise;
};

const fetchArticleDetail = function(param) {
    let promise = fetch(apiOptions(apiPath('/api/articleDetail'), param)).then(res => res.text());
    return promise;
}

const fetchArticles = function(param) {
    let promise = fetch(apiOptions(apiPath('/api/articles'), param)).then(res => res.text());
    return promise;
} 

const getTime = function() {
    let promise = fetch(apiPath('/api/getTime')).then(res => res.text());
    return promise;
} 

export {getCategories, addArticle, fetchArticleDetail, fetchArticles, getTime}
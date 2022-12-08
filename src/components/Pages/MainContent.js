
import { useEffect, useContext, useState, useRef } from 'react'; 
import {searchCondStore as searchCond} from '../../common/SearchCondStore';
import { observer } from 'mobx-react-lite';
import {fetchOptions} from '../../common/api.js'
import { userStore as user } from '../../common/UserStore';
import {useSyncCallback} from '../../common/useFunction'; 
import {Link} from 'react-router-dom';
import {CustomEditorView} from '../CustomEditor/CustomEditorView'
import {fetchArticles} from '../../common/interface'
import {Spin} from 'antd';

function MainContent() { 
     
    const [articles, setArticles] = useState([]);
    const [isSpecial, setIsSpecial] = useState(false);
    const [reRender, setReRender] = useState(0);
    const [showLoading, setShowLoading] = useState(true);
 
    const isSpecialCategory = function(id) {
        return [21, 22].includes(id);
    }

    useEffect(() => {
        let categoryid = searchCond.categoryid; 
        setIsSpecial(isSpecialCategory(categoryid));
        if(categoryid && !isSpecialCategory(categoryid)) {
            fetchArticles({categoryid, user: user.name, name: searchCond.articlename})
            .then(res => { 
                let result = JSON.parse(res);
                if(result.code && result.data.length) {
                    setArticles(result.data); 
                    setTimeout(() => {  //延时渲染以便获取值
                        setReRender(reRender + 1);
                    }, 100)
                }else {
                    setArticles([]);
                }
                setShowLoading(false);
            })
            .then(

            )
        }
    
    }, [searchCond.categoryid, searchCond.articlename])
  
    function selectLike(articleid) { 
        fetchOptions('/api/likes', {articleid, likes: 1})  
        .then(res => { 
            articles.forEach(ele => {
                if(ele.articleid === articleid) {
                    ele.likes++;
                }
            }); 
            // 数组的地址没变 不会更新
            let newArticles = JSON.parse(JSON.stringify(articles));
            setArticles(newArticles);
      
        }) 
    }
     
    // const setArticleDetailValue = useSyncCallback(() => {
    //     let articleDetail = articles.filter(ele => {
    //         if(ele.articleid === articleidSelected) {
    //             return ele;
    //         }
    //     })
    //     setArticleDetail(articleDetail[0]);
    // }); 
 
    return(<div className="page-content">
        <div className='content-article-box'>
            {articles.length ? 
                // 列表
                articles.map(ele => 
                    <div className='content-article' key={ele.articleid}>
                        <h5 className='content-article-title'>{ele.name}</h5>
                        <Link to={'/articleDetail?articleid='+ele.articleid}>
                            {/* <div className='content-article-txt'>{ele.content}</div> */}
                            <div className='content-article-txt'>
                                <CustomEditorView value={ele.content ? JSON.parse(ele.content) : [{
                                    type: 'paragraph',
                                    children: [{ text: '' }],
                                }]} key={reRender}/>
                            </div>
                        </Link>
                        
                        <div className='content-article-like'>
                            <span className='content-article-like-icon' onClick={() => {selectLike(ele.articleid)}}>&#x2665;</span>
                            <span className='content-article-like-count'>{ele.likes}</span>
                        </div>
                    </div>
                ) : (
                    isSpecial ?
                    <>special {searchCond.categoryid}</> :
                    <div>Hello World!</div> 
                )
            }
        </div>
        {
            showLoading ? <Spin className='page-loading-icon'/> : ''
        }
    </div>)
}

export default observer(MainContent);

import { useEffect, useState, useRef } from 'react'; 
import { observer } from 'mobx-react-lite';
import {fetchOptions} from '../../common/api.js'
import { userStore as user } from '../../common/UserStore';
import {Input, message, Modal} from 'antd';
import {useSyncCallback} from '../../common/useFunction'; 
import {useLocation, useNavigate} from 'react-router-dom';
import {fetchArticleDetail} from '../../common/interface'
import {Link} from 'react-router-dom';
import {CustomEditorView} from '../CustomEditor/CustomEditorView'
import {CustomEditor} from '../CustomEditor/CustomEditor'
  
function ArticleDetail() { 
    const location = useLocation();
    const params = location.search.split('&');
    const articleidSelected = params[0].split('=')[1];
    const sourcePage = params[1]?.split('=')[1];
    const [status, setStatus] = useState('view');
    const username = user.name;
    const [articleDetail, setArticleDetail] = useState(null);
    const articleid = Number(articleidSelected); 
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [count, setCount] = useState(0);

    const navigate = useNavigate();
    
    
    const [value, setValue] = useState(
        [{
            type: 'paragraph',
            children: [{ text: '' }],
        }]
    );

    const [reRender, setReRender] = useState(0);
   
    useEffect(() => {
        // 从列表进来 -> view
        fetchArticleDetail({articleid}).then(res => { 
            const data = JSON.parse(res).data;
            setArticleDetail(data);
            if(data.content) {
                let newVal = JSON.parse(data.content);
                setValue(newVal);
                countNum(newVal);   
            }
            // 从新建进来 -> edit
            if(sourcePage && sourcePage==='addArticle') {
                setStatus('edit');
                setValue([{
                    type: 'paragraph',
                    children: [{ text: '' }],
                }]); 
            }
            setTimeout(() => {  //延时渲染以便获取值
                setReRender(reRender + 1);
            }, 100) 
        }) 
    }, [articleid])
  
    function editArticle(name, content) { 
        fetchOptions('/api/editArticle', {articleid, content, name})
        .then(res => {
            let result = JSON.parse(res);
            const msg = result.data.msg; 
            if(result.code === 1) {
                let articleDetailNew = {};
                articleDetailNew.author = articleDetail.author;
                articleDetailNew.content = msg.content;
                articleDetailNew.name = msg.name;
                setArticleDetail(articleDetailNew);  
                let newVal = JSON.parse(articleDetailNew.content);
                setValue(newVal);
                setTimeout(() => {  //延时渲染以便获取值
                    setReRender(reRender + 1);
                }, 100)
            } 
        })
    }  
   
    const nameRef = useRef(null);
    function saveEdit(){
        
        let content =  localStorage.getItem('content');;
        let name = nameRef.current.input.value; 
        if(name) {
            editArticle(name, content);
            setStatus('view');
        }else {
            message.warning('请输入文章标题');
        } 
    }

    function cancelEdit() {
        setStatus('view');
    }

    function onChange(value) {
        setValue(value);
        countNum(value); 
        let content = JSON.stringify(value);  
        localStorage.setItem('content', content); 
    }

    function countNum(value) {
        let str = '';
        value.forEach(ele1 => {
            ele1.children.forEach(ele2 => {
                str += ele2.text.replace(/\s+/g, '');
            }) 
        });
        setCount(str.length);
    }

    function deleteArticle() {
        fetchOptions('/api/deleteArticle', {articleid})
        .then(res => {
            let result = JSON.parse(res);
            if(result.code) {
                setIsModalOpen(false);
                navigate('../');
            }
        })
    }

    function handleCancel() {
        setIsModalOpen(false);
    } 

    function toEditMode(){
        setStatus('edit');

    }

    return(<div className="page-content">
        <div className='content-article-box'>
            {/*具体内容 */}
            <div className='content-article-detail' >
                {
                    (status === 'view' && reRender > 0) &&
                    <div className='content-article-view'>
                        <div className='content-article-view-name'>
                            <div className='content-article-view-title' key={reRender}>{articleDetail?.name}</div>
                            <div className='content-article-view-author'>{articleDetail?.author} {articleDetail?.time}</div>
                        </div>
                        {/* <div className='content-article-view-detail'>{articleDetail?.content}</div> */}
                        <div className='content-article-view-detail'>
                            <CustomEditorView value={value} key={reRender}/>
                        </div>
                        <div className='content-article-op-container'>
                            {username === articleDetail?.author && <img className='img-edit-article' onClick={toEditMode} src={require('../../img/editArticle.png')}/>}
                            <Link to="..\">
                                <img className='img-return-article' src={require('../../img/returnArticles.png')} />
                            </Link>
                            
                        </div>
                        
                    </div>
                }
                {
                    (status === 'edit' && reRender > 0) &&
                    <div className='content-article-edit'>
                        <div className='content-article-view-name'>
                            <Input defaultValue={articleDetail?.name} ref={nameRef} style={{height:'48px'}}/>
                        </div>
                        <div className='content-article-edit-block'>
                            <CustomEditor value={value} onChange={onChange}/>
                            {/* <TextArea
                            className='content-article-edit-textarea'
                            showCount
                            maxLength={10000}
                            style={{
                                height: '100%',
                                resize: 'none',
                            }}
                            placeholder="写点啥..."
                            defaultValue={articleDetail?.content}
                            ref={contentRef}
                            /> */}
                        </div>  
                        <div className='content-article-op-container'>
                            {username === articleDetail?.author && <img className='img-done-article' onClick={saveEdit} src={require('../../img/completeArticle.png')}/>}
                            <img className='img-return-article' onClick={cancelEdit} src={require('../../img/returnArticles.png')} />
                            <img className='img-deleteArticle' src={require('../../img/delete.png')} onClick={() => {setIsModalOpen(true)}}/>
                            <img className='img-tooltip' src={require('../../img/tooltip.png')} title="ctrl+b 加粗&#10;ctrl+i 倾斜&#10;ctrl+` 格式化代码"/>
                            <span className='article-count-num'>字数统计：{count}</span>
                        </div>
                    </div>
                }
            </div>
        
        </div>
        <Modal title="删除文章" visible={isModalOpen} onOk={deleteArticle} onCancel={handleCancel} okText="确定" cancelText="取消">
            <p>确定要删除文章?</p> 
        </Modal>
    </div>)
}

export default observer(ArticleDetail);
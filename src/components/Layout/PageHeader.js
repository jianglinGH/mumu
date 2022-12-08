import { Dropdown, Input, Menu, Space, Modal, Select, Button, Form, message} from 'antd';
import { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { userStore as user } from '../../common/UserStore';
import cookie from 'react-cookies';
import {getCategories, addArticle} from '../../common/interface' 
import { useNavigate } from 'react-router-dom';
import {apiPath, apiOptions, fetchOptions} from '../../common/api'; 
import md5 from '../../common/md5'; 
import {searchCondStore as searchCond} from '../../common/SearchCondStore';
import {debounceFn} from '../../common/methods'

function PageHeader(props) {

    const { Search } = Input;
 
    const hasLogged = user.hasLogged;
  
    const [open, setOpen] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [options, setOptions] = useState([]);
    const [title, setTitle] = useState(''); 
    const [loginType, setLoginType] = useState(''); 

    const [formRef] = Form.useForm();
    const [loginFormRef] = Form.useForm();
    const nameEle = useRef();
    const pwdEle = useRef();

    const navigate = useNavigate();
  
    function onSearch(value) { 
        searchCond.changeName(value);
    }

    function logout() {
        cookie.save('name', '');
        cookie.save('isAdmin', '');
        window.location.href = '/';;
    }

    const menu = (
        <Menu items={[{
            key: '1', label: (
                <a onClick={logout}>退出</a>
            )
        }]}>
        </Menu>
    )

    function hideModal() {
        setOpen(false);
    }

    function onFinish(value){ 
        debounceFn(addArticle({name: value.name, categoryid: value.categoryid, author: user.name}).then(res => {
            let result = JSON.parse(res);
            if(result.code) {
                setOpen(false);
                navigate(`/articleDetail?articleid=${result.data.articleid}&source=addArticle`);
            }else {
                message.error(result.msg);  
            }
        
        }))
    }

    function toLoginOrSign(type) {
        setOpenModal(true);
        setLoginType(type); 
        if(type === 'sign') {
            setTitle('注册');
        }
        if(type === 'login') {
            setTitle('登录');
        }
    }

    function onLoginFinish() {
        // history 不会刷新页面，只更新历史记录
        // history.push('/'); 
        let name = nameEle.current.input.value;
        let pw = md5(pwdEle.current.input.value);  
 
        if(loginType === 'login') {
            fetchOptions('/api/login', {name, pw})
            .then(res => {
                let results = JSON.parse(res); 
                if(results.code) {
                    let res_ = results.data[0]; 
                    message.success('登录成功'); 
                    // 添加全局的用户信息
                    cookie.save('name', res_.name);
                    cookie.save('isAdmin', res_.isAdmin); 
                    setOpenModal(false);
                    window.location.href = '/';;
                }else {
                    message.error(results.msg);  
                } 
            })
            .catch(res => {

            })
        }
        if(loginType === 'sign') {
            debounceFn(
            fetchOptions('/api/signin', {name, pw}) 
            .then(res => {
                let results = JSON.parse(res); 
                if(results.code) {
                    message.success('注册成功'); 
                    // 添加全局的用户信息
                    cookie.save('name', name);
                    cookie.save('isAdmin', 0);  
                    setOpenModal(false);
                    window.location.href = '/';;
                }else {
                    message.error(results.msg);  
                } 
            })
            .catch(res => {

            })
            )
        }
    }

    function onCancel() {
        setOpenModal(false);
    } 

    useEffect(() => {
        getCategories().then(res => {
            let result = JSON.parse(res);
            if(result.code === 1) {
                let newRes = result.data.map(ele => {
                    return {
                        value: ele.categoryid,
                        label: ele.name
                    }
                }).filter(ele => ele.value > 1 && String(ele.value)[0] === '1');
                setOptions(newRes);
                setTimeout(() => {
                    formRef.setFieldsValue({
                        categoryid: newRes.length ? newRes[0].value: '',
                        name: ''
                    })
                }, 300)
           
            }
        })
    }, [open])

    useEffect(() => {
        if(!openModal) {
            loginFormRef.resetFields();
        }
    }, [openModal])

    return (<>
        {!hasLogged &&
            <>
                {/* <Link className='header-span cursor-pointer' to='/signin'>注册</Link> */}
                <span className='header-span cursor-pointer' onClick={() => {toLoginOrSign('sign')}}>注册</span>
                <span className='header-span'>|</span>
                {/* <Link className='header-span cursor-pointer' to='/login'>登录</Link> */}
                <span className='header-span cursor-pointer' onClick={() => {toLoginOrSign('login')}}>登录</span>
            </>
        }
        {user.name &&    
            <img className='img-write-article' src={require('../../img/write.png')} onClick={() => setOpen(true)}/> 
        }
        {hasLogged &&
            <Dropdown overlay={menu}>
                <a onClick={e => e.preventDefault()}>
                    <Space>
                        {user.name}
                    </Space>
                </a>
            </Dropdown>

            // <span className='header-span'>{user.name}</span>
        }
        <Search className='page-header-search' placeholder='article' onSearch={onSearch} style={{ width: 200 }} />
        <span className='header-logo'>mumu blog</span>
        <Modal
            title="添加文章"
            visible={open} 
            className='model-addarticle'
            footer={null}
            width={480}
            forceRender={true}
            closable={false}
        >
            <Form
                name="addarticle"
                labelCol={{span: 6}}
                wrapperCol={{span: 18}}
                onFinish={onFinish}
                autoComplete="off"
                form={formRef}
            >   
                <Form.Item
                    label="文章名"
                    name="name"
                    rules={[{required: true, message: '请输入文章名'}]}
                >   
                    <Input 
                        style={{ width: 300 }}
                        maxLength={20}
                    />

                </Form.Item>
                <Form.Item
                    label="文章分类"
                    name="categoryid"
                    rules={[{required: true, message: '请选择文章分类'}]}
                >   
                    <Select
                        style={{ width: 300 }}
                        placeholder="Search to Select"  
                        options={options}
                    ></Select>
                </Form.Item> 
                <Form.Item className='model-addarticle'>
                    <Button type='primary' htmlType='submit'>
                        确定
                    </Button>
                    <Button onClick={hideModal}>
                        取消
                    </Button>
                </Form.Item> 
             
            </Form>
        </Modal>
        <Modal
            title={title}
            visible={openModal} 
            className='model-addarticle'
            footer={null}
            width={480}
            forceRender={true}
            closable={false}
        >
            <Form name='login'
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 16 }}
                onFinish={onLoginFinish}
                autoComplete="off"
                form={loginFormRef}>
                <Form.Item
                    label='用户名'
                    name='username'
                    rules={[{ required: true, message: '请输入用户名' }]}>
                    <Input ref={nameEle}/>
                </Form.Item>

                <Form.Item
                    label='密码'
                    name='password'
                    rules={[{ required: true, message: '请输入密码' }]}>
                    <Input.Password ref={pwdEle}/>
                </Form.Item>   
                <Form.Item wrapperCol={{ span: 22}} >
                    <Button type='primary' className='login-btn-ok' htmlType='submit'>确认</Button>
                    <Button className='login-btn-cancel' onClick={() => {onCancel()}}>取消</Button>
                </Form.Item>
            </Form>
        </Modal>
    </>)
}

export default PageHeader;
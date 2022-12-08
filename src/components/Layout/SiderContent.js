import {
    DownOutlined,
    FrownFilled,
    FrownOutlined,
    MehOutlined,
    SmileOutlined,
} from '@ant-design/icons';
import { Tree } from 'antd';
import React, { useEffect, useState } from 'react';
// import { apiPath } from '../../common/api';
import {getCategories} from '../../common/interface';
import {searchCondStore as sc} from '../../common/SearchCondStore' 
import { useNavigate } from 'react-router-dom';
import cookie from 'react-cookies';
import {getSpecialType} from '../../common/config';

function SiderContent(props) {
 
    const [treeData, setTreeData] = useState([]); 
    const [defaultSelectedKeys, setDefaultSelectedKeys] = useState([]);
    const navigate = useNavigate(); 
    useEffect(() => {
        // fetch(apiPath('/api/categories'))
        // .then(res => res.text())
        // .then(res => {
        //     let result = JSON.parse(res);
        //     if(result.code) {
        //         const tree = convertToTree(result.data); 
        //         setTreeData(tree);
        //     } 
        // })

        getCategories().then(res => {
            let result = JSON.parse(res);
            if(result.code) {
                const tree = convertToTree(result.data); 
                setTreeData(tree);
            } 
        })

    }, [sc.categoryid])      // 不依赖任何变量，只有初次 mount 的时候执行

    function convertToTree(data) {
        let tree = [];
        data.forEach(ele => {
            if(ele.parentid === 0) {
                tree.push({
                    title: ele.name,
                    key: ele.categoryid,
                    icon: <img src={require('../../img/' + ele.icon + '')} className="sider-icon sider-icon-parent"/>,
                    children: []
                });
            }
        });
        data.forEach(ele => {
            if(ele.parentid) {
                tree.forEach(ele2 => {
                    if(ele2.key === ele.parentid) {
                        ele2.children.push({
                            title: ele.name,
                            key: ele.categoryid,
                            icon: <img src={require('../../img/' + ele.icon + '')} className="sider-icon sider-icon-child"/>
                        }) 
                    }
                })
            }
        })
        return tree;
    }

    function selectFn(keys, e) {
        let key = keys[0]; 
        if(key) {
            cookie.save('categoryid', key);
            sc.changeId(key);  
            setDefaultSelectedKeys([key]);
        }else {
            // 从其他地方跳转
            const categoryid = Number(cookie.load('categoryid'));
            sc.changeId(categoryid);    
            setDefaultSelectedKeys([categoryid]);
        } 
        const type = getSpecialType(Number(cookie.load('categoryid')));
        if(type) {
            navigate('/' + type);
        }else {
            navigate('/');
        } 
    
    }
    
    return (
        <Tree
            showIcon
            defaultExpandAll
            defaultSelectedKeys={defaultSelectedKeys}
            selectedKeys={defaultSelectedKeys}
            switcherIcon={<DownOutlined />}
            treeData={treeData}
            className="sider-tree"
            onSelect = {selectFn} 
        />
    );

}

export default SiderContent;
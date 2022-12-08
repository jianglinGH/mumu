import { Layout } from 'antd';
import RouterEle from '../Router/RouterEle';
import PageHeader from '../Layout/PageHeader';
import { useContext } from 'react';
import { ThemeContext, SearchCondContext } from '../../common/Context';
import { BrowserRouter } from 'react-router-dom';
import SiderContent from '../Layout/SiderContent'; 
import {searchCondStore} from '../../common/SearchCondStore'; 
   
const MainPage = () => { 
    const Header = Layout.Header;
    const Sider = Layout.Sider;
    const Content = Layout.Content;
    const Footer = Layout.Footer;
    const value = useContext(ThemeContext);
    
    return (
        // 使用 Provider 将当前的 theme 传递给后代组件，值为 dark 
        <BrowserRouter>
            <div className='main-page' >
                <SearchCondContext.Provider value={searchCondStore.categoryid}>
                    <Layout className='main-page-layout'>
                        <Header theme={value} className='main-page-header'><PageHeader /></Header>
                        <Layout>
                            <Sider className='main-page-sider' style={{ background: value === 'light' ? '#76bea7' : '#233630' }}><SiderContent/></Sider>
                            <Content>
                                <RouterEle/> 
                            </Content>
                        </Layout>
                        <Footer theme={value}>联系我：<span>183****2107</span></Footer>
                    </Layout>
                </SearchCondContext.Provider>
            </div>
           
        </BrowserRouter>
    )
}

export default MainPage;



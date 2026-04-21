import { AppstoreOutlined, TagsOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import CategoriesPage from './pages/categories/CategoriesPage';
import ProductsPage from './pages/products/ProductsPage';

const { Header, Content, Sider } = Layout;

export default function App() {
  const { formatMessage } = useIntl();
  const [page, setPage] = useState('products');

  const menuItems = [
    { key: 'products', icon: <AppstoreOutlined />, label: formatMessage({ id: 'nav.products' }) },
    { key: 'categories', icon: <TagsOutlined />, label: formatMessage({ id: 'nav.categories' }) },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark">
        <div style={{ color: '#fff', padding: '16px', fontWeight: 'bold', fontSize: 16 }}>
          {formatMessage({ id: 'app.title' })}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[page]}
          items={menuItems}
          onSelect={({ key }) => setPage(key)}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px' }} />
        <Content style={{ margin: 24, padding: 24, background: '#fff', borderRadius: 8 }}>
          {page === 'products' ? <ProductsPage /> : <CategoriesPage />}
        </Content>
      </Layout>
    </Layout>
  );
}
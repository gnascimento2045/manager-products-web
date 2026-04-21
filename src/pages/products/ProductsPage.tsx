import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Switch, Table, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { type Category, categoriesService } from '../../services/categories.service';
import { type CreateProductDto, type Product, productsService } from '../../services/products.service';

export default function ProductsPage() {
  const { formatMessage } = useIntl();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form] = Form.useForm();
  const [categoryForm] = Form.useForm();

  const load = async (p = page) => {
    setLoading(true);
    const res = await productsService.findAll(p, 10);
    setProducts(res.data.data);
    setTotal(res.data.total);
    setLoading(false);
  };

  const loadCategories = async () => {
    const res = await categoriesService.findAll();
    setCategories(res.data);
  };

  useEffect(() => { load(); loadCategories(); }, []); // eslint-disable-line react-hooks/set-state-in-effect, react-hooks/exhaustive-deps

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    form.setFieldsValue({ ...product, categoryId: product.category.id, price: product.price });
    setModalOpen(true);
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    const priceValue = values.price;
    const price = typeof priceValue === 'string' 
      ? parseFloat(priceValue.replace('R$ ', '').replace(',', '.')) 
      : Number(priceValue);
    if (!price || isNaN(price)) {
      message.error(formatMessage({ id: 'products.form.price.required' }));
      return;
    }
    const processed = { ...values, price } as CreateProductDto;
    if (editing) {
      await productsService.update(editing.id, processed);
    } else {
      await productsService.create(processed);
    }
    setModalOpen(false);
    form.resetFields();
    load();
  };

  const handleDelete = async (id: string) => {
    await productsService.remove(id);
    load();
  };

  const handleCreateCategory = async (values: { name: string; description?: string }) => {
    const res = await categoriesService.create(values);
    setCategoryModalOpen(false);
    categoryForm.resetFields();
    await loadCategories();
    form.setFieldValue('categoryId', res.data.id);
  };

  const renderEmpty = () => (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div>{formatMessage({ id: 'products.empty' })}</div>
      <Button type="link" onClick={openCreate}>
        {formatMessage({ id: 'products.new' })}
      </Button>
    </div>
  );

  const columns = [
    { title: formatMessage({ id: 'products.table.name' }), dataIndex: 'name', key: 'name' },
    { title: formatMessage({ id: 'products.table.category' }), key: 'category', render: (_: unknown, r: Product) => r.category?.name },
    { title: formatMessage({ id: 'products.table.price' }), key: 'price', render: (_: unknown, r: Product) => `R$ ${Number(r.price).toFixed(2)}` },
    {
      title: formatMessage({ id: 'products.table.active' }),
      key: 'isActive',
      render: (_: unknown, r: Product) => (
        <Tag color={r.isActive ? 'green' : 'red'}>
          {formatMessage({ id: r.isActive ? 'products.active.yes' : 'products.active.no' })}
        </Tag>
      ),
    },
    {
      title: formatMessage({ id: 'products.table.actions' }),
      key: 'actions',
      render: (_: unknown, record: Product) => (
        <>
          <Button icon={<EditOutlined />} size="small" style={{ marginRight: 8 }} onClick={() => openEdit(record)} />
          <Popconfirm
            title={formatMessage({ id: 'products.delete.confirm' })}
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} size="small" />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>{formatMessage({ id: 'products.title' })}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          {formatMessage({ id: 'products.new' })}
        </Button>
      </div>

      <Table
        rowKey="id"
        dataSource={products}
        columns={columns}
        loading={loading}
        pagination={{ total, pageSize: 10, current: page, onChange: (p) => { setPage(p); load(p); } }}
        locale={{ emptyText: renderEmpty() }}
      />

      <Modal
        title={formatMessage({ id: editing ? 'products.edit' : 'products.new' })}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
        width={500}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label={formatMessage({ id: 'products.form.name' })} rules={[{ required: true, message: formatMessage({ id: 'products.form.name.required' }) }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label={formatMessage({ id: 'products.form.description' })}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="price" label={formatMessage({ id: 'products.form.price' })} rules={[{ required: true, message: formatMessage({ id: 'products.form.price.required' }) }]}>
            <InputNumber
              min={0}
              precision={2}
              style={{ width: '100%' }}
              formatter={(value) => `R$ ${value}`}
              // @ts-expect-error parser typing
              parser={(value) => value?.replace('R$ ', '').replace(',', '.')}
            />
          </Form.Item>
          <Form.Item name="categoryId" label={formatMessage({ id: 'products.form.category' })} rules={[{ required: true, message: formatMessage({ id: 'products.form.category.required' }) }]}>
            <Select
              optionLabelProp="label"
              options={categories.map((c) => ({ label: c.name, value: c.id }))}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  <div
                    style={{ padding: '8px 12px', cursor: 'pointer', color: '#1677ff' }}
                    onClick={() => {
                      setCategoryModalOpen(true);
                    }}
                  >
                    <PlusOutlined style={{ marginRight: 8 }} />
                    {formatMessage({ id: 'categories.new' })}
                  </div>
                </>
              )}
            />
          </Form.Item>
          <Form.Item name="isActive" label={formatMessage({ id: 'products.form.active' })} valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={formatMessage({ id: 'categories.new' })}
        open={categoryModalOpen}
        onCancel={() => setCategoryModalOpen(false)}
        onOk={() => categoryForm.submit()}
      >
        <Form form={categoryForm} layout="vertical" onFinish={handleCreateCategory}>
          <Form.Item name="name" label={formatMessage({ id: 'categories.form.name' })} rules={[{ required: true, message: formatMessage({ id: 'categories.form.name.required' }) }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label={formatMessage({ id: 'categories.form.description' })}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
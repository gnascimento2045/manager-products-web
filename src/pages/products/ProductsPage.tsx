import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, InputNumber, Modal, Popconfirm, Select, Switch, Table, Tag, message } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { type Category, categoriesService } from '../../services/categories.service';
import { type CreateProductDto, type Product, type UpdateProductDto, productsService } from '../../services/products.service';

export default function ProductsPage() {
  const { formatMessage } = useIntl();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form] = Form.useForm();

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
    form.setFieldsValue({ ...product, categoryId: product.category.id });
    setModalOpen(true);
  };

  const handleSubmit = async (values: CreateProductDto & UpdateProductDto) => {
    if (editing) {
      await productsService.update(editing.id, values);
      message.success(formatMessage({ id: 'products.updated' }));
    } else {
      await productsService.create(values);
      message.success(formatMessage({ id: 'products.created' }));
    }
    setModalOpen(false);
    form.resetFields();
    load();
  };

  const handleDelete = async (id: string) => {
    await productsService.remove(id);
    message.success(formatMessage({ id: 'products.deleted' }));
    load();
  };

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
      />

      <Modal
        title={formatMessage({ id: editing ? 'products.edit' : 'products.new' })}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="name" label={formatMessage({ id: 'products.form.name' })} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label={formatMessage({ id: 'products.form.description' })}>
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="price" label={formatMessage({ id: 'products.form.price' })} rules={[{ required: true }]}>
            <InputNumber min={0} precision={2} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="categoryId" label={formatMessage({ id: 'products.form.category' })} rules={[{ required: true }]}>
            <Select options={categories.map((c) => ({ label: c.name, value: c.id }))} />
          </Form.Item>
          <Form.Item name="isActive" label={formatMessage({ id: 'products.form.active' })} valuePropName="checked" initialValue={true}>
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
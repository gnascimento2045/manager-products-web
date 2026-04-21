import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Popconfirm, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { type Category, categoriesService } from '../../services/categories.service';

export default function CategoriesPage() {
  const { formatMessage } = useIntl();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    const res = await categoriesService.findAll();
    setCategories(res.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/set-state-in-effect

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEdit = (category: Category) => {
    setEditing(category);
    form.setFieldsValue(category);
    setModalOpen(true);
  };

  const handleSubmit = async (values: { name: string; description?: string }) => {
    if (editing) {
      await categoriesService.update(editing.id, values);
      message.success(formatMessage({ id: 'categories.updated' }));
    } else {
      await categoriesService.create(values);
      message.success(formatMessage({ id: 'categories.created' }));
    }
    setModalOpen(false);
    form.resetFields();
    load();
  };

  const handleDelete = async (id: string) => {
    await categoriesService.remove(id);
    message.success(formatMessage({ id: 'categories.deleted' }));
    load();
  };

  const renderEmpty = () => (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div>{formatMessage({ id: 'categories.empty' })}</div>
      <Button type="link" onClick={openCreate}>
        {formatMessage({ id: 'categories.new' })}
      </Button>
    </div>
  );

  const columns = [
    { title: formatMessage({ id: 'categories.table.name' }), dataIndex: 'name', key: 'name' },
    { title: formatMessage({ id: 'categories.table.description' }), dataIndex: 'description', key: 'description' },
    {
      title: formatMessage({ id: 'categories.table.actions' }),
      key: 'actions',
      render: (_: unknown, record: Category) => (
        <>
          <Button icon={<EditOutlined />} size="small" style={{ marginRight: 8 }} onClick={() => openEdit(record)} />
          <Popconfirm
            title={formatMessage({ id: 'categories.delete.confirm' })}
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
        <h2 style={{ margin: 0 }}>{formatMessage({ id: 'categories.title' })}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
          {formatMessage({ id: 'categories.new' })}
        </Button>
      </div>

      <Table
        rowKey="id"
        dataSource={categories}
        columns={columns}
        loading={loading}
        locale={{ emptyText: renderEmpty() }}
      />

      <Modal
        title={formatMessage({ id: editing ? 'categories.edit' : 'categories.new' })}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
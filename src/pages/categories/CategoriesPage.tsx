import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Popconfirm, Table, message } from 'antd';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { type Category, categoriesService } from '../../services/categories.service';

export default function CategoriesPage() {
  const { formatMessage } = useIntl();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    setLoading(true);
    const res = await categoriesService.findAll();
    setCategories(res.data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/set-state-in-effect

  const handleCreate = async (values: { name: string; description?: string }) => {
    await categoriesService.create(values);
    message.success(formatMessage({ id: 'categories.created' }));
    setModalOpen(false);
    form.resetFields();
    load();
  };

  const handleDelete = async (id: string) => {
    await categoriesService.remove(id);
    message.success(formatMessage({ id: 'categories.deleted' }));
    load();
  };

  const columns = [
    { title: formatMessage({ id: 'categories.table.name' }), dataIndex: 'name', key: 'name' },
    { title: formatMessage({ id: 'categories.table.description' }), dataIndex: 'description', key: 'description' },
    {
      title: formatMessage({ id: 'categories.table.actions' }),
      key: 'actions',
      render: (_: unknown, record: Category) => (
        <Popconfirm
          title={formatMessage({ id: 'categories.delete.confirm' })}
          onConfirm={() => handleDelete(record.id)}
        >
          <Button danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>{formatMessage({ id: 'categories.title' })}</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          {formatMessage({ id: 'categories.new' })}
        </Button>
      </div>

      <Table rowKey="id" dataSource={categories} columns={columns} loading={loading} />

      <Modal
        title={formatMessage({ id: 'categories.new' })}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleCreate}>
          <Form.Item name="name" label={formatMessage({ id: 'categories.form.name' })} rules={[{ required: true }]}>
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
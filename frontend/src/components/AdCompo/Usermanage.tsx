import React, { useState } from 'react';
import { 
  Table, 
  Input, 
  Button, 
  Select, 
  Modal, 
  Form, 
  Card, 
  Space, 
  Tag,
  Typography,
  Divider,
  Popconfirm,
  message,
  Row,
  Col,
  Badge,
  Tooltip,
  Switch,
  Avatar
} from 'antd';
import { 
  SearchOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  UserAddOutlined,
  LockOutlined,
  MailOutlined,
  TeamOutlined,
  IdcardOutlined,
  SafetyOutlined,
  EyeOutlined,
  EyeInvisibleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { Option } = Select;

type UserRole = 'DEO' | 'Supervisor' | 'AD';
type Committee = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type UserStatus = 'Active' | 'Inactive' | 'Pending';

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  committee: Committee;
  status: UserStatus;
  createdAt?: Date;
  lastLogin?: Date;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'AD',
      committee: '1',
      status: 'Active',
      createdAt: new Date('2023-01-15'),
      lastLogin: new Date('2023-06-20')
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'Supervisor',
      committee: '2',
      status: 'Active',
      createdAt: new Date('2023-02-10'),
      lastLogin: new Date('2023-06-18')
    },
    {
      id: 3,
      name: 'Mike Johnson',
      email: 'mike@example.com',
      role: 'DEO',
      committee: '3',
      status: 'Pending',
      createdAt: new Date('2023-03-05'),
      lastLogin: new Date('2023-06-15')
    }
  ]);

  const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const editFormRef = React.useRef<FormInstance>(null);

  const roles: UserRole[] = ['DEO', 'Supervisor', 'AD'];
  const committees: Committee[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const statuses: UserStatus[] = ['Active', 'Inactive', 'Pending'];

  const getRoleColor = (role: UserRole) => {
    switch(role) {
      case 'AD': return 'red';
      case 'Supervisor': return 'blue';
      case 'DEO': return 'green';
      default: return 'geekblue';
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: 'User',
      dataIndex: 'name',
      key: 'user',
      width: 250,
      render: (text, record) => (
        <Space>
          <Avatar size="large" style={{ backgroundColor: '#1890ff' }}>
            {text.charAt(0).toUpperCase()}
          </Avatar>
          <div>
            <Text strong>{text}</Text><br />
            <Text type="secondary">{record.email}</Text>
          </div>
        </Space>
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 150,
      render: (role) => (
        <Tag color={getRoleColor(role)} style={{ borderRadius: 12, padding: '0 12px' }}>
          {role}
        </Tag>
      ),
      filters: roles.map(role => ({ text: role, value: role })),
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Committee',
      dataIndex: 'committee',
      key: 'committee',
      width: 150,
      render: (committee) => (
        <Tag color="geekblue" style={{ borderRadius: 12 }}>
          Committee {committee}
        </Tag>
      ),
      filters: committees.map(committee => ({ text: `Committee ${committee}`, value: committee })),
      onFilter: (value, record) => record.committee === value,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 150,
      render: (status) => (
        <Badge 
          status={status === 'Active' ? 'success' : status === 'Inactive' ? 'error' : 'warning'} 
          text={status} 
        />
      ),
      filters: statuses.map(status => ({ text: status, value: status })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Last Login',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      width: 200,
      render: (date) => date ? new Date(date).toLocaleString() : 'Never',
      sorter: (a, b) => (a.lastLogin?.getTime() || 0) - (b.lastLogin?.getTime() || 0),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button 
              type="text" 
              icon={<EditOutlined style={{ color: '#1890ff' }} />} 
              onClick={() => showEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure to delete this user?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
              placement="left"
            >
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const showEditModal = (user: User) => {
    setCurrentUser(user);
    setIsEditModalVisible(true);
  };

  const handleCancel = () => {
    setIsEditModalVisible(false);
  };

  const handleAddUser = (values: Omit<User, 'id' | 'status'> & { password: string }) => {
    const newUser: User = {
      id: users.length + 1,
      ...values,
      status: 'Active',
      createdAt: new Date(),
    };
    setUsers([...users, newUser]);
    message.success('User added successfully');
  };

  const handleUpdateUser = (values: Partial<User> & { newPassword?: string }) => {
    if (!currentUser) return;
    
    const updatedUsers = users.map(user => 
      user.id === currentUser.id ? { ...user, ...values } : user
    );
    setUsers(updatedUsers);
    setIsEditModalVisible(false);
    message.success('User updated successfully');
  };

  const handleDelete = (userId: number) => {
    setUsers(users.filter(user => user.id !== userId));
    message.success('User deleted successfully');
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <Title level={2} style={{ marginBottom: 24, color: '#1d1d1d' }}>
        <TeamOutlined style={{ marginRight: 12 }} />
        User Management
      </Title>

      {/* Create User Section */}
      <Card 
        title={
          <Space>
            <UserAddOutlined style={{ color: '#1890ff' }} />
            <span style={{ fontWeight: 500 }}>Create New User</span>
          </Space>
        }
        bordered={false}
        style={{ marginBottom: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}
      >
        <Form
          layout="vertical"
          onFinish={handleAddUser}
          initialValues={{ role: 'DEO', committee: '1' }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Full Name"
                name="name"
                rules={[{ required: true, message: 'Please input the full name!' }]}
              >
                <Input 
                  placeholder="Enter full name" 
                  prefix={<IdcardOutlined style={{ color: '#bfbfbf' }} />}
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email Address"
                name="email"
                rules={[
                  { required: true, message: 'Please input the email address!' },
                  { type: 'email', message: 'Please enter a valid email!' }
                ]}
              >
                <Input 
                  placeholder="user@example.com" 
                  prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Select Role"
                name="role"
                rules={[{ required: true, message: 'Please select a role!' }]}
              >
                <Select placeholder="Select a role" size="large">
                  {roles.map(role => (
                    <Option key={role} value={role}>
                      <Tag color={getRoleColor(role)}>{role}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Select Committee"
                name="committee"
                rules={[{ required: true, message: 'Please select a committee!' }]}
              >
                <Select placeholder="Select committee number" size="large">
                  {committees.map(committee => (
                    <Option key={committee} value={committee}>
                      <Tag color="geekblue">Committee {committee}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left" plain style={{ color: '#8c8c8c' }}>Security Settings</Divider>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Password"
                name="password"
                rules={[
                  { required: true, message: 'Please input the password!' },
                  { min: 8, message: 'Password must be at least 8 characters!' }
                ]}
              >
                <Input.Password 
                  placeholder="Minimum 8 characters" 
                  prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                  size="large"
                  iconRender={(visible) => (
                    <Tooltip title={visible ? 'Hide password' : 'Show password'}>
                      {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    </Tooltip>
                  )}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Confirm Password"
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Please confirm the password!' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('The two passwords do not match!'));
                    },
                  }),
                ]}
              >
                <Input.Password 
                  placeholder="Confirm your password" 
                  prefix={<SafetyOutlined style={{ color: '#bfbfbf' }} />}
                  size="large"
                  iconRender={(visible) => (
                    <Tooltip title={visible ? 'Hide password' : 'Show password'}>
                      {visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                    </Tooltip>
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 24 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              size="large"
              style={{ width: '100%', height: 48, borderRadius: 8 }}
            >
              Create User
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {/* User List Section */}
      <Card 
        title={
          <Space>
            <TeamOutlined style={{ color: '#1890ff' }} />
            <span style={{ fontWeight: 500 }}>User List</span>
            <Tag color="blue" style={{ borderRadius: 12 }}>{users.length} users</Tag>
          </Space>
        }
        bordered={false}
        style={{ borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}
        extra={
          <Input
            placeholder="Search users by name or email..."
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            style={{ width: 300 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            size="large"
          />
        }
      >
        <Table 
          columns={columns} 
          dataSource={filteredUsers} 
          rowKey="id"
          scroll={{ x: true }}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            pageSizeOptions: ['10', '20', '50', '100'],
            showTotal: (total) => `Total ${total} users`,
            style: { marginRight: 16 }
          }}
          style={{ marginTop: 16 }}
        />
      </Card>

      {/* Edit User Modal */}
   <Modal
  title={
    <Space>
      <EditOutlined style={{ color: '#1890ff' }} />
      <span>Edit User: {currentUser?.name}</span>
    </Space>
  }
  open={isEditModalVisible}
  onCancel={handleCancel}
  width={800}
  footer={null}
  destroyOnClose
  styles={{
    header: { borderBottom: '1px solid #f0f0f0', paddingBottom: 16 },
    body: { paddingTop: 24 }
  }}
>
  {currentUser && (
    <Form 
      ref={editFormRef}
      initialValues={currentUser}
      onFinish={handleUpdateUser} 
      layout="vertical"
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: 'Please input the full name!' }]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Email Address"
            name="email"
            rules={[
              { required: true, message: 'Please input the email address!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Role"
            name="role"
            rules={[{ required: true, message: 'Please select a role!' }]}
          >
            <Select size="large">
              {roles.map(role => (
                <Option key={role} value={role}>
                  <Tag color={getRoleColor(role)}>{role}</Tag>
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: 'Please select a status!' }]}
          >
            <Select size="large">
              {statuses.map(status => (
                <Option key={status} value={status}>
                  <Badge 
                    status={status === 'Active' ? 'success' : status === 'Inactive' ? 'error' : 'warning'} 
                    text={status} 
                  />
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item
        label="Committee"
        name="committee"
        rules={[{ required: true, message: 'Please select a committee!' }]}
      >
        <Select size="large">
          {committees.map(committee => (
            <Option key={committee} value={committee}>
              <Tag color="geekblue">Committee {committee}</Tag>
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Divider orientation="left" plain style={{ color: '#8c8c8c' }}>Security</Divider>

      {/* Current Password (Visible) */}
      <Form.Item
        label="Current Password"
      >
        <Input
          value="user1234" // This would be the actual password in a real implementation
          readOnly
          size="large"
          suffix={
            <Tooltip title="Current password is visible for admin purposes">
              <SafetyOutlined style={{ color: '#52c41a' }} />
            </Tooltip>
          }
          style={{ background: '#f6ffed' }}
        />
      </Form.Item>

      {/* Reset Password */}
      <Form.Item
        label="Set New Password"
        name="newPassword"
        rules={[
          { min: 8, message: 'Password must be at least 8 characters!' }
        ]}
        extra={
          <Space style={{ marginTop: 8 }}>
            <Switch
              checkedChildren={<EyeOutlined />}
              unCheckedChildren={<EyeInvisibleOutlined />}
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            <Text type="secondary">Show new password</Text>
          </Space>
        }
      >
        <Input.Password 
          placeholder="Enter new password (leave blank to keep current)" 
          size="large"
          visibilityToggle={{ visible: showPassword }}
        />
      </Form.Item>

      <Form.Item style={{ marginTop: 32 }}>
        <Button 
          type="primary" 
          htmlType="submit" 
          size="large"
          style={{ width: '100%', height: 48, borderRadius: 8 }}
        >
          Update User
        </Button>
      </Form.Item>
    </Form>
  )}
</Modal>
    </div>
  );
};

export default UserManagement;
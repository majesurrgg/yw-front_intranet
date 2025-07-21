import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Spin,
  Typography,
  Avatar,
  Row,
  Col,
  Modal
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  LockOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { userService } from '../services/UserService';

const { Title, Text } = Typography;

interface ProfileData {
  name: string;
  email: string;
  phoneNumber?: string;
}

const ProfilePage: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [resettingPassword, setResettingPassword] = useState<boolean>(false);
  const [resetStatus, setResetStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showResetModal, setShowResetModal] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await userService.getProfile();
        setProfile(data);
        form.setFieldsValue({
          name: data.name,
          email: data.email,
          phoneNumber: data.phoneNumber || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        message.error('Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [form]);

  const handleSave = async (values: ProfileData) => {
    try {
      setSaving(true);
      const updatedProfile = await userService.updateProfile({
        name: values.name,
        phoneNumber: values.phoneNumber
      });

      setProfile(updatedProfile);
      setIsEditing(false);
      message.success('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error updating profile:', error);
      message.error('Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setResettingPassword(true);
      await userService.sendResetPasswordEmail();
      setResetStatus('success');
      message.success({
        content: (
          <div className="flex items-center">
            <CheckCircleOutlined className="text-green-500 text-lg mr-2" />
            <span>Se ha enviado un correo con las instrucciones para restablecer tu contraseña</span>
          </div>
        ),
        duration: 10,
        className: 'custom-success-message',
        style: { marginTop: '8vh' }
      });
    } catch (error) {
      console.error('Error sending reset password email:', error);
      setResetStatus('error');
      message.error({
        content: (
          <div className="flex items-center">
            <CloseCircleOutlined className="text-red-500 text-lg mr-2" />
            <span>Error al enviar el correo de restablecimiento</span>
          </div>
        ),
        duration: 5,
        className: 'custom-error-message'
      });
    } finally {
      setResettingPassword(false);
      setShowResetModal(false);
      setTimeout(() => setResetStatus('idle'), 5000);
    }
  };

  const showResetConfirm = () => {
    setShowResetModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary"
        >
          Volver
        </Button>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="shadow-md border-0">
          <div className="text-center mb-8">
            <Avatar
              size={100}
              icon={<UserOutlined />}
              className="bg-primary/10 text-primary text-4xl mb-4"
            />
            <Title level={3} className="mb-1">
              {profile?.name || 'Usuario'}
            </Title>
            <Text type="secondary" className="text-lg">
              {profile?.email}
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            className="max-w-2xl mx-auto"
          >
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="name"
                  label="Nombre completo"
                  rules={[
                    { required: true, message: 'Por favor ingrese su nombre' },
                    { min: 3, message: 'El nombre debe tener al menos 3 caracteres' }
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="text-gray-400" />}
                    placeholder="Su nombre completo"
                    disabled={!isEditing || saving}
                    className="rounded-lg"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="email"
                  label="Correo electrónico"
                >
                  <Input
                    prefix={<MailOutlined className="text-gray-400" />}
                    placeholder="Su correo electrónico"
                    disabled={true}
                    className="rounded-lg bg-gray-50"
                  />
                </Form.Item>
              </Col>

              <Col xs={24} md={12}>
                <Form.Item
                  name="phoneNumber"
                  label="Teléfono"
                  rules={[
                    {
                      pattern: /^[0-9]{9}$/,
                      message: 'Ingrese un número de teléfono válido (9 dígitos)'
                    }
                  ]}
                >
                  <Input
                    prefix={<PhoneOutlined className="text-gray-400" />}
                    placeholder="Su número de teléfono"
                    disabled={!isEditing || saving}
                    className="rounded-lg"
                  />
                </Form.Item>
              </Col>
            </Row>

            <div className="mt-8 space-y-4">
              <div className="flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <Button
                      onClick={() => {
                        form.resetFields();
                        setIsEditing(false);
                      }}
                      disabled={saving}
                      className="w-32"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="primary"
                      htmlType="submit"
                      icon={<SaveOutlined />}
                      loading={saving}
                      className="w-32 bg-primary hover:bg-primary/90"
                    >
                      Guardar
                    </Button>
                  </>
                ) : (
                  <Button
                    type="primary"
                    onClick={() => setIsEditing(true)}
                    className="w-32 bg-primary hover:bg-primary/90"
                  >
                    Editar perfil
                  </Button>
                )}
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                  resetStatus === 'success'
                    ? 'bg-green-50 border border-green-100'
                    : resetStatus === 'error'
                      ? 'bg-red-50 border border-red-100'
                      : 'bg-indigo-50 border border-indigo-100'
                }`}>
                  <div className="flex items-start">
                    <div className={`p-2 rounded-full ${
                      resetStatus === 'success'
                        ? 'bg-green-100 text-green-600'
                        : resetStatus === 'error'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-indigo-100 text-indigo-600'
                    }`}>
                      {resetStatus === 'success' ? (
                        <CheckCircleOutlined className="text-lg" />
                      ) : resetStatus === 'error' ? (
                        <CloseCircleOutlined className="text-lg" />
                      ) : (
                        <LockOutlined className="text-lg" />
                      )}
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-800">
                        {resetStatus === 'success'
                          ? '¡Correo enviado con éxito!'
                          : resetStatus === 'error'
                            ? 'Error al enviar el correo'
                            : 'Seguridad de la cuenta'}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {resetStatus === 'success'
                          ? 'Revisa tu bandeja de entrada y sigue las instrucciones.'
                          : resetStatus === 'error'
                            ? 'Intenta nuevamente o contacta a soporte.'
                            : '¿Deseas cambiar tu contraseña?'}
                      </p>
                    </div>
                  </div>
                  <Button
                    type="primary"
                    icon={<LockOutlined />}
                    loading={resettingPassword}
                    onClick={showResetConfirm}
                    className="bg-indigo-600 hover:bg-indigo-700 border-0 flex items-center"
                  >
                    {resetStatus === 'success' ? '¡Correo enviado!' : 'Restablecer contraseña'}
                  </Button>
                </div>
              </div>
            </div>
          </Form>
        </Card>
      </div>

      <Modal
        open={showResetModal}
        title="¿Seguro que deseas restablecer tu contraseña?"
        onOk={handleResetPassword}
        onCancel={() => setShowResetModal(false)}
        confirmLoading={resettingPassword}
        okText="Enviar correo"
        cancelText="Cancelar"
        centered
        className="custom-confirm-modal"
      >
        <p>Se enviará un correo electrónico a la dirección asociada a tu cuenta.</p>
        <p className="mt-2 text-sm text-gray-600">
          Revisa tu bandeja de entrada y sigue las instrucciones para crear una nueva contraseña.
        </p>
      </Modal>
    </div>
  );
};

export default ProfilePage;

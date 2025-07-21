import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Form, Input, Button, Card, message, Select, Spin, 
  Row, Col, Checkbox, DatePicker, Collapse 
} from 'antd';
import { 
  SaveOutlined, ArrowLeftOutlined, UserOutlined, PhoneOutlined 
} from '@ant-design/icons';
import dayjs from 'dayjs';
import beneficiaryService from '../../services/beneficiary/beneficiary.service';
import type { 
  CreateBeneficiaryDto, 
  BeneficiaryEnums 
} from '../../interfaces/beneficiary.interface';

const { Option } = Select;
const { Panel } = Collapse;

interface BeneficiaryFormProps {
  isEdit?: boolean;
}

export const  BeneficiaryForm: React.FC<BeneficiaryFormProps> = ({ isEdit = false }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [enums, setEnums] = useState<BeneficiaryEnums>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [enumsData, beneficiaryData] = await Promise.all([
          beneficiaryService.getEnums(),
          isEdit && id ? beneficiaryService.getById(parseInt(id)) : null
        ]);
        
        setEnums(enumsData);
        if (beneficiaryData) form.setFieldsValue(beneficiaryData);
      } catch (error) {
        console.error('Error loading data:', error);
        message.error('Error al cargar los datos');
        if (isEdit) navigate('/beneficiaries');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [form, id, isEdit, navigate]);

  const handleSubmit = async (values: CreateBeneficiaryDto) => {
    try {
      setSaving(true);
      const formattedValues = {
        ...values,
        birthDate: values.birthDate ? dayjs(values.birthDate).format('YYYY-MM-DD') : undefined,
      };
      
      if (isEdit && id) {
        await beneficiaryService.update(parseInt(id), formattedValues);
        message.success('Beneficiario actualizado exitosamente');
      } else {
        await beneficiaryService.create(formattedValues);
        message.success('Beneficiario creado exitosamente');
      }
      
      navigate('/beneficiaries');
    } catch (error) {
      console.error('Error saving beneficiary:', error);
      message.error(`Error al ${isEdit ? 'actualizar' : 'crear'} el beneficiario`);
    } finally {
      setSaving(false);
    }
  };

  const renderBasicInfo = () => (
    <Panel header="1. Información Básica" key="1">
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item label="Código" name="code" rules={[{ required: true, message: 'Por favor ingrese el código' }]}>
            <Input prefix={<UserOutlined />} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="Nombres" name="name" rules={[{ required: true, message: 'Por favor ingrese los nombres' }]}>
            <Input />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item label="Apellidos" name="lastName" rules={[{ required: true, message: 'Por favor ingrese los apellidos' }]}>
            <Input />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <Form.Item 
            label="DNI" 
            name="dni" 
            rules={[
              { required: true, message: 'Por favor ingrese el DNI' },
              { pattern: /^[0-9]{8}$/, message: 'El DNI debe tener 8 dígitos' }
            ]}
          >
            <Input maxLength={8} />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item 
            label="Fecha de Nacimiento" 
            name="birthDate" 
            rules={[{ required: true, message: 'Por favor seleccione la fecha de nacimiento' }]}
          >
            <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
          </Form.Item>
        </Col>
        <Col xs={24} md={8}>
          <Form.Item 
            label="Género" 
            name="gender" 
            rules={[{ required: true, message: 'Por favor seleccione el género' }]}
          >
            <Select placeholder="Seleccione género">
              {enums?.gender?.map(g => (
                <Option key={g} value={g}>{g}</Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
    </Panel>
  );

  const renderContactInfo = () => (
    <Panel header="2. Información de Contacto" key="2">
      <Row gutter={16}>
        <Col xs={24} md={12}>
          <Form.Item 
            label="Teléfono Principal" 
            name="phoneNumberMain" 
            rules={[{ required: true, message: 'Por favor ingrese el teléfono principal' }]}
          >
            <Input prefix={<PhoneOutlined />} maxLength={9} />
          </Form.Item>
        </Col>
        <Col xs={24} md={12}>
          <Form.Item name="isWhatsApp" valuePropName="checked">
            <Checkbox>Tiene WhatsApp</Checkbox>
          </Form.Item>
        </Col>
      </Row>
    </Panel>
  );

  const renderConsents = () => (
    <Panel header="3. Consentimientos" key="3">
      <Form.Item
        name="allpaAdvisoryConsent"
        valuePropName="checked"
        rules={[{
          validator: (_, value) => 
            value ? Promise.resolve() : Promise.reject('Debe aceptar los términos')
        }]}
      >
        <Checkbox>Acepto el consentimiento informado para asesorías de ALLPA</Checkbox>
      </Form.Item>
    </Panel>
  );

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Spin size="large" /></div>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/beneficiaries')}
          className="flex items-center"
        >
          Volver al listado
        </Button>
      </div>
      
      <Card 
        title={isEdit ? 'Editar Beneficiario' : 'Nuevo Beneficiario'}
        className="shadow-md"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            isWhatsApp: false,
            allpaAdvisoryConsent: false,
          }}
        >
          <Collapse defaultActiveKey={['1', '2', '3']} className="mb-6">
            {renderBasicInfo()}
            {renderContactInfo()}
            {renderConsents()}
          </Collapse>

          <div className="flex justify-end space-x-4 mt-6">
            <Button 
              onClick={() => navigate('/beneficiaries')}
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
              className="w-32"
            >
              {isEdit ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
};
export default BeneficiaryForm;
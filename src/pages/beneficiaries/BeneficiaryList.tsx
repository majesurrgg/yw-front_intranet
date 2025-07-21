import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Button,
  Table,
  Space,
  Input,
  Select,
  Card,
  Upload,
  message,
  Tag,
  Tooltip,
  Avatar,
  Badge,
  Row,
  Col,
  Modal
} from 'antd';
import { 
  UploadOutlined, 
  PlusOutlined, 
  SearchOutlined, 
  FilterOutlined, 
  FileExcelOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import beneficiaryService from '../../services/beneficiary/beneficiary.service';
import type { Beneficiary } from '../../interfaces/beneficiary.interface';

// Styled Components
const StyledCard = styled(Card)`
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.05);
  margin-bottom: 1.5rem;
  
  .ant-card-head {
    border-bottom: 1px solid #f0f0f0;
  }
  
  .ant-card-head-title {
    font-weight: 600;
    color: #2d3748;
  }
`;

const GradientTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(90deg, #FF0000 0%, #033ED8 31%, #347FF6 68%, #FDB82D 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  margin-bottom: 1.5rem;
`;

const StatusBadge = styled.span<{ status: 'active' | 'inactive' }>`
  display: inline-flex;
  align-items: center;
  
  &::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.status === 'active' ? '#52c41a' : '#ff4d4f'};
    margin-right: 8px;
  }
`;

const { Search } = Input;
const { Option } = Select;

interface TableParams {
  pagination?: {
    current: number;
    pageSize: number;
    total?: number;
  };
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, any>;
}

const BeneficiaryList: React.FC = () => {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [previewBeneficiary, setPreviewBeneficiary] = useState<Beneficiary | null>(null);
  const [previewVisible, setPreviewVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  const fetchBeneficiaries = async (params: TableParams = {}) => {
    try {
      setLoading(true);
      const { current = 1, pageSize = 10 } = params.pagination || {};
      const response = await beneficiaryService.getAll(
        current,
        pageSize,
        searchTerm,
        statusFilter !== 'all' ? statusFilter : undefined
      );
      
      setBeneficiaries(response.data);
      setTableParams({
        ...params,
        pagination: {
          ...params.pagination,
          total: response.total,
          current: response.page,
          pageSize: response.limit,
        },
      });
    } catch (error) {
      console.error('Error fetching beneficiaries:', error);
      message.error('Error al cargar los beneficiarios');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeneficiaries(tableParams);
  }, [searchTerm, statusFilter, tableParams.pagination?.current, tableParams.pagination?.pageSize]);

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setTableParams({
      pagination,
      filters,
      ...sorter,
    });
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setTableParams({
      ...tableParams,
      pagination: {
        ...(tableParams.pagination || {}),
        current: 1,
        pageSize: tableParams.pagination?.pageSize || 10,
      },
    });
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setTableParams({
      ...tableParams,
      pagination: {
        ...(tableParams.pagination || {}),
        current: 1,
        pageSize: tableParams.pagination?.pageSize || 10,
      },
    });
  };

  const handleUpload = async (file: File) => {
    const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
                   file.type === 'application/vnd.ms-excel';
    
    if (!isExcel) {
      message.error('Solo se permiten archivos Excel (.xlsx, .xls)');
      return Upload.LIST_IGNORE;
    }

    const isLt2M = file.size / 1024 / 1024 < 5;
    if (!isLt2M) {
      message.error('El archivo debe ser menor a 5MB');
      return Upload.LIST_IGNORE;
    }

    try {
      await beneficiaryService.importFromExcel(file);
      message.success('Archivo subido exitosamente');
      fetchBeneficiaries(tableParams);
    } catch (error) {
      console.error('Error uploading file:', error);
      message.error('Error al subir el archivo');
    }
    return false;
  };

  const showPreview = (beneficiary: Beneficiary) => {
    setPreviewBeneficiary(beneficiary);
    setPreviewVisible(true);
  };

  const handlePreviewCancel = () => {
    setPreviewVisible(false);
  };

  const columns: ColumnsType<Beneficiary> = [
    {
      title: 'Información del Beneficiario',
      key: 'info',
      render: (_, record) => (
        <div className="flex items-center">
          <Avatar 
            size="large" 
            icon={<UserOutlined />} 
            style={{ 
              backgroundColor: record.gender === 'Femenino' ? '#ffd6e7' : '#e6f7ff',
              color: record.gender === 'Femenino' ? '#eb2f96' : '#1890ff',
              marginRight: 12
            }}
          />
          <div>
            <div className="font-medium text-gray-900">
              {record.name} {record.lastName}
              {record.deletedAt ? (
                <Tag color="red" style={{ marginLeft: 8, fontSize: 11 }}>Inactivo</Tag>
              ) : (
                <StatusBadge status="active" style={{ marginLeft: 8 }}>Activo</StatusBadge>
              )}
            </div>
            <div className="text-sm text-gray-500">
              <span>DNI: {record.dni}</span>
              {record.code && <span className="ml-2">• Código: {record.code}</span>}
            </div>
            <div className="text-sm text-gray-500">
              {record.institution && <span>{record.institution}</span>}
              {record.modalityStudent && <span className="ml-2">• {record.modalityStudent}</span>}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Contacto',
      key: 'contact',
      render: (_, record) => (
        <div className="space-y-1">
          {record.phoneNumberMain && (
            <div className="flex items-center text-sm">
              <PhoneOutlined className="mr-1 text-blue-500" />
              <span>{record.phoneNumberMain}</span>
              {record.isWhatsApp && <Tag color="green" className="ml-1 text-xs">WhatsApp</Tag>}
            </div>
          )}
          {record.fullNameContactEmergency && (
            <div className="text-xs text-gray-500">
              <InfoCircleOutlined className="mr-1" />
              Contacto: {record.fullNameContactEmergency}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Estado',
      key: 'status',
      width: 150,
      render: (_, record) => (
        <div className="space-y-2">
          <div>
            <span className="font-medium">Matrícula: </span>
            <Tag color={record.enrollmentStatus === 'Inscrito' ? 'green' : 'red'} className="ml-1">
              {record.enrollmentStatus || 'No especificado'}
            </Tag>
          </div>
        </div>
      ),
    },
    {
      title: 'Acciones',
      key: 'actions',
      width: 180,
      render: (_, record) => (
        <Space size="small">
          <Button 
            type="primary" 
            size="small" 
            onClick={() => navigate(`/beneficiaries/${record.id}`)}
          >
            Ver
          </Button>
          <Button 
            type="default" 
            size="small" 
            onClick={() => navigate(`/beneficiaries/edit/${record.id}`)}
          >
            Editar
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <GradientTitle>Gestión de Beneficiarios</GradientTitle>
          <div className="flex space-x-2">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/beneficiaries/new')}
              className="bg-blue-600 hover:bg-blue-700 border-blue-600"
            >
              Nuevo Beneficiario
            </Button>
          </div>
        </div>

        <StyledCard>
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div className="flex-1 max-w-2xl">
              <Input
                placeholder="Buscar por nombre, DNI o código..."
                prefix={<SearchOutlined className="text-gray-400" />}
                allowClear
                onChange={(e) => handleSearch(e.target.value)}
                value={searchTerm}
                className="w-full"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select
                value={statusFilter}
                onChange={handleStatusFilter}
                className="w-40"
                suffixIcon={<FilterOutlined />}
                placeholder="Filtrar por estado"
              >
                <Option value="all">Todos los estados</Option>
                <Option value="active">Solo activos</Option>
                <Option value="inactive">Solo inactivos</Option>
              </Select>
              
              <Upload
                accept=".xlsx,.xls"
                beforeUpload={handleUpload}
                showUploadList={false}
              >
                <Button 
                  icon={<FileExcelOutlined />}
                  className="flex items-center"
                >
                  Importar
                </Button>
              </Upload>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table
              columns={columns}
              dataSource={beneficiaries}
              rowKey="id"
              loading={loading}
              pagination={{
                ...tableParams.pagination,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} beneficiarios`,
                pageSizeOptions: ['10', '20', '50', '100'],
              }}
              onChange={handleTableChange}
              rowClassName="hover:bg-gray-50 cursor-pointer"
              onRow={(record) => ({
                onClick: () => navigate(`/beneficiaries/${record.id}`),
                style: { cursor: 'pointer' },
              })}
              rowSelection={rowSelection}
            />
          </div>
        </StyledCard>
      </div>

      {/* Preview Modal */}
      <Modal
        title="Vista Previa del Beneficiario"
        open={previewVisible}
        onCancel={handlePreviewCancel}
        footer={[
          <Button key="close" onClick={handlePreviewCancel}>
            Cerrar
          </Button>,
          <Button 
            key="view" 
            type="primary" 
            onClick={() => {
              if (previewBeneficiary) {
                navigate(`/beneficiaries/${previewBeneficiary.id}`);
              }
            }}
          >
            Ver detalles completos
          </Button>,
        ]}
        width={700}
      >
        {previewBeneficiary && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4 pb-4 border-b">
              <Avatar 
                size={64} 
                icon={<UserOutlined />} 
                style={{ 
                  backgroundColor: previewBeneficiary.gender === 'Femenino' ? '#ffd6e7' : '#e6f7ff',
                  color: previewBeneficiary.gender === 'Femenino' ? '#eb2f96' : '#1890ff',
                }}
              />
              <div>
                <h3 className="text-xl font-semibold">
                  {previewBeneficiary.name} {previewBeneficiary.lastName}
                </h3>
                <div className="text-gray-600">
                  <span>DNI: {previewBeneficiary.dni}</span>
                  {previewBeneficiary.code && <span className="ml-4">Código: {previewBeneficiary.code}</span>}
                </div>
              </div>
            </div>
            
            <Row gutter={16}>
              <Col span={12}>
                <div className="mb-2">
                  <div className="font-medium">Institución:</div>
                  <div>{previewBeneficiary.institution || 'No especificada'}</div>
                </div>
                <div className="mb-2">
                  <div className="font-medium">Grado:</div>
                  <div>{previewBeneficiary.degree || 'No especificado'}</div>
                </div>
                <div className="mb-2">
                  <div className="font-medium">Estado de Matrícula:</div>
                  <Tag color={previewBeneficiary.enrollmentStatus === 'Inscrito' ? 'green' : 'red'}>
                    {previewBeneficiary.enrollmentStatus || 'No especificado'}
                  </Tag>
                </div>
              </Col>
              <Col span={12}>
                <div className="mb-2">
                  <div className="font-medium">Teléfono:</div>
                  <div className="flex items-center">
                    {previewBeneficiary.phoneNumberMain || 'No especificado'}
                    {previewBeneficiary.isWhatsApp && (
                      <Tag color="green" className="ml-2">WhatsApp</Tag>
                    )}
                  </div>
                </div>
                <div className="mb-2">
                  <div className="font-medium">Contacto de emergencia:</div>
                  <div>{previewBeneficiary.fullNameContactEmergency || 'No especificado'}</div>
                  {previewBeneficiary.phoneNumberContactEmergency && (
                    <div className="text-sm text-gray-600">
                      Teléfono: {previewBeneficiary.phoneNumberContactEmergency}
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            
            <div className="pt-2 mt-2 border-t">
              <div className="font-medium mb-1">Notas adicionales:</div>
              <div className="text-gray-700 bg-gray-50 p-2 rounded">
                {previewBeneficiary.additionalNotes || 'No hay notas adicionales'}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BeneficiaryList;

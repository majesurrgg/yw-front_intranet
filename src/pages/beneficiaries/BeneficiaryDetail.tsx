import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Button, Descriptions, Spin, message, Space, Tabs, Tag, Tooltip } from 'antd';
import { EditOutlined, ArrowLeftOutlined, InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import beneficiaryService from '../../services/beneficiary/beneficiary.service';
import type { Beneficiary, AreaAdviser, CommunicationPreference } from '../../interfaces/beneficiary.interface';

const { TabPane } = Tabs;

const GradientTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(90deg, #FF0000 0%, #033ED8 31%, #347FF6 68%, #FDB82D 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  margin-bottom: 2rem;
  background-color: #fff;
`;

const Container = styled.div`
  min-height: 100vh;
  background: #f5f7fa;
  padding: 2.5rem 1rem;
`;

const StyledCard = styled(Card)`
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
  margin-bottom: 1.5rem;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  }
  
  .ant-descriptions-item-label {
    font-weight: 600;
    color: #4a5568;
    width: 200px;
  }
  
  .ant-descriptions-item-content {
    font-weight: 500;
    color: #2d3748;
  }
`;

const SectionTitle = styled.h2`
  color: #2d3748;
  font-size: 1.5rem;
  margin: 1.5rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e2e8f0;
`;

const BeneficiaryDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [beneficiary, setBeneficiary] = useState<Beneficiary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBeneficiary = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const data = await beneficiaryService.getById(parseInt(id));
        setBeneficiary(data);
      } catch (error) {
        console.error('Error fetching beneficiary:', error);
        message.error('Error al cargar los datos del beneficiario');
        navigate('/beneficiaries');
      } finally {
        setLoading(false);
      }
    };

    fetchBeneficiary();
  }, [id, navigate]);

  if (loading || !beneficiary) {
    return <Spin size="large" style={{ display: 'flex', justifyContent: 'center', marginTop: '20%' }} />;
  }

  const renderBoolean = (value?: boolean) =>
    value ? <Tag color="green">Sí</Tag> : <Tag color="volcano">No</Tag>;

  const items = [
    {
      key: '1',
      label: 'Información General',
      children: (
        <div className="space-y-6">
          <StyledCard title="Información Personal">
            <Descriptions bordered column={{ xs: 1, md: 2 }}>
              <Descriptions.Item label="ID">{beneficiary.id}</Descriptions.Item>
              <Descriptions.Item label="Código">{beneficiary.code || '-'}</Descriptions.Item>
              <Descriptions.Item label="Nombres">{beneficiary.name || '-'}</Descriptions.Item>
              <Descriptions.Item label="Apellidos">{beneficiary.lastName || '-'}</Descriptions.Item>
              <Descriptions.Item label="DNI">{beneficiary.dni || '-'}</Descriptions.Item>
              <Descriptions.Item label="Fecha de Nacimiento">
                {beneficiary.birthDate ? new Date(beneficiary.birthDate).toLocaleDateString() : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Género">
                <Tag color={beneficiary.gender === 'male' ? 'blue' : 'pink'} className="font-medium">
                  {beneficiary.gender === 'male' ? 'Masculino' : 'Femenino'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Parentesco">{beneficiary.parentesco || '-'}</Descriptions.Item>
            </Descriptions>
          </StyledCard>

          <StyledCard title="Información Académica">
            <Descriptions bordered column={{ xs: 1, md: 2 }}>
              <Descriptions.Item label="Institución">{beneficiary.institution || '-'}</Descriptions.Item>
              <Descriptions.Item label="Grado">{beneficiary.degree || '-'}</Descriptions.Item>
              <Descriptions.Item label="Modalidad">{beneficiary.modalityStudent || '-'}</Descriptions.Item>
              <Descriptions.Item label="Nivel de aprendizaje">{beneficiary.learningLevel || '-'}</Descriptions.Item>
              <Descriptions.Item label="Horas de asesoría">{beneficiary.hoursAsesoria ?? '-'}</Descriptions.Item>
              <Descriptions.Item label="Motivo prioridad" span={2}>
                {beneficiary.coursePriorityReason || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Estado de Matrícula">
                <Tag 
                  color={beneficiary.enrollmentStatus === 'Inscrito' ? 'green' : 'red'}
                  className="font-medium px-3 py-1 text-sm"
                >
                  {beneficiary.enrollmentStatus || 'No especificado'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </StyledCard>

          <StyledCard title="Información de Contacto">
            <Descriptions bordered column={{ xs: 1, md: 2 }}>
              <Descriptions.Item label="Teléfono Principal">
                <div className="flex items-center gap-2">
                  {beneficiary.phoneNumberMain || '-'}
                  {beneficiary.isWhatsApp && (
                    <Tag color="green" icon={<span>✓</span>} className="ml-2">WhatsApp</Tag>
                  )}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Observaciones Teléfono">
                {beneficiary.cellphoneObservation || 'Ninguna'}
              </Descriptions.Item>
              <Descriptions.Item label="Problema de Señal">
                {beneficiary.callSignalIssue || 'Ninguno reportado'}
              </Descriptions.Item>
            </Descriptions>
          </StyledCard>

          <StyledCard title="Contactos de Emergencia">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Contacto Principal</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Nombre:</span> {beneficiary.fullNameContactEmergency || 'No especificado'}</p>
                  <p><span className="font-medium">Teléfono:</span> {beneficiary.phoneNumberContactEmergency || 'No especificado'}</p>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold mb-2">Contacto Secundario</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">Nombre:</span> {beneficiary.fullNameContactEmergency2 || 'No especificado'}</p>
                  <p><span className="font-medium">Teléfono:</span> {beneficiary.phoneNumberContactEmergency2 || 'No especificado'}</p>
                </div>
              </div>
            </div>
          </StyledCard>

          <StyledCard title="Consentimientos">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="font-medium mb-1">Asesoría Allpa</div>
                {renderBoolean(beneficiary.allpaAdvisoryConsent)}
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="font-medium mb-1">Uso de Imagen Allpa</div>
                {renderBoolean(beneficiary.allpaImageConsent)}
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="font-medium mb-1">Asesoría Ruru</div>
                {renderBoolean(beneficiary.ruruAdvisoryConsent)}
              </div>
            </div>
            {beneficiary.additionalNotes && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-1">Notas Adicionales:</h4>
                <p className="text-gray-700">{beneficiary.additionalNotes}</p>
              </div>
            )}
          </StyledCard>

          <StyledCard title="Preferencias de Talleres y Cursos">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">Talleres Preferidos</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">1. </span> {beneficiary.firstWorkshopChoice || 'No especificado'}</p>
                  <p><span className="font-medium">2. </span> {beneficiary.secondWorkshopChoice || 'No especificado'}</p>
                  <p><span className="font-medium">3. </span> {beneficiary.thirdWorkshopChoice || 'No especificado'}</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-gray-700">Cursos Preferidos</h4>
                <div className="space-y-2">
                  <p><span className="font-medium">1. </span> {beneficiary.firstCourseChoice || 'No especificado'}</p>
                  <p><span className="font-medium">2. </span> {beneficiary.secondCourseChoice || 'No especificado'}</p>
                </div>
              </div>
            </div>
          </StyledCard>

          <StyledCard title="Registro del Sistema">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Fecha de Registro</p>
                <p className="font-medium">
                  {new Date(beneficiary.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Última Actualización</p>
                <p className="font-medium">
                  {new Date(beneficiary.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </StyledCard>
        </div>
      ),
    },
    {
      key: '2',
      label: 'Idiomas y Cursos',
      children: (
        <div className="space-y-6">
          <StyledCard>
            <SectionTitle>Idiomas</SectionTitle>
            <div className="p-4 bg-gray-50 rounded-lg">
              {beneficiary.beneficiaryLanguage && beneficiary.beneficiaryLanguage.length > 0 ? (
                <div className="space-y-3">
                  {beneficiary.beneficiaryLanguage.map((lang, index) => (
                    <div 
                      key={`lang-${lang.id || index}`} 
                      className="flex items-start p-3 bg-white rounded-lg shadow-sm hover:shadow transition-shadow"
                    >
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-3">
                        <span className="text-blue-600 font-medium">{index + 1}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{lang.language}</h4>
                        {lang.customLanguageName && (
                          <p className="text-sm text-gray-600 mt-1">
                            <span className="font-medium">Variante:</span> {lang.customLanguageName}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 italic">No hay idiomas registrados</p>
                </div>
              )}
            </div>
          </StyledCard>

          <StyledCard>
            <SectionTitle>Cursos Preferidos</SectionTitle>
            <div className="p-4 bg-gray-50 rounded-lg">
              {beneficiary.beneficiaryPreferredCourses && beneficiary.beneficiaryPreferredCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {beneficiary.beneficiaryPreferredCourses.map((course, index) => (
                    <div 
                      key={`course-${course.id || index}`}
                      className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <h4 className="font-semibold text-gray-800 flex items-center">
                        <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm mr-2">
                          {index + 1}
                        </span>
                        {course.name}
                      </h4>
                      {course.customCourseName && (
                        <div className="mt-2 text-sm bg-blue-50 text-blue-700 px-3 py-1.5 rounded-md inline-block">
                          Especialidad: {course.customCourseName}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 italic">No hay cursos preferidos registrados</p>
                </div>
              )}
            </div>
          </StyledCard>
        </div>
      ),
    },
    {
      key: '3',
      label: 'Horarios',
      children: (
        <StyledCard>
          <SectionTitle>Horarios de Atención</SectionTitle>
          {Array.isArray(beneficiary?.schedules) && beneficiary.schedules.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Día</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horario Mañana</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horario Tarde</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Horario Noche</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {beneficiary.schedules.map((s) => (
                    <tr key={`schedule-${s.id || s.dayOfWeek}`} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                        {s.dayOfWeek}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {s.period_time ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {s.period_time}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {s.period_time2 ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {s.period_time2}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {s.period_time3 ? (
                          <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                            {s.period_time3}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 italic">No hay horarios registrados para este beneficiario</p>
            </div>
          )}
        </StyledCard>
      ),
    },
    {
      key: '4',
      label: 'Preferencias y Asesores',
      children: (
        <div className="space-y-6">
          <StyledCard>
            <SectionTitle>Preferencias de Comunicación</SectionTitle>
            <div className="p-4 bg-gray-50 rounded-lg">
              {Array.isArray(beneficiary.communicationPreferences) && beneficiary.communicationPreferences.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {beneficiary.communicationPreferences.map((pref) => (
                    <span 
                      key={`comm-${pref.id}`} 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
                      {pref.name}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 italic">No hay preferencias de comunicación registradas</p>
                </div>
              )}
            </div>
          </StyledCard>

          <StyledCard>
            <SectionTitle>Asesores de Área</SectionTitle>
            <div className="p-4 bg-gray-50 rounded-lg">
              {Array.isArray(beneficiary.areaAdvisers) && beneficiary.areaAdvisers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {beneficiary.areaAdvisers.map((adviser) => (
                    <div 
                      key={`adviser-${adviser.id}`}
                      className="bg-white p-4 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-gray-800 flex items-center">
                            {adviser.name}
                            <span className={`ml-2 w-2 h-2 rounded-full ${adviser.isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          </h4>
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              adviser.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {adviser.isActive ? 'Activo' : 'Inactivo'}
                            </span>
                          </div>
                        </div>
                        {adviser.description && (
                          <Tooltip 
                            title={
                              <div className="max-w-xs">
                                <p className="font-medium mb-1">Descripción:</p>
                                <p className="text-sm">{adviser.description}</p>
                              </div>
                            }
                            placement="topRight"
                          >
                            <Button type="text" icon={<InfoCircleOutlined />} />
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500 italic">No hay asesores asignados a este beneficiario</p>
                </div>
              )}
            </div>
          </StyledCard>
        </div>
      ),
    },
  ];

  return (
    <Container>
      <div className="max-w-6xl mx-auto">
        <Space style={{ marginBottom: 16 }}>
          <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate('/beneficiaries')}>
            Volver
          </Button>
          <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/beneficiaries/edit/${id}`)}>
            Editar
          </Button>
        </Space>

        <GradientTitle>Detalles del Beneficiario</GradientTitle>
        
        <Tabs 
          defaultActiveKey="1" 
          items={items} 
          className="bg-white rounded-lg shadow-sm p-4"
          tabBarStyle={{ padding: '0 1rem' }}
        />
      </div>
    </Container>
  );
};

export default BeneficiaryDetail;

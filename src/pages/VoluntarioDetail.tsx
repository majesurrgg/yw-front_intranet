import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { FaFilePdf, FaVideo, FaEdit, FaTrash, FaSave } from 'react-icons/fa';
import volunteerService from '../services/volunteer-postulation/volunteer.service';

const GradientTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(90deg, #FF0000 0%, #033ED8 31%, #347FF6 68%, #FDB82D 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
  margin-bottom: 2.5rem;
  background-color: #fff;
  text-align: center;
`;
const Container = styled.div`
  min-height: 100vh;
  background: #f5f7fa;
  padding: 2.5rem 1rem;
`;
const DataBox = styled.div`
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 6px 32px rgba(0,0,0,0.10);
  padding: 2.5rem 2.5rem;
  max-width: 750px;
  margin: 0 auto;
`;
const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem 2.5rem;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    gap: 1.2rem 0;
  }
`;
const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
`;
const Label = styled.label`
  font-weight: 700;
  color: #033ED8;
  font-size: 1.08rem;
  margin-bottom: 0.1rem;
  letter-spacing: 0.2px;
`;
const Value = styled.div`
  color: #222;
  font-size: 1.13rem;
  background: #f7fafc;
  border-radius: 0.7rem;
  padding: 0.7rem 1.2rem;
  box-shadow: 0 1px 4px rgba(0,0,0,0.04);
  min-height: 2.2rem;
  display: flex;
  align-items: center;
  word-break: break-word;
`;
const Badge = styled.span<{ status: string }>`
  display: inline-block;
  font-weight: 700;
  font-size: 1rem;
  padding: 0.3rem 1.1rem;
  border-radius: 1rem;
  color: #fff;
  background: ${({ status }) =>
    status === 'APPROVED' ? '#22c55e' :
    status === 'REJECTED' ? '#ef4444' :
    '#facc15'};
  box-shadow: 0 1px 4px rgba(0,0,0,0.07);
  letter-spacing: 1px;
`;
const Loading = styled.div`
  text-align: center;
  color: #888;
  font-size: 1.2rem;
  margin-top: 3rem;
`;
const ErrorMsg = styled.div`
  text-align: center;
  color: #c00;
  font-size: 1.1rem;
  margin-top: 3rem;
`;
const areaMap: Record<number, string> = {
  1: 'Talento & Desarrollo Organizacional',
  2: 'Cultura & Comunicación Interna',
  3: 'Imagen Institucional & Relaciones Públicas',
  4: 'Alianzas Organizacionales',
  5: 'Convenios & Patrocinios Estratégicos',
  6: 'Marketing & Contenidos',
  7: 'Arte & Cultura',
  8: 'Asesoría a Colegios Nacionales',
  9: 'Bienestar Psicológicos',
  10: 'Gestión de Comunidades',
  11: 'Innovación & Calidad'
};
const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'PENDIENTE', color: '#facc15' },
  APPROVED: { label: 'APROBADO', color: '#22c55e' },
  REJECTED: { label: 'RECHAZADO', color: '#ef4444' }
};
const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.35);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ModalContent = styled.div`
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 8px 40px rgba(0,0,0,0.18);
  padding: 2rem 1.5rem 1.5rem 1.5rem;
  max-width: 95vw;
  max-height: 90vh;
  min-width: 320px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: #eee;
  border: none;
  border-radius: 50%;
  width: 2.2rem;
  height: 2.2rem;
  font-size: 1.3rem;
  color: #333;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #ddd;
  }
`;
const ActionButton = styled.button`
  background: linear-gradient(90deg, #033ED8 0%, #347FF6 100%);
  color: #fff;
  font-weight: 600;
  border: none;
  border-radius: 0.7rem;
  padding: 0.5rem 1.5rem;
  font-size: 1.05rem;
  margin-right: 0.7rem;
  margin-top: 0.2rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(52,127,246,0.08);
  transition: background 0.2s, box-shadow 0.2s;
  &:hover {
    background: linear-gradient(90deg, #033ED8 0%, #FF0000 100%);
    box-shadow: 0 4px 16px rgba(52,127,246,0.13);
  }
`;
const GlobalModalStyle = createGlobalStyle`
  body {
    overflow: hidden;
  }
`;
const TypeTag = styled.span<{ type: string }>`
  display: inline-block;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 0.5rem 1.5rem;
  border-radius: 1.2rem;
  color: #fff;
  background: ${({ type }) =>
    type === 'ADVISER' ? '#8b5cf6' : '#2563eb'};
  box-shadow: 0 2px 8px rgba(139,92,246,0.10);
  margin-bottom: 2rem;
  letter-spacing: 1px;
`;
const AreaTag = styled.span`
  display: inline-block;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.3rem 1.1rem;
  border-radius: 1rem;
  color: #fff;
  background: #347FF6;
  margin-left: 0.7rem;
  box-shadow: 0 1px 4px rgba(52,127,246,0.10);
`;
const StatusTag = styled.span<{ status: string }>`
  display: inline-block;
  font-weight: 700;
  font-size: 1.1rem;
  padding: 0.5rem 1.5rem;
  border-radius: 1.2rem;
  color: #fff;
  background: ${({ status }) =>
    status === 'APPROVED' ? '#22c55e' : status === 'REJECTED' ? '#ef4444' : '#facc15'};
  box-shadow: 0 2px 8px rgba(34,197,94,0.10);
  margin-bottom: 2rem;
  margin-left: 1rem;
  letter-spacing: 1px;
`;
const SectionBox = styled.div`
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 12px rgba(0,0,0,0.07);
  padding: 2rem 2rem 1.5rem 2rem;
  margin-bottom: 2.5rem;
`;
const SectionTitle = styled.h2`
  font-size: 1.3rem;
  font-weight: 700;
  color: #033ED8;
  margin-bottom: 1.5rem;
`;
const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
const periods = [
  { key: 'period_time', label: 'Mañana', sub: '(8am - 12am)' },
  { key: 'period_time2', label: 'Tarde', sub: '(2pm - 6pm)' },
  { key: 'period_time3', label: 'Noche', sub: '(6pm - 10pm)' }
];
const dayMap: Record<string, string> = {
  MONDAY: 'Lunes',
  TUESDAY: 'Martes',
  WEDNESDAY: 'Miércoles',
  THURSDAY: 'Jueves',
  FRIDAY: 'Viernes',
  SATURDAY: 'Sabado',
  SUNDAY: 'Domingo',
};
const ScheduleTable: React.FC<{ schedules: any[] }> = ({ schedules }) => {
  const scheduleMap: Record<string, Record<string, boolean>> = {};
  schedules?.forEach(s => {
    const dayEs = dayMap[s.dayOfWeek];
    if (!dayEs) return;
    scheduleMap[dayEs] = {
      period_time: !!s.period_time,
      period_time2: !!s.period_time2,
      period_time3: !!s.period_time3
    };
  });
  return (
    <div style={{ overflowX: 'auto', width: '100%' }}>
      <table style={{ borderCollapse: 'separate', borderSpacing: 0, minWidth: 380, margin: '0 auto', background: '#fff', borderRadius: '1rem', boxShadow: '0 2px 12px rgba(0,0,0,0.07)' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '0.7rem 1.2rem', fontWeight: 700, fontSize: '1.08rem', color: '#222', background: '#f5f7fa', borderTopLeftRadius: '1rem' }}> </th>
            {periods.map((p, i) => (
              <th key={p.key} style={{ textAlign: 'center', padding: '0.7rem 1.2rem', fontWeight: 700, fontSize: '1.08rem', color: '#222', background: '#f5f7fa', borderTopRightRadius: i === periods.length-1 ? '1rem' : 0 }}>
                {p.label}<br /><span style={{ fontWeight: 400, fontSize: '0.95em', color: '#888' }}>{p.sub}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map(day => (
            <tr key={day}>
              <td style={{ padding: '0.7rem 1.2rem', fontWeight: 600, color: '#033ED8', background: '#f7fafc' }}>{day}</td>
              {periods.map(p => (
                <td key={p.key} style={{ textAlign: 'center', padding: '0.7rem 1.2rem' }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, border: '2px solid #FDB82D', background: scheduleMap[day]?.[p.key] ? '#FDB82D' : '#fff',
                    boxShadow: scheduleMap[day]?.[p.key] ? '0 2px 8px rgba(253,184,45,0.13)' : '0 1px 3px rgba(0,0,0,0.04)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', transition: 'background 0.2s',
                  }}>
                    {scheduleMap[day]?.[p.key] && (
                      <span style={{ fontSize: 18, color: '#222', fontWeight: 700 }}>✓</span>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const EditButton = styled(ActionButton)`
  background: linear-gradient(90deg, #033ED8 0%, #347FF6 100%);
  color: #fff;
  margin-right: 0.7rem;
`;
const DeleteButton = styled(ActionButton)`
  background: linear-gradient(90deg, #ef4444 0%, #FF0000 100%);
  color: #fff;
`;
const SaveButton = styled(ActionButton)`
  background: linear-gradient(90deg, #22c55e 0%, #a7f3d0 100%);
  color: #222;
  font-weight: 700;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 0.7rem;
`;
const AnimatedModalOverlay = styled(ModalOverlay)`
  animation: fadeInBg 0.3s;
  @keyframes fadeInBg {
    from { background: rgba(0,0,0,0); }
    to { background: rgba(0,0,0,0.35); }
  }
`;
const AnimatedModalConfirm = styled(ModalContent)`
  animation: scaleIn 0.35s cubic-bezier(0.23, 1, 0.32, 1);
  @keyframes scaleIn {
    0% { opacity: 0; transform: scale(0.7) translateY(40px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
`;
const Face = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e 60%, #a7f3d0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.2rem auto;
  box-shadow: 0 2px 16px rgba(0,0,0,0.10);
  position: relative;
  animation: bounceIn 0.7s;
  @keyframes bounceIn {
    0% { transform: scale(0.5); opacity: 0; }
    60% { transform: scale(1.15); opacity: 1; }
    100% { transform: scale(1); }
  }
`;
const Eyes = styled.div`
  position: absolute;
  top: 28px;
  left: 18px;
  width: 34px;
  display: flex;
  justify-content: space-between;
`;
const Eye = styled.div`
  width: 7px;
  height: 7px;
  background: #222;
  border-radius: 50%;
`;
const Smile = styled.div`
  position: absolute;
  left: 50%;
  bottom: 18px;
  width: 28px;
  height: 16px;
  border-radius: 0 0 16px 16px;
  border-bottom: 3px solid #222;
  border-top: none;
  transform: translateX(-50%);
`;

const VoluntarioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<{ type: 'cv' | 'video' | null }>({ type: null });
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState<any>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchVolunteer = async () => {
      setLoading(true);
      setError(null);
      try {
        const volunteerData = await volunteerService.getVolunteerById(id);
        setData(volunteerData);
      } catch (err) {
        console.error('Error fetching volunteer:', err);
        setError('No se pudo obtener el voluntario');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVolunteer();
  }, [id]);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const handleInput = (field: string, value: any) => {
    setForm((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!id) return;
    
    try {
      await volunteerService.updateVolunteer(id, form);
      setShowSuccess(true);
      setEditMode(false);
      // Refresh the data after update
      const updatedData = await volunteerService.getVolunteerById(id);
      setData(updatedData);
    } catch (err) {
      console.error('Error updating volunteer:', err);
      setError('Error al actualizar el voluntario');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await volunteerService.deleteVolunteer(id);
      setShowDeleteConfirm(false);
      // Use navigate instead of window.location for better SPA behavior
      navigate('/staff');
    } catch (err) {
      console.error('Error deleting volunteer:', err);
      setError('Error al eliminar el voluntario');
    }
  };

  return (
    <Container>
      <GradientTitle>Detalle del Voluntario</GradientTitle>
      {loading && <Loading>Cargando datos...</Loading>}
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {data && (
        <DataBox>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', marginBottom: '0.5rem' }}>
            <TypeTag type={data.typeVolunteer}>
              {data.typeVolunteer === 'ADVISER' ? 'ASESOR' : data.typeVolunteer === 'STAFF' ? 'STAFF' : data.typeVolunteer}
              <AreaTag>{areaMap[data.idPostulationArea] || '-'}</AreaTag>
            </TypeTag>
            <StatusTag status={data.statusVolunteer}>
              {statusMap[data.statusVolunteer]?.label || data.statusVolunteer}
            </StatusTag>
          </div>
          {!editMode ? (
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.2rem', justifyContent: 'center' }}>
              <EditButton onClick={() => setEditMode(true)}><FaEdit /> Actualizar voluntario</EditButton>
              <DeleteButton onClick={() => setShowDeleteConfirm(true)}><FaTrash /> Eliminar voluntario</DeleteButton>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.2rem', justifyContent: 'center' }}>
              <SaveButton onClick={handleSave}><FaSave /> Guardar</SaveButton>
            </div>
          )}
          <SectionBox>
            <SectionTitle>Datos personales</SectionTitle>
            <FormGrid>
              {form?.name && form?.lastName && (
                <Field>
                  <Label>Nombre</Label>
                  {!editMode ? (
                    <Value>{form?.name} {form?.lastName}</Value>
                  ) : (
                    <input value={form?.name || ''} onChange={e => handleInput('name', e.target.value)} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
                  )}
                </Field>
              )}
              {form?.email && (
                <Field>
                  <Label>Email</Label>
                  {!editMode ? (
                    <Value>{form?.email}</Value>
                  ) : (
                    <input value={form?.email || ''} onChange={e => handleInput('email', e.target.value)} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
                  )}
                </Field>
              )}
              {form?.phoneNumber && (
                <Field>
                  <Label>Teléfono</Label>
                  {!editMode ? (
                    <Value>{form?.phoneNumber}</Value>
                  ) : (
                    <input value={form?.phoneNumber || ''} onChange={e => handleInput('phoneNumber', e.target.value)} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
                  )}
                </Field>
              )}
              {form?.birthDate && (
                <Field>
                  <Label>Fecha de nacimiento</Label>
                  {!editMode ? (
                    <Value>{form?.birthDate ? new Date(form?.birthDate).toLocaleDateString() : ''}</Value>
                  ) : (
                    <input type="date" value={form?.birthDate ? form?.birthDate.substring(0,10) : ''} onChange={e => handleInput('birthDate', e.target.value)} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
                  )}
                </Field>
              )}
              {form?.birthDate && (
                <Field>
                  <Label>Edad</Label>
                  <Value>{form?.birthDate ? Math.floor((Date.now() - new Date(form?.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25)) + ' años' : '-'}</Value>
                </Field>
              )}
              {form?.typeIdentification && (
                <Field>
                  <Label>Tipo de identificación</Label>
                  {!editMode ? (
                    <Value>{form?.typeIdentification}</Value>
                  ) : (
                    <input value={form?.typeIdentification || ''} onChange={e => handleInput('typeIdentification', e.target.value)} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
                  )}
                </Field>
              )}
              {form?.numIdentification && (
                <Field>
                  <Label>Número de identificación</Label>
                  {!editMode ? (
                    <Value>{form?.numIdentification}</Value>
                  ) : (
                    <input value={form?.numIdentification || ''} onChange={e => handleInput('numIdentification', e.target.value)} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
                  )}
                </Field>
              )}
              {form?.programsUniversity && (
                <Field>
                  <Label>Universidad</Label>
                  {!editMode ? (
                    <Value>{form?.programsUniversity}</Value>
                  ) : (
                    <input value={form?.programsUniversity || ''} onChange={e => handleInput('programsUniversity', e.target.value)} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
                  )}
                </Field>
              )}
            </FormGrid>
            <div style={{ display: 'flex', gap: '1.5rem', marginTop: '2.2rem', justifyContent: 'center' }}>
              <ActionButton
                style={{ background: '#FDB82D', color: '#222', boxShadow: '0 4px 16px rgba(253,184,45,0.18)', display: 'flex', alignItems: 'center', gap: '0.7rem', fontWeight: 700 }}
                onClick={() => setModal({ type: 'cv' })}
              >
                <FaFilePdf style={{ fontSize: '1.3em' }} /> Ver CV
              </ActionButton>
              <ActionButton
                style={{ background: '#FDB82D', color: '#222', boxShadow: '0 4px 16px rgba(253,184,45,0.18)', display: 'flex', alignItems: 'center', gap: '0.7rem', fontWeight: 700 }}
                onClick={() => setModal({ type: 'video' })}
              >
                <FaVideo style={{ fontSize: '1.3em' }} /> Ver Video
              </ActionButton>
            </div>
          </SectionBox>
          <SectionBox>
            <SectionTitle>Datos de postulación</SectionTitle>
            <FormGrid>
              {form?.datePostulation && (
                <Field>
                  <Label>Fecha de postulación</Label>
                  {!editMode ? (
                    <Value>{form?.datePostulation ? new Date(form?.datePostulation).toLocaleDateString() : ''}</Value>
                  ) : (
                    <input placeholder="Fecha de postulación" type="date" value={form?.datePostulation ? form?.datePostulation.substring(0,10) : ''} onChange={e => handleInput('datePostulation', e.target.value)} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
                  )}
                </Field>
              )}
              {form?.wasVoluntary !== undefined && form?.wasVoluntary !== null && (
                <Field>
                  <Label>¿Fue voluntario antes?</Label>
                  {!editMode ? (
                    <Value>{form?.wasVoluntary ? 'Sí' : 'No'}</Value>
                  ) : (
                    <select value={form?.wasVoluntary ? 'true' : 'false'} onChange={e => handleInput('wasVoluntary', e.target.value === 'true')} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }}>
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                  )}
                </Field>
              )}
              {form?.volunteerMotivation && (
                <Field>
                  <Label>Motivación</Label>
                  {!editMode ? (
                    <Value>{form?.volunteerMotivation}</Value>
                  ) : (
                    <input placeholder="Motivación" value={form?.volunteerMotivation || ''} onChange={e => handleInput('volunteerMotivation', e.target.value)} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
                  )}
                </Field>
              )}
              {form?.howDidYouFindUs && (
                <Field>
                  <Label>¿Cómo nos encontró?</Label>
                  {!editMode ? (
                    <Value>{form?.howDidYouFindUs}</Value>
                  ) : (
                    <input placeholder="¿Cómo nos encontró?" value={form?.howDidYouFindUs || ''} onChange={e => handleInput('howDidYouFindUs', e.target.value)} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
                  )}
                </Field>
              )}
              {form?.advisoryCapacity && (
                <Field>
                  <Label>Capacidad de asesoría</Label>
                  {!editMode ? (
                    <Value>{form?.advisoryCapacity}</Value>
                  ) : (
                    <input placeholder="Capacidad de asesoría" value={form?.advisoryCapacity || ''} onChange={e => handleInput('advisoryCapacity', e.target.value)} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
                  )}
                </Field>
              )}
              {form?.schoolGrades && (
                <Field>
                  <Label>Grados de colegio</Label>
                  {!editMode ? (
                    <Value>{form?.schoolGrades}</Value>
                  ) : (
                    <input placeholder="Grados de colegio" value={form?.schoolGrades || ''} onChange={e => handleInput('schoolGrades', e.target.value)} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
                  )}
                </Field>
              )}
              {form?.callingPlan !== undefined && form?.callingPlan !== null && (
                <Field>
                  <Label>¿Plan de llamadas?</Label>
                  {!editMode ? (
                    <Value>{form?.callingPlan ? 'Sí' : 'No'}</Value>
                  ) : (
                    <select value={form?.callingPlan ? 'true' : 'false'} onChange={e => handleInput('callingPlan', e.target.value === 'true')} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }}>
                      <option value="true">Sí</option>
                      <option value="false">No</option>
                    </select>
                  )}
                </Field>
              )}
              {form?.quechuaLevel && (
                <Field>
                  <Label>Nivel de Quechua</Label>
                  {!editMode ? (
                    <Value>{form?.quechuaLevel}</Value>
                  ) : (
                    <input value={form?.quechuaLevel || ''} onChange={e => handleInput('quechuaLevel', e.target.value)} style={{ padding: '0.5rem', borderRadius: 8, border: '1px solid #ccc' }} />
                  )}
                </Field>
              )}
              {/* Disponibilidad solo si hay horarios */}
              {Array.isArray(form?.schedules) && form.schedules.length > 0 && (
                <Field style={{ gridColumn: '1 / -1' }}>
                  <Label>Disponibilidad</Label>
                  <Value style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}>
                    <ScheduleTable schedules={form?.schedules} />
                  </Value>
                </Field>
              )}
            </FormGrid>
          </SectionBox>
        </DataBox>
      )}
      {modal.type && (
        <>
          <GlobalModalStyle />
          <ModalOverlay onClick={() => setModal({ type: null })}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <CloseButton onClick={() => setModal({ type: null })}>&times;</CloseButton>
              {modal.type === 'cv' && (
                <>
                  <h2 style={{marginBottom: '1rem', fontWeight: 700, color: '#033ED8'}}>Vista previa del CV</h2>
                  <iframe
                    src={form?.cvUrl}
                    title="Vista previa CV"
                    width="500"
                    height="600"
                    style={{ border: 'none', maxWidth: '90vw', maxHeight: '70vh', borderRadius: '0.7rem', background: '#f7fafc' }}
                  />
                </>
              )}
              {modal.type === 'video' && (
                <>
                  <h2 style={{marginBottom: '1rem', fontWeight: 700, color: '#033ED8'}}>Vista previa del Video</h2>
                  <video
                    src={form?.videoUrl}
                    controls
                    width="500"
                    style={{ borderRadius: '0.7rem', background: '#000', maxWidth: '90vw', maxHeight: '70vh' }}
                  >
                    Tu navegador no soporta la reproducción de video.
                  </video>
                </>
              )}
            </ModalContent>
          </ModalOverlay>
        </>
      )}
      {showSuccess && (
        <AnimatedModalOverlay>
          <AnimatedModalConfirm>
            <Face>
              <Eyes>
                <Eye />
                <Eye />
              </Eyes>
              <Smile />
            </Face>
            <h2 style={{ fontWeight: 700, fontSize: '1.3rem', color: '#22c55e', marginBottom: '1.2rem' }}>
              ¡Voluntario actualizado correctamente!
            </h2>
            <ActionButton onClick={() => setShowSuccess(false)} style={{ marginTop: 24 }}>Ok</ActionButton>
          </AnimatedModalConfirm>
        </AnimatedModalOverlay>
      )}
      {showDeleteConfirm && (
        <AnimatedModalOverlay>
          <AnimatedModalConfirm>
            <h2 style={{ fontWeight: 700, fontSize: '1.3rem', color: '#ef4444', marginBottom: '1.2rem' }}>
              ¿Estás seguro de eliminar este voluntario?
            </h2>
            <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: 24 }}>
              <DeleteButton onClick={handleDelete}><FaTrash /> Eliminar</DeleteButton>
              <EditButton onClick={() => setShowDeleteConfirm(false)}>Cancelar</EditButton>
            </div>
          </AnimatedModalConfirm>
        </AnimatedModalOverlay>
      )}
    </Container>
  );
};

export default VoluntarioDetail; 
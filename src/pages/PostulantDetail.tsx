import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';
import { FaFilePdf, FaVideo, FaCheck, FaTimes } from 'react-icons/fa';

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

const SchedulesList = styled.ul`
  padding-left: 1.2rem;
  margin: 0;
  li {
    margin-bottom: 0.2rem;
    color: #444;
    font-size: 0.98rem;
  }
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

const ModalConfirm = styled.div`
  background: #fff;
  border-radius: 1.2rem;
  box-shadow: 0 8px 40px rgba(0,0,0,0.18);
  padding: 2.5rem 2rem 2rem 2rem;
  max-width: 95vw;
  min-width: 320px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const ModalButton = styled.button`
  background: linear-gradient(90deg, #033ED8 0%, #347FF6 100%);
  color: #fff;
  font-weight: 700;
  border: none;
  border-radius: 0.7rem;
  padding: 0.7rem 2.2rem;
  font-size: 1.1rem;
  margin-top: 2rem;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(52,127,246,0.13);
  transition: background 0.2s, box-shadow 0.2s;
  &:hover {
    background: linear-gradient(90deg, #033ED8 0%, #FF0000 100%);
    box-shadow: 0 4px 16px rgba(52,127,246,0.13);
  }
`;

const AnimatedModalOverlay = styled(ModalOverlay)`
  animation: fadeInBg 0.3s;
  @keyframes fadeInBg {
    from { background: rgba(0,0,0,0); }
    to { background: rgba(0,0,0,0.35); }
  }
`;
const AnimatedModalConfirm = styled(ModalConfirm)`
  animation: scaleIn 0.35s cubic-bezier(0.23, 1, 0.32, 1);
  @keyframes scaleIn {
    0% { opacity: 0; transform: scale(0.7) translateY(40px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
`;
const Face = styled.div<{ happy: boolean }>`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: ${({ happy }) => happy ? 'linear-gradient(135deg, #22c55e 60%, #a7f3d0 100%)' : 'linear-gradient(135deg, #ef4444 60%, #fecaca 100%)'};
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
const Smile = styled.div<{ happy: boolean }>`
  position: absolute;
  left: 50%;
  bottom: 18px;
  width: 28px;
  height: 16px;
  border-radius: 0 0 16px 16px;
  border-bottom: 3px solid #222;
  border-top: none;
  transform: translateX(-50%) scaleX(${({ happy }) => happy ? 1 : 1.1});
  ${({ happy }) => !happy && 'border-radius: 0 0 20px 20px / 0 0 8px 8px; border-bottom: 3px solid #222; border-top: none; height: 10px; top: 44px;'}
  ${({ happy }) => happy ? '' : 'border-bottom: none; border-top: 3px solid #222; border-radius: 0 0 20px 20px / 0 0 8px 8px; height: 10px; top: 44px; transform: translateX(-50%) scaleX(1.1) rotate(180deg);'}
`;
const OkButton = styled(ModalButton)`
  margin-top: 2.2rem;
`;

const PostulantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<{ type: 'cv' | 'video' | null }>({ type: null });
  const [actionLoading, setActionLoading] = useState<'approve' | 'reject' | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [modalConfirm, setModalConfirm] = useState<{ type: 'approve' | 'reject' | null, msg: string } | null>(null);
  const [localStatus, setLocalStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:3000/api/volunteer/profile-volunteer/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('No se pudo obtener el postulante');
        return res.json();
      })
      .then(setData)
      .catch(() => setError('No se pudo obtener el postulante'))
      .finally(() => setLoading(false));
  }, [id]);

  const dayMap: Record<string, string> = {
    MONDAY: 'Lunes',
    TUESDAY: 'Martes',
    WEDNESDAY: 'Miércoles',
    THURSDAY: 'Jueves',
    FRIDAY: 'Viernes',
    SATURDAY: 'Sabado',
    SUNDAY: 'Domingo',
  };
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'];
  const periods = [
    { key: 'period_time', label: 'Mañana', sub: '(8am - 12am)' },
    { key: 'period_time2', label: 'Tarde', sub: '(2pm - 6pm)' },
    { key: 'period_time3', label: 'Noche', sub: '(6pm - 10pm)' }
  ];

  const ScheduleTable: React.FC<{ schedules: any[] }> = ({ schedules }) => {
    // Construir un mapa para acceso rápido
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

  const handleApprove = async () => {
    if (!id) return;
    setActionLoading('approve');
    setActionMsg(null);
    try {
      const res = await fetch(`http://localhost:3000/api/volunteer/${id}/approve`, { method: 'POST' });
      if (!res.ok) throw new Error('No se pudo aprobar la solicitud');
      setModalConfirm({ type: 'approve', msg: '¡Solicitud aprobada exitosamente! Se ha enviado un correo de confirmación al postulante.' });
    } catch (e) {
      setActionMsg('Error al aprobar la solicitud');
    } finally {
      setActionLoading(null);
    }
  };
  const handleReject = async () => {
    if (!id) return;
    setActionLoading('reject');
    setActionMsg(null);
    try {
      const res = await fetch(`http://localhost:3000/api/volunteer/${id}/reject`, { method: 'POST' });
      if (!res.ok) throw new Error('No se pudo rechazar la solicitud');
      setModalConfirm({ type: 'reject', msg: 'Solicitud rechazada. Se ha enviado un correo de notificación al postulante.' });
    } catch (e) {
      setActionMsg('Error al rechazar la solicitud');
    } finally {
      setActionLoading(null);
    }
  };
  const closeModalConfirm = () => {
    if (modalConfirm?.type === 'approve') setLocalStatus('APPROVED');
    if (modalConfirm?.type === 'reject') setLocalStatus('REJECTED');
    setModalConfirm(null);
  };

  return (
    <Container>
      <GradientTitle>Datos del Postulante</GradientTitle>
      {data && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem', marginBottom: '0.5rem' }}>
          <TypeTag type={data.typeVolunteer}>
            {data.typeVolunteer === 'ADVISER' ? 'ASESOR' : data.typeVolunteer === 'STAFF' ? 'STAFF' : data.typeVolunteer}
            <AreaTag>{areaMap[data.idPostulationArea] || '-'}</AreaTag>
          </TypeTag>
          <StatusTag status={localStatus || data.statusVolunteer}>
            {statusMap[localStatus || data.statusVolunteer]?.label || localStatus || data.statusVolunteer}
          </StatusTag>
        </div>
      )}
      {loading && <Loading>Cargando datos...</Loading>}
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {data && (
        <DataBox>
          <SectionBox>
            <SectionTitle>Datos personales</SectionTitle>
            <FormGrid>
              {data?.name && data?.lastName && (
                <Field>
                  <Label>Nombre</Label>
                  <Value>{data.name} {data.lastName}</Value>
                </Field>
              )}
              {data?.email && (
                <Field>
                  <Label>Email</Label>
                  <Value>{data.email}</Value>
                </Field>
              )}
              {data?.phoneNumber && (
                <Field>
                  <Label>Teléfono</Label>
                  <Value>{data.phoneNumber}</Value>
                </Field>
              )}
              {data?.birthDate && (
                <Field>
                  <Label>Fecha de nacimiento</Label>
                  <Value>{data.birthDate ? new Date(data.birthDate).toLocaleDateString() : ''}</Value>
                </Field>
              )}
              {data?.birthDate && (
                <Field>
                  <Label>Edad</Label>
                  <Value>{data.birthDate ? Math.floor((Date.now() - new Date(data.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25)) + ' años' : '-'}</Value>
                </Field>
              )}
              {data?.typeIdentification && (
                <Field>
                  <Label>Tipo de identificación</Label>
                  <Value>{data.typeIdentification}</Value>
                </Field>
              )}
              {data?.numIdentification && (
                <Field>
                  <Label>Número de identificación</Label>
                  <Value>{data.numIdentification}</Value>
                </Field>
              )}
              {data?.programsUniversity && (
                <Field>
                  <Label>Universidad</Label>
                  <Value>{data.programsUniversity}</Value>
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
              {data?.datePostulation && (
                <Field>
                  <Label>Fecha de postulación</Label>
                  <Value>{data.datePostulation ? new Date(data.datePostulation).toLocaleDateString() : ''}</Value>
                </Field>
              )}
              {data?.wasVoluntary !== undefined && data?.wasVoluntary !== null && (
                <Field>
                  <Label>¿Fue voluntario antes?</Label>
                  <Value>{data.wasVoluntary ? 'Sí' : 'No'}</Value>
                </Field>
              )}
              {data?.volunteerMotivation && (
                <Field>
                  <Label>Motivación</Label>
                  <Value>{data.volunteerMotivation}</Value>
                </Field>
              )}
              {data?.howDidYouFindUs && (
                <Field>
                  <Label>¿Cómo nos encontró?</Label>
                  <Value>{data.howDidYouFindUs}</Value>
                </Field>
              )}
              {data?.advisoryCapacity && (
                <Field>
                  <Label>Capacidad de asesoría</Label>
                  <Value>{data.advisoryCapacity}</Value>
                </Field>
              )}
              {data?.schoolGrades && (
                <Field>
                  <Label>Grados de colegio</Label>
                  <Value>{data.schoolGrades}</Value>
                </Field>
              )}
              {data?.callingPlan !== undefined && data?.callingPlan !== null && (
                <Field>
                  <Label>¿Plan de llamadas?</Label>
                  <Value>{data.callingPlan ? 'Sí' : 'No'}</Value>
                </Field>
              )}
              {data?.quechuaLevel && (
                <Field>
                  <Label>Nivel de Quechua</Label>
                  <Value>{data.quechuaLevel}</Value>
                </Field>
              )}
              {Array.isArray(data?.schedules) && data.schedules.length > 0 && (
                <Field style={{ gridColumn: '1 / -1' }}>
                  <Label>Disponibilidad</Label>
                  <Value style={{ background: 'transparent', boxShadow: 'none', padding: 0 }}>
                    <ScheduleTable schedules={data.schedules} />
                  </Value>
                </Field>
              )}
            </FormGrid>
            <div style={{ display: 'flex', gap: '1.2rem', marginTop: '2.2rem', justifyContent: 'center' }}>
              <ActionButton
                style={{ background: '#22c55e', color: '#fff', boxShadow: '0 4px 16px rgba(34,197,94,0.18)', display: 'flex', alignItems: 'center', gap: '0.7rem', fontWeight: 700, opacity: actionLoading !== null || (localStatus || data.statusVolunteer) === 'APPROVED' ? 0.5 : 1, cursor: actionLoading !== null || (localStatus || data.statusVolunteer) === 'APPROVED' ? 'not-allowed' : 'pointer' }}
                onClick={handleApprove}
                disabled={actionLoading !== null || (localStatus || data.statusVolunteer) === 'APPROVED'}
              >
                <FaCheck style={{ fontSize: '1.2em' }} /> Aprobar Solicitud
              </ActionButton>
              <ActionButton
                style={{ background: '#ef4444', color: '#fff', boxShadow: '0 4px 16px rgba(239,68,68,0.18)', display: 'flex', alignItems: 'center', gap: '0.7rem', fontWeight: 700, opacity: actionLoading !== null || (localStatus || data.statusVolunteer) === 'REJECTED' ? 0.5 : 1, cursor: actionLoading !== null || (localStatus || data.statusVolunteer) === 'REJECTED' ? 'not-allowed' : 'pointer' }}
                onClick={handleReject}
                disabled={actionLoading !== null || (localStatus || data.statusVolunteer) === 'REJECTED'}
              >
                <FaTimes style={{ fontSize: '1.2em' }} /> Rechazar Solicitud
              </ActionButton>
            </div>
            {actionMsg && (
              <div style={{ textAlign: 'center', marginTop: '1.2rem', color: actionMsg.startsWith('¡') ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
                {actionMsg}
              </div>
            )}
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
                    src={data.cvUrl}
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
                    src={data.videoUrl}
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
      {modalConfirm && (
        <AnimatedModalOverlay>
          <AnimatedModalConfirm>
            <Face happy={modalConfirm.type === 'approve'}>
              <Eyes>
                <Eye />
                <Eye />
              </Eyes>
              <Smile happy={modalConfirm.type === 'approve'} />
            </Face>
            <h2 style={{ fontWeight: 700, fontSize: '1.3rem', color: modalConfirm.type === 'approve' ? '#22c55e' : '#ef4444', marginBottom: '1.2rem' }}>
              {modalConfirm.type === 'approve' ? 'Solicitud aprobada' : 'Solicitud rechazada'}
            </h2>
            <p style={{ fontSize: '1.08rem', color: '#333', marginBottom: '0.7rem' }}>{modalConfirm.msg}</p>
            <OkButton onClick={closeModalConfirm}>Ok</OkButton>
          </AnimatedModalConfirm>
        </AnimatedModalOverlay>
      )}
    </Container>
  );
};

export default PostulantDetail; 
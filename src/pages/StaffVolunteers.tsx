import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { postulantsService } from '../services/volunteer-postulation/postulants.service';
import Pagination from '../components/Pagination';
import { useNavigate } from 'react-router-dom';

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
const StaffContainer = styled.div`
  min-height: 100vh;
  background: #fff;
  padding: 2.5rem 1rem;
`;

const gradientCircle = 'bg-gradient-to-r from-[#FF0000] via-[#033ED8] via-[#347FF6] to-[#FDB82D]';

const StaffVolunteers: React.FC = () => {
  const [allStaff, setAllStaff] = useState<any[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    area: '',
    university: '',
    quechuaLevel: '',
    howDidYouFindUs: '',
    schoolGrades: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await postulantsService.getPostulants(1, 1000);
        // Solo staff aceptados
        const staff = response.data.filter((p: any) => p.statusVolunteer === 'APPROVED' && p.typeVolunteer === 'STAFF');
        setAllStaff(staff);
        setFilteredStaff(staff);
        setTotalItems(staff.length);
        setTotalPages(Math.ceil(staff.length / itemsPerPage));
      } catch (err) {
        setError('Error al cargar los voluntarios staff');
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [itemsPerPage]);

  useEffect(() => {
    let filtered = allStaff;
    if (searchTerm.trim()) {
      filtered = filtered.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        staff.phoneNumber.includes(searchTerm) ||
        staff.numIdentification.includes(searchTerm)
      );
    }
    if (filters.area) {
      filtered = filtered.filter(staff => staff.idPostulationArea.toString() === filters.area);
    }
    if (filters.university) {
      filtered = filtered.filter(staff => staff.programsUniversity === filters.university);
    }
    if (filters.quechuaLevel) {
      filtered = filtered.filter(staff => staff.quechuaLevel === filters.quechuaLevel);
    }
    if (filters.howDidYouFindUs) {
      filtered = filtered.filter(staff => staff.howDidYouFindUs === filters.howDidYouFindUs);
    }
    if (filters.schoolGrades) {
      filtered = filtered.filter(staff => staff.schoolGrades === filters.schoolGrades);
    }
    setFilteredStaff(filtered);
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [searchTerm, filters, allStaff, itemsPerPage]);

  const handleSearch = (value: string) => setSearchTerm(value);
  const handleFilterChange = (filterName: string, value: string) => setFilters(prev => ({ ...prev, [filterName]: value }));
  const clearFilters = () => setFilters({ area: '', university: '', quechuaLevel: '', howDidYouFindUs: '', schoolGrades: '' });
  const getUnique = (field: string) => [...new Set(allStaff.map(staff => staff[field]).filter(Boolean))];
  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  const getAreaName = (areaId: number) => {
    const areas: { [key: number]: string } = {
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
    return areas[areaId] || `Área ${areaId}`;
  };

  return (
    <StaffContainer>
      <GradientTitle>Voluntarios Staff</GradientTitle>
      <div className="mb-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Buscar por nombre, apellido, teléfono, correo o documento..."
              value={searchTerm}
              onChange={e => handleSearch(e.target.value)}
              className="w-full px-4 py-3 pl-10 pr-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros
          </button>
          {(Object.values(filters).some(filter => filter !== '') || searchTerm) && (
            <button
              onClick={() => { clearFilters(); setSearchTerm(''); }}
              className="px-4 py-3 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
            >
              Limpiar
            </button>
          )}
        </div>
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Área</label>
                <select
                  value={filters.area}
                  onChange={e => handleFilterChange('area', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas</option>
                  {[1,2,3,4,5,6,7,8,9,10,11].map(id => (
                    <option key={id} value={id}>{getAreaName(id)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Universidad</label>
                <select
                  value={filters.university}
                  onChange={e => handleFilterChange('university', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas</option>
                  {getUnique('programsUniversity').map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Quechua</label>
                <select
                  value={filters.quechuaLevel}
                  onChange={e => handleFilterChange('quechuaLevel', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="No lo hablo">No lo hablo</option>
                  <option value="Nivel básico">Nivel básico</option>
                  <option value="Nivel intermedio">Nivel intermedio</option>
                  <option value="Nivel avanzado">Nivel avanzado</option>
                  <option value="Nativo">Nativo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">¿Cómo nos encontró?</label>
                <select
                  value={filters.howDidYouFindUs}
                  onChange={e => handleFilterChange('howDidYouFindUs', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  {getUnique('howDidYouFindUs').map(h => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Grados de Colegio</label>
                <select
                  value={filters.schoolGrades}
                  onChange={e => handleFilterChange('schoolGrades', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  <option value="Primaria (3° y 4° grado)">Primaria (3° y 4° grado)</option>
                  <option value="Primaria (5° y 6° grado)">Primaria (5° y 6° grado)</option>
                  <option value="Secundaria (1°, 2° y 3° grado)">Secundaria (1°, 2° y 3° grado)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
          <p className="text-sm text-gray-600">
            <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Desliza horizontalmente para ver todas las columnas
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '1200px' }}>
            <thead className="bg-gradient-to-r from-blue-600 to-blue-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Contacto</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Documento</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Área</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Universidad</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Nivel Quechua</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">¿Cómo nos encontró?</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Grados de colegio</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStaff.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((staff) => (
                <tr
                  key={staff.id}
                  className="hover:bg-blue-50 cursor-pointer transition"
                  onClick={() => navigate(`/staff-volunteers/${staff.id}`)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className={`h-10 w-10 rounded-full ${gradientCircle} flex items-center justify-center`} style={{background: 'linear-gradient(90deg, #FF0000 0%, #033ED8 31%, #347FF6 68%, #FDB82D 100%)'}}>
                          <span className="text-sm font-medium text-white">
                            {staff.name.charAt(0)}{staff.lastName.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {staff.name} {staff.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{staff.email}</div>
                    <div className="text-sm text-gray-500">{staff.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{staff.typeIdentification}</div>
                    <div className="text-sm text-gray-500">{staff.numIdentification}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getAreaName(staff.idPostulationArea)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {staff.programsUniversity || 'No especificado'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {staff.quechuaLevel ? (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                        staff.quechuaLevel === 'Nivel avanzado' 
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : staff.quechuaLevel === 'Nivel intermedio'
                          ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          : staff.quechuaLevel === 'Nivel básico'
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {staff.quechuaLevel}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-500">No especificado</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {staff.howDidYouFindUs || 'No especificado'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {staff.schoolGrades || 'No especificado'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredStaff.length === 0 && !loading && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron voluntarios staff</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'Intenta con otros términos de búsqueda.' : 'No hay voluntarios staff registrados.'}
            </p>
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </div>
      )}
    </StaffContainer>
  );
};

export default StaffVolunteers; 
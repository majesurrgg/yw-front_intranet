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
const AdviserContainer = styled.div`
  min-height: 100vh;
  background: #fff;
  padding: 2.5rem 1rem;
`;

const AdviserVolunteers: React.FC = () => {
  const [allAdvisers, setAllAdvisers] = useState<any[]>([]);
  const [filteredAdvisers, setFilteredAdvisers] = useState<any[]>([]);
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
    const fetchAdvisers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await postulantsService.getPostulants(1, 1000);
        // Solo asesores aceptados
        const advisers = response.data.filter((p: any) => p.statusVolunteer === 'APPROVED' && p.typeVolunteer === 'ADVISER');
        setAllAdvisers(advisers);
        setFilteredAdvisers(advisers);
        setTotalItems(advisers.length);
        setTotalPages(Math.ceil(advisers.length / itemsPerPage));
      } catch (err) {
        setError('Error al cargar los voluntarios asesores');
      } finally {
        setLoading(false);
      }
    };
    fetchAdvisers();
  }, [itemsPerPage]);

  useEffect(() => {
    let filtered = allAdvisers;
    if (searchTerm.trim()) {
      filtered = filtered.filter(adviser =>
        adviser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        adviser.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        adviser.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        adviser.phoneNumber.includes(searchTerm) ||
        adviser.numIdentification.includes(searchTerm)
      );
    }
    if (filters.area) {
      filtered = filtered.filter(adviser => adviser.idPostulationArea.toString() === filters.area);
    }
    if (filters.university) {
      filtered = filtered.filter(adviser => adviser.programsUniversity === filters.university);
    }
    if (filters.quechuaLevel) {
      filtered = filtered.filter(adviser => adviser.quechuaLevel === filters.quechuaLevel);
    }
    if (filters.howDidYouFindUs) {
      filtered = filtered.filter(adviser => adviser.howDidYouFindUs === filters.howDidYouFindUs);
    }
    if (filters.schoolGrades) {
      filtered = filtered.filter(adviser => adviser.schoolGrades === filters.schoolGrades);
    }
    setFilteredAdvisers(filtered);
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [searchTerm, filters, allAdvisers, itemsPerPage]);

  const handleSearch = (value: string) => setSearchTerm(value);
  const handleFilterChange = (filterName: string, value: string) => setFilters(prev => ({ ...prev, [filterName]: value }));
  const clearFilters = () => setFilters({ area: '', university: '', quechuaLevel: '', howDidYouFindUs: '', schoolGrades: '' });
  const getUnique = (field: string) => [...new Set(allAdvisers.map(adviser => adviser[field]).filter(Boolean))];
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
    <AdviserContainer>
      <GradientTitle>Voluntarios Asesores</GradientTitle>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Grados de colegio</label>
                <select
                  value={filters.schoolGrades}
                  onChange={e => handleFilterChange('schoolGrades', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todos</option>
                  {getUnique('schoolGrades').map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Iniciales</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Área</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Universidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">Cargando...</td></tr>
            ) : error ? (
              <tr><td colSpan={7} className="text-center py-8 text-red-500">{error}</td></tr>
            ) : filteredAdvisers.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">No se encontraron voluntarios asesores.</td></tr>
            ) : (
              filteredAdvisers.slice((currentPage-1)*itemsPerPage, currentPage*itemsPerPage).map(adviser => (
                <tr key={adviser.id} className="hover:bg-blue-50 cursor-pointer" onClick={() => navigate(`/staff-volunteers/${adviser.id}`)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white ${adviser.statusVolunteer === 'APPROVED' ? 'bg-green-500' : adviser.statusVolunteer === 'REJECTED' ? 'bg-red-500' : 'bg-yellow-400'}`}>{adviser.statusVolunteer}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-300 text-white font-bold text-lg">
                      {adviser.name?.[0]}{adviser.lastName?.[0]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{adviser.name} {adviser.lastName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{getAreaName(adviser.idPostulationArea)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{adviser.programsUniversity}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{adviser.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="text-blue-600 hover:underline" onClick={e => { e.stopPropagation(); navigate(`/staff-volunteers/${adviser.id}`); }}>Ver detalle</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
        />
      </div>
    </AdviserContainer>
  );
};

export default AdviserVolunteers; 
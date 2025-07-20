import React, { useState, useEffect, useCallback } from 'react';
import type { Postulant } from '../interfaces/postulant.interface';
import { postulantsService } from '../services/volunteer-postulation/postulants.service';
import Pagination from '../components/Pagination';
import styled from 'styled-components';
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
  border-radius: 0;
  background-color: #fff;
`;

const Postulants: React.FC = () => {
  const [allPostulants, setAllPostulants] = useState<Postulant[]>([]);
  const [filteredPostulants, setFilteredPostulants] = useState<Postulant[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filtros
  const [filters, setFilters] = useState({
    typeVolunteer: '',
    area: '',
    status: '',
    university: '',
    year: '',
    month: '',
    wasVoluntary: '',
    quechuaLevel: '',
    howDidYouFindUs: '',
    schoolGrades: ''
  });

  const navigate = useNavigate();

  const fetchPostulants = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar todos los postulantes sin paginación
      const response = await postulantsService.getPostulants(1, 1000); // Cargar muchos registros
      setAllPostulants(response.data);
      setFilteredPostulants(response.data);
      setTotalItems(response.data.length);
      setTotalPages(Math.ceil(response.data.length / itemsPerPage));
    } catch (err) {
      setError('Error al cargar los postulantes');
      console.error('Error fetching postulants:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar postulantes cuando cambie el término de búsqueda o los filtros
  useEffect(() => {
    let filtered = allPostulants;

    // Filtro de búsqueda por texto
    if (searchTerm.trim()) {
      filtered = filtered.filter(postulant =>
        postulant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        postulant.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        postulant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        postulant.phoneNumber.includes(searchTerm) ||
        postulant.numIdentification.includes(searchTerm)
      );
    }

    // Filtros adicionales
    if (filters.typeVolunteer) {
      filtered = filtered.filter(postulant => postulant.typeVolunteer === filters.typeVolunteer);
    }

    if (filters.area) {
      filtered = filtered.filter(postulant => postulant.idPostulationArea.toString() === filters.area);
    }

    if (filters.status) {
      filtered = filtered.filter(postulant => postulant.statusVolunteer === filters.status);
    }

    if (filters.university) {
      filtered = filtered.filter(postulant => postulant.programsUniversity === filters.university);
    }

    if (filters.year) {
      filtered = filtered.filter(postulant => {
        const postulationYear = new Date(postulant.datePostulation).getFullYear().toString();
        return postulationYear === filters.year;
      });
    }

    if (filters.month) {
      filtered = filtered.filter(postulant => {
        const postulationMonth = (new Date(postulant.datePostulation).getMonth() + 1).toString();
        return postulationMonth === filters.month;
      });
    }

    if (filters.wasVoluntary) {
      const wasVoluntary = filters.wasVoluntary === 'true';
      filtered = filtered.filter(postulant => postulant.wasVoluntary === wasVoluntary);
    }

    if (filters.quechuaLevel) {
      filtered = filtered.filter(postulant => postulant.quechuaLevel === filters.quechuaLevel);
    }

    if (filters.howDidYouFindUs) {
      filtered = filtered.filter(postulant => postulant.howDidYouFindUs === filters.howDidYouFindUs);
    }

    if (filters.schoolGrades) {
      filtered = filtered.filter(postulant => postulant.schoolGrades === filters.schoolGrades);
    }

    setFilteredPostulants(filtered);
    setTotalItems(filtered.length);
    setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    setCurrentPage(1);
  }, [searchTerm, filters, allPostulants, itemsPerPage]);

  useEffect(() => {
    fetchPostulants();
  }, []);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      typeVolunteer: '',
      area: '',
      status: '',
      university: '',
      year: '',
      month: '',
      wasVoluntary: '',
      quechuaLevel: '',
      howDidYouFindUs: '',
      schoolGrades: ''
    });
  };

  // Obtener opciones únicas para los filtros
  const getUniqueValues = (field: keyof Postulant) => {
    const values = allPostulants.map(postulant => postulant[field]).filter(Boolean);
    return [...new Set(values)];
  };

  const getUniqueUniversities = () => {
    const universities = allPostulants
      .map(postulant => postulant.programsUniversity)
      .filter(Boolean);
    return [...new Set(universities)];
  };

  const getUniqueHowDidYouFindUs = () => {
    const sources = allPostulants
      .map(postulant => postulant.howDidYouFindUs)
      .filter(Boolean);
    return [...new Set(sources)];
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      APPROVED: 'bg-green-100 text-green-800 border-green-200',
      REJECTED: 'bg-red-100 text-red-800 border-red-200'
    };
    
    const statusText = {
      PENDING: 'Pendiente',
      APPROVED: 'Aprobado',
      REJECTED: 'Rechazado'
    };
    
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full border ${statusClasses[status as keyof typeof statusClasses]}`}>
        {statusText[status as keyof typeof statusText]}
      </span>
    );
  };

  const getVolunteerType = (type: string) => {
    const typeClasses = {
      STAFF: 'bg-blue-100 text-blue-800 border-blue-200',
      ADVISER: 'bg-purple-100 text-purple-800 border-purple-200'
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${typeClasses[type as keyof typeof typeClasses]}`}>
        {type === 'STAFF' ? 'Staff' : 'Asesor'}
      </span>
    );
  };

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

  // Agrega un gradiente para el círculo
  const gradientCircle = 'bg-gradient-to-r from-[#FF0000] via-[#033ED8] via-[#347FF6] to-[#FDB82D]';

  if (loading && allPostulants.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando postulantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GradientTitle>Administrar Postulantes</GradientTitle>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center space-x-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="text-xl font-bold text-gray-900">{totalItems}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Staff</p>
                  <p className="text-xl font-bold text-blue-600">
                    {allPostulants.filter(p => p.typeVolunteer === 'STAFF').length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Asesores</p>
                  <p className="text-xl font-bold text-purple-600">
                    {allPostulants.filter(p => p.typeVolunteer === 'ADVISER').length}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Pendientes</p>
                  <p className="text-xl font-bold text-yellow-600">
                    {allPostulants.filter(p => p.statusVolunteer === 'PENDING').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar por nombre, apellido, teléfono, correo o documento..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
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
                onClick={() => {
                  clearFilters();
                  setSearchTerm('');
                }}
                className="px-4 py-3 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 focus:ring-2 focus:ring-red-500 focus:border-transparent shadow-sm"
              >
                Limpiar
              </button>
                      )}

          {/* Indicador de filtros activos */}
          {(Object.values(filters).some(filter => filter !== '') || searchTerm) && (
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  Búsqueda: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.typeVolunteer && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Tipo: {filters.typeVolunteer === 'STAFF' ? 'Staff' : 'Asesor'}
                  <button
                    onClick={() => handleFilterChange('typeVolunteer', '')}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.area && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                  Área: {getAreaName(parseInt(filters.area))}
                  <button
                    onClick={() => handleFilterChange('area', '')}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.status && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Estado: {filters.status === 'PENDING' ? 'Pendiente' : filters.status === 'APPROVED' ? 'Aprobado' : 'Rechazado'}
                  <button
                    onClick={() => handleFilterChange('status', '')}
                    className="ml-2 text-yellow-600 hover:text-yellow-800"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.university && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Universidad: {filters.university}
                  <button
                    onClick={() => handleFilterChange('university', '')}
                    className="ml-2 text-indigo-600 hover:text-indigo-800"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.year && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Año: {filters.year}
                  <button
                    onClick={() => handleFilterChange('year', '')}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.month && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                  Mes: {filters.month}
                  <button
                    onClick={() => handleFilterChange('month', '')}
                    className="ml-2 text-pink-600 hover:text-pink-800"
                  >
                    ×
                  </button>
                </span>
              )}
              
              {filters.schoolGrades && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                  Grados: {filters.schoolGrades}
                  <button
                    onClick={() => handleFilterChange('schoolGrades', '')}
                    className="ml-2 text-teal-600 hover:text-teal-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

          {/* Panel de filtros */}
          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {/* Tipo de Voluntario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Voluntario</label>
                  <select
                    value={filters.typeVolunteer}
                    onChange={(e) => handleFilterChange('typeVolunteer', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="STAFF">Staff</option>
                    <option value="ADVISER">Asesor</option>
                  </select>
                </div>

                {/* Área */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Área</label>
                  <select
                    value={filters.area}
                    onChange={(e) => handleFilterChange('area', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todas</option>
                    <option value="1">Talento & Desarrollo Organizacional</option>
                    <option value="2">Cultura & Comunicación Interna</option>
                    <option value="3">Imagen Institucional & Relaciones Públicas</option>
                    <option value="4">Alianzas Organizacionales</option>
                    <option value="5">Convenios & Patrocinios Estratégicos</option>
                    <option value="6">Marketing & Contenidos</option>
                    <option value="7">Arte & Cultura</option>
                    <option value="8">Asesoría a Colegios Nacionales</option>
                    <option value="9">Bienestar Psicológicos</option>
                    <option value="10">Gestión de Comunidades</option>
                    <option value="11">Innovación & Calidad</option>
                  </select>
                </div>

                {/* Estado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    value={filters.status}
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="PENDING">Pendiente</option>
                    <option value="APPROVED">Aprobado</option>
                    <option value="REJECTED">Rechazado</option>
                  </select>
                </div>

                {/* Universidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Universidad</label>
                  <select
                    value={filters.university}
                    onChange={(e) => handleFilterChange('university', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todas</option>
                    {getUniqueUniversities().map(university => (
                      <option key={university} value={university}>{university}</option>
                    ))}
                  </select>
                </div>

                {/* Año */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Año</label>
                  <select
                    value={filters.year}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    {Array.from({length: 6}, (_, i) => 2020 + i).map(year => (
                      <option key={year} value={year.toString()}>{year}</option>
                    ))}
                  </select>
                </div>

                {/* Mes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mes</label>
                  <select
                    value={filters.month}
                    onChange={(e) => handleFilterChange('month', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="1">Enero</option>
                    <option value="2">Febrero</option>
                    <option value="3">Marzo</option>
                    <option value="4">Abril</option>
                    <option value="5">Mayo</option>
                    <option value="6">Junio</option>
                    <option value="7">Julio</option>
                    <option value="8">Agosto</option>
                    <option value="9">Septiembre</option>
                    <option value="10">Octubre</option>
                    <option value="11">Noviembre</option>
                    <option value="12">Diciembre</option>
                  </select>
                </div>

                {/* ¿Fue voluntario? */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">¿Fue voluntario?</label>
                  <select
                    value={filters.wasVoluntary}
                    onChange={(e) => handleFilterChange('wasVoluntary', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    <option value="true">Sí</option>
                    <option value="false">No</option>
                  </select>
                </div>

                {/* Nivel de Quechua */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Quechua</label>
                  <select
                    value={filters.quechuaLevel}
                    onChange={(e) => handleFilterChange('quechuaLevel', e.target.value)}
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

                {/* ¿Cómo nos encontró? */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">¿Cómo nos encontró?</label>
                  <select
                    value={filters.howDidYouFindUs}
                    onChange={(e) => handleFilterChange('howDidYouFindUs', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Todos</option>
                    {getUniqueHowDidYouFindUs().map(source => (
                      <option key={source} value={source}>{source}</option>
                    ))}
                  </select>
                </div>

                {/* Grados de Colegio */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grados de Colegio</label>
                  <select
                    value={filters.schoolGrades}
                    onChange={(e) => handleFilterChange('schoolGrades', e.target.value)}
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

        {/* Error Message */}
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

        {/* Table */}
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">Postulante</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Fecha Postulación
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Área
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Universidad
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    Nivel Quechua
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    ¿Fue voluntario?
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-white uppercase tracking-wider">
                    ¿Cómo nos encontró?
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPostulants.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((postulant) => (
                  <tr
                    key={postulant.id}
                    className="hover:bg-blue-50 cursor-pointer transition"
                    onClick={() => navigate(`/postulants/${postulant.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(postulant.statusVolunteer)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className={`h-10 w-10 rounded-full ${gradientCircle} flex items-center justify-center`} style={{background: 'linear-gradient(90deg, #FF0000 0%, #033ED8 31%, #347FF6 68%, #FDB82D 100%)'}}>
                            <span className="text-sm font-medium text-white">
                              {postulant.name.charAt(0)}{postulant.lastName.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {postulant.name} {postulant.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {postulant.wasVoluntary ? 'Ex voluntario' : ''}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{postulant.email}</div>
                      <div className="text-sm text-gray-500">{postulant.phoneNumber}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{postulant.typeIdentification}</div>
                      <div className="text-sm text-gray-500">{postulant.numIdentification}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(postulant.datePostulation)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getVolunteerType(postulant.typeVolunteer)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getAreaName(postulant.idPostulationArea)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {postulant.programsUniversity || 'No especificado'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {postulant.quechuaLevel ? (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                          postulant.quechuaLevel === 'Nivel avanzado' 
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : postulant.quechuaLevel === 'Nivel intermedio'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : postulant.quechuaLevel === 'Nivel básico'
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : 'bg-gray-100 text-gray-800 border-gray-200'
                        }`}>
                          {postulant.quechuaLevel}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-500">No especificado</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                        postulant.wasVoluntary 
                          ? 'bg-green-100 text-green-800 border-green-200'
                          : 'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {postulant.wasVoluntary ? 'Sí' : 'No'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {postulant.howDidYouFindUs || 'No especificado'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredPostulants.length === 0 && !loading && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron postulantes</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm ? 'Intenta con otros términos de búsqueda.' : 'No hay postulantes registrados.'}
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Postulants;
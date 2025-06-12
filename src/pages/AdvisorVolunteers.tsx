import React, { useEffect, useState } from 'react';
import { AreasService } from '../services/areas.service';
import type { Area } from '../services/areas.service';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AdvisorVolunteers: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const data = await AreasService.getAreas();
        setAreas(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar las áreas');
        console.error('Error fetching areas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">{error}</p>
          <p className="mt-2">Por favor, intente nuevamente más tarde</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Áreas de Voluntariado</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map((area) => (
          <div
            key={area.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800 flex-1">{area.name}</h2>
                <span className="ml-2">
                  {area.isActive ? (
                    <FaCheckCircle className="text-green-500 text-xl" />
                  ) : (
                    <FaTimesCircle className="text-red-500 text-xl" />
                  )}
                </span>
              </div>
              
              <p className="text-gray-600">{area.description}</p>
              
              <div className="mt-4 flex justify-end">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors duration-300"
                >
                  Ver detalles
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvisorVolunteers; 
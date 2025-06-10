"use client"
import type { Area } from "../interfaces/area.interface"
import MainLayout from "../layouts/MainLayout"

export default function StaffAreasPage() {

    const staffAreas = [
        {
            id: 1,
            title: "Área de gestión humana",
            image: "/assets/area-gh.jpeg?height=200&width=300",
            description: "Gestión de recursos humanos y desarrollo del talento",
        },
        {
            id: 2,
            title: "Área de alianzas organizacionales",
            image: "/assets/area-ao.jpeg?height=200&width=300",
            description: "Desarrollo de partnerships estratégicos",
        },
        {
            id: 3,
            title: "Área de asesorías a Colegios Nacionales",
            image: "/assets/area-acn.jpeg?height=200&width=300",
            description: "Apoyo y asesoría a instituciones educativas",
        },
        {
            id: 4,
            title: "Área de arte y cultura",
            image: "/assets/area-ayc.jpeg?height=200&width=300",
            description: "Programas culturales y artísticos",
        },
        {
            id: 5,
            title: "Área de Innovación y calidad",
            image: "/assets/area-iyc.jpeg?height=200&width=300",
            description: "Mejora continua e innovación organizacional",
        },
        {
            id: 6,
            title: "Área de gestión de comunidades",
            image: "/assets/area-gc.jpeg?height=200&width=300",
            description: "Manejo y desarrollo de comunidades",
        },
        {
            id: 7,
            title: "Área de Marketing y Contenidos",
            image: "/assets/area-myc.jpeg?height=200&width=300",
            description: "Estrategias de marketing y creación de contenido",
        },
        {
            id: 8,
            title: "Área de bienestar psicológico",
            image: "/assets/area-bp.jpeg?height=200&width=300",
            description: "Apoyo psicológico y bienestar emocional",
        },
        {
            id: 9,
            title: "Área de convenios y patrocinios",
            image: "/assets/area-cyp.jpeg?height=200&width=300",
            description: "Gestión de acuerdos y patrocinios",
        },
        {
            id: 10,
            title: "Área de Imagen Institucional Y RR.PP",
            image: "/assets/area-iiyrrpp.jpeg?height=200&width=300",
            description: "Relaciones públicas e imagen corporativa",
        },
    ]

    const handleAreaClick = (area: Area) => {
        console.log(`Navegando a: ${area.title}`)
        // Aquí se implementaría la navegación a cada área específica
    }


    return (

         <MainLayout>
    
        <div className="min-h-screen bg-gray-50">
            {/* header */}
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {staffAreas.map((area) => (
                        <div
                            key={area.id}
                            onClick={() => handleAreaClick(area)}
                            className="bg-blue-50 rounded-2xl p-6 cursor-pointer hover:bg-blue-100 transition-colors group"
                        >
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-blue-600 mb-4 leading-tight">{area.title}</h3>

                                <div className="bg-white rounded-xl p-4 mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                                    <img
                                        src={area.image || "/placeholder.svg"}
                                        alt={area.title}
                                        className="w-full h-32 object-cover rounded-lg"
                                    />
                                </div>

                                <p className="text-sm text-gray-600 hidden group-hover:block transition-all">{area.description}</p>
                            </div>
                        </div>
                    ))}

                    {/* Empty spaces to complete the grid */}
                    <div className="hidden lg:block"></div>
                    <div className="hidden lg:block"></div>
                </div>
            </main>
        </div>
        </MainLayout>
    )
}

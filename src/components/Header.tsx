import { LogOut } from "lucide-react"
import { Link } from "react-router-dom";

function Header() {

    const handleLogout = () => {
        console.log("Cerrando sesión...")
        // Aquí se implementaría la lógica de logout
    }

    return (
        <header className="bg-white shadow-sm px-6 py-4" >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
                {/* Logo y título */}
                <div className="flex items-center space-x-4">
                    <Link to="/" className="flex items-center space-x-2">
                        <img src="/assets/logo.svg" alt="Yachay Wasi Logo" className="h-15 w-auto" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-blue-600">Áreas STAFF</h1>
                        <div className="h-1 bg-yellow-400 w-full mt-1 rounded"></div>
                    </div>
                </div>
                {/* Botón cerrar sesión */}
                <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors flex items-center space-x-2"
                >
                    <span>Cerrar Sesión</span>
                    <LogOut className="w-5 h-5" />
                </button>
            </div>
        </header >

    )
}

export default Header
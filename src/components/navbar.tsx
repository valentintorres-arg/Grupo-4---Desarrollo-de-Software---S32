import { Bell, Settings, User } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="bg-white shadow-lg w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-12 w-12 mr-3 rounded-full border-2 border-gray-300"/>
          <span className="font-extrabold text-2xl tracking-tight text-black">
            Imagen
          </span>
        </div>

        <ul className="hidden md:flex space-x-8 font-medium text-lg">
          <li>
            <a href="/" className="hover:text-blue-400 transition text-black">
              Inicio
            </a>
          </li>
          <li>
            <a
              href="/pacientes"
              className="hover:text-blue-400 transition text-black"
            >
              Pacientes
            </a>
          </li>
          <li>
            <a
              href="/seguimientos"
              className="hover:text-blue-400 transition text-black"
            >
              Seguimientos
            </a>
          </li>
        </ul>

        <div className="flex items-center space-x-3">
          <button className="p-2 rounded hover:bg-gray-200 transition">
            <Bell className="h-5 w-5 text-gray-600" />
          </button>

          <button className="p-2 rounded hover:bg-gray-200 transition">
            <Settings className="h-5 w-5 text-gray-600 " />
          </button>

          <button className="p-2 rounded hover:bg-gray-200 transition">
            <User className="h-5 w-5  text-gray-600" />
          </button>
        </div>
      </div>
    </nav>
  )
}

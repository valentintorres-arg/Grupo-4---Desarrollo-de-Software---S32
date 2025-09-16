
import { Bell, Settings, User } from "lucide-react"


export default function Navbar() {
  return (
  
    <nav className="bg-whit text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center">
          <img src="/logo.png" alt="Logo" className="h-12 w-12 mr-3 rounded-full border-2 border-white" />
          <span className="font-extrabold text-2xl tracking-tight">imagen</span>
        </div>

        <ul className="hidden md:flex space-x-8 font-medium text-lg">
          <li><a href="#inicio" className="hover:text-blue-400 transition text-black">Inicio</a></li>
          <li><a href="#pacientes" className="hover:text-blue-400 transition text-black">Pacientes</a></li>
          <li><a href="#seguimientos" className="hover:text-blue-400 transition text-black">Seguimientos</a></li>
        </ul>

    <div className="flex items-center space-x-3 ">
      <button className="p-2 rounded dark:hover:bg-blue-200 ">
        <Bell className="h-5 w-5 text-gray-600" />
      </button>

      <button className="p-2 rounded  dark:hover:bg-blue-200">
        <Settings className="h-5 w-5 text-gray-600 " />
      </button>

      <button className="p-2 rounded  dark:hover:bg-blue-200">
        <User className="h-5 w-5  text-gray-600" />
      </button>
    </div>

        
      </div>
    </nav>
  );
}

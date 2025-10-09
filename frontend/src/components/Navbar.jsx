import React from 'react';

const Navbar = ({ onViewChange, currentView }) => {
  return (
    <nav style={styles.navBar}>
      <h1 style={styles.logo}>OdontoSys 🦷</h1>
      <div style={styles.buttonGroup}>
        
        {/* 1. Opción HOME */}
        <button 
          onClick={() => onViewChange('home')}
          style={currentView === 'home' ? styles.activeButton : styles.navButton}
        >
          Home
        </button>
        
        {/* Opción PACIENTES */}
        <button 
          onClick={() => onViewChange('detail')}
          style={currentView === 'detail' ? styles.activeButton : styles.navButton}
        >
          Pacientes
        </button>
        
        {/* Opción REGISTRAR TRATAMIENTO */}
        <button 
          onClick={() => onViewChange('register')}
          style={currentView === 'register' ? styles.activeButton : styles.navButton}
        >
          Registrar Tratamiento
        </button>
        
      </div>
    </nav>
  );
};

// Estilos básicos para la Navbar
const styles = {
  navBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 30px',
    backgroundColor: '#007bff', 
    color: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
  },
  logo: {
    margin: 0,
    fontSize: '24px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '15px',
  },
  navButton: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: '16px',
    transition: 'background-color 0.3s',
  },
  activeButton: {
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    fontSize: '16px',
    fontWeight: 'bold',
  }
};

export default Navbar;
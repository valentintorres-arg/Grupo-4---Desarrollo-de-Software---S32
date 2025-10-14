import React from 'react';

const Home = () => {
  return (
    <div style={styles.homeContainer}>
      <h2 style={styles.welcomeHeader}>Bienvenido al Sistema de Gestión de Ortodoncia</h2>
      <p style={styles.infoText}>
        Utilice la barra de navegación superior para gestionar la información de sus pacientes y tratamientos.
      </p>
      <div style={styles.imagePlaceholder}>
        🦷
      </div>
      <p style={styles.footerText}>
        Desarrollado con React.
      </p>
    </div>
  );
};

const styles = {
  homeContainer: {
    padding: '50px',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeHeader: {
    color: '#007bff',
    marginBottom: '20px',
  },
  infoText: {
    fontSize: '1.2em',
    color: '#343a40',
    maxWidth: '600px',
    margin: '0 auto 40px',
  },
  imagePlaceholder: {
    width: '150px',
    height: '150px',
    backgroundColor: '#e9ecef',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '40px',
    fontSize: '5em',
    color: '#adb5bd',
  },
  footerText: {
    marginTop: '40px',
    color: '#6c757d',
    fontSize: '0.9em',
  }
};

export default Home;
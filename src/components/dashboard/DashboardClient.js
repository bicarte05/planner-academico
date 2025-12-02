// src/components/dashboard/DashboardClient.js
"use client";
import React from 'react'; 
import { useTasks } from "../../context/TaskContext";
import { signOut } from "next-auth/react"; 
import ProductivityStats from "./ProductivityStats";
import UpcomingTasks from "./UpcomingTasks";
import Notifications from "./Notifications";
// ELIMINADO: No se necesita Workload.js
// ELIMINADO: No se necesita Goals.js
import CreateTaskModal from '../forms/CreateTaskModal'; 

export default function DashboardClient({ session }) {
  // Extraemos solo los datos necesarios del contexto:
  const { 
    totalTasks, 
    totalCompletedTasks, 
    showModal, 
    upcomingTasks, // Lista de TAREAS próximas (para Próximas Entregas)
    upcomingGoals  // Lista de METAS próximas (para Notificaciones)
  } = useTasks(); 
  
  // ELIMINADO: La extracción de 'tasks' completa ya no es necesaria si Workload se quita.

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' }); 
  };
  
  return (
    <div>
      {/* Contenedor para alinear el título y el botón de logout */}
      <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px' 
      }}>
        <h1 className="dashboard-header">Hola, {session.user.name}.</h1> 
        
        <button 
          onClick={handleLogout} 
          style={{ 
            padding: '8px 15px', 
            backgroundColor: '#d9534f', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px', 
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            transition: 'background-color 0.2s',
          }}
        >
          Cerrar Sesión
        </button>
      </div>

      <div className="dashboard-grid">
        {/* Productividad Semanal: Recibe datos de TAREAS calculados */}
        <ProductivityStats 
            completedTasks={totalCompletedTasks} 
            totalTasks={totalTasks} 
        />
        
        {/* Próximas Entregas: Recibe la lista de TAREAS próximas */}
        <UpcomingTasks tasks={upcomingTasks} />
        
        {/* ELIMINADO: El componente <Workload /> ha sido removido de aquí */}
        
        {/* Notificaciones: Recibe la lista de METAS próximas */}
        <Notifications notifications={upcomingGoals} />
       
        {/* ELIMINADO: El componente Goals ha sido removido de aquí */}
        
      </div>
      
      {/* Modal para crear o editar tareas/metas */}
      {showModal && (
        <CreateTaskModal /> 
      )}
    </div>
  );
}
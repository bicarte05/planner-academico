// src/components/dashboard/UpcomingTasks.js
import React from 'react';
import Link from 'next/link';

// MODIFICADO: El array 'tasks' ahora es el array pre-calculado 'upcomingTasks' del contexto.
export default function UpcomingTasks({ tasks = [] }) {
  
  // El contexto ya ha filtrado y ordenado. Solo tomamos las 3 primeras.
  const upcoming = tasks.slice(0, 3); 

  return (
    <div className="dashboard-card event-list"> 
      <h3>Próximas Entregas</h3>
      {upcoming.length > 0 ? (
        <>
          <ul>
            {upcoming.map(task => (
              <li key={task.id}>
                <span>{task.title}</span>
                {/* Formato de fecha */}
                <span className="event-date">
                  {new Date(task.dueDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                </span>
              </li>
            ))}
          </ul>
          <div className="dashboard-card-footer">
            <Link href="/calendar">Ver calendario</Link>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <span className="material-icons empty-state-icon">event_available</span>
          <p>¡Nada pendiente a la vista! 🎉</p>
          <div className="dashboard-card-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
             <Link href="/calendar">Ir al calendario</Link>
          </div>
        </div>
      )}
    </div>
  );
}
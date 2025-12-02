import React from 'react';
import Link from 'next/link';

export default function UpcomingTasks({ tasks = [] }) {
  // Filtramos: Tareas pendientes y que venzan hoy o en el futuro
  const upcoming = tasks
    .filter(task => !task.completed && new Date(task.dueDate) >= new Date().setHours(0,0,0,0))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  return (
    <div className="dashboard-card event-list"> 
      <h3>Próximas Entregas</h3>
      {upcoming.length > 0 ? (
        <>
          <ul>
            {upcoming.map(task => {
              const isMeta = task.category === 'meta';
              
              return (
                <li key={task.id} className="upcoming-item">
                  <div className="upcoming-content">
                    <div className="upcoming-header">
                      <span>{task.title}</span>
                      {/* Etiqueta visual pequeña si es una META */}
                      {isMeta && <span className="badge-mini">Meta</span>}
                    </div>

                    {/* Si es una actividad vinculada a una meta, mostramos el nombre de la meta */}
                    {!isMeta && task.goalTitle && (
                      <span className="upcoming-goal-ref">
                        <span className="material-icons" style={{ fontSize: '10px', verticalAlign: 'middle' }}>flag</span>
                        {task.goalTitle}
                      </span>
                    )}
                  </div>

                  <span className="event-date">
                    {new Date(task.dueDate).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}
                  </span>
                </li>
              );
            })}
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

      {/* Estilos específicos para este componente */}
      <style jsx>{`
        .upcoming-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 8px 0;
        }
        .upcoming-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;
          padding-right: 10px;
        }
        .upcoming-header {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 500;
        }
        .badge-mini {
          font-size: 9px;
          background-color: #e0f2fe;
          color: #0284c7;
          padding: 1px 4px;
          border-radius: 3px;
          text-transform: uppercase;
          font-weight: bold;
        }
        .upcoming-goal-ref {
          font-size: 11px;
          color: #888;
          display: flex;
          align-items: center;
          gap: 2px;
        }
        .event-date {
          white-space: nowrap;
          background-color: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          color: #555;
        }
      `}</style>
    </div>
  );
}
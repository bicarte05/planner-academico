'use client'; 
import React from 'react';
import Link from 'next/link';
import { useTasks } from '../../context/TaskContext';

export default function TaskList() {
  const { tasks, openEditModal, deleteTask } = useTasks();

  const pendingTasks = tasks.filter(task => !task.completed);

  return (
    <div className="dashboard-card task-list">
      <h3>Agenda del Día</h3>
      
      {pendingTasks.length > 0 ? (
        <>
          <ul>
            {pendingTasks.slice(0, 5).map(task => {
              const isMeta = task.category === 'meta';

              return (
                <li key={task.id} className={`task-item ${isMeta ? 'is-meta' : ''}`}>
                  {/* HE ELIMINADO EL CHECKBOX AQUÍ COMO PEDISTE */}
                  
                  <div className="task-item-info">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h4>{task.title}</h4>
                        
                        {/* Etiqueta azul si es una META principal */}
                        {isMeta && (
                          <span className="badge meta-badge">
                            Meta
                          </span>
                        )}
                      </div>

                      {/* NUEVO: Si es una tarea (no meta) y tiene meta asociada, la mostramos */}
                      {!isMeta && task.goalTitle && (
                        <span className="goal-reference">
                          <span className="material-icons" style={{ fontSize: '12px', verticalAlign: 'text-top', marginRight: '3px' }}>flag</span>
                          {task.goalTitle}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="task-item-actions">
                    <button 
                      className="task-action-button edit" 
                      onClick={() => openEditModal(task)}
                      title="Editar"
                    >
                      <span className="material-icons">edit</span>
                    </button>
                    <button 
                      className="task-action-button delete" 
                      onClick={() => deleteTask(task.id)}
                      title="Eliminar"
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="dashboard-card-footer">
            <Link href="/tasks">Ver todas</Link>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <span className="material-icons empty-state-icon">check_circle</span>
          <p>¡Todo al día!</p>
        </div>
      )}

      <style jsx>{`
        .is-meta {
          background-color: #fafafa;
          border-left: 3px solid #0284c7; /* Borde azul para destacar metas */
        }
        .task-item {
          padding: 12px; /* Un poco más de espacio al quitar el checkbox */
        }
        .badge {
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 4px;
          font-weight: bold;
          text-transform: uppercase;
        }
        .meta-badge {
          background-color: #e0f2fe;
          color: #0284c7;
        }
        /* Estilo para el nombre de la meta asociada */
        .goal-reference {
          font-size: 11px;
          color: #666;
          display: flex;
          align-items: center;
          background-color: #f3f4f6;
          padding: 2px 6px;
          border-radius: 4px;
          width: fit-content;
        }
      `}</style>
    </div>
  );
}
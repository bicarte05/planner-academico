'use client';
import React from 'react';
import { useTasks } from '../../context/TaskContext'; 

export default function TasksPage() {
  const { tasks, toggleTaskCompleted, openEditModal, deleteTask } = useTasks();

  return (
    <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '20px', fontSize: '28px', fontWeight: 'bold', color: '#333' }}>
        Todas las Tareas
      </h2>
      
      <div className="dashboard-card" style={{ padding: '0', overflow: 'hidden', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        {tasks.length > 0 ? (
          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {tasks.map(task => {
              const isMeta = task.category === 'meta';

              return (
                <li key={task.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px 20px',
                  borderBottom: '1px solid #eee',
                  backgroundColor: isMeta ? '#f8f9fa' : 'white', 
                  // CAMBIO AQUÍ: Borde azul para metas, borde naranja para actividades
                  borderLeft: isMeta ? '4px solid #0284c7' : '4px solid #c2410c', 
                  transition: 'background-color 0.2s'
                }}>
                  
                  {/* 1. CHECKBOX O ÍCONO */}
                  <div style={{ marginRight: '15px', minWidth: '24px', display: 'flex', justifyContent: 'center' }}>
                    {!isMeta ? (
                      <input 
                        type="checkbox" 
                        checked={task.completed}
                        onChange={() => toggleTaskCompleted(task.id)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#4a90e2' }}
                      />
                    ) : (
                       <span className="material-icons" style={{ color: '#0284c7', fontSize: '20px' }}>flag</span>
                    )}
                  </div>

                  {/* INFORMACIÓN PRINCIPAL */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                      <h4 style={{ margin: 0, fontSize: '16px', color: '#333', fontWeight: isMeta ? '600' : '400' }}>
                        {task.title}
                      </h4>
                      
                      {/* ETIQUETAS DE COLOR */}
                      {isMeta ? (
                        <span style={{ fontSize: '10px', backgroundColor: '#e0f2fe', color: '#0284c7', padding: '1px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                          Meta
                        </span>
                      ) : (
                        <span style={{ fontSize: '10px', backgroundColor: '#ffedd5', color: '#c2410c', padding: '1px 6px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold' }}>
                          Actividad
                        </span>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px', fontSize: '13px', color: '#666' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span className="material-icons" style={{ fontSize: '14px' }}>calendar_today</span>
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>

                      {!isMeta && task.goalTitle && (
                        <span style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '4px',
                          backgroundColor: '#f3f4f6', 
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          color: '#555'
                        }}>
                          <span className="material-icons" style={{ fontSize: '12px' }}>flag</span>
                          {task.goalTitle}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* BOTONES DE ACCIÓN */}
                  <div style={{ display: 'flex', gap: '8px', marginLeft: '10px' }}>
                    <button 
                      onClick={() => openEditModal(task)}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#4a90e2', padding: '4px' }}
                      title="Editar"
                    >
                      <span className="material-icons">edit</span>
                    </button>
                    <button 
                      onClick={() => deleteTask(task.id)}
                      style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#dc3545', padding: '4px' }}
                      title="Eliminar"
                    >
                      <span className="material-icons">delete</span>
                    </button>
                  </div>

                </li>
              );
            })}
          </ul>
        ) : (
          <div style={{ padding: '60px', textAlign: 'center', color: '#999' }}>
            <span className="material-icons" style={{ fontSize: '48px', marginBottom: '10px', display: 'block' }}>assignment</span>
            <p>No tienes tareas registradas aún.</p>
          </div>
        )}
      </div>
    </div>
  );
}
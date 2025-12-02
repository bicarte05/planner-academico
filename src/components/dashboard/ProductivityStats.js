'use client';
import React from 'react';

export default function ProductivityStats({ completedTasks = 0, totalTasks = 0 }) {
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="dashboard-card blue-bg">
      <h3>Productividad Semanal</h3>
      <div className="stats-card-content">
        <span className="stats-main-value" style={{color: 'var(--card-text-blue)'}}>{completionPercentage}%</span>
        <p className="stats-description">de actividades completadas</p>
        <div className="workload-progress-bar-container" style={{width: '70%', backgroundColor: 'rgba(255,255,255,0.7)'}}>
            <div 
                className="workload-progress-bar-fill" 
                style={{ width: `${completionPercentage}%`, backgroundColor: 'var(--card-text-blue)' }}
            ></div>
        </div>
        <p className="stats-detail-text">Completadas: {completedTasks} de {totalTasks} actividades</p>
      </div>
    </div>
  );
}
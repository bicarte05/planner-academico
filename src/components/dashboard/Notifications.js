// src/components/dashboard/Notifications.js (MODIFICADO)
import React from 'react';
import Link from 'next/link';

export default function Notifications({ notifications = [] }) {
  
  // Mapeamos los objetos de METAS a objetos de notificación.
  const formattedNotifications = notifications.map(goal => ({
      id: goal.id,
      // Generamos un mensaje específico para la meta.
      message: `¡ALERTA! Tu meta "${goal.title}" vence el ${new Date(goal.dueDate).toLocaleDateString('es-ES', { month: 'short', day: '2-digit' })}.`
  }));

  const displayNotifications = formattedNotifications;
  
  return (
    <div className="dashboard-card yellow-bg">
      <h3>Notificaciones (Metas)</h3>
      
      {/* El resto del renderizado es idéntico */}
      {displayNotifications.length > 0 ? (
        <>
          <ul className="notification-list">
            {displayNotifications.map(notification => (
              <li key={notification.id}>
                <span className="material-icons">info</span>
                <span>{notification.message}</span>
              </li>
            ))}
          </ul>
          <div className="dashboard-card-footer" style={{ borderTopColor: 'var(--card-border-yellow)' }}>
             <Link href="/notifications">Ver todas</Link>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <span className="material-icons empty-state-icon" style={{color: 'var(--card-border-yellow)'}}>notifications_none</span>
          <p>Sin metas próximas urgentes.</p>
        </div>
      )}
    </div>
  );
}
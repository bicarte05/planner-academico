'use client';
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useSession } from 'next-auth/react'; 
// Importamos ambas funciones de búsqueda
import { fetchUserActivities, fetchUserGoals } from '@/actions/goalActions'; 

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const { data: session } = useSession(); 
  const [tasks, setTasks] = useState([]); 
  
  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // --- CARGA UNIFICADA: METAS + ACTIVIDADES (Desde Supabase) ---
  useEffect(() => {
    async function loadAllData() {
      if (session?.user?.id) {
        console.log("📥 Contexto: Cargando metas y actividades...");
        try {
          // 1. Ejecutamos ambas peticiones en paralelo
          const [dbActivities, dbGoals] = await Promise.all([
            fetchUserActivities(session.user.id),
            fetchUserGoals(session.user.id)
          ]);
          
          // 2. Procesamos las ACTIVIDADES (TAREAS)
          const formattedActivities = (dbActivities || []).map(act => ({
            ...act,
            id: `act-${act.id}`, 
            originalId: act.id,  
            category: 'tarea', // Categoría clave
            completed: act.completada || false, 
            dueDate: act.dueDate || new Date().toISOString()
          }));

          // 3. Procesamos las METAS
          const formattedGoals = (dbGoals || []).map(goal => ({
            id: `goal-${goal.id}`,
            originalId: goal.id,
            title: goal.titulo,          
            description: goal.descripcion,
            completed: goal.completada,
            dueDate: goal.fecha_limite || new Date().toISOString(),
            category: 'meta'             // Categoría clave
          }));

          // 4. Combinamos todo en una sola lista maestra
          setTasks([...formattedGoals, ...formattedActivities]); 

        } catch (error) {
          console.error("Error cargando datos:", error);
          setTasks([]); 
        }
      }
    }
    loadAllData();
  }, [session]); 

  // --- CÁLCULO DE MÉTRICAS CON useMemo ---
  const productivityMetrics = useMemo(() => {
    // 1. Filtramos TAREAS (para Productividad Semanal y Próximas Entregas)
    const weeklyTasks = tasks.filter(t => t.category === 'tarea');
    
    // 2. Filtramos METAS (para Notificaciones)
    const allGoals = tasks.filter(t => t.category === 'meta');
    
    // CÁLCULOS DE PRODUCTIVIDAD (Basado solo en TAREAS)
    const totalTasks = weeklyTasks.length;
    const totalCompletedTasks = weeklyTasks.filter(t => t.completed).length;

    // PRÓXIMAS ENTREGAS (Las 5 TAREAS no completadas más cercanas)
    const upcomingTasks = weeklyTasks
        .filter(t => !t.completed) 
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5); 

    // NOTIFICACIONES (Las 5 METAS no completadas más cercanas)
    const upcomingGoals = allGoals
        .filter(t => !t.completed) 
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5);
        
    return {
        totalTasks,
        totalCompletedTasks,
        upcomingTasks,
        upcomingGoals // <-- Nuevo valor
    };
  }, [tasks]);

  // --- GESTIÓN DE ESTADO ---
  const saveTask = (newItemData) => {
    // Determinamos ID temporal y prefijo
    const tempId = String(Date.now() + Math.random()); 
    const prefix = newItemData.category === 'meta' ? 'goal-' : 'act-';
    
    const itemToSave = {
      ...newItemData,
      id: newItemData.id || `${prefix}${tempId}`, 
      completed: newItemData.completed !== undefined ? newItemData.completed : false,
      dueDate: newItemData.dueDate || new Date().toISOString()
    };
    
    if (tasks.some(t => t.id === itemToSave.id)) {
      setTasks(prev => prev.map(t => t.id === itemToSave.id ? { ...t, ...itemToSave } : t));
    } else {
      setTasks(prev => [itemToSave, ...prev]);
    }
    
    // NOTA: Implementar la llamada a la función de Supabase para guardar permanentemente
    
    closeModal();
  };
  
  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    // NOTA: Llamar a Supabase para eliminar en la DB.
  };

  const toggleTaskCompleted = (taskId) => {
    if (typeof taskId === 'string' && taskId.startsWith('goal-')) {
      return; 
    }

    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    // NOTA: Llamar a Supabase para actualizar el estado de completado en la DB.
  };

  const openModal = () => { setTaskToEdit(null); setShowModal(true); };
  const openEditModal = (task) => { 
    setTaskToEdit(task); 
    setShowModal(true); 
  };
  const closeModal = () => { setShowModal(false); setTaskToEdit(null); };

  return (
    <TaskContext.Provider value={{
      tasks,
      // ** VALORES CLAVE EXPUESTOS AL DASHBOARD **
      totalTasks: productivityMetrics.totalTasks, 
      totalCompletedTasks: productivityMetrics.totalCompletedTasks,
      upcomingTasks: productivityMetrics.upcomingTasks, // Próximas Entregas (TAREAS)
      upcomingGoals: productivityMetrics.upcomingGoals, // Notificaciones (METAS)
      
      saveTask,
      deleteTask,
      toggleTaskCompleted,
      showModal,
      openModal,
      openEditModal,
      closeModal,
      taskToEdit
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);
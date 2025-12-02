'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react'; 
import { fetchUserActivities, fetchUserGoals } from '@/actions/goalActions'; 

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const { data: session } = useSession(); 
  const [tasks, setTasks] = useState([]); 
  
  const [showModal, setShowModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  // --- CARGA UNIFICADA: METAS + ACTIVIDADES ---
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

          // NUEVO: Creamos un mapa rápido para buscar nombres de metas por su ID
          // Esto nos permite decir: "Si la actividad tiene meta_id 5, ¿cómo se llama la meta 5?"
          const goalsMap = new Map((dbGoals || []).map(g => [g.id, g.titulo]));
          
          // 2. Procesamos las ACTIVIDADES (Prefijo 'act-')
          const formattedActivities = (dbActivities || []).map(act => ({
            ...act,
            id: `act-${act.id}`, 
            originalId: act.id,  
            category: 'tarea',
            dueDate: act.dueDate || new Date().toISOString(),
            // AQUÍ AGREGAMOS EL NOMBRE DE LA META ASOCIADA
            goalTitle: goalsMap.get(act.meta_id) || null
          }));

          // 3. Procesamos las METAS (Prefijo 'goal-')
          const formattedGoals = (dbGoals || []).map(goal => ({
            id: `goal-${goal.id}`,
            originalId: goal.id,
            title: goal.titulo,          
            description: goal.descripcion,
            completed: goal.completada,
            dueDate: goal.fecha_limite || new Date().toISOString(),
            category: 'meta'             
          }));

          // 4. Combinamos todo
          setTasks([...formattedGoals, ...formattedActivities]); 

        } catch (error) {
          console.error("Error cargando datos:", error);
          setTasks([]); 
        }
      }
    }
    loadAllData();
  }, [session]); 

  // --- GESTIÓN DE ESTADO ---

  const saveTask = (newItemData) => {
    const prefix = newItemData.category === 'meta' ? 'goal-' : 'act-';
    
    const itemToSave = {
      ...newItemData,
      id: newItemData.id.toString().startsWith(prefix) ? newItemData.id : `${prefix}${newItemData.id}`,
      dueDate: newItemData.dueDate || new Date().toISOString()
    };

    if (tasks.some(t => t.id === itemToSave.id)) {
      setTasks(prev => prev.map(t => t.id === itemToSave.id ? { ...t, ...itemToSave } : t));
    } else {
      setTasks(prev => [itemToSave, ...prev]);
    }
    closeModal();
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const toggleTaskCompleted = (taskId) => {
    if (typeof taskId === 'string' && taskId.startsWith('goal-')) {
      return; 
    }
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
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
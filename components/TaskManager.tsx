import React, { useState } from 'react';
import { Task } from '../types';
import { CheckSquare, Square, Trash2, Plus, Calendar, AlertCircle, Wand2, ListTodo } from 'lucide-react';

interface TaskManagerProps {
  tasks: Task[];
  weddingDate: string;
  onAddTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
  onGenerateDefaults: () => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({ 
  tasks, 
  weddingDate, 
  onAddTask, 
  onUpdateTask, 
  onDeleteTask, 
  onGenerateDefaults 
}) => {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newPriority, setNewPriority] = useState<'low'|'medium'|'high'>('medium');
  const [filter, setFilter] = useState<'all'|'pending'|'completed'>('all');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    onAddTask({
      id: crypto.randomUUID(),
      title: newTaskTitle,
      category: 'Geral',
      completed: false,
      priority: newPriority,
      deadline: ''
    });
    setNewTaskTitle('');
  };

  const toggleComplete = (task: Task) => {
    onUpdateTask({ ...task, completed: !task.completed });
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const filteredTasks = tasks.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  }).sort((a, b) => {
      // Sort by completed (bottom), then priority (high > medium > low)
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const pMap = { high: 3, medium: 2, low: 1 };
      return pMap[b.priority] - pMap[a.priority];
  });

  return (
    <div className="space-y-6">
      
      {/* Header & Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl p-6 text-white shadow-lg">
              <div className="flex justify-between items-start mb-4">
                  <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                          <ListTodo className="text-rose-400" /> Checklist do Casamento
                      </h2>
                      <p className="text-slate-300 text-sm mt-1">Mantenha o foco e não esqueça nenhum detalhe.</p>
                  </div>
                  <div className="text-right">
                      <span className="text-3xl font-bold">{completedCount}</span>
                      <span className="text-slate-400 text-sm">/{tasks.length}</span>
                  </div>
              </div>
              
              <div className="w-full bg-slate-600/50 rounded-full h-3 mb-2">
                  <div 
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${progress}%` }}
                  />
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                  <span>Início</span>
                  <span>{progress.toFixed(0)}% Concluído</span>
              </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center items-center text-center">
             {tasks.length === 0 ? (
                 <div className="space-y-3">
                     <Wand2 size={32} className="text-rose-500 mx-auto" />
                     <p className="text-sm text-slate-600">Comece com um plano pronto!</p>
                     <button 
                        onClick={onGenerateDefaults}
                        className="bg-rose-50 text-rose-700 px-4 py-2 rounded-lg text-sm font-medium border border-rose-200 hover:bg-rose-100 transition-colors w-full"
                     >
                         Gerar Tarefas Padrão
                     </button>
                 </div>
             ) : (
                 <div className="space-y-2 w-full">
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Próxima Prioridade</p>
                     {(() => {
                         const next = tasks.find(t => !t.completed && t.priority === 'high');
                         return next ? (
                             <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-800 text-sm font-medium text-left">
                                 {next.title}
                             </div>
                         ) : (
                             <p className="text-emerald-600 font-medium">Tudo em dia! 🎉</p>
                         );
                     })()}
                 </div>
             )}
          </div>
      </div>

      {/* Add Task & Filters */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
          <form onSubmit={handleAdd} className="flex-1 w-full flex gap-2">
              <input 
                value={newTaskTitle}
                onChange={e => setNewTaskTitle(e.target.value)}
                placeholder="Adicionar nova tarefa..."
                className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-400 outline-none text-sm"
              />
              <select 
                value={newPriority}
                onChange={e => setNewPriority(e.target.value as any)}
                className="p-2 border border-slate-300 rounded-lg text-sm bg-slate-50 outline-none"
              >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
              </select>
              <button 
                type="submit"
                className="bg-slate-800 text-white p-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                  <Plus size={20} />
              </button>
          </form>

          <div className="flex bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                  Todas
              </button>
              <button 
                onClick={() => setFilter('pending')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'pending' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                  Pendentes
              </button>
              <button 
                onClick={() => setFilter('completed')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filter === 'completed' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                  Feitas
              </button>
          </div>
      </div>

      {/* Task List */}
      <div className="space-y-2">
          {filteredTasks.length === 0 ? (
              <div className="text-center py-10 text-slate-400">Nenhuma tarefa encontrada.</div>
          ) : (
              filteredTasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all group ${
                        task.completed 
                        ? 'bg-slate-50 border-slate-100 opacity-60' 
                        : 'bg-white border-slate-200 hover:border-rose-200 shadow-sm'
                    }`}
                  >
                      <button 
                        onClick={() => toggleComplete(task)}
                        className={`shrink-0 transition-colors ${task.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-rose-500'}`}
                      >
                          {task.completed ? <CheckSquare size={24} /> : <Square size={24} />}
                      </button>
                      
                      <div className="flex-1">
                          <p className={`font-medium text-sm ${task.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
                              {task.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                              {task.priority === 'high' && <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded">ALTA</span>}
                              {task.priority === 'medium' && <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">MÉDIA</span>}
                              {task.priority === 'low' && <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">BAIXA</span>}
                              
                              {task.deadline && (
                                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                                      <Calendar size={10} /> {task.deadline}
                                  </span>
                              )}
                          </div>
                      </div>

                      <button 
                        onClick={() => onDeleteTask(task.id)}
                        className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                      >
                          <Trash2 size={18} />
                      </button>
                  </div>
              ))
          )}
      </div>
    </div>
  );
};
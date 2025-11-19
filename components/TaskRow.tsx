
import React, { useState, useEffect, useRef } from 'react';
import { Task, User, Status, Priority, Role, List, Permission } from '../types';
import { useAppContext } from '../contexts/AppContext';
import { useTranslation } from '../i18n';
import AvatarWithStatus from './AvatarWithStatus';

interface TaskRowProps {
  task: Task;
  isSelected?: boolean;
  onToggleSelection?: (taskId: string) => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragEnter?: (e: React.DragEvent<HTMLDivElement>, taskId: string) => void;
  onDragEnd?: () => void;
}

const statusConfig: { [key in Status]: string } = {
  [Status.Todo]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  [Status.InProgress]: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  [Status.Done]: 'bg-green-500/10 text-green-500 border-green-500/20',
};

const priorityBorderColor: { [key in Priority]: string } = {
    [Priority.High]: 'border-l-priority-high',
    [Priority.Medium]: 'border-l-priority-medium',
    [Priority.Low]: 'border-l-priority-low',
};

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
    const { t } = useTranslation();
    const config = {
        [Priority.High]: 'text-red-500 bg-red-500/10',
        [Priority.Medium]: 'text-amber-500 bg-amber-500/10',
        [Priority.Low]: 'text-green-500 bg-green-500/10',
    };
    return (
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${config[priority]}`}>
            {t(`common.${priority.toLowerCase()}`)}
        </span>
    );
};

const DependencyIndicator: React.FC<{ task: Task; onBlockingClick: () => void; }> = ({ task, onBlockingClick }) => {
  const { t } = useTranslation();
  const { state } = useAppContext();
  const { allTasks } = state;

  const isBlocked = (task.dependsOn || []).some(depId => {
    const depTask = allTasks.find(t => t.id === depId);
    return depTask && depTask.status !== Status.Done;
  });

  const blockingTasks = allTasks.filter(t => t.dependsOn?.includes(task.id));

  if (isBlocked) {
    return (
      <div className="flex items-center text-amber-500 flex-shrink-0 ml-2" title={t('tooltips.blocked')}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
        </svg>
      </div>
    );
  }

  if (blockingTasks.length > 0) {
    const taskTitles = blockingTasks.map(t => t.title).join(', ');
    return (
      <button onClick={(e) => { e.stopPropagation(); onBlockingClick(); }} className="flex items-center gap-1 text-text-secondary hover:text-primary transition-colors flex-shrink-0 ml-2" title={t('tooltips.isBlocking', { tasks: taskTitles })}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path d="M8 9a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
          <path d="M15.5 6.5a1 1 0 00-1-1h-1.382l-.447-1.342A2 2 0 0011.025 3H8.975a2 2 0 00-1.646 1.158L6.882 5.5H5.5a1 1 0 000 2h1.082l.858 5.146A2 2 0 009.423 14h1.154a2 2 0 001.983-1.854l.858-5.146H14.5a1 1 0 001-1z" />
        </svg>
        <span className="text-xs font-medium">{blockingTasks.length}</span>
      </button>
    );
  }

  return null;
};


const TaskRow: React.FC<TaskRowProps> = ({ 
    task, 
    isSelected = false, 
    onToggleSelection = (taskId) => {}, 
    onDragStart = (e, taskId) => {}, 
    onDragEnter = (e, taskId) => {}, 
    onDragEnd = () => {} 
}) => {
  const { state, actions, permissions } = useAppContext();
  const { users, currentUser, allLists } = state;
  const { handleUpdateTask, handleDeleteTask, setSelectedTaskId, logActivity, setTaskForBlockingModal, setIsBlockingTasksModalOpen } = actions;
  const { t, i18n } = useTranslation();

  const statusText: { [key in Status]: string } = {
    [Status.Todo]: t('common.todo'),
    [Status.InProgress]: t('common.inProgress'),
    [Status.Done]: t('common.done'),
  };
    
  const canEdit = permissions.has(Permission.EDIT_TASKS);
  const canDelete = permissions.has(Permission.DELETE_TASKS);
  const isDraggable = permissions.has(Permission.DRAG_AND_DROP);

  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== Status.Done;
  const assignee = users.find(u => u.id === task.assigneeId);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as Status;
    const oldStatus = task.status;
    handleUpdateTask({ ...task, status: newStatus });
    logActivity(task.id, `cambió el estado de "${statusText[oldStatus]}" a "${statusText[newStatus]}"`, currentUser!);
  };
  
  return (
    <div
      draggable={isDraggable}
      onDragStart={(e) => onDragStart(e, task.id)}
      onDragEnter={(e) => onDragEnter(e, task.id)}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      className={`
        group flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 px-4 py-4 md:py-3 
        border-b border-border transition-all duration-200 animate-fadeIn 
        bg-surface hover:bg-secondary-focus
        ${isDraggable ? 'cursor-grab' : ''} 
        ${isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : `border-l-4 ${priorityBorderColor[task.priority]}`}
      `}
    >
      {/* Checkbox & Title (Column 1-6) */}
      <div className="flex items-start md:items-center col-span-12 md:col-span-6 gap-3">
          <div className="flex items-center justify-center w-6 flex-shrink-0 mt-0.5 md:mt-0" onClick={(e) => e.stopPropagation()}>
            <input 
                type="checkbox"
                className="w-5 h-5 md:w-4 md:h-4 rounded text-primary bg-transparent border-border focus:ring-primary disabled:opacity-50 cursor-pointer transition-all"
                checked={isSelected}
                onChange={() => onToggleSelection(task.id)}
                disabled={!canEdit}
            />
          </div>
          
          <div className="flex-grow min-w-0 flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
             <div className="flex items-center">
                <button 
                    onClick={() => setSelectedTaskId(task.id)} 
                    className={`text-left hover:underline focus:outline-none truncate font-medium text-base md:text-base transition-colors ${task.status === Status.Done ? 'text-text-secondary line-through decoration-text-secondary/50' : 'text-text-primary'}`}
                >
                    {task.title}
                </button>
                <DependencyIndicator task={task} onBlockingClick={() => { setTaskForBlockingModal(task); setIsBlockingTasksModalOpen(true); }} />
             </div>
             
             {/* Mobile: Priority & Date inline beneath title */}
             <div className="md:hidden flex items-center gap-2 text-xs mt-1">
                 <PriorityBadge priority={task.priority} />
                 <span className="text-text-secondary">•</span>
                 <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : 'text-text-secondary'}`}>
                    <span>{new Date(task.dueDate).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' })}</span>
                    {isOverdue && <span className="text-[10px] uppercase bg-red-500 text-white px-1 rounded">!</span>}
                </div>
             </div>
          </div>
      </div>

      {/* Assignee (Column 7-8) */}
      <div className="col-span-12 md:col-span-2 flex items-center pl-9 md:pl-0">
          <div className="flex items-center gap-2">
             {assignee ? (
                 <>
                     <AvatarWithStatus user={assignee} className="w-6 h-6" />
                     <span className="text-sm text-text-secondary truncate max-w-[150px] md:max-w-[100px]">{assignee.name}</span>
                 </>
             ) : (
                 <div className="flex items-center gap-2 opacity-50">
                     <div className="w-6 h-6 rounded-full bg-secondary border border-dashed border-text-secondary flex items-center justify-center">
                         <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                     </div>
                     <span className="text-sm text-text-secondary">{t('common.unassigned')}</span>
                 </div>
             )}
          </div>
      </div>

      {/* Due Date (Column 9-10) - Desktop only */}
      <div className="hidden md:flex col-span-6 md:col-span-2 items-center">
          <div className={`flex items-center gap-1.5 text-sm ${isOverdue ? 'text-red-500 font-medium' : 'text-text-secondary'}`}>
              <svg className="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span>
                 {new Date(task.dueDate).toLocaleDateString(i18n.language, { month: 'short', day: 'numeric' })}
                 {isOverdue && <span className="ml-1 text-[10px] uppercase bg-red-500 text-white px-1 rounded">!</span>}
              </span>
          </div>
      </div>

      {/* Priority (Column 11 - Desktop only) */}
      <div className="hidden md:flex col-span-1 items-center">
           <PriorityBadge priority={task.priority} />
      </div>

      {/* Status & Actions (Column 12) */}
      <div className="col-span-6 md:col-span-1 flex items-center justify-between md:justify-end gap-2 pl-9 md:pl-0 mt-2 md:mt-0">
           <div className="relative group/status">
               <select
                   value={task.status}
                   onChange={handleStatusChange}
                   disabled={!canEdit}
                   className={`appearance-none pl-2 pr-6 py-1 text-xs font-semibold rounded-full cursor-pointer focus:outline-none border transition-all ${statusConfig[task.status]}`}
                   onClick={e => e.stopPropagation()}
               >
                   {Object.values(Status).map(s => <option key={s} value={s}>{statusText[s]}</option>)}
               </select>
           </div>

           {/* Hover Actions (Desktop) */}
           <div className="hidden md:flex items-center opacity-0 group-hover:opacity-100 transition-opacity gap-1">
               {canEdit && (
                   <button 
                       onClick={(e) => { e.stopPropagation(); setSelectedTaskId(task.id); }}
                       className="p-1 text-text-secondary hover:text-primary hover:bg-primary/10 rounded"
                   >
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                   </button>
               )}
               {canDelete && (
                   <button 
                       onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                       className="p-1 text-text-secondary hover:text-red-500 hover:bg-red-500/10 rounded"
                   >
                       <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                   </button>
               )}
           </div>
      </div>
    </div>
  );
};

export default TaskRow;

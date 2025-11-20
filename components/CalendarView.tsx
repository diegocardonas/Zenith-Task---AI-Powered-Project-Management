
import React, { useState, useMemo } from 'react';
import { Task, Priority, User, Role, Permission, Status } from '../types';
import { useTranslation } from '../i18n';
import { useAppContext } from '../contexts/AppContext';
import AvatarWithStatus from './AvatarWithStatus';

const PRIORITY_STYLES: { [key in Priority]: string } = {
    [Priority.High]: 'border-l-red-500 bg-red-500/10 text-red-200',
    [Priority.Medium]: 'border-l-amber-500 bg-amber-500/10 text-amber-200',
    [Priority.Low]: 'border-l-emerald-500 bg-emerald-500/10 text-emerald-200',
};

const TaskChip: React.FC<{ 
    task: Task; 
    user?: User; 
    onClick: () => void;
    onDragStart?: (e: React.DragEvent, taskId: string) => void;
    draggable: boolean;
}> = ({ task, user, onClick, onDragStart, draggable }) => {
    const isDone = task.status === Status.Done;
    
    return (
        <div
            draggable={draggable}
            onDragStart={(e) => onDragStart && onDragStart(e, task.id)}
            onClick={(e) => { e.stopPropagation(); onClick(); }}
            className={`
                group relative flex items-center gap-2 p-1.5 mb-1 rounded-md text-[11px] cursor-pointer 
                transition-all duration-200 border-l-2 border border-transparent hover:border-white/10 shadow-sm
                ${PRIORITY_STYLES[task.priority]}
                ${isDone ? 'opacity-50 line-through grayscale bg-secondary/20' : 'hover:scale-[1.02] hover:shadow-md'}
                ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}
            `}
        >
            <span className="truncate font-medium flex-grow">{task.title}</span>
            {user && !isDone && (
                <div className="flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity">
                    <AvatarWithStatus user={user} className="w-4 h-4" />
                </div>
            )}
        </div>
    );
};

const DayTasksModal: React.FC<{
  day: Date;
  tasks: Task[];
  users: User[];
  onClose: () => void;
  onSelectTask: (task: Task) => void;
}> = ({ day, tasks, users, onClose, onSelectTask }) => {
    const { i18n, t } = useTranslation();
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 animate-fadeIn" onClick={onClose}>
            <div className="bg-[#1e293b] rounded-2xl shadow-2xl border border-white/10 w-full max-w-md max-h-[80vh] flex flex-col animate-scaleIn overflow-hidden" onClick={e => e.stopPropagation()}>
                <header className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-primary uppercase tracking-wider">{t('common.today')}</span>
                        <h3 className="text-xl font-bold text-white">{day.toLocaleDateString(i18n.language, { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-text-secondary hover:text-white transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </header>
                <main className="p-4 overflow-y-auto space-y-2 custom-scrollbar">
                    {tasks.sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).map(task => (
                        <TaskChip 
                            key={task.id} 
                            task={task} 
                            user={users.find(u => u.id === task.assigneeId)}
                            onClick={() => { onSelectTask(task); onClose(); }} 
                            draggable={false}
                        />
                    ))}
                </main>
            </div>
        </div>
    );
};

interface CalendarViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  onUpdateTask: (task: Task) => void;
  onAddTaskForDate: (date: Date) => void;
  currentUser: User;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ tasks, onSelectTask, onUpdateTask, onAddTaskForDate, currentUser }) => {
    const { t, i18n } = useTranslation();
    const { permissions, state } = useAppContext();
    const { users } = state;
    
    const [currentDate, setCurrentDate] = useState(new Date());
    const [modalData, setModalData] = useState<{ day: Date; tasks: Task[] } | null>(null);
    const [filterMode, setFilterMode] = useState<'all' | 'mine'>('all');
    const [dragOverDate, setDragOverDate] = useState<string | null>(null);
    
    const today = new Date();
    const canCreateTasks = permissions.has(Permission.CREATE_TASKS);
    const canEditTasks = permissions.has(Permission.EDIT_TASKS);
    const canDrag = permissions.has(Permission.DRAG_AND_DROP);

    // Calendar Logic
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const daysInMonth = useMemo(() => {
        const days = [];
        const startingDay = firstDayOfMonth.getDay(); // 0 for Sunday
        const numDays = lastDayOfMonth.getDate();

        for (let i = 0; i < startingDay; i++) days.push(null);
        for (let i = 1; i <= numDays; i++) days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
        return days;
    }, [currentDate]);

    const filteredTasks = useMemo(() => {
        return filterMode === 'mine' 
            ? tasks.filter(t => t.assigneeId === currentUser.id)
            : tasks;
    }, [tasks, filterMode, currentUser.id]);

    const tasksByDate = useMemo(() => {
        const map = new Map<string, Task[]>();
        filteredTasks.forEach(task => {
            if (task.dueDate) {
                // Ensure we are comparing local dates correctly
                const [year, month, day] = task.dueDate.split('-').map(Number);
                // Create date object for comparison keys (using local parts to avoid timezone shifts on string generation)
                const dateKey = `${year}-${month - 1}-${day}`; 
                if (!map.has(dateKey)) map.set(dateKey, []);
                map.get(dateKey)!.push(task);
            }
        });
        return map;
    }, [filteredTasks]);

    // Navigation
    const goToPreviousMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    const goToNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    const isSameDay = (d1: Date, d2: Date) => d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
    
    // Drag & Drop Handlers
    const handleDragStart = (e: React.DragEvent, taskId: string) => {
        if (!canDrag) return;
        e.dataTransfer.setData('taskId', taskId);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent, date: Date) => {
        if (!canDrag) return;
        e.preventDefault();
        const dateKey = date.toDateString();
        if (dragOverDate !== dateKey) setDragOverDate(dateKey);
    };

    const handleDrop = (e: React.DragEvent, targetDate: Date) => {
        e.preventDefault();
        setDragOverDate(null);
        const taskId = e.dataTransfer.getData('taskId');
        const task = tasks.find(t => t.id === taskId);
        
        if (task) {
            // Create a date string in YYYY-MM-DD format using local time
            const year = targetDate.getFullYear();
            const month = String(targetDate.getMonth() + 1).padStart(2, '0');
            const day = String(targetDate.getDate()).padStart(2, '0');
            const newDateStr = `${year}-${month}-${day}`;

            if (task.dueDate !== newDateStr) {
                onUpdateTask({ ...task, dueDate: newDateStr });
            }
        }
    };

    const weekdays = [t('weekdays.sun'), t('weekdays.mon'), t('weekdays.tue'), t('weekdays.wed'), t('weekdays.thu'), t('weekdays.fri'), t('weekdays.sat')];

    return (
        <div className="bg-surface rounded-xl h-full flex flex-col overflow-hidden border border-white/5 shadow-xl">
            <header className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-black/10">
                
                {/* Navigation & Title */}
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                    <div className="flex items-center bg-secondary/50 rounded-lg p-0.5 border border-white/5">
                        <button onClick={goToPreviousMonth} className="p-1.5 rounded-md hover:bg-white/10 text-text-secondary hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                        </button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-xs font-bold text-text-primary uppercase tracking-wide hover:bg-white/5 rounded-md transition-colors">{t('common.today')}</button>
                        <button onClick={goToNextMonth} className="p-1.5 rounded-md hover:bg-white/10 text-text-secondary hover:text-white transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                        </button>
                    </div>
                    <h2 className="text-xl font-bold text-text-primary capitalize">
                        {currentDate.toLocaleString(i18n.language, { month: 'long', year: 'numeric' })}
                    </h2>
                </div>

                {/* Filter Toggle */}
                <div className="flex items-center bg-secondary/50 rounded-lg p-1 border border-white/5">
                    <button 
                        onClick={() => setFilterMode('all')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterMode === 'all' ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                        {t('modals.allTasks')}
                    </button>
                    <button 
                        onClick={() => setFilterMode('mine')}
                        className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filterMode === 'mine' ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:text-text-primary'}`}
                    >
                        {t('sidebar.myTasks')}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-7 flex-shrink-0 bg-secondary/30 border-b border-white/5">
                {weekdays.map(day => (
                    <div key={day} className="text-center py-3 text-[10px] font-bold uppercase text-text-secondary/70 tracking-widest">{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 grid-rows-6 flex-grow overflow-y-auto bg-[#0f172a]/20">
                {daysInMonth.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`} className="border-r border-b border-white/5 bg-white/[0.01]"></div>;
                    
                    const dateKey = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
                    const dayTasks = tasksByDate.get(dateKey) || [];
                    const isToday = isSameDay(day, today);
                    const isDragOver = dragOverDate === day.toDateString();
                    const MAX_TASKS_VISIBLE = 3;

                    return (
                        <div 
                            key={index} 
                            className={`
                                border-r border-b border-white/5 p-2 flex flex-col group relative min-h-[100px] transition-colors duration-200
                                ${isToday ? 'bg-primary/5' : ''}
                                ${isDragOver ? 'bg-primary/10 ring-inset ring-2 ring-primary' : 'hover:bg-white/[0.02]'}
                            `}
                            onDragOver={(e) => handleDragOver(e, day)}
                            onDragLeave={() => setDragOverDate(null)}
                            onDrop={(e) => handleDrop(e, day)}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <span className={`
                                    text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full
                                    ${isToday ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-text-secondary group-hover:text-white'}
                                `}>
                                    {day.getDate()}
                                </span>
                                {canCreateTasks && (
                                    <button 
                                        onClick={() => onAddTaskForDate(day)} 
                                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 text-text-secondary hover:text-primary transition-all transform hover:scale-110"
                                        title={t('tooltips.addTaskForDate', { date: day.toLocaleDateString()})}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
                                    </button>
                                )}
                            </div>
                            
                            <div className="flex-grow space-y-1 overflow-hidden">
                                {dayTasks.slice(0, MAX_TASKS_VISIBLE).map(task => (
                                    <TaskChip 
                                        key={task.id} 
                                        task={task} 
                                        user={users.find(u => u.id === task.assigneeId)}
                                        onClick={() => onSelectTask(task)}
                                        onDragStart={handleDragStart}
                                        draggable={canDrag && canEditTasks}
                                    />
                                ))}
                                {dayTasks.length > MAX_TASKS_VISIBLE && (
                                    <button 
                                        onClick={() => setModalData({ day, tasks: dayTasks })} 
                                        className="w-full text-center text-[10px] py-1 font-medium text-text-secondary hover:text-white hover:bg-white/5 rounded transition-colors"
                                    >
                                        {t('common.more', { count: dayTasks.length - MAX_TASKS_VISIBLE })}
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {modalData && (
                <DayTasksModal
                    day={modalData.day}
                    tasks={modalData.tasks}
                    users={users}
                    onClose={() => setModalData(null)}
                    onSelectTask={onSelectTask}
                />
            )}
        </div>
    );
};


import React, { useMemo } from 'react';
import { Task, Priority, User } from '../types';
import { useTranslation } from '../i18n';
import AvatarWithStatus from './AvatarWithStatus';

interface EisenhowerViewProps {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  users: User[];
}

const Quadrant: React.FC<{ title: string; tasks: Task[]; colorClass: string; onSelectTask: (task: Task) => void; users: User[] }> = ({ title, tasks, colorClass, onSelectTask, users }) => {
    const { t } = useTranslation();
    return (
        <div className={`bg-surface rounded-xl border border-white/5 flex flex-col h-full overflow-hidden ${colorClass}`}>
            <div className="p-4 border-b border-white/5 backdrop-blur-sm bg-black/10 flex justify-between items-center">
                <h3 className="font-bold text-text-primary">{title}</h3>
                <span className="bg-black/20 text-xs font-bold px-2 py-1 rounded-lg">{tasks.length}</span>
            </div>
            <div className="flex-grow p-4 overflow-y-auto space-y-3 custom-scrollbar">
                {tasks.length > 0 ? (
                    tasks.map(task => {
                        const user = users.find(u => u.id === task.assigneeId);
                        return (
                            <button 
                                key={task.id} 
                                onClick={() => onSelectTask(task)}
                                className="w-full text-left bg-black/20 hover:bg-black/30 p-3 rounded-lg transition-all border border-white/5 group"
                            >
                                <div className="flex justify-between items-start gap-2 mb-2">
                                    <span className="font-semibold text-sm line-clamp-2">{task.title}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs text-text-secondary/80">
                                    <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No Date'}</span>
                                    {user && <AvatarWithStatus user={user} className="w-5 h-5" />}
                                </div>
                            </button>
                        )
                    })
                ) : (
                     <div className="flex flex-col items-center justify-center h-32 text-text-secondary/40 italic text-sm">
                         {t('eisenhower.noTasks')}
                     </div>
                )}
            </div>
        </div>
    );
}

const EisenhowerView: React.FC<EisenhowerViewProps> = ({ tasks, onSelectTask, users }) => {
    const { t } = useTranslation();

    const isUrgent = (task: Task) => {
        if (!task.dueDate) return false;
        const today = new Date();
        today.setHours(0,0,0,0);
        const due = new Date(task.dueDate);
        due.setHours(0,0,0,0);
        
        // Urgent if due today or in the past, or within next 2 days
        const diffTime = due.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 2;
    };

    const isImportant = (task: Task) => {
        return task.priority === Priority.High;
    };

    const quadrants = useMemo(() => {
        const q1: Task[] = []; // Urgent & Important
        const q2: Task[] = []; // Not Urgent & Important
        const q3: Task[] = []; // Urgent & Not Important
        const q4: Task[] = []; // Not Urgent & Not Important

        tasks.forEach(task => {
            const urgent = isUrgent(task);
            const important = isImportant(task);

            if (urgent && important) q1.push(task);
            else if (!urgent && important) q2.push(task);
            else if (urgent && !important) q3.push(task);
            else q4.push(task);
        });

        return { q1, q2, q3, q4 };
    }, [tasks]);

    return (
        <div className="h-full grid grid-cols-1 md:grid-cols-2 grid-rows-2 gap-4 pb-4">
            <Quadrant 
                title={t('eisenhower.urgentImportant')} 
                tasks={quadrants.q1} 
                colorClass="border-l-4 border-l-red-500 bg-gradient-to-br from-red-500/5 to-transparent"
                onSelectTask={onSelectTask}
                users={users}
            />
            <Quadrant 
                title={t('eisenhower.notUrgentImportant')} 
                tasks={quadrants.q2} 
                colorClass="border-l-4 border-l-blue-500 bg-gradient-to-bl from-blue-500/5 to-transparent"
                onSelectTask={onSelectTask}
                users={users}
            />
            <Quadrant 
                title={t('eisenhower.urgentNotImportant')} 
                tasks={quadrants.q3} 
                colorClass="border-l-4 border-l-amber-500 bg-gradient-to-tr from-amber-500/5 to-transparent"
                onSelectTask={onSelectTask}
                users={users}
            />
            <Quadrant 
                title={t('eisenhower.notUrgentNotImportant')} 
                tasks={quadrants.q4} 
                colorClass="border-l-4 border-l-gray-500 bg-gradient-to-tl from-gray-500/5 to-transparent"
                onSelectTask={onSelectTask}
                users={users}
            />
        </div>
    );
};

export default EisenhowerView;

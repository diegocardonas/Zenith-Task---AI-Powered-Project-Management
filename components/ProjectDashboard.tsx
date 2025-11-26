
import React, { useMemo, useState } from 'react';
import { Task, User, Status, Permission } from '../types';
import { useTranslation } from '../i18n';
import { useAppContext } from '../contexts/AppContext';

const TasksByStatusChart: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
    const { t } = useTranslation();
    const STATUS_CONFIG = {
        [Status.Todo]: { label: t('common.todo'), color: 'bg-status-todo' },
        [Status.InProgress]: { label: t('common.inprogress'), color: 'bg-status-inprogress' },
        [Status.Done]: { label: t('common.done'), color: 'bg-status-done' },
    };
    const data = useMemo(() => {
        const counts = { [Status.Todo]: 0, [Status.InProgress]: 0, [Status.Done]: 0 };
        tasks.forEach(t => counts[t.status]++);
        return Object.values(Status).map(s => ({ ...STATUS_CONFIG[s], count: counts[s]}));
    }, [tasks, STATUS_CONFIG]);

    const total = tasks.length;
    if (total === 0) return <p className="text-text-secondary text-sm italic">{t('projectDashboard.noTasksToShow')}</p>;
    
    return (
        <div className="space-y-2">
            {data.map(item => (
                <div key={item.label}>
                    <div className="flex justify-between mb-1 text-sm font-medium text-text-secondary">
                        <span>{item.label}</span>
                        <span>{item.count}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2.5">
                        <div className={`${item.color} h-2.5 rounded-full`} style={{ width: `${(item.count / total) * 100}%` }}></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const TasksByAssigneeChart: React.FC<{ tasks: Task[], users: User[] }> = ({ tasks, users }) => {
    const { t } = useTranslation();
    const data = useMemo(() => {
        const counts: { [key: string]: { user: User | { id: 'unassigned', name: string, avatar: '' }; count: number } } = {};
        
        users.forEach(u => {
            counts[u.id] = { user: u, count: 0 };
        });
        counts['unassigned'] = { user: { id: 'unassigned', name: t('projectDashboard.unassigned'), avatar: '' }, count: 0 };

        tasks.forEach(t => {
            const key = t.assigneeId || 'unassigned';
            if(counts[key]) counts[key].count++;
        });

        return Object.values(counts).filter(d => d.count > 0).sort((a,b) => b.count - a.count);
    }, [tasks, users, t]);

    if (tasks.length === 0) return <p className="text-text-secondary text-sm italic">{t('projectDashboard.noTasksToShow')}</p>;

    return (
        <div className="space-y-3">
            {data.map(item => (
                <div key={item.user.id} className="flex items-center">
                    {item.user.id !== 'unassigned' ? 
                        <img src={item.user.avatar} alt={item.user.name} className="w-8 h-8 rounded-full mr-3" />
                        : <div className="w-8 h-8 rounded-full bg-secondary-focus mr-3"></div>
                    }
                    <span className="text-text-primary font-medium flex-grow">{item.user.name}</span>
                    <span className="text-text-secondary font-semibold">{item.count}</span>
                </div>
            ))}
        </div>
    );
};

interface ProjectDashboardProps {
  tasks: Task[];
}

const ProjectDashboard: React.FC<ProjectDashboardProps> = ({ tasks }) => {
  const { t } = useTranslation();
  const { state } = useAppContext();
  const { users } = state;
    
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-secondary rounded-lg p-6 animate-fadeIn">
        <h2 className="text-xl font-semibold mb-4">{t('projectDashboard.tasksByStatus')}</h2>
        <TasksByStatusChart tasks={tasks} />
      </div>
      <div className="bg-secondary rounded-lg p-6 animate-fadeIn" style={{ animationDelay: '100ms' }}>
        <h2 className="text-xl font-semibold mb-4">{t('projectDashboard.tasksByAssignee')}</h2>
        <TasksByAssigneeChart tasks={tasks} users={users} />
      </div>
    </div>
  );
};

export default ProjectDashboard;
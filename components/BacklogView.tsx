
import React, { useMemo, useState } from 'react';
import { Task, User, Status, Priority, List, TaskType } from '../types';
import AvatarWithStatus from './AvatarWithStatus';
import { useTranslation } from '../i18n';
import { useAppContext } from '../contexts/AppContext';

interface BacklogViewProps {
    tasks: Task[];
    onSelectTask: (task: Task) => void;
    onUpdateTask: (task: Task) => void;
    users: User[];
    lists: List[];
    selectedListId: string | null;
}

const BacklogItem: React.FC<{ task: Task; user?: User; onSelect: () => void; projectKey: string }> = ({ task, user, onSelect, projectKey }) => {
    const { t } = useTranslation();
    
    const TypeIcon = () => {
        const iconClasses = "w-3.5 h-3.5 text-white";
        switch(task.type) {
            case TaskType.Bug: return <div className="bg-red-500 p-0.5 rounded-sm"><svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg></div>;
            case TaskType.Story: return <div className="bg-green-500 p-0.5 rounded-sm"><svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg></div>;
            default: return <div className="bg-blue-500 p-0.5 rounded-sm"><svg className={iconClasses} fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg></div>;
        }
    };

    const PriorityIcon = () => {
        switch(task.priority) {
            case Priority.High: return <svg className="w-3.5 h-3.5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>;
            case Priority.Low: return <svg className="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>;
            default: return <svg className="w-3.5 h-3.5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12h16" /></svg>;
        }
    };

    return (
        <div 
            onClick={onSelect}
            className="flex items-center p-2 hover:bg-white/5 border-b border-white/5 cursor-pointer group bg-secondary/30 last:border-b-0"
        >
            <div className="flex items-center w-24 flex-shrink-0 gap-2">
                <TypeIcon />
                <span className="text-xs font-mono text-text-secondary group-hover:text-primary">{task.issueKey}</span>
            </div>
            <div className="flex-grow min-w-0 px-2">
                <span className={`text-sm text-text-primary truncate block ${task.status === Status.Done ? 'line-through text-text-secondary' : ''}`}>{task.title}</span>
            </div>
            <div className="flex items-center gap-4 px-2 flex-shrink-0">
                <div className="hidden md:block text-[10px] uppercase font-bold text-text-secondary px-2 py-0.5 bg-white/5 rounded">{t(`common.${task.status.replace(/\s+/g, '').toLowerCase()}`)}</div>
                
                {/* Story Points Badge */}
                {task.storyPoints !== undefined && task.storyPoints > 0 && (
                    <div className="bg-white/10 text-text-secondary text-xs font-mono px-2 py-0.5 rounded-full min-w-[24px] text-center">
                        {task.storyPoints}
                    </div>
                )}

                <PriorityIcon />
                {user ? <AvatarWithStatus user={user} className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border border-dashed border-white/20 flex items-center justify-center text-[8px]">?</div>}
            </div>
        </div>
    );
}

const BacklogView: React.FC<BacklogViewProps> = ({ tasks, onSelectTask, onUpdateTask, users, lists, selectedListId }) => {
    const { t } = useTranslation();
    const { actions } = useAppContext();
    
    // In a real Jira app, Sprints would be data entities. Here we simulate:
    // Sprint = In Progress / Done status tasks (Simulating Active Work)
    // Backlog = Todo status tasks (Simulating Backlog)
    const grouped = useMemo(() => {
        const sprint = tasks.filter(t => t.status !== Status.Todo);
        const backlog = tasks.filter(t => t.status === Status.Todo);
        return { sprint, backlog };
    }, [tasks]);

    const projectKey = selectedListId ? lists.find(l => l.id === selectedListId)?.key || 'PROJ' : 'ALL';

    const sprintPoints = useMemo(() => grouped.sprint.reduce((acc, t) => acc + (t.storyPoints || 0), 0), [grouped.sprint]);
    const backlogPoints = useMemo(() => grouped.backlog.reduce((acc, t) => acc + (t.storyPoints || 0), 0), [grouped.backlog]);

    return (
        <div className="h-full flex flex-col gap-6 animate-fadeIn pb-10">
            
            {/* Active Sprint Section */}
            <div className="bg-surface border border-white/10 rounded-lg overflow-hidden">
                <div className="bg-secondary/50 p-3 flex justify-between items-center border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <h3 className="font-bold text-text-primary text-sm">{t('backlog.activeSprint')} 1</h3>
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                            <span>({grouped.sprint.length} {t('backlog.issues').toLowerCase()})</span>
                            <span className="w-1 h-1 rounded-full bg-text-secondary/50"></span>
                            <span>{sprintPoints} {t('common.points')}</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => actions.handleCompleteSprint(selectedListId)}
                        className="px-3 py-1 bg-primary/20 text-primary text-xs font-bold rounded hover:bg-primary/30 transition-colors"
                    >
                        {t('backlog.completeSprint')}
                    </button>
                </div>
                <div className="min-h-[50px]">
                    {grouped.sprint.length > 0 ? (
                        grouped.sprint.map(task => (
                            <BacklogItem 
                                key={task.id} 
                                task={task} 
                                user={users.find(u => u.id === task.assigneeId)} 
                                onSelect={() => onSelectTask(task)}
                                projectKey={projectKey}
                            />
                        ))
                    ) : (
                        <div className="p-8 text-center text-text-secondary italic text-sm border-dashed border-2 border-white/5 m-2 rounded">
                            {t('backlog.dragToSprint')}
                        </div>
                    )}
                </div>
            </div>

            {/* Backlog Section */}
            <div className="bg-surface border border-white/10 rounded-lg overflow-hidden flex-grow">
                <div className="bg-secondary/50 p-3 flex justify-between items-center border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <h3 className="font-bold text-text-primary text-sm">{t('backlog.backlog')}</h3>
                        <div className="flex items-center gap-2 text-xs text-text-secondary">
                            <span>({grouped.backlog.length} {t('backlog.issues').toLowerCase()})</span>
                            <span className="w-1 h-1 rounded-full bg-text-secondary/50"></span>
                            <span>{backlogPoints} {t('common.points')}</span>
                        </div>
                    </div>
                    <button className="px-3 py-1 bg-secondary text-text-primary text-xs font-bold rounded hover:bg-white/10 transition-colors">{t('backlog.createIssue')}</button>
                </div>
                <div className="bg-black/20">
                    {grouped.backlog.map(task => (
                        <BacklogItem 
                            key={task.id} 
                            task={task} 
                            user={users.find(u => u.id === task.assigneeId)} 
                            onSelect={() => onSelectTask(task)}
                            projectKey={projectKey}
                        />
                    ))}
                    {grouped.backlog.length === 0 && (
                        <div className="p-4 text-center text-text-secondary text-sm">
                            No issues in backlog.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BacklogView;

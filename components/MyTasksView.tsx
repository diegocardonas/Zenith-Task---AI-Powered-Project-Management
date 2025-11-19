
import React, { useMemo, useState } from 'react';
import { Task, User, List, Status } from '../types';
import Header from './Header';
import TaskRow from './TaskRow';
import { useAppContext } from '../contexts/AppContext';
import { useTranslation } from '../i18n';

const GreetingHeader: React.FC<{ user: User; taskCount: number }> = ({ user, taskCount }) => {
    const { t } = useTranslation();
    const hour = new Date().getHours();
    let greeting = t('myTasks.goodMorning');
    if (hour >= 12 && hour < 18) greeting = t('myTasks.goodAfternoon');
    if (hour >= 18) greeting = t('myTasks.goodEvening');

    return (
        <div className="mb-8 animate-fadeIn">
            <h1 className="text-3xl font-bold text-text-primary mb-2">{greeting}, {user.name.split(' ')[0]}</h1>
            <p className="text-text-secondary text-lg">
                {taskCount > 0 ? t('myTasks.greetingSubtitle', { count: taskCount }) : t('myTasks.goodJob')}
            </p>
        </div>
    );
};

const StatCard: React.FC<{ label: string; count: number; color: string; icon: React.ReactNode; onClick: () => void; isActive: boolean }> = ({ label, count, color, icon, onClick, isActive }) => (
    <button 
        onClick={onClick}
        className={`bg-surface p-4 rounded-xl border transition-all duration-200 text-left flex items-center justify-between group ${isActive ? `border-${color.split('-')[1]}-500 ring-1 ring-${color.split('-')[1]}-500` : 'border-border hover:border-primary/50'}`}
    >
        <div>
            <div className={`text-sm font-medium text-text-secondary mb-1 group-hover:text-${color.split('-')[1]}-500`}>{label}</div>
            <div className="text-2xl font-bold text-text-primary">{count}</div>
        </div>
        <div className={`p-3 rounded-full bg-${color.split('-')[1]}-500/10 text-${color.split('-')[1]}-500`}>
            {icon}
        </div>
    </button>
);

const MyTasksView: React.FC = () => {
  const { t } = useTranslation();
  const { state, actions } = useAppContext();
  const { tasks: allTasks, lists: allLists, currentUser } = state;
  const [activeTab, setActiveTab] = useState<'today' | 'overdue' | 'upcoming' | 'nodate'>('today');

  if (!currentUser) return null;

  const myTasks = useMemo(() => allTasks.filter(task => task.assigneeId === currentUser.id), [allTasks, currentUser.id]);

  const groupedTasks = useMemo(() => {
      const today = new Date();
      today.setHours(0,0,0,0);
      
      const overdue: Task[] = [];
      const dueToday: Task[] = [];
      const upcoming: Task[] = [];
      const noDate: Task[] = [];
      const completed: Task[] = [];

      myTasks.forEach(task => {
          if (task.status === Status.Done) {
              completed.push(task);
              return;
          }

          if (!task.dueDate) {
              noDate.push(task);
              return;
          }

          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0,0,0,0);

          if (dueDate < today) {
              overdue.push(task);
          } else if (dueDate.getTime() === today.getTime()) {
              dueToday.push(task);
          } else {
              upcoming.push(task);
          }
      });

      return { overdue, dueToday, upcoming, noDate, completed };
  }, [myTasks]);

  const activeTasksCount = groupedTasks.overdue.length + groupedTasks.dueToday.length + groupedTasks.upcoming.length + groupedTasks.noDate.length;

  const renderTaskList = (tasks: Task[], emptyMessage: string) => {
      if (tasks.length === 0) {
          return (
              <div className="flex flex-col items-center justify-center py-12 text-text-secondary animate-fadeIn">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                  <p>{emptyMessage}</p>
              </div>
          );
      }
      return (
          <div className="bg-surface rounded-lg shadow-sm border border-border overflow-hidden animate-fadeIn">
             <div className="divide-y divide-border">
                {tasks.map((task, index) => (
                    <div key={task.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fadeIn">
                        <TaskRow task={task} />
                    </div>
                ))}
             </div>
          </div>
      );
  };

  return (
    <main className="flex-grow flex flex-col h-full overflow-y-auto bg-background">
      <div className="max-w-5xl mx-auto w-full p-6 sm:p-8">
          <GreetingHeader user={currentUser} taskCount={groupedTasks.dueToday.length} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <StatCard 
                label={t('myTasks.overdue')} 
                count={groupedTasks.overdue.length} 
                color="text-red-500" 
                isActive={activeTab === 'overdue'}
                onClick={() => setActiveTab('overdue')}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
              />
              <StatCard 
                label={t('myTasks.dueToday')} 
                count={groupedTasks.dueToday.length} 
                color="text-blue-500" 
                isActive={activeTab === 'today'}
                onClick={() => setActiveTab('today')}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
              />
              <StatCard 
                label={t('myTasks.upcoming')} 
                count={groupedTasks.upcoming.length} 
                color="text-gray-500" 
                isActive={activeTab === 'upcoming'}
                onClick={() => setActiveTab('upcoming')}
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
              />
          </div>

          <div className="mb-4 flex gap-4 border-b border-border overflow-x-auto no-scrollbar">
             <button onClick={() => setActiveTab('today')} className={`pb-3 px-1 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'today' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                 {t('myTasks.dueToday')}
                 {activeTab === 'today' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
             </button>
             <button onClick={() => setActiveTab('overdue')} className={`pb-3 px-1 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'overdue' ? 'text-red-500' : 'text-text-secondary hover:text-text-primary'}`}>
                 {t('myTasks.overdue')}
                 {activeTab === 'overdue' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 rounded-t-full"></div>}
             </button>
             <button onClick={() => setActiveTab('upcoming')} className={`pb-3 px-1 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'upcoming' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                 {t('myTasks.upcoming')}
                 {activeTab === 'upcoming' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
             </button>
             <button onClick={() => setActiveTab('nodate')} className={`pb-3 px-1 text-sm font-medium transition-colors relative whitespace-nowrap ${activeTab === 'nodate' ? 'text-primary' : 'text-text-secondary hover:text-text-primary'}`}>
                 {t('myTasks.noDueDate')}
                 {activeTab === 'nodate' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>}
             </button>
          </div>

          <div className="min-h-[300px]">
              {activeTab === 'today' && renderTaskList(groupedTasks.dueToday, t('myTasks.goodJob'))}
              {activeTab === 'overdue' && renderTaskList(groupedTasks.overdue, t('myTasks.noTasks'))}
              {activeTab === 'upcoming' && renderTaskList(groupedTasks.upcoming, t('myTasks.noTasks'))}
              {activeTab === 'nodate' && renderTaskList(groupedTasks.noDate, t('myTasks.noTasks'))}
          </div>
          
          {groupedTasks.completed.length > 0 && (
              <div className="mt-12 opacity-60 hover:opacity-100 transition-opacity">
                  <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">{t('myTasks.completedRecently')}</h3>
                  <div className="bg-surface/50 rounded-lg border border-border overflow-hidden">
                    <div className="divide-y divide-border">
                        {groupedTasks.completed.slice(0, 5).map(task => (
                            <TaskRow key={task.id} task={task} />
                        ))}
                    </div>
                  </div>
              </div>
          )}
      </div>
    </main>
  );
};

export default MyTasksView;

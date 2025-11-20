
import React, { useState, useRef, useEffect } from 'react';
import { User, List, Role, Task, Notification, Permission, UserStatus } from '../types';
import GlobalSearch from './GlobalSearch';
import NotificationsPanel from './NotificationsPanel';
import AvatarWithStatus from './AvatarWithStatus';
import { useAppContext } from '../contexts/AppContext';
import { useTranslation } from '../i18n';

interface HeaderProps {
    title: string;
}

const ProjectActionsMenu: React.FC<{
    list: List;
    onEdit: () => void;
    onDelete: () => void;
    onGenerateSummary: () => void;
}> = ({ onEdit, onDelete, onGenerateSummary }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsOpen(p => !p)} className="p-1.5 rounded-full hover:bg-secondary-focus">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-surface rounded-lg shadow-lg border border-border z-50 animate-fadeIn p-1">
                    <button onClick={() => { onGenerateSummary(); setIsOpen(false); }} className="w-full text-left p-2 rounded-md hover:bg-secondary-focus flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        {t('header.aiSummary')}
                    </button>
                    <div className="my-1 h-px bg-border"></div>
                    <button onClick={() => { onEdit(); setIsOpen(false); }} className="w-full text-left p-2 rounded-md hover:bg-secondary-focus flex items-center text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                        {t('header.editProject')}
                    </button>
                    <button onClick={() => { onDelete(); setIsOpen(false); }} className="w-full text-left p-2 rounded-md hover:bg-secondary-focus flex items-center text-sm text-red-400 hover:text-red-300">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" /></svg>
                        {t('header.deleteProject')}
                    </button>
                </div>
            )}
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({ title }) => {
    const { t } = useTranslation();
    const { state, actions, permissions } = useAppContext();
    const { 
        isSidebarOpen, 
        currentUser, 
        tasks: allTasks, 
        lists: allLists, 
        users: allUsers, 
        notifications,
        selectedList,
        chatChannels
    } = state;

    const {
        setIsSidebarOpen,
        setEditingUserId,
        setSelectedTaskId,
        setSelectedWorkspaceId,
        setSelectedListId,
        setActiveView,
        setNotifications,
        handleNotificationClick,
        setListToEdit,
        setIsProjectModalOpen,
        handleDeleteList,
        handleGenerateSummary,
        setIsChatOpen,
        handleUpdateUserStatus,
        handleLogout,
        setIsSettingsModalOpen,
        setIsAdminPanelOpen
    } = actions;
    
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const notificationsPanelRef = useRef<HTMLDivElement>(null);

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsPanelRef.current && !notificationsPanelRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    const onToggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const onSelectTask = (task: Task) => setSelectedTaskId(task.id);
    const onNavigateToList = (listId: string) => {
        const list = allLists.find(l => l.id === listId);
        if(list) {
            setSelectedWorkspaceId(list.workspaceId);
            setSelectedListId(list.id);
            setActiveView('list');
        }
    };
    const setEditingUser = (user: User | null) => setEditingUserId(user ? user.id : null);

    const unreadCount = notifications.filter(n => !n.read).length;
    const unreadChatCount = chatChannels.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

    const statusOptions: { status: UserStatus; label: string; color: string }[] = [
        { status: UserStatus.Online, label: t('common.online'), color: 'bg-green-500' },
        { status: UserStatus.Away, label: t('common.away'), color: 'bg-yellow-500' },
        { status: UserStatus.Busy, label: t('common.busy'), color: 'bg-red-500' },
        { status: UserStatus.Offline, label: t('common.offline'), color: 'bg-gray-500' },
    ];

    return (
        <header className="flex-shrink-0 flex items-center justify-between p-3 sm:p-6 border-b border-border bg-surface/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-2 min-w-0 overflow-hidden">
                <button onClick={onToggleSidebar} className="p-1 text-text-secondary hover:text-text-primary flex-shrink-0" aria-label={t('header.openSidebar')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                <h1 className="text-lg sm:text-2xl font-bold text-text-primary truncate">{title}</h1>
                {selectedList && permissions.has(Permission.MANAGE_WORKSPACES_AND_PROJECTS) && (
                    <ProjectActionsMenu
                        list={selectedList}
                        onEdit={() => { setListToEdit(selectedList); setIsProjectModalOpen(true); }}
                        onDelete={() => handleDeleteList(selectedList.id)}
                        onGenerateSummary={handleGenerateSummary}
                    />
                )}
            </div>
            <div className="flex items-center space-x-1 sm:space-x-4 flex-shrink-0">
                <GlobalSearch 
                    allTasks={allTasks}
                    allLists={allLists}
                    allUsers={allUsers}
                    onSelectTask={onSelectTask}
                    onSelectList={onNavigateToList}
                    onSelectUser={setEditingUser}
                />

                <button 
                    onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
                    className="flex-shrink-0 p-2 rounded-full hover:bg-secondary-focus text-text-secondary hover:text-text-primary transition-colors hidden sm:block"
                    aria-label={t('header.commandPaletteTitle')}
                    title={t('header.commandPaletteTitle')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                </button>
                
                {/* Chat Shortcut Button */}
                <button
                    onClick={() => setIsChatOpen(true)}
                    className="relative flex-shrink-0 p-2 rounded-full hover:bg-secondary-focus text-text-secondary hover:text-text-primary transition-colors"
                    title={t('chat.teamChat')}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {unreadChatCount > 0 && <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-primary border-2 border-surface"></span>}
                </button>

                <div ref={notificationsPanelRef} className="relative">
                    {isNotificationsOpen && (
                        <NotificationsPanel
                            notifications={notifications}
                            setNotifications={setNotifications}
                            onClose={() => setIsNotificationsOpen(false)}
                            onNotificationClick={handleNotificationClick}
                        />
                    )}
                    <button 
                        onClick={() => setIsNotificationsOpen(p => !p)} 
                        className="relative flex-shrink-0 p-2 rounded-full hover:bg-secondary-focus text-text-secondary hover:text-text-primary transition-colors"
                        aria-label={t('header.toggleNotifications')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-surface"></span>}
                    </button>
                </div>

                {currentUser && (
                    <div className="relative" ref={userMenuRef}>
                        <button 
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className={`flex items-center gap-3 p-1.5 rounded-xl transition-all duration-200 border ${isUserMenuOpen ? 'bg-secondary-focus border-primary/30 ring-2 ring-primary/20' : 'hover:bg-secondary-focus border-transparent'}`}
                            aria-label={t('header.openUserProfile')}
                        >
                            <div className="hidden sm:flex flex-col items-end mr-1">
                                <span className="text-sm font-semibold text-text-primary leading-none">{currentUser.name}</span>
                                <span className="text-[10px] text-text-secondary uppercase tracking-wider font-medium mt-0.5">{t(`common.${currentUser.role.toLowerCase()}`)}</span>
                            </div>
                            <AvatarWithStatus user={currentUser} className="w-8 h-8 sm:w-9 sm:h-9" />
                            <svg className={`w-4 h-4 text-text-secondary transition-transform duration-200 hidden sm:block ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {isUserMenuOpen && (
                            <div className="absolute top-full right-0 mt-2 w-72 bg-surface rounded-xl shadow-2xl border border-white/10 z-50 animate-scaleIn origin-top-right overflow-hidden backdrop-blur-xl">
                                <div className="p-4 border-b border-white/10 bg-secondary/30">
                                    <div className="flex items-center gap-3">
                                        <AvatarWithStatus user={currentUser} className="w-12 h-12" />
                                        <div className="min-w-0">
                                            <p className="font-bold text-text-primary truncate">{currentUser.name}</p>
                                            <p className="text-xs text-text-secondary truncate">{currentUser.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-2">
                                    <div className="mb-2 px-2">
                                        <p className="text-[10px] font-bold text-text-secondary uppercase tracking-wider mb-1">{t('sidebar.setStatus')}</p>
                                        <div className="grid grid-cols-2 gap-1">
                                            {statusOptions.map(({ status, label, color }) => (
                                                <button
                                                    key={status}
                                                    onClick={() => { handleUpdateUserStatus(currentUser.id, status); setIsUserMenuOpen(false); }}
                                                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${currentUser.status === status ? 'bg-white/10 text-white font-medium' : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
                                                >
                                                    <span className={`w-2 h-2 rounded-full ${color}`}></span>
                                                    {label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    <div className="h-px bg-white/10 my-1"></div>

                                    <button 
                                        onClick={() => { setEditingUserId(currentUser.id); setIsUserMenuOpen(false); }}
                                        className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/5 flex items-center gap-3 text-sm text-text-secondary hover:text-white transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        {t('sidebar.viewProfile')}
                                    </button>
                                    
                                    <button 
                                        onClick={() => { setIsSettingsModalOpen(true); setIsUserMenuOpen(false); }}
                                        className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/5 flex items-center gap-3 text-sm text-text-secondary hover:text-white transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                        {t('sidebar.settings')}
                                    </button>

                                    {permissions.has(Permission.MANAGE_APP) && (
                                        <button 
                                            onClick={() => { setIsAdminPanelOpen(true); setIsUserMenuOpen(false); }}
                                            className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-white/5 flex items-center gap-3 text-sm text-text-secondary hover:text-white transition-colors"
                                        >
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                                            {t('header.appAdmin')}
                                        </button>
                                    )}
                                </div>

                                <div className="p-2 border-t border-white/10 bg-secondary/20">
                                    <button 
                                        onClick={() => { handleLogout(); setIsUserMenuOpen(false); }}
                                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 flex items-center gap-3 text-sm transition-colors"
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                        {t('sidebar.logout')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}

export default Header;

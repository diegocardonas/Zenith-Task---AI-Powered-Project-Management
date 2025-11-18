import React, { useMemo, useState } from 'react';
import { User, Role, Permission } from '../../types';
import Header from '../Header';
import AvatarWithStatus from '../AvatarWithStatus';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from '../../i18n';

const RoleDescription: React.FC<{ role: Role, description: string }> = ({ role, description }) => {
    const { t } = useTranslation();
    const roleConfig = {
        [Role.Admin]: { color: 'text-red-400', name: t('common.admin') },
        [Role.Member]: { color: 'text-blue-400', name: t('common.member') },
        [Role.Viewer]: { color: 'text-yellow-400', name: t('common.viewer') },
        [Role.Guest]: { color: 'text-gray-400', name: t('common.guest') },
    };

    return (
        <div>
            <h4 className={`font-semibold ${roleConfig[role].color}`}>{roleConfig[role].name}</h4>
            <p className="text-sm text-text-secondary">{description}</p>
        </div>
    );
};

const AppAdminPanel: React.FC = () => {
    const { t } = useTranslation();
    const { state, actions, permissions } = useAppContext();
    const { users, currentUser } = state;
    const { 
        handleUpdateUserRole, 
        handleDeleteUser, 
        handleCreateUser,
        setEditingUserId,
    } = actions;

    const [newUserName, setNewUserName] = useState('');
    const [newUserRole, setNewUserRole] = useState<Role>(Role.Member);

    const adminCount = useMemo(() => users.filter(u => u.role === Role.Admin).length, [users]);

    const handleAddUser = () => {
        if (newUserName.trim() === '') {
            actions.addToast({ message: t('modals.usernameEmptyError'), type: 'error' });
            return;
        }
        handleCreateUser(newUserName.trim(), newUserRole);
        setNewUserName('');
        setNewUserRole(Role.Member);
    };
    
    return (
        <main className="flex-grow flex flex-col h-full overflow-y-auto">
            <Header title={t('header.appAdmin')} />
            <div className="flex-grow p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: User Management */}
                <div className="lg:col-span-2 bg-surface rounded-lg p-6 animate-fadeIn h-fit">
                    <h2 className="text-xl font-semibold mb-4">{t('admin.manageUsers')}</h2>
                    <div className="space-y-4">
                        {users.map(user => {
                            const isLastAdmin = user.role === Role.Admin && adminCount <= 1;
                            return (
                                <div key={user.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-secondary p-3 rounded-lg gap-3">
                                    <div className="flex items-center flex-grow">
                                        <AvatarWithStatus user={user} className="w-10 h-10" />
                                        <div className="ml-4 min-w-0">
                                            <p className="font-semibold text-text-primary truncate">{user.name}</p>
                                            <p className="text-sm text-text-secondary truncate">{user.email}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleUpdateUserRole(user.id, e.target.value as Role)}
                                            disabled={user.id === currentUser!.id || isLastAdmin}
                                            className="bg-surface border border-border rounded-md px-2 py-1 text-sm focus:ring-primary focus:border-primary disabled:opacity-50"
                                            title={isLastAdmin ? t('tooltips.lastAdminRole') : ''}
                                        >
                                            {Object.values(Role).map((role) => <option key={role} value={role}>{t(`common.${role.toLowerCase()}`)}</option>)}
                                        </select>
                                        {user.id !== currentUser!.id && (
                                            <>
                                                <button
                                                    onClick={() => setEditingUserId(user.id)}
                                                    className="p-2 text-text-secondary hover:text-blue-400 rounded-full hover:bg-blue-500/10 transition-colors"
                                                    aria-label={t('tooltips.editUser', { name: user.name })}
                                                    title={t('tooltips.editUser', { name: user.name })}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    disabled={isLastAdmin}
                                                    className="p-2 text-text-secondary hover:text-red-400 rounded-full hover:bg-red-500/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                    title={isLastAdmin ? t('tooltips.lastAdminDelete') : t('tooltips.deleteUser', { name: user.name })}
                                                    aria-label={t('tooltips.deleteUser', { name: user.name })}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                                    </svg>
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Column: Add User & Role Descriptions */}
                <div className="lg:col-span-1 space-y-6 h-fit">
                    <div className="bg-surface rounded-lg p-6 animate-fadeIn">
                        <h2 className="text-xl font-semibold mb-4">{t('modals.addMember')}</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="newUserName" className="text-sm font-medium text-text-secondary">{t('modals.fullName')}</label>
                                <input
                                    id="newUserName"
                                    type="text"
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                    placeholder={t('modals.fullName')}
                                    className="w-full mt-1 p-2 bg-secondary rounded-md border border-border focus:ring-primary focus:border-primary"
                                />
                            </div>
                            <div>
                                <label htmlFor="newUserRole" className="text-sm font-medium text-text-secondary">{t('admin.role')}</label>
                                <select
                                    id="newUserRole"
                                    value={newUserRole}
                                    onChange={(e) => setNewUserRole(e.target.value as Role)}
                                    className="w-full mt-1 bg-secondary border border-border rounded-md p-2 focus:ring-primary focus:border-primary"
                                >
                                    {Object.values(Role).filter(r => r !== Role.Admin).map(role => (
                                        <option key={role} value={role}>{t(`common.${role.toLowerCase()}`)}</option>
                                    ))}
                                </select>
                            </div>
                            <button
                                onClick={handleAddUser}
                                className="w-full px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors duration-200"
                            >
                                {t('modals.addUser')}
                            </button>
                        </div>
                    </div>
                    
                    <div className="bg-surface rounded-lg p-6 animate-fadeIn">
                        <h2 className="text-xl font-semibold mb-4">{t('admin.roleDescriptions')}</h2>
                        <div className="space-y-4">
                            <RoleDescription role={Role.Admin} description={t('admin.adminDescription')} />
                            <RoleDescription role={Role.Member} description={t('admin.memberDescription')} />
                            <RoleDescription role={Role.Viewer} description={t('admin.viewerDescription')} />
                            <RoleDescription role={Role.Guest} description={t('admin.guestDescription')} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default AppAdminPanel;
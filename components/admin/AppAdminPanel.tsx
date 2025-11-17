import React, { useMemo, useState } from 'react';
import { User, Role } from '../../types';
import Header from '../Header';
import AvatarWithStatus from '../AvatarWithStatus';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from '../../i18n';

const AppAdminPanel: React.FC = () => {
    const { t } = useTranslation();
    const { state, actions } = useAppContext();
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
            alert(t('modals.usernameEmptyError'));
            return;
        }
        handleCreateUser(newUserName.trim(), newUserRole);
        setNewUserName('');
        setNewUserRole(Role.Member);
    };
    
    return (
        <main className="flex-grow flex flex-col h-full overflow-y-auto">
            <Header title={t('header.appAdmin')} />
            <div className="flex-grow p-3 sm:p-6 space-y-6">

                {/* Add User Form */}
                 <div className="bg-surface rounded-lg p-6 animate-fadeIn">
                    <h2 className="text-xl font-semibold mb-4">{t('modals.addMember')}</h2>
                     <div className="flex flex-col sm:flex-row gap-2">
                        <input
                        type="text"
                        value={newUserName}
                        onChange={(e) => setNewUserName(e.target.value)}
                        placeholder={t('modals.fullName')}
                        className="flex-grow p-2 bg-secondary rounded-md border border-border focus:ring-primary focus:border-primary"
                        />
                        <select
                            value={newUserRole}
                            onChange={(e) => setNewUserRole(e.target.value as Role)}
                            className="bg-secondary border border-border rounded-md px-3 py-2 focus:ring-primary focus:border-primary"
                        >
                            {Object.values(Role).filter(r => r !== Role.Admin).map(role => (
                                <option key={role} value={role}>{t(`common.${role.toLowerCase()}`)}</option>
                            ))}
                        </select>
                        <button
                        onClick={handleAddUser}
                        className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-focus transition-colors duration-200"
                        >
                        {t('modals.addUser')}
                        </button>
                    </div>
                </div>

                {/* User Management Table */}
                <div className="bg-surface rounded-lg p-6 animate-fadeIn">
                    <h2 className="text-xl font-semibold mb-4">{t('admin.manageUsers')}</h2>
                     <div className="overflow-x-auto">
                        <table className="min-w-full text-sm text-left text-text-secondary">
                          <thead className="text-xs uppercase bg-secondary">
                            <tr>
                              <th scope="col" className="px-6 py-3">{t('admin.user')}</th>
                              <th scope="col" className="px-6 py-3">{t('admin.email')}</th>
                              <th scope="col" className="px-6 py-3">{t('admin.role')}</th>
                              <th scope="col" className="px-6 py-3 text-right">{t('admin.actions')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {users.map(user => {
                              const isLastAdmin = user.role === Role.Admin && adminCount <= 1;
                              return (
                                <tr key={user.id} className="bg-surface border-b border-border">
                                  <th scope="row" className="px-6 py-4 font-medium text-text-primary whitespace-nowrap flex items-center">
                                      <AvatarWithStatus user={user} className="w-8 h-8 mr-3" />
                                      {user.name}
                                  </th>
                                  <td className="px-6 py-4">{user.email}</td>
                                  <td className="px-6 py-4">
                                       <select
                                          value={user.role}
                                          onChange={(e) => handleUpdateUserRole(user.id, e.target.value as Role)}
                                          disabled={user.id === currentUser!.id || isLastAdmin}
                                          className="bg-secondary border border-transparent hover:border-border rounded-md px-2 py-1 text-sm focus:ring-primary focus:border-primary disabled:opacity-50"
                                          title={isLastAdmin ? t('tooltips.lastAdminRole') : ''}
                                      >
                                          {Object.values(Role).map((role) => <option key={role} value={role}>{t(`common.${role.toLowerCase()}`)}</option>)}
                                      </select>
                                  </td>
                                  <td className="px-6 py-4 text-right">
                                       {user.id !== currentUser!.id && (
                                          <div className="flex items-center justify-end gap-1">
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
                                          </div>
                                       )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default AppAdminPanel;

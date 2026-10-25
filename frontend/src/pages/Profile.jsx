import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { User, Mail, Briefcase, Camera, Save, Shield } from 'lucide-react';

export const Profile = () => {
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [targetRole, setTargetRole] = useState(user?.targetRole || 'Software Engineer');
  const [profilePic, setProfilePic] = useState(user?.profilePic || '');
  const [loading, setLoading] = useState(false);

  const { addToast } = useToast();

  const avatarOptions = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await updateProfile({ name, targetRole, profilePic });
    setLoading(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 sm:space-y-8 pb-16 min-w-0">
      <div className="glass-card p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
        <div className="flex items-center gap-4 border-b border-gray-100 dark:border-dark-border pb-6">
          <div className="relative shrink-0">
            <img
              src={profilePic || avatarOptions[0]}
              alt="Avatar"
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-brand-purple shadow-md"
            />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white truncate">{user?.name}</h1>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            <span className="inline-block text-[10px] font-bold text-brand-purple bg-brand-purple/10 px-2.5 py-0.5 rounded-full mt-1 uppercase">
              {user?.role || 'Student'} Account
            </span>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-2">
                <User className="w-4 h-4 text-brand-purple" /> Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm text-gray-900 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 mb-1.5 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-brand-purple" /> Target Job Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm text-gray-900 dark:text-white"
                placeholder="e.g. Software Engineer, Full Stack Developer"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 mb-2 flex items-center gap-2">
                <Camera className="w-4 h-4 text-brand-purple" /> Select Profile Avatar
              </label>
              <div className="flex flex-wrap gap-3">
                {avatarOptions.map((url, i) => (
                  <img
                    key={i}
                    src={url}
                    alt={`Avatar ${i}`}
                    onClick={() => setProfilePic(url)}
                    className={`w-12 h-12 rounded-full object-cover cursor-pointer border-2 transition ${
                      profilePic === url ? 'border-brand-purple scale-110' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gradient w-full sm:w-auto justify-center px-8 py-3.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg"
          >
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving Changes...' : 'Save Profile Changes'}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

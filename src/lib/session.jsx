import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { ACADEMY } from '@/data/academy';

/**
 * Session context.
 *
 * Portal identity comes from the platform's own authentication service. The role a
 * signed-in user receives is resolved from server-verified account attributes only:
 * the platform role (which only the dashboard can grant) and the portal assignment
 * field on the user record, which app users cannot change themselves. The demo
 * accounts below are a review tool offered only to verified administrator accounts.
 */

export const DEMO_ACCOUNTS = [
  { id: 'owner', label: 'Owner', name: ACADEMY.owner, email: ACADEMY.email, home: '/owner', scope: 'All campuses · ownership controls' },
  { id: 'admin', label: 'Administrator', name: 'Nadia Aslam', email: 'nadia.aslam@tipsacademy.edu.pk', home: '/admin', scope: 'Al Mursusb Campus · all modules' },
  { id: 'editor', label: 'Website editor', name: 'Kamran Shah', email: 'kamran.shah@tipsacademy.edu.pk', home: '/admin/pages', scope: 'Website, media and SEO only' },
  { id: 'teacher', label: 'Teacher', name: 'Ayesha Siddiqui', email: 'ayesha.siddiqui@tipsacademy.edu.pk', home: '/teacher', scope: 'Class 9 – 10 · Mathematics' },
  { id: 'student', label: 'Student', name: 'Areeba Khan', email: 'areeba.khan@tipsacademy.edu.pk', home: '/student', scope: 'Class 10 · Section A' },
  { id: 'parent', label: 'Parent', name: 'Khalid Khan', email: 'khalid.khan@gmail.com', home: '/parent', scope: 'Verified guardian of 1 student' },
  { id: 'staff', label: 'Staff', name: 'Imran Yaqoob', email: 'imran.yaqoob@tipsacademy.edu.pk', home: '/admin/payments', scope: 'Finance office · payment verification' },
];

const STORAGE_KEY = 'tips-academy.session';

export const AREA_HOMES = {
  owner: '/owner',
  admin: '/admin',
  editor: '/admin/pages',
  staff: '/admin/payments',
  teacher: '/teacher',
  student: '/student',
  parent: '/parent',
};

export const PORTAL_LOGIN = {
  student: '/login/student',
  teacher: '/login/teacher',
  parent: '/login/parent',
  admin: '/login/admin',
  owner: '/login/admin',
};

/** Inside the administration area these scoped roles see only these nav groups; full administrators see everything. */
export const ADMIN_GROUP_ACCESS = {
  admin: null,
  owner: null,
  editor: ['Website'],
  staff: ['Finance'],
};

/**
 * Resolves a signed-in platform user's portal role from server-verified attributes:
 * - Platform "admin" accounts (granted only from the dashboard) hold the administration area,
 *   optionally narrowed to editor, staff or owner by the office assignment.
 * - Every other account needs an office-assigned portal role of student, teacher or parent.
 */
export function resolvePortalRole(user) {
  if (!user) return null;
  const assigned = user.portal_role || null;
  if (user.role === 'admin') {
    if (assigned === 'owner') return 'owner';
    if (assigned === 'editor') return 'editor';
    if (assigned === 'staff') return 'staff';
    return 'admin';
  }
  return assigned && ['student', 'teacher', 'parent'].includes(assigned) ? assigned : null;
}

/** Maps a portal URL segment to the portal roles allowed to open it. */
export const AREA_ROLES = {
  student: ['student'],
  teacher: ['teacher'],
  parent: ['parent'],
  admin: ['admin', 'editor', 'staff'],
  owner: ['owner'],
};

export function canAccess(area, role) {
  if (!role) return false;
  return (AREA_ROLES[area] || []).includes(role);
}

const SessionContext = createContext(null);

export function SessionProvider({ children }) {
  // undefined = still resolving; null = not signed in; object = platform account.
  const [platformUser, setPlatformUser] = useState(undefined);
  const [reviewRoleId, setReviewRoleId] = useState(() => {
    try {
      return window.localStorage.getItem(STORAGE_KEY) || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    let active = true;
    base44.auth
      .me()
      .then((user) => { if (active) setPlatformUser(user || null); })
      .catch(() => { if (active) setPlatformUser(null); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    try {
      if (reviewRoleId) window.localStorage.setItem(STORAGE_KEY, reviewRoleId);
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable — review identity stays in memory */
    }
  }, [reviewRoleId]);

  const isAdmin = platformUser?.role === 'admin';
  const realRole = useMemo(() => resolvePortalRole(platformUser), [platformUser]);

  const account = useMemo(() => {
    if (platformUser === undefined) return null;
    if (isAdmin) {
      const review = reviewRoleId ? DEMO_ACCOUNTS.find((a) => a.id === reviewRoleId) : null;
      if (review) return { ...review, review: true };
      return {
        id: 'admin',
        label: 'Administrator',
        name: platformUser.full_name || platformUser.email,
        email: platformUser.email,
        home: AREA_HOMES.admin,
        real: true,
      };
    }
    if (realRole) {
      const demo = DEMO_ACCOUNTS.find((a) => a.id === realRole);
      return {
        id: realRole,
        label: demo?.label || realRole,
        name: platformUser.full_name || platformUser.email,
        email: platformUser.email,
        home: AREA_HOMES[realRole],
        real: true,
      };
    }
    return null;
  }, [platformUser, isAdmin, realRole, reviewRoleId]);

  const signIn = useCallback((id) => setReviewRoleId(id), []);
  const signOut = useCallback(() => {
    if (isAdmin) {
      // Administrators return to their own account rather than ending the platform session.
      setReviewRoleId(null);
      return;
    }
    if (platformUser) {
      base44.auth.logout('/');
      return;
    }
    setReviewRoleId(null);
  }, [isAdmin, platformUser]);

  const value = useMemo(
    () => ({
      account,
      role: account?.id || null,
      ready: platformUser !== undefined,
      isAdmin,
      isReview: !!account?.review,
      pendingPortal: !!platformUser && !isAdmin && !realRole,
      platformEmail: platformUser?.email || null,
      signIn,
      signOut,
      switchRole: signIn,
    }),
    [account, platformUser, isAdmin, realRole, signIn, signOut]
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) throw new Error('useSession must be used inside SessionProvider');
  return context;
}
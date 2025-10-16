const ROLE_HIERARCHY = {
  admin: ['member', 'viewer'],
  member: ['viewer'],
  viewer: []
};

/**
 * Vérifie si le rôle d'un utilisateur permet une action donnée.
 * @param {string} userRole - Rôle de l'utilisateur (admin, member, viewer)
 * @param {string[]} allowedRoles - Liste des rôles autorisés
 */
function hasAccess(userRole, allowedRoles) {
  if (allowedRoles.includes(userRole)) return true;

  // Un admin hérite des droits member et viewer, etc.
  const inheritedRoles = ROLE_HIERARCHY[userRole] || [];
  return allowedRoles.some(role => inheritedRoles.includes(role));
}

module.exports = { hasAccess, ROLE_HIERARCHY };

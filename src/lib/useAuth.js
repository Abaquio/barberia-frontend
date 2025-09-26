// frontend/src/lib/useAuth.js
const KEY = "authToken";
const KEY_ROLES = "authRoles";

export function setAuthToken(token, roles=[]) {
  localStorage.setItem(KEY, token);
  localStorage.setItem(KEY_ROLES, JSON.stringify(roles));
}
export function getToken() { return localStorage.getItem(KEY); }
export function getRoles() {
  try { return JSON.parse(localStorage.getItem(KEY_ROLES) || "[]"); }
  catch { return []; }
}
export function isAuthed() { return !!getToken(); }
export function hasRole(roleId) { return getRoles().includes(roleId); }
export function clearAuth() { localStorage.removeItem(KEY); localStorage.removeItem(KEY_ROLES); }

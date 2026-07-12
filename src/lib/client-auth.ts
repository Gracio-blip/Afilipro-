export function getClientAuthHeaders(includeJson = false): Record<string, string> {
  const headers: Record<string, string> = {};

  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }

  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('afilipro_token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
}

export function clearClientSession() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('afilipro_token');
  localStorage.removeItem('afilipro_user');
  localStorage.removeItem('user_name');
  localStorage.removeItem('is_logged_in');
}

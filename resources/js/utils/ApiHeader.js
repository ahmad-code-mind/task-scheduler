export function getAuthToken() {
  return localStorage.getItem("authToken");
}

export function getApiHeader() {
  const token = getAuthToken();
  const headers = {};
  
  headers['Accept'] = 'application/json';
  headers['Content-Type'] = 'application/json';
  headers['Authorization'] = `Bearer ${token}`;

  return headers;
}
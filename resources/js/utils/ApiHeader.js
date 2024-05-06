export function getApiHeader() {
  const headers = {};
  
  headers['Accept'] = 'application/json';
  headers['Content-Type'] = 'application/json';

  return headers;
}
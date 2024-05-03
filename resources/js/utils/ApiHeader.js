export function getApiHeader() {
  headers['Accept'] = 'application/json';
  headers['Content-Type'] = 'application/json';

  return headers;
}
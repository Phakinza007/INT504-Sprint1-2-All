async function apiRequest(url, options) {
  return fetch(url, options);
}

async function getJson(url) {
  const response = await apiRequest(url);
  if (!response.ok) throw new Error(`Request failed: ${response.status}`);
  return response.json();
}

export { apiRequest, getJson };

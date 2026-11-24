import { apiRequest } from "./api.js";

async function getStudentProfile(studentId) {
  const url = `./api/v1/students/${encodeURIComponent(studentId)}`;
  const response = await apiRequest(url);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Profile request failed");
  return response.json();
}

export { getStudentProfile };

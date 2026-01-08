import api from "./axios";

/**
 * Get AI analysis for a project
 * @param {number} projectId - Project ID
 * @returns {Promise<Object>} AI analysis data
 */
export async function getProjectAiAnalysis(projectId) {
  const { data } = await api.get(`/api/ai/projects/${projectId}/analysis`);
  return data;
}

/**
 * Get AI analysis for a specific student in a project
 * @param {number} projectId - Project ID
 * @param {number} userId - Student user ID
 * @returns {Promise<Object>} Student AI analysis data
 */
export async function getStudentAiAnalysis(projectId, userId) {
  const { data } = await api.get(`/api/ai/projects/${projectId}/students/${userId}/analysis`);
  return data;
}




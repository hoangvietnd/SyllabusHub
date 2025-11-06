import api from '../utils/axiosInstance';

/**
 * Fetches a paginated list of subjects.
 * @param {object} params - Query parameters for pagination.
 * @param {number} params.page - The page number to fetch.
 * @param {number} params.limit - The number of items per page.
 * @returns {Promise<object>} A promise that resolves to the paginated list of subjects.
 */
export const listSubjects = async ({ page = 1, limit = 1000 }) => { // Default to a large limit to get all subjects for dropdowns
  const { data } = await api.get('/subjects', { params: { page, limit } });
  return data;
};

/**
 * Fetches a single subject by its ID.
 * @param {string|number} id - The ID of the subject.
 * @returns {Promise<object>} A promise that resolves to the subject data.
 */
export const getSubjectById = async (id) => {
  const { data } = await api.get(`/subjects/${id}`);
  return data;
};

/**
 * Creates a new subject.
 * @param {object} subjectData - The data for the new subject.
 * @param {string} subjectData.name - The name of the subject.
 * @param {string} subjectData.description - The description of the subject.
 * @returns {Promise<object>} A promise that resolves to the newly created subject data.
 */
export const createSubject = async (subjectData) => {
  const { data } = await api.post('/subjects', subjectData);
  return data;
};

/**
 * Updates an existing subject.
 * @param {object} params
 * @param {string|number} params.id - The ID of the subject to update.
 * @param {object} params.subjectData - The updated data for the subject.
 * @returns {Promise<object>} A promise that resolves to the updated subject data.
 */
export const updateSubject = async ({ id, subjectData }) => {
  const { data } = await api.put(`/subjects/${id}`, subjectData);
  return data;
};

/**
 * Deletes a subject by its ID.
 * @param {string|number} id - The ID of the subject to delete.
 * @returns {Promise<void>}
 */
export const deleteSubject = async (id) => {
  const { data } = await api.delete(`/subjects/${id}`);
  return data;
};

import api from '../utils/axiosInstance';

/**
 * Fetches all materials associated with a specific course.
 * @param {string|number} courseId - The ID of the course.
 * @returns {Promise<Array<object>>} A promise that resolves to an array of materials.
 */
export const getMaterialsByCourse = async (courseId) => {
  const { data } = await api.get(`/courses/${courseId}/materials`);
  return data;
};

/**
 * Uploads a new material file and associates it with a course.
 * @param {object} params
 * @param {string|number} params.courseId - The ID of the course to associate the material with.
 * @param {File} params.file - The file to be uploaded.
 * @param {string} params.description - A description for the material.
 * @param {function(number): void} params.onProgress - A callback to track upload progress (0-100).
 * @returns {Promise<object>} A promise that resolves to the newly created material data.
 */
export const uploadMaterial = async ({ courseId, file, description, onProgress }) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('description', description || ''); // Ensure description is not undefined

  const { data } = await api.post(`/courses/${courseId}/materials`, formData, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) {
        onProgress(percentCompleted);
      }
    },
  });

  return data;
};

/**
 * Deletes a material.
 * @param {string|number} materialId - The ID of the material to delete.
 * @returns {Promise<void>}
 */
export const deleteMaterial = async (materialId) => {
  const { data } = await api.delete(`/materials/${materialId}`);
  return data;
};

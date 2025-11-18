import api from '../utils/axiosInstance';

/**
 * Fetches a paginated list of courses from the backend.
 * @param {object} params - Query parameters for pagination and filtering.
 * @param {number} params.page - The page number to fetch (1-indexed).
 * @param {number} params.limit - The number of items per page.
 * @param {string} [params.title] - A search term to filter courses by title.
 * @returns {Promise<object>} A promise that resolves to the paginated list of courses.
 */
export const listCourses = async ({ page = 1, limit = 10, title = '' }) => {
  const params = {
    page: page - 1,
    size: limit,
  };

  if (title) {
    params.title = title.trim();
  }

  const { data } = await api.get('/courses', { params });
  return data;
};

/**
 * Fetches a single course by its ID.
 */
export const getCourseById = async (courseId) => {
  const { data } = await api.get(`/courses/${courseId}`);
  return data;
};

/**
 * Creates a new course.
 */
export const createCourse = async (courseData) => {
  const { data } = await api.post('/courses', courseData);
  return data;
};

/**
 * Updates an existing course.
 */
export const updateCourse = async (courseId, courseData) => {
  const { data } = await api.put(`/courses/${courseId}`, courseData);
  return data;
};

/**
 * Deletes a course by its ID.
 */
export const deleteCourse = async (courseId) => {
  await api.delete(`/courses/${courseId}`);
};

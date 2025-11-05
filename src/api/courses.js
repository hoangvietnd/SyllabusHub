import axiosInstance from '../utils/axiosInstance';

/**
 * Fetches a paginated list of courses from the backend.
 */
export const listCourses = async ({ page = 1, limit = 10 } = {}) => {
  const { data } = await axiosInstance.get('/courses', {
    params: { page: page - 1, size: limit },
  });
  return data;
};

/**
 * Fetches a single course by its ID.
 */
export const getCourseById = async (courseId) => {
  const { data } = await axiosInstance.get(`/courses/${courseId}`);
  return data;
};

/**
 * Creates a new course.
 */
export const createCourse = async (courseData) => {
  const { data } = await axiosInstance.post('/courses', courseData);
  return data;
};

/**
 * Updates an existing course.
 */
export const updateCourse = async (courseId, courseData) => {
  const { data } = await axiosInstance.put(`/courses/${courseId}`, courseData);
  return data;
};

/**
 * Deletes a course by its ID.
 */
export const deleteCourse = async (courseId) => {
  const { data } = await axiosInstance.delete(`/courses/${courseId}`);
  return data; // Or handle empty response if backend returns 204 No Content
};

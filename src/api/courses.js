import { api } from "./client";

export const listCourses = (q = "", page = 0, size = 20) =>
    api.get("/courses", { params: { q, page, size } }).then((r) => r.data);
  
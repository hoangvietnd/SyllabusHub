import { useQuery } from "@tanstack/react-query";
import { listCourses } from "../api/courses";

export default function CourseList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["courses"],
    queryFn: () => listCourses(),
  });

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Đã xảy ra lỗi: {error.message}</div>;
  // Ensure data and data.content are not undefined before mapping
  if (!data || !data.content) return <div>Không có khóa học nào.</div>;


  return (
    <div>
      <h2>Danh sách khóa học</h2>
      <ul>
        {data.content.map((c) => (
          <li key={c.id}>{c.title}</li>
        ))}
      </ul>
    </div>
  );
}

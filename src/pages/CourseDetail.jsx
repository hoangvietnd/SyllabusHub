import * as React from 'react';
import { Box, Typography, Card, CardContent, Chip, Stack } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { listCourses, getCourse } from '../api/courses';

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    let mounted = true;
    if (!id) return;
    // prefer getCourse if backend supports it
    getCourse(id)
      .then((data) => {
        if (!mounted) return;
        setCourse(data);
      })
      .catch(() => {
        // fallback to listing and finding
        listCourses()
          .then((data) => {
            if (!mounted) return;
            const found = Array.isArray(data) ? data.find((c) => String(c.id) === String(id)) : null;
            if (found) setCourse(found);
            else setCourse({ id, name: 'Course ' + id, instructor: 'Unknown', credits: 3, semester: 'TBD', description: 'No description available.' });
          })
          .catch(() => {
            if (!mounted) return;
            setCourse({ id, name: 'Course ' + id, instructor: 'Unknown', credits: 3, semester: 'TBD', description: 'No description available.' });
          });
      });
    return () => (mounted = false);
  }, [id]);

  if (!course) return <Typography>Loading...</Typography>;

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Course Detail
      </Typography>
      <Card sx={{ maxWidth: 800 }}>
        <CardContent>
          <Typography variant="h6">{course.name}</Typography>
          <Typography color="text.secondary">Instructor: {course.instructor || course.teacher}</Typography>
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            <Chip label={`Credits: ${course.credits ?? 3}`} />
            <Chip label={`Semester: ${course.semester ?? 'TBD'}`} />
          </Stack>
          <Typography sx={{ mt: 2 }}>{course.description}</Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

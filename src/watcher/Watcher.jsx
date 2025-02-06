import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ClassList from './ClassList';
import StudentList from './StudentList';
import Monitoring from './Monitoring';

const Watcher = () => {
  return (
    <Routes>
      <Route path="/" element={<ClassList />} />
      <Route path="/class/:classId" element={<StudentList />} />
      <Route path="/student/:studentId" element={<Monitoring />} />
    </Routes>
  );
};

export default Watcher; 
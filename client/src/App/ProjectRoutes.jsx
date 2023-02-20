import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';

import Project from 'Project';
import Authenticate from 'Auth/Authenticate';
import PageError from 'shared/components/PageError';

const ProjectRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/project/" />} />
      <Route path="/project" element={<Navigate to="/project/board/" />} />
      <Route path="/project/*" element={<Project />} />
      <Route path="/authenticate" element={<Authenticate />} />
      <Route element={<PageError />} />
    </Routes>
  </BrowserRouter>
);

export default ProjectRoutes;

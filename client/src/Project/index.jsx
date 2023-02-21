import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import useApi from 'shared/hooks/api';
import { updateArrayItemById } from 'shared/utils/javascript';
import { useQueryParamHelper } from 'shared/hooks/queryParamHelper';
import { PageLoader, PageError, Modal } from 'shared/components';

import NavbarLeft from './NavbarLeft';
import Sidebar from './Sidebar';
import Board from './Board';
import IssueSearch from './IssueSearch';
import IssueCreate from './IssueCreate';
import ProjectSettings from './ProjectSettings';
import { ProjectPage } from './Styles';
import IssueList from './IssueList';

const Project = () => {
  const navigate = useNavigate();

  const issueSearchModalHelpers = useQueryParamHelper('issue-search');
  const issueCreateModalHelpers = useQueryParamHelper('issue-create');

  const [{ data, error, setLocalData }, fetchProject] = useApi.get('/project');

  if (!data) return <PageLoader />;
  if (error) return <PageError />;

  const { project } = data;

  const updateLocalProjectIssues = (issueId, updatedFields) => {
    setLocalData(currentData => ({
      project: {
        ...currentData.project,
        issues: updateArrayItemById(currentData.project.issues, issueId, updatedFields),
      },
    }));
  };

  return (
    <ProjectPage>
      <NavbarLeft
        issueSearchModalOpen={issueSearchModalHelpers.open}
        issueCreateModalOpen={issueCreateModalHelpers.open}
      />

      <Sidebar project={project} />

      {issueSearchModalHelpers.isOpen() && (
        <Modal
          isOpen
          testid="modal:issue-search"
          variant="aside"
          width={600}
          onClose={issueSearchModalHelpers.close}
          renderContent={() => <IssueSearch project={project} />}
        />
      )}

      {issueCreateModalHelpers.isOpen() && (
        <Modal
          isOpen
          testid="modal:issue-create"
          width={800}
          withCloseIcon={false}
          onClose={issueCreateModalHelpers.close}
          renderContent={modal => (
            <IssueCreate
              project={project}
              fetchProject={fetchProject}
              onCreate={() => navigate(-1)}
              modalClose={modal.close}
            />
          )}
        />
      )}

      <Routes>
        <Route
          path="board/*"
          element={
            <Board
              project={project}
              fetchProject={fetchProject}
              updateLocalProjectIssues={updateLocalProjectIssues}
            />
          }
        />

        <Route
          path="settings"
          element={<ProjectSettings project={project} fetchProject={fetchProject} />}
        />

        <Route
          path="list/*"
          element={
            <IssueList
              project={project}
              fetchProject={fetchProject}
              updateLocalProjectIssues={updateLocalProjectIssues}
            />
          }
        />
      </Routes>
    </ProjectPage>
  );
};

export default Project;

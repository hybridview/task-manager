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

  // setLocalData is made available here....
  // fetchProject: Handle to internal useApi func that reloads project data from API and updates state.
  // setLocalData: User defined function that updates current state vars with new values where useApi can merge it back to state.
  const [{ data, error, setLocalData }, fetchProject] = useApi.get('/project');

  if (!data) return <PageLoader />;
  if (error) return <PageError />;

  const { project } = data;

  // When project.issues change, we need to update state so issue change is visible.
  const updateLocalProjectIssues = (issueId, updatedFields) => {
    // ... setLocalData call here will cause mergeState to be called, which updates project state with new issue list.
    setLocalData((currentData) => ({
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
          renderContent={(modal) => (
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

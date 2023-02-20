import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Modal } from 'shared/components';
import IssueDetails from 'Project/Board/IssueDetails';

const IssueModal = ({ projectUsers, fetchProject, updateLocalProjectIssues }) => {
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="issues/:issueId"
        element={
          <Modal
            isOpen
            testid="modal:issue-details"
            width={1040}
            withCloseIcon={false}
            onClose={() => navigate(-1)}
            renderContent={modal => (
              <IssueDetails
                projectUsers={projectUsers}
                fetchProject={fetchProject}
                updateLocalProjectIssues={updateLocalProjectIssues}
                modalClose={modal.close}
              />
            )}
          />
        }
      />
    </Routes>
  );
};

export default IssueModal;

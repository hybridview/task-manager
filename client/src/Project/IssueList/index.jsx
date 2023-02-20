import IssueCard from 'Project/IssueCard';
import React, { Fragment } from 'react';
import IssueModal from 'Project/IssueModal';
import ProjectHeader from 'Project/ProjectHeader';
import { ListContainer } from './styles';

const IssueList = ({ project, fetchProject, updateLocalProjectIssues }) => {
  const issues = project.issues.map(issue => {
    return <IssueCard key={issue.id} issue={issue} projectUsers={project.users} />;
  });

  return (
    <Fragment>
      <ProjectHeader module="Projects" projectTitle={project.name} pageTitle="Issues List" />
      <ListContainer>{issues}</ListContainer>
      <IssueModal
        projectUsers={project.users}
        fetchProject={fetchProject}
        updateLocalProjectIssues={updateLocalProjectIssues}
      />
    </Fragment>
  );
};

export default IssueList;

import IssueCard from 'Project/IssueCard';
import React, { Fragment } from 'react';
import { Breadcrumbs } from 'shared/components';
import { FormHeading } from './styles';

const IssueList = ({ project }) => {
  const issues = project.issues.map(issue => {
    return <IssueCard key={issue.id} issue={issue} projectUsers={project.users} />;
  });

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  };

  return (
    <Fragment>
      <Breadcrumbs items={['Projects', project.name, 'Issue List']} />
      <FormHeading>Issue List</FormHeading>
      <div style={containerStyle}>{issues}</div>
    </Fragment>
  );
};

export default IssueList;

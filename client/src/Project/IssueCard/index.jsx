import React from 'react';
import { IssueTypeIcon, IssuePriorityIcon } from 'shared/components';
import { Issue, Title, Bottom, Assignees, AssigneeAvatar, IssueLink } from './Styles';

function IssueCard({ projectUsers, issue }) {
  const assignees = issue.userIds.map(userId => projectUsers.find(user => user.id === userId));

  return (
    <IssueLink to={`issues/${issue.id}`} data-testid="list-issue">
      <Issue key={issue.id}>
        <Title>{issue.title}</Title>
        <Bottom>
          <div>
            <IssueTypeIcon type={issue.type} />
            <IssuePriorityIcon priority={issue.priority} top={-1} left={4} />
          </div>
          <Assignees>
            {assignees.map(user => (
              <AssigneeAvatar key={user.id} size={24} avatarUrl={user.avatarUrl} name={user.name} />
            ))}
          </Assignees>
        </Bottom>
      </Issue>
    </IssueLink>
  );
}

export default IssueCard;

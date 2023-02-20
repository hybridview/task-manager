import React, { Fragment } from 'react';

import { Breadcrumbs, Button } from 'shared/components';
import { BoardName, Header } from './Styles';

const ProjectHeader = ({ module, projectTitle, pageTitle }) => (
  <Fragment>
    <Breadcrumbs items={[module, projectTitle, pageTitle]} />
    <Header>
      <BoardName>{pageTitle}</BoardName>
      <a href="https://github.com/oldboyxx/jira_clone" target="_blank" rel="noreferrer noopener">
        <Button icon="github">Github Repo</Button>
      </a>
    </Header>
  </Fragment>
);

export default ProjectHeader;

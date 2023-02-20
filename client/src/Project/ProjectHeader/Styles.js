import styled from 'styled-components';
import { font } from 'shared/utils/styles';

export const BoardName = styled.div`
  padding: 6px 0 15px;
  ${font.size(24)}
  ${font.medium}
`;

export const Header = styled.div`
  margin-top: 6px;
  display: flex;
  justify-content: space-between;
`;

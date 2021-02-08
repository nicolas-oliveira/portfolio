import React from 'react';
import Header from '../../components/Header/index';
import GroupButtons from '../../components/GroupButtons/index';
import { MainStyle, RelativeChildrenStyle } from './styles';

export default function Main() {
  return (
    <MainStyle>
      <RelativeChildrenStyle>
        <Header />
        <GroupButtons />
      </RelativeChildrenStyle>
    </MainStyle>
  );
}

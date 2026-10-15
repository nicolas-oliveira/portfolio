import React from 'react';
import Header from '../../components/Header';
import GroupButtons from '../../components/GroupButtons';
import BlogGrid from '../../components/BlogGrid';
import { MainStyle, RelativeChildrenStyle } from './styles';

export default function Main() {
  return (
    <MainStyle>
      <RelativeChildrenStyle>
        <Header />
        <GroupButtons />
      </RelativeChildrenStyle>
      <BlogGrid />
    </MainStyle>
  );
}

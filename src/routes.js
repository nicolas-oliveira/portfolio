import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Main from './pages/Main';
import Portfolio from './pages/Portfolio';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Main} />
        <Route path="/portfolio" component={Portfolio} />
      </Switch>
    </BrowserRouter>
  );
}

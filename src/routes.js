import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Main from './pages/Main';
import Portifolio from './pages/Portifolio';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Main} />
        <Route path="/portifolio" component={Portifolio} />
      </Switch>
    </BrowserRouter>
  );
}

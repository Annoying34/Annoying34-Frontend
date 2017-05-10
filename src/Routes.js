import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from './containers/Home';
import NotFound from './containers/NotFound';

export default () => (
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/about" exact component={NotFound} />
	<Route path="/imprint" exact component={NotFound} />
	<Route component={NotFound} />
  </Switch>
);
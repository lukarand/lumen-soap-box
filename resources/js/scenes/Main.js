import React, { Component } from 'react';
import {
  Router, Switch
} from 'react-router-dom';
import {
  SetupRoute, RedirectIfSetupRoute
} from '../components/PrivateRoutes';

import history from '../history';
import Dashboard from './Dashboard';
import Request from './Request';
import Reviews from './Reviews';
import Team from './Team';
import Setup from './Setup';
import Setting from './Setting';

class Main extends Component {
  render() {
    return (
      <Router history={history}>
        <Switch>
          <SetupRoute exact path="/" name="Dashboard" component={Dashboard} />
          <SetupRoute path="/team" name="Team" component={Team} />
          <SetupRoute path="/reviews" name="Reviews" component={Reviews} />
          <SetupRoute path="/request" name="Request" component={Request} />
          <SetupRoute path="/setting" name="Request" component={Setting} />
          <RedirectIfSetupRoute path="/setup" name="Setup" component={Setup} />
        </Switch>
      </Router>
    );
  }
}

export default Main;

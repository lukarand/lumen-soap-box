import React, {
  Component, Fragment
} from 'react';
import {
  Route, Switch
} from 'react-router-dom';

import StepTopBar from '../../components/TopBar/StepTopBar';
import Plan from './Plan';
import Profile from './Profile';
import Members from './Members';

class Step extends Component {
  render() {
    return (
      <Fragment>
        <StepTopBar />
        <Switch>
          <Route path="/setup/members" name="Members" component={Members} />
          <Route path="/setup/profile" name="Profile" component={Profile} />
          <Route path="/setup/plan" name="Plan" component={Plan} />
        </Switch>
      </Fragment>
    );
  }
}

export default Step;

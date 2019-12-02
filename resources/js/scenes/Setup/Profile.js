import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Route, Switch, withRouter
} from 'react-router-dom';
import ProfileFindLocation from './ProfileFindLocation';
import ProfileBusinessUrl from './ProfileBusinessUrl';
import ProfileMessageTemplate from './ProfileMessageTemplate';
import { SETUP } from '../../configs/enums';

class Profile extends Component {
  componentWillMount() {
    const {
      company
    } = this.props.user;
    if (company.setup !== SETUP.PROFILE) {
      this.props.history.push(company.setup);
    }
  }

  render() {
    return (
      <Switch>
        <Route exact path="/setup/profile" name="ProfileFindLocation" component={ProfileFindLocation} />
        <Route path="/setup/profile/business-url" name="ProfileBusinessUrl" component={ProfileBusinessUrl} />
        <Route path="/setup/profile/message-template" name="ProfileMessageTemplate" component={ProfileMessageTemplate} />
      </Switch>
    );
  }
}

const mapStateToProps = state => ({
  user: state.common.auth ? state.common.auth.user : null
});

const mapDispatchToProps = () => ({
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));

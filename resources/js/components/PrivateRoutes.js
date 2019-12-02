import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import Store from '../store';
import { SETUP } from '../configs/enums';

export const AuthRoute = ({ component: Component, ...rest }) => {
  const { auth } = Store.getState().common;
  return (
    <Route
      {...rest}
      render={props => (auth
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/login', state: { from: props.location } }} />)}
    />
  );
};

export const RedirectIfAuthenticatedRoute = ({ component: Component, ...rest }) => {
  const { auth } = Store.getState().common;
  return (
    <Route
      {...rest}
      render={props => (!auth
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/', state: { from: props.location } }} />)}
    />
  );
};

export const SetupRoute = ({ component: Component, ...rest }) => {
  const { user } = Store.getState().common.auth;
  let to = false;
  if (!user.company.owner.subscribed) {
    to = '/setup/plan';
  } else {
    const { company } = user;
    if (!company.package) {
      to = '/setup/profile';
    } else if (!company.package.url) {
      to = '/setup/profile/business-url';
    } else if (!company.package.message_template) {
      to = '/setup/profile/message-template';
    } else if (!company.setup === SETUP.TEAM) {
      to = '/setup/members';
    }
  }
  return (
    <Route
      {...rest}
      render={props => (to
        ? <Redirect to={{ pathname: to, state: { from: props.location } }} />
        : <Component {...props} />
      )}
    />
  );
};

export const RedirectIfSetupRoute = ({ component: Component, ...rest }) => {
  const { user } = Store.getState().common.auth;
  let to = false;
  if (user.subscribed && user.company && user.company.step === SETUP.FINAL && user.company.package && user.company.package.url && user.company.package.message_template) {
    to = '/';
  }
  return (
    <Route
      {...rest}
      render={props => (to
        ? <Redirect to={{ pathname: to, state: { from: props.location } }} />
        : <Component {...props} />
      )}
    />
  );
};

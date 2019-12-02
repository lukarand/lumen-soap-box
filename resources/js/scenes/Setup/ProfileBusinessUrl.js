import React, {
  Component, Fragment
} from 'react';
import {
  bindActionCreators
} from 'redux';
import { connect } from 'react-redux';
import {
  Link, withRouter
} from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Container, Card, Form, FormGroup, Alert, Button, Input, NavLink
} from 'reactstrap';

import Api from '../../apis/app';
import {
  login
} from '../../actions/common';

class ProfileBusinessUrl extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(values, bags) {
    const {
      body, response
    } = await Api.post('setup/profile/url', values);
    switch (response.status) {
      case 422:
        await bags.setErrors(body.data);
        break;
      case 200:
        await this.props.login(body.data);
        this.props.history.push('/setup/profile/message-template');
        break;
      default:
        break;
    }
    bags.setSubmitting(false);
  }

  render() {
    return (
      <div className="main-content">
        <Container>
          <Card className="step-card profile-step">
            <div className="step-header">
              <h3 className="header-title mr-3">Copy/Paste Your Business Listing</h3>
              <div className="header-right ml-auto">
                <div>
                  <NavLink
                    to="/setup/profile"
                    tag={Link}
                  >
                    Back to Map
                  </NavLink>
                </div>
              </div>
            </div>
            <div className="business-listing" />
            <Formik
              initialValues={{
                url: ''
              }}
              validationSchema={
                Yup.object().shape({
                  url: Yup.string().required('Url is required!')
                })
              }
              onSubmit={this.handleSubmit}
              render={({
                values,
                errors,
                status,
                touched,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting
              }) => (
                <Form onSubmit={handleSubmit}>
                  {status && <Alert {...status} />}
                  <FormGroup>
                    <Input
                      id="url"
                      name="url"
                      value={values.url}
                      type="url"
                      placeholder="e.g. http://maps.google.com/?cid=1234567891234"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.url && !!errors.url}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Button
                      type="submit"
                      color="success"
                      disabled={isSubmitting}
                      className="btn-lg"
                    >
                      {
                        isSubmitting && (
                          <Fragment>
                            <span className="fa fa-spinner fa-spin" />
                            &nbsp;&nbsp;
                          </Fragment>
                        )
                      }
                      Continue
                    </Button>
                  </FormGroup>
                </Form>
              )}
            />
          </Card>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.common.auth ? state.common.auth.user : null
});

const mapDispatchToProps = dispatch => ({
  login: bindActionCreators(login, dispatch)
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfileBusinessUrl));

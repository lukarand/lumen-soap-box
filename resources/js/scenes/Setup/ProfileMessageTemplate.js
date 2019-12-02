import React, {
  Component, Fragment
} from 'react';
import {
  bindActionCreators
} from 'redux';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
  Container, Card, Form, FormGroup, Alert, Button, Input
} from 'reactstrap';

import Api from '../../apis/app';
import {
  login
} from '../../actions/common';

class ProfileMessageTemplate extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(values, bags) {
    const {
      body, response
    } = await Api.post('setup/profile/message', values);
    switch (response.status) {
      case 422:
        await bags.setErrors(body.data);
        break;
      case 200:
        await this.props.login(body.data);
        this.props.history.push('/setup/members');
        break;
      default:
        break;
    }
    bags.setSubmitting(false);
  }

  render() {
    const { user } = this.props;
    return (
      <div className="main-content">
        <Container>
          <Card className="step-card profile-step">
            <div className="step-header">
              <h3 className="header-title mr-3">Message to Patients</h3>
            </div>
            <div className="business-listing" />
            <Formik
              initialValues={{
                message_template: ''
              }}
              validationSchema={
                Yup.object().shape({
                  message_template: Yup.string().required('Message is required!')
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
                      id="message_template"
                      name="message_template"
                      value={values.message_template}
                      type="text"
                      placeholder={
                        user && (
                          `Hi ${user.name}, please take a moment to review your experience because your feedback is valuable to us and others.`
                        )
                      }
                      onChange={handleChange}
                      onBlur={handleBlur}
                      invalid={touched.message_template && !!errors.message_template}
                    />
                    <Button
                      type="submit"
                      color="success"
                      className="btn-lg"
                      disabled={isSubmitting}
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
export default connect(mapStateToProps, mapDispatchToProps)(ProfileMessageTemplate);

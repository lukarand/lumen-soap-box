import React, {
  Component, Fragment
} from 'react';
import {
  Container, Row, Col, Card,
  Form, FormGroup, FormFeedback, Label,
  Input, Alert, Button
} from 'reactstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import MainTopBar from '../../components/TopBar/MainTopBar';
import Api from '../../apis/app';
import AppHelper from '../../helpers/AppHelper';

class Setting extends Component {
  constructor(props) {
    super(props);
    this.packageFormikRef = React.createRef();
    this.passwordFormikRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePasswordUpdate = this.handlePasswordUpdate.bind(this);
  }

  async componentDidMount() {
    const { response, body } = await Api.get('package');
    switch (response.status) {
      case 200:
        this.packageFormikRef.current.setValues(body.data);
        break;
      default:
    }
  }

  async handleSubmit(values, bags) {
    const {
      response, body
    } = await Api.post('package', values);
    switch (response.status) {
      case 422:
        bags.setErrors(body.data);
        break;
      case 406:
        bags.setStatus(AppHelper.getStatusAlertData(body));
        break;
      case 200:
        bags.setStatus(AppHelper.getStatusAlertData(body));
        bags.setTouched({
          name: false,
          mobile: false
        });
        break;
      case 500:
        bags.setStatus({
          color: 'danger',
          children: 'Internal server error'
        });
        break;
      default:
        break;
    }
    bags.setSubmitting(false);
    setTimeout(() => {
      bags.setStatus(null);
    }, 3000);
  }

  async handlePasswordUpdate(values, bags) {
    const {
      response, body
    } = await Api.post('profile/update', values);
    switch (response.status) {
      case 422:
        bags.setErrors(body.data);
        break;
      case 406:
        bags.setStatus(AppHelper.getStatusAlertData(body));
        break;
      case 200:
        bags.setStatus(AppHelper.getStatusAlertData(body));
        bags.setTouched({
          name: false,
          mobile: false
        });
        break;
      case 500:
        bags.setStatus({
          color: 'danger',
          children: 'Internal server error'
        });
        break;
      default:
        break;
    }
    bags.setSubmitting(false);
    setTimeout(() => {
      bags.setStatus(null);
    }, 3000);
  }

  render() {
    return (
      <Fragment>
        <MainTopBar />
        <div className="main-content">
          <Container>
            <Card className="package-card mb-4">
              <h3>
                Business Package
              </h3>
              <Formik
                ref={this.packageFormikRef}
                initialValues={{
                  url: '',
                  message_template: ''
                }}
                validationSchema={
                  Yup.object().shape({
                    url: Yup.string().required('Business url is required!').url('Business url is incorrect!'),
                    message_template: Yup.string().required('Message template is required!')
                  })
                }
                onSubmit={this.handleSubmit}
                render={({
                  status,
                  values,
                  errors,
                  touched,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <FormGroup>
                      <Input
                        name="url"
                        type="text"
                        placeholder="Business URL"
                        value={values.url}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={touched.url && !!errors.url}
                      />
                      <FormFeedback>
                        {errors.url}
                      </FormFeedback>
                    </FormGroup>
                    <FormGroup>
                      <Input
                        name="message_template"
                        type="text"
                        placeholder="Message Template"
                        value={values.message_template}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={touched.message_template && !!errors.message_template}
                      />
                      <FormFeedback>
                        {errors.message_template}
                      </FormFeedback>
                    </FormGroup>
                    <FormGroup>
                      <Button
                        color="success"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="fa fa-spinner fa-spin" />
                        ) : (
                          <i className="far fa-pencil" />
                        )}
                        &nbsp;Update
                      </Button>
                    </FormGroup>
                    {status && (<Alert {...status} />)}
                  </Form>
                )}
              />
            </Card>
            <Card className="package-card">
              <h3>Change password</h3>
              <Formik
                ref={this.passwordFormikRef}
                initialValues={{
                  old_password: '',
                  password: '',
                  confirm_password: ''
                }}
                validationSchema={
                  Yup.object().shape({
                    old_password: Yup.string().required('Your current password is required!').min(6, 'The old password has to be longer than 8 characters!'),
                    password: Yup.string().required('New Password is required!').min(8, 'The new password has to be longer than 6 characters!').notOneOf([Yup.ref('old_password')], 'Password must not match with old password!'),
                    confirm_password: Yup.string().required('Please enter your new password again to confirm!').min(8, 'The confirm password has to be longer than 8 characters!').oneOf([Yup.ref('password')], 'Confirm Password must match with new password!')
                  })
                }
                onSubmit={this.handlePasswordUpdate}
                render={({
                  status,
                  values,
                  errors,
                  touched,
                  handleBlur,
                  handleChange,
                  handleSubmit,
                  isSubmitting
                }) => (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="old_password">Old password</Label>
                          <Input
                            type="password"
                            name="old_password"
                            value={values.old_password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={touched.old_password && !!errors.old_password}
                          />
                          <FormFeedback>{errors.old_password}</FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Label htmlFor="password">New password</Label>
                    <Row className="align-items-start">
                      <Col md={6}>
                        <FormGroup>
                          <Input
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={touched.password && !!errors.password}
                          />
                          <FormFeedback>{errors.password}</FormFeedback>
                        </FormGroup>
                      </Col>
                      <Col md={6}>
                        <div className="d-none d-md-block text-secondary">
                          Please create a password at least 8 characters long and a mixture of upper, lowercase, digits and symbols
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Label htmlFor="confirm_password">Confirm password</Label>
                          <Input
                            type="password"
                            name="confirm_password"
                            value={values.confirm_password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={touched.confirm_password && !!errors.confirm_password}
                          />
                          <FormFeedback>{errors.confirm_password}</FormFeedback>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <FormGroup>
                          <Button
                            color="success"
                            type="submit"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? (
                              <span className="fa fa-spinner fa-spin" />
                            ) : (
                              <i className="far fa-pencil" />
                            )}
                            &nbsp;Save
                          </Button>
                        </FormGroup>
                      </Col>
                    </Row>
                    {status && (<Alert {...status} />)}
                  </Form>
                )}
              />
            </Card>
          </Container>
        </div>
      </Fragment>
    );
  }
}

export default Setting;

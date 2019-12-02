import React, {
  Component, Fragment
} from 'react';
import {
  Container, Row, Col, Button, Input, Alert,
  Form, FormGroup, FormFeedback
} from 'reactstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

// import Customer from '../../components/customer';
// import { CUSTOMERS } from '../../configs/data';
import MainTopBar from '../../components/TopBar/MainTopBar';
import Api from '../../apis/app';
import AppHelper from '../../helpers/AppHelper';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   customers: CUSTOMERS
    // };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async handleSubmit(values, bags) {
    const {
      response, body
    } = await Api.post('request/quick', values);
    switch (response.status) {
      case 422:
        bags.setErrors(body.data);
        break;
      case 406:
        bags.setStatus(AppHelper.getStatusAlertData(body));
        break;
      case 200:
        bags.setStatus(AppHelper.getStatusAlertData(body));
        bags.setValues({
          name: '',
          mobile: ''
        });
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
    // const { customers } = this.state;
    return (
      <Fragment>
        <MainTopBar />
        <div className="main-content">
          <Container>
            <div className="center-row">
              <div className="card download-card">
                <Row>
                  <Col md={7}>
                    <div className="download-content">
                      <h3 className="header-title">Download the App</h3>
                      <div className="download-text">
                        Donec id elit non mi porta gravida at eget metus.
                        <br />
                        Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.
                      </div>
                      <div className="button-groups">
                        <Button
                          type="button"
                          color="success"
                          className="btn-lg mr-1"
                        >
                          <i className="fab fa-apple mr-2" />
                          App Store
                        </Button>
                        <Button
                          type="button"
                          color="success"
                          className="btn-lg"
                        >
                          <i className="fab fa-google-play mr-2" />
                          Google Play
                        </Button>
                      </div>
                    </div>
                  </Col>
                  <Col md={5}>
                    <div className="download-image" />
                  </Col>
                </Row>
              </div>
              {/* <div className="download-customers">
                {
                  customers && customers.length > 0 && (
                    customers.map((customer, index) => (
                      <Customer
                        key={index}
                        data={customer}
                      />
                    ))
                  )
                }
              </div> */}
              <Formik
                ref={this.formikRef}
                initialValues={{
                  name: '',
                  mobile: ''
                }}
                validationSchema={
                  Yup.object().shape({
                    name: Yup.string().required('Name is required!'),
                    mobile: Yup.string().matches(/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Mobile phone is incorrect!').required('Mobile phone is required!')
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
                  <div className="quick-request row-form">
                    <Form onSubmit={handleSubmit} className="mb-2">
                      <FormGroup>
                        <div className="sms-request">
                          <i className="fa fa-sms" />
                          <div>Quick SMS Request</div>
                        </div>
                      </FormGroup>
                      <FormGroup>
                        <Input
                          name="name"
                          type="text"
                          placeholder="Name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={touched.name && !!errors.name}
                        />
                        <FormFeedback>
                          {errors.name}
                        </FormFeedback>
                      </FormGroup>
                      <FormGroup>
                        <Input
                          name="mobile"
                          type="text"
                          placeholder="Mobile Phone"
                          value={values.mobile}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          invalid={touched.mobile && !!errors.mobile}
                        />
                        <FormFeedback>
                          {errors.mobile}
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
                            <i className="far fa-paper-plane" />
                          )}
                        </Button>
                      </FormGroup>
                    </Form>
                    {status && (<Alert {...status} />)}
                  </div>
                )}
              />
            </div>
          </Container>
        </div>
      </Fragment>
    );
  }
}

export default Dashboard;

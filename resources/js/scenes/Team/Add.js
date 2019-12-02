import React, {
  Component
} from 'react';
import {
  Modal, ModalBody,
  Button,
  Input,
  Form, FormGroup, FormFeedback,
  Label,
  UncontrolledAlert
} from 'reactstrap';
import 'react-phone-input-2/dist/style.css';
import PhoneInput from 'react-phone-input-2';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Api from '../../apis/app';

class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
      mobile: ''
    };
    this.formikRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGoBack = this.handleGoBack.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleGoBack() {
    this.props.history.goBack();
  }

  handleToggle() {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen
    });
  }

  async handleSubmit(values, bags) {
    const { mobile } = this.state;
    const newData = {
      name: values.name,
      email: values.email,
      mobile
    };
    if (mobile === '+') {
      newData.mobile = '';
    }
    const { response, body } = await Api.post('members', newData);
    switch (response.status) {
      case 422:
        await bags.setSubmitting(false);
        await bags.setErrors(body.data);
        break;
      case 200:
        await bags.setSubmitting(false);
        await this.setState({
          isOpen: false
        });
        break;
      default:
        break;
    }
  }

  handleChangeMobile(mobile) {
    this.setState({
      mobile
    });
  }

  render() {
    const { isOpen, mobile } = this.state;
    return (
      <Modal
        isOpen={isOpen}
        toggle={this.handleToggle}
        onClosed={this.handleGoBack}
        className="modal-team-add"
      >
        <ModalBody>
          <h3 className="mb-4">
            Add Team Member
          </h3>
          <Formik
            ref={this.formikRef}
            initialValues={{
              name: '',
              email: ''
            }}
            validationSchema={
              Yup.object().shape({
                name: Yup.string().required('Name is required!'),
                email: Yup.string().email('Email is not valid!').required('Email is required!')
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
                {status && <UncontrolledAlert {...status} />}
                <FormGroup>
                  <Label for="name">
                    Name
                  </Label>
                  <Input
                    type="text"
                    name="name"
                    id="name"
                    bsSize="lg"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={!!errors.name && touched.name}
                  />
                  <FormFeedback>{errors.name}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="email">
                    Email
                  </Label>
                  <Input
                    type="email"
                    name="email"
                    id="email"
                    bsSize="lg"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={!!errors.email && touched.email}
                  />
                  <FormFeedback>{errors.email}</FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Label for="mobile">
                    Mobile
                  </Label>
                  <PhoneInput
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={mobile}
                    onChange={this.handleChangeMobile.bind(this)}
                  />
                </FormGroup>
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  color="success"
                  className="float-right"
                >
                  {isSubmitting && <i className="fa fa-spinner fa-spin mr-1" />}
                  Add Member
                </Button>
              </Form>
            )}
          />
        </ModalBody>
        <div
          className="modal-close"
          role="presentation"
          onClick={this.handleToggle}
        >
          <i className="fa fa-times" />
        </div>
      </Modal>
    );
  }
}

export default Add;

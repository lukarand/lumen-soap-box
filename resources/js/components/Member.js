/* eslint-disable react/no-unescaped-entities */
import React, {
  Component
} from 'react';
import classnames from 'classnames';
import {
  Form, Input, Button, FormGroup, UncontrolledAlert
} from 'reactstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

class Member extends Component {
  constructor() {
    super();
    this.state = {
    };
    this.formikRef = React.createRef();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.componentWillReceiveProps();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      const {
        formikRef
      } = this;
      const { data, addable } = nextProps;
      const values = {
        ...data
      };
      if (!addable && data) {
        formikRef.current.setValues({
          name: values.name,
          email: values.email,
          mobile: values.mobile
        });
      } else {
        formikRef.current.setValues({
          name: '',
          email: '',
          mobile: ''
        });
      }
    } else {
      const {
        props, formikRef
      } = this;
      const { data, addable } = props;
      const values = {
        ...data
      };
      if (!addable && data) {
        formikRef.current.setValues({
          name: values.name,
          email: values.email,
          mobile: values.mobile
        });
      } else {
        formikRef.current.setValues({
          name: '',
          email: '',
          mobile: ''
        });
      }
    }
  }

  handleSubmit(values) {
    const { onSaveSubmit } = this.props;
    onSaveSubmit(values);
  }

  render() {
    const {
      addable, data, onDelete, status
    } = this.props;
    const { className } = this.props;
    const classNameMap = {
      'team-member': true,
      'row-form': true
    };
    if (className) {
      classNameMap[className] = true;
    }
    return (
      <div className={classnames(classNameMap)}>
        <Formik
          ref={this.formikRef}
          initialValues={{
            name: '',
            email: '',
            mobile: ''
          }}
          validationSchema={
            Yup.object().shape({
              name: Yup.string().required('First Name is required!'),
              email: Yup.string().email('Email is not valid!').required('Email is required!'),
              mobile: Yup.string().min(10, 'Mobile has to be longer than 10 characters!').required('Mobile is required!')
            })
          }
          onSubmit={this.handleSubmit}
          render={({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit
          }) => (
            <div>
              {status.email === values.email && (<UncontrolledAlert color="danger">This email has already been taken.</UncontrolledAlert>)}
              <Form onSubmit={handleSubmit}>
                <FormGroup>
                  <Input
                    name="name"
                    type="text"
                    placeholder="Name"
                    value={values.name || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.name && !!errors.name}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={values.email || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.email && !!errors.email}
                  />
                </FormGroup>
                <FormGroup>
                  <Input
                    name="mobile"
                    type="phone"
                    placeholder="Mobile phone"
                    value={values.mobile || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.mobile && !!errors.mobile}
                  />
                </FormGroup>
                <FormGroup>
                  {
                    addable && (
                      <Button
                        color="success"
                        type="submit"
                      >
                        <i className="fa fa-plus-circle" />
                      </Button>
                    )
                  }
                  {
                    !addable && (
                      <Button
                        color="danger"
                        type="button"
                        onClick={() => onDelete(data.id)}
                      >
                        <i className="fa fa-trash-alt" />
                      </Button>
                    )
                  }
                </FormGroup>
              </Form>
            </div>
          )}
        />
      </div>
    );
  }
}

Member.defaultProps = {
  addable: false,
  data: {},
  status: [],
  onSaveSubmit: () => {},
  onDelete: () => {}
};

export default Member;

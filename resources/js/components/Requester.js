/* eslint-disable react/no-unescaped-entities */
import React, {
  Component
} from 'react';
import classnames from 'classnames';
import {
  Form, Input, Button, FormGroup, FormFeedback
} from 'reactstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

class Requester extends Component {
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
          mobile: values.mobile
        });
      } else {
        formikRef.current.setValues({
          name: '',
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
          mobile: values.mobile
        });
      } else {
        formikRef.current.setValues({
          name: '',
          mobile: ''
        });
      }
    }
  }

  handleSubmit(values, bags) {
    const { onSave } = this.props;
    onSave(values, bags);
  }

  render() {
    const {
      addable, data, onDelete
    } = this.props;
    const { className } = this.props;
    const classNameMap = {
      'request-add': true,
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
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit
          }) => (
            <div>
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
                  <FormFeedback>
                    {errors.name}
                  </FormFeedback>
                </FormGroup>
                <FormGroup>
                  <Input
                    name="mobile"
                    type="text"
                    placeholder="Mobile phone"
                    value={values.mobile || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    invalid={touched.mobile && !!errors.mobile}
                  />
                  <FormFeedback>
                    {errors.mobile}
                  </FormFeedback>
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
                        onClick={() => { onDelete(data); }}
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

Requester.defaultProps = {
  addable: false,
  data: {},
  onSave: () => {},
  onDelete: () => {}
};

export default Requester;

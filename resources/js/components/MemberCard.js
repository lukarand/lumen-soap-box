import React, {
  Component
} from 'react';
import {
  Form,
  Card, CardBody, CardFooter, Input
} from 'reactstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
import 'react-phone-input-2/dist/style.css';
import PhoneInput from 'react-phone-input-2';
import Api from '../apis/app';

class MemberCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      editable: false,
      fileKey: 0,
      mobile: props.data.mobile
    };
    this.formikRef = React.createRef();
    this.fileRef = React.createRef();
    this.handlePhotoUpload = this.handlePhotoUpload.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleInvite = this.handleInvite.bind(this);
  }

  componentDidMount() {
    this.componentWillReceiveProps();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps) {
      const {
        formikRef
      } = this;
      const { data } = nextProps;
      const values = {
        ...data
      };
      if (data) {
        formikRef.current.setValues({
          name: values.name
        });
      } else {
        formikRef.current.setValues({
          name: ''
        });
      }
    } else {
      const {
        props, formikRef
      } = this;
      const { data } = props;
      const values = {
        ...data
      };
      if (data) {
        formikRef.current.setValues({
          name: values.name
        });
      } else {
        formikRef.current.setValues({
          name: ''
        });
      }
    }
  }

  get avatarName() {
    const {
      name, photo
    } = this.props.data;

    if (photo) {
      return photo;
    }
    if (!name) {
      return '';
    }

    const namesSplit = name.split(' ');
    if (namesSplit.length >= 2) {
      return namesSplit[0].charAt(0) + namesSplit[1].charAt(0);
    }
    return namesSplit[0].charAt(0);
  }

  handleChangeMobile(value) {
    this.setState({
      mobile: value
    });
  }

  handleEdit() {
    const { user } = this.props;
    if (user.role === 'owner') {
      this.setState({
        editable: true
      });
    } else {
      window.alert('You can not edit!');
    }
  }

  handleCancel() {
    this.setState({
      editable: false
    });
  }

  handleDelete() {
    const {
      data, onDelete, user
    } = this.props;
    if (user.role === 'owner') {
      if (data.role !== 'owner') {
        onDelete(data);
      } else {
        window.alert('This user can not remove!');
      }
    } else {
      window.alert('You can not remove!');
    }
  }

  handleUpdate(values) {
    const { onUpdate, data } = this.props;
    const { mobile } = this.state;
    const newData = {
      name: values.name,
      mobile
    };
    if (mobile === '+') {
      newData.mobile = '';
    }
    onUpdate(data.id, newData);
    this.setState({
      editable: false
    });
  }

  handleInvite() {
    const { onInvite, data } = this.props;
    onInvite(data);
  }

  async handlePhotoUpload() {
    const { data, fileKey } = this.state;
    const { files } = this.fileRef.current;
    const file = files[0];
    if (files.length === 0) {
      return;
    }
    const formData = new FormData();
    formData.append('avatar', file);
    const { response, body } = await Api.upload(`members/${data.id}/upload`, formData);
    switch (response.status) {
      case 200:
      case 201:
        data.photo = body.data;
        this.setState({
          data
        });
        break;
      case 422:
        console.log(body);
        break;
      default:
        break;
    }
    this.setState({
      fileKey: fileKey + 1
    });
  }

  render() {
    const {
      ranking
    } = this.props;
    const { data, editable, mobile } = this.state;
    return (
      <Card className="member-card">
        <Formik
          ref={this.formikRef}
          initialValues={{
            name: ''
          }}
          validationSchema={
            Yup.object().shape({
              name: Yup.string().required('Name is required!')
            })
          }
          onSubmit={this.handleUpdate}
          render={({
            values,
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            submitForm
          }) => (
            <Form onSubmit={handleSubmit}>
              <div className="member-delete">
                <span
                  role="presentation"
                  className="fa fa-trash-alt text-danger cursor-pointer"
                  onClick={this.handleDelete}
                />
              </div>
              <div className="member-edit">
                {
                  !editable ? (
                    <span
                      role="presentation"
                      className="fa fa-pencil-alt text-info cursor-pointer"
                      onClick={this.handleEdit}
                    />
                  ) : (
                    <div className="d-flex">
                      <span
                        role="presentation"
                        className="fa fa-check-circle text-success mr-2 cursor-pointer"
                        onClick={() => { submitForm(); }}
                      />
                      <span
                        role="presentation"
                        className="fa fa-minus-circle text-danger cursor-pointer"
                        onClick={this.handleCancel}
                      />
                    </div>
                  )
                }
              </div>
              <CardBody className={editable ? 'data-editable' : ''}>
                <div className="photo">
                  {
                    data.photo ? (
                      <img src={data.photo} alt={data.name} />
                    ) : (
                      <div className="avatar-text">
                        <span>{this.avatarName}</span>
                      </div>
                    )
                  }
                  {
                    editable && (
                      <span
                        role="presentation"
                        className="fa fa-pencil-alt text-secondary photo-upload cursor-pointer"
                        onClick={() => {
                          this.fileRef.current.click();
                        }}
                      >
                        <input
                          className="d-none"
                          type="file"
                          key={this.state.fileKey}
                          ref={this.fileRef}
                          onChange={this.handlePhotoUpload}
                          accept="image/jpg,image/png,.png,application/png,.jpeg,.jpg,application/jpeg,.gif,.svg"
                        />
                      </span>
                    )
                  }
                </div>
                <div className="name">
                  {
                    !editable ? (
                      data.name
                    ) : (
                      <Input
                        name="name"
                        type="text"
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        invalid={!!errors.name}
                      />
                    )
                  }
                </div>
                <div className="email">
                  {
                    data.email
                  }
                </div>
                <div className="mobile">
                  {
                    !editable ? (
                      data.mobile
                    ) : (
                      data.mobile ? (
                        <PhoneInput
                          name="phoneNumber"
                          placeholder="Enter phone number"
                          value={mobile}
                          onChange={this.handleChangeMobile.bind(this)}
                        />
                      ) : (
                        <PhoneInput
                          name="phoneNumber"
                          value={mobile || ''}
                          placeholder="Enter phone number"
                          onChange={this.handleChangeMobile.bind(this)}
                        />
                      )
                    )
                  }
                </div>
                <div className="requests-ranking">
                  <div className="requests">
                    <div className="title">
                      Requests
                    </div>
                    <div className="request">
                      {
                        data.meta && data.meta.requests_sent ? data.meta.requests_sent : 0
                      }
                    </div>
                  </div>
                  <div className="ranking">
                    <div className="title">
                      Ranking
                    </div>
                    <div className="content">
                      {ranking}
                    </div>
                  </div>
                </div>
              </CardBody>
              <CardFooter onClick={this.handleInvite.bind(this)}>
                Resend Invite
              </CardFooter>
            </Form>
          )}
        />
      </Card>
    );
  }
}

MemberCard.defaultProps = {
  data: {},
  user: {},
  ranking: 0,
  onDelete: () => {},
  onUpdate: () => {},
  onInvite: () => {}
};

export default MemberCard;

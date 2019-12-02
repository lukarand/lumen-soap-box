/* eslint-disable react/no-unescaped-entities */
import React, {
  Component, Fragment
} from 'react';
import { connect } from 'react-redux';
import {
  Container, Card, Button,
  Alert
} from 'reactstrap';

import Requester from '../../components/Requester';
import MainTopBar from '../../components/TopBar/MainTopBar';
import Api from '../../apis/app';
import AppHelper from '../../helpers/AppHelper';

class Request extends Component {
  constructor() {
    super();
    this.state = {
      isSubmitting: false,
      requests: [],
      status: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSaveRequest = this.handleSaveRequest.bind(this);
  }

  async handleSubmit() {
    const {
      requests
    } = this.state;
    await this.setState({
      isSubmitting: true
    });

    const {
      response, body
    } = await Api.post('request/bulk', { data: requests });

    switch (response.status) {
      case 406:
        await this.setState({
          status: AppHelper.getStatusAlertData(body)
        });
        break;
      case 200:
        await this.setState({
          status: AppHelper.getStatusAlertData(body)
        });
        break;
      case 500:
        await this.setState({
          status: {
            color: 'danger',
            children: 'Internal server error'
          }
        });
        break;
      default:
        break;
    }
    await this.setState({
      isSubmitting: false
    });
    setTimeout(() => {
      this.setState({
        status: null
      });
    }, 3000);
  }

  handleSaveRequest(values, bags) {
    const { requests } = this.state;
    const index = requests.findIndex(request => (request.mobile === values.mobile));
    if (index >= 0) {
      bags.setErrors({
        mobile: 'Mobile phone is already taken.'
      });
      return;
    }
    bags.setSubmitting(false);
    bags.setValues({
      name: '',
      mobile: ''
    });
    bags.setTouched({
      name: false,
      mobile: false
    });
    requests.push(values);
    this.setState({
      requests
    });
  }

  handleDeleteRequest(index) {
    const { requests } = this.state;
    requests.splice(index, 1);
    this.setState({
      requests
    });
  }

  render() {
    const { requests, status, isSubmitting } = this.state;
    return (
      <Fragment>
        <MainTopBar />
        <div className="main-content">
          <Container>
            <Card className="step-card requests">
              <div className="step-header">
                <h3 className="header-title mr-3">Request a Review</h3>
              </div>
              <div className="request-review">
                {
                  requests && requests.length > 0 && (
                    requests.map((item, index) => (
                      <Requester
                        key={index}
                        data={item}
                        onDelete={this.handleDeleteRequest.bind(this, index)}
                      />
                    ))
                  )
                }
                <Requester
                  addable
                  onSave={this.handleSaveRequest}
                />
              </div>
              <div className="mb-2">
                <Button
                  disabled={isSubmitting || requests.length === 0}
                  type="button"
                  color="success"
                  className="btn-lg mr-3"
                  onClick={this.handleSubmit}
                >
                  {isSubmitting && (
                    <Fragment>
                      <span className="fa fa-spinner fa-spin" />
                      &nbsp;&nbsp;
                    </Fragment>
                  )}
                  Send SMS Request
                </Button>
              </div>
              {status && <Alert {...status} />}
            </Card>
          </Container>
        </div>
      </Fragment>
    );
  }
}

Request.defaultProps = {
  onDelete: () => { }
};

const mapStateToProps = state => ({
  user: state.common.auth ? state.common.auth.user : null
});

const mapDispatchToProps = () => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(Request);

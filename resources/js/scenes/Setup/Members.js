/* eslint-disable react/no-unescaped-entities */
import React, {
  Component
} from 'react';
import {
  bindActionCreators
} from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Container, Card, Button
} from 'reactstrap';

import Member from '../../components/Member';
import Api from '../../apis/app';
import { login } from '../../actions/common';

class Members extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSubmitting: false,
      members: [],
      addable: true,
      status: []
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSkip = this.handleSkip.bind(this);
    this.handleSaveMember = this.handleSaveMember.bind(this);
  }

  async handleSubmit() {
    const { members } = this.state;
    await this.submit(members);
  }

  async handleSkip() {
    await this.submit([]);
  }

  async submit(members) {
    await this.setState({
      isSubmitting: true
    });
    if (members) {
      const { response, body } = await Api.post('setup/members', members);
      switch (response.status) {
        case 200:
          await this.props.login(body.data);
          this.props.history.push('/');
          break;
        default:
          await this.setState({
            isSubmitting: false
          });
          break;
      }
    }
  }

  handleSaveMember(values) {
    const { members } = this.state;
    if (members && members.length > 0) {
      members.push({ ...values });
      this.setState({
        members
      });
    } else {
      this.setState({
        members: [
          {
            name: values.name,
            email: values.email,
            mobile: values.mobile
          }
        ]
      });
    }
  }

  async handleDeleteMember(index) {
    const { members } = this.state;
    members.splice(index, 1);
    await this.setState({
      members
    });
  }

  render() {
    const {
      members, addable, status, isSubmitting
    } = this.state;

    return (
      <div className="main-content">
        <Container>
          <Card className="step-card members">
            <div className="step-header">
              <h3 className="header-title mr-3">Invite Team Members</h3>
            </div>
            <div className="team-members">
              {
                members && members.length > 0 && (
                  members.map((item, index) => (
                    <Member
                      key={index}
                      data={item}
                      status={status}
                      onDelete={this.handleDeleteMember.bind(this, index)}
                    />
                  ))
                )
              }
              {
                addable && (
                  <Member
                    addable={addable}
                    onSaveSubmit={this.handleSaveMember}
                  />
                )
              }
            </div>
            <div className="d-flex align-items-center">
              <Button
                type="button"
                color="success"
                disabled={(!members || members.length === 0) || isSubmitting}
                className="btn-lg mr-3"
                onClick={this.handleSubmit}
              >
                I'm done adding
              </Button>
              <Button
                disabled={isSubmitting}
                onClick={this.handleSkip}
                type="button"
                color="link"
              >
                Skip, I’ll do this later.
              </Button>
            </div>
          </Card>
        </Container>
      </div>
    );
  }
}

Members.defaultProps = {
  onDelete: () => {}
};

const mapStateToProps = state => ({
  user: state.common.auth ? state.common.auth.user : null
});

const mapDispatchToProps = dispatch => ({
  login: bindActionCreators(login, dispatch)
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Members));

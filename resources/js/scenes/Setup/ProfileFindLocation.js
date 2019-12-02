import React, {
  Component
} from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Container, Card, Button
} from 'reactstrap';

class ProfileFindLocation extends Component {
  constructor() {
    super();
    this.state = {
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit() {
    this.props.history.push('/setup/profile/business-url');
  }

  render() {
    return (
      <div className="main-content">
        <Container>
          <Card className="step-card profile-step">
            <div className="step-header">
              <h3 className="header-title mr-3">Find Your Business</h3>
              <div className="header-right ml-auto">
                <div>Can’t find your location?</div>
                <i className="far fa-life-ring" />
              </div>
            </div>
            <div className="find-location" />
            <div>
              <Button
                type="button"
                color="success"
                className="btn-lg"
                onClick={this.handleSubmit}
              >
                Continue
              </Button>
            </div>
          </Card>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.common.auth ? state.common.auth.user : null
});

const mapDispatchToProps = () => ({
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ProfileFindLocation));

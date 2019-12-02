import React, {
  Component
} from 'react';
import {
  bindActionCreators
} from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  Container, Row, Col, Card, Label
} from 'reactstrap';
import Switch from 'react-switch';

import {
  PERIOD_TYPE, RESPONSE_STATUS, SETUP
} from '../../configs/enums';
import Api from '../../apis/app';
import PriceTable from '../../components/PriceTable';
import { login } from '../../actions/common';

class Plan extends Component {
  constructor(props) {
    super(props);
    this.state = {
      periodType: PERIOD_TYPE.MONTHLY,
      plans: []
    };
    this.handlePeriodChange = this.handlePeriodChange.bind(this);
    this.handleChoosePlan = this.handleChoosePlan.bind(this);
    this.unmonted = false;
  }

  componentWillMount() {
    const {
      user
    } = this.props;
    if (user.company.setup !== SETUP.PLAN) {
      this.props.history.push(user.company.setup);
      this.unmonted = true;
    }
  }

  async componentDidMount() {
    if (this.unmonted) {
      return;
    }

    const {
      response, body
    } = await Api.get('setup/plans');
    switch (response.status) {
      case 200:
        this.setState({
          plans: body.data
        });
        break;
      default:
        break;
    }
  }

  handlePeriodChange(checked) {
    this.setState({
      periodType: checked ? PERIOD_TYPE.YEARLY : PERIOD_TYPE.MONTHLY
    });
  }

  async handleChoosePlan(plan, token) {
    const {
      response, body
    } = await Api.post(`setup/plans/${plan.id}`, token);
    if (response.status === 200 && body.status === RESPONSE_STATUS.SUCCESS) {
      await this.props.login(body.data);
      this.props.history.push('/setup/profile');
    }
  }

  render() {
    const { periodType, plans } = this.state;
    const {
      user
    } = this.props;

    return (
      <div className="main-content">
        <Container>
          <Card className="step-card pricing-plans">
            <div className="step-header">
              <h3 className="header-title mr-3">Pricing Plans</h3>
              <div className="monthly-switch ml-auto">
                <Label htmlFor="switch">
                  <span className={periodType === PERIOD_TYPE.MONTHLY ? 'active' : 'inactive'}>
                    Monthly
                  </span>
                  <Switch
                    id="switch"
                    onChange={this.handlePeriodChange}
                    checked={periodType === PERIOD_TYPE.YEARLY}
                    onColor="#00D994"
                    uncheckedIcon={false}
                    checkedIcon={false}
                    className="react-switch"
                    width={36}
                    height={24}
                  />
                  <span className={periodType === PERIOD_TYPE.YEARLY ? 'active' : 'inactive'}>
                    Yearly
                  </span>
                </Label>
              </div>
            </div>
            <div className="price-table">
              <Row>
                {
                  plans && plans.length > 0 && (
                    plans.filter(item => item.period === periodType).map((plan, index) => (
                      <Col md={4} key={index}>
                        <PriceTable
                          plan={plan}
                          user={user}
                          onChoosePlan={this.handleChoosePlan}
                        />
                      </Col>
                    ))
                  )
                }
              </Row>
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

const mapDispatchToProps = dispatch => ({
  login: bindActionCreators(login, dispatch)
});
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Plan));

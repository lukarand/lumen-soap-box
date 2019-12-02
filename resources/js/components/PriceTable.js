import React, {
  Component, Fragment
} from 'react';
import {
  Button
} from 'reactstrap';
import StripeCheckout from 'react-stripe-checkout';
import { Bitmaps } from '../theme';
import ENV from '../configs/env';

class PriceTable extends Component {
  constructor(props) {
    super(props);
    this.handleToken = this.handleToken.bind(this);
  }

  handleToken(token) {
    const {
      plan, onChoosePlan
    } = this.props;
    onChoosePlan(plan, token);
  }

  render() {
    const { plan, user } = this.props;
    return (
      <Fragment>
        <h6 className="plan-header">
          {plan.name}
          &nbsp;
          Plan
        </h6>
        <h1 className="plan-title">
          $
          {
            plan.price_per_month
          }
          <span>
            &nbsp;/ mo
          </span>
        </h1>
        <ul>
          <li>
            {
              plan.max_messages === 500 ? (
                <i className="fa fa-check" aria-hidden="true" />
              ) : (
                <i className="fa fa-times" aria-hidden="true" />
              )
            }
            500 Messages
          </li>
          <li>
            {
              plan.mobile_app_access === 1 ? (
                <i className="fa fa-check" aria-hidden="true" />
              ) : (
                <i className="fa fa-times" aria-hidden="true" />
              )
            }
            Mobile App Access
          </li>
        </ul>
        <StripeCheckout
          name={plan.name} // the pop-in header title
          image={Bitmaps.logo} // the pop-in header image (default none)
          label={plan.name} // text inside the Stripe button
          amount={plan.price_per_month * 100} // cents
          currency="USD"
          stripeKey={ENV.STRIPE_KEY}
          email={user && user.email}
          zipCode={false}
          // alipay // accept Alipay (default false)
          // bitcoin // accept Bitcoins (default false)
          allowRememberMe // "Remember Me" option (default true)
          reconfigureOnUpdate={false}
          token={this.handleToken}
        >
          <Button
            color="success"
          >
            Choose Plan
          </Button>
        </StripeCheckout>
      </Fragment>
    );
  }
}

PriceTable.defaultProps = {
  plan: {},
  onChoosePlan: () => { }
};

export default PriceTable;

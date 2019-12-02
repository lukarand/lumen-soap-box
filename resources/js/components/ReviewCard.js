import React, {
  Component
} from 'react';
import {
  Card, CardBody, CardFooter
} from 'reactstrap';
import Stars from 'react-stars';
import moment from 'moment';

class ReviewCard extends Component {
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
    const { data } = this.props;
    return (
      <Card className="review-card">
        <CardBody>
          <div className="photo">
            <img src={data.photo} alt={data.name} />
          </div>
          <div className="name">
            {data.name}
          </div>
          <div className="score">
            <Stars
              edit={false}
              value={data.score}
              color2="#FD7B4F"
              size={20}
            />
          </div>
          <div className="reviewed-at">
            {moment(data.reviewed_at).fromNow()}
          </div>
          <div className="review-text">
            {data.text}
          </div>
        </CardBody>
        <CardFooter onClick={() => {
          window.open(data.profile_url, '_blank');
        }}>
          Visit original Review
        </CardFooter>
      </Card>
    );
  }
}

ReviewCard.defaultProps = {
  data: {}
};

export default ReviewCard;

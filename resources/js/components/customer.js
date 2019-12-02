import React, {
  Component
} from 'react';
// import StarRatings from 'react-star-ratings';

class Customer extends Component {
  render() {
    const {
      data
    } = this.props;
    return (
      <div className="customer">
        <div className="left-icon">
          <i className="fab fa-google" />
        </div>
        <div className="right-icon">
          <i className="fa fa-expand" />
        </div>
        <div className="text-center">
          <div className="photo-image">
            <img src={data.photo} alt="" />
          </div>
          <div className="customer-name">
            {data.name}
          </div>
          <div className="star-rating">
            {/* <StarRatings
              name="rating"
              rating={data.starRating}
              starRatedColor="white"
              // starEmptyColor="transparent"
              numberOfStars={5}
              starDimension="16px"
              starSpacing="2.5px"
            /> */}
            <i className="fa fa-star" />
            <i className="fa fa-star" />
            <i className="fa fa-star" />
            <i className="fa fa-star-half-alt" />
            <i className="far fa-star" />
          </div>
          <div className="download-time">
            {data.downloadTime}
          </div>
        </div>
      </div>
    );
  }
}

Customer.defaultProps = {
  data: {}
};

export default Customer;

import React, {
  Component, Fragment
} from 'react';
import {
  Container
} from 'reactstrap';
// import InfiniteScroll from 'react-infinite-scroller';
import MasonryLayout from 'react-masonry-layout';

import ReviewCard from '../../components/ReviewCard';
import Api from '../../apis/app';
import MainTopBar from '../../components/TopBar/MainTopBar';

class Reviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      page: {
        data: []
      }
    };
    this.loadNextPage = this.loadNextPage.bind(this);
  }

  async componentDidMount() {
    await this.loadPage();
  }

  async loadPage() {
    await this.setState({
      loading: true
    });
    const {
      response, body
    } = await Api.get('reviews');
    switch (response.status) {
      case 200:
        await this.setState({
          page: body.data
        });
        break;
      default:
        break;
    }
    await this.setState({
      loading: false
    });
  }

  async loadNextPage() {
    const {
      page
    } = this.state;
    await this.setState({
      loading: true
    });
    const {
      response, body
    } = await Api.get('reviews', {
      page: page.current_page + 1
    });
    switch (response.status) {
      case 200: {
        const data = [...page.data, ...body.data.data];
        body.data.data = data;
        await this.setState({
          page: body.data
        });
        break;
      }
      default:
        break;
    }
    await this.setState({
      loading: false
    });
  }

  render() {
    const {
      page, loading
    } = this.state;
    return (
      <Fragment>
        <MainTopBar />
        <div className="main-content">
          <Container>
            <h3 className="header-title mb-3">Reviews</h3>
            <MasonryLayout
              sizes={[
                { columns: 1, gutter: 50 },
                { mq: '768px', columns: 2, gutter: 50 },
                { mq: '992px', columns: 3, gutter: 50 }
              ]}
              id="reviews"
              className="masonry-grid"
              infiniteScroll={this.loadNextPage}
              infiniteScrollEnd={page.current_page >= page.last_page}
              infiniteScrollSpinner={<div className="text-center mt-4"><i className="fa fa-spinner fa-spin" /></div>}
              infiniteScrollEndIndicator={null}
              infiniteScrollLoading={loading}
            >
              {
                page.data.map((element, index) => (
                  <div className="masonry-grid-item" key={`${index}`}>
                    <ReviewCard data={element} />
                  </div>
                ))
              }
            </MasonryLayout>
          </Container>
        </div>

      </Fragment>
    );
  }
}

export default Reviews;

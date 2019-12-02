import React, {
  Component, Fragment
} from 'react';
import { connect } from 'react-redux';
import {
  Route, Switch, withRouter
} from 'react-router-dom';
import {
  Container, Row, Col, Button
} from 'reactstrap';

import MainTopBar from '../../components/TopBar/MainTopBar';
import MemberCard from '../../components/MemberCard';
import AddTeam from './Add';
import Api from '../../apis/app';

class Team extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
    this.handleUpdate = this.handleUpdate.bind(this);
    this.handleInvite = this.handleInvite.bind(this);
    this.handleAddTeam = this.handleAddTeam.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  componentDidMount() {
    this.componentWillReceiveProps(this.props);
  }

  async componentWillReceiveProps() {
    const {
      response, body
    } = await Api.get('members');
    switch (response.status) {
      case 200:
        body.data.sort((a, b) => {
          if (a.meta === null) {
            return 1;
          }
          if (b.meta === null) {
            return -1;
          }
          return (a.meta.requests_sent > b.meta.requests_sent) ? -1 : ((a.meta.requests_sent === b.meta.requests_sent) ? 0 : 1);
        });
        this.setState({
          data: body.data
        });
        break;
      default:
        break;
    }
  }

  handleInvite(value) {
    console.log(value);
  }

  async handleUpdate(id, values) {
    const { data } = this.state;
    const { response, body } = await Api.put(`members/${id}`, values);
    switch (response.status) {
      case 200: {
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          if (item.id === id) {
            item.name = body.data.name;
            item.email = body.data.email;
            item.mobile = body.data.mobile;
          }
        }
        this.setState({
          data: [...data]
        });
        break;
      }
      default:
        break;
    }
  }

  async handleDelete(item) {
    const { data } = this.state;
    if (window.confirm('Do you really want to remove?')) {
      const { response } = await Api.delete(`members/${item.id}`);
      switch (response.status) {
        case 200: {
          const index = data.indexOf(item);
          data.splice(index, 1);
          break;
        }
        default:
          break;
      }

      this.setState({
        data
      });
    }
  }

  handleAddTeam() {
    const { user } = this.props;
    if (user.role === 'owner') {
      this.props.history.push('/team/add');
    } else {
      window.alert('You can not add team!');
    }
  }

  render() {
    const {
      data
    } = this.state;
    const { user } = this.props;
    return (
      <Fragment>
        <MainTopBar />
        <div className="main-content">
          <Container>
            <div className="center-row">
              <div className="team-member-action">
                <h3 className="header-title mb-4">Teams</h3>
                <div className="action-bar">
                  <Button type="button" onClick={this.handleAddTeam}>
                    <i className="fa fa-plus text-white" />
                  </Button>
                </div>
              </div>
              <Row>
                {
                  data && data.length > 0 && (
                    data.map((item, index) => (
                      <Col md={4} key={index}>
                        <MemberCard
                          data={item}
                          user={user}
                          ranking={index + 1}
                          onDelete={this.handleDelete}
                          onUpdate={this.handleUpdate}
                          onInvite={this.handleInvite}
                        />
                      </Col>
                    ))
                  )
                }
              </Row>
            </div>
          </Container>
        </div>
        <Switch>
          <Route path="/team/add" component={AddTeam} />
        </Switch>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.common.auth ? state.common.auth.user : null
});

const mapDispatchToProps = dispatch => ({
  dispatch
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Team));

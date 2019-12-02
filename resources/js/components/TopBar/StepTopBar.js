import React, {
  Component
} from 'react';
import {
  NavLink as Link
} from 'react-router-dom';
import {
  Nav, Navbar, NavItem, NavLink, NavbarBrand, NavbarToggler, Collapse
} from 'reactstrap';
import Bitmaps from '../../theme/Bitmaps';
import RightNavBar from './RightNavBar';

class StepTopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.toggleOpen = this.toggleOpen.bind(this);
  }

  toggleOpen() {
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen
    });
  }

  render() {
    const { isOpen } = this.state;
    const { stepComplete } = this.props;
    return (
      <Nav className="top-header step-top-bar">
        <NavbarBrand className="nav-logo" tag={Link} to="/">
          <img src={Bitmaps.logo} alt="Soapbox" />
        </NavbarBrand>
        <NavbarToggler onClick={this.toggleOpen} />
        <Collapse isOpen={isOpen} navbar>
          <Nav>
            <Navbar className="left-nav-bar">
              <NavItem>
                <NavLink tag={Link} to="/setup/plan">
                  {
                    stepComplete === false
                      ? (
                        <i className="far fa-circle" />
                      ) : (
                        <i className="fa fa-check-circle" />
                      )
                  }
                  Choose a Plan
                  <div />
                </NavLink>
              </NavItem>
              <NavItem className="profile-setup">
                <NavLink tag={Link} to="/setup/profile">
                  {
                    stepComplete === false
                      ? (
                        <i className="far fa-circle" />
                      ) : (
                        <i className="fa fa-check-circle" />
                      )
                  }
                  Setup Profile
                  <div />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/setup/members">
                  {
                    stepComplete === false
                      ? (
                        <i className="far fa-circle" />
                      ) : (
                        <i className="fa fa-check-circle" />
                      )
                  }
                  Add Team Member
                </NavLink>
              </NavItem>
            </Navbar>
            <RightNavBar />
          </Nav>
        </Collapse>
      </Nav>
    );
  }
}

StepTopBar.defaultProps = {
  stepComplete: false
};

export default StepTopBar;

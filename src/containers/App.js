import React from 'react';
import { connect } from 'react-redux';
import CardList from '../components/CardList';
import SearchBox from '../components/SearchBox';
import Scroll from '../components/Scroll';
import ErrorBoundry from '../components/ErrorBoundry';

import { setSearchField, requestRobots} from '../actions';

const mapStateToProps = state => {
  return {
    searchField: state.searchRobots.searchField,
    isPending: state.requestRobots.isPending,
    error: state.requestRobots.error,
    robots: state.requestRobots.robots,
  }
}

const mapDispatchToProps = dispatch => ({
  onSearchChange: (event) => dispatch(setSearchField(event.target.value)),
  onRequestRobots: () => requestRobots(dispatch),
})

class App extends React.Component {
  onSearchChange = (event) => {
    this.setState({ searchField: event.target.value })
  }

  render() {
    const { searchField, onSearchChange, robots } = this.props;
    const filteredRobots = robots.filter(robot => {
      return robot.name.toLowerCase().includes(searchField.toLowerCase())
    })

    return (
      <div className='tc'>
        <h1>RoboFriends</h1>
        <SearchBox searchChange={onSearchChange} />
        <Scroll>
          <ErrorBoundry>
            <CardList robots={filteredRobots} />
          </ErrorBoundry>
        </Scroll>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
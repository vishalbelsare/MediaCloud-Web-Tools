import React from 'react';
import { connect } from 'react-redux';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import { injectIntl } from 'react-intl';
// import composeAsyncContainer from '../common/AsyncContainer';
import { selectTopic, fetchTopicSummary } from '../../actions/topicActions';

class SimpleSceneContainer extends React.Component {

  componentWillMount() {
    const cameraPosition = new THREE.Vector3(0, 0, 5);
    this.setState({ cameraPosition });
  }

  componentWillReceiveProps(nextProps) {
    const { topicId, selectNewTopic } = this.props;
    if ((nextProps.topicId !== topicId)) {
      // console.log('componentWillReceiveProps');
      selectNewTopic(topicId);
    }
  }

  setupObjects = () => {
    const cubeRotation = new THREE.Euler();
    this.setState({ cubeRotation });
  }

  updateOnAnimate = () => {
    if (this.state.cubeRotation) {
      this.setState({
        cubeRotation: new THREE.Euler(
          this.state.cubeRotation.x + 0.1,
          this.state.cubeRotation.y + 0.1,
          0
        ),
      });
    } else {
      this.setupObjects();
    }
  }

  render() {
    const width = window.innerWidth; // canvas width
    const height = window.innerHeight; // canvas height

    return (
      <React3
        mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
        width={width}
        height={height}

        onAnimate={this.updateOnAnimate}
      >
        <scene>
          <perspectiveCamera
            name="camera"
            fov={75}
            aspect={width / height}
            near={0.1}
            far={1000}

            position={this.state.cameraPosition}
          />
          <mesh rotation={this.state.cubeRotation} >
            <boxGeometry
              width={1}
              height={1}
              depth={1}
            />
            <meshBasicMaterial
              color={0x00ff00}
            />
          </mesh>
        </scene>
      </React3>
    );
  }
}

SimpleSceneContainer.propTypes = {
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  topicInfo: React.PropTypes.object,
  // from parent
  topicId: React.PropTypes.number,
  // from dispatch
  intl: React.PropTypes.object.isRequired,
  asyncFetch: React.PropTypes.func.isRequired,
  selectNewTopic: React.PropTypes.func,
  // from state
  filters: React.PropTypes.object.isRequired,
  needsNewSnapshot: React.PropTypes.bool.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
  filters: state.topics.selected.filters,
  fetchStatus: state.topics.selected.info.fetchStatus,
  topicInfo: state.topics.selected.info,
  topicId: parseInt(ownProps.params.topicId, 10),
  needsNewSnapshot: state.topics.selected.needsNewSnapshot,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  selectNewTopic: (topicId) => {
    dispatch(selectTopic(topicId));
    dispatch(fetchTopicSummary(ownProps.params.topicId));
  },
});


export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      SimpleSceneContainer
    )
  );

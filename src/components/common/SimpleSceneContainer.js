import React from 'react';
import { connect } from 'react-redux';
import React3 from 'react-three-renderer';
import * as THREE from 'three';
import { injectIntl } from 'react-intl';

class SimpleSceneContainer extends React.Component {

  componentWillMount() {
    const cameraPosition = new THREE.Vector3(0, 0, 5);
    this.setState({ cameraPosition });
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
  topic: React.PropTypes.object,
  // from parent
  topicId: React.PropTypes.number,
  // from dispatch
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected,
  topicId: state.topics.selected.id,
  topicInfo: state.topics.selected.info,
});


export default
  injectIntl(
    connect(mapStateToProps)(
      SimpleSceneContainer
    )
  );

import React from 'react'
import { Search360 } from '../components'
import * as THREE from 'three'
const OrbitControls = require('three-orbit-controls')(THREE)
import CubemapToEquirectangular from 'three.cubemap-to-equirectangular'

export default class Index extends React.Component{
  setCubeFaces = (cubeFaces) => {
    console.log(cubeFaces)
    const {up, down, left, right, front, back} = cubeFaces
    const scene = new THREE.Scene()
    scene.background = new THREE.CubeTextureLoader()
      .load([
        left,
        right,
        up,
        down,
        back,
        front
      ])
    const camera = new THREE.PerspectiveCamera( 70, window.innerWidth/window.innerHeight, 0.1, 1000 )
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize( window.innerWidth - 200, window.innerHeight );
    this.mount.appendChild( renderer.domElement );
    const controls = new OrbitControls( camera, renderer.domElement );

    camera.position.z = 5;
    camera.position.set( 1,1,1 );

    const equiManaged = new CubemapToEquirectangular( renderer, true );
  
    var animate = function () {
      requestAnimationFrame( animate );
      controls.update();
      renderer.render( scene, camera );
      // console.log('callinggg!!!')
      // equiManaged.update(camera, scene)
    };
    animate();
  }

  render() {
    return (
      <div className="p-12">
        <Search360 setCubeFaces={this.setCubeFaces}/>
        <div ref={ref => (this.mount = ref)} />
      </div>
    )
  }
}
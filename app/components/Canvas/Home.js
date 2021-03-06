import { map } from 'lodash'
import { Plane, Transform } from 'ogl'

import Media from './Media'

export default class Home {
  constructor({ gl, scene }) {
    this.gl = gl

    this.group = new Transform()

    this.medias = document.querySelectorAll('.home__gallery__media__image')
    this.createGeometry()
    this.createGallery()

    this.group.setParent(scene)
  }

  createGeometry() {
    this.geometry = new Plane(this.gl)
  }

  createGallery() {
    map(this.medias, (element, index) => {
      return new Media({
        element,
        geometry: this.geometry,
        index,
        scene: this.group,
        gl: this.gl
      })
    })
  }
}
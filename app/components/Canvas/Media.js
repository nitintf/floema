import { Mesh, Program, Texture } from 'ogl'

import vertex from "shaders/plane-vertex.glsl";
import fragment from "shaders/plane-fragment.glsl";

export default class Media {
  constructor({element, geometry, gl, scene, index}) {
    this.element = element
    this.gl = gl
    this.geometry = geometry
    this.scene = scene
    this.index = index

    this.createTexture()
    this.createProgram()
    this.createMesh()
  }

  createTexture() {
    this.texture = new Texture(this.gl)

    this.image = new window.Image()
    this.image.crossOrigin = 'anonymous'
    this.image.src = this.element.getAttribute('data-src')
    this.image.onload = _ => (this.texture.image = this.image)
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      program: this.program,
      geometry: this.geometry
    })

    this.mesh.setParent(this.scene)

    this.mesh.position.x += this.index * this.mesh.scale.x

  }

  createProgram() {
    this.program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms: {
        tMap: {value : this.texture}
      }
    })
  }
} `x`
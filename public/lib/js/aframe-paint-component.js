/**
 * Aframe application file
 * 
 * @author sidthekidder
 */

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.')
}

AFRAME.registerComponent('paint', {
  schema: {
      texture: {
        type: 'number',
        default: 0
      },
      mesh: {
        type: 'number',
        default: 0
      }
  },

  init: function() {

    // setup canvas
    var canvas = document.createElement('canvas')
    CanvasHelper.initializeCanvas(canvas)
    FileHelper.openImage("sample")

    // get texture from canvas
    this.data.texture = new THREE.Texture(CanvasHelper.getCanvas())

    // apply the texture to VR sphere
    var material = new THREE.MeshBasicMaterial({ map: this.data.texture })
    var geometry = new THREE.SphereGeometry(10, 60, 60)
    this.data.mesh = new THREE.Mesh(geometry, material)

    // set sphere inside out and link it to the Object3D
    this.data.mesh.scale.x = -1
    this.el.setObject3D('mesh', this.data.mesh)
  },

  tick: function() {
    this.data.texture.needsUpdate = true
  }
})
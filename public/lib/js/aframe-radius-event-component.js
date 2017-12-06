
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.')
}

/**
 * Radius-Event component for A-Frame.
 */
AFRAME.registerComponent('radius', {
  schema: {
      rx: {
          type: 'number',
          default: 0
      },
      rz: {
          type: 'number',
          default: 0
      }
  },

  tick: function() {
    var pos = document.getElementById("camera").getAttribute("position")
    if ((Math.abs(this.data.rx - pos.x) < 3) && (Math.abs(this.data.rz - pos.z) < 3)) {
      this.el.components.sound.play()
    } else {
      this.el.components.sound.pause()
    }
  },
})
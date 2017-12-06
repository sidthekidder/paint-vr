
if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.')
}


/**
 * Radius-Event component for A-Frame.
 */
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

    // setup texture
    var message = 'sample msg'
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')

    var raycaster = new THREE.Raycaster(); // create once and reuse

    // write a message initially
    canvas.width = 1024, canvas.height = 2048
    var img = new Image();
    img.onload = function () {
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(img, 0, 0, 1024, 2048);
    }
    img.src = "public/images/sample.jpg";

    // create texture from canvas and apply to sphere
    this.data.texture = new THREE.Texture(canvas)
    var material = new THREE.MeshBasicMaterial({ map: this.data.texture })
    var geometry = new THREE.SphereGeometry(10, 60, 60)
    this.data.mesh = new THREE.Mesh(geometry, material)
    
    // set circle inside out, camera is at center
    this.data.mesh.scale.x = -1
    this.el.setObject3D('mesh', this.data.mesh)
    var el = this.el;
    var that = this

    // document.addEventListener("mousemove", function(evt) {
    //   var cameraRotation = document.getElementById("camera").components.camera.camera.parent.rotation
    //   var rotX = cameraRotation.y, rotY = cameraRotation.x
      
    //   rotX = Math.abs(768.3269476362001 - (rotX * 163.473818646))
    //   console.log(rotX)
    // })

    var touchEvent = function(evt) {
      var cameraRotation = document.getElementById("camera").components.camera.camera.parent.rotation
      ctx.fillStyle = 'red'
      // 2 mappings
      // first mapping from angle to angle*step
      // second mapping from angle*step to texture coordinates

      // first mapping
      // map horizontal values from (4.7, -1.564) to (0, 1024) - step = 163.473818646 (which comes out (768.3269476362001 to -255.67305236234404) )
      // map vertical values from (-1.5707963267948966, 1.5707963267948966) to (0, 2048) - step = 651.898646904 (which comes out (257 to -222) )
      var rotX = cameraRotation.y, rotY = cameraRotation.x
      if (rotX > 4.9) {
        while (rotX > 4.9)
          rotX -= (4.7 + 1.564)
      }
      else if (rotX < -1.564) {
        while (rotX < -1.564)
          rotX += (4.7 + 1.564)
      }
      // or this would also work
      // if (rotX > 1025)
      //   rotX = rotX % 1025

      // second mapping
      // map vertical values from (257, -222) to (0, 2048) - formula = 257 - rotY*step (step=0.23388671875)
      // map horizontal values from (768.3269476362001, -255.67305236234404) to (0, 1024) - formula = 768.3269476362001 - rotX
      rotX = Math.abs(768.3269476362001 - (rotX * 163.473818646))
      rotY = 1024 - rotY * 651.898646904

      ctx.fillRect(rotX, rotY, 4, 4)
      console.log('filling ' + rotX + ', ' + rotY)
    } 

    document.addEventListener("click", touchEvent)

    document.addEventListener("touchstart", touchEvent)
  },

  tick: function() {
    this.data.texture.needsUpdate = true
  },

  update: function() {

  }
})
var EventsHelper = new EventsHelper_Class()

function EventsHelper_Class() {

  this.isClicked = false

  this.last_X = false

  this.last_Y = false

  this.getCoords = function() {
    var cameraRotation = document.getElementById("camera").components.camera.camera.parent.rotation
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

    return {x: rotX, y: rotY}
  }

  this.setupHandlers = function(canvas) {
    document.onmousedown = this.mouseDown
    document.onmousemove = this.mouseMove
    document.onmouseup = this.mouseRelease
    document.onpaste = this.paste

    document.addEventListener("touchstart", this.mouseDown)
    document.addEventListener("touchmove", this.mouseMove)
    document.addEventListener("touchend", this.mouseRelease)
  }

  this.mouseDown = function(evt) {
    // get coordinates on canvas and send to ToolsHelper
    this.isClicked = true

    var coords = EventsHelper.getCoords()
    console.log(coords)
    
    ToolsHelper.drawPoint(coords)

    // update the last X,Y coords
    this.last_X = coords['x'], this.last_Y = coords['y']
  }

  this.mouseMove = function(evt) {
    if (this.isClicked) {

      var cameraRotation = document.getElementById("camera").components.camera.camera.parent.rotation
      var rotX = cameraRotation.y, rotY = cameraRotation.x
      if (rotX > 4.9) {
        while (rotX > 4.9)
          rotX -= (4.7 + 1.564)
      }
      else if (rotX < -1.564) {
        while (rotX < -1.564)
          rotX += (4.7 + 1.564)
      }
      rotX = Math.abs(768.3269476362001 - (rotX * 163.473818646))
      rotY = 1024 - rotY * 651.898646904

      if (this.last_X != false && this.last_Y != false) {
        dist_X = this.last_X - rotX
        dist_Y = this.last_Y - rotY
        distance = Math.sqrt((dist_X * dist_X) + (dist_Y * dist_Y))
        radiance = Math.atan2(dist_Y, dist_X)

        for (var i = 0; i < distance; i++) {
          temp_X = Math.round(rotX + Math.cos(radiance) * i)
          temp_Y = Math.round(rotY + Math.sin(radiance) * i)

          ToolsHelper.drawPoint({x: temp_X, y: temp_Y})
        }
      }
      ToolsHelper.drawPoint({x: rotX, y: rotY})
      // update the last X,Y coords
      this.last_X = rotX, this.last_Y = rotY
    }
  }

  this.mouseRelease = function(evt) {
    this.isClicked = false
    var cameraRotation = document.getElementById("camera").components.camera.camera.parent.rotation
    var rotX = cameraRotation.y, rotY = cameraRotation.x
    if (rotX > 4.9) {
      while (rotX > 4.9)
        rotX -= (4.7 + 1.564)
    }
    else if (rotX < -1.564) {
      while (rotX < -1.564)
        rotX += (4.7 + 1.564)
    }
    rotX = Math.abs(768.3269476362001 - (rotX * 163.473818646))
    rotY = 1024 - rotY * 651.898646904

    // update the last X,Y coords
    this.last_X = rotX, this.last_Y = rotY
  }

  this.paste = function(evt) {
    if (evt.clipboardData) {
      var items = evt.clipboardData.items;
      if (items) {
        //access data directly
        for (var i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            //image
            var blob = items[i].getAsFile()
            var URLObj = window.URL || window.webkitURL
            var source = URLObj.createObjectURL(blob)

            var coords = EventsHelper.getCoords()
            console.log(coords)

            var pastedImage = new Image()
            pastedImage.onload = function () {

              ToolsHelper.drawImage(pastedImage,  {x: 542.406130267428, y: 831.0380005164159})
            }
            pastedImage.src = source
          }
        }
        evt.preventDefault()
      }
    }
  }
}

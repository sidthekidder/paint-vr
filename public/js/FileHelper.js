var FileHelper = new FileHelper_Class()

function FileHelper_Class() {

  this.filename = 'sample'

  this.openImage = function(path) {
    var context = CanvasHelper.getContext()

    // check if sample image requested
    if (typeof path == 'string') {
      if (path == 'sample') {
        var img = new Image()

        img.onload = function () {
          context.imageSmoothingEnabled = false
          context.drawImage(img, 0, 0, 1024, 2048)
        }
        img.src = "public/images/sample.jpg"
        return
      }
    }

    var reader = new FileReader()
    var that = this
    reader.onload = function (e) {
      var img = new Image()
        
      img.onload = function () {
        context.imageSmoothingEnabled = false
        context.drawImage(img, 0, 0, 1024, 2048)
      }
      img.onerror = function (ex) {
        ErrorHelper.error('The image could not be opened.')
        ErrorHelper.error(ex)
      }
      img.src = e.target.result
      that.filename = path.name.split('\\').pop().split('/').pop()
    }
    reader.readAsDataURL(path)
  }

  this.saveImage = function() {
    var tempCanvas = CanvasHelper.getCanvas()
    var filename = this.filename
    tempCanvas.toBlob(function(blob) {
      saveAs(blob, filename)
    })
  }
}

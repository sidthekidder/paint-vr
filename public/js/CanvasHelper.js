var CanvasHelper = new CanvasHelper_Class()

function CanvasHelper_Class() {

  this.canvas = {}

  this.context = {}

  this.initializeCanvas = function(canvas) {
    this.canvas = canvas
    this.context = canvas.getContext('2d')

    this.canvas.width = 1024
    this.canvas.height = 2048

    ToolsHelper.setupToolbar()
    EventsHelper.setupHandlers()
  }

  this.getCanvas = function() {
    return this.canvas
  }

  this.getContext = function() {
    return this.context
  }
}
var ToolsHelper = new ToolsHelper_Class()

function ToolsHelper_Class() {

  // drawing tools
  this.tools = [
    {name: 'pencil', title: 'Pencil', colwidth: 'col-md-1', icon: [['pencil_small.png'], 1.5, 1.5], attributes: {}},
    {name: 'pencil2', title: 'Pencil2', colwidth: 'col-md-2', icon: [['pencil.png'], 2, 2], attributes: {}},
    {name: 'eraser', title: 'Eraser', colwidth: 'col-md-2', icon: [['erasor.png'], 2, 2], attributes: {}}
  ]

  // initially selected tool
  this.active_tool = 'pencil'

  // initially selected color
  this.active_color = '#000'

  this.setupToolbar = function() {
    ////////////////////////////////////////
    ///// render tools menu
    ////////////////////////////////////////
    var html = ''
    for (var i in this.tools) {
      html += '<div class="' + this.tools[i].colwidth + '"><img title="' + this.tools[i].title + '" '
            + 'src="public/images/' + this.tools[i].icon[0] + '"' 
            + ' style="height:' + this.tools[i].icon[1] + 'em; width:' + this.tools[i].icon[2] + 'em;"'
      if (this.tools[i].name == this.active_tool)
        html += ' class="active"'
      html += ' onclick="ToolsHelper.setActiveTool(\'' + this.tools[i].name + '\');"'
      html += ' id="' + this.tools[i].name + '"></div>'
    }
    document.getElementsByClassName("tools_menu")[0].innerHTML = html
  }

  this.setActiveTool = function(tool) {
    this.active_tool = tool
  }

  this.setActiveColor = function(color) {
    this.active_color = color
  }

  this.getActiveColor = function() {
    return this.active_color
  }

  this.drawPoint = function(coords) {
    var context = CanvasHelper.getContext()

    switch(this.active_tool) {
      case 'pencil': 
        context.fillStyle = this.active_color
        context.fillRect(coords.x, coords.y, 2, 8)
        break;
      case 'pencil2':
        context.fillStyle = this.active_color
        context.fillRect(coords.x, coords.y, 16, 64)
        break;
      case 'eraser':
        context.fillStyle = '#FFF'
        context.fillRect(coords.x, coords.y, 4, 16)
        break;
      default:
        // do nothing
    }    
  }

  this.drawImage = function(imageData, coords) {
    var ctx = CanvasHelper.getContext()

    ctx.drawImage(imageData, 0, 0)
  }
}

/**
 * main application file
  * 
 * @author sidthekidder
 */







 

// base canvas 
var canvas = document.createElement('canvas')    // main layer

// global settings
var WIDTH = 1024          //canvas midth
var HEIGHT = 2045         //canvas height
var COLOR = '#0000ff';    //active color

// drawing tools
var DRAW_TOOLS_CONFIG = [
  {name: 'pencil', title: 'Pencil', icon: [['pencil.png'], 50, 50, attributes: {}}
]

// setup texture for canvas
var canvas = document.createElement('canvas')
var ctx = canvas.getContext('2d')

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


// DRAW HELPERS
//left menu
var html = ''
for (var i in DRAW_TOOLS_CONFIG) {
  html += '<a title="' + DRAW_TOOLS_CONFIG[i].title + '"'
  html += ' style="background: #989898 url(\'img/' + DRAW_TOOLS_CONFIG[i].icon[0] + '\') no-repeat ' + DRAW_TOOLS_CONFIG[i].icon[1] + 'px ' + DRAW_TOOLS_CONFIG[i].icon[2] + 'px;"'
  if (DRAW_TOOLS_CONFIG[i].name == DRAW.active_tool)
    html += ' class="active trn"'
  else
    html += ' class="trn"'
  html += ' onclick="return GUI.action(\'' + DRAW_TOOLS_CONFIG[i].name + '\');"'
  html += ' id="' + DRAW_TOOLS_CONFIG[i].name + '"'
  html += ' href="#"></a>' + "\n"
}
document.getElementById("menu_left_container").innerHTML = html

//draw colors
var html = '';
var colors_data = [
  ['#ff0000', '#ff5b31', '#ffa500', '#ff007f', '#ff00ff'], //red
  ['#00ff00', '#008000', '#7fff00', '#00ff7f', '#8ac273'], //green
  ['#0000ff', '#007fff', '#37629c', '#000080', '#8000ff'], //blue
  ['#ffff00', '#ffff80', '#ddd06a', '#808000', '#bcb88a'], //yellow
  ['#ffffff', '#c0c0c0', '#808080', '#404040', '#000000'], //grey
];
for (var i in colors_data) {
  for (var j in colors_data[i]) {
    html += '<div style="background-color:' + colors_data[i][j] + ';" class="mini-color" onclick="GUI.set_color(this);"></div>' + "\n";
  }
  html += '<div style="clear:both;"></div>' + "\n";
}
document.getElementById("all_colors").innerHTML = html;



//////////////////////////////
////// FILE HANDLER
//////////////////////////////

function open() {
  var self = this;
  
  document.getElementById("tmp").innerHTML = ''
  var a = document.createElement('input')
  a.setAttribute("id", "file_open")
  a.type = 'file'
  document.getElementById("tmp").appendChild(a);

  document.getElementById('file_open').addEventListener('change', function (e) {
    // handle file opening
    var f = e.target.files[0]
    var f = files[i]
    if (!f.type.match('image.*')){
      console.log('Wrong file type, must be image or json.');
      continue;
    }
    this.SAVE_NAME = f.name.split('.')[f.name.split('.').length - 2]

    var FR = new FileReader();
    FR.file = f

    FR.onload = function (event) {
      if (this.file.type.match('image.*')) {
        var img = new Image()
        var _this = this

        img.onload = function () {
          CanvasHelper.create_canvas(_this.file.name)
        }
        img.onerror = function (ex) {
          window.alert('<b>The image could not be loaded.<br /><br /></b>')
        }
        img.src = data
        LAYER.layer_add(this.file.name, event.target.result, this.file.type);

        this.file_info = {
          general: []
        };

        //general
        if(this.file.name != undefined)
          FILE.file_info.general.Name = this.file.name;
        if(this.file.type != undefined)
          FILE.file_info.general.Type = this.file.type;
        if(this.file.lastModifiedDate != undefined)
          FILE.file_info.general['Last modified'] = this.file.lastModifiedDate;
      }
    }
  }, false);

  //force click
  document.querySelector('#file_open').click();
};









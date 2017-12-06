var GUI = new GUI_CLASS();


// manages graphic interface functionality: left sidebar actions
function GUI_CLASS() {
  
  /**
   * preview mini window size on right sidebar
   */
  this.PREVIEW_SIZE = {w: 148, h: 100};
  
  /**
   * last used menu id
   */
  this.last_menu = '';
  
  /**
   * grid dimensions config
   */
  this.grid_size = [50, 50];
  
  /**
   * if grid is visible
   */
  this.grid = false;
  
  /**
   * true if using transparecy, false if using white background
   */
  this.TRANSPARENCY = true;
  
  /**
   * zoom level, original - 100%, can vary from 10% to 1000%
   */
  this.ZOOM = 100;
  
  /**
   * visible part center coordinates, when zoomed in
   */
  this.zoom_center = [50, 50];
  
  /**
   * common image dimensions
   */
  this.common_dimensions = [
      [640,480], //480p
      [800,600], //SVGA
      [1024,768], //XGA 
      [1280,720], //hdtv, 720p
      [1600,1200], //UXGA
      [1920,1080], //Full HD, 1080p
      [3840,2160], //4K UHD
      [7680,4320], //8K UHD
    ];
  
  /**
   * last color copy
   */
  var COLOR_copy;
  
  this.draw_helpers = function () {
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
  };
  
  this.draw_background = function (canvas, W, H, gap, force) {
    if (this.TRANSPARENCY == false && force == undefined) {
      canvas.beginPath();
      canvas.rect(0, 0, W, H);
      canvas.fillStyle = "#ffffff";
      canvas.fill();
      return false;
    }
    if (gap == undefined)
      gap = 10;
    var fill = true;
    for (var i = 0; i < W; i = i + gap) {
      if (i % (gap * 2) == 0)
        fill = true;
      else
        fill = false;
      for (var j = 0; j < H; j = j + gap) {
        if (fill == true) {
          canvas.fillStyle = '#eeeeee';
          canvas.fillRect(i, j, gap, gap);
          fill = false;
        }
        else
          fill = true;
      }
    }
  };
  
  this.update_attribute = function (object, next_value) {
    var max_value = 500;
    for (var k in this.action_data().attributes) {
      if (k != object.id)
        continue;
      if (this.action_data().attributes[k] === true || this.action_data().attributes[k] === false) {
        //true / false
        var value;
        if (next_value == 0)
          value = true;
        else
          value = false;
        //save
        this.action_data().attributes[k] = value;
        this.show_action_attributes();
      }
      else if (typeof this.action_data().attributes[k] == 'object') {
        //select
        
        var selected = object.options[object.selectedIndex];
        var value = selected.getAttribute('data-value');
        
        var key = k.replace("_values", "");
        this.action_data().attributes[key] = value;
      }
      else if (this.action_data().attributes[k][0] == '#') {
        //color
        var key = k.replace("_values", "");
        this.action_data().attributes[key] = object.value;
      }
      else {
        //numbers
        if (next_value != undefined) {
          if (next_value > 0) {
            if (parseInt(this.action_data().attributes[k]) == 0)
              object.value = 1;
            else if (parseInt(this.action_data().attributes[k]) == 1)
              object.value = 5;
            else if (parseInt(this.action_data().attributes[k]) == 5)
              object.value = 10;
            else
              object.value = parseInt(this.action_data().attributes[k]) + next_value;
          }
          else if (next_value < 0) {
            if (parseInt(this.action_data().attributes[k]) == 1)
              object.value = 0;
            else if (parseInt(this.action_data().attributes[k]) <= 5)
              object.value = 1;
            else if (parseInt(this.action_data().attributes[k]) <= 10)
              object.value = 5;
            else if (parseInt(this.action_data().attributes[k]) <= 20)
              object.value = 10;
            else
              object.value = parseInt(this.action_data().attributes[k]) + next_value;
          }

          if (object.value < 0)
            object.value = 0;
          if (object.value > max_value)
            object.value = max_value;
        }
        else {
          if (object.value.length == 0)
            return false;
          object.value = parseInt(object.value);
          object.value = Math.abs(object.value);
          if (object.value == 0 || isNaN(object.value) || value > max_value)
            object.value = this.action_data().attributes[k];
        }
        if (k == 'power' && object.value > 100)
          object.value = 100;

        //save
        this.action_data().attributes[k] = object.value;

        document.getElementById(k).value = object.value;
      }
      if (this.action_data().on_update != undefined){
        DRAW[this.action_data().on_update](object.value);
      }
    }
    
    //custom
    if(DRAW.active_tool == 'erase'){
      var strict = this.action_data().attributes.strict;
      var is_circle = GUI.action_data().attributes.circle;
      
      if(is_circle == false){
        //hide strict controlls
        document.getElementById('strict').style.display = 'none';
      }
      else{
        //show strict controlls
        document.getElementById('strict').style.display = 'block';
      }
    }
  };
  
  this.action = function (key) {
    DRAW[key]('init', {valid: true});
    if (DRAW.active_tool == key)
      return false;

    //change
    if (DRAW.active_tool != '')
      document.getElementById(DRAW.active_tool).className = "";
    DRAW.active_tool = key;
    document.getElementById(key).className = "active trn";
    this.show_action_attributes();

    return false;
  };
  
  this.action_data = function () {
    for (var i in DRAW_TOOLS_CONFIG) {
      if (DRAW_TOOLS_CONFIG[i].name == DRAW.active_tool)
        return DRAW_TOOLS_CONFIG[i];
    }
  };
  
  /**
   * used strings: 
   * "Fill", "Square", "Circle", "Radial", "Anti aliasing", "Circle", "Strict", "Burn"
   */
  this.show_action_attributes = function () {
    html = '';
    var step = 10;
    for (var k in this.action_data().attributes) {
      var title = k[0].toUpperCase() + k.slice(1);
      title = title.replace("_", " ");
      if (this.action_data().attributes[k + "_values"] != undefined)
        continue;
      if (this.action_data().attributes[k] === true || this.action_data().attributes[k] === false) {
        //true / false
        if (this.action_data().attributes[k] == true)
          html += '<div onclick="GUI.update_attribute(this, 1)" style="background-color:#5680c1;" class="attribute-area trn" id="' + k + '">' + title + '</div>';
        else
          html += '<div onclick="GUI.update_attribute(this, 0)" class="attribute-area trn" id="' + k + '">' + title + '</div>';
      }
      else if (typeof GUI.action_data().attributes[k] == 'object') {
        //drop down select
        html += '<select style="font-size:11px;margin-bottom:10px;" onchange="GUI.update_attribute(this);" id="' + k + '">';
        for (var j in GUI.action_data().attributes[k]) {
          var sel = '';
          var key = k.replace("_values", "");
          if (GUI.action_data().attributes[key] == GUI.action_data().attributes[k][j])
            sel = 'selected="selected"';
          html += '<option class="trn" ' + sel + ' name="' + GUI.action_data().attributes[k][j] + '" data-value="'+GUI.action_data().attributes[k][j]+'">' + GUI.action_data().attributes[k][j] + '</option>';
        }
        html += '</select>';
      }
      else if (GUI.action_data().attributes[k][0] == '#') {
        //color
        html += '<table style="width:100%;">';  //table for 100% width
        html += '<tr>';
        html += '<td style="font-weight:bold;width:45px;">' + title + ':</td>';
        html += '<td><input onchange="GUI.update_attribute(this);" type="color" id="' + k + '" value="' + GUI.action_data().attributes[k] + '" /></td>';
        html += '</tr>';
        html += '</table>';
      }
      else {
        //numbers
        html += '<div id="' + k + '_container">';
        html += '<table style="width:100%;">';  //table for 100% width
        html += '<tr>';
        html += '<td style="font-weight:bold;padding-right:2px;white-space:nowrap;" class="trn">' + title + ':</td>';
        html += '<td><input onKeyUp="GUI.update_attribute(this);" type="number" id="' + k + '" value="' + GUI.action_data().attributes[k] + '" /></td>';
        html += '</tr>';
        html += '</table>';
        html += '<div style="float:left;width:32px;" onclick="GUI.update_attribute(this, ' + (step) + ')" class="attribute-area" id="' + k + '">+</div>';
        html += '<div style="margin-left:48px;margin-bottom:15px;" onclick="GUI.update_attribute(this, ' + (-step) + ')" class="attribute-area" id="' + k + '">-</div>';
        html += '</div>';
      }
    }
    document.getElementById("action_attributes").innerHTML = html;
    
    //retranslate
    HELP.help_translate(LANG);
  };
  
  this.set_color = function (object) {
    if (HELPER.chech_input_color_support('main_color') == true && object.id == 'main_color')
      COLOR = object.value;
    else
      COLOR = HELPER.rgb2hex_all(object.style.backgroundColor);
    COLOR_copy = COLOR;

    if (HELPER.chech_input_color_support('main_color') == true)
      document.getElementById("main_color").value = COLOR; //supported
    else
      document.getElementById("main_color_alt").style.backgroundColor = COLOR; //not supported

    document.getElementById("color_hex").value = COLOR;
    var colors = HELPER.hex2rgb(COLOR);
    document.getElementById("rgb_r").value = colors.r;
    document.getElementById("rgb_g").value = colors.g;
    document.getElementById("rgb_b").value = colors.b;
  };
  
  this.set_color_manual = function (event) {
    var object = event.target;
    if (object.value.length == 6 && object.value[0] != '#') {
      COLOR = '#' + object.value;
      this.sync_colors();
    }
    if (object.value.length == 7) {
      COLOR = object.value;
      this.sync_colors();
    }
    else if (object.value.length > 7)
      object.value = COLOR;
  };
  
  this.set_color_rgb = function (object, c) {
    var colors = HELPER.hex2rgb(COLOR);
    if (object.value.length > 3) {
      object.value = colors[c];
    }
    else if (object.value.length > 0) {
      value = object.value;
      value = parseInt(value);
      if (isNaN(value) || value != object.value || value > 255 || value < 0) {
        object.value = colors[c];
        return false;
      }
      COLOR = "#" + ("000000" + HELPER.rgbToHex(document.getElementById("rgb_r").value, document.getElementById("rgb_g").value, document.getElementById("rgb_b").value)).slice(-6);
      ALPHA = document.getElementById("rgb_a").value;
      document.getElementById("rgb_a").value = ALPHA;
      this.sync_colors();
    }
  };
  
  this.sync_colors = function () {
    document.getElementById("color_hex").value = COLOR;

    if (HELPER.chech_input_color_support('main_color') == true)
      document.getElementById("main_color").value = COLOR; //supported
    else
      document.getElementById("main_color_alt").style.backgroundColor = COLOR; //not supported

    var colors = HELPER.hex2rgb(COLOR);
    document.getElementById("rgb_r").value = colors.r;
    document.getElementById("rgb_g").value = colors.g;
    document.getElementById("rgb_b").value = colors.b;
  };
  
  this.toggle_color_select = function () {
    if (POP.active == false) {
      POP.add({
        title: 'Color:', 
        function: function () {
          COLOR_copy = COLOR;
          var html = '<canvas style="position:relative;margin-bottom:5px;" id="c_all" width="300" height="300"></canvas>';
          html += '<table>';
          html += '<tr>';
          html += '  <td><b>Luminosity:</b></td>';
          html += '  <td><input id="lum_ranger" oninput="GUI.change_lum(this.value);document.getElementById(\'lum_preview\').innerHTML=this.value;" type="range" value="0" min="-255" max="255" step="1"></td>';
          html += '  <td style="padding-left:10px;width:30px;" id="lum_preview">0</td>';
          html += '</tr>';
          html += '<tr>';
          html += '  <td><b>Alpha:</b></td>';
          html += '  <td><input oninput="GUI.change_alpha(this.value);document.getElementById(\'alpha_preview\').innerHTML=this.value;" type="range" value="' + ALPHA + '" min="0" max="255" step="1"></td>';
          html += '  <td style="padding-left:10px;" id="alpha_preview">' + ALPHA + '</td></tr>';
          html += '</tr>';
          html += '</table>';
          return html;
        }
      });
      POP.show(
        'Select color', 
        function (user_response) {
          var param1 = parseInt(user_response.param1);
        },
        undefined,
        this.toggle_color_select_onload
      );
    }
    else{
      POP.hide();
    }
  };

  this.toggle_color_select_onload = function () {
    var img = new Image();
    img.onload = function () {
      document.getElementById("c_all").getContext("2d").drawImage(img, 0, 0);
      document.getElementById("c_all").onmousedown = function (event) {
        if (event.offsetX) {
          mouse_x = event.offsetX;
          mouse_y = event.offsetY;
        }
        else if (event.layerX) {
          mouse_x = event.layerX;
          mouse_y = event.layerY;
        }
        var c = document.getElementById("c_all").getContext("2d").getImageData(mouse_x, mouse_y, 1, 1).data;
        COLOR = "#" + ("000000" + HELPER.rgbToHex(c[0], c[1], c[2])).slice(-6);
        this.sync_colors();
        COLOR_copy = COLOR;
        document.getElementById("lum_ranger").value = 0;
      };
    };
    img.src = 'img/colorwheel.png';
  };


  this.toggle = function(query){
    document.querySelector(query).classList.toggle("active");
  };
}
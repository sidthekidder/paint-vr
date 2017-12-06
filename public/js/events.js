var EVENTS = new EVENTS_CLASS()

// keyboard handlers
document.onkeydown = function(e) { return EVENTS.on_keyboard_action(e) }
// document.onkeyup = function(e) { return EVENTS.on_keyboardup_action(e) }

// mouse handlers
window.ondrop = function(e) { EVENTS.upload_drop(e) }
window.ondragover = function(e) { e.preventDefault() }
window.onresize = function(e){ EVENTS.on_resize() }
document.onmousedown = EVENTS.mouse_click
document.onmousemove = EVENTS.mouse_move
document.onmouseup = EVENTS.mouse_release
document.addEventListener("mousewheel", EVENTS.mouse_wheel_handler, false)
document.addEventListener("DOMMouseScroll", EVENTS.mouse_wheel_handler, false)
document.oncontextmenu = function (e) { return EVENTS.mouse_right_click(e); }

// touch handlers
document.addEventListener("touchstart", EVENTS.mouse_click, false)
document.addEventListener("touchend", EVENTS.mouse_release, false)
document.addEventListener("touchmove", EVENTS.mouse_move, false)
document.addEventListener('MSPointerDown', EVENTS.mouse_click, false)
document.addEventListener('MSPointerMove', EVENTS.mouse_move, false)
document.addEventListener('MSPointerUp', EVENTS.mouse_release, false)

// document.getElementById('color_hex').onkeyup = function (e) { GUI.set_color_manual(e); };  //on main color type
// document.getElementById('color_hex').onpaste = function (e) { GUI.set_color_manual(e); }; // on paste in main color input

// all event handling
function EVENTS_CLASS() {
  
  // mouse data, like positions, clicks
  this.mouse = {}
    
  // if user is taking a drag
  this.isDrag = false
  
  // selected area resize rect. size (controls, where you can resize area)
  this.sr_size = 8
  
  //if false, font canvas is not cleared on mouse release
  this.clear_front_on_release = true;
  
  // if canvas size was not changed - autosize possible
  var autosize = true;
  
  // mouse click positions
  var mouse_click_pos = [false, false];
  
  //last mouse move position
  var mouse_move_last = [false, false];
  
  /**
   * main canvas resize action
   */
  var resize_all = false;
  
  // if mouse was click on canvas
  var mouse_click_valid = false;
  
  /**
   * mouse click position of popup drag start
   */
  var last_pop_click = [0, 0];
  
  /**
   * popup position for dragable ability
   */
  var popup_pos = [0, 0];
  
  /**
   * if popup is dragged
   */
  var popup_dragable = false;

  //keyboard actions
  this.on_keyboard_action = function (event) {
    k = event.keyCode;  //console.log(k);

    if (k != 27) {
      //we can not touch these events!
      if (POP != undefined && POP.active == true){
        //dialog active
        return true;
      }
      if (document.activeElement.type == 'text' || document.activeElement.type == 'number'){
        //text input selected
        return true;
      }
    }
    
    else if (k == 27) {
      if (POP != undefined && POP.active == true)
        POP.hide();
      DRAW.last_line = [];
      
      DRAW.curve_points = [];
      if (DRAW.select_data != false) {
        EDIT.edit_clear();
      }
    }
    //z - undo
    else if (k == 90) {
      EDIT.undo();
    }
    //o - open
    else if (k == 79){
      FILE.open();
    }
    //s - save
    else if (k == 83) {
      if (POP != undefined)
        FILE.save_dialog(event);
    }
    return true
  }
  
  // mouse_x, mouse_y, event.pageX, event.pageY
  this.get_mouse_position = function (event) {
    if(event.changedTouches){
      //using touch events
      event = event.changedTouches[0];
    }
    var valid = true;

    var canvas_el = document.getElementById('canvas_front').getBoundingClientRect();
    var canvas_offset_x = canvas_el.left - bodyRect.left;
    var canvas_offset_y = canvas_el.top - bodyRect.top;
      
    var mouse_x = event.pageX - canvas_offset_x;
    var mouse_y = event.pageY - canvas_offset_y;
      
    // outside canvas
    if (event.target.id != "canvas") {
      valid = false
    }
    // save
    EVENTS.mouse = {
      x: mouse_x,
      y: mouse_y,
      click_x: mouse_click_pos[0],
      click_y: mouse_click_pos[1],
      last_x: mouse_move_last[0],
      last_y: mouse_move_last[1],
      valid: valid,
      click_valid: mouse_click_valid,
      abs_x: abs_x,
      abs_y: abs_y,
    }
  }

  // mouse right click
  this.mouse_right_click = function (event) {
    // do nothing!
    return
  }

  // mouse click
  this.mouse_click = function (event) {
    EVENTS.isDrag = true;
    if (POP != undefined && POP.active == true) {
      EVENTS.get_mouse_position(event)
      last_pop_click[0] = EVENTS.mouse.abs_x
      last_pop_click[1] = EVENTS.mouse.abs_y
      popup = document.getElementById('popup')
      popup_pos[0] = parseInt(popup.style.top)
      popup_pos[1] = parseInt(popup.style.left)
      
      if (event.target.id == "popup_drag")
        popup_dragable = true;
      else
        popup_dragable = false;
      return true;
    }

    EVENTS.get_mouse_position(event);
    mouse_click_pos[0] = EVENTS.mouse.x;
    mouse_click_pos[1] = EVENTS.mouse.y;
    if (event.which == 3){
      return true;
    }
    if (EVENTS.mouse.valid == false)
      mouse_click_valid = false;
    else
      mouse_click_valid = true;

    //check tools functions
    for (var i in DRAW) {
      if (i == DRAW.active_tool) {
        DRAW[i]('click', EVENTS.mouse, event);
        break;
      }
    }

    // main window resize
    resize_all = false;
    if (GUI.ZOOM == 100) {
      if (event.target.id == "resize-w")
        resize_all = "w";
      else if (event.target.id == "resize-h")
        resize_all = "h";
      else if (event.target.id == "resize-wh")
        resize_all = "wh";
    }
  };
  // mouse move
  this.mouse_move = function (event) {
    if (POP != undefined && POP.active == true) {
      // drag popup
      if (EVENTS.isDrag == true && popup_dragable == true) {
        EVENTS.get_mouse_position(event);
        popup = document.getElementById('popup');
        popup.style.top = (popup_pos[0] + EVENTS.mouse.abs_y - last_pop_click[1]) + 'px';
        popup.style.left = (popup_pos[1] + EVENTS.mouse.abs_x - last_pop_click[0]) + 'px';
      }
      return true;
    }
    EVENTS.get_mouse_position(event);
    if (event.target.id == "canvas_preview" && EVENTS.isDrag == true)
      EVENTS.calc_preview_by_mouse(EVENTS.mouse.x, EVENTS.mouse.y);
    LAYER.update_info_block();

    //main window resize
    if (GUI.ZOOM == 100) {
      if (event.target.id == "resize-w")
        document.body.style.cursor = "w-resize";
      else if (event.target.id == "resize-h")
        document.body.style.cursor = "n-resize";
      else if (event.target.id == "resize-wh")
        document.body.style.cursor = "nw-resize";
      else
        document.body.style.cursor = "auto";
      if (resize_all != false && EVENTS.isDrag == true) {
        document.body.style.cursor = "auto";
        if (resize_all == "w") {
          new_w = EVENTS.mouse.x;
          new_h = HEIGHT;
        }
        else if (resize_all == "h") {
          new_w = WIDTH;
          new_h = EVENTS.mouse.y;
        }
        else if (resize_all == "wh") {
          new_w = EVENTS.mouse.x;
          new_h = EVENTS.mouse.y;
        }
        canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
        canvas_front.lineWidth = 1;
        canvas_front.fillStyle = "#ff0000";
        EL.rectangle_dashed(canvas_front, 0, 0, new_w - 1, new_h - 1);
        event.preventDefault();
        HELPER.remove_selection();
        return false;
      }
    }
    //check tools functions
    if (EVENTS.isDrag === false) {
      for (i in DRAW) {
        if (i == DRAW.active_tool) {
          DRAW[i]('move', EVENTS.mouse, event);
          break;
        }
      }
    }


    if (EVENTS.isDrag === false)
      return false;  //only drag now

    //check tools functions
    for (var i in DRAW) {
      if (i == DRAW.active_tool) {
        DRAW[i]('drag', EVENTS.mouse, event);
        break;
      }
    }

    if (DRAW.active_tool != 'select_square')
      DRAW.select_square_action = '';

    mouse_move_last[0] = EVENTS.mouse.x;
    mouse_move_last[1] = EVENTS.mouse.y;
  };
  //release mouse click
  this.mouse_release = function (event) {
    EVENTS.isDrag = false;
    if (POP != undefined && POP.active == true)
      return true;
    EVENTS.get_mouse_position(event);
    mouse_move_last[0] = false;
    mouse_move_last[1] = false;
    
    if (DRAW.select_square_action == '' && EVENTS.mouse.valid == true)
      DRAW.select_data = false;

    //check tools functions
    if (EVENTS.clear_front_on_release == true)
      canvas_front.clearRect(0, 0, WIDTH, HEIGHT);
    GUI.draw_selected_area();
    for (var i in DRAW) {
      if (i == DRAW.active_tool) {
        DRAW[i]('release', EVENTS.mouse, event);
        break;
      }
    }

    //main window resize
    if (resize_all != false && GUI.ZOOM == 100 && EVENTS.mouse.x > 0 && EVENTS.mouse.y > 0) {
      EDIT.save_state();
      EVENTS.autosize = false;
      document.body.style.cursor = "auto";
      if (resize_all == "w")
        WIDTH = EVENTS.mouse.x;
      else if (resize_all == "h")
        HEIGHT = EVENTS.mouse.y;
      else if (resize_all == "wh") {
        WIDTH = EVENTS.mouse.x;
        HEIGHT = EVENTS.mouse.y;
      }
      LAYER.set_canvas_size();
      GUI.zoom();
    }
    resize_all = false;
    GUI.zoom();
  };
  //upload drop zone
  this.upload_drop = function (e) {
    e.preventDefault();
    EDIT.save_state();
    var n_valid = 0;
    for (var i = 0, f; i < e.dataTransfer.files.length; i++) {
      f = e.dataTransfer.files[i];
      if (!f.type.match('image.*') && !f.name.match('.json'))
        continue;
      n_valid++;

      var FR = new FileReader();
      FR.file = e.dataTransfer.files[i];

      if (e.dataTransfer.files.length == 1)
        FILE.SAVE_NAME = f.name.split('.')[f.name.split('.').length - 2];

      FR.onload = function (event) {
        if (this.file.type.match('image.*')) {
          //image
          LAYER.layer_add(this.file.name, event.target.result, this.file.type);
          FILE.save_file_info(this.file);
        }
        else {
          //json
          var responce = FILE.load_json( event.target.result );
          if (responce === true)
            return false;
        }
      };
      if (f.type == "text/plain")
        FR.readAsText(f);
      else if (f.name.match('.json'))
        FR.readAsText(f);
      else
        FR.readAsDataURL(f);
    }
  };
  this.mouse_wheel_handler = function (e) {  //return true;
    e.preventDefault();
    //zoom
    // if (EVENTS.ctrl_pressed == true) {
    //   var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
    //   if(delta > 0)
    //     GUI.zoom(+1, true);
    //   else
    //     GUI.zoom(-1, true);
      
    //   return false;
    // }
  };
  this.scroll_window = function() {
    // var canvas_wrapper = document.querySelector('#canvas_wrapper');
    // var visible_w = canvas_wrapper.clientWidth / GUI.ZOOM * 100;
    // var visible_h = canvas_wrapper.clientHeight / GUI.ZOOM * 100;
    
    // if(this.mouse.valid == true){
    //   GUI.zoom_center = [this.mouse.x/WIDTH*100, this.mouse.y/HEIGHT*100];
    // }
    
    // //scroll to - convert center % coordinates to top/left px, and translate to current zoom
    // if(this.mouse.valid == true){
    //   //using exact position
    //   xx = (GUI.zoom_center[0] * WIDTH  / 100 - visible_w * GUI.zoom_center[0]/100) * GUI.ZOOM / 100;
    //   yy = (GUI.zoom_center[1] * HEIGHT / 100 - visible_h * GUI.zoom_center[1]/100) * GUI.ZOOM / 100;
    // }
    // else{
    //   //using center
    //   xx = (GUI.zoom_center[0] * WIDTH  / 100 - visible_w / 2) * GUI.ZOOM / 100;
    //   yy = (GUI.zoom_center[1] * HEIGHT / 100 - visible_h / 2) * GUI.ZOOM / 100;
    // }
    
    // canvas_wrapper.scrollLeft = xx;
    // canvas_wrapper.scrollTop = yy;

  };
  this.calc_preview_by_mouse = function (mouse_x, mouse_y) {
    GUI.zoom_center[0] = mouse_x / GUI.PREVIEW_SIZE.w * 100;
    GUI.zoom_center[1] = mouse_y / GUI.PREVIEW_SIZE.h * 100;
    
    GUI.zoom(undefined, true);
    return true;
  };
  this.on_resize = function(){
    GUI.redraw_preview();
    
    //recalc popup position
    var dim = HELPER.get_dimensions();
    popup = document.getElementById('popup');
    popup.style.top = 150 + 'px';
    popup.style.left = Math.round(dim[0] / 2) + 'px';
    
    document.querySelector('#sidebar_left').classList.remove("active");
    document.querySelector('#sidebar_right').classList.remove("active");
  };
}
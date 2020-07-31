(function () {
  "use strict";

  // // Drag
  // var offset = new createjs.Point();
  // function startDrag(event) {
  //     offset.x = stage.mouseX - dragContainer.x;
  //     offset.y = stage.mouseY - dragContainer.y;
  //     event.addEventListener("mousemove", doDrag);   
  // }
  // function doDrag(event) {
  //     dragContainer.x = event.stageX - offset.x;
  //     dragContainer.y = event.stageY - offset.y;
  // }

  // // Update the stage
  // function tick(event) {
  //     stage.update();
  // }

  /**
   * Editor main class.
   */
  var Editor = function() {
    this.Container_constructor();

    // Variables
    this._project = null;
    this._game = null;
    this._settings = new b3e.SettingsManager();
    this._dirty = 0;

    // Systems
    this._systems = [];

    // Managers
    this.project = null;
    this.export = null;
    this.import = null;
    this.shortcuts = null;

    this._createGame();
  };
  var p = createjs.extend(Editor, createjs.Container);
  
  p._createGame = function() {
    var self = this;
    this._game = new tine.Game(null, {
      update : function() { self._update(); },
    });

    this._initialize();
  };

  /**
   * Initializes DOM, DOM events, managers and display objects.
   */
  p._initialize = function() {
    var self = this;

    // RESIZE
    var resize = function() {
      self._game.canvas.width = window.innerWidth*3;
      self._game.canvas.height = window.innerHeight;
      // console.log(self._game.canvas)

      var canvas = self._game.canvas;
      var dragging = false;
      var lastX;
      var lastY;
      var marginLeft = 0;
      var marginTop = 0;
      
      canvas.addEventListener('mousedown', function(e) {
        var p = window.editor.project.get();
        var t = p.trees.getSelected();
        var s = t.blocks.getSelected();
        console.log('on mousedown canvas')
        
        if (s.length === 0 && !window.isDragPoint && !window.isConnectingBlock) {
          var evt = e || event;
          dragging = true;
          lastX = evt.clientX;
          lastY = evt.clientY;
          e.preventDefault();
        }
        
      }, false);
    
      window.addEventListener('mousemove', function(e) {
        var evt = e || event;
        if (dragging) {
            var delta = evt.clientX - lastX;
            var deltaY = evt.clientY - lastY;
            lastX = evt.clientX;
            lastY = evt.clientY;
            marginLeft += delta;
            marginTop += deltaY;
            canvas.style.marginLeft = marginLeft + "px";
            // canvas.style.marginTop = marginTop + "px";
        }
        // e.preventDefault();
      }, false);
      
      window.addEventListener('mouseup', function() {
        dragging = false;
      }, false);
      
    };
    window.onresize = resize;
    resize();

    // GAME
    this._game.stage.addChild(this);

    // MANAGERS
    this.project = new b3e.editor.ProjectManager(this);
    this.export = new b3e.editor.ExportManager(this);
    this.import = new b3e.editor.ImportManager(this);
    this.shortcuts = new b3e.editor.ShortcutManager(this);
    
    // SYSTEMS
    this._systems.push(new b3e.editor.CameraSystem(this));
    this._systems.push(new b3e.editor.ConnectionSystem(this));
    this._systems.push(new b3e.editor.SelectionSystem(this));
    this._systems.push(new b3e.editor.DragSystem(this));
    this._systems.push(new b3e.editor.CollapseSystem(this));
    this._systems.push(new b3e.editor.ShortcutSystem(this));
    
    // SETTINGS
    this.applySettings('default');
  };

  /**
   * Called by creatine game.
   */
  p._update = function() {
    var delta = this._game.time.delta;
    this._systems.forEach(function(system) {
      system.update(delta);
    });
  };

  p.trigger = function(name, target, variables) {
    variables = variables || {};

    var event = new createjs.Event(name);
    event._target = target;
    event._data = variables;
    this.dispatchEvent(event);
  };

  p.applySettings = function(settings) {
    if (settings === 'default') {
      settings = b3e.DEFAULT_SETTINGS;
      this._settings.clear();
    }

    if (settings) {
      this._settings.load(settings);
    }

    var canvas = this._game.canvas;
    canvas.style.backgroundColor = this._settings.get('background_color');

    this.project._applySettings(this._settings);
    this.export._applySettings(this._settings);
    this.import._applySettings(this._settings);
    this.shortcuts._applySettings(this._settings);
  };

  p.preview = function(name) {
    var canvas = document.createElement('canvas');

    var p = this.project.get();
    var node = p.nodes.get(name);
    var tree = p.trees.getSelected();

    if (!node) return;
    var block = new b3e.Block(node);
    block._applySettings(this._settings);
    block.x = block._width;
    block.y = block._height;

    canvas.setAttribute('width', block._width*tree.scaleX*2);
    canvas.setAttribute('height', block._height*tree.scaleY*2);
    var stage = new createjs.Stage(canvas);
    stage.scaleX = tree.scaleX;
    stage.scaleY = tree.scaleY;
    stage.addChild(block);
    stage.update();

    return canvas;
  };

  p.isDirty = function() {
    return this._dirty !== 0;
  };

  p.clearDirty = function() {
    this._dirty = 0;
  };

  b3e.editor.Editor = createjs.promote(Editor, 'Container');

  
})();
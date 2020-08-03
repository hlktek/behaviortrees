(function () {
  "use strict";

  b3e.draw.rootSymbol = function (block, settings) {
    // var shape = block.displayObject;
    var shape = new createjs.Shape();

    var w = block._width;
    var h = block._height;
    var swidth = h / 20;
    var ssize = h / 5;
    var scolor = settings.get("block_symbol_color");

    shape.graphics.setStrokeStyle(swidth, "round");
    shape.graphics.beginStroke(scolor);
    shape.graphics.drawCircle(0, 0, ssize);
    shape.graphics.moveTo(-ssize, ssize);
    shape.graphics.lineTo(ssize, -ssize);
    shape.graphics.endStroke();

    return shape;
  };

  b3e.draw.sequenceSymbol = function (block, settings) {
    // var shape = block.displayObject;
    // var shape = block._shapeObject;
    var shape = new createjs.Shape();

    var w = block._width;
    var h = block._height;
    var swidth = h / 20;
    var ssize = h / 4;
    var scolor = settings.get("block_symbol_color");

    shape.graphics.setStrokeStyle(swidth, "round");
    shape.graphics.beginStroke(scolor);
    shape.graphics.beginFill(scolor);
    shape.graphics.moveTo(-ssize, 0);
    shape.graphics.lineTo(ssize, 0);
    shape.graphics.drawPolyStar(ssize / 2, 0, ssize / 2, 3, 0, 0);
    shape.graphics.endFill();
    shape.graphics.endStroke();

    return shape;
  };

  b3e.draw.memsequenceSymbol = function (block, settings) {
    var shape = new createjs.Shape();

    var w = block._width;
    var h = block._height;
    var swidth = h / 20;
    var ssize = h / 4;
    var scolor = settings.get("block_symbol_color");

    shape.graphics.setStrokeStyle(swidth, "round");
    shape.graphics.beginStroke(scolor);
    shape.graphics.beginFill(scolor);
    shape.graphics.drawPolyStar(0, -ssize * 0.75, ssize / 2, 6, ssize / 10, 0);

    shape.graphics.setStrokeStyle(swidth, "round");
    shape.graphics.beginStroke(scolor);
    shape.graphics.beginFill(scolor);
    shape.graphics.moveTo(-ssize, ssize / 2);
    shape.graphics.lineTo(ssize, ssize / 2);
    shape.graphics.drawPolyStar(ssize / 2, ssize / 2, ssize / 2, 3, 0, 0);
    shape.graphics.endFill();
    shape.graphics.endStroke();

    return shape;
  };

  b3e.draw.prioritySymbol = function (block, settings) {
    // var shape = block.displayObject;
    // var shape = block._shapeObject;
    var shape = new createjs.Shape();

    var w = block._width;
    var h = block._height;
    var swidth = h / 20;
    var ssize = h / 8;
    var scolor = settings.get("block_symbol_color");

    shape.graphics.setStrokeStyle(swidth, "round");
    shape.graphics.beginStroke(scolor);
    shape.graphics.arc(0, -ssize, ssize, 3.141561, 1.570796, false);
    shape.graphics.lineTo(0, ssize);
    shape.graphics.beginFill(scolor);
    shape.graphics.drawCircle(0, ssize * 2, swidth / 2);

    shape.graphics.endFill();
    shape.graphics.endStroke();

    return shape;
  };

  b3e.draw.memprioritySymbol = function (block, settings) {
    var shape = new createjs.Shape();

    var w = block._width;
    var h = block._height;
    var swidth = h / 20;
    var ssize = h / 8;
    var scolor = settings.get("block_symbol_color");

    shape.graphics.setStrokeStyle(swidth, "round");
    shape.graphics.beginStroke(scolor);
    shape.graphics.arc(-ssize, -ssize, ssize, 3.141561, 1.570796, false);
    shape.graphics.lineTo(-ssize, ssize);
    shape.graphics.beginFill(scolor);
    shape.graphics.drawCircle(-ssize, ssize * 2, swidth / 2);
    shape.graphics.drawPolyStar(ssize * 1.5, 0, ssize / 2, 6, ssize / 10, 0);

    shape.graphics.endFill();
    shape.graphics.endStroke();

    return shape;
  };

  b3e.draw.textSymbol = function (block, settings) {
    var text = new createjs.Text(
      block.getTitle(),
      "18px Arial",
      settings.get("block_symbol_color")
    );
    text.textAlign = "center";
    // var boundsProps = textProps.getBounds();
    
    var bounds = text.getBounds();
    var regYVal = bounds.height / 2;
    var isShowProperties = settings.get('show_properties');
    if(window.renderTextProps && parseInt(isShowProperties)){
      bounds = window.renderTextProps.getBounds();
      regYVal = (bounds.height / 2)+5;
    }
    text.regY = regYVal;
    // text.regY = -block._height;
    // text.x = -block._width/2;
    // text.y = -block._height/2;
    return text;
  };

  b3e.draw.blockProperties = function (block, settings) {
    var properties = block.properties;
    var numberOfPropetiers = Object.keys(properties).length
    var t = '';
    if(numberOfPropetiers >0){
      for (var key in properties) {
        if( typeof properties[key] !== 'undefined' ){
          t += '\n' + key + ": " + properties[key] ;
        }
      }
    }

    if(t){
      var textProps = new createjs.Text(
        t,
        "12px Arial",
        settings.get("block_border_color")
      );
      textProps.textAlign = "center";
      var boundsProps = textProps.getBounds();
      textProps.regY = (boundsProps.height / 2)-10;
      // text.regY = bounds.height / 2;

      // textProps.x = -block._width/2+15;
      
      // textProps.y = -block._height+50;
      // textProps.y = -block._height+50;
      window.renderTextProps = textProps;
      b3e.draw.textSymbol(block, settings);
      return textProps;
    }
   
    return null

  };
  // b3e.draw.blockProperties = function (block, settings) {
  //   var properties = block.properties;
  //   var numberOfPropetiers = Object.keys(properties).length

  //   if(numberOfPropetiers <=0 ) return null

  //   var rectangleHeight = 30
  //   if(numberOfPropetiers>1){
  //     rectangleHeight += numberOfPropetiers*8
  //   }
  //   var rect = new createjs.Rectangle(0, 0, 120, rectangleHeight);
  //   // var properties = block.properties;
    
  //   var container = new createjs.Container();
  //   container.x = -(rect.x + 60);
  //   container.y = rect.y + block._height / 2 + 10;
  //   var rectShape = new createjs.Shape();
  //   rectShape.graphics.c().f("#555").dr(0, 0, rect.width, rect.height);

  //   container.addChild(rectShape);
  //   for (var key in properties) {
      
  //     if( typeof properties[key] !== 'undefined' ){
  //       var i = Object.keys(properties).indexOf(key)+1;
  //       // console.log(key + " -> " + properties[key]);
  //       var t = key + ": " + properties[key]
  //       var text = new createjs.Text(
  //         t,
  //         "12px Arial",
  //         settings.get("root_color"),
  //       );
    
  //       text.set({
  //         x: rect.x + 10,
  //         y: rect.y + i*10
  //       })
  //       container.addChild(text);
  //     }
  //   }

  //   // container.x = -block._width / 2;
  //   // container.y = -block._height / 2;

  //   return container;
  // };

  b3e.draw.SYMBOLS = {
    Root: b3e.draw.rootSymbol,
    Sequence: b3e.draw.sequenceSymbol,
    Priority: b3e.draw.prioritySymbol,
    MemSequence: b3e.draw.memsequenceSymbol,
    MemPriority: b3e.draw.memprioritySymbol,
  };
})();

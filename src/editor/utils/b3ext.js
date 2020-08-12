// namespace:
this.b3 = this.b3 || {};
// b3.TEST_CATE = 'newcate';

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

function loadNodesJSON(callback) {   
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', '/js/notes.json', true);
    xobj.onreadystatechange = function () {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(xobj.responseText);
          }
    };
    xobj.send(null);  
}


(function() {
    "use strict";
    
    loadNodesJSON(function(response) {
        var nodes = JSON.parse(response);
        var custom_nodes = nodes.custom_nodes
        var newNode;
        if(custom_nodes && custom_nodes.length >0 ){
            custom_nodes.forEach(function (node) {
                var nodeCategory = capitalizeFirstLetter(node.category);
                newNode = b3.Class(b3[nodeCategory]);
                var p = newNode.prototype
                p.name = node.title;
                p.properties = node.properties;
                p.description = node.description;
                p.tick = function(tick) {
                    return b3.SUCCESS;
                }
                
                b3[node.name] = newNode;
            });
        }
    });
})();


// (function() {
// "use strict";
// var DecoratorExt = b3.Class(b3.BaseNode);

// var p = DecoratorExt.prototype;

//     p.category = b3.TEST_CATE;

//     p.__BaseNode_initialize = p.initialize;
//     /**
//      * Initialization method.
//      *
//      * @method initialize
//      * @constructor
//     **/
//     p.initialize = function(settings) {
//         settings = settings || {};

//         this.__BaseNode_initialize();

//         this.child = settings.child || null;
//     };

// b3.DecoratorExt = DecoratorExt;

// })();

// (function() {
// "use strict";
// var TestNewNode = b3.Class(b3.DecoratorExt);

// var p = TestNewNode.prototype
//     p.name = 'TestNewNode';

//     p.tick = function(tick) {
//         if (!this.child) {
//             return b3.ERROR;
//         }

//         var status = this.child._execute(tick);

//         if (status == b3.SUCCESS)
//             status = b3.FAILURE;
//         else if (status == b3.FAILURE)
//             status = b3.SUCCESS;

//         return status;
//     };

// b3.TestNewNode = TestNewNode;

// })();

// tao new composites

// (function() {
//     "use strict";
//     var TestComposite = b3.Class(b3.Composite);
    
//     var p = TestComposite.prototype
//     p.name = 'Test Node Composite';
//     p.properties = {1: 'a', 'abc': '222'};
//     p.tick = function(tick) {
//         for (var i=0; i<this.children.length; i++) {
//             var status = this.children[i]._execute(tick);

//             if (status !== b3.SUCCESS) {
//                 return status;
//             }
//         }

//         return b3.SUCCESS;
//     }
    
//     b3.TestComposite = TestComposite;
    
// })();


// tao new decorator

// (function() {
//     "use strict";
//     var TestDecorator = b3.Class(b3.Decorator);
    
//     var p = TestDecorator.prototype
//     p.name = 'Test Node Decorator';
//     p.properties = {1: 'a', 'abc': '222'};
//     p.tick = function(tick) {
//         if (!this.child) {
//             return b3.ERROR;
//         }

//         var status = this.child._execute(tick);

//         if (status == b3.SUCCESS)
//             status = b3.FAILURE;
//         else if (status == b3.FAILURE)
//             status = b3.SUCCESS;

//         return status;
//     };
    
//     b3.TestDecorator = TestDecorator;
    
// })();

// new actions
// (function() {
//     "use strict";
//     var TestNodeAction = b3.Class(b3.Action);
//     var p = TestNodeAction.prototype;
//         p.name = 'Text New Action';
//         p.properties = {1: 'a', 'abcd': '222'};
//         p.tick = function(tick) {
//             return b3.SUCCESS;
//         }
    
//     b3.TestNodeAction = TestNodeAction;
    
// })();

// new condition
// (function() {
//     "use strict";
//     var TestNodeCondition = b3.Class(b3.Condition);
//     var p = TestNodeCondition.prototype;
//         p.name = 'Text New Condition';
//         p.properties = {1: 'a', 'abcd': '222'};
//         p.tick = function(tick) {
//             return b3.SUCCESS;
//         }
    
//     b3.TestNodeCondition = TestNodeCondition;
    
// })();



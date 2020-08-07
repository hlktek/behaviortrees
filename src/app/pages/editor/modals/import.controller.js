(function() {
  'use strict';

  angular
    .module('app')
    .controller('ImportController', ImportController);

  ImportController.$inject = [
    '$scope',
    '$window',
    '$state',
    '$stateParams',
    'dialogService',
    'notificationService',
    'storageService'
  ];

  function ImportController($scope,
                            $window,
                            $state,
                            $stateParams,
                            dialogService,
                            notificationService,
                            storageService) {
    var vm = this;
    vm.type         = null;
    vm.format       = null;
    vm.open         = open;
    vm.loadFromFile = loadFromFile;
    vm.openWithXML  = openWithXML;
    vm.data         = '';

    _active();

    function _active() {
      vm.type = $stateParams.type;
      vm.format = $stateParams.format;
    }

    function loadFromFile() {
      dialogService
        .openFile(false, ['.b3', '.json'])
        .then(function(path) {
          storageService
            .loadAsync(path)
            .then(function(data) {
              vm.data = JSON3.stringify(data, null, 2);
            });
        });
    }
    function open() {
      var i = $window.editor.import;

      var data = JSON3.parse(vm.data);

      try {
        if (vm.type === 'project' && vm.format === 'json') {
          i.projectAsData(data);
        }
        else if (vm.type === 'tree' && vm.format === 'json') {
          i.treeAsData(data);
        }
        else if (vm.type === 'nodes' && vm.format === 'json') {
          i.nodesAsData(data);
        }
      } catch(e) {
        notificationService.error(
          'Invalid data',
          'The provided data is invalid.'
        );
      }

      $state.go('editor');
    }

    function openWithXML() {
      var i = $window.editor.import;
      let xml = vm.data;
      let treeAsNewJson = xml2js(xml, {compact : true});
      console.log(treeAsNewJson);

      let root = {};
      let rootAttr = {};
      var fighterIds = '';
      if (treeAsNewJson && treeAsNewJson.Board && treeAsNewJson.Board.Fighter) {
        root = treeAsNewJson.Board.Fighter.Routine;
        rootAttr = treeAsNewJson.Board.Fighter._attributes;
        if(rootAttr && rootAttr.hasOwnProperty('ids')){
          fighterIds = rootAttr.ids
        }
      }
      
      let treeAsJson = {
        "root": root._attributes.id,
        "version": "0.3.0",
        "scope": "tree",
        "id": createUUID(),
        "title": "A behavior tree",
        "description": "",
        "fighterIds": fighterIds,
        "properties": {},
        "nodes": {},
        "display": {
          "camera_x": 0,
          "camera_y": 0,
          "camera_z": 1,
          "x": 0,
          "y": 0
        },
        'custom_nodes' : []
      };

      pushNode(treeAsJson.nodes, root);

      if (treeAsNewJson.Board.CustomField && Array.isArray(treeAsNewJson.Board.CustomField)) {
        treeAsNewJson.Board.CustomField.forEach( (customFieldXml) => {
          let customField = {};
          Object.keys(customFieldXml).forEach( (key) => {
            if (customFieldXml[key]._text) {
              customField[key] = customFieldXml[key]._text
            } else {
              customField[key] = customFieldXml[key];
            }
          })

          treeAsJson.custom_nodes.push(customField);
        })
      }

      console.log(treeAsJson);

      i.treeAsData(treeAsJson);
      $state.go('editor');
    }

    function pushNode(nodes, nodeNewJson) {
      let node = nodes[nodeNewJson._attributes.id] = {
        id : nodeNewJson._attributes.id,
        name : nodeNewJson._attributes.name,
        title : nodeNewJson._attributes.name,
        description : '',
        display : {
          x : nodeNewJson._attributes.x,
          y : nodeNewJson._attributes.y
        },
        properties : {

        },
        children : []
      }

      Object.keys(nodeNewJson._attributes).forEach( (key) => {
        if (!['id', 'name', 'x', 'y'].includes(key)) {
          node.properties[key] = nodeNewJson._attributes[key];
        }
      })

      if (nodeNewJson.Routine){
        if (Array.isArray(nodeNewJson.Routine)) {
          let childrens = nodeNewJson.Routine;
          childrens.forEach( children => {
            node.children.push(children._attributes.id);
            pushNode(nodes, children);
          })
        } else {
          let children = nodeNewJson.Routine;
          node.children.push(children._attributes.id);
          pushNode(nodes, children);
        }
      }
    }

    function createUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
         var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
         return v.toString(16);
      });
   }
  }

})();
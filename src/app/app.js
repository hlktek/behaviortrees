angular.module('app', [
  'ui.router',
  'ui.bootstrap',
  'ngAnimate',
  'templates'
])

.run(['$rootScope', '$window', '$state',
  function Execute($rootScope, $window, $state) {
    $rootScope.isDesktop = !!$window.process && !!$window.require;

    $rootScope.go = function(state, params) {
      $state.go(state, params);
    };
  }
])

.run(['$window', '$animate', '$location', '$document', '$timeout', 'settingsModel', 'projectModel',
  function Execute($window,
                   $animate,
                   $location,
                   $document,
                   $timeout,
                   settingsModel, 
                   projectModel) {

    // reset path
    $location.path('/');

    // add drop to canvas
    angular
      .element($window.editor._game.canvas)
      .attr('b3-drop-node', true)
      .attr('id', "editor")

    var div = document.createElement("div");
    div.classList.add("editor-wrapper");
    div.appendChild( document.getElementById("editor"));
    document.body.appendChild(div); 

    // initialize editor
    settingsModel.getSettings();
    projectModel
      .getRecentProjects()
      .then(function(projects) {
        
        function closePreload() {
          $timeout(function() {
            var element = angular.element(document.getElementById('page-preload'));
            $animate.addClass(element, 'preload-fade')
              .then(function() {
                element.remove();
              });
          }, 500);
        }

        if (projects.length > 0 && projects[0].isOpen) {
          projectModel
            .openProject(projects[0].path)
            .then(function() {
              closePreload();
            });
        } else {
          closePreload();
        }
      });
  }
]);

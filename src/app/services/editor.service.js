angular
  .module('app')
  .factory('editorService', editorService);

editorService.$inject = ['$window', '$timeout'];

function editorService($window, $timeout) {
  var service = {
    getDefaultSettings : getDefaultSettings,
    applySettings      : applySettings,
    newProject         : newProject,
    openProject        : openProject,
    closeProject       : closeProject,
    exportProject      : exportProject,
  };
  return service;

  function getDefaultSettings() {
    return $window.b3e.DEFAULT_SETTINGS;
  }
  function applySettings(settings) {
    $window.editor.applySettings(settings);
  }

  function newProject() {
    $window.editor.project.create();
  }
  function openProject(data) {
    $timeout(function(){
      $window.editor.project.open(data);
    }, 2000);
  }
  function closeProject() {
    $window.editor.project.close();
  }

  function exportProject() {
    return $window.editor.export.projectToData();
  }
}
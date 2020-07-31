b3e.editor.ProjectManager = function(editor) {
  "use strict";

  /**
   * Creates a new project.
   */
  this.create = async function() {
    this.close();
    console.log('createproject')
    var project = new b3e.project.Project(editor);

    // HACK ASYNC INIT NODE
    // var promiseInitProject = new Promise((resolve) => {
    //   setTimeout(() => resolve("done init add custome node vao project"), 1000)
    // });
    // var p = await promiseInitProject;
    // console.log(p);

    editor.addChild(project);
    editor._project = project;
    editor.trigger('projectcreated', editor._project);
    
    editor._project.trees.add();
  };

  /**
   * Loads a project from data.
   */
  this.open = async function(data) {
    this.close();

    var project = new b3e.project.Project(editor);
    // HACK ASYNC INIT NODE
    var promiseInitProject = new Promise((resolve) => {
      setTimeout(() => resolve("done init add custome node vao project"), 1000)
    });
    var p = await promiseInitProject;
    console.log(p);
    editor.addChild(project);
    editor._project = project;
    
    editor.import.projectAsData(data);
    editor.trigger('projectopened', editor._project);
    editor.clearDirty();
  };

  /**
   * Exit the current project.
   */
  this.close = function() {
    var project = editor._project;
    if (project) {
      editor.removeChild(project);
      editor.trigger('projectclosed', project);
    }
  };

  /**
   * Gets the current project. Returns `null` if none.
   */
  this.get = function() {
    return editor._project;
  };


  this._applySettings = function(settings) {
    if (editor._project) {
      editor._project._applySettings(settings);
    }
  };
};
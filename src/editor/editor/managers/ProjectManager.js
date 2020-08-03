b3e.editor.ProjectManager = function(editor) {
  "use strict";

  /**
   * Creates a new project.
   */
  this.create = async function() {
    this.close();
    console.log('createproject')
    var project = new b3e.project.Project(editor);
    await this.loadCustomNode(project);
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
    await this.loadCustomNode(project);
    
    // HACK ASYNC INIT NODE
    // var promiseInitProject = new Promise((resolve) => {
    //   setTimeout(() => resolve("done init add custome node vao project"), 1000)
    // });
    // var p = await promiseInitProject;
    // console.log(p);

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

  this.loadCustomNode = async function(project) {
    var response = await fetch(`/js/notes.json`);
    var dataRes = await response.json();
    var new_nodes = dataRes.custom_nodes
    if(new_nodes && new_nodes.length >0 ){
      new_nodes.forEach(function (node) {
        project.nodes.add(b3[node.name], true);
      });
    }
  };

};
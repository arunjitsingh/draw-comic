/*
Draw-Comic: An online drawing and sharing application.
Copyright (C) 2010  Arunjit Singh

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
(function(DC) {
  if (!DC) {
    throw new Error("Application not initialized: DC/core.js missing");
  }
  
  var kDefaults = {
    author: "",
    name: "New Project",
    type: 'project',
    pages: []
  };
  
  var pageKeys = ["layers", "texts"];
  
  DC.Project = {};
  DC.Project.create = function(attr) {
    var project = {};
    _.extend(project, kDefaults, attr || {});
    
    if (project.pages) {
      _.cleanArray(project.pages);
    }
    _.each(pageKeys, function(k) {
      _.cleanArray(project.pages[k]);
    });
    
    
    return project;
  };
  

})(window.DC);
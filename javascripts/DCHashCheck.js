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

DCHashCheck.js: Checking for changes in window.location.hash
*/

(function() {
  function hashCheck() {
    if (window.location.hash) {
      var pid = window.location.hash;
      pid = pid.substring(1);
      if (DC.APP.project && DC.APP.project._id === pid) return;
      DC.APP.trigger("open", [pid]);
    }
  }
  
  window.onhashchange = hashCheck;
  hashCheck();
  
})();
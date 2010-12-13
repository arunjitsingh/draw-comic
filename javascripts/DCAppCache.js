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

DCAppCache.js: Application cache management
*/
(function() {
  var appCache = window.applicationCache;
  if (appCache) {
    function handleCacheEvent(e) {
      switch (appCache.status) {
        case appCache.UNCACHED: // UNCACHED == 0
          break;
        case appCache.IDLE: // IDLE == 1
          break;
        case appCache.CHECKING: // CHECKING == 2
          break;
        case appCache.DOWNLOADING: // DOWNLOADING == 3
          break;
        case appCache.UPDATEREADY:  // UPDATEREADY == 5
          appCache.swapCache();
          break;
        case appCache.OBSOLETE: // OBSOLETE == 5
          break;
        default:
          break;
      };
    }

    function handleCacheError(e) {
      console.error('Error: Cache failed to update!');
    };

    // Fired after the first cache of the manifest.
    appCache.addEventListener('cached', handleCacheEvent, false);

    // Checking for an update. Always the first event fired in the sequence.
    appCache.addEventListener('checking', handleCacheEvent, false);

    // An update was found. The browser is fetching resources.
    appCache.addEventListener('downloading', handleCacheEvent, false);

    // The manifest returns 404 or 410, the download failed,
    // or the manifest changed while the download was in progress.
    appCache.addEventListener('error', handleCacheError, false);

    // Fired after the first download of the manifest.
    appCache.addEventListener('noupdate', handleCacheEvent, false);

    // Fired if the manifest file returns a 404 or 410.
    // This results in the application cache being deleted.
    appCache.addEventListener('obsolete', handleCacheEvent, false);

    // Fired for each resource listed in the manifest as it is being fetched.
    appCache.addEventListener('progress', handleCacheEvent, false);

    // Fired when the manifest resources have been newly redownloaded.
    appCache.addEventListener('updateready', handleCacheEvent, false);
  }
})();
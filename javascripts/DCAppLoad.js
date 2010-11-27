$(document).ready(function() {
  // $("#global-toolbar .toggle").click(function() {
  //   $("#global-toolbar .toolbar").toggleClass("hidden");
  // });
  // $("#layer-toolbar .toggle").click(function() {
  //   $("#layer-toolbar .toolbar").toggleClass("hidden");
  // });
  // $("#page-toolbar .toggle").click(function() {
  //   $("#page-toolbar .toolbar").toggleClass("hidden");
  // });
  
  $(".toolbar-container .toggle").click(function() {
    $(this).siblings(".toolbar").toggleClass("hidden");
  });
});
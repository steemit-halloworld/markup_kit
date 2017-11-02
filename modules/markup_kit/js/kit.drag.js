/* kit.auto_complete.js | MIT License | github.com/tschroeter/markup_kit */

(function ()
{


"use strict";

kit.Drag = function ()
{

  install_events();


}

function install_events ()
{
  var el = document.documentElement;

  touchy(el, 'mousedown', on_grab);
  touchy(el, 'mouseup', on_release);
}

function touchy (html_el, type, fn)
{
  var touch = {
    mouseup: 'touchend',
    mousedown: 'touchstart',
    mousemove: 'touchmove'
  };
  var pointers = {
    mouseup: 'pointerup',
    mousedown: 'pointerdown',
    mousemove: 'pointermove'
  };
  var microsoft = {
    mouseup: 'MSPointerUp',
    mousedown: 'MSPointerDown',
    mousemove: 'MSPointerMove'
  };

  if (window.navigator.pointerEnabled) {
    kit.dom.on(html_el, pointers[type], fn);
  } else if (window.navigator.msPointerEnabled) {
    kit.dom.on(html_el, pointers[type], fn);
  } else {
    kit.dom.on(html_el, touch[type], fn);
    kit.dom.on(html_el, type, fn);
  }

}

function on_grab ()
{
  console.log("grab");
}

function on_release ()
{
  console.log("release");
}



}());

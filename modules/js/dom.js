// Kit DOM
// http://getmarkupkit.com
// (c) Thomas Schroeter <mailto: mail@tschroeter.com> and Investigative Reporters & Editors 2017
// markup_kit may be freely distributed under the MIT license

/**
 * DOM abstraction to use native browser functionality
 * @type {Function}
 */
kit.native_dom = (function ()
{
  "use strict";

  const obj = {
    /**
     * Returns the first element that is descendant from the given root element
     * @param {HTMLElement} root_el
     * @param selector
     * @returns {Element}
     */
    query: function (root_el, selector)
    {
      return root_el.querySelector(selector);
    },

    /**
     * Returns a non-live NodeList of all elements descended from the given root element
     * @param {HTMLElement} root_el
     * @param selector
     * @returns {NodeList}
     */

    query_all: function (root_el, selector)
    {
      return root_el.querySelectorAll(selector);
    },

    on: function (element, type, listener)
    {
      element.addEventListener(type, listener, false);
    },

    off: function (element, type, listener)
    {
      element.removeEventListener(type, listener, false);
    },

    is_detached: function (html_el)
    {
      if (html_el === kit.dom.root_el) return false;

      while (html_el && html_el.parentNode)
      {
        if (html_el === document.documentElement) return false;
        html_el = html_el.parentNode;
      }

      return true;
    }
  };

  Object.defineProperty(obj, 'root_el', {writable:false, value: kit.global.document.documentElement});

  return obj;
});

kit.dom = kit.native_dom;


(function ()
{
  var root = global_scope(self);

  root.style = function (el)
  {
    return (root.getComputedStyle ? getComputedStyle(el, null) : el.currentStyle);
  };


  root.add_event = function (el, type, fn)
  {
    // if( instance_of(type, root.DOM_EVENTS))


    if (el.attachEvent) el.attachEvent('on' + type, listen_fn); else el.addEventListener(type, fn);
  };

  root.is_detached = function (el)
  {
    if (el === document.documentElement) return false;

    while (el && el.parentNode)
    {
      if (el === document.documentElement) return false;
      el = el.parentNode;
    }

    return true;
  }

  root.remove_event = function (el, type, fn)
  {
    if (el.detachEvent) el.detachEvent('on' + type, fn); else el.removeEventListener(type, fn);
  };

  root.has_class = function (el, class_name)
  {
    return el.classList ? el.classList.contains(class_name) : new RegExp('\\b' + class_name + '\\b').test(el.class_name);
  };

  root.observe_dom = function (dom_el, fn)
  {
    root.add_event(dom_el, 'DOMSubtreeModified', fn);
  };

  root.is_dom_ready = function ()
  {
    return document.readyState === 'complete' || document.readyState !== 'loading' && !document.documentElement.doScroll;
  }

  root.on_dom_ready = function (fn)
  {
    var handle = function ()
    {
      remove_event(root.document, 'DOMContentLoaded', handle);
      remove_event(window, 'load', handle);

      fn();

    };

    if (is_dom_ready())
    {
      fn();
    }
    else
    {
      add_event(root.document, 'DOMContentLoaded', handle);
      add_event(window, 'load', handle);
    }

  };

}());
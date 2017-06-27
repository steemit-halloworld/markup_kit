// Kit DOM
// http://getmarkupkit.com
// (c) Thomas Schroeter <mailto: mail@tschroeter.com> and Investigative Reporters & Editors 2017
// markup_kit may be freely distributed under the MIT license

/**
 * DOM abstraction to use native browser functionality
 * @type {Function}
 */
kit.dom = kit.native_dom = (function ()
{
  "use strict";

  var incrementing_id = 0;

  const obj = {

//!@{
//<!------------------------------------------------------------------------------------------------------------------->
//! @name Query HTML Elements
//<!------------------------------------------------------------------------------------------------------------------->
//region

    /**
     * Returns the first element that is descendant from the given root element
     * @param {HTMLElement} root_html_el
     * @param {String} selector
     * @returns {Element}
     */
    query: function (root_html_el, selector)
    {
      return root_html_el.querySelector(selector);
    },

    /**
     * Returns a non-live NodeList of all elements descended from the given root element
     * @param {HTMLElement} root_html_el
     * @param selector
     * @returns {NodeList}
     */

    query_all: function (root_html_el, selector)
    {
      return root_html_el.querySelectorAll(selector);
    },

//endregion

//!@{
//<!------------------------------------------------------------------------------------------------------------------->
//! @name HTML Element Event Handling
//<!------------------------------------------------------------------------------------------------------------------->
//region

    on: function (element, type, listener)
    {
      element.addEventListener(type, listener, false);
    },

    off: function (element, type, listener)
    {
      element.removeEventListener(type, listener, false);
    },

//endregion

//!@{
//<!------------------------------------------------------------------------------------------------------------------->
//! @name HTML Element Utilities
//<!------------------------------------------------------------------------------------------------------------------->
//region

    position: function (html_el)
    {
      var i = 0;
      while (html_el.parentNode.children[i] != html_el) i++;
      return i;
    },

    emplace_id: function (html_el)
    {
      if (!html_el.id)
      {
        html_el.id = ++(incrementing_id);
      }

      return html_el.id;
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
    },

//endregion

//!@{
//<!------------------------------------------------------------------------------------------------------------------->
//! @name HTML Document Utilities
//<!------------------------------------------------------------------------------------------------------------------->
//region

    is_ready: function ()
    {
      const dom = kit.global.document;
      return dom.readyState === 'complete' || dom.readyState !== 'loading' && !dom.documentElement.doScroll;
    },

    on_ready: function (callback_fn)
    {
      if (kit.dom.is_ready())
      {
        callback_fn();
        return;
      }

      var handle_fn = function ()
      {
        kit.dom.off(kit.global.document, 'DOMContentLoaded', handle_fn);
        kit.dom.off(window, 'load', handle_fn);
        callback_fn();
      };

      kit.dom.on(kit.global.document, 'DOMContentLoaded', handle_fn);
      kit.dom.on(window, 'load', handle_fn);
    },

    observe_dom: function (html_el, callback_fn)
    {
      kit.dom.on(html_el, 'DOMSubtreeModified', callback_fn);
    }
//endregion

  };


  Object.defineProperty(obj, 'root_el', {writable: false, value: kit.global.document.documentElement});

  return obj;
}());

/** OLD API */

(function ()
{
  var root = global_scope(self);

  root.style = function (el)
  {
    return (root.getComputedStyle ? getComputedStyle(el, null) : el.currentStyle);
  };


  root.add_event = function (el, type, fn)
  {
    kit.dom.on(el, type, fn);
  };

  root.is_detached = function (html_el)
  {
    return kit.dom.is_detached(html_el);
  };

  root.remove_event = function (el, type, fn)
  {
    kit.dom.off(el, type, fn);
  };

  root.has_class = function (el, class_name)
  {
    return el.classList ? el.classList.contains(class_name) : new RegExp('\\b' + class_name + '\\b').test(el.class_name);
  };

  root.observe_dom = function (html_el, callback_fn)
  {
    kit.dom.observe_dom(html_el, callback_fn);
  };

  root.is_dom_ready = function ()
  {
    return kit.dom.is_ready();
  }

  root.on_dom_ready = function (callback_fn)
  {
    kit.dom.on_ready(callback_fn);
  };

}());
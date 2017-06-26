// Kit core
// http://getmarkupkit.com
// (c) Thomas Schroeter <mailto: mail@tschroeter.com> and Investigative Reporters & Editors 2017
// markup_kit may be freely distributed under the MIT license

/**
 *
 * Kit is a JavaScript framework for building client- or server-side applications.
 *
 * global.kit is the global namespace for all kit components and the core module
 * where components are registered and managed.
 *
 */
const kit = (function ()
{
  "use strict";

  const kit = Object.create(Object.prototype, {
    global: {writable: false, value: Function('return this')()}
  });


  const COMPONENT_SELECTOR = '[kit-component]';

//!@{
//<!------------------------------------------------------------------------------------------------------------------->
//! @name Managing components
//<!------------------------------------------------------------------------------------------------------------------->
//region

  const components = {}, instances = {};

  /**
   * Registers a new component
   * @param {String} name
   * @param {Function} creator_fn Factory function used to create the component
   * @throws {Error} If a component has already been registered
   */
  kit.register = function (name, creator_fn)
  {
    components[name] = {
      creator_fn: creator_fn,
      ref_counter: 1
    };

    return this;
  };

  function component_name (html_el)
  {
    const attr = html_el.getAttribute('kit-component');
    if (attr) return attr.split(' ')[0];

    return '';
  }

  function purge_instances ()
  {
    for (var i = 0, len = instances.length; i < len; i++)
    {
      if (!kit.dom.is_detached(instances[i].html_el)) continue;

      delete instances[i];
    }
  }

//endregion

//!@{
//<!------------------------------------------------------------------------------------------------------------------->
//! @name Mounting && Un-mounting components
//<!------------------------------------------------------------------------------------------------------------------->
//region

  /**
   * Mounts all components contained within an element
   * @param {HTMLElement} html_el DOM element which contains components
   */
  function mount_all (html_el)
  {
    const module_elements = kit.dom.query_all(html_el, COMPONENT_SELECTOR);
    for (var i = 0, len = module_elements.length; i < len; i++)
    {
      mount(module_elements[i]);
    }

    return kit;
  }

  function mount (html_el)
  {
    const component_name = component_name(html_el),
    component_data = components[component_name];

    var instance_data = instances[html_el];
    if (typeof instance_data == 'object') return instance_data.instance;

    component_data.ref_counter++;

    const component = component_data.creator_fn();
    instance_data = {
      name: component_data,
      instance: component,
      html_el: html_el
    };

    instance_data[html_el] = instance_data;

    purge_instances();

    return component;
  }

//endregion
  return (kit.global.kit = kit.global.kit || kit);

})();


(function ()
{
  "use strict";


  var root = global_scope(self);


  root.global_scope = function (self)
  {
    return global_scope(self);
  };

  function global_scope (self)
  {
    return kit.global;
  };

  root.string = function string (str, variables)
  {
    return str.replace(new RegExp("\{([^\{]+)\}", "g"), function (_unused, var_key)
    {
      return variables[var_key];
    });
  };

  root.elements_by_xpath = function (xpath, dom)
  {
    if (!root.is_defined(dom)) dom = root.document;

    var result = [];
    var nodesSnapshot = dom.evaluate(xpath, dom, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (var i = 0; i < nodesSnapshot.snapshotLength; i++)
    {
      result.push(nodesSnapshot.snapshotItem(i));
    }

    return result;
  };

  root.type_of = function (item)
  {
    if (item == null) return 'null';

    if (item.nodeName)
    {
      if (item.nodeType == 1) return 'element';
      if (item.nodeType == 3) return (/\S/).test(item.nodeValue) ? 'textnode' : 'whitespace';
    }
    else if (typeof item.length == 'number')
    {
      if ('callee' in item) return 'arguments';
    }

    return typeof item;
  };

  root.instance_of = function (val, obj)
  {
    if (val == null) return false;
    if (!val.hasOwnProperty) return false; // IE8

    return val instanceof obj;
  };

  root.is_defined = function (val)
  {
    return val != null;
  }


  root.request_animation_frame = root.requestAnimationFrame ||
  root.webkitRequestAnimationFrame || root.mozRequestAnimationFrame || root.oRequestAnimationFrame ||
  root.msRequestAnimationFrame || function (fn) {root.setTimeout(fn, 1000 / 60);};

}());





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

  const COMPONENT_SELECTOR = '[data-module]';

  //!@{
//<!------------------------------------------------------------------------------------------------------------------->
//! @name Initialisation
//<!------------------------------------------------------------------------------------------------------------------->
//region

  var initialized = false;

  var classname_prefix = '';

  kit.init = function (classname_prefix_arg)
  {
    if(kit.is_defined(classname_prefix_arg)) classname_prefix = classname_prefix_arg;

    if (initialized) return;

    const dom_root_el = kit.global.document.documentElement;

    const callback_fn = function () {
      mount_all(kit.dom.root_el);
    };

    callback_fn();

    kit.dom.patch.on_patch(callback_fn);

    kit.dom.on_ready(callback_fn);

    initialized = true;

    return this;
  };

//endregion

//!@{
//<!------------------------------------------------------------------------------------------------------------------->
//! @name Managing Components
//<!------------------------------------------------------------------------------------------------------------------->
//region

  var components = {}, instances = {};

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
    const attr = html_el.getAttribute('data-module');
    if (attr) return attr.split(' ')[0];

    return '';
  }

  function purge_instances ()
  {
    for(var key in instances)
    {
      if (!kit.dom.is_detached(instances[key].html_el)) continue;
      delete instances[key];
    }
  }

//endregion

//!@{
//<!------------------------------------------------------------------------------------------------------------------->
//! @name Mounting && Un-mounting Components
//<!------------------------------------------------------------------------------------------------------------------->
//region

  /**
   * Mounts all components contained within an element
   * @param {HTMLElement} html_el DOM element which contains components
   */
  function mount_all (html_el)
  {

    kit.log("mount_all");

    var module_elements = kit.dom.query_all(COMPONENT_SELECTOR, html_el);
    for (var i = 0, len = module_elements.length; i < len; i++)
    {

      kit.log("start mounting component " + i);

      mount(module_elements[i]);
    }

    return kit;
  }

  function mount (html_el)
  {
    var name = component_name(html_el);
    var component_data = components[name];

    if(component_data === undefined) {
      console.error("MOUNT FAILED FOR " +  name);
      console.error(html_el);
      return;
    }

    purge_instances();

    var instance_data = instances[kit.dom.emplace_id(html_el)];

    if (typeof instance_data === 'object')
    {
      kit.log("already mounted " + html_el + " vs. " + instance_data.html_el);
      return instance_data.instance;
    }

    component_data.ref_counter++;

    var component = component_data.creator_fn(html_el);
    instance_data = {
      name: name,
      instance: component,
      html_el: html_el
    };

    kit.log("mount item " + html_el);

    instances[kit.dom.emplace_id(html_el)] = instance_data;

    return component;
  }

//endregion

  kit.css_prefix = function ()
  {
    return classname_prefix;
  };

  kit.string = function (str, variables)
  {
    return str.replace(new RegExp("\{([^\{]+)\}", "g"), function (_unused, var_key)
    {
      return variables[var_key];
    });

  };

  kit.is_defined = function (val)
  {
    return val != null && typeof val !== 'undefined';
  };

  kit.log = function (string)
  {
    //console.log(string);
  };

  kit.register("formatted_date", function (html_el)
  {
    return new kit.Formatted_input(html_el);
  });

  kit.register("unit", function (html_el) {
    return new kit.Unit_input(html_el);
  });

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
  }

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
  };


  root.request_animation_frame = root.requestAnimationFrame ||
  root.webkitRequestAnimationFrame || root.mozRequestAnimationFrame || root.oRequestAnimationFrame ||
  root.msRequestAnimationFrame || function (fn) {root.setTimeout(fn, 1000 / 60);};

}());





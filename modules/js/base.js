(function ()
{
  "use strict";

  var root = global_scope(self);


  root.global_scope = function (self)
  {
    return global_scope(self);
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
    if (!is_defined (dom)) dom = root.document;

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

  function global_scope (self)
  {
    var is_browser_env = typeof self == 'object' && self.self === self;
    var is_server_env = !is_browser_env && typeof global == 'object' && global.global === global;
    var scope = is_browser_env && self || is_server_env && global || {};
    return scope;
  }


  root.request_animation_frame = root.requestAnimationFrame ||
  root.webkitRequestAnimationFrame || root.mozRequestAnimationFrame || root.oRequestAnimationFrame ||
  root.msRequestAnimationFrame || function (fn) {root.setTimeout(fn, 1000 / 60);};

}());





(function () {
  "use strict";

//!@{
//<!------------------------------------------------------------------------------------------------------------------->
//! @name Construction & Initialisation
//<!------------------------------------------------------------------------------------------------------------------->
//region

  var ref_counter = -1;
  var prv = [];

  kit.dom.Patch = function () {
    var id = (++ref_counter);
    prv[id] = {};
    prv[id].callbacks = [];
    prv[id].ignore_callbacks = [];
    prv[id].scope = new kit.global.Scope();
    prv[id].last_patch_time = (new Date).getTime();

    this.id = function () {return id;};
  };

  var proto = kit.dom.Patch.prototype;

//endregion

//!@{
//<!------------------------------------------------------------------------------------------------------------------->
//! @name Callbacks
//<!------------------------------------------------------------------------------------------------------------------->
//region

  proto.callback = function (callback) {
    prv[this.id()].callbacks.push(callback);
  };

  proto.ignore = function (callback) {
    prv[this.id()].ignore_callbacks.push(callback);
  };

//endregion

//!@{
//<!------------------------------------------------------------------------------------------------------------------->
//! @name Patching Attributes
//<!------------------------------------------------------------------------------------------------------------------->
//region

  function remove_boolean_attribute (target, name)
  {
    //console.log("REMOVE BOOLEAN ATTRIBUTE: " + text(target) + " - " +  text(name));
    target.removeAttribute(name);
    target[name] = false;
  }



  function set_string_attribute (target, name, value)
  {
    var old_val = target.getAttribute(name);
    if (old_val != value) target.setAttribute(name, value);

    old_val = target[name];
    if (!kit.is_defined(old_val) || old_val == value) return;

    switch (name)
    {
      case 'onmouseup':
      case 'onclick':
      case 'ondblclick':
      case 'onmousedown':
      case 'onmousemove':
      case 'onmouseout':
      case 'onmouseover':
      case 'onwheel':
      case 'ondrag':
      case 'ondragend':
      case 'ondragenter':
      case 'ondragleave':
      case 'ondragover':
      case 'ondragstart':
      case 'ondrop':
      case 'onscroll':
      case 'onkeyup':
      case 'onkeydown':
      case 'onkeypress':
        target[name] = new Function('event', value);
        break;
      default:
        target[name] = value;
    }
  }

  function set_boolean_attribute (target, name, value)
  {
    value = !value ? '' : value;
    target.setAttribute(name, value);
    target[name] = (['true', ''].indexOf(value) > -1);
  }

  function remove_attribute (target, name, value)
  {
    if (typeof value === 'boolean')
    {
      remove_boolean_attribute(target, name);
    }
    else
    {
      target.removeAttribute(name);
    }
  }

  function set_attribute (target, name, value)
  {
    if (typeof value === 'boolean' || ['selected', 'checked', 'disabled', 'hidden'].indexOf(name) >= 0)
    {
      set_boolean_attribute(target, name, value);
    }
    else
    {
      set_string_attribute(target, name, value);
    }
  }

  function update_attribute (target, name, new_val, old_val)
  {
    if (new_val == null)
    { // undefined or null
      remove_attribute(target, name, old_val);
      return true;
    }
    else if (old_val == null || new_val !== old_val)
    {
      set_attribute(target, name, new_val);
      return true;
    }

    return false;
  }

  function to_set (named_node_map, set)
  {
    for (var i = 0; i < named_node_map.length; ++i)
    {
      set.add(named_node_map[i].nodeName);
    }

    return set;
  }

  function attr_val (name, attr_node)
  {
    return attr_node ? attr_node.nodeValue : null;
  }

  function update_attributes (target, new_node, old_node)
  {
    var new_attributes = new_node.attributes;
    var old_attributes = old_node.attributes;

    var result = false;
    /*var old_text = text(old_node);
    var new_text = text(new_node);
    if(target && old_text !== new_text)
    {
      target.innerHTML = new_text;
      result = true;
    }*/

    var key_set = to_set(new_attributes, new Set());
    key_set = to_set(old_attributes, key_set);

    var result = false;
    key_set.forEach(function (name) {
      var old_attr = old_attributes.getNamedItem(name);
      var new_attr = new_attributes.getNamedItem(name);

      var old_val = attr_val(name, old_attr);
      var new_val = attr_val(name, new_attr);

      var x = update_attribute(target, name, new_val, old_val);

      result = result || x;
    });

    return result;
  }

//endregion
//!@{
//<!------------------------------------------------------------------------------------------------------------------->
//! @name Patching Elements
//<!------------------------------------------------------------------------------------------------------------------->
//region

  function has_node_changed (node1, node2)
  {
    var node_name_diff = node1.nodeName !== node2.nodeName;
    var text_diff = text(node1) !== text(node2);
    var id_diff = node1.id !== node2.id;

    return node_name_diff || text_diff || id_diff;
  }

  function text (node)
  {
    if (typeof node === 'string') return node;

    var child_count = node.childNodes === undefined ? 0 : node.childNodes.length;
    var text = "";
    for (var i = 0; i < child_count; i++)
    {
      var n = node.childNodes[i];
      if (n.nodeType != Node.TEXT_NODE) continue;

      text += n.nodeValue;
    }

    return text.trim();
  }

  proto.patch = function (parent_el, new_el, old_el, old_el_position, ignore_fn) {

    if (ignore_fn != null) prv[this.id()].callbacks.push(ignore_fn);

    var is_patched = patch_element(this, parent_el, new_el, old_el, old_el_position);

    if (ignore_fn != null) prv[this.id()].callbacks.pop();

    if (is_patched)
    {
      prv[this.id()].last_patch_time = (new Date).getTime();

      prv[this.id()].scope.digest(true);
    }


    return is_patched;
  };

  proto.last_patch_time = function () {

    console.log(prv[this.id()].last_patch_time);

    return prv[this.id()].last_patch_time;
  };

  proto.on_patch = function (callback_fn) {
    prv[this.id()].scope.watch(this.last_patch_time.bind(this), callback_fn);
  };

  function patch_element (owner, parent_el, new_el, old_el, position)
  {
    var dirty_nodes = [];

    position = position || 0;


    var result = update_element(owner, parent_el, new_el, old_el, position, dirty_nodes);

    for (var i in dirty_nodes)
    {
      dirty_nodes[i].parentNode.removeChild(dirty_nodes[i]);
    }

    return result;
  }

  function ignore (owner, el)
  {
    var len = prv[owner.id()].ignore_callbacks.length;
    for (var i = 0; i < len; i++) if (prv[owner.id()].ignore_callbacks[i](el)) return true;
    return false;
  }

  function on_update_element (owner, parent, new_node, old_node, index)
  {
    var len = prv[owner.id()].callbacks.length;
    for (var i = 0; i < len; i++)
    {
      if (!prv[owner.id()].callbacks[i](owner, parent, old_node, new_node, index)) return false;
    }
    return true;
  }

  function update_element (owner, parent, new_node, old_node, index, dirty_nodes)
  {
    if (!old_node)
    {
      parent.appendChild(new_node.cloneNode(true));
      return true;
    }
    else if (!new_node)
    {
      dirty_nodes.push(parent.children[index]);
      return true;
    }
    else if (has_node_changed(new_node, old_node))
    {
      parent.replaceChild(new_node.cloneNode(true), parent.children[index]);
      return true;
    }
    else if (new_node)
    {
      var result = update_attributes(parent.children[index], new_node, old_node);

      var new_child_count = new_node.children.length;
      var old_child_count = old_node.children.length;

      for (var i = 0, j = 0; i < new_child_count || j < old_child_count; i++, j++)
      {
        var n_new_node = new_node.children[i];

        var n_old_node;

        j--;
        do
        {
          j++;
          n_old_node = old_node.children[j];

        } while (ignore(owner, n_old_node, n_new_node));

        if (n_new_node === undefined && n_old_node === undefined) continue;

        if (on_update_element(owner, parent.children[index], n_new_node, n_old_node, j))
        {
          var x = update_element(owner, parent.children[index], n_new_node, n_old_node, j, dirty_nodes);
          result = result || x;

        }
      }

      return result;
    }

    return false;
  }

//endregion

  /* deprecated using new kit.dom.Patch().patch(...) instead */
  kit.dom.patch_html = function (html_text, ignore_fn) {
    var doc = document.implementation.createHTMLDocument("example");
    doc.documentElement.innerHTML = html_text;

    return kit.dom.patch(document.body, doc.body.firstElementChild, document.body.firstElementChild, 0, ignore_fn);
  };

  var patcher = new kit.dom.Patch();

  kit.dom.patch = function (parent_el, new_el, old_el, old_el_position, ignore_fn) {
    return patcher.patch(parent_el, new_el, old_el, old_el_position, ignore_fn);
  };


  kit.dom.patch.on_patch = function (callback_fn) {
    patcher.on_patch(callback_fn);
  };

  kit.dom.patch.last_patch_time = function () {
    return patcher.last_patch_time();
  }
}());


/** OLD API */

(function () {
  "use strict";

  var root = global_scope(self);

  root.patch_dom = function (parent_element, new_element, old_element, old_element_position) {
    kit.dom.patch(parent_element, new_element, old_element, old_element_position);
  };
}());

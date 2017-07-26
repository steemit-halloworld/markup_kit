(function ()
{
  "use strict";

  var last_patch_time = 0;

  const scope = new kit.global.Scope();



  kit.dom.patch_html = function(html_text)
  {
    var doc = document.implementation.createHTMLDocument("example");
    doc.documentElement.innerHTML = html_text;

    return kit.dom.patch(document.body, doc.body.firstElementChild, document.body.firstElementChild, 0);
  };

  kit.dom.patch = function (parent_el, new_el, old_el, old_el_position)
  {
    var is_patched = patch_element(parent_el, new_el, old_el, old_el_position);
    kit.log("is patched " + is_patched);
    if (is_patched)
    {
      last_patch_time = new Date().getMilliseconds();

      kit.log("last patch time " + last_patch_time);

      scope.digest();
    }

    return is_patched;

//!@{
//<!------------------------------------------------------------------------------------------------------------------->
//! @name Patching Attributes
//<!------------------------------------------------------------------------------------------------------------------->
//region

    function remove_boolean_attribute (target, name)
    {
      target.removeAttribute(name);
      target[name] = false;
    }

    function set_boolean_attribute (target, name, value)
    {
      target.setAttribute(name, value);
      target[name] = (value == 'true');
    }

    function remove_attribute (target, name, value)
    {
      console.log("remove attribute " + name);

      if (name === 'class')
      {
        target.removeAttribute('class');
      }
      else if (typeof value === 'boolean')
      {
        remove_boolean_attribute(target, name);
      }
      else
      {
        target.removeAttribute('name');
      }
    }

    function set_attribute (target, name, value)
    {

      console.log("set attribute " + name);

      if (name === 'className')
      {
        target.setAttribute('class', value);
      }
      else if (typeof value === 'boolean')
      {
        set_boolean_attribute(target, name, value);
      }
      else
      {
        target.setAttribute(name, value);
      }
    }

    function update_attribute (target, name, new_val, old_val)
    {
      if (!kit.is_defined(new_val))
      {
        remove_attribute(target, name, old_val);
        return true;
      }
      else if (!kit.is_defined(old_val) || new_val != old_val)
      {
        set_attribute(target, name, new_val);
        return true;
      }

      return false;
    }

    function update_attributes (target, new_attributes, old_attributes)
    {
      var result = false;
      for (var i = 0; i < new_attributes.length || i < old_attributes.length; i++)
      {
        var old_attr = old_attributes[i];
        var new_attr = new_attributes[i];
        var attr = new_attr || old_attr;
        var name = attr.nodeName;
        var old_val = old_attr ? old_attr.nodeValue : undefined;
        var new_val = new_attr ? new_attr.nodeValue : undefined;

        var x = update_attribute(target, name, new_val, old_val);

        result = result || x;
      }

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
      return node1.nodeName !== node2.nodeName || text(node1) !== text(node2);
    }

    function text (node)
    {
      var child_count = node.childNodes.length;
      var text = "";
      for (var i = 0; i < child_count; i++)
      {
        var n = node.childNodes[i];
        if (n.nodeType != Node.TEXT_NODE) continue;

        text += n.nodeValue;
      }

      return text.trim();
    }

    function patch_element (parent_el, new_el, old_el, position)
    {
      var dirty_nodes = [];

      position = position || 0;

      var result = update_element(parent_el, new_el, old_el, position, dirty_nodes);

      for (var i in dirty_nodes)
      {
        dirty_nodes[i].parentNode.removeChild(dirty_nodes[i]);
      }

      return result;
    }

    function update_element (parent, new_node, old_node, index, dirty_nodes)
    {

      console.log("update element " + new_node + " vs. " + old_node);

      if (!old_node)
      {
        parent.appendChild(new_node.cloneNode(true));
        return true;
      }
      else if (!new_node)
      {
        dirty_nodes.push(parent.children[index]);
        return true;

        //parent.removeChild(parent.children[index]);
      }
      else if (has_node_changed(new_node, old_node))
      {

        console.log("replace node " + old_node.innerHTML + " vs. " + new_node.innerHTML);

        parent.replaceChild(new_node.cloneNode(true), parent.children[index]);
        return true;
      }
      else if (new_node)
      {

        var result = update_attributes(parent.children[index], new_node.attributes, old_node.attributes);

        var new_child_count = new_node.children.length;
        var old_child_count = old_node.children.length;

        for (var i = 0; i < new_child_count || i < old_child_count; i++)
        {
          var n_new_node = new_node.children[i];
          var n_old_node = old_node.children[i];

          const x = update_element(parent.children[index], n_new_node, n_old_node, i, dirty_nodes);
          result = result || x;
        }

        return result;
      }

      return false;
    }

//endregion
  };

  kit.dom.patch.on_patch = function(callback_fn)
  {
    scope.watch(kit.dom.patch.last_patch_time, callback_fn);
  };

  kit.dom.patch.last_patch_time = function ()
  {
    return last_patch_time;
  }

}());


/** OLD API */

(function ()
{
  "use strict";

  var root = global_scope(self);

  root.patch_dom = function (parent_element, new_element, old_element, old_element_position)
  {
    kit.dom.patch(parent_element, new_element, old_element, old_element_position);
  };
}());

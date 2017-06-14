(function ()
{
  "use strict";

  var root = global_scope(self);

  root.patch_dom = function (parent_element, new_element, old_element)
  {

    var dirty_nodes = [];

    update_element(parent_element, new_element, old_element, 0, dirty_nodes);

    for(var i in dirty_nodes)
    {
      dirty_nodes[i].parentNode.removeChild(dirty_nodes[i]);
    }
  };

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
    if (name === 'className')
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
    if (!new_val)
    {
      remove_attribute(target, name, old_val);
    }
    else if (!old_val || new_val != old_val)
    {
      set_attribute(target, name, new_val);
    }
  }

  function update_attributes (target, new_attributes, old_attributes)
  {
    for (var i = 0; i < new_attributes.length || i < old_attributes.length; i++)
    {
      var old_attr = old_attributes[i];
      var new_attr = new_attributes[i];
      var attr = new_attr || old_attr;
      var name = attr.nodeName;
      var old_val = old_attr ? old_attr.nodeValue : undefined;
      var new_val = new_attr ? new_attr.nodeValue : undefined;

      update_attribute(target, name, new_val, old_val);
    }
  }

  function update_element (parent, new_node, old_node, index, dirty_nodes)
  {
    if (!old_node)
    {
      parent.appendChild(new_node.cloneNode(true));
    }
    else if (!new_node)
    {
      dirty_nodes.push(parent.children[index]);

      //parent.removeChild(parent.children[index]);
    }
    else if (has_node_changed(new_node, old_node))
    {
      parent.replaceChild(new_node.cloneNode(true), parent.children[index]);
    }
    else if (new_node)
    {

      update_attributes(parent.children[index], new_node.attributes, old_node.attributes);

      var new_child_count = new_node.children.length;
      var old_child_count = old_node.children.length;

      for (var i = 0; i < new_child_count || i < old_child_count; i++)
      {

        var n_new_node = new_node.children[i];
        var n_old_node = old_node.children[i];

        update_element(parent.children[index], n_new_node, n_old_node, i, dirty_nodes);

      }
    }
  }

  function text (node)
  {
    var child_count = node.childNodes.length;
    var text = "";
    for (var i = 0; i < child_count; i++)
    {
      var n = node.childNodes[i];
      if(n.nodeType != Node.TEXT_NODE) continue;

      text += n.nodeValue;
    }

    return text.trim();
  }

  function has_node_changed (node1, node2)
  {
    return node1.nodeName !== node2.nodeName || text(node1) !== text(node2);
  }

}());

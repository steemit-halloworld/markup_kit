(function ()
{
  "use strict";

  var root = global_scope(self);

  var auto_complete_map = {};

  function purge_auto_complete_map ()
  {

    for (var key in auto_complete_map)
    {
      var component = auto_complete_map[key];

      if (!is_detached(component.dom_node())) continue;

      console.log("destroy");

      delete auto_complete_map[key];
      component.destroy();
    }
  }
  on_dom_ready(function ()
  {
    observe_dom(root.document.body, purge_auto_complete_map);
  });

  root.auto_complete = function (dom_el)
  {
    purge_auto_complete_map();

    if (typeof auto_complete_map[dom_el] !== 'undefined') return auto_complete_map[dom_el];

    return (auto_complete_map[dom_el] = new Auto_complete(dom_el));
  };

  var Auto_complete = function (el)
  {
    var dom_node = typeof el == 'string' ? document.querySelector(el) : el;

    var render_item_fn = function (item, search_term, query_item_data_fn)
    {
      var value = query_item_data_fn(item);
      //var value = item.feminine || item.masculine || item.neutral;

      return '<div class="kit_drop_down_item autocomplete-suggestion" data-val="' + item.id + '">' + value + '</div>';
    };

    function create_suggestions_container ()
    {
      var div = document.createElement("div");
      div.className = 'auto_complete_suggestions kit_drop_down';
      return div;
    }

    var key_down_event = false;

    function on_key_down (ev)
    {
      key_down_event = true;

      var key_code = window.event ? ev.keyCode : ev.which;
      var is_arrow_up = key_code == 38;
      var is_arrow_down = key_code == 40;
      var is_esc = key_code == 27;
      var is_enter = key_code == 13 || key_code == 9;

      var next, sel = get_selected_element(div);
      if ((is_arrow_down || is_arrow_up) && div.innerHTML)
      {
        if (!sel)
        {
          next = (is_arrow_down) ? div.childNodes[0] : div.childNodes[divchildNodes.length - 1];
          next.className += ' selected';
        }
        else
        {
          next = (is_arrow_down) ? sel.nextSibling : sel.previousSibling;
          sel.className = sel.className.replace('selected', '');
          if (next)
          {
            next.className += ' selected';
          }
          else
          {

          }
        }

        relayout(false, next);
      }
      else if (is_enter && sel && div.innerHTML)
      {
        dom_node.value = sel.getAttribute("data-val");
        div.style.display = 'none';

        on_select_fn(ev, dom_node.value);
      }
    }

    function get_selected_element (div)
    {
      return div.querySelector('.autocomplete-suggestion.selected');
    }

    function on_mouse_down (e)
    {
      if (!has_class(e.target, 'autocomplete-suggestion')) return;

    }

    function on_mouse_up (event)
    {
      if (!has_class(event.target, 'autocomplete-suggestion')) return;

      var v = event.target.getAttribute('data-val');

      dom_node.value = v;

      div.style.display = 'none';

      on_select_fn(event, dom_node.value);
    }

    var div = create_suggestions_container();

    function relayout (is_resize, next_dom_node)
    {
      var rect = dom_node.getBoundingClientRect();
      var left = rect.left;
      var right = rect.right;
      var bottom = rect.bottom;
      var page_x_offset = (window.pageXOffset || document.documentElement.scrollLeft);
      var page_y_offset = (window.pageYOffset || document.documentElement.scrollTop);

      div.style.left = Math.round(left + page_x_offset + offset_left) + 'px';
      div.style.top = Math.round(bottom + page_y_offset + offset_top) + 'px';
      div.style.width = Math.round(right - left) + 'px';
      if (is_resize) return;

      if (!div.maxHeight) div.maxHeight = parseInt(style(div).maxHeight);
      if (!div.sug_height) div.sug_height = div.querySelector('.kit_drop_down_item').offsetHeight;

      if (div.sug_height)
      {
        if (!next_dom_node) div.scrollTop = 0;
        else
        {
          var scr_top = div.scrollTop;
          var sel_top = next_dom_node.getBoundingClientRect().top - div.getBoundingClientRect().top;

          if (sel_top + div.sug_height - div.maxHeight > 0)
          {
            div.scrollTop = sel_top + div.sug_height + scr_top - div.maxHeight;
          }
          else if (sel_top < 0)
          {
            div.scrollTop = sel_top + scr_top;
          }
        }
      }
    }

    var timer;
    var delay = 150;
    var offset_left = 0;
    var offset_top = 0;
    var min_chars = 1;

    var suggest = function (data, query_item_data_fn)
    {

      var input_val = dom_node.value;
      if (input_val.length < min_chars && !key_down_event)
      {
        div.style.display = 'none';
        return;
      }


      div.style.display = 'block';
      var s = '';

      for (var i = 0; i < data.length; i++)
      {
        s += render_item_fn(data[i], input_val, query_item_data_fn);
      }


      div.innerHTML = s;
      relayout(0);
      key_down_event = false;
    };



    function listen (new_val, old_val)
    {

      if (new_val.length >= min_chars)
      {
        clearTimeout(timer);

        timer = setTimeout(function () { source_fn(new_val, suggest); }, delay);
      }
      else
      {
        div.style.display = 'none';
      }
    }

    function watch ()
    {
      return dom_node.value;
    }

    document.body.appendChild(div);

    this.render_item = function (fn)
    {
      render_item_fn = fn;
      return this;
    };

    this.destroy = function ()
    {
      document.body.removeChild(div);
    };

    var on_select_fn = function (event, value) {
      console.log('on_select ' + value);
    };

    this.on_select = function (fn)
    {
      on_select_fn = fn;
      return this;
    };

    var source_fn = function () {};

    this.source = function (fn)
    {
      source_fn = fn;
      return this;
    };

    this.dom_node = function ()
    {
      return dom_node;
    };

    function constructor ()
    {

      add_event(document, 'mousedown', on_mouse_down);
      add_event(document, 'touchstart', on_mouse_down);
      add_event(document, 'touchend', on_mouse_up);
      add_event(document, 'mouseup', on_mouse_up);
      add_event(document, 'keydown', on_key_down);

      var scope = new Scope();
      scope.watch(watch, listen);

      (function repeat ()
      {
        scope.digest();
        request_animation_frame(repeat);
      }());
    }

    constructor();

  };
}());
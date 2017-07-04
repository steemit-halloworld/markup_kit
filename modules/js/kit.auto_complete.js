(function ()
{
  "use strict";

//!@{
//<!------------------------------------------------------------------------------------------------------------------->
//! @name Construction & Initialisation
//<!------------------------------------------------------------------------------------------------------------------->
//region´

  var ref_counter = -1;
  var prv = {};

  kit.Auto_complete = function (html_element)
  {
    var id = (++ref_counter);

    prv[id] = {

      component: this,
      html_element: html_element,
      drop_down_element: mount_drop_down_element(),
      min_chars: 1,
      delay: 150,
      offset_left: 0,
      offset_top: 0,

      scope: {},

      on_select_callback: function (event, value) {
        console.log('on_select ' + value);
      },

      source_fn: function () {},

      item_renderer: function (item)
      {
        const class_name = kit.string("{prefix}drop_down_item", {'prefix': kit.css_prefix()});

        return kit.string('<div class="{class_name} autocomplete-suggestion" data-val="' + item.id + '">' + item + '</div>', {'class_name': class_name});
      },

      key_is_down: false

    };

    this.id = function () {return id;};

    install_listeners(this);
  };

  function mount_drop_down_element ()
  {
    var div = document.createElement("div");
    div.className = kit.string('auto_complete_suggestion {prefix}drop_down', {prefix: kit.css_prefix()});

    document.body.appendChild(div);

    return div;
  }

  var proto = kit.Auto_complete.prototype;

//endregion
//!@}

//!@{
//<!------------------------------------------------------------------------------------------------------------------->
//! @name Destruction
//<!------------------------------------------------------------------------------------------------------------------->
//region

  proto.destroy = function ()
  {
    var div = prv[this.id()].drop_down_element;
    delete prv[this.id()];
    document.body.removeChild(div);
  };

//endregion
//!@}

//!@{
//<!------------------------------------------------------------------------------------------------------------------->
//! @name Accessing Mounted DOM Elements
//<!------------------------------------------------------------------------------------------------------------------->
//region

  proto.html_element = function ()
  {
    return prv[this.id()].html_element;
  };

  proto.drop_down_element = function ()
  {
    return prv[this.id()].drop_down_element;
  };

//endregion
//!@}

//!@{
//<!------------------------------------------------------------------------------------------------------------------->
//! @name Event Handling
//<!------------------------------------------------------------------------------------------------------------------->
//region

  function listen (owner, new_val, old_val)
  {

    console.log("lets go");
    var div = prv[owner.id()].drop_down_element;
    if (kit.is_defined(new_val) && new_val.length >= prv[owner.id()].min_chars)
    {
      clearTimeout(prv[owner.id()].timer);

      prv[owner.id()].timer = setTimeout(function () { prv[owner.id()].source_fn(new_val, function(data){suggest(owner, data)}); }, prv[owner.id()].delay);
    }
    else
    {
      div.style.display = 'none';
    }
  }

  function watch (owner)
  {
    return prv[owner.id()].html_element.value;
  }

  function on_mouse_down (owner, ev)
  {

  }

  function on_mouse_up (owner, ev)
  {
    if (!kit.global.has_class(ev.target, 'autocomplete-suggestion')) return;

    var v = ev.target.getAttribute('data-val');

    owner.html_element().value = v;

    prv[owner.id()].drop_down_element.style.display = 'none';

    prv[owner.id()].on_select_callback(event, prv[owner.id()].value);
  }

  function get_selected_element (owner)
  {
    return prv[owner.id()].drop_down_element.querySelector('.autocomplete-suggestion.selected');
  }

  function on_key_down (owner, ev)
  {
    prv[owner.id()].is_key_down = true;

    var key_code = window.event ? ev.keyCode : ev.which;
    var is_arrow_up = key_code == 38;
    var is_arrow_down = key_code == 40;
    var is_esc = key_code == 27;
    var is_enter = key_code == 13 || key_code == 9;

    var next, sel = get_selected_element(owner);
    var div = prv[owner.id()].drop_down_element;
    if ((is_arrow_down || is_arrow_up) && div.innerHTML)
    {
      if (!sel)
      {
        next = (is_arrow_down) ? div.childNodes[0] : div.childNodes[div.childNodes.length - 1];
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

      owner.relayout();

      //relayout(false, next);
    }
    else if (is_enter && sel && div.innerHTML)
    {
      owner.html_element().value = sel.getAttribute("data-val");
      div.style.display = 'none';

      prv[owner.id()].on_select_callback(ev, owner.html_element().value);
    }
  }

  function install_listeners (owner)
  {
    kit.dom.on(document, 'mousedown', function (ev) {on_mouse_down(owner, ev)});
    kit.dom.on(document, 'touchstart', function (ev) {on_mouse_down(owner, ev)});
    kit.dom.on(document, 'touchend', function (ev) {on_mouse_up(owner, ev)});
    kit.dom.on(document, 'mouseup', function (ev) {on_mouse_up(owner, ev)});
    kit.dom.on(document, 'keydown', function (ev) {on_key_down(owner, ev)});

    prv[owner.id()].scope = new kit.global.Scope();

    var watcher = function () {return watch(owner);};

    prv[owner.id()].scope.watch(watcher, function(new_val, old_val) {listen(owner, new_val, old_val)});

    (function repeat ()
    {
      prv[owner.id()].scope.digest();

      kit.global.request_animation_frame(repeat);
    }());
  }

//endregion
//!@}

  proto.relayout = function (is_resize, next_dom_node)
  {
    var dom_node = prv[this.id()].html_element;
    var div = prv[this.id()].drop_down_element;

    var rect = dom_node.getBoundingClientRect();
    var left = rect.left;
    var right = rect.right;
    var bottom = rect.bottom;
    var page_x_offset = (window.pageXOffset || document.documentElement.scrollLeft);
    var page_y_offset = (window.pageYOffset || document.documentElement.scrollTop);

    div.style.left = Math.round(left + page_x_offset + prv[this.id()].offset_left) + 'px';
    div.style.top = Math.round(bottom + page_y_offset + prv[this.id()].offset_top) + 'px';
    div.style.width = Math.round(right - left) + 'px';
    if (is_resize) return;

    if (!div.maxHeight) div.maxHeight = parseInt(style(div).maxHeight);
    const selector = kit.string('.{prefix}drop_down_item', {'prefix': kit.css_prefix()});

    if (!div.sug_height) div.sug_height = div.querySelector(selector).offsetHeight;

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
  };

  function suggest (owner, data)
  {
    var input_val = prv[owner.id()].html_element.value;
    var div = prv[owner.id()].drop_down_element;
    if (input_val.length < prv[owner.id()].min_chars && !prv[owner.id()].is_key_down)
    {
      div.style.display = 'none';
      return;
    }


    div.style.display = 'block';
    var s = '';

    for (var i = 0; i < data.length; i++)
    {
      s += prv[owner.id()].item_renderer(data[i], input_val);
    }


    div.innerHTML = s;
    owner.relayout();
    prv[owner.id()].is_key_down = false;
  }

  proto.render_item = function (render_item_callback)
  {
    prv[this.id()].render_item = render_item_callback;
    return this;
  };

  proto.source = function (source_fn)
  {
    prv[this.id()].source_fn = source_fn;
    return this;
  };

  proto.on_select = function (on_select_callback)
  {
    prv[this.id()].on_select_callback = on_select_callback;
    return this;
  };

}());
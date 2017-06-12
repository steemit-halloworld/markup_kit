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
    if(el === document.documentElement) return false;

    while (el && el.parentNode)
    {
      if(el === document.documentElement) return false;
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
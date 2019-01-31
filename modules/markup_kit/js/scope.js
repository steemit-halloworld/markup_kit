(function ()
{
  "use strict";

  var root = global_scope(self);

  root.Scope = function ()
  {
    var watchers = {};

    var self = this;


    function init_val () {}

    this.unwatch = function(id)
    {
      delete watchers[id];
    };

    this.each = function(callback)
    {
      for (var key in watchers)
      {
        if(watchers.hasOwnProperty(key))
        {
          var watcher = watchers[key];
          callback(watcher.watch_fn, watcher.listener_fn, key);
        }
      }
    };

    var counter = 0;

    this.watch = function (watch_fn, listener_fn, id)
    {

      id = id!=null ? id : ++counter;

      if(watch_fn['scope_id'] != id)
      {
        watch_fn['scope_id'] = id;
        watch_fn['listener_fn'] = listener_fn;
        watch_fn['last'] = watch_fn();
        watch_fn['watch_fn'] = watch_fn;
      }

      /*var watcher =
      {
        id: id,
        watch_fn: watch_fn,
        listener_fn: listener_fn || function () {},
        last: watch_fn()
      };*/

      watchers[id] = watch_fn;
    };

    this.reset = function ()
    {
      watchers = [];
    };

    this.digest = function (ignore_initial)
    {
      var new_val, old_val, dirty;
      var ttl = 10;
      do {

        if(dirty && !(ttl--)) throw "10 digest iterations reached";

        for (var i in watchers)
        {
          if(!watchers.hasOwnProperty(i)) continue;

          old_val = watchers[i].last;
          new_val = watchers[i].watch_fn(old_val, self);
          var eq = (new_val === old_val);

          if (eq) dirty = false;

          //console.log(old_val + " vs. " + new_val);

          if (!eq)
          {
            //var is_initial = old_val == init_val;

            //old_val = is_initial ? new_val : old_val;
            watchers[i].last = new_val;
            watchers[i].listener_fn(new_val, old_val, self);

            /*if(!is_initial || ignore_initial)
            {
              watchers[i].listener_fn(new_val, old_val, self);
            }*/

            dirty = true;
          }
        }
      } while (dirty);
    };

    return this;
  };

}());
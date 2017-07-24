(function ()
{
  "use strict";

  var root = global_scope(self);

  root.Scope = function ()
  {
    var watchers = [];

    var self = this;


    function init_val () {}

    this.watch = function (watch_fn, listener_fn)
    {


      var watcher =
      {
        watch_fn: watch_fn,
        listener_fn: listener_fn || function () {},
        last: init_val
      };

      watchers.push(watcher);
    };

    this.digest = function ()
    {
      var new_val, old_val, dirty;
      var ttl = 10;
      do {

        if(dirty && !(ttl--)) throw "10 digest iterations reached";

        for (var i in watchers)
        {
          new_val = watchers[i].watch_fn(self);
          old_val = watchers[i].last;
          var eq = new_val === old_val;

          if (eq) dirty = false;

          if (!eq)
          {
            old_val = old_val === init_val ? new_val : old_val;
            watchers[i].last = new_val;
            watchers[i].listener_fn(new_val, old_val, self);
            dirty = true;
          }
        }
      } while (dirty);
    };

    return this;
  };

}());
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
        last: watch_fn()
      };

      watchers.push(watcher);
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
          old_val = watchers[i].last;
          new_val = watchers[i].watch_fn(old_val, self);
          var eq = (new_val === old_val);

          //console.log(new_val + " vs. " + old_val);

          if (eq) dirty = false;

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
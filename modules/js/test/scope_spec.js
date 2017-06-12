describe("Scope", function ()
{

  it("can be constructed and used as an object", function ()
  {
    var scope = new Scope();
    scope.property = 1;

    expect(scope.property).toBe(1);
  });

  describe("digest", function ()
  {
    var scope;

    beforeEach(function ()
    {
      scope = new Scope();
    });

    it("calls the listener function of a watch on digest", function ()
    {
      var watch_fn = function () {return "wtf";};
      var listener_fn = jasmine.createSpy();

      scope.watch(watch_fn, listener_fn);

      scope.digest();

      expect(listener_fn).toHaveBeenCalled();

    })

    it("calls the listener function when the watched value changes", function ()
    {
      scope.counter = 0;

      scope.watch(
      function (scope) {return scope.some_val;},
      function (new_val, old_val, scope) { scope.counter++; }
      );

      expect(scope.counter).toBe(0);

      scope.digest();
      expect(scope.counter).toBe(1);

      scope.digest();
      expect(scope.counter).toBe(1);

      scope.some_val = 'a';
      expect(scope.counter).toBe(1);

      scope.digest();
      expect(scope.counter).toBe(2);

      scope.digest();
      expect(scope.counter).toBe(2);

      scope.some_val = 'b';
      expect(scope.counter).toBe(2);

      scope.digest();
      expect(scope.counter).toBe(3);

    });

    it("triggers chained watchers in the same digest", function ()
    {
      scope.name = 'Shenja';

      scope.watch(
      function (scope) {return scope.name_upper;},
      function (new_val, old_val, scope)
      {
        if (new_val)
        {
          scope.initial = new_val.substring(0, 1) + '.';
        }
      });

      scope.watch(
      function (scope) {return scope.name;},
      function (new_val, old_val, scope)
      {
        if (new_val)
        {
          scope.name_upper = new_val.toUpperCase();
        }
      }
      );

      scope.digest();
      expect(scope.initial).toBe('S.');

      scope.name = 'Thomas';
      scope.digest();
      expect(scope.initial).toBe('T.');


    });

    it("gives up on an unstable digest", function ()
    {

      scope.counter1 = 0;
      scope.counter2 = 0;

      scope.watch(function (scope) {return scope.counter1;},
      function (new_val, old_val, scope)
      {
        scope.counter2++;
      }
      );

      scope.watch(function (scope) {return scope.counter2;},
      function (new_val, old_val, scope)
      {
        scope.counter1++;
      }
      );

      expect((function() {scope.digest();})).toThrow();

    });


  });


})
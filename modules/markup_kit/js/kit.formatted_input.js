(function ()
{
  'use strict';

  kit.Formatted_input = function (html_element, formatter)
  {
    var owner = this;
    var shadow_element;
    var html_element = html_element;
    owner.delimiter = '.';
    owner.block_delimiters = [];

    owner.render_formatter = new Formatted_input.Date_formatter(['d', 'm', 'Y'], owner.delimiter, owner.block_delimiters);
    owner.formatter = new Formatted_input.Date_formatter(['Y', 'm', 'd'], '-', []);

    var is_backspace;

    function on_change (event)
    {
      console.log("FORMAT");
      var value = owner.shadow_element().value;
      var visual_value = owner.render_formatter.format(value);
      var object = owner.render_formatter.object();
      var model_value = owner.formatter.date_to_text(object);

      update_value(visual_value, model_value);      console.log(model_value);
      //console.log(kit.Formatted_input.Date_formatter.prototype.date_to_text(event.target.value));
      //console.log(kit.Formatted_input.Date_formatter.prototype.object(event.target.value));

      fad_ima_submit('true', html_element.attributes['data-submit'].value, model_value)
    }

    function on_key_down (event)
    {
      var char_code = event.which || event.keyCode;
      var value = owner.shadow_element().value;

      is_backspace = char_code == 8 && is_delimiter(value.slice(-1), owner.html_element().value);

      //submit_time_capsule(100)
    }

    function on_input (event)
    {
      var value = owner.shadow_element().value;

      if (is_backspace && !is_delimiter(value.slice(-1), owner.delimiters()))
      {
        value = head_str(value, value.length - 1);
      }

      var visual_value = owner.render_formatter.format(value);
      var object = owner.render_formatter.object();
      var model_value = owner.formatter.date_to_text(object);

      update_value(visual_value, model_value);

      is_backspace = false;
    }

    function update_value (visual_value, model_value)
    {
      console.log("visual value " + visual_value);
      console.log("model value " + model_value);

      owner.shadow_element().value = visual_value;
      owner.html_element().value = model_value;
    }

    function head_str (str, len)
    {
      return str.slice(0, len);
    }

    function is_delimiter (char, delimiters)
    {
      return delimiters.some(function (current)
      {
        return char == current;
      });
    }

    function submit_time_capsule (wait)
    {
      var start_value = owner.html_element().value;

      setInterval(function() {
        console.log("TIME CAPSULE");
        console.log(owner);
        if(owner.html_element().value === start_value )
        {

          console.log("TIME Submit");
          fad_ima_submit('true', owner.html_element().attributes['data-submit'].value, model_value)
        }
      }, wait);


      }

    this.html_element = function ()
    {
      return html_element;
    };

    this.destroy = function ()
    {
      remove_event(owner.shadow_element(), 'input', on_input);
      remove_event(owner.shadow_element(), 'keydown', on_key_down);
    };

    this.shadow_element = function ()
    {
      if (is_defined(shadow_element)) return shadow_element;

      shadow_element = kit.global.document.createElement('input');
      shadow_element.className = owner.html_element().className;


      var placeholder_val = owner.html_element().getAttribute("placeholder");
      if (is_defined(placeholder_val))
      {
        shadow_element.setAttribute("placeholder", placeholder_val);
      }


      shadow_element.setAttribute("onfocusout", owner.html_element().getAttribute("onfocusout"));

      var visual_value = owner.render_formatter.format(owner.html_element().value);
      shadow_element.setAttribute("value", visual_value)

      return shadow_element;
    };

    owner.html_element().type = 'hidden';
    owner.html_element().parentNode.insertBefore(owner.shadow_element(), html_element);

    add_event(owner.shadow_element(), 'input', on_input);
    add_event(owner.shadow_element(), 'keydown', on_key_down);
    add_event(owner.shadow_element(), 'change', on_change);

    var model_value = owner.html_element().value;
    model_value = owner.formatter.format(model_value);
    var model_object = owner.formatter.object();
    if (is_defined(model_object))
    {
      var visual_value = owner.render_formatter.date_to_text(model_object);
      update_value(visual_value, model_value);
    }


  };

  kit.Formatted_input.Date_formatter = function (date_pattern, delimiter, block_delimiters)
  {
    var owner = this;

    owner.date_pattern = date_pattern;
    owner.blocks = [];
    owner.delimiter = delimiter;
    owner.block_delimiters = block_delimiters;

    function init_blocks ()
    {
      for (var i in date_pattern)
      {
        if (date_pattern[i] === 'Y')
          owner.blocks.push(4);
        else
          owner.blocks.push(2);
      }
    }

    this.delimiters = function ()
    {
      var all_delimiters = [];
      all_delimiters.push(owner.delimiter);
      for (var i in owner.block_delimiters) all_delimiters.push(owner.block_delimiters[i]);
      return all_delimiters;
    };

    init_blocks();
  };

  function strip_delimiters (value, delimiters)
  {
    for (var i in delimiters)
    {
      var delimiter = delimiters[i];
      value = value.replace(new RegExp('\\' + delimiter, 'g'), '');
    }

    return value;
  }

  /**
   *
   * Construct a new Formatted_input instance
   * @deprecated
   * @param {HTMLElement} html_element
   * @constructor
   */
  kit.global.Formatted_input = kit.Formatted_input;

  /**
   * @deprecated
   * @type {*}
   */
  Formatted_input.Date_formatter = kit.Formatted_input.Date_formatter;


  function parse_block (block, pattern)
  {
    var block0 = block.slice(0, 1);

    switch (pattern)
    {
      case 'd':

        if (block == '00') block = '01';
        if (parseInt(block0, 10) > 3) block = '0' + block0;
        if (parseInt(block, 10) > 31) block = '31';
        //day = parseInt(block, 10);
        break;

      case 'm':
        if (block == '00') block = '01';
        if (parseInt(block0, 10) > 1) block = '0' + block0;
        if (parseInt(block, 10) > 12) block = '12';

        //month = parseInt(block, 10);

        break;

      case 'Y':
        //if (block.length === len) year = parseInt(block, 10);
        break;
    }

    return block;
  }


  Formatted_input.Date_formatter.prototype =
  {

    object: function ()
    {
      var owner = this;
      return owner.date;
    },

    date_to_text: function (date)
    {
      console.log(date);

      var owner = this;
      var result = '';

      var year = date.getFullYear();
      var month = date.getMonth();
      var day = date.getDate();

      for (var i in owner.blocks)
      {
        var pattern = owner.date_pattern[i];
        var block = '';
        switch (pattern)
        {
          case 'd':
            var padded = "00" + parseInt(day, 10);
            block += padded.substring(padded.length -2, padded.length);
            break;
          case 'm':
            var padded = "00" + parseInt(month +1, 10);
            block += padded.substring(padded.length -2, padded.length);
            break;
          case 'Y':
            block += year;
            break;
        }

        block = parse_block(block, pattern);

        result += block;

        var delim = owner.block_delimiters.length > 0 ? owner.block_delimiters[i] : owner.delimiter;
        if (i < owner.blocks.length - 1)
        {
          result += delim;
        }
      }

      return owner.format(result);
    },

    format: function (value)
    {
      var owner = this;
      var result = '';

      value = strip_delimiters(value, owner.delimiters());

      value = value.replace(/[^\d]/g, '');
      if (value.length == 0) return value;

      var d = new Date(Date.now());
      var year = d.getFullYear();
      var month = d.getMonth();
      var day = d.getDate();

      for (var i in owner.blocks)
      {
        var len = owner.blocks[i];
        var block = value.slice(0, len);
        var rest = value.slice(len);
        var pattern = owner.date_pattern[i];

        block = parse_block(block, pattern);

        result += block;

        switch (pattern)
        {
          case 'd':
            day = parseInt(block, 10);
            break;
          case 'm':
            month = parseInt(block, 10);
            break;
          case 'Y':
            year = parseInt(block, 10);
            break;
        }

        var delim = owner.block_delimiters.length > 0 ? owner.block_delimiters[i] : owner.delimiter;

        if (block.length == len && i < owner.blocks.length - 1)
        {
          result += delim;
        }

        value = rest;
      }

      owner.date = new Date(year, month - 1, day);

      return result;
    }
  };

})();



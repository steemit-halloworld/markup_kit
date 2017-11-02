(function ()
{
  'use strict';

  kit.Unit_input = function (html_element, formatter)
  {
    var owner = this;
    var shadow_element;
    var html_element = html_element;
    owner.delimiter = ',';
    owner.block_delimiters = '.';
    owner.unit = html_element.attributes['data-unit'].value;
    owner.unit_spacer = "";
    owner.unit_string = function () {
      return owner.unit_spacer + owner.unit;
    }

    owner.render_formatter = new kit.Unit_input.Unit_formatter(owner.unit_string(), owner.delimiter, owner.block_delimiters);
    owner.formatter = new kit.Unit_input.Unit_formatter(owner.unit_string(), owner.delimiter, owner.block_delimiters);

    var is_backspace;

    function on_change (event)
    {
      console.log("FORMAT");
      var value = owner.shadow_element().value;
      var visual_value = owner.render_formatter.format(value);
      var model_value = owner.formatter.format_to_text(value);

      update_value(visual_value, model_value);      console.log(model_value);
      //console.log(kit.Unit_input.Unit_formatter.prototype.date_to_text(event.target.value));
      //console.log(kit.Unit_input.Unit_formatter.prototype.object(event.target.value));

      fad_ima_submit('true', owner.html_element().attributes['data-submit'].value, model_value)
    }

    function on_key_down (event)
    {
      console.log("UNIT KEY DOWN");

      var char_code = event.which || event.keyCode;
      var value = owner.shadow_element().value;

      is_backspace = char_code == 8 && is_delimiter(value.slice(-1), owner.html_element().value);


      if(event.keyCode == 39)
      {
        handle_curser_pos();
        return;
      }
      //if(event.keyCode >= 65 && event.keyCode <= 90)

      if(event.keyCode < 48 || event.keyCode > 57)
      {
        return;
      }

    }

    function on_input (event)
    {
      var value = owner.shadow_element().value;

      if (is_backspace && !is_delimiter(value.slice(-1), owner.delimiters()))
      {
        value = head_str(value, value.length - 1);
      }



      var visual_value = owner.render_formatter.format(value);
      var model_value = owner.formatter.format_to_text(value);

      update_value(visual_value, model_value);
      handle_curser_pos();

      is_backspace = false;
    }

    function on_focusin (event)
    {
      console.log("FOCUS IN")
      handle_curser_pos();

    }

    function handle_curser_pos ()
    {
      var data_type = owner.html_element().attributes["data-unit"].value;
      var r = owner.shadow_element().value.split(data_type)[0].trim().length;

      if(owner.shadow_element().selectionEnd >= r)
      {
        console.log("UNIT");
        owner.set_cursor_position(r)
      }

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
    
    this.set_cursor_position = function (pos)
    {
      this.owner = owner;
      this.pos = pos;
      setTimeout(() => {
          owner.shadow_element().setSelectionRange(this.pos, this.pos);
          console.log(owner.shadow_element().selectionEnd);
      }, 0);

      
    };

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
    add_event(owner.shadow_element(), 'focusin', on_focusin);
    add_event(owner.shadow_element(), 'mousedown', handle_curser_pos);
    add_event(owner.shadow_element(), 'click', handle_curser_pos);

    var model_value = owner.html_element().value;
    model_value = owner.formatter.format(model_value);
    var model_object = owner.formatter.object();
    if (is_defined(model_object))
    {
      var visual_value = owner.render_formatter.date_to_text(model_object);
      update_value(visual_value, model_value);
    }


  };

  kit.Unit_input.Unit_formatter = function (unit_string, delimiter, block_delimiters)
  {
    var owner = this;

    owner.unit_string = unit_string;
    owner.blocks = [];
    owner.delimiter = delimiter;
    owner.block_delimiters = block_delimiters;


    this.delimiters = function ()
    {
      var all_delimiters = [];
      all_delimiters.push(owner.delimiter);
      for (var i in owner.block_delimiters) all_delimiters.push(owner.block_delimiters[i]);
      return all_delimiters;
    };



  };
  
  /**
   *
   * Construct a new Unit_input instance
   * @deprecated
   * @param {HTMLElement} html_element
   * @constructor
   */
  kit.global.Unit_input = kit.Unit_input;

  /**
   * @deprecated
   * @type {*}
   */
  Unit_input.Unit_formatter = kit.Unit_input.Unit_formatter;


  Unit_input.Unit_formatter.prototype =
  {

    object: function ()
    {
      var owner = this;
      return owner.date;
    },

    remove_unit: function (value) {
      var owner = this;
      var regex = /[a-zA-Z\s]/;
      return value.split(regex)[0];
    },

    format: function (value)
    {

      console.log("FORMAT: " + value);
      var owner = this;
      var result_postcomma = "";
      var result_precomma = "";
      var value = owner.remove_unit(value);
      if(String(value).split(owner.delimiter)[1] == "")
      {
        return value;
      }
      if(String(value).indexOf(owner.block_delimiters) >= 0)
      {
        value = String(value).split(owner.block_delimiters).join('');
      }
      if(String(value).indexOf(owner.delimiter) >= 0)
      {
        value = String(value).split(owner.delimiter).join('.');
      }

      var precomma = Math.round(value -0.5);
      var postcomma = value- precomma;



      if(postcomma != 0){

      value = Number(precomma + '.' + String(postcomma).split('.')[1]);

      result_postcomma = owner.delimiter;
        var counter = 0;
        if(postcomma != 0)
        {
          var string_postcomma = String(value).split('.')[1];
          for(var c in string_postcomma)
          {

            result_postcomma += string_postcomma[c];

            if(counter %3 == 2)
            {
              result_postcomma += owner.block_delimiters;
            }
            counter ++;
          }
        }
      }



      console.log(value);

      var counter = String(precomma).length -1;
      for(var c in String(precomma))
      {

        if(counter % 3 == 2 && c > 0)
        {
          result_precomma += owner.block_delimiters;
        }
        result_precomma += String(precomma)[c];


        counter --;
      }



      var result = result_precomma + result_postcomma + " " + owner.unit_string;
      console.log("RESULT: " + result);
      return result;
    },

    format_to_text: function (value)
    {

      var owner = this;
      var value = owner.remove_unit(value);

      if(String(value).split(owner.delimiter)[1] == "")
      {
        value = String(value).split(owner.delimiter)[0];
      }
      value=String(value);
      value=value.split(owner.block_delimiters).join('');
      value=value.split(owner.delimiter).join('.');

      return value;
    }
  };




})();



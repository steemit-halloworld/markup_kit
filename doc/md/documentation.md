

# Getting Started

markup-kit.css is a modern, lightweight and responsive CSS framework for faster developing web interfaces.

## Installation

## Browser Support

markup-kit.css uses [Autoprefixer](https://github.com/postcss/autoprefixer) to make most styles compatible with
earlier browsers. markup-kit.css is designed for modern browsers. The following browsers are recommended:

* Chrome 35+
* Firefox 31+
* Safari 7+
* IE 10+
* Edge
* Opera



# Normalisation

All of the modules are build on top of the normalisation module. It's the foundation layer.

The normalisation module applies some basic resets to ensure elements are rendered consistently across all browsers.



## Box Sizing

To ensure `padding` does not affect the computed width of an element the `box-sizing` is switched from `content-box` to
`border-box`. On rare occasion `box-sizing`can be overridden. All nested elements including `::before` and `::after`
inherit the specified `box sizing`



# Typography

Typography is one of the most important and most visible things on a web page. Even slightly imperfection ruin otherwise
a perfect visual design.



## Measure

Measure refers to the length of a line of text.

<quote>
"Anything from 45 to 75 characters is widely regarded as a satisfactory length of line for a single-column page...the
66-character line (counting both letters and spaces) is widely regarded as ideal. For multiple-column work, a better
average is 40-50 characters."

  <span>Robert Bringhurst - <i>The Elements of Typographic Style</i></span>
</quote>

The following classes are used for setting measure:

| Class            | Description                                                          |
| ---------------- | -------------------------------------------------------------------- |
| 'measure'        | line lengths ~66 characters                                          |
| 'narrow measure' | line lengths ~45 characters                                          |
| 'measure wide'   | line lengths ~80 characters                                          |



## Tracking

In typography letter-spacing is commonly known as tracking. Tracking is the consistent white-space between letters in
a piece of text. For example text that is set to uppercase should be tracked to improve readability but lowercase text
should never be tracked. For some larger text, depending on the typeface a negative tracking might be desirable.



## Paragraphs



# Form

The Form module provides classes to customize the displays of HTML input controls for a more consistent rendering
across browsers and devices.



## Inputs

All `<input>` fields must have one of the following type attributes:
`text`, `date`, `datetime`, `datetime-local`, `email`, `month`, `number`, `password`, `search`, `tel`, `time`, `url`
or `week`.

<div data-module="kit-example">
  <input class="input" type="text" placeholder="Search...">
  <input class="input" disabled="true" type="text" value="Disabled">
</div>



## Select

<label class="label">
  Country:
  <select class="select">
    <option value="">State</option>
    <option value="AL">Alabama</option>
    <option value="AK">Alaska</option>
    <option value="AZ">Arizona</option>
    <option value="AR">Arkansas</option>
    <option value="CA">California</option>
    <option value="CO">Colorado</option>
    <option value="CT">Connecticut</option>
    <option value="DE">Delaware</option>
    <option value="DC">District Of Columbia</option>
    <option value="FL">Florida</option>
    <option value="GA">Georgia</option>
    <option value="HI">Hawaii</option>
    <option value="ID">Idaho</option>
    <option value="IL">Illinois</option>
    <option value="IN">Indiana</option>
    <option value="IA">Iowa</option>
    <option value="KS">Kansas</option>
    <option value="KY">Kentucky</option>
    <option value="LA">Louisiana</option>
    <option value="ME">Maine</option>
    <option value="MD">Maryland</option>
    <option value="MA">Massachusetts</option>
    <option value="MI">Michigan</option>
    <option value="MN">Minnesota</option>
    <option value="MS">Mississippi</option>
    <option value="MO">Missouri</option>
    <option value="MT">Montana</option>
    <option value="NE">Nebraska</option>
    <option value="NV">Nevada</option>
    <option value="NH">New Hampshire</option>
    <option value="NJ">New Jersey</option>
    <option value="NM">New Mexico</option>
    <option value="NY">New York</option>
    <option value="NC">North Carolina</option>
    <option value="ND">North Dakota</option>
    <option value="OH">Ohio</option>
    <option value="OK">Oklahoma</option>
    <option value="OR">Oregon</option>
    <option value="PA">Pennsylvania</option>
    <option value="RI">Rhode Island</option>
    <option value="SC">South Carolina</option>
    <option value="SD">South Dakota</option>
    <option value="TN">Tennessee</option>
    <option value="TX">Texas</option>
    <option value="UT">Utah</option>
    <option value="VT">Vermont</option>
    <option value="VA">Virginia</option>
    <option value="WA">Washington</option>
    <option value="WV">West Virginia</option>
    <option value="WI">Wisconsin</option>
    <option value="WY">Wyoming</option>
  </select>
</label>







## Label

<div data-module="kit-example">
  <label class="label">Default</label>
  <label class="success label">Success</label>
  <label class="warning label">Warning</label>
  <label class="error label">Error</label>
  <label class="focused label">Focus</label>
  <label class="dark label">Dark</label>
  <label class="light label">Light</label>
</div>

### Basic

To reduce the visual complexity add the `basic` class to a label.

<div data-module="kit-example">
<label class="label">Default</label>
<label class="basic success label">Success</label>
<label class="basic warning label">Warning</label>
<label class="basic error label">Error</label>
<label class="basic focused label">Focus</label>
<label class="basic dark label">Dark</label>
<label class="basic light label">Light</label>
</div>



## Pointing

A label can point to the context next to it

<div data-module="kit-example">
  <section>
    <label class="basic success pointing label">Please enter a value</label>
    <label class="basic warning bottom pointing label">Please enter a value</label>
    <label class="left pointing error label">Please enter a value</label>
    <label class="dark right pointing label">Please enter a value</label>
  </section>

  <section>
    <input id="pointing_label_username" placeholder="Username" class="input">
    <label for="pointing_label_username" class="light left pointing smaller label">The name is already taken</label>
  </section>

  <fieldset class="fieldset narrow measure">
    <label class="label">Password <input id="pointing_label_password" class="input" type="password" placeholder="Password"></label>
    <label for="pointing_label_password" class="light top pointing smaller label">Your password must be 6 characters or more</label>
  </fieldset>

</div>


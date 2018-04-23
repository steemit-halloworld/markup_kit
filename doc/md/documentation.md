

# Getting Started

markup-kit.css is a modern, lightweight and responsive CSS framework for faster developing web interfaces.

## Installation

TODO

## Browser Support

markup-kit.css uses [Autoprefixer](https://github.com/postcss/autoprefixer) to make most styles compatible with
earlier browsers. markup-kit.css is designed for modern browsers. The following browsers are recommended:

* Chrome 35+
* Firefox 31+
* Safari 7+
* IE 10+
* Edge
* Opera

## Applying Styles

The framework won't do anything automatically except the Normalisation Module. The following HTML code won't change
anything by simply adding



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



# Control

Controls are visual elements that convey a specific action or intention in response to user interactions. They are
essential for collecting and handling user input and should follow styling and interaction guidelines for each
platform, so that they are intuitive for users to interact with.

The `ui control` is a container for:

* `.label` - an optional short word or phrase that succinctly describes the control
* `input`, `select`, `textarea` or `button` - the associated HTML form element
* `.hint` - an optional brief phrase that describe the control in more detail



# Navigation

  <div data-module="kit-example">
    <ul class="nav">
      <li class="item">Home</li>
      <li class="item">About</li>
      <li class="item">News</li>
      <li class="item">Help</li>
    </ul>
  </div>


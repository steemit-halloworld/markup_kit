

# Button Module

The Button module include predefined button styles with different semantic purposes.



## Button

A standard button.

<div class="buttons">
  <button class="button">Click Me</button>
  <button class="primary">Click Me</button>
  <button class="secondary">Click Me</button>
</div>


## Animated Button

<div class="animated button">
  <div class="content visible">Sign Up</div>
  <div class="content hidden">12.99$ a month</div>
</div>



# Card Module



# Coloring Module

The Coloring module define the background and foreground colors of elements.



<div class="">

</div>



# Dropdown Module



# Flex Module



# Flex Component

## Default Flex Configuration

<div class="flx">
  <div><div class="card">Item 1</div></div>
  <div><div class="card">Item 2</div></div>
  <div><div class="card">Item 3</div></div>
  <div><div class="card">Item 4</div></div>
  <div><div class="card">Item 5</div></div>
  <div><div class="card">Item 6</div></div>
  <div><div class="card">Item 7</div></div>
  <div><div class="card">Item 8</div></div>
  <div><div class="card">Item 9</div></div>
  <div><div class="card">Item 10</div></div>
  <div><div class="card">Item 11</div></div>
</div>



# Float Module



## Float And Clearfix Modifiers

Floating elements are taken from the document flow and aligned to the left or right of their parent element. It is
important to clear floats.



# Grid Module



## Grid Component

The Grid component arranges block elements into columns and works closely together with the width modifiers of the
Sizing module to determine how much space of the the container each item will take up.

### Default Grid Configuration

<div class="grid">
  <div class="w20">
    <div class="card">20%</div>
  </div>
   <div class="w20">
    <div class="card">20%</div>
  </div>
  <div class="w20">
    <div class="card">20%</div>
  </div>
  <div class="w20">
    <div class="card">20%</div>
  </div>
  <div class="w20">
    <div class="card">20%</div>
  </div>

  <div class="w25">
    <div class="card">25%</div>
  </div>
  <div class="w25">
    <div class="card">25%</div>
  </div>
  <div class="w25">
    <div class="card">25%</div>
  </div>
  <div class="w25">
    <div class="card">25%</div>
  </div>

  <div class="w33">
    <div class="card">33%</div>
  </div>
  <div class="w33">
    <div class="card">33%</div>
  </div>
  <div class="w33">
    <div class="card">33%</div>
  </div>

  <div class="w50">
    <div class="card">50%</div>
  </div>
  <div class="w50">
    <div class="card">50%</div>
  </div>

  <div class="w100">
    <div class="card">100%</div>
  </div>

  <div>
    <div class="card">auto</div>
  </div>

  <div>
    <div class="card">auto</div>
  </div>

  <div>
    <div class="card">auto</div>
  </div>

  <div class="fill">
    <div class="card">fill</div>
  </div>
</div>



### Gutter Modifiers

The Grid component comes with a default gutter, that is decreased automatically from a certain breakpoint, usually on a
smaller desktop viewport width. To apply a different gutter, add one of the following classes.


#### Remove Grid Gutter

Add the .collapse class to remove the grid gutter entirely.

<div class="grid collapse">
  <div class="w33">
    <div class="card">33%</div>
  </div>
  <div class="w33">
    <div class="card">33%</div>
  </div>
  <div class="w33">
    <div class="card">33%</div>
  </div>
</div>


# List Module



## Horizontal List

<div class="segment">
  <div class="content">
    <ul class="horizontal list">
      <li><div class="content">1345 6787 6545 678</div></li>
      <li><div class="content">1345 6787 6545 678</div></li>
    </ul>
  </div>
</div>

<div class="segment">
            <div class="content">
              <div class="header">fällige Wiedervorlagen</div>
            </div>
            <div class="content">
              <ul class="list">
                <li>
                  <ul class="list">
                    <li>06.07.2017</li>
                    <li>
                      <ul>
                        <li>
                          <a href="#">Angebot PHV machen</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>

                <li>
                  <ul class="list">
                    <li>Heute</li>
                    <li>
                      <ul>
                        <li>
                          <a href="#">Anrufen wegen Hypothek</a>
                          <a href="#">Antrag WGBV wegschicken</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>

                <li>
                  <ul class="list">
                    <li>Morgen</li>
                    <li>
                      <ul>
                        <li>
                          <a href="#">Essen im Ritz</a>

                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>

              </ul>

              <ul class="horizontal list">
                <li>
                  Heute
                </li>
                <li>bla bla</li>
              </ul>
            </div>
          </div>



# Normalisation Module



# Off-canvas Module

Module to create an off-canvas sidebar. The module is used to hide the navigation menu off canvas. This is especially
useful for screens with small viewport.


## Of-canvas Component

To apply the component add the off_canvas class to a parent div container and use the sub-component classes


# Page module


# Positioning Module

 Module to place elements outside of the normal document flow.



# Sizing Module

 Module to define the width or height of elements especially for different viewport sizes.


# Spacing Module

Module to define margin or padding values to an element especially for different viewport sizes




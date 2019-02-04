# d3-radial-axis

[![NPM](https://nodei.co/npm/d3-radial-axis.png?compact=true)](https://nodei.co/npm/d3-radial-axis/)

A radial implementation of the [D3 axis](https://github.com/d3/d3-axis) component.

To use for instance in a [clock](https://bl.ocks.org/vasturiano/118e167e9bc93356221f67905c87cd6f) or a [gauge meter](https://bl.ocks.org/vasturiano/979b96ddd4f1461458bc3669528d0edc).

## Quick start

```
import { d3AxisRadialInner, d3AxisRadialOuter } from 'd3-radial-axis';
```
or
```
var d3.radialAxis = require('d3-radial-axis');
```
or even
```
<script src="/path/to/dist/d3-radial-axis.js"></script>
```
then
```
var myAngleScale = d3.scaleLinear()
    .domain([-10, 10])
    .range([-Math.PI, Math.PI]);
var myRadius = 100;
var myRadialAxis = d3.axisRadialInner(myAngleScale, myRadius);

d3.select(<myDOMElement>).call(myRadialAxis);
```

## API reference

Same features as the regular [D3 axis](https://github.com/d3/d3-axis#api-reference).

```
d3.axisRadialOuter()
    .ticks()
    .tickArguments()
    .tickValues()
    .tickFormat()
    .tickSize()
    .tickSizeInner()
    .tickSizeOuter()
    .tickPadding()
```

Includes additional properties to configure the radial axis, the `angleScale`, and the axis `radius`.

Also supports the representation of a [spiral axis](https://vasturiano.github.io/d3-radial-axis/example/spiral-axis.html) when setting a pair of `startRadius` and `endRadius`.

```
d3.axisRadialOuter()
    .angleScale()
    .radius()
    .startRadius()
    .endRadius()
```


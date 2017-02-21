# d3-radial-axis
A radial implementation of the [D3 axis](https://github.com/d3/d3-axis) component.

To use for instance in a [clock](https://bl.ocks.org/vasturiano/118e167e9bc93356221f67905c87cd6f).

[![NPM](https://nodei.co/npm/d3-radial-axis.png?compact=true)](https://nodei.co/npm/d3-radial-axis/)

## Quick start

```
npm install
npm run build
```

## How to instantiate

```
import { axisRadialInner, axisRadialOuter } from 'd3-radial-axis';
```
or
```
var RadialAxis = require('d3-radial-axis');
```
or even
```
<script src="/path/to/dist/d3-radial-axis.js"></script>
```
then
```
var myScale = d3.scaleLinear()
        .domain([-10, 10])
        .range([-Math.PI, Math.PI]),
    myRadius = 100,
    myRadialAxis = d3.axisRadialInner(myScale, myRadius);

d3.select(<myDOMElement>).call(myRadialAxis);
```

## API reference

Same features as the regular [D3 axis](https://github.com/d3/d3-axis#api-reference).

```
d3.axisRadialOuter()
     .scale()
     .ticks()
     .tickArguments()
     .tickValues()
     .tickFormat()
     .tickSize()
     .tickSizeInner()
     .tickSizeOuter()
     .tickPadding()
```
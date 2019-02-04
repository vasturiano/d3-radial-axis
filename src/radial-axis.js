import { lineRadial as d3LineRadial, curveNatural as d3CurveNatural } from 'd3-shape';
import { scaleLinear } from 'd3-scale';

function identity(x) {
  return x;
}

function translate(x, y) {
  return "translate(" + x + "," + y + ")";
}

function center(scale) {
  var offset = scale.bandwidth() / 2;
  if (scale.round()) offset = Math.round(offset);
  return function(d) {
    return scale(d) + offset;
  };
}

function entering() {
  return !this.__axis;
}

function radialAxis(angleScale, startRadius, endRadius, outer) {
  var tickArguments = [],
    tickValues = null,
    tickFormat = null,
    tickSizeInner = 6,
    tickSizeOuter = 6,
    tickPadding = 12;

  function angleTransform(angle, radius) {
    return translate.apply(translate, polar2cart(angle,radius));
  }

  function polar2cart(angle, r) {
    return [Math.sin(angle) * r, -Math.cos(angle) * r];
  }


  function axis(context) {
    var isSpiral = endRadius !== undefined && startRadius !== endRadius;
    endRadius = !isSpiral ? startRadius : endRadius;

    var values = tickValues == null ? (angleScale.ticks ? angleScale.ticks.apply(angleScale, tickArguments) : angleScale.domain()) : tickValues,
      format = tickFormat == null ? (angleScale.tickFormat ? angleScale.tickFormat.apply(angleScale, tickArguments) : identity) : tickFormat,
      spacing = Math.max(tickSizeInner, 0) + tickPadding,
      radiusScale = angleScale.copy().range([startRadius, endRadius]),
      angleRange = angleScale.range(),
      anglePos = (angleScale.bandwidth ? center : identity)(angleScale.copy()),
      selection = context.selection ? context.selection() : context,
      path = selection.selectAll(".domain").data([null]),
      tick = selection.selectAll(".tick").data(values, angleScale).order(),
      tickExit = tick.exit(),
      tickEnter = tick.enter().append("g").attr("class", "tick"),
      line = tick.select("line"),
      text = tick.select("text");

    path = path.merge(path.enter().insert("path", ".tick")
      .attr("class", "domain")
      .attr("stroke", "#000")
    );

    tick = tick.merge(tickEnter);

    line = line.merge(tickEnter.append("line")
      .attr("stroke", "#000")
    );

    text = text.merge(tickEnter.append("text")
      .attr("fill", "#000")
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
  );

    if (context !== selection) {
      path = path.transition(context);
      tick = tick.transition(context);
      line = line.transition(context);
      text = text.transition(context);

      tickExit = tickExit.transition(context)
        .attr("opacity", 0)
        .attr("transform", function(d) { return isFinite(anglePos(d)) ? angleTransform(anglePos(d), radiusScale(d)) : this.getAttribute("transform"); });

      tickEnter
        .attr("opacity", 0)
        .attr("transform", function(d) { var p = this.parentNode.__axis; return angleTransform(p && isFinite(p = p(d)) ? p : anglePos(d), radiusScale(d)); });
    }

    tickExit.remove();

    function getTickPath(angle, r) {
      return 'M' + polar2cart(angle, r + tickSizeOuter * (outer ? 1 : -1)).join(',')
        + 'L' + polar2cart(angle, r).join(',');
    }

    function getArcPath(startAngle, endAngle, r) {
      return 'M' + polar2cart(startAngle, r).join(',')
        + ((Math.abs(endAngle - startAngle) >= 2 * Math.PI) // Full-circle
            ? 'A' + [r, r, 0, 1, 1].concat(polar2cart(startAngle + Math.PI, r)).join(',')
          + 'A' + [r, r, 0, 1, 1].concat(polar2cart(startAngle, r)).join(',')
            : ''
        )
        + 'A' + [r, r, 0,
          (Math.abs(endAngle - startAngle) % (2 * Math.PI) > Math.PI ? 1 : 0),  // Large arc flag
          (endAngle > startAngle ? 1 : 0)                                       // Sweep (clock-wise) flag
        ].concat(polar2cart(endAngle, r)).join(',');
    }

    function getSpiralPath(startAngle, endAngle, startR, endR) {
      var numPoints = (endAngle - startAngle) / (Math.PI * 2) * 40; // 40 points per 360deg

      var lineGen = d3LineRadial()
        .angle(scaleLinear().range([startAngle, endAngle]))
        .radius(scaleLinear().range([startR, endR]))
        .curve(d3CurveNatural);

      return 'M' + polar2cart(startAngle, startR).join(',')
        + lineGen(scaleLinear().ticks(numPoints));
    }

    path.attr('d',
      (isSpiral ? getSpiralPath : getArcPath)(angleRange[0], angleRange[1], startRadius, endRadius)
      + getTickPath(angleRange[0], startRadius)
      + getTickPath(angleRange[1], endRadius)
    );

    tick.attr("opacity", 1)
      .attr("transform", function(d) {
        return angleTransform(anglePos(d), radiusScale(d));
      });

    line
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', function(d) { return polar2cart(anglePos(d), tickSizeInner)[0] * (outer?1:-1); })
      .attr('y2', function(d) { return polar2cart(anglePos(d), tickSizeInner)[1] * (outer?1:-1); });

    text
      .attr('x', function(d) { return polar2cart(anglePos(d), spacing)[0] * (outer?1:-1); })
      .attr('y', function(d) { return polar2cart(anglePos(d), spacing)[1] * (outer?1:-1); })
      .text(format);

    selection.filter(entering)
      .attr("fill", "none")
      .attr("font-size", 10)
      .attr("font-family", "sans-serif");

    selection
      .each(function() { this.__axis = anglePos; });
  }

  axis.angleScale = function(_) {
    return arguments.length ? (angleScale = _, axis) : angleScale;
  };

  axis.radius = function(_) {
    return arguments.length ? (startRadius = endRadius = +_, axis) : startRadius;
  };

  axis.startRadius = function(_) {
    return arguments.length ? (startRadius = +_, axis) : startRadius;
  };

  axis.endRadius = function(_) {
    return arguments.length ? (endRadius = +_, axis) : endRadius;
  };

  axis.ticks = function() {
    return tickArguments = Array.prototype.slice.call(arguments), axis;
  };

  axis.tickArguments = function(_) {
    return arguments.length ? (tickArguments = _ == null ? [] : Array.prototype.slice.call(_), axis) : tickArguments.slice();
  };

  axis.tickValues = function(_) {
    return arguments.length ? (tickValues = _ == null ? null : Array.prototype.slice.call(_), axis) : tickValues && tickValues.slice();
  };

  axis.tickFormat = function(_) {
    return arguments.length ? (tickFormat = _, axis) : tickFormat;
  };

  axis.tickSize = function(_) {
    return arguments.length ? (tickSizeInner = tickSizeOuter = +_, axis) : tickSizeInner;
  };

  axis.tickSizeInner = function(_) {
    return arguments.length ? (tickSizeInner = +_, axis) : tickSizeInner;
  };

  axis.tickSizeOuter = function(_) {
    return arguments.length ? (tickSizeOuter = +_, axis) : tickSizeOuter;
  };

  axis.tickPadding = function(_) {
    return arguments.length ? (tickPadding = +_, axis) : tickPadding;
  };

  return axis;
}

export function axisRadialInner(angleScale, startRadius, endRadius) {
  return radialAxis(angleScale, startRadius, endRadius, false);
}

export function axisRadialOuter(angleScale, startRadius, endRadius) {
  return radialAxis(angleScale, startRadius, endRadius, true);
}

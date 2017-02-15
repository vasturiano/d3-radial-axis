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

function radialAxis(scale, radius, outer) {
  var tickArguments = [],
      tickValues = null,
      tickFormat = null,
      tickSizeInner = 6,
      tickSizeOuter = 6,
      tickPadding = 12;

  function angleTransform(angle) {
      return translate.apply(translate, polar2cart(angle));
  }

  function polar2cart(angle, r) {
      r = r === undefined ? radius : r;
      return [Math.sin(angle) * r, -Math.cos(angle) * r];
  }


  function axis(context) {
    var values = tickValues == null ? (scale.ticks ? scale.ticks.apply(scale, tickArguments) : scale.domain()) : tickValues,
        format = tickFormat == null ? (scale.tickFormat ? scale.tickFormat.apply(scale, tickArguments) : identity) : tickFormat,
        spacing = Math.max(tickSizeInner, 0) + tickPadding,
        range = scale.range(),
        position = (scale.bandwidth ? center : identity)(scale.copy()),
        selection = context.selection ? context.selection() : context,
        path = selection.selectAll(".domain").data([null]),
        tick = selection.selectAll(".tick").data(values, scale).order(),
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
          .attr("transform", function(d) { return isFinite(d = position(d)) ? angleTransform(d) : this.getAttribute("transform"); });

      tickEnter
          .attr("opacity", 0)
          .attr("transform", function(d) { var p = this.parentNode.__axis; return angleTransform(p && isFinite(p = p(d)) ? p : position(d)); });
    }

    tickExit.remove();

    path.attr('d',
        'M' + polar2cart(range[0], radius + tickSizeOuter * (outer?1:-1)).join(',')
        + 'L' + polar2cart(range[0]).join(',')
        + 'A' + [radius, radius, 0,
                (Math.abs(range[1]-range[0])>Math.PI?1:0), // Large arc flag
                (range[1]>range[0]?1:0)                    // Sweep (clock-wise) flag
            ].concat(polar2cart(range[1])).join(',')
        + 'L' + polar2cart(range[1], radius + tickSizeOuter * (outer?1:-1)).join(',')
    );

    tick.attr("opacity", 1)
        .attr("transform", function(d) {
            return angleTransform(position(d));
        });

    line
        .attr('x1', 0)
        .attr('y1', 0)
        .attr('x2', function(d) { return polar2cart(position(d), tickSizeInner)[0] * (outer?1:-1); })
        .attr('y2', function(d) { return polar2cart(position(d), tickSizeInner)[1] * (outer?1:-1); });

    text
        .attr('x', function(d) { return polar2cart(position(d), spacing)[0] * (outer?1:-1); })
        .attr('y', function(d) { return polar2cart(position(d), spacing)[1] * (outer?1:-1); })
        .text(format);

    selection.filter(entering)
        .attr("fill", "none")
        .attr("font-size", 10)
        .attr("font-family", "sans-serif");

    selection
        .each(function() { this.__axis = position; });
  }

  axis.scale = function(_) {
    return arguments.length ? (scale = _, axis) : scale;
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

export function axisRadialInner(angleScale, radius) {
    return radialAxis(angleScale, radius, false);
}

export function axisRadialOuter(angleScale, radius) {
    return radialAxis(angleScale, radius, true);
}

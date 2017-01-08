function renderTree(gp, data) {
  updateEvent({el: gp}, data.roots[0], data.ts, data.tf, 0)
}

function shortString(stringId, symbol) {
  if (!data.short_strings[stringId]) {
    var str = data.strings[stringId];
    var c = 2;
    var i = str.length;
    while (c > 0 && --i > 0) {
      if (str[i] == symbol) {
        c--;
      }
    }
    data.short_strings[stringId] = i == 0 ? str : str.substr(i + 1)
  }

  return data.short_strings[stringId];
}

function updateEvent(evp, ev, gts, gtf, level) {
  var w = (ev.tsc_end - ev.tsc_start) / (gtf - gts) * 100;
  if (w < 0.01) {
   return;
  }

  var x = (ev.tsc_start - gts) / (gtf - gts) * 100;
  var y = level * 16;

  if (!ev.el) {
    ev.el = document.createElementNS(SVG_NS, 'g');
    evp.el.appendChild(ev.el);
    var g = document.createElementNS(SVG_NS, 'g');
    ev.el.appendChild(g);
    g.addEventListener('click', eventClick.bind(ev));
    g.classList.add('function-call-event');

    var rect = document.createElementNS(SVG_NS, 'rect');
    rect.setAttribute('x', x + '%');
    rect.setAttribute('y', y);
    rect.setAttribute('height', '15');
    rect.setAttribute('width', w + '%');

    g.appendChild(rect);
    if (w > 3) {
      var text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('x', x + '%');
      text.setAttribute('y', y + 11);
      g.appendChild(text);
      var name = '';
      if (ev.class_name_id) {
        name = shortString(ev.class_name_id, '\\') + '::';
      }
      if (ev.function_name_id) {
        name += data.strings[ev.function_name_id];
      }
      if (!name) {
        name = shortString(ev.filename_id, '/') + ':' + ev.line_start;
      }

      var tspan = document.createElementNS(SVG_NS, 'tspan');
      tspan.textContent = name;
      tspan.setAttribute('dx', '4');
      text.appendChild(tspan);
    }
  }

  for (var i = 0; i < ev.children.length; i++) {
    var cev = updateEvent(ev, ev.children[i], gts, gtf, level + 1)
    if (!cev.parent) {
      cev.parent = ev;
    }
  }
  return ev;
}

function eventClick() {
  console.log(this);
}

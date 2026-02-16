import { d as F, L as C, C as V, V as g, e as E, u as T, t as J, f as G, g as H, h as K, B as Q, i as U, l as X, k as Y, n as Z, o as $, p as x, q as I, r as ss, v as O, x as es, M as ts, m as ns, j as b, a as k, y as D, w as B, z as as, c as P, R as ls, I as is, T as os, b as rs, s as cs } from "./_virtual_settings-0f2c79d2.mjs";
import { c as W } from "./chain-8250120d.mjs";
function hs(i, s, a) {
  const e = {
    arcLength: 0,
    segments: [],
    minSin: 1
  };
  if (i.length === 0)
    return e;
  if (a) {
    const t = i[0].add(i[i.length - 1]).scale(0.5);
    i = [t, ...i, t];
  }
  let n = i[0];
  for (let t = 2; t < i.length; t++) {
    const r = i[t - 2], o = i[t - 1], c = i[t], m = r.sub(o), d = c.sub(o), h = m.normalized.safe, u = d.normalized.safe, z = Math.acos(F(-1, 1, h.dot(u))), y = Math.tan(z / 2), w = Math.sin(z / 2), L = Math.min(s, y * m.magnitude * (t === 2 ? 1 : 0.5), y * d.magnitude * (t === i.length - 1 ? 1 : 0.5)), N = w === 0 ? 0 : L / w, _ = y === 0 ? 0 : L / y, A = h.add(u).scale(1 / 2).normalized.safe.scale(N).add(o), v = h.perpendicular.dot(u) < 0, S = new C(n, o.add(h.scale(_))), M = new V(A, L, h.perpendicular.scale(v ? 1 : -1), u.perpendicular.scale(v ? -1 : 1), v);
    S.arcLength > 0 && (e.segments.push(S), e.arcLength += S.arcLength), M.arcLength > 0 && (e.segments.push(M), e.arcLength += M.arcLength), e.minSin = Math.min(e.minSin, Math.abs(w)), n = o.add(u.scale(_));
  }
  const l = new C(n, i[i.length - 1]);
  return l.arcLength > 0 && (e.segments.push(l), e.arcLength += l.arcLength), e;
}
function ps(i) {
  return i.reduce((s, a, e) => e ? s + i[e - 1].sub(a).magnitude : 0, 0);
}
function R(i, s, a) {
  const e = i.length;
  let n = 0;
  for (let l = 0; l < s.length; l += 1) {
    const t = i[(a + l) % e], r = s[l];
    n += t.sub(r).squaredMagnitude;
  }
  return n;
}
function fs(i, s, a) {
  const e = [];
  if (a === 0)
    return [...i];
  if (a === 1)
    return [...s];
  for (let n = 0; n < i.length; n++) {
    const l = i[n], t = s[n];
    e.push(g.lerp(l, t, a));
  }
  return e;
}
var f = globalThis && globalThis.__decorate || function(i, s, a, e) {
  var n = arguments.length, l = n < 3 ? s : e === null ? e = Object.getOwnPropertyDescriptor(s, a) : e, t;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
    l = Reflect.decorate(i, s, a, e);
  else
    for (var r = i.length - 1; r >= 0; r--)
      (t = i[r]) && (l = (n < 3 ? t(l) : n > 3 ? t(s, a, l) : t(s, a)) || l);
  return n > 3 && l && Object.defineProperty(s, a, l), l;
}, j;
let p = j = class extends E {
  /**
   * Rotate the points to minimize the overall distance traveled when tweening.
   *
   * @param points - The points to rotate.
   * @param reference - The reference points to which the distance is measured.
   * @param closed - Whether the points form a closed polygon.
   */
  static rotatePoints(s, a, e) {
    if (e) {
      let n = 1 / 0, l = 0;
      for (let t = 0; t < s.length; t += 1) {
        const r = R(s, a, t);
        r < n && (n = r, l = t);
      }
      if (l) {
        const t = s.splice(0, l);
        s.splice(s.length, 0, ...t);
      }
    } else {
      const n = R(s, a, 0), l = [...s].reverse();
      R(l, a, 0) < n && s.reverse();
    }
  }
  /**
   * Distribute additional points along the polyline.
   *
   * @param points - The points of a polyline along which new points should be
   *                 distributed.
   * @param count - The number of points to add.
   */
  static distributePoints(s, a) {
    if (s.length === 0) {
      for (let r = 0; r < a; r++)
        s.push(g.zero);
      return;
    }
    if (s.length === 1) {
      const r = s[0];
      for (let o = 0; o < a; o++)
        s.push(r);
      return;
    }
    const e = s.length + a, n = ps(s);
    let l = n === 0 ? 0 : a / n, t = 0;
    for (; s.length < e; ) {
      const r = e - s.length;
      if (t + 1 >= s.length) {
        l = n === 0 ? 0 : r / n, t = 0;
        continue;
      }
      const o = s[t], c = s[t + 1], m = o.sub(c).magnitude;
      let d = Math.min(Math.round(m * l), r) + 1;
      n === 0 && (d = 2);
      for (let h = 1; h < d; h++)
        s.splice(++t, 0, g.lerp(o, c, h / d));
      t++;
    }
  }
  *tweenPoints(s, a, e) {
    const n = [...this.parsedPoints()], l = this.parsePoints(T(s)), t = this.closed(), r = n.length - l.length;
    j.distributePoints(r < 0 ? n : l, Math.abs(r)), j.rotatePoints(l, n, t), this.tweenedPoints(n), yield* J(a, (o) => {
      const c = e(o);
      this.tweenedPoints(fs(n, l, c));
    }, () => {
      this.tweenedPoints(null), this.points(s);
    });
  }
  constructor(s) {
    super(s), this.tweenedPoints = G(null), s.children === void 0 && s.points === void 0 && H().warn({
      message: "No points specified for the line",
      remarks: `<p>The line won&#39;t be visible unless you specify at least two points:</p>
<pre class=""><code class="language-tsx">&lt;<span class="hljs-title class_">Line</span>
  stroke=<span class="hljs-string">&quot;#fff&quot;</span>
  lineWidth={<span class="hljs-number">8</span>}
  points={[
    [<span class="hljs-number">100</span>, <span class="hljs-number">0</span>],
    [<span class="hljs-number">0</span>, <span class="hljs-number">0</span>],
    [<span class="hljs-number">0</span>, <span class="hljs-number">100</span>],
  ]}
/&gt;</code></pre><p>Alternatively, you can define the points using the children:</p>
<pre class=""><code class="language-tsx">&lt;<span class="hljs-title class_">Line</span> stroke=<span class="hljs-string">&quot;#fff&quot;</span> lineWidth={<span class="hljs-number">8</span>}&gt;
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Node</span> <span class="hljs-attr">x</span>=<span class="hljs-string">{100}</span> /&gt;</span></span>
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Node</span> /&gt;</span></span>
  <span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Node</span> <span class="hljs-attr">y</span>=<span class="hljs-string">{100}</span> /&gt;</span></span>
&lt;/<span class="hljs-title class_">Line</span>&gt;</code></pre><p>If you did this intentionally, and want to disable this message, set the
<code>points</code> property to <code>null</code>:</p>
<pre class=""><code class="language-tsx">&lt;<span class="hljs-title class_">Line</span> stroke=<span class="hljs-string">&quot;#fff&quot;</span> lineWidth={<span class="hljs-number">8</span>} points={<span class="hljs-literal">null</span>} /&gt;</code></pre>`,
      inspect: this.key
    });
  }
  childrenBBox() {
    let s = this.tweenedPoints();
    if (!s) {
      const a = this.points();
      s = a ? a.map((e) => new g(T(e))) : this.children().filter((e) => !(e instanceof K) || e.isLayoutRoot()).map((e) => e.position());
    }
    return Q.fromPoints(...s);
  }
  parsedPoints() {
    return this.parsePoints(this.points());
  }
  profile() {
    return hs(this.tweenedPoints() ?? this.parsedPoints(), this.radius(), this.closed());
  }
  lineWidthCoefficient() {
    const s = this.radius(), a = this.lineJoin();
    let e = super.lineWidthCoefficient();
    if (s === 0 && a === "miter") {
      const { minSin: n } = this.profile();
      n > 0 && (e = Math.max(e, 0.5 / n));
    }
    return e;
  }
  drawOverlay(s, a) {
    const e = this.childrenBBox().transformCorners(a), l = this.computedSize().mul(this.offset()).scale(0.5).transformAsPoint(a);
    s.fillStyle = "white", s.strokeStyle = "black", s.lineWidth = 1;
    const t = new Path2D(), r = (this.tweenedPoints() ?? this.parsedPoints()).map((o) => o.transformAsPoint(a));
    if (r.length > 0) {
      U(t, r[0]);
      for (const o of r)
        X(t, o), s.beginPath(), Y(s, o, 4), s.closePath(), s.fill(), s.stroke();
    }
    s.strokeStyle = "white", s.stroke(t), s.beginPath(), Z(s, l), s.stroke(), s.beginPath(), $(s, e), s.closePath(), s.stroke();
  }
  parsePoints(s) {
    return s ? s.map((a) => new g(T(a))) : this.children().map((a) => a.position());
  }
};
f([
  x(0),
  I()
], p.prototype, "radius", void 0);
f([
  x(null),
  I()
], p.prototype, "points", void 0);
f([
  ss()
], p.prototype, "tweenPoints", null);
f([
  O()
], p.prototype, "childrenBBox", null);
f([
  O()
], p.prototype, "parsedPoints", null);
f([
  O()
], p.prototype, "profile", null);
p = j = f([
  es("Line")
], p);
let q;
q ?? (q = new ts("template2", !1));
q.loadData({
  version: 0
});
const ds = q, us = ns(function* (i) {
  console.log("Template2 scene started");
  const s = i.variables.text, a = i.variables.images;
  console.log("Template variables:", { text: s, images: a });
  const e = P(), n = P(), l = P(), t = [];
  for (let o = 0; o < 10; o++)
    t.push(P());
  i.add(
    /* @__PURE__ */ b(ls, { ref: l, width: 1920, height: 1080, fill: "#000000", children: [
      t.map((o, c) => /* @__PURE__ */ b(
        p,
        {
          ref: o,
          points: [
            [-960 + c * 200, -540],
            [-960 + c * 200, 540]
          ],
          stroke: "#ffffff",
          lineWidth: 2,
          opacity: 0
        }
      )),
      /* @__PURE__ */ b(
        is,
        {
          ref: n,
          src: "/placeholder.jpg",
          width: 800,
          height: 600,
          opacity: 0,
          scale: 0.8
        }
      ),
      /* @__PURE__ */ b(
        os,
        {
          ref: e,
          text: "Поздравление",
          fill: "#ffffff",
          fontFamily: "Arial",
          fontSize: 60,
          opacity: 0,
          y: 300
        }
      )
    ] })
  ), yield* l().fill("#000000", 0), yield* k(
    ...t.map(
      (o, c) => W(
        B(c * 0.1),
        o().opacity(0.2, 0.5, D)
      )
    )
  ), yield* W(
    B(0.5),
    k(
      n().opacity(1, 1, D),
      n().scale(1, 1.5, as)
    )
  );
  const r = "Поздравление";
  for (let o = 1; o <= r.length; o++)
    yield* e().text(r.slice(0, o), 0.1);
  yield* e().position.y(200, 1, D), yield* B(1), yield* k(
    e().opacity(0, 0.5),
    n().opacity(0, 0.5),
    ...t.map((o) => o().opacity(0, 0.5)),
    l().fill("#000000", 0.5)
  );
}), bs = rs(
  "template2",
  { core: "3.17.2", two: "3.17.2", ui: "3.17.2", vitePlugin: "3.17.2" },
  [],
  us,
  ds,
  cs
);
export {
  bs as default
};

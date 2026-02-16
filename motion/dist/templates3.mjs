import { M as y, m as d, j as a, A as m, y as s, w as l, a as h, c as i, R as p, I as x, T as g, b as u, s as w } from "./_virtual_settings-0f2c79d2.mjs";
import { c } from "./chain-8250120d.mjs";
let f;
f ?? (f = new y("template3", !1));
f.loadData({
  version: 0
});
const b = f, F = d(function* (r) {
  const e = i(), t = i(), n = i(), o = i();
  r.add(
    /* @__PURE__ */ a(p, { ref: n, width: 1920, height: 1080, fill: "#ffffff", children: [
      /* @__PURE__ */ a(
        p,
        {
          ref: o,
          width: 1920,
          height: 1080,
          fill: "#000000",
          opacity: 0
        }
      ),
      /* @__PURE__ */ a(
        x,
        {
          ref: t,
          src: "/placeholder.jpg",
          width: 960,
          height: 1080,
          x: -480,
          opacity: 0
        }
      ),
      /* @__PURE__ */ a(
        g,
        {
          ref: e,
          text: "Поздравление",
          fill: "#000000",
          fontFamily: "Arial",
          fontSize: 60,
          x: 480,
          opacity: 0
        }
      )
    ] })
  ), yield* n().fill("#ffffff", 0), yield* c(
    t().position.x(-960, 0),
    t().opacity(1, 0),
    t().position.x(-480, 1.5, m)
  ), yield* c(
    l(0.5),
    e().opacity(1, 1, s)
  ), yield* c(
    l(1),
    o().opacity(0.7, 1, s)
  ), yield* e().position.x(0, 1, s), yield* l(1), yield* h(
    e().opacity(0, 0.5),
    t().opacity(0, 0.5),
    o().opacity(1, 0.5)
  );
}), v = u(
  "template3",
  { core: "3.17.2", two: "3.17.2", ui: "3.17.2", vitePlugin: "3.17.2" },
  [],
  F,
  b,
  w
);
export {
  v as default
};

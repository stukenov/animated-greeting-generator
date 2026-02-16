import { M as n, m as r, j as o, I as f, T as m, R as p, w as d, a as g, c, b as y, s as h } from "./_virtual_settings-0f2c79d2.mjs";
let s;
s ?? (s = new n("template1", !1));
s.loadData({
  version: 0
});
const w = s, x = r(function* (t) {
  const l = t.variables.text, e = t.variables.images;
  if (console.log("Template variables:", { text: l, images: e }), !e || !e.length)
    throw new Error("No images provided");
  const a = c(), i = c();
  t.add(
    /* @__PURE__ */ o(p, { width: 1920, height: 1080, fill: "#141414", children: [
      /* @__PURE__ */ o(
        f,
        {
          ref: i,
          src: e[0],
          width: 800,
          height: 600,
          opacity: 0
        }
      ),
      /* @__PURE__ */ o(
        m,
        {
          ref: a,
          text: l,
          fill: "#fff",
          fontFamily: "Arial",
          fontSize: 60,
          opacity: 0
        }
      )
    ] })
  ), yield* i().opacity(1, 1), yield* a().opacity(1, 1), yield* d(2), yield* g(
    i().opacity(0, 1),
    a().opacity(0, 1)
  );
}), R = y(
  "template1",
  { core: "3.17.2", two: "3.17.2", ui: "3.17.2", vitePlugin: "3.17.2" },
  [],
  x,
  w,
  h
);
export {
  R as default
};

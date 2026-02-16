class ps {
  constructor() {
    this.subscribable = new wi(this), this.subscribers = /* @__PURE__ */ new Set();
  }
  /**
   * {@inheritDoc Subscribable.subscribe}
   */
  subscribe(t) {
    return this.subscribers.add(t), () => this.unsubscribe(t);
  }
  /**
   * {@inheritDoc Subscribable.unsubscribe}
   */
  unsubscribe(t) {
    this.subscribers.delete(t);
  }
  /**
   * Unsubscribe all subscribers from the event.
   */
  clear() {
    this.subscribers.clear();
  }
  notifySubscribers(t) {
    return [...this.subscribers].map((e) => e(t));
  }
}
class wi {
  constructor(t) {
    this.dispatcher = t;
  }
  /**
   * Subscribe to the event.
   *
   * @param handler - The handler to invoke when the event occurs.
   *
   * @returns A callback function that cancels the subscription.
   */
  subscribe(t) {
    return this.dispatcher.subscribe(t);
  }
  /**
   * Unsubscribe from the event.
   *
   * @param handler - The handler to unsubscribe.
   */
  unsubscribe(t) {
    this.dispatcher.unsubscribe(t);
  }
}
class Dt extends ps {
  dispatch(t) {
    this.notifySubscribers(t);
  }
}
class hc extends ps {
  constructor() {
    super(...arguments), this.value = !1;
  }
  /**
   * Notify all current and future subscribers.
   */
  raise() {
    this.value || (this.value = !0, this.notifySubscribers());
  }
  /**
   * Stop notifying future subscribers.
   */
  reset() {
    this.value = !1;
  }
  /**
   * Are subscribers being notified?
   */
  isRaised() {
    return this.value;
  }
  subscribe(t) {
    const e = super.subscribe(t);
    return this.value && t(), e;
  }
}
class Ce extends ps {
  /**
   * {@inheritDoc SubscribableValueEvent.current}
   */
  get current() {
    return this.value;
  }
  /**
   * Set the current value of this dispatcher.
   *
   * @remarks
   * Setting the value will immediately notify all subscribers.
   *
   * @param value - The new value.
   */
  set current(t) {
    this.value = t, this.notifySubscribers(t);
  }
  /**
   * @param value - The initial value.
   */
  constructor(t) {
    super(), this.value = t, this.subscribable = new cc(this);
  }
  /**
   * {@inheritDoc SubscribableValueEvent.subscribe}
   */
  subscribe(t, e = !0) {
    const r = super.subscribe(t);
    return e && t(this.value), r;
  }
}
class cc extends wi {
  /**
   * Get the most recent value of this dispatcher.
   */
  get current() {
    return this.dispatcher.current;
  }
  /**
   * Subscribe to the event.
   *
   * Subscribing will immediately invoke the handler with the most recent value.
   *
   * @param handler - The handler to invoke when the event occurs.
   * @param dispatchImmediately - Whether the handler should be immediately
   *                              invoked with the most recent value.
   *
   * @returns Callback function that cancels the subscription.
   */
  subscribe(t, e = !0) {
    return this.dispatcher.subscribe(t, e);
  }
}
class Tt {
  /**
   * Triggered when the data of this field changes.
   *
   * @eventProperty
   */
  get onChanged() {
    return this.value.subscribable;
  }
  /**
   * Triggered when the field becomes disabled or enabled.
   *
   * @eventProperty
   */
  get onDisabled() {
    return this.disabled.subscribable;
  }
  /**
   * @param name - The name of this field displayed in the editor.
   * @param initial - The initial value of this field.
   */
  constructor(t, e) {
    this.name = t, this.initial = e, this.type = void 0, this.spacing = !1, this.description = "", this.disabled = new Ce(!1), this.value = new Ce(e);
  }
  /**
   * Get the current value.
   */
  get() {
    return this.value.current;
  }
  /**
   * Set the current value.
   *
   * @param value - The new value.
   */
  set(t) {
    this.value.current = this.parse(t);
  }
  /**
   * Convert a serialized value into a runtime type.
   *
   * @param value - The serialized value.
   */
  parse(t) {
    return t;
  }
  /**
   * Serialize the value of this field.
   */
  serialize() {
    return this.value.current;
  }
  /**
   * Create a clone of this field.
   */
  clone() {
    return new this.constructor(this.name, this.get());
  }
  /**
   * Disable or enable the field in the editor.
   *
   * @param value - Whether the field should be disabled.
   */
  disable(t = !0) {
    return this.disabled.current = t, this;
  }
  /**
   * Add or remove spacing at the beginning of this field.
   *
   * @param value - Whether to include the spacing.
   */
  space(t = !0) {
    return this.spacing = t, this;
  }
  /**
   * Set the description of this field.
   *
   * @param description - The description.
   */
  describe(t) {
    return this.description = t, this;
  }
}
class uc extends Tt {
  /**
   * Triggered when the nested fields change.
   *
   * @eventProperty
   */
  get onFieldsChanged() {
    return this.event.subscribable;
  }
  constructor(t, e) {
    const r = new Map(Object.entries(e));
    super(t, Object.fromEntries(Array.from(r, ([i, a]) => [i, a.get()]))), this.type = Object, this.ignoreChange = !1, this.customFields = {}, this.handleChange = () => {
      this.ignoreChange || (this.value.current = {
        ...this.transform("get"),
        ...this.customFields
      });
    }, this.event = new Ce([...r.values()]), this.fields = r;
    for (const [i, a] of this.fields)
      Object.defineProperty(this, i, { value: a }), a.onChanged.subscribe(this.handleChange);
  }
  set(t) {
    this.ignoreChange = !0;
    for (const [e, r] of Object.entries(t)) {
      const i = this.fields.get(e);
      i ? i.set(r) : this.customFields[e] = r;
    }
    this.ignoreChange = !1, this.handleChange();
  }
  serialize() {
    return {
      ...this.transform("serialize"),
      ...this.customFields
    };
  }
  clone() {
    const t = new this.constructor(this.name, this.transform("clone"));
    return t.set(structuredClone(this.customFields)), t;
  }
  transform(t) {
    return Object.fromEntries(Array.from(this.fields, ([r, i]) => [r, i[t]()]));
  }
}
const ie = uc;
class oi extends Tt {
  constructor() {
    super(...arguments), this.type = Boolean;
  }
  parse(t) {
    return !!t;
  }
}
class ds extends Error {
  constructor(t, e) {
    typeof t == "string" ? (super(t), this.remarks = e) : (super(t.message), this.remarks = t.remarks, this.object = t.object, this.durationMs = t.durationMs, this.inspect = t.inspect);
  }
}
class fc {
  constructor() {
    this.resolveCurrent = null, this.current = null;
  }
  async acquire() {
    for (; this.current; )
      await this.current;
    this.current = new Promise((t) => {
      this.resolveCurrent = t;
    });
  }
  release() {
    var t;
    this.current = null, (t = this.resolveCurrent) == null || t.call(this), this.resolveCurrent = null;
  }
}
const Cr = [];
function gs() {
  const s = Cr.at(-1);
  if (!s)
    throw new Error("The scene is not available in the current context.");
  return s;
}
function pc(s) {
  Cr.push(s);
}
function dc(s) {
  if (Cr.pop() !== s)
    throw new Error("startScene/endScene were called out of order.");
}
function ut() {
  var s;
  return ((s = Cr.at(-1)) == null ? void 0 : s.logger) ?? console;
}
const vs = [];
function Tr() {
  const s = vs.at(-1);
  if (!s)
    throw new ds("The thread is not available in the current context.", `<p><code>useThread()</code> can only be called from within generator functions.
      It&#39;s not available during rendering.</p>
`);
  return s;
}
function li(s) {
  vs.push(s);
}
function hi(s) {
  if (vs.pop() !== s)
    throw new Error("startThread/endThread was called out of order.");
}
function be(s) {
  return s[0].toUpperCase() + s.slice(1);
}
function Su() {
  let s;
  return (e) => {
    if (e !== void 0)
      s = e;
    else
      return s;
  };
}
function xi(s) {
  return {
    message: s.message,
    stack: s.stack,
    remarks: s.remarks
  };
}
const ci = [
  { value: 0.25, text: "0.25x (Quarter)" },
  { value: 0.5, text: "0.5x (Half)" },
  { value: 1, text: "1.0x (Full)" },
  { value: 2, text: "2.0x (Double)" }
], gc = [
  { value: "srgb", text: "sRGB" },
  { value: "display-p3", text: "DCI-P3" }
], ui = [
  { value: 30, text: "30 FPS" },
  { value: 60, text: "60 FPS" }
];
var At;
(function(s) {
  s.Error = "error", s.Warn = "warn", s.Info = "info", s.Http = "http", s.Verbose = "verbose", s.Debug = "debug", s.Silly = "silly";
})(At || (At = {}));
class vc {
  constructor() {
    this.logged = new Dt(), this.history = [], this.profilers = {};
  }
  /**
   * Triggered when a new message is logged.
   */
  get onLogged() {
    return this.logged.subscribable;
  }
  log(t) {
    this.logged.dispatch(t), this.history.push(t);
  }
  error(t) {
    this.logLevel(At.Error, t);
  }
  warn(t) {
    this.logLevel(At.Warn, t);
  }
  info(t) {
    this.logLevel(At.Info, t);
  }
  http(t) {
    this.logLevel(At.Http, t);
  }
  verbose(t) {
    this.logLevel(At.Verbose, t);
  }
  debug(t) {
    this.logLevel(At.Debug, t);
  }
  silly(t) {
    this.logLevel(At.Silly, t);
  }
  logLevel(t, e) {
    const r = typeof e == "string" ? { message: e } : e;
    r.level = t, this.log(r);
  }
  profile(t, e) {
    const r = performance.now();
    if (this.profilers[t]) {
      const i = this.profilers[t];
      delete this.profilers[t];
      const a = e ?? { message: t };
      a.level ?? (a.level = At.Debug), a.durationMs = r - i, this.log(a);
      return;
    }
    this.profilers[t] = r;
  }
}
var Ye;
(function(s) {
  s[s.Playing = 0] = "Playing", s[s.Rendering = 1] = "Rendering", s[s.Paused = 2] = "Paused", s[s.Presenting = 3] = "Presenting";
})(Ye || (Ye = {}));
function mc(s) {
  const t = {
    version: new Tt("version", 1),
    shared: new ie("General", {
      background: new hs("background", null),
      range: new Rr("range", [0, 1 / 0]),
      size: new Ii("resolution", new g(1920, 1080)),
      audioOffset: new as("audio offset", 0)
    }),
    preview: new ie("Preview", {
      fps: new as("frame rate", 30).setPresets(ui).setRange(1),
      resolutionScale: new xe("scale", ci, 1)
    }),
    rendering: new ie("Rendering", {
      fps: new as("frame rate", 60).setPresets(ui).setRange(1),
      resolutionScale: new xe("scale", ci, 1),
      colorSpace: new xe("color space", gc),
      exporter: new eu("exporter", s)
    })
  };
  return t.shared.audioOffset.disable(!s.audio), t;
}
class bc extends ie {
  constructor(t) {
    super("project", mc(t));
  }
  getFullPreviewSettings() {
    return {
      ...this.shared.get(),
      ...this.preview.get()
    };
  }
  getFullRenderingSettings() {
    return {
      ...this.shared.get(),
      ...this.rendering.get()
    };
  }
}
function yc() {
  return new ie("Application Settings", {
    version: new Tt("version", 1),
    appearance: new ie("Appearance", {
      color: new hs("accent color", new Yt("#33a6ff")).describe("The accent color for the user interface. (Leave empty to use the default color)"),
      font: new oi("legacy font", !1).describe("Use the 'JetBrains Mono' font for the user interface."),
      coordinates: new oi("coordinates", !0).describe("Display mouse coordinates within the preview window.")
    }),
    defaults: new ie("Defaults", {
      background: new hs("background", null).describe("The default background color used in new projects."),
      size: new Ii("resolution", new g(1920, 1080)).describe("The default resolution used in new projects.")
    })
  });
}
function ku(s, t, e, r, i, a, h = r.logger ?? new vc()) {
  const u = yc();
  a.attach(u);
  const m = {
    name: s,
    ...r,
    plugins: e,
    versions: t,
    settings: u,
    logger: h
  };
  return m.meta = new bc(m), m.meta.shared.set(u.defaults.get()), m.experimentalFeatures ?? (m.experimentalFeatures = !1), i.attach(m.meta), m;
}
function wc(s, t) {
  return {
    level: At.Error,
    message: s,
    remarks: (t ?? "") + `<p>This feature requires enabling the <code>experimentalFeatures</code> flag in your project
configuration:</p>
<pre class=""><code class="language-ts"><span class="hljs-keyword">export</span> <span class="hljs-keyword">default</span> <span class="hljs-title function_">makeProject</span>({
  <span class="hljs-attr">experimentalFeatures</span>: <span class="hljs-literal">true</span>,
  <span class="hljs-comment">// ...</span>
});</code></pre><p><a href='https://motioncanvas.io/docs/experimental' target='_blank'>Learn more</a> about experimental
features.</p>
`
  };
}
const xc = 180 / Math.PI, os = Math.PI / 180;
function Cc(s) {
  if (!Ci() || s.startsWith("/cors-proxy/"))
    return s;
  const t = new URL(window.location.toString());
  try {
    const e = new URL(s, t);
    if (!e.protocol.startsWith("http") || t.host === e.host || !Tc(e.host))
      return s;
  } catch {
    return s;
  }
  return `/cors-proxy/${encodeURIComponent(s)}`;
}
function Tc(s) {
  const t = Sc();
  if (t.length === 0)
    return !0;
  for (const e of t)
    if (e.toLowerCase().trim() === s)
      return !0;
  return !1;
}
function Ci() {
  return !1;
}
let pr;
function Sc() {
  return {}.VITEST !== "true" && pr ? [...pr] : (pr = function() {
    if (!Ci() || !{ VITE_MC_PROXY_ENABLED: "false", BASE_URL: "/", MODE: "production", DEV: !1, PROD: !0, SSR: !1 })
      return [];
    const t = {}.VITE_MC_PROXY_ALLOW_LIST ?? "[]", e = JSON.parse(t);
    Array.isArray(e) || ut().error("Parsed Allow List expected to be an Array, but is " + typeof e);
    const r = [];
    for (const i of e) {
      if (typeof i != "string") {
        ut().warn("Unexpected Value in Allow List: " + i + ". Expected a String. Skipping.");
        continue;
      }
      r.push(i);
    }
    return r;
  }(), [...pr]);
}
function fi(s, t, e) {
  let r = 0, i = s;
  t !== void 0 && (r = s, i = t), e = e === void 0 ? r < i ? 1 : -1 : e;
  const a = [];
  let h = Math.max(Math.ceil((i - r) / e), 0), u = 0;
  for (; h--; )
    a[u++] = r, r += e;
  return a;
}
function kc(s) {
  const t = gs(), e = Tr();
  return t.timeEvents.register(s, e.time());
}
const ms = [];
function Ti() {
  const s = ms.at(-1);
  if (!s)
    throw new Error("The playback is not available in the current context.");
  return s;
}
function Rc(s) {
  ms.push(s);
}
function Pc(s) {
  if (ms.pop() !== s)
    throw new Error("startPlayback/endPlayback were called out of order.");
}
function le(s, ...t) {
  const e = { [s.name]: s }, r = Object.getOwnPropertyDescriptor(e, s.name);
  if (r)
    for (let i = t.length - 1; i >= 0; i--)
      t[i](e, s.name, r);
}
const pi = Symbol.for("@motion-canvas/core/decorators/UNINITIALIZED");
function Sr(s) {
  return (t, e) => {
    let r = pi;
    Object.defineProperty(t, e, {
      get() {
        return r === pi && (r = s.call(this)), r;
      }
    });
  };
}
function ct(s) {
  return function(t, e, r) {
    r.value.prototype.name = s ?? e, r.value.prototype.threadable = !0;
  };
}
le(ye, ct());
function* ye(...s) {
  for (const t of s)
    yield t;
  yield* Pi(...s);
}
le(Mc, ct());
function* Mc(s, t) {
  yield* bs(kc(s)), t && (yield* t);
}
le(bs, ct());
function* bs(s = 0, t) {
  const e = Tr(), r = Ti().framesToSeconds(1), i = e.time() + s;
  for (; i - r > e.fixed; )
    yield;
  e.time(i), t && (yield* t);
}
le(Si, ct());
function* Si() {
}
function di(s, t) {
  let e;
  return typeof s == "string" ? (e = t(), xr(e, s)) : (e = s(), xr(e, e)), e;
}
function Lc(s) {
  return s && (typeof s == "object" || typeof s == "function") && "toPromise" in s;
}
function ki(s) {
  return s !== null && typeof s == "object" && Symbol.iterator in s && "next" in s;
}
function xr(s, t) {
  const e = Object.getPrototypeOf(s);
  e.threadable || (e.threadable = !0, e.name = typeof t == "string" ? t : Ri(t));
}
function Ri(s) {
  return Object.getPrototypeOf(s).name ?? null;
}
class is {
  get onDeferred() {
    return this.deferred.subscribable;
  }
  /**
   * The fixed time of this thread.
   *
   * @remarks
   * Fixed time is a multiple of the frame duration. It can be used to account
   * for the difference between this thread's {@link time} and the time of the
   * current animation frame.
   */
  get fixed() {
    return this.fixedTime;
  }
  /**
   * Check if this thread or any of its ancestors has been canceled.
   */
  get canceled() {
    var t;
    return this.isCanceled || (((t = this.parent) == null ? void 0 : t.canceled) ?? !1);
  }
  get paused() {
    var t;
    return this.isPaused || (((t = this.parent) == null ? void 0 : t.paused) ?? !1);
  }
  get root() {
    var t;
    return ((t = this.parent) == null ? void 0 : t.root) ?? this;
  }
  constructor(t) {
    this.runner = t, this.deferred = new Dt(), this.children = [], this.time = Ne(0), this.parent = null, this.isCanceled = !1, this.isPaused = !1, this.fixedTime = 0, this.queue = [], this.runner.task && (ut().error({
      message: `The generator "${Ri(this.runner)}" is already being executed by another thread.`,
      remarks: `<p>This usually happens when you mistakenly reuse a generator that is already
running.</p>
<p>For example, using <code>yield</code> here will run the opacity generator concurrently and
store it in the <code>task</code> variable (in case you want to cancel or await it later):</p>
<pre class=""><code class="language-ts"><span class="hljs-keyword">const</span> task = <span class="hljs-keyword">yield</span> <span class="hljs-title function_">rect</span>().<span class="hljs-title function_">opacity</span>(<span class="hljs-number">1</span>, <span class="hljs-number">1</span>);</code></pre><p>Trying to <code>yield</code> this task again will cause the current error:</p>
<pre class=""><code class="language-ts"><span class="hljs-keyword">yield</span> task;</code></pre><p>Passing it to other flow functions will also cause the error:</p>
<pre class=""><code class="language-ts"><span class="hljs-keyword">yield</span>* <span class="hljs-title function_">all</span>(task);</code></pre><p>Try to investigate your code looking for <code>yield</code> statements whose return value
is reused in this way. Here&#39;s an example of a common mistake:</p>
<pre class="wrong"><code class="language-ts"><span class="hljs-keyword">yield</span>* <span class="hljs-title function_">all</span>(
  <span class="hljs-keyword">yield</span> <span class="hljs-title function_">rect</span>().<span class="hljs-title function_">opacity</span>(<span class="hljs-number">1</span>, <span class="hljs-number">1</span>), 
  <span class="hljs-keyword">yield</span> <span class="hljs-title function_">rect</span>().<span class="hljs-title function_">x</span>(<span class="hljs-number">200</span>, <span class="hljs-number">1</span>),
);</code></pre><pre class="correct"><code class="language-ts"><span class="hljs-keyword">yield</span>* <span class="hljs-title function_">all</span>(
  <span class="hljs-title function_">rect</span>().<span class="hljs-title function_">opacity</span>(<span class="hljs-number">1</span>, <span class="hljs-number">1</span>), 
  <span class="hljs-title function_">rect</span>().<span class="hljs-title function_">x</span>(<span class="hljs-number">200</span>, <span class="hljs-number">1</span>),
);</code></pre>`
    }), this.runner = Si()), this.runner.task = this;
  }
  /**
   * Progress the wrapped generator once.
   */
  next() {
    if (this.paused)
      return {
        value: null,
        done: !1
      };
    li(this);
    const t = this.runner.next(this.value);
    return hi(this), this.value = null, t;
  }
  /**
   * Prepare the thread for the next update cycle.
   *
   * @param dt - The delta time of the next cycle.
   */
  update(t) {
    this.paused || (this.time(this.time() + t), this.fixedTime += t), this.children = this.children.filter((e) => !e.canceled);
  }
  spawn(t) {
    return ki(t) || (t = t()), this.queue.push(t), t;
  }
  add(t) {
    t.parent = this, t.isCanceled = !1, t.time(this.time()), t.fixedTime = this.fixedTime, this.children.push(t), xr(t.runner, `unknown ${this.children.length}`);
  }
  drain(t) {
    this.queue.forEach(t), this.queue = [];
  }
  cancel() {
    this.deferred.clear(), this.runner.return(), this.isCanceled = !0, this.parent = null, this.drain((t) => t.return());
  }
  pause(t) {
    this.isPaused = t;
  }
  runDeferred() {
    li(this), this.deferred.dispatch(), hi(this);
  }
}
le(Pi, ct());
function* Pi(s, ...t) {
  let e = !0;
  typeof s == "boolean" ? e = s : t.push(s);
  const r = Tr(), i = t.map((u) => r.children.find((m) => m.runner === u)).filter((u) => u), a = r.time();
  let h;
  if (e) {
    for (; i.find((u) => !u.canceled); )
      yield;
    h = Math.max(...i.map((u) => u.time()));
  } else {
    for (; !i.find((m) => m.canceled); )
      yield;
    const u = i.filter((m) => m.canceled);
    h = Math.min(...u.map((m) => m.time()));
  }
  r.time(Math.max(a, h));
}
function $c(s) {
  return typeof (s == null ? void 0 : s.then) == "function";
}
le(Mi, ct());
function* Mi(s, t) {
  const e = Ti(), r = s();
  xr(r, "root");
  const i = new is(r);
  t == null || t(i);
  let a = [i];
  for (; a.length > 0; ) {
    const h = [], u = [...a], m = e.deltaTime;
    for (; u.length > 0; ) {
      const y = u.pop();
      if (!y || y.canceled)
        continue;
      const S = y.next();
      if (S.done) {
        y.cancel();
        continue;
      }
      if (ki(S.value)) {
        const F = new is(S.value);
        y.value = S.value, y.add(F), u.push(y), u.push(F);
      } else
        S.value ? (y.value = yield S.value, u.push(y)) : (y.update(m), y.drain((F) => {
          const X = new is(F);
          y.add(X), h.unshift(X);
        }), h.unshift(y));
    }
    a = [];
    for (const y of h)
      y.canceled || (a.push(y), y.runDeferred());
    a.length > 0 && (yield);
  }
}
var jt;
(function(s) {
  s[s.BeforeRender = 0] = "BeforeRender", s[s.BeginRender = 1] = "BeginRender", s[s.FinishRender = 2] = "FinishRender", s[s.AfterRender = 3] = "AfterRender";
})(jt || (jt = {}));
class Ac {
  get onBeforeRender() {
    return this.beforeRender.subscribable;
  }
  get onBeginRender() {
    return this.beginRender.subscribable;
  }
  get onFinishRender() {
    return this.finishRender.subscribable;
  }
  get onAfterRender() {
    return this.afterRender.subscribable;
  }
  constructor(t) {
    this.scene = t, this.beforeRender = new Dt(), this.beginRender = new Dt(), this.finishRender = new Dt(), this.afterRender = new Dt(), this.scene.onRenderLifecycle.subscribe(([e, r]) => {
      switch (e) {
        case jt.BeforeRender:
          return this.beforeRender.dispatch(r);
        case jt.BeginRender:
          return this.beginRender.dispatch(r);
        case jt.FinishRender:
          return this.finishRender.dispatch(r);
        case jt.AfterRender:
          return this.afterRender.dispatch(r);
      }
    }), this.scene.onReset.subscribe(() => {
      this.beforeRender.clear(), this.beginRender.clear(), this.finishRender.clear(), this.afterRender.clear();
    });
  }
}
class Ze {
  constructor(t) {
    this.state = t, this.nextGauss = null;
  }
  /**
   * @internal
   */
  static createSeed() {
    return Math.floor(Math.random() * 4294967296);
  }
  /**
   * Get the next random float in the given range.
   *
   * @param from - The start of the range.
   * @param to - The end of the range.
   */
  nextFloat(t = 0, e = 1) {
    return Q(t, e, this.next());
  }
  /**
   * Get the next random integer in the given range.
   *
   * @param from - The start of the range.
   * @param to - The end of the range. Exclusive.
   */
  nextInt(t = 0, e = 4294967296) {
    let r = Math.floor(Q(t, e, this.next()));
    return r === e && (r = t), r;
  }
  /**
   * Get a random float from a gaussian distribution.
   * @param mean - The mean of the distribution.
   * @param stdev - The standard deviation of the distribution.
   */
  gauss(t = 0, e = 1) {
    let r = this.nextGauss;
    if (this.nextGauss = null, r === null) {
      const i = this.next() * 2 * Math.PI, a = Math.sqrt(-2 * Math.log(1 - this.next()));
      r = Math.cos(i) * a, this.nextGauss = Math.sin(i) * a;
    }
    return t + r * e;
  }
  /**
   * Get an array filled with random floats in the given range.
   *
   * @param size - The size of the array.
   * @param from - The start of the range.
   * @param to - The end of the range.
   */
  floatArray(t, e = 0, r = 1) {
    return fi(t).map(() => this.nextFloat(e, r));
  }
  /**
   Get an array filled with random integers in the given range.
   *
   * @param size - The size of the array.
   * @param from - The start of the range.
   * @param to - The end of the range. Exclusive.
   */
  intArray(t, e = 0, r = 4294967296) {
    return fi(t).map(() => this.nextInt(e, r));
  }
  /**
   * Create a new independent generator.
   */
  spawn() {
    return new Ze(this.nextInt());
  }
  next() {
    this.state |= 0, this.state = this.state + 1831565813 | 0;
    let t = Math.imul(this.state ^ this.state >>> 15, 1 | this.state);
    return t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t, ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
var vt;
(function(s) {
  s[s.Initial = 0] = "Initial", s[s.AfterTransitionIn = 1] = "AfterTransitionIn", s[s.CanTransitionOut = 2] = "CanTransitionOut", s[s.Finished = 3] = "Finished";
})(vt || (vt = {}));
const Oc = "resolution", Ic = "destinationTexture", zc = "sourceTexture", gi = "time", Ec = "deltaTime", Fc = "framerate", _c = "sourceMatrix", Dc = "destinationMatrix", jc = `#version 300 es

in vec2 position;

out vec2 screenUV;
out vec2 sourceUV;
out vec2 destinationUV;

uniform mat4 sourceMatrix;
uniform mat4 destinationMatrix;

void main() {
    vec2 position_source = position * 0.5 + 0.5;
    vec4 position_screen = sourceMatrix * vec4(position_source, 0, 1);

    screenUV = position_screen.xy;
    sourceUV = position_source;
    destinationUV = (destinationMatrix * position_screen).xy;

    gl_Position = (position_screen - 0.5) * 2.0;
}
`;
class Nc {
  constructor(t, e) {
    this.scene = t, this.sharedContext = e, this.gl = null, this.positionBuffer = null, this.sourceTexture = null, this.destinationTexture = null, this.positionLocation = 0, this.quadPositions = new Float32Array([
      -1,
      1,
      -1,
      -1,
      1,
      1,
      1,
      -1
    ]), this.handleReload = () => {
      this.gl && this.updateViewport();
    }, t.onReloaded.subscribe(this.handleReload);
  }
  setup(t) {
    this.gl = t, this.updateViewport(), this.positionBuffer = t.createBuffer(), t.bindBuffer(t.ARRAY_BUFFER, this.positionBuffer), t.bufferData(t.ARRAY_BUFFER, this.quadPositions, t.STATIC_DRAW), t.vertexAttribPointer(this.positionLocation, 2, t.FLOAT, !1, 0, 0), t.enableVertexAttribArray(this.positionLocation), this.sourceTexture = t.createTexture(), t.activeTexture(t.TEXTURE0), t.bindTexture(t.TEXTURE_2D, this.sourceTexture), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE), this.destinationTexture = t.createTexture(), t.activeTexture(t.TEXTURE1), t.bindTexture(t.TEXTURE_2D, this.destinationTexture), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_S, t.CLAMP_TO_EDGE), t.texParameteri(t.TEXTURE_2D, t.TEXTURE_WRAP_T, t.CLAMP_TO_EDGE);
  }
  teardown(t) {
    t.deleteBuffer(this.positionBuffer), t.disableVertexAttribArray(this.positionLocation), t.deleteTexture(this.sourceTexture), t.deleteTexture(this.destinationTexture), this.positionBuffer = null, this.sourceTexture = null, this.destinationTexture = null, this.gl = null;
  }
  updateViewport() {
    if (this.gl) {
      const t = this.scene.getRealSize();
      this.gl.canvas.width = t.width, this.gl.canvas.height = t.height, this.gl.viewport(0, 0, t.width, t.height);
    }
  }
  getGL() {
    return this.gl ?? this.sharedContext.borrow(this);
  }
  getProgram(t) {
    const e = this.sharedContext.getProgram(t, jc);
    if (!e)
      return null;
    const r = this.scene.getRealSize(), i = this.getGL();
    return i.useProgram(e), i.uniform1i(i.getUniformLocation(e, zc), 0), i.uniform1i(i.getUniformLocation(e, Ic), 1), i.uniform2f(i.getUniformLocation(e, Oc), r.x, r.y), i.uniform1f(i.getUniformLocation(e, Ec), this.scene.playback.deltaTime), i.uniform1f(i.getUniformLocation(e, Fc), this.scene.playback.fps), e;
  }
  copyTextures(t, e) {
    this.copyTexture(e, this.sourceTexture), this.copyTexture(t, this.destinationTexture);
  }
  clear() {
    const t = this.getGL();
    t.clearColor(0, 0, 0, 0), t.clear(t.COLOR_BUFFER_BIT);
  }
  render() {
    const t = this.getGL();
    t.drawArrays(t.TRIANGLE_STRIP, 0, 4);
  }
  copyTexture(t, e) {
    const r = this.getGL();
    r.bindTexture(r.TEXTURE_2D, e), r.texImage2D(r.TEXTURE_2D, 0, r.RGBA, r.RGBA, r.UNSIGNED_BYTE, t), r.generateMipmap(r.TEXTURE_2D);
  }
}
class Bc {
  get onChanged() {
    return this.slides.subscribable;
  }
  constructor(t) {
    this.scene = t, this.slides = new Ce([]), this.lookup = /* @__PURE__ */ new Map(), this.collisionLookup = /* @__PURE__ */ new Set(), this.current = null, this.canResume = !1, this.waitsForId = null, this.targetId = null, this.handleReload = () => {
      this.lookup.clear(), this.collisionLookup.clear(), this.current = null, this.waitsForId = null, this.targetId = null;
    }, this.handleReset = () => {
      this.collisionLookup.clear(), this.current = null, this.waitsForId = null;
    }, this.handleRecalculated = () => {
      this.slides.current = [...this.lookup.values()];
    }, this.scene.onReloaded.subscribe(this.handleReload), this.scene.onReset.subscribe(this.handleReset), this.scene.onRecalculated.subscribe(this.handleRecalculated);
  }
  setTarget(t) {
    this.targetId = t;
  }
  resume() {
    this.canResume = !0;
  }
  isWaitingFor(t) {
    return this.waitsForId === t;
  }
  isWaiting() {
    return this.waitsForId !== null;
  }
  didHappen(t) {
    var e;
    if (this.current === null)
      return !1;
    for (const r of this.lookup.keys()) {
      if (r === t)
        return !0;
      if (r === ((e = this.current) == null ? void 0 : e.id))
        return !1;
    }
    return !1;
  }
  getCurrent() {
    return this.current;
  }
  register(t, e) {
    if (this.waitsForId !== null)
      throw new Error(`The animation already waits for a slide: ${this.waitsForId}.`);
    const r = this.toId(t);
    this.scene.playback.state !== Ye.Presenting && (this.lookup.has(r) || this.lookup.set(r, {
      id: r,
      name: t,
      time: e,
      scene: this.scene,
      stack: new Error().stack
    }), this.collisionLookup.has(t) ? this.scene.logger.warn({
      message: `A slide named "${t}" already exists.`,
      stack: new Error().stack
    }) : this.collisionLookup.add(t)), this.waitsForId = r, this.current = this.lookup.get(r) ?? null, this.canResume = !1;
  }
  shouldWait(t) {
    const e = this.toId(t);
    if (this.waitsForId !== e)
      throw new Error(`The animation waits for a different slide: ${this.waitsForId}.`);
    if (!this.lookup.get(e))
      throw new Error(`Could not find the "${t}" slide.`);
    let i = this.canResume;
    return this.scene.playback.state !== Ye.Presenting && (i = e !== this.targetId), i && (this.waitsForId = null), !i;
  }
  toId(t) {
    return `${this.scene.name}:${t}`;
  }
}
class Wc {
  constructor(t) {
    this.scene = t, this.signals = {}, this.variables = {}, this.handleReset = () => {
      this.signals = {};
    }, t.onReset.subscribe(this.handleReset);
  }
  /**
   * Get variable signal if exists or create signal if not
   *
   * @param name - The name of the variable.
   * @param initial - The initial value of the variable. It will be used if the
   *                  variable was not configured from the outside.
   */
  get(t, e) {
    var r;
    return (r = this.signals)[t] ?? (r[t] = Ne(this.variables[t] ?? e)), () => this.signals[t]();
  }
  /**
   * Update all signals with new project variable values.
   */
  updateSignals(t) {
    this.variables = t, Object.keys(t).map((e) => {
      e in this.signals && this.signals[e](t[e]);
    });
  }
}
class Uc {
  get firstFrame() {
    return this.cache.current.firstFrame;
  }
  get lastFrame() {
    return this.firstFrame + this.cache.current.duration;
  }
  get onCacheChanged() {
    return this.cache.subscribable;
  }
  get onReloaded() {
    return this.reloaded.subscribable;
  }
  get onRecalculated() {
    return this.recalculated.subscribable;
  }
  get onThreadChanged() {
    return this.thread.subscribable;
  }
  get onRenderLifecycle() {
    return this.renderLifecycle.subscribable;
  }
  get onReset() {
    return this.afterReset.subscribable;
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  get LifecycleEvents() {
    return this.logger.warn("LifecycleEvents is deprecated. Use lifecycleEvents instead."), this.lifecycleEvents;
  }
  get previous() {
    return this.previousScene;
  }
  constructor(t) {
    this.cache = new Ce({
      firstFrame: 0,
      transitionDuration: 0,
      duration: 0,
      lastFrame: 0
    }), this.reloaded = new Dt(), this.recalculated = new Dt(), this.thread = new Ce(null), this.renderLifecycle = new Dt(), this.afterReset = new Dt(), this.lifecycleEvents = new Ac(this), this.previousScene = null, this.runner = null, this.state = vt.Initial, this.cached = !1, this.counters = {}, this.name = t.name, this.size = t.size, this.resolutionScale = t.resolutionScale, this.logger = t.logger, this.playback = t.playback, this.meta = t.meta, this.runnerFactory = t.config, this.creationStack = t.stack, this.experimentalFeatures = t.experimentalFeatures ?? !1, le(this.runnerFactory, ct(this.name)), this.timeEvents = new t.timeEventsClass(this), this.variables = new Wc(this), this.shaders = new Nc(this, t.sharedWebGLContext), this.slides = new Bc(this), this.random = new Ze(this.meta.seed.get()), this.previousOnTop = !1;
  }
  /**
   * Update the view.
   *
   * Invoked after each step of the main generator.
   * Can be used for calculating layout.
   *
   * Can modify the state of the view.
   */
  update() {
  }
  async render(t) {
    let e = 0;
    do
      e++, await ot.consumePromises(), t.save(), t.clearRect(0, 0, t.canvas.width, t.canvas.height), this.execute(() => this.draw(t)), t.restore();
    while (ot.hasPromises() && e < 10);
    e > 1 && this.logger.debug(`render iterations: ${e}`);
  }
  reload({ config: t, size: e, stack: r, resolutionScale: i } = {}) {
    t && (this.runnerFactory = t), e && (this.size = e), i && (this.resolutionScale = i), r && (this.creationStack = r), this.cached = !1, this.reloaded.dispatch();
  }
  async recalculate(t) {
    const e = this.cache.current;
    if (e.firstFrame = this.playback.frame, e.lastFrame = e.firstFrame + e.duration, this.isCached()) {
      t(e.lastFrame), this.cache.current = { ...e };
      return;
    }
    for (e.transitionDuration = -1, await this.reset(); !this.canTransitionOut(); )
      e.transitionDuration < 0 && this.state === vt.AfterTransitionIn && (e.transitionDuration = this.playback.frame - e.firstFrame), t(this.playback.frame + 1), await this.next();
    e.transitionDuration === -1 && (e.transitionDuration = 0), e.lastFrame = this.playback.frame, e.duration = e.lastFrame - e.firstFrame, await new Promise((r) => setTimeout(r, 0)), this.cached = !0, this.cache.current = { ...e }, this.recalculated.dispatch();
  }
  async next() {
    var e;
    if (!this.runner)
      return;
    let t = this.execute(() => this.runner.next());
    for (this.update(); t.value; ) {
      if (Lc(t.value)) {
        const r = await t.value.toPromise();
        t = this.execute(() => this.runner.next(r));
      } else if ($c(t.value)) {
        const r = await t.value;
        t = this.execute(() => this.runner.next(r));
      } else
        this.logger.warn({
          message: "Invalid value yielded by the scene.",
          object: t.value
        }), t = this.execute(() => this.runner.next(t.value));
      this.update();
    }
    if (ot.hasPromises()) {
      const r = await ot.consumePromises();
      this.logger.error({
        message: "Tried to access an asynchronous property before the node was ready. Make sure to yield the node before accessing the property.",
        stack: r[0].stack,
        inspect: ((e = r[0].owner) == null ? void 0 : e.key) ?? void 0
      });
    }
    t.done && (this.state = vt.Finished);
  }
  async reset(t = null) {
    this.counters = {}, this.previousScene = t, this.previousOnTop = !1, this.random = new Ze(this.meta.seed.get()), this.runner = Mi(() => this.runnerFactory(this.getView()), (e) => {
      this.thread.current = e;
    }), this.state = vt.AfterTransitionIn, this.afterReset.dispatch(), await this.next();
  }
  getSize() {
    return this.size;
  }
  getRealSize() {
    return this.size.mul(this.resolutionScale);
  }
  isAfterTransitionIn() {
    return this.state === vt.AfterTransitionIn;
  }
  canTransitionOut() {
    return this.state === vt.CanTransitionOut || this.state === vt.Finished;
  }
  isFinished() {
    return this.state === vt.Finished;
  }
  enterInitial() {
    this.state === vt.AfterTransitionIn ? this.state = vt.Initial : this.logger.warn(`Scene ${this.name} entered initial in an unexpected state: ${this.state}`);
  }
  enterAfterTransitionIn() {
    this.state === vt.Initial ? this.state = vt.AfterTransitionIn : this.logger.warn(`Scene ${this.name} transitioned in an unexpected state: ${this.state}`);
  }
  enterCanTransitionOut() {
    this.state === vt.AfterTransitionIn || this.state === vt.Initial ? this.state = vt.CanTransitionOut : this.logger.warn(`Scene ${this.name} was marked as finished in an unexpected state: ${this.state}`);
  }
  isCached() {
    return this.cached;
  }
  /**
   * Invoke the given callback in the context of this scene.
   *
   * @remarks
   * This method makes sure that the context of this scene is globally available
   * during the execution of the callback.
   *
   * @param callback - The callback to invoke.
   */
  execute(t) {
    let e;
    pc(this), Rc(this.playback);
    try {
      e = t();
    } finally {
      Pc(this.playback), dc(this);
    }
    return e;
  }
}
function Gc() {
  return new ie("scene", {
    version: new Tt("version", 1),
    timeEvents: new Tt("time events", []),
    seed: new Tt("seed", Ze.createSeed())
  });
}
function Li(s, t, e) {
  const r = [...s], i = [...t];
  if (i.length >= r.length) {
    const a = Math.floor(i.length * e), h = Math.floor(Q(r.length - 1, i.length, e));
    let u = "";
    for (let m = 0; m < i.length; m++)
      m < a ? u += i[m] : (r[m] || m <= h) && (u += r[m] ?? i[m]);
    return u;
  } else {
    const a = Math.round(r.length * (1 - e)), h = Math.floor(Q(r.length + 1, i.length, e)), u = [];
    for (let m = r.length - 1; m >= 0; m--)
      m < a ? u.unshift(r[m]) : (i[m] || m < h) && u.unshift(i[m] ?? r[m]);
    return u.join("");
  }
}
function je(s, t, e, r = !1) {
  if (e === 0)
    return s;
  if (e === 1)
    return t;
  if (s == null || t == null) {
    r || ut().warn(`Attempting to lerp ${s} -> ${t} may result in unexpected behavior.`);
    return;
  }
  if (typeof s == "number" && typeof t == "number")
    return Q(s, t, e);
  if (typeof s == "string" && typeof t == "string")
    return Li(s, t, e);
  if (typeof s == "boolean" && typeof t == "boolean")
    return e < 0.5 ? s : t;
  if ("lerp" in s)
    return s.lerp(t, e);
  if (s && t && typeof s == "object" && typeof t == "object")
    if (Array.isArray(s) && Array.isArray(t)) {
      if (s.length === t.length)
        return s.map((i, a) => je(i, t[a], e));
    } else {
      let i = !1;
      if (!(s instanceof Map) && !(t instanceof Map) && (i = !0, s = new Map(Object.entries(s)), t = new Map(Object.entries(t))), s instanceof Map && t instanceof Map) {
        const a = /* @__PURE__ */ new Map();
        for (const h of /* @__PURE__ */ new Set([...s.keys(), ...t.keys()])) {
          const u = je(s.get(h), t.get(h), e, !0);
          u !== void 0 && a.set(h, u);
        }
        return i ? Object.fromEntries(a) : a;
      }
    }
  return t;
}
function qc(s, t, e) {
  return e < 0.5 ? s : t;
}
function Q(s, t, e) {
  return s + (t - s) * e;
}
function Xc(s, t, e, r, i) {
  return e + (i - s) * (r - e) / (t - s);
}
function wt(s, t, e) {
  return e < s ? s : e > t ? t : e;
}
function $i(s, t, e) {
  let r = t;
  e > 1 ? e = 1 / e : r = !r;
  const i = r ? Math.acos(wt(-1, 1, 1 - s)) : Math.asin(s), a = Q(i, Q(0, Math.PI / 2, s), e);
  let h = Math.sin(a), u = 1 - Math.cos(a);
  return t && ([h, u] = [u, h]), new g(h, u);
}
function Ft(s, t = 0, e = 1) {
  return s = s < 0.5 ? 4 * s * s * s : 1 - Math.pow(-2 * s + 2, 3) / 2, Q(t, e, s);
}
function Ru(s, t = 0, e = 1) {
  return s = s < 0.5 ? 8 * s * s * s * s : 1 - Math.pow(-2 * s + 2, 4) / 2, Q(t, e, s);
}
function Hc(s, t = 0, e = 1) {
  return s = s === 1 ? 1 : 1 - Math.pow(2, -10 * s), Q(t, e, s);
}
function Yc(s = 7.5625, t = 2.75) {
  return (e, r = 0, i = 1) => (e < 1 / t ? e = s * e * e : e < 2 / t ? e = s * (e -= 1.505 / t) * e + 0.75 : e < 2.5 / t ? e = s * (e -= 2.25 / t) * e + 0.9375 : e = s * (e -= 2.625 / t) * e + 0.984375, Q(r, i, e));
}
function Zc(s, t = 0, e = 1) {
  return Q(t, e, s);
}
const Pu = Yc();
le(_t, ct());
function* _t(s, t, e) {
  const r = Tr(), i = r.time(), a = r.time() + s;
  for (t(0, 0); a > r.fixed; ) {
    const h = r.fixed - i, u = h / s;
    h > 0 && t(u, h), yield;
  }
  r.time(a), t(1, s), e == null || e(1, s);
}
class ot {
  static collectPromise(t, e = null) {
    const r = {
      promise: t,
      value: e,
      stack: new Error().stack
    }, i = this.collectionStack.at(-1);
    return i && (r.owner = i.owner), t.then((a) => {
      r.value = a, i == null || i.markDirty();
    }), this.promises.push(r), r;
  }
  static hasPromises() {
    return this.promises.length > 0;
  }
  static async consumePromises() {
    const t = [...this.promises];
    return await Promise.all(t.map((e) => e.promise)), this.promises = this.promises.filter((e) => !t.includes(e)), t;
  }
  constructor(t) {
    this.owner = t, this.dependencies = /* @__PURE__ */ new Set(), this.event = new hc(), this.markDirty = () => this.event.raise(), this.invokable = this.invoke.bind(this), Object.defineProperty(this.invokable, "context", {
      value: this
    }), Object.defineProperty(this.invokable, "toPromise", {
      value: this.toPromise.bind(this)
    });
  }
  invoke() {
  }
  startCollecting() {
    if (ot.collectionSet.has(this))
      throw new ds("A circular dependency occurred between signals.", `This can happen when signals reference each other in a loop.
        Try using the attached stack trace to locate said loop.`);
    ot.collectionSet.add(this), ot.collectionStack.push(this);
  }
  finishCollecting() {
    if (ot.collectionSet.delete(this), ot.collectionStack.pop() !== this)
      throw new Error("collectStart/collectEnd was called out of order.");
  }
  clearDependencies() {
    this.dependencies.forEach((t) => t.unsubscribe(this.markDirty)), this.dependencies.clear();
  }
  collect() {
    const t = ot.collectionStack.at(-1);
    t && (t.dependencies.add(this.event.subscribable), this.event.subscribe(t.markDirty));
  }
  dispose() {
    this.clearDependencies(), this.event.clear(), this.owner = null;
  }
  async toPromise() {
    do
      await ot.consumePromises(), this.invokable();
    while (ot.hasPromises());
    return this.invokable;
  }
}
ot.collectionSet = /* @__PURE__ */ new Set();
ot.collectionStack = [];
ot.promises = [];
const De = Symbol.for("@motion-canvas/core/signals/default");
function Ht(s) {
  return typeof s == "function";
}
function we(s, t) {
  return Ht(s) ? () => t(s()) : t(s);
}
function Te(s) {
  return Ht(s) ? s() : s;
}
class Se extends ot {
  constructor(t, e, r = void 0, i = (h) => h, a = {}) {
    super(r), this.initial = t, this.interpolation = e, this.parser = i, this.tweening = !1, Object.defineProperty(this.invokable, "reset", {
      value: this.reset.bind(this)
    }), Object.defineProperty(this.invokable, "save", {
      value: this.save.bind(this)
    }), Object.defineProperty(this.invokable, "isInitial", {
      value: this.isInitial.bind(this)
    }), this.initial !== void 0 && (this.current = this.initial, this.markDirty(), Ht(this.initial) || (this.last = this.parse(this.initial))), this.extensions = {
      getter: this.getter.bind(this),
      setter: this.setter.bind(this),
      tweener: this.tweener.bind(this),
      ...a
    };
  }
  toSignal() {
    return this.invokable;
  }
  parse(t) {
    return this.parser(t);
  }
  set(t) {
    return this.extensions.setter(t), this.owner;
  }
  setter(t) {
    return t === De && (t = this.initial), this.current === t ? this.owner : (this.current = t, this.clearDependencies(), Ht(t) || (this.last = this.parse(t)), this.markDirty(), this.owner);
  }
  get() {
    return this.extensions.getter();
  }
  getter() {
    var t;
    if (this.event.isRaised() && Ht(this.current)) {
      this.clearDependencies(), this.startCollecting();
      try {
        this.last = this.parse(this.current());
      } catch (e) {
        ut().error({
          ...xi(e),
          inspect: (t = this.owner) == null ? void 0 : t.key
        });
      }
      this.finishCollecting();
    }
    return this.event.reset(), this.collect(), this.last;
  }
  invoke(t, e, r = Ft, i = this.interpolation) {
    return t === void 0 ? this.get() : e === void 0 ? this.set(t) : this.createQueue(r, i).to(t, e);
  }
  createQueue(t, e) {
    const r = this.get(), i = [], a = di("animation chain", function* () {
      for (; i.length > 0; )
        yield* i.shift();
    });
    return a.to = (h, u, m = t, y = e) => (t = m, e = y, i.push(this.tween(h, u, m, y)), a), a.back = (h, u = t, m = e) => (t = u, e = m, i.push(this.tween(r, h, t, e)), a), a.wait = (h) => (i.push(bs(h)), a), a.run = (h) => (i.push(h), a), a.do = (h) => (i.push(di(function* () {
      h();
    })), a), a;
  }
  *tween(t, e, r, i) {
    t === De && (t = this.initial), this.tweening = !0, yield* this.extensions.tweener(t, e, r, i), this.set(t), this.tweening = !1;
  }
  *tweener(t, e, r, i) {
    const a = this.get();
    yield* _t(e, (h) => {
      this.set(i(a, this.parse(Te(t)), r(h)));
    });
  }
  dispose() {
    super.dispose(), this.initial = void 0, this.current = void 0, this.last = void 0;
  }
  /**
   * Reset the signal to its initial value (if one has been set).
   *
   * @example
   * ```ts
   * const signal = createSignal(7);
   *
   * signal.reset();
   * // same as:
   * signal(7);
   * ```
   */
  reset() {
    return this.initial !== void 0 && this.set(this.initial), this.owner;
  }
  /**
   * Compute the current value of the signal and immediately set it.
   *
   * @remarks
   * This method can be used to stop the signal from updating while keeping its
   * current value.
   *
   * @example
   * ```ts
   * signal.save();
   * // same as:
   * signal(signal());
   * ```
   */
  save() {
    return this.set(this.get());
  }
  /**
   * Check if the signal is currently using its initial value.
   *
   * @example
   * ```ts
   *
   * const signal = createSignal(0);
   * signal.isInitial(); // true
   *
   * signal(5);
   * signal.isInitial(); // false
   *
   * signal(DEFAULT);
   * signal.isInitial(); // true
   * ```
   */
  isInitial() {
    return this.collect(), this.current === this.initial;
  }
  /**
   * Get the initial value of this signal.
   */
  getInitial() {
    return this.initial;
  }
  /**
   * Get the raw value of this signal.
   *
   * @remarks
   * If the signal was provided with a factory function, the function itself
   * will be returned, without invoking it.
   *
   * This method can be used to create copies of signals.
   *
   * @example
   * ```ts
   * const a = createSignal(2);
   * const b = createSignal(() => a);
   * // b() == 2
   *
   * const bClone = createSignal(b.raw());
   * // bClone() == 2
   *
   * a(4);
   * // b() == 4
   * // bClone() == 4
   * ```
   */
  raw() {
    return this.current;
  }
  /**
   * Is the signal undergoing a tween?
   */
  isTweening() {
    return this.tweening;
  }
}
class kr extends Se {
  constructor(t, e, r, i, a = void 0, h = {}) {
    var u;
    super(void 0, i, a, e, h), this.entries = t, this.signals = [], this.parser = e;
    for (const m of t) {
      let y, S;
      Array.isArray(m) ? ([y, S] = m, (u = S.context).owner ?? (u.owner = this)) : (y = m, S = new Se(we(r, (F) => e(F)[m]), Q, a ?? this.invokable).toSignal()), this.signals.push([y, S]), Object.defineProperty(this.invokable, y, { value: S });
    }
  }
  toSignal() {
    return this.invokable;
  }
  parse(t) {
    return this.parser(t);
  }
  getter() {
    return this.parse(Object.fromEntries(this.signals.map(([t, e]) => [t, e()])));
  }
  setter(t) {
    if (Ht(t))
      for (const [e, r] of this.signals)
        r(() => this.parser(t())[e]);
    else {
      const e = this.parse(t);
      for (const [r, i] of this.signals)
        i(e[r]);
    }
    return this.owner;
  }
  reset() {
    for (const [, t] of this.signals)
      t.reset();
    return this.owner;
  }
  save() {
    for (const [, t] of this.signals)
      t.save();
    return this.owner;
  }
  isInitial() {
    for (const [, t] of this.signals)
      if (!t.isInitial())
        return !1;
    return !0;
  }
  raw() {
    return Object.fromEntries(this.signals.map(([t, e]) => [t, e.context.raw()]));
  }
}
class Vc extends ot {
  constructor(t, e) {
    super(e), this.factory = t, this.markDirty();
  }
  toSignal() {
    return this.invokable;
  }
  dispose() {
    super.dispose(), this.last = void 0;
  }
  invoke(...t) {
    var e;
    if (this.event.isRaised()) {
      this.clearDependencies(), this.startCollecting();
      try {
        this.last = this.factory(...t);
      } catch (r) {
        ut().error({
          ...xi(r),
          inspect: (e = this.owner) == null ? void 0 : e.key
        });
      }
      this.finishCollecting();
    }
    return this.event.reset(), this.collect(), this.last;
  }
}
class Ai extends kr {
  constructor(t, e, r, i, a = void 0, h = {}) {
    super(t, e, r, i, a, h), Object.defineProperty(this.invokable, "edit", {
      value: this.edit.bind(this)
    }), Object.defineProperty(this.invokable, "mul", {
      value: this.mul.bind(this)
    }), Object.defineProperty(this.invokable, "div", {
      value: this.div.bind(this)
    }), Object.defineProperty(this.invokable, "add", {
      value: this.add.bind(this)
    }), Object.defineProperty(this.invokable, "sub", {
      value: this.sub.bind(this)
    }), Object.defineProperty(this.invokable, "dot", {
      value: this.dot.bind(this)
    }), Object.defineProperty(this.invokable, "cross", {
      value: this.cross.bind(this)
    }), Object.defineProperty(this.invokable, "mod", {
      value: this.mod.bind(this)
    });
  }
  toSignal() {
    return this.invokable;
  }
  edit(t, e, r, i) {
    const a = t(this.get());
    return this.invoke(a, e, r, i);
  }
  mul(t, e, r, i) {
    const a = (h) => h.mul(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  div(t, e, r, i) {
    const a = (h) => h.div(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  add(t, e, r, i) {
    const a = (h) => h.add(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  sub(t, e, r, i) {
    const a = (h) => h.sub(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  dot(t, e, r, i) {
    const a = (h) => h.dot(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  cross(t, e, r, i) {
    const a = (h) => h.cross(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
  mod(t, e, r, i) {
    const a = (h) => h.mod(t);
    return e === void 0 ? this.edit(a) : this.edit(a, e, r, i);
  }
}
function Jc(s, t) {
  return new Vc(s, t).toSignal();
}
function Ne(s, t = je, e) {
  return new Se(s, t, e).toSignal();
}
class Ot {
  static createSignal(t, e = Ot.lerp) {
    return new kr(["top", "right", "bottom", "left"], (r) => new Ot(r), t, e).toSignal();
  }
  static lerp(t, e, r) {
    return new Ot(Q(t.top, e.top, r), Q(t.right, e.right, r), Q(t.bottom, e.bottom, r), Q(t.left, e.left, r));
  }
  get x() {
    return this.left + this.right;
  }
  get y() {
    return this.top + this.bottom;
  }
  constructor(t = 0, e, r, i) {
    if (this.top = 0, this.right = 0, this.bottom = 0, this.left = 0, t != null) {
      if (Array.isArray(t) && (i = t[3], r = t[2], e = t[1], t = t[0]), typeof t == "number") {
        this.top = t, this.right = e !== void 0 ? e : t, this.bottom = r !== void 0 ? r : t, this.left = i !== void 0 ? i : e !== void 0 ? e : t;
        return;
      }
      this.top = t.top, this.right = t.right, this.bottom = t.bottom, this.left = t.left;
    }
  }
  lerp(t, e) {
    return Ot.lerp(this, t, e);
  }
  scale(t) {
    return new Ot(this.top * t, this.right * t, this.bottom * t, this.left * t);
  }
  addScalar(t) {
    return new Ot(this.top + t, this.right + t, this.bottom + t, this.left + t);
  }
  toSymbol() {
    return Ot.symbol;
  }
  toString() {
    return `Spacing(${this.top}, ${this.right}, ${this.bottom}, ${this.left})`;
  }
  toUniform(t, e) {
    t.uniform4f(e, this.top, this.right, this.bottom, this.left);
  }
  serialize() {
    return {
      top: this.top,
      right: this.right,
      bottom: this.bottom,
      left: this.left
    };
  }
}
Ot.symbol = Symbol.for("@motion-canvas/core/types/Spacing");
const Xe = 1e-6;
class nt {
  static fromRotation(t) {
    return nt.identity.rotate(t);
  }
  static fromTranslation(t) {
    return nt.identity.translate(new g(t));
  }
  static fromScaling(t) {
    return nt.identity.scale(new g(t));
  }
  get x() {
    return new g(this.values[0], this.values[1]);
  }
  get y() {
    return new g(this.values[2], this.values[3]);
  }
  get scaleX() {
    return this.values[0];
  }
  set scaleX(t) {
    this.values[0] = this.x.normalized.scale(t).x;
  }
  get skewX() {
    return this.values[1];
  }
  set skewX(t) {
    this.values[1] = t;
  }
  get scaleY() {
    return this.values[3];
  }
  set scaleY(t) {
    this.values[3] = this.y.normalized.scale(t).y;
  }
  get skewY() {
    return this.values[2];
  }
  set skewY(t) {
    this.values[2] = t;
  }
  get translateX() {
    return this.values[4];
  }
  set translateX(t) {
    this.values[4] = t;
  }
  get translateY() {
    return this.values[5];
  }
  set translateY(t) {
    this.values[5] = t;
  }
  get rotation() {
    return g.degrees(this.values[0], this.values[1]);
  }
  set rotation(t) {
    const e = this.rotate(t - this.rotation);
    this.values[0] = e.values[0], this.values[1] = e.values[1], this.values[2] = e.values[2], this.values[3] = e.values[3];
  }
  get translation() {
    return new g(this.values[4], this.values[5]);
  }
  set translation(t) {
    const e = new g(t);
    this.values[4] = e.x, this.values[5] = e.y;
  }
  get scaling() {
    return new g(this.values[0], this.values[3]);
  }
  set scaling(t) {
    const e = new g(t), r = new g(this.values[0], this.values[1]).normalized, i = new g(this.values[2], this.values[3]).normalized;
    this.values[0] = r.x * e.x, this.values[1] = r.y * e.y, this.values[2] = i.x * e.x, this.values[3] = i.y * e.y;
  }
  /**
   * Get the inverse of the matrix.
   *
   * @remarks
   * If the matrix is not invertible, i.e. its determinant is `0`, this will
   * return `null`, instead.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const inverse = matrix.inverse;
   * // => Matrix2D(
   * //      [-2, 1],
   * //      [1.5, -0.5],
   * //      [1, -2],
   * //   )
   * ```
   */
  get inverse() {
    const t = this.values[0], e = this.values[1], r = this.values[2], i = this.values[3], a = this.values[4], h = this.values[5];
    let u = t * i - e * r;
    return u ? (u = 1 / u, new nt(i * u, -e * u, -r * u, t * u, (r * h - i * a) * u, (e * a - t * h) * u)) : null;
  }
  /**
   * Get the determinant of the matrix.
   */
  get determinant() {
    return this.values[0] * this.values[3] - this.values[1] * this.values[2];
  }
  get domMatrix() {
    return new DOMMatrix([
      this.values[0],
      this.values[1],
      this.values[2],
      this.values[3],
      this.values[4],
      this.values[5]
    ]);
  }
  constructor(t, e, r, i, a, h) {
    if (this.values = new Float32Array(6), arguments.length === 0) {
      this.values = new Float32Array([1, 0, 0, 1, 0, 0]);
      return;
    }
    if (arguments.length === 6) {
      this.values[0] = t, this.values[1] = e, this.values[2] = r, this.values[3] = i, this.values[4] = a, this.values[5] = h;
      return;
    }
    if (t instanceof DOMMatrix) {
      this.values[0] = t.m11, this.values[1] = t.m12, this.values[2] = t.m21, this.values[3] = t.m22, this.values[4] = t.m41, this.values[5] = t.m42;
      return;
    }
    if (t instanceof nt) {
      this.values = t.values;
      return;
    }
    if (Array.isArray(t)) {
      if (t.length === 2) {
        this.values[0] = t[0], this.values[1] = t[1], this.values[2] = e[0], this.values[3] = e[1], this.values[4] = r[0], this.values[5] = r[1];
        return;
      }
      if (t.length === 3) {
        const S = new g(t[0]), F = new g(t[1]), X = new g(t[2]);
        this.values[0] = S.x, this.values[1] = S.y, this.values[2] = F.x, this.values[3] = F.y, this.values[4] = X.x, this.values[5] = X.y;
        return;
      }
      this.values[0] = t[0], this.values[1] = t[1], this.values[2] = t[2], this.values[3] = t[3], this.values[4] = t[4], this.values[5] = t[5];
      return;
    }
    const u = new g(t), m = new g(e), y = new g(r);
    this.values[0] = u.x, this.values[1] = u.y, this.values[2] = m.x, this.values[3] = m.y, this.values[4] = y.x, this.values[5] = y.y;
  }
  /**
   * Get the nth component vector of the matrix. Only defined for 0, 1, and 2.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 0],
   *   [0, 0],
   *   [1, 0],
   * );
   *
   * const x = matrix.column(0);
   * // Vector2(1, 0)
   *
   * const y = matrix.column(1);
   * // Vector2(0, 0)
   *
   * const z = matrix.column(1);
   * // Vector2(1, 0)
   * ```
   *
   * @param index - The index of the component vector to retrieve.
   */
  column(t) {
    return new g(this.values[t * 2], this.values[t * 2 + 1]);
  }
  /**
   * Returns the nth row of the matrix. Only defined for 0 and 1.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 0],
   *   [0, 0],
   *   [1, 0],
   * );
   *
   * const firstRow = matrix.column(0);
   * // [1, 0, 1]
   *
   * const secondRow = matrix.column(1);
   * // [0, 0, 0]
   * ```
   *
   * @param index - The index of the row to retrieve.
   */
  row(t) {
    return [this.values[t], this.values[t + 2], this.values[t + 4]];
  }
  /**
   * Returns the matrix product of this matrix with the provided matrix.
   *
   * @remarks
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const a = new Matrix2D(
   *   [1, 2],
   *   [0, 1],
   *   [1, 1],
   * );
   * const b = new Matrix2D(
   *   [2, 1],
   *   [1, 1],
   *   [1, 1],
   * );
   *
   * const result = a.mul(b);
   * // => Matrix2D(
   * //     [2, 5],
   * //     [1, 3],
   * //     [2, 4],
   * //   )
   * ```
   *
   * @param other - The matrix to multiply with
   */
  mul(t) {
    const e = this.values[0], r = this.values[1], i = this.values[2], a = this.values[3], h = this.values[4], u = this.values[5], m = t.values[0], y = t.values[1], S = t.values[2], F = t.values[3], X = t.values[4], tt = t.values[5];
    return new nt(e * m + i * y, r * m + a * y, e * S + i * F, r * S + a * F, e * X + i * tt + h, r * X + a * tt + u);
  }
  /**
   * Rotate the matrix by the provided angle. By default, the angle is
   * provided in degrees.
   *
   * @remarks
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const a = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const result = a.rotate(90);
   * // => Matrix2D(
   * //     [3, 4],
   * //     [-1, -2],
   * //     [5, 6],
   * //   )
   *
   * // Provide the angle in radians
   * const result = a.rotate(Math.PI * 0.5, true);
   * // => Matrix2D(
   * //     [3, 4],
   * //     [-1, -2],
   * //     [5, 6],
   * //   )
   * ```
   *
   * @param angle - The angle by which to rotate the matrix.
   * @param degrees - Whether the angle is provided in degrees.
   */
  rotate(t, e = !0) {
    e && (t *= os);
    const r = this.values[0], i = this.values[1], a = this.values[2], h = this.values[3], u = this.values[4], m = this.values[5], y = Math.sin(t), S = Math.cos(t);
    return new nt(r * S + a * y, i * S + h * y, r * -y + a * S, i * -y + h * S, u, m);
  }
  /**
   * Scale the x and y component vectors of the matrix.
   *
   * @remarks
   * If `vec` is provided as a vector, the x and y component vectors of the
   * matrix will be scaled by the x and y parts of the vector, respectively.
   *
   * If `vec` is provided as a scalar, the x and y component vectors will be
   * scaled uniformly by this factor.
   *
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const result1 = matrix.scale([2, 3]);
   * // => new Matrix2D(
   * //      [2, 4],
   * //      [9, 12],
   * //      [5, 6],
   * //    )
   *
   * const result2 = matrix.scale(2);
   * // => new Matrix2D(
   * //      [2, 4],
   * //      [6, 8],
   * //      [5, 6],
   * //    )
   * ```
   *
   * @param vec - The factor by which to scale the matrix
   */
  scale(t) {
    const e = new g(t);
    return new nt(this.values[0] * e.x, this.values[1] * e.x, this.values[2] * e.y, this.values[3] * e.y, this.values[4], this.values[5]);
  }
  /**
   * Multiply each value of the matrix by a scalar.
   *
   * * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const result1 = matrix.mulScalar(2);
   * // => new Matrix2D(
   * //      [2, 4],
   * //      [6, 8],
   * //      [10, 12],
   * //    )
   * ```
   *
   * @param s - The value by which to scale each term
   */
  mulScalar(t) {
    return new nt(this.values[0] * t, this.values[1] * t, this.values[2] * t, this.values[3] * t, this.values[4] * t, this.values[5] * t);
  }
  /**
   * Translate the matrix by the dimensions of the provided vector.
   *
   * @remarks
   * If `vec` is provided as a scalar, matrix will be translated uniformly
   * by this factor.
   *
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const matrix = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   *
   * const result1 = matrix.translate([2, 3]);
   * // => new Matrix2D(
   * //      [1, 2],
   * //      [3, 4],
   * //      [16, 22],
   * //    )
   *
   * const result2 = matrix.translate(2);
   * // => new Matrix2D(
   * //      [1, 2],
   * //      [3, 4],
   * //      [13, 18],
   * //    )
   * ```
   *
   * @param vec - The vector by which to translate the matrix
   */
  translate(t) {
    const e = new g(t);
    return new nt(this.values[0], this.values[1], this.values[2], this.values[3], this.values[0] * e.x + this.values[2] * e.y + this.values[4], this.values[1] * e.x + this.values[3] * e.y + this.values[5]);
  }
  /**
   * Add the provided matrix to this matrix.
   *
   * @remarks
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const a = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   * const a = new Matrix2D(
   *   [7, 8],
   *   [9, 10],
   *   [11, 12],
   * );
   *
   * const result = a.add(b);
   * // => Matrix2D(
   * //      [8, 10],
   * //      [12, 14],
   * //      [16, 18],
   * //    )
   * ```
   *
   * @param other - The matrix to add
   */
  add(t) {
    return new nt(this.values[0] + t.values[0], this.values[1] + t.values[1], this.values[2] + t.values[2], this.values[3] + t.values[3], this.values[4] + t.values[4], this.values[5] + t.values[5]);
  }
  /**
   * Subtract the provided matrix from this matrix.
   *
   * @remarks
   * This method returns a new matrix representing the result of the
   * computation. It will not modify the source matrix.
   *
   * @example
   * ```ts
   * const a = new Matrix2D(
   *   [1, 2],
   *   [3, 4],
   *   [5, 6],
   * );
   * const a = new Matrix2D(
   *   [7, 8],
   *   [9, 10],
   *   [11, 12],
   * );
   *
   * const result = a.sub(b);
   * // => Matrix2D(
   * //      [-6, -6],
   * //      [-6, -6],
   * //      [-6, -6],
   * //    )
   * ```
   *
   * @param other - The matrix to subract
   */
  sub(t) {
    return new nt(this.values[0] - t.values[0], this.values[1] - t.values[1], this.values[2] - t.values[2], this.values[3] - t.values[3], this.values[4] - t.values[4], this.values[5] - t.values[5]);
  }
  toSymbol() {
    return nt.symbol;
  }
  toUniform(t, e) {
    t.uniformMatrix3fv(e, !1, [
      this.values[0],
      this.values[1],
      0,
      this.values[2],
      this.values[3],
      0,
      this.values[4],
      this.values[5],
      1
    ]);
  }
  equals(t, e = Xe) {
    return Math.abs(this.values[0] - t.values[0]) <= e + Number.EPSILON && Math.abs(this.values[1] - t.values[1]) <= e + Number.EPSILON && Math.abs(this.values[2] - t.values[2]) <= e + Number.EPSILON && Math.abs(this.values[3] - t.values[3]) <= e + Number.EPSILON && Math.abs(this.values[4] - t.values[4]) <= e + Number.EPSILON && Math.abs(this.values[5] - t.values[5]) <= e + Number.EPSILON;
  }
  exactlyEquals(t) {
    return this.values[0] === t.values[0] && this.values[1] === t.values[1] && this.values[2] === t.values[2] && this.values[3] === t.values[3] && this.values[4] === t.values[4] && this.values[5] === t.values[5];
  }
}
nt.symbol = Symbol.for("@motion-canvas/core/types/Matrix2D");
nt.identity = new nt(1, 0, 0, 1, 0, 0);
nt.zero = new nt(0, 0, 0, 0, 0, 0);
var vi;
(function(s) {
  s[s.Vertical = 1] = "Vertical", s[s.Horizontal = 2] = "Horizontal";
})(vi || (vi = {}));
var xt;
(function(s) {
  s[s.Top = 4] = "Top", s[s.Bottom = 8] = "Bottom", s[s.Left = 16] = "Left", s[s.Right = 32] = "Right";
})(xt || (xt = {}));
var it;
(function(s) {
  s[s.Middle = 3] = "Middle", s[s.Top = 5] = "Top", s[s.Bottom = 9] = "Bottom", s[s.Left = 18] = "Left", s[s.Right = 34] = "Right", s[s.TopLeft = 20] = "TopLeft", s[s.TopRight = 36] = "TopRight", s[s.BottomLeft = 24] = "BottomLeft", s[s.BottomRight = 40] = "BottomRight";
})(it || (it = {}));
function Qc(s) {
  if (s === it.Middle)
    return g.zero;
  let t = 0;
  s & xt.Left ? t = -1 : s & xt.Right && (t = 1);
  let e = 0;
  return s & xt.Top ? e = -1 : s & xt.Bottom && (e = 1), new g(t, e);
}
class g {
  static createSignal(t, e = g.lerp, r) {
    return new Ai(["x", "y"], (i) => new g(i), t, e, r).toSignal();
  }
  static lerp(t, e, r) {
    let i, a;
    return typeof r == "number" ? i = a = r : (i = r.x, a = r.y), new g(Q(t.x, e.x, i), Q(t.y, e.y, a));
  }
  static arcLerp(t, e, r, i = !1, a) {
    return a ?? (a = t.sub(e).ctg), g.lerp(t, e, $i(r, i, a));
  }
  static createArcLerp(t, e) {
    return (r, i, a) => g.arcLerp(r, i, a, t, e);
  }
  /**
   * Interpolates between two vectors on the polar plane by interpolating
   * the angles and magnitudes of the vectors individually.
   *
   * @param from - The starting vector.
   * @param to - The target vector.
   * @param value - The t-value of the interpolation.
   * @param counterclockwise - Whether the vector should get rotated
   *                           counterclockwise. Defaults to `false`.
   * @param origin - The center of rotation. Defaults to the origin.
   *
   * @remarks
   * This function is useful when used in conjunction with {@link rotate} to
   * animate an object's position on a circular arc (see examples).
   *
   * @example
   * Animating an object in a circle around the origin
   * ```tsx
   * circle().position(
   *   circle().position().rotate(180),
   *   1,
   *   easeInOutCubic,
   *   Vector2.polarLerp
   * );
   * ```
   * @example
   * Rotating an object around the point `[-200, 100]`
   * ```ts
   * circle().position(
   *   circle().position().rotate(180, [-200, 100]),
   *   1,
   *   easeInOutCubic,
   *   Vector2.createPolarLerp(false, [-200, 100]),
   * );
   * ```
   * @example
   * Rotating an object counterclockwise around the origin
   * ```ts
   * circle().position(
   *   circle().position().rotate(180),
   *   1,
   *   easeInOutCubic,
   *   Vector2.createPolarLerp(true),
   * );
   * ```
   */
  static polarLerp(t, e, r, i = !1, a = g.zero) {
    t = t.sub(a), e = e.sub(a);
    const h = t.degrees;
    let u = e.degrees;
    h > u !== i && (u = u + (i ? -360 : 360));
    const y = Q(h, u, r) * os, S = Q(t.magnitude, e.magnitude, r);
    return new g(S * Math.cos(y) + a.x, S * Math.sin(y) + a.y);
  }
  /**
   * Helper function to create a {@link Vector2.polarLerp} interpolation
   * function with additional parameters.
   *
   * @param counterclockwise - Whether the point should get rotated
   *                           counterclockwise.
   * @param center - The center of rotation. Defaults to the origin.
   */
  static createPolarLerp(t = !1, e = g.zero) {
    return (r, i, a) => g.polarLerp(r, i, a, t, new g(e));
  }
  static fromOrigin(t) {
    const e = new g();
    return t === it.Middle || (t & xt.Left ? e.x = -1 : t & xt.Right && (e.x = 1), t & xt.Top ? e.y = -1 : t & xt.Bottom && (e.y = 1)), e;
  }
  static fromScalar(t) {
    return new g(t, t);
  }
  static fromRadians(t) {
    return new g(Math.cos(t), Math.sin(t));
  }
  static fromDegrees(t) {
    return g.fromRadians(t * os);
  }
  /**
   * Return the angle in radians between the vector described by x and y and the
   * positive x-axis.
   *
   * @param x - The x component of the vector.
   * @param y - The y component of the vector.
   */
  static radians(t, e) {
    return Math.atan2(e, t);
  }
  /**
   * Return the angle in degrees between the vector described by x and y and the
   * positive x-axis.
   *
   * @param x - The x component of the vector.
   * @param y - The y component of the vector.
   *
   * @remarks
   * The returned angle will be between -180 and 180 degrees.
   */
  static degrees(t, e) {
    return g.radians(t, e) * xc;
  }
  static magnitude(t, e) {
    return Math.sqrt(t * t + e * e);
  }
  static squaredMagnitude(t, e) {
    return t * t + e * e;
  }
  static angleBetween(t, e) {
    return Math.acos(wt(-1, 1, t.dot(e) / (t.magnitude * e.magnitude))) * (t.cross(e) >= 0 ? 1 : -1);
  }
  get width() {
    return this.x;
  }
  set width(t) {
    this.x = t;
  }
  get height() {
    return this.y;
  }
  set height(t) {
    this.y = t;
  }
  get magnitude() {
    return g.magnitude(this.x, this.y);
  }
  get squaredMagnitude() {
    return g.squaredMagnitude(this.x, this.y);
  }
  get normalized() {
    return this.scale(1 / g.magnitude(this.x, this.y));
  }
  get safe() {
    return new g(isNaN(this.x) ? 0 : this.x, isNaN(this.y) ? 0 : this.y);
  }
  get flipped() {
    return new g(-this.x, -this.y);
  }
  get floored() {
    return new g(Math.floor(this.x), Math.floor(this.y));
  }
  get rounded() {
    return new g(Math.round(this.x), Math.round(this.y));
  }
  get ceiled() {
    return new g(Math.ceil(this.x), Math.ceil(this.y));
  }
  get perpendicular() {
    return new g(this.y, -this.x);
  }
  /**
   * Return the angle in radians between the vector and the positive x-axis.
   */
  get radians() {
    return g.radians(this.x, this.y);
  }
  /**
   * Return the angle in degrees between the vector and the positive x-axis.
   *
   * @remarks
   * The returned angle will be between -180 and 180 degrees.
   */
  get degrees() {
    return g.degrees(this.x, this.y);
  }
  get ctg() {
    return this.x / this.y;
  }
  constructor(t, e) {
    if (this.x = 0, this.y = 0, t != null) {
      if (typeof t != "object") {
        this.x = t, this.y = e ?? t;
        return;
      }
      if (Array.isArray(t)) {
        this.x = t[0], this.y = t[1];
        return;
      }
      if ("width" in t) {
        this.x = t.width, this.y = t.height;
        return;
      }
      this.x = t.x, this.y = t.y;
    }
  }
  lerp(t, e) {
    return g.lerp(this, t, e);
  }
  getOriginOffset(t) {
    const e = g.fromOrigin(t);
    return e.x *= this.x / 2, e.y *= this.y / 2, e;
  }
  scale(t) {
    return new g(this.x * t, this.y * t);
  }
  transformAsPoint(t) {
    const e = new nt(t);
    return new g(this.x * e.scaleX + this.y * e.skewY + e.translateX, this.x * e.skewX + this.y * e.scaleY + e.translateY);
  }
  transform(t) {
    const e = new nt(t);
    return new g(this.x * e.scaleX + this.y * e.skewY, this.x * e.skewX + this.y * e.scaleY);
  }
  mul(t) {
    const e = new g(t);
    return new g(this.x * e.x, this.y * e.y);
  }
  div(t) {
    const e = new g(t);
    return new g(this.x / e.x, this.y / e.y);
  }
  add(t) {
    const e = new g(t);
    return new g(this.x + e.x, this.y + e.y);
  }
  sub(t) {
    const e = new g(t);
    return new g(this.x - e.x, this.y - e.y);
  }
  dot(t) {
    const e = new g(t);
    return this.x * e.x + this.y * e.y;
  }
  cross(t) {
    const e = new g(t);
    return this.x * e.y - this.y * e.x;
  }
  mod(t) {
    const e = new g(t);
    return new g(this.x % e.x, this.y % e.y);
  }
  /**
   * Rotate the vector around a point by the provided angle.
   *
   * @param angle - The angle by which to rotate in degrees.
   * @param center - The center of rotation. Defaults to the origin.
   */
  rotate(t, e = g.zero) {
    const r = new g(e), i = nt.fromTranslation(r).rotate(t).translate(r.flipped);
    return this.transformAsPoint(i);
  }
  addX(t) {
    return new g(this.x + t, this.y);
  }
  addY(t) {
    return new g(this.x, this.y + t);
  }
  /**
   * Transform the components of the vector.
   *
   * @example
   * Raise the components to the power of 2.
   * ```ts
   * const vector = new Vector2(2, 3);
   * const result = vector.transform(value => value ** 2);
   * ```
   *
   * @param callback - A callback to apply to each component.
   */
  map(t) {
    return new g(t(this.x, 0), t(this.y, 1));
  }
  toSymbol() {
    return g.symbol;
  }
  toString() {
    return `Vector2(${this.x}, ${this.y})`;
  }
  toArray() {
    return [this.x, this.y];
  }
  toUniform(t, e) {
    t.uniform2f(e, this.x, this.y);
  }
  serialize() {
    return { x: this.x, y: this.y };
  }
  /**
   * Check if two vectors are exactly equal to each other.
   *
   * @remarks
   * If you need to compensate for floating point inaccuracies, use the
   * {@link equals} method, instead.
   *
   * @param other - The vector to compare.
   */
  exactlyEquals(t) {
    return this.x === t.x && this.y === t.y;
  }
  /**
   * Check if two vectors are equal to each other.
   *
   * @remarks
   * This method allows passing an allowed error margin when comparing vectors
   * to compensate for floating point inaccuracies. To check if two vectors are
   * exactly equal, use the {@link exactlyEquals} method, instead.
   *
   * @param other - The vector to compare.
   * @param threshold - The allowed error threshold when comparing the vectors.
   */
  equals(t, e = Xe) {
    return Math.abs(this.x - t.x) <= e + Number.EPSILON && Math.abs(this.y - t.y) <= e + Number.EPSILON;
  }
  *[Symbol.iterator]() {
    yield this.x, yield this.y;
  }
}
g.symbol = Symbol.for("@motion-canvas/core/types/Vector2");
g.zero = new g();
g.one = new g(1, 1);
g.right = new g(1, 0);
g.left = new g(-1, 0);
g.up = new g(0, 1);
g.down = new g(0, -1);
g.top = new g(0, -1);
g.bottom = new g(0, 1);
g.topLeft = new g(-1, -1);
g.topRight = new g(1, -1);
g.bottomLeft = new g(-1, 1);
g.bottomRight = new g(1, 1);
class H {
  static createSignal(t, e = H.lerp) {
    return new kr(["x", "y", "width", "height"], (r) => new H(r), t, e).toSignal();
  }
  static lerp(t, e, r) {
    let i, a, h, u;
    return typeof r == "number" ? i = a = h = u = r : r instanceof g ? (i = h = r.x, a = u = r.y) : (i = r.x, a = r.y, h = r.width, u = r.height), new H(Q(t.x, e.x, i), Q(t.y, e.y, a), Q(t.width, e.width, h), Q(t.height, e.height, u));
  }
  static arcLerp(t, e, r, i = !1, a) {
    return a ?? (a = (t.position.sub(e.position).ctg + t.size.sub(e.size).ctg) / 2), H.lerp(t, e, $i(r, i, a));
  }
  static fromSizeCentered(t) {
    return new H(-t.width / 2, -t.height / 2, t.width, t.height);
  }
  static fromPoints(...t) {
    let e = 1 / 0, r = 1 / 0, i = -1 / 0, a = -1 / 0;
    for (const h of t)
      h.x > i && (i = h.x), h.x < e && (e = h.x), h.y > a && (a = h.y), h.y < r && (r = h.y);
    return new H(e, r, i - e, a - r);
  }
  static fromBBoxes(...t) {
    let e = 1 / 0, r = 1 / 0, i = -1 / 0, a = -1 / 0;
    for (const h of t) {
      const u = h.x + h.width;
      u > i && (i = u), h.x < e && (e = h.x);
      const m = h.y + h.height;
      m > a && (a = m), h.y < r && (r = h.y);
    }
    return new H(e, r, i - e, a - r);
  }
  lerp(t, e) {
    return H.lerp(this, t, e);
  }
  get position() {
    return new g(this.x, this.y);
  }
  set position(t) {
    this.x = t.x, this.y = t.y;
  }
  get size() {
    return new g(this.width, this.height);
  }
  get center() {
    return new g(this.x + this.width / 2, this.y + this.height / 2);
  }
  get left() {
    return this.x;
  }
  set left(t) {
    this.width += this.x - t, this.x = t;
  }
  get right() {
    return this.x + this.width;
  }
  set right(t) {
    this.width = t - this.x;
  }
  get top() {
    return this.y;
  }
  set top(t) {
    this.height += this.y - t, this.y = t;
  }
  get bottom() {
    return this.y + this.height;
  }
  set bottom(t) {
    this.height = t - this.y;
  }
  get topLeft() {
    return this.position;
  }
  get topRight() {
    return new g(this.x + this.width, this.y);
  }
  get bottomLeft() {
    return new g(this.x, this.y + this.height);
  }
  get bottomRight() {
    return new g(this.x + this.width, this.y + this.height);
  }
  get corners() {
    return [this.topLeft, this.topRight, this.bottomRight, this.bottomLeft];
  }
  get pixelPerfect() {
    return new H(Math.floor(this.x), Math.floor(this.y), Math.ceil(this.width + 1), Math.ceil(this.height + 1));
  }
  constructor(t, e = 0, r = 0, i = 0) {
    if (this.x = 0, this.y = 0, this.width = 0, this.height = 0, t != null) {
      if (typeof t == "number") {
        this.x = t, this.y = e, this.width = r, this.height = i;
        return;
      }
      if (t instanceof g) {
        this.x = t.x, this.y = t.y, e instanceof g && (this.width = e.x, this.height = e.y);
        return;
      }
      if (Array.isArray(t)) {
        this.x = t[0], this.y = t[1], this.width = t[2], this.height = t[3];
        return;
      }
      this.x = t.x, this.y = t.y, this.width = t.width, this.height = t.height;
    }
  }
  transform(t) {
    return new H(this.position.transformAsPoint(t), this.size.transform(t));
  }
  transformCorners(t) {
    return this.corners.map((e) => e.transformAsPoint(t));
  }
  /**
   * Expand the bounding box to accommodate the given spacing.
   *
   * @param value - The value to expand the bounding box by.
   */
  expand(t) {
    const e = new Ot(t), r = new H(this);
    return r.left -= e.left, r.top -= e.top, r.right += e.right, r.bottom += e.bottom, r;
  }
  /**
   * {@inheritDoc expand}
   *
   * @deprecated Use {@link expand} instead.
   */
  addSpacing(t) {
    return this.expand(t);
  }
  includes(t) {
    return t.x >= this.x && t.x <= this.x + this.width && t.y >= this.y && t.y <= this.y + this.height;
  }
  intersects(t) {
    return this.left < t.right && this.right > t.left && this.top < t.bottom && this.bottom > t.top;
  }
  intersection(t) {
    const e = new H();
    return this.intersects(t) && (e.left = Math.max(this.left, t.left), e.top = Math.max(this.top, t.top), e.right = Math.min(this.right, t.right), e.bottom = Math.min(this.bottom, t.bottom)), e;
  }
  union(t) {
    const e = new H();
    return e.left = Math.min(this.left, t.left), e.top = Math.min(this.top, t.top), e.right = Math.max(this.right, t.right), e.bottom = Math.max(this.bottom, t.bottom), e;
  }
  toSymbol() {
    return H.symbol;
  }
  toString() {
    return `BBox(${this.x}, ${this.y}, ${this.width}, ${this.height})`;
  }
  toUniform(t, e) {
    t.uniform4f(e, this.x, this.y, this.width, this.height);
  }
  serialize() {
    return { x: this.x, y: this.y, width: this.width, height: this.height };
  }
}
H.symbol = Symbol.for("@motion-canvas/core/types/Rect");
var Kc = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {}, Oi = { exports: {} };
/**
 * chroma.js - JavaScript library for color conversions
 *
 * Copyright (c) 2011-2019, Gregor Aisch
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * 3. The name Gregor Aisch may not be used to endorse or promote products
 * derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL GREGOR AISCH OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT,
 * INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 * BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
 * EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * -------------------------------------------------------
 *
 * chroma.js includes colors from colorbrewer2.org, which are released under
 * the following license:
 *
 * Copyright (c) 2002 Cynthia Brewer, Mark Harrower,
 * and The Pennsylvania State University.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the License.
 *
 * ------------------------------------------------------
 *
 * Named colors are taken from X11 Color Names.
 * http://www.w3.org/TR/css3-color/#svg-color
 *
 * @preserve
 */
(function(s, t) {
  (function(e, r) {
    s.exports = r();
  })(Kc, function() {
    for (var e = function(n, o, l) {
      return o === void 0 && (o = 0), l === void 0 && (l = 1), n < o ? o : n > l ? l : n;
    }, r = e, i = function(n) {
      n._clipped = !1, n._unclipped = n.slice(0);
      for (var o = 0; o <= 3; o++)
        o < 3 ? ((n[o] < 0 || n[o] > 255) && (n._clipped = !0), n[o] = r(n[o], 0, 255)) : o === 3 && (n[o] = r(n[o], 0, 1));
      return n;
    }, a = {}, h = 0, u = ["Boolean", "Number", "String", "Function", "Array", "Date", "RegExp", "Undefined", "Null"]; h < u.length; h += 1) {
      var m = u[h];
      a["[object " + m + "]"] = m.toLowerCase();
    }
    var y = function(n) {
      return a[Object.prototype.toString.call(n)] || "object";
    }, S = y, F = function(n, o) {
      return o === void 0 && (o = null), n.length >= 3 ? Array.prototype.slice.call(n) : S(n[0]) == "object" && o ? o.split("").filter(function(l) {
        return n[0][l] !== void 0;
      }).map(function(l) {
        return n[0][l];
      }) : n[0];
    }, X = y, tt = function(n) {
      if (n.length < 2)
        return null;
      var o = n.length - 1;
      return X(n[o]) == "string" ? n[o].toLowerCase() : null;
    }, at = Math.PI, k = {
      clip_rgb: i,
      limit: e,
      type: y,
      unpack: F,
      last: tt,
      PI: at,
      TWOPI: at * 2,
      PITHIRD: at / 3,
      DEG2RAD: at / 180,
      RAD2DEG: 180 / at
    }, rt = {
      format: {},
      autodetect: []
    }, Pt = k.last, st = k.clip_rgb, Be = k.type, Et = rt, Ms = function() {
      for (var o = [], l = arguments.length; l--; )
        o[l] = arguments[l];
      var c = this;
      if (Be(o[0]) === "object" && o[0].constructor && o[0].constructor === this.constructor)
        return o[0];
      var p = Pt(o), d = !1;
      if (!p) {
        d = !0, Et.sorted || (Et.autodetect = Et.autodetect.sort(function(x, P) {
          return P.p - x.p;
        }), Et.sorted = !0);
        for (var f = 0, v = Et.autodetect; f < v.length; f += 1) {
          var b = v[f];
          if (p = b.test.apply(b, o), p)
            break;
        }
      }
      if (Et.format[p]) {
        var w = Et.format[p].apply(null, d ? o : o.slice(0, -1));
        c._rgb = st(w);
      } else
        throw new Error("unknown format: " + o);
      c._rgb.length === 3 && c._rgb.push(1);
    };
    Ms.prototype.toString = function() {
      return Be(this.hex) == "function" ? this.hex() : "[" + this._rgb.join(",") + "]";
    };
    var D = Ms, sr = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      return new (Function.prototype.bind.apply(sr.Color, [null].concat(n)))();
    };
    sr.Color = D, sr.version = "2.4.2";
    var lt = sr, Di = k.unpack, Ls = Math.max, ji = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      var l = Di(n, "rgb"), c = l[0], p = l[1], d = l[2];
      c = c / 255, p = p / 255, d = d / 255;
      var f = 1 - Ls(c, Ls(p, d)), v = f < 1 ? 1 / (1 - f) : 0, b = (1 - c - f) * v, w = (1 - p - f) * v, x = (1 - d - f) * v;
      return [b, w, x, f];
    }, Ni = ji, Bi = k.unpack, Wi = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      n = Bi(n, "cmyk");
      var l = n[0], c = n[1], p = n[2], d = n[3], f = n.length > 4 ? n[4] : 1;
      return d === 1 ? [0, 0, 0, f] : [
        l >= 1 ? 0 : 255 * (1 - l) * (1 - d),
        // r
        c >= 1 ? 0 : 255 * (1 - c) * (1 - d),
        // g
        p >= 1 ? 0 : 255 * (1 - p) * (1 - d),
        // b
        f
      ];
    }, Ui = Wi, Gi = lt, $s = D, As = rt, qi = k.unpack, Xi = k.type, Hi = Ni;
    $s.prototype.cmyk = function() {
      return Hi(this._rgb);
    }, Gi.cmyk = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      return new (Function.prototype.bind.apply($s, [null].concat(n, ["cmyk"])))();
    }, As.format.cmyk = Ui, As.autodetect.push({
      p: 2,
      test: function() {
        for (var n = [], o = arguments.length; o--; )
          n[o] = arguments[o];
        if (n = qi(n, "cmyk"), Xi(n) === "array" && n.length === 4)
          return "cmyk";
      }
    });
    var Yi = k.unpack, Zi = k.last, Lr = function(n) {
      return Math.round(n * 100) / 100;
    }, Vi = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      var l = Yi(n, "hsla"), c = Zi(n) || "lsa";
      return l[0] = Lr(l[0] || 0), l[1] = Lr(l[1] * 100) + "%", l[2] = Lr(l[2] * 100) + "%", c === "hsla" || l.length > 3 && l[3] < 1 ? (l[3] = l.length > 3 ? l[3] : 1, c = "hsla") : l.length = 3, c + "(" + l.join(",") + ")";
    }, Ji = Vi, Qi = k.unpack, Ki = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      n = Qi(n, "rgba");
      var l = n[0], c = n[1], p = n[2];
      l /= 255, c /= 255, p /= 255;
      var d = Math.min(l, c, p), f = Math.max(l, c, p), v = (f + d) / 2, b, w;
      return f === d ? (b = 0, w = Number.NaN) : b = v < 0.5 ? (f - d) / (f + d) : (f - d) / (2 - f - d), l == f ? w = (c - p) / (f - d) : c == f ? w = 2 + (p - l) / (f - d) : p == f && (w = 4 + (l - c) / (f - d)), w *= 60, w < 0 && (w += 360), n.length > 3 && n[3] !== void 0 ? [w, b, v, n[3]] : [w, b, v];
    }, Os = Ki, ta = k.unpack, ea = k.last, ra = Ji, sa = Os, $r = Math.round, na = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      var l = ta(n, "rgba"), c = ea(n) || "rgb";
      return c.substr(0, 3) == "hsl" ? ra(sa(l), c) : (l[0] = $r(l[0]), l[1] = $r(l[1]), l[2] = $r(l[2]), (c === "rgba" || l.length > 3 && l[3] < 1) && (l[3] = l.length > 3 ? l[3] : 1, c = "rgba"), c + "(" + l.slice(0, c === "rgb" ? 3 : 4).join(",") + ")");
    }, ia = na, aa = k.unpack, Ar = Math.round, oa = function() {
      for (var n, o = [], l = arguments.length; l--; )
        o[l] = arguments[l];
      o = aa(o, "hsl");
      var c = o[0], p = o[1], d = o[2], f, v, b;
      if (p === 0)
        f = v = b = d * 255;
      else {
        var w = [0, 0, 0], x = [0, 0, 0], P = d < 0.5 ? d * (1 + p) : d + p - d * p, C = 2 * d - P, L = c / 360;
        w[0] = L + 1 / 3, w[1] = L, w[2] = L - 1 / 3;
        for (var M = 0; M < 3; M++)
          w[M] < 0 && (w[M] += 1), w[M] > 1 && (w[M] -= 1), 6 * w[M] < 1 ? x[M] = C + (P - C) * 6 * w[M] : 2 * w[M] < 1 ? x[M] = P : 3 * w[M] < 2 ? x[M] = C + (P - C) * (2 / 3 - w[M]) * 6 : x[M] = C;
        n = [Ar(x[0] * 255), Ar(x[1] * 255), Ar(x[2] * 255)], f = n[0], v = n[1], b = n[2];
      }
      return o.length > 3 ? [f, v, b, o[3]] : [f, v, b, 1];
    }, Is = oa, zs = Is, Es = rt, Fs = /^rgb\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*\)$/, _s = /^rgba\(\s*(-?\d+),\s*(-?\d+)\s*,\s*(-?\d+)\s*,\s*([01]|[01]?\.\d+)\)$/, Ds = /^rgb\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/, js = /^rgba\(\s*(-?\d+(?:\.\d+)?)%,\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/, Ns = /^hsl\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*\)$/, Bs = /^hsla\(\s*(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)%\s*,\s*(-?\d+(?:\.\d+)?)%\s*,\s*([01]|[01]?\.\d+)\)$/, Ws = Math.round, Us = function(n) {
      n = n.toLowerCase().trim();
      var o;
      if (Es.format.named)
        try {
          return Es.format.named(n);
        } catch {
        }
      if (o = n.match(Fs)) {
        for (var l = o.slice(1, 4), c = 0; c < 3; c++)
          l[c] = +l[c];
        return l[3] = 1, l;
      }
      if (o = n.match(_s)) {
        for (var p = o.slice(1, 5), d = 0; d < 4; d++)
          p[d] = +p[d];
        return p;
      }
      if (o = n.match(Ds)) {
        for (var f = o.slice(1, 4), v = 0; v < 3; v++)
          f[v] = Ws(f[v] * 2.55);
        return f[3] = 1, f;
      }
      if (o = n.match(js)) {
        for (var b = o.slice(1, 5), w = 0; w < 3; w++)
          b[w] = Ws(b[w] * 2.55);
        return b[3] = +b[3], b;
      }
      if (o = n.match(Ns)) {
        var x = o.slice(1, 4);
        x[1] *= 0.01, x[2] *= 0.01;
        var P = zs(x);
        return P[3] = 1, P;
      }
      if (o = n.match(Bs)) {
        var C = o.slice(1, 4);
        C[1] *= 0.01, C[2] *= 0.01;
        var L = zs(C);
        return L[3] = +o[4], L;
      }
    };
    Us.test = function(n) {
      return Fs.test(n) || _s.test(n) || Ds.test(n) || js.test(n) || Ns.test(n) || Bs.test(n);
    };
    var la = Us, ha = lt, Gs = D, qs = rt, ca = k.type, ua = ia, Xs = la;
    Gs.prototype.css = function(n) {
      return ua(this._rgb, n);
    }, ha.css = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      return new (Function.prototype.bind.apply(Gs, [null].concat(n, ["css"])))();
    }, qs.format.css = Xs, qs.autodetect.push({
      p: 5,
      test: function(n) {
        for (var o = [], l = arguments.length - 1; l-- > 0; )
          o[l] = arguments[l + 1];
        if (!o.length && ca(n) === "string" && Xs.test(n))
          return "css";
      }
    });
    var Hs = D, fa = lt, pa = rt, da = k.unpack;
    pa.format.gl = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      var l = da(n, "rgba");
      return l[0] *= 255, l[1] *= 255, l[2] *= 255, l;
    }, fa.gl = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      return new (Function.prototype.bind.apply(Hs, [null].concat(n, ["gl"])))();
    }, Hs.prototype.gl = function() {
      var n = this._rgb;
      return [n[0] / 255, n[1] / 255, n[2] / 255, n[3]];
    };
    var ga = k.unpack, va = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      var l = ga(n, "rgb"), c = l[0], p = l[1], d = l[2], f = Math.min(c, p, d), v = Math.max(c, p, d), b = v - f, w = b * 100 / 255, x = f / (255 - b) * 100, P;
      return b === 0 ? P = Number.NaN : (c === v && (P = (p - d) / b), p === v && (P = 2 + (d - c) / b), d === v && (P = 4 + (c - p) / b), P *= 60, P < 0 && (P += 360)), [P, w, x];
    }, ma = va, ba = k.unpack, ya = Math.floor, wa = function() {
      for (var n, o, l, c, p, d, f = [], v = arguments.length; v--; )
        f[v] = arguments[v];
      f = ba(f, "hcg");
      var b = f[0], w = f[1], x = f[2], P, C, L;
      x = x * 255;
      var M = w * 255;
      if (w === 0)
        P = C = L = x;
      else {
        b === 360 && (b = 0), b > 360 && (b -= 360), b < 0 && (b += 360), b /= 60;
        var j = ya(b), W = b - j, G = x * (1 - w), Y = G + M * (1 - W), dt = G + M * W, pt = G + M;
        switch (j) {
          case 0:
            n = [pt, dt, G], P = n[0], C = n[1], L = n[2];
            break;
          case 1:
            o = [Y, pt, G], P = o[0], C = o[1], L = o[2];
            break;
          case 2:
            l = [G, pt, dt], P = l[0], C = l[1], L = l[2];
            break;
          case 3:
            c = [G, Y, pt], P = c[0], C = c[1], L = c[2];
            break;
          case 4:
            p = [dt, G, pt], P = p[0], C = p[1], L = p[2];
            break;
          case 5:
            d = [pt, G, Y], P = d[0], C = d[1], L = d[2];
            break;
        }
      }
      return [P, C, L, f.length > 3 ? f[3] : 1];
    }, xa = wa, Ca = k.unpack, Ta = k.type, Sa = lt, Ys = D, Zs = rt, ka = ma;
    Ys.prototype.hcg = function() {
      return ka(this._rgb);
    }, Sa.hcg = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      return new (Function.prototype.bind.apply(Ys, [null].concat(n, ["hcg"])))();
    }, Zs.format.hcg = xa, Zs.autodetect.push({
      p: 1,
      test: function() {
        for (var n = [], o = arguments.length; o--; )
          n[o] = arguments[o];
        if (n = Ca(n, "hcg"), Ta(n) === "array" && n.length === 3)
          return "hcg";
      }
    });
    var Ra = k.unpack, Pa = k.last, nr = Math.round, Ma = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      var l = Ra(n, "rgba"), c = l[0], p = l[1], d = l[2], f = l[3], v = Pa(n) || "auto";
      f === void 0 && (f = 1), v === "auto" && (v = f < 1 ? "rgba" : "rgb"), c = nr(c), p = nr(p), d = nr(d);
      var b = c << 16 | p << 8 | d, w = "000000" + b.toString(16);
      w = w.substr(w.length - 6);
      var x = "0" + nr(f * 255).toString(16);
      switch (x = x.substr(x.length - 2), v.toLowerCase()) {
        case "rgba":
          return "#" + w + x;
        case "argb":
          return "#" + x + w;
        default:
          return "#" + w;
      }
    }, Vs = Ma, La = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, $a = /^#?([A-Fa-f0-9]{8}|[A-Fa-f0-9]{4})$/, Aa = function(n) {
      if (n.match(La)) {
        (n.length === 4 || n.length === 7) && (n = n.substr(1)), n.length === 3 && (n = n.split(""), n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2]);
        var o = parseInt(n, 16), l = o >> 16, c = o >> 8 & 255, p = o & 255;
        return [l, c, p, 1];
      }
      if (n.match($a)) {
        (n.length === 5 || n.length === 9) && (n = n.substr(1)), n.length === 4 && (n = n.split(""), n = n[0] + n[0] + n[1] + n[1] + n[2] + n[2] + n[3] + n[3]);
        var d = parseInt(n, 16), f = d >> 24 & 255, v = d >> 16 & 255, b = d >> 8 & 255, w = Math.round((d & 255) / 255 * 100) / 100;
        return [f, v, b, w];
      }
      throw new Error("unknown hex color: " + n);
    }, Js = Aa, Oa = lt, Qs = D, Ia = k.type, Ks = rt, za = Vs;
    Qs.prototype.hex = function(n) {
      return za(this._rgb, n);
    }, Oa.hex = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      return new (Function.prototype.bind.apply(Qs, [null].concat(n, ["hex"])))();
    }, Ks.format.hex = Js, Ks.autodetect.push({
      p: 4,
      test: function(n) {
        for (var o = [], l = arguments.length - 1; l-- > 0; )
          o[l] = arguments[l + 1];
        if (!o.length && Ia(n) === "string" && [3, 4, 5, 6, 7, 8, 9].indexOf(n.length) >= 0)
          return "hex";
      }
    });
    var Ea = k.unpack, tn = k.TWOPI, Fa = Math.min, _a = Math.sqrt, Da = Math.acos, ja = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      var l = Ea(n, "rgb"), c = l[0], p = l[1], d = l[2];
      c /= 255, p /= 255, d /= 255;
      var f, v = Fa(c, p, d), b = (c + p + d) / 3, w = b > 0 ? 1 - v / b : 0;
      return w === 0 ? f = NaN : (f = (c - p + (c - d)) / 2, f /= _a((c - p) * (c - p) + (c - d) * (p - d)), f = Da(f), d > p && (f = tn - f), f /= tn), [f * 360, w, b];
    }, Na = ja, Ba = k.unpack, Or = k.limit, Pe = k.TWOPI, Ir = k.PITHIRD, Me = Math.cos, Wa = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      n = Ba(n, "hsi");
      var l = n[0], c = n[1], p = n[2], d, f, v;
      return isNaN(l) && (l = 0), isNaN(c) && (c = 0), l > 360 && (l -= 360), l < 0 && (l += 360), l /= 360, l < 1 / 3 ? (v = (1 - c) / 3, d = (1 + c * Me(Pe * l) / Me(Ir - Pe * l)) / 3, f = 1 - (v + d)) : l < 2 / 3 ? (l -= 1 / 3, d = (1 - c) / 3, f = (1 + c * Me(Pe * l) / Me(Ir - Pe * l)) / 3, v = 1 - (d + f)) : (l -= 2 / 3, f = (1 - c) / 3, v = (1 + c * Me(Pe * l) / Me(Ir - Pe * l)) / 3, d = 1 - (f + v)), d = Or(p * d * 3), f = Or(p * f * 3), v = Or(p * v * 3), [d * 255, f * 255, v * 255, n.length > 3 ? n[3] : 1];
    }, Ua = Wa, Ga = k.unpack, qa = k.type, Xa = lt, en = D, rn = rt, Ha = Na;
    en.prototype.hsi = function() {
      return Ha(this._rgb);
    }, Xa.hsi = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      return new (Function.prototype.bind.apply(en, [null].concat(n, ["hsi"])))();
    }, rn.format.hsi = Ua, rn.autodetect.push({
      p: 2,
      test: function() {
        for (var n = [], o = arguments.length; o--; )
          n[o] = arguments[o];
        if (n = Ga(n, "hsi"), qa(n) === "array" && n.length === 3)
          return "hsi";
      }
    });
    var Ya = k.unpack, Za = k.type, Va = lt, sn = D, nn = rt, Ja = Os;
    sn.prototype.hsl = function() {
      return Ja(this._rgb);
    }, Va.hsl = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      return new (Function.prototype.bind.apply(sn, [null].concat(n, ["hsl"])))();
    }, nn.format.hsl = Is, nn.autodetect.push({
      p: 2,
      test: function() {
        for (var n = [], o = arguments.length; o--; )
          n[o] = arguments[o];
        if (n = Ya(n, "hsl"), Za(n) === "array" && n.length === 3)
          return "hsl";
      }
    });
    var Qa = k.unpack, Ka = Math.min, to = Math.max, eo = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      n = Qa(n, "rgb");
      var l = n[0], c = n[1], p = n[2], d = Ka(l, c, p), f = to(l, c, p), v = f - d, b, w, x;
      return x = f / 255, f === 0 ? (b = Number.NaN, w = 0) : (w = v / f, l === f && (b = (c - p) / v), c === f && (b = 2 + (p - l) / v), p === f && (b = 4 + (l - c) / v), b *= 60, b < 0 && (b += 360)), [b, w, x];
    }, ro = eo, so = k.unpack, no = Math.floor, io = function() {
      for (var n, o, l, c, p, d, f = [], v = arguments.length; v--; )
        f[v] = arguments[v];
      f = so(f, "hsv");
      var b = f[0], w = f[1], x = f[2], P, C, L;
      if (x *= 255, w === 0)
        P = C = L = x;
      else {
        b === 360 && (b = 0), b > 360 && (b -= 360), b < 0 && (b += 360), b /= 60;
        var M = no(b), j = b - M, W = x * (1 - w), G = x * (1 - w * j), Y = x * (1 - w * (1 - j));
        switch (M) {
          case 0:
            n = [x, Y, W], P = n[0], C = n[1], L = n[2];
            break;
          case 1:
            o = [G, x, W], P = o[0], C = o[1], L = o[2];
            break;
          case 2:
            l = [W, x, Y], P = l[0], C = l[1], L = l[2];
            break;
          case 3:
            c = [W, G, x], P = c[0], C = c[1], L = c[2];
            break;
          case 4:
            p = [Y, W, x], P = p[0], C = p[1], L = p[2];
            break;
          case 5:
            d = [x, W, G], P = d[0], C = d[1], L = d[2];
            break;
        }
      }
      return [P, C, L, f.length > 3 ? f[3] : 1];
    }, ao = io, oo = k.unpack, lo = k.type, ho = lt, an = D, on = rt, co = ro;
    an.prototype.hsv = function() {
      return co(this._rgb);
    }, ho.hsv = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      return new (Function.prototype.bind.apply(an, [null].concat(n, ["hsv"])))();
    }, on.format.hsv = ao, on.autodetect.push({
      p: 2,
      test: function() {
        for (var n = [], o = arguments.length; o--; )
          n[o] = arguments[o];
        if (n = oo(n, "hsv"), lo(n) === "array" && n.length === 3)
          return "hsv";
      }
    });
    var ir = {
      // Corresponds roughly to RGB brighter/darker
      Kn: 18,
      // D65 standard referent
      Xn: 0.95047,
      Yn: 1,
      Zn: 1.08883,
      t0: 0.137931034,
      // 4 / 29
      t1: 0.206896552,
      // 6 / 29
      t2: 0.12841855,
      // 3 * t1 * t1
      t3: 8856452e-9
      // t1 * t1 * t1
    }, Le = ir, uo = k.unpack, ln = Math.pow, fo = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      var l = uo(n, "rgb"), c = l[0], p = l[1], d = l[2], f = po(c, p, d), v = f[0], b = f[1], w = f[2], x = 116 * b - 16;
      return [x < 0 ? 0 : x, 500 * (v - b), 200 * (b - w)];
    }, zr = function(n) {
      return (n /= 255) <= 0.04045 ? n / 12.92 : ln((n + 0.055) / 1.055, 2.4);
    }, Er = function(n) {
      return n > Le.t3 ? ln(n, 1 / 3) : n / Le.t2 + Le.t0;
    }, po = function(n, o, l) {
      n = zr(n), o = zr(o), l = zr(l);
      var c = Er((0.4124564 * n + 0.3575761 * o + 0.1804375 * l) / Le.Xn), p = Er((0.2126729 * n + 0.7151522 * o + 0.072175 * l) / Le.Yn), d = Er((0.0193339 * n + 0.119192 * o + 0.9503041 * l) / Le.Zn);
      return [c, p, d];
    }, hn = fo, $e = ir, go = k.unpack, vo = Math.pow, mo = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      n = go(n, "lab");
      var l = n[0], c = n[1], p = n[2], d, f, v, b, w, x;
      return f = (l + 16) / 116, d = isNaN(c) ? f : f + c / 500, v = isNaN(p) ? f : f - p / 200, f = $e.Yn * _r(f), d = $e.Xn * _r(d), v = $e.Zn * _r(v), b = Fr(3.2404542 * d - 1.5371385 * f - 0.4985314 * v), w = Fr(-0.969266 * d + 1.8760108 * f + 0.041556 * v), x = Fr(0.0556434 * d - 0.2040259 * f + 1.0572252 * v), [b, w, x, n.length > 3 ? n[3] : 1];
    }, Fr = function(n) {
      return 255 * (n <= 304e-5 ? 12.92 * n : 1.055 * vo(n, 1 / 2.4) - 0.055);
    }, _r = function(n) {
      return n > $e.t1 ? n * n * n : $e.t2 * (n - $e.t0);
    }, cn = mo, bo = k.unpack, yo = k.type, wo = lt, un = D, fn = rt, xo = hn;
    un.prototype.lab = function() {
      return xo(this._rgb);
    }, wo.lab = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      return new (Function.prototype.bind.apply(un, [null].concat(n, ["lab"])))();
    }, fn.format.lab = cn, fn.autodetect.push({
      p: 2,
      test: function() {
        for (var n = [], o = arguments.length; o--; )
          n[o] = arguments[o];
        if (n = bo(n, "lab"), yo(n) === "array" && n.length === 3)
          return "lab";
      }
    });
    var Co = k.unpack, To = k.RAD2DEG, So = Math.sqrt, ko = Math.atan2, Ro = Math.round, Po = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      var l = Co(n, "lab"), c = l[0], p = l[1], d = l[2], f = So(p * p + d * d), v = (ko(d, p) * To + 360) % 360;
      return Ro(f * 1e4) === 0 && (v = Number.NaN), [c, f, v];
    }, pn = Po, Mo = k.unpack, Lo = hn, $o = pn, Ao = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      var l = Mo(n, "rgb"), c = l[0], p = l[1], d = l[2], f = Lo(c, p, d), v = f[0], b = f[1], w = f[2];
      return $o(v, b, w);
    }, Oo = Ao, Io = k.unpack, zo = k.DEG2RAD, Eo = Math.sin, Fo = Math.cos, _o = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      var l = Io(n, "lch"), c = l[0], p = l[1], d = l[2];
      return isNaN(d) && (d = 0), d = d * zo, [c, Fo(d) * p, Eo(d) * p];
    }, dn = _o, Do = k.unpack, jo = dn, No = cn, Bo = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      n = Do(n, "lch");
      var l = n[0], c = n[1], p = n[2], d = jo(l, c, p), f = d[0], v = d[1], b = d[2], w = No(f, v, b), x = w[0], P = w[1], C = w[2];
      return [x, P, C, n.length > 3 ? n[3] : 1];
    }, gn = Bo, Wo = k.unpack, Uo = gn, Go = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      var l = Wo(n, "hcl").reverse();
      return Uo.apply(void 0, l);
    }, qo = Go, Xo = k.unpack, Ho = k.type, vn = lt, ar = D, Dr = rt, mn = Oo;
    ar.prototype.lch = function() {
      return mn(this._rgb);
    }, ar.prototype.hcl = function() {
      return mn(this._rgb).reverse();
    }, vn.lch = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      return new (Function.prototype.bind.apply(ar, [null].concat(n, ["lch"])))();
    }, vn.hcl = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      return new (Function.prototype.bind.apply(ar, [null].concat(n, ["hcl"])))();
    }, Dr.format.lch = gn, Dr.format.hcl = qo, ["lch", "hcl"].forEach(function(n) {
      return Dr.autodetect.push({
        p: 2,
        test: function() {
          for (var o = [], l = arguments.length; l--; )
            o[l] = arguments[l];
          if (o = Xo(o, n), Ho(o) === "array" && o.length === 3)
            return n;
        }
      });
    });
    var Yo = {
      aliceblue: "#f0f8ff",
      antiquewhite: "#faebd7",
      aqua: "#00ffff",
      aquamarine: "#7fffd4",
      azure: "#f0ffff",
      beige: "#f5f5dc",
      bisque: "#ffe4c4",
      black: "#000000",
      blanchedalmond: "#ffebcd",
      blue: "#0000ff",
      blueviolet: "#8a2be2",
      brown: "#a52a2a",
      burlywood: "#deb887",
      cadetblue: "#5f9ea0",
      chartreuse: "#7fff00",
      chocolate: "#d2691e",
      coral: "#ff7f50",
      cornflower: "#6495ed",
      cornflowerblue: "#6495ed",
      cornsilk: "#fff8dc",
      crimson: "#dc143c",
      cyan: "#00ffff",
      darkblue: "#00008b",
      darkcyan: "#008b8b",
      darkgoldenrod: "#b8860b",
      darkgray: "#a9a9a9",
      darkgreen: "#006400",
      darkgrey: "#a9a9a9",
      darkkhaki: "#bdb76b",
      darkmagenta: "#8b008b",
      darkolivegreen: "#556b2f",
      darkorange: "#ff8c00",
      darkorchid: "#9932cc",
      darkred: "#8b0000",
      darksalmon: "#e9967a",
      darkseagreen: "#8fbc8f",
      darkslateblue: "#483d8b",
      darkslategray: "#2f4f4f",
      darkslategrey: "#2f4f4f",
      darkturquoise: "#00ced1",
      darkviolet: "#9400d3",
      deeppink: "#ff1493",
      deepskyblue: "#00bfff",
      dimgray: "#696969",
      dimgrey: "#696969",
      dodgerblue: "#1e90ff",
      firebrick: "#b22222",
      floralwhite: "#fffaf0",
      forestgreen: "#228b22",
      fuchsia: "#ff00ff",
      gainsboro: "#dcdcdc",
      ghostwhite: "#f8f8ff",
      gold: "#ffd700",
      goldenrod: "#daa520",
      gray: "#808080",
      green: "#008000",
      greenyellow: "#adff2f",
      grey: "#808080",
      honeydew: "#f0fff0",
      hotpink: "#ff69b4",
      indianred: "#cd5c5c",
      indigo: "#4b0082",
      ivory: "#fffff0",
      khaki: "#f0e68c",
      laserlemon: "#ffff54",
      lavender: "#e6e6fa",
      lavenderblush: "#fff0f5",
      lawngreen: "#7cfc00",
      lemonchiffon: "#fffacd",
      lightblue: "#add8e6",
      lightcoral: "#f08080",
      lightcyan: "#e0ffff",
      lightgoldenrod: "#fafad2",
      lightgoldenrodyellow: "#fafad2",
      lightgray: "#d3d3d3",
      lightgreen: "#90ee90",
      lightgrey: "#d3d3d3",
      lightpink: "#ffb6c1",
      lightsalmon: "#ffa07a",
      lightseagreen: "#20b2aa",
      lightskyblue: "#87cefa",
      lightslategray: "#778899",
      lightslategrey: "#778899",
      lightsteelblue: "#b0c4de",
      lightyellow: "#ffffe0",
      lime: "#00ff00",
      limegreen: "#32cd32",
      linen: "#faf0e6",
      magenta: "#ff00ff",
      maroon: "#800000",
      maroon2: "#7f0000",
      maroon3: "#b03060",
      mediumaquamarine: "#66cdaa",
      mediumblue: "#0000cd",
      mediumorchid: "#ba55d3",
      mediumpurple: "#9370db",
      mediumseagreen: "#3cb371",
      mediumslateblue: "#7b68ee",
      mediumspringgreen: "#00fa9a",
      mediumturquoise: "#48d1cc",
      mediumvioletred: "#c71585",
      midnightblue: "#191970",
      mintcream: "#f5fffa",
      mistyrose: "#ffe4e1",
      moccasin: "#ffe4b5",
      navajowhite: "#ffdead",
      navy: "#000080",
      oldlace: "#fdf5e6",
      olive: "#808000",
      olivedrab: "#6b8e23",
      orange: "#ffa500",
      orangered: "#ff4500",
      orchid: "#da70d6",
      palegoldenrod: "#eee8aa",
      palegreen: "#98fb98",
      paleturquoise: "#afeeee",
      palevioletred: "#db7093",
      papayawhip: "#ffefd5",
      peachpuff: "#ffdab9",
      peru: "#cd853f",
      pink: "#ffc0cb",
      plum: "#dda0dd",
      powderblue: "#b0e0e6",
      purple: "#800080",
      purple2: "#7f007f",
      purple3: "#a020f0",
      rebeccapurple: "#663399",
      red: "#ff0000",
      rosybrown: "#bc8f8f",
      royalblue: "#4169e1",
      saddlebrown: "#8b4513",
      salmon: "#fa8072",
      sandybrown: "#f4a460",
      seagreen: "#2e8b57",
      seashell: "#fff5ee",
      sienna: "#a0522d",
      silver: "#c0c0c0",
      skyblue: "#87ceeb",
      slateblue: "#6a5acd",
      slategray: "#708090",
      slategrey: "#708090",
      snow: "#fffafa",
      springgreen: "#00ff7f",
      steelblue: "#4682b4",
      tan: "#d2b48c",
      teal: "#008080",
      thistle: "#d8bfd8",
      tomato: "#ff6347",
      turquoise: "#40e0d0",
      violet: "#ee82ee",
      wheat: "#f5deb3",
      white: "#ffffff",
      whitesmoke: "#f5f5f5",
      yellow: "#ffff00",
      yellowgreen: "#9acd32"
    }, bn = Yo, Zo = D, yn = rt, Vo = k.type, We = bn, Jo = Js, Qo = Vs;
    Zo.prototype.name = function() {
      for (var n = Qo(this._rgb, "rgb"), o = 0, l = Object.keys(We); o < l.length; o += 1) {
        var c = l[o];
        if (We[c] === n)
          return c.toLowerCase();
      }
      return n;
    }, yn.format.named = function(n) {
      if (n = n.toLowerCase(), We[n])
        return Jo(We[n]);
      throw new Error("unknown color name: " + n);
    }, yn.autodetect.push({
      p: 5,
      test: function(n) {
        for (var o = [], l = arguments.length - 1; l-- > 0; )
          o[l] = arguments[l + 1];
        if (!o.length && Vo(n) === "string" && We[n.toLowerCase()])
          return "named";
      }
    });
    var Ko = k.unpack, tl = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      var l = Ko(n, "rgb"), c = l[0], p = l[1], d = l[2];
      return (c << 16) + (p << 8) + d;
    }, el = tl, rl = k.type, sl = function(n) {
      if (rl(n) == "number" && n >= 0 && n <= 16777215) {
        var o = n >> 16, l = n >> 8 & 255, c = n & 255;
        return [o, l, c, 1];
      }
      throw new Error("unknown num color: " + n);
    }, nl = sl, il = lt, wn = D, xn = rt, al = k.type, ol = el;
    wn.prototype.num = function() {
      return ol(this._rgb);
    }, il.num = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      return new (Function.prototype.bind.apply(wn, [null].concat(n, ["num"])))();
    }, xn.format.num = nl, xn.autodetect.push({
      p: 5,
      test: function() {
        for (var n = [], o = arguments.length; o--; )
          n[o] = arguments[o];
        if (n.length === 1 && al(n[0]) === "number" && n[0] >= 0 && n[0] <= 16777215)
          return "num";
      }
    });
    var ll = lt, jr = D, Cn = rt, Tn = k.unpack, Sn = k.type, kn = Math.round;
    jr.prototype.rgb = function(n) {
      return n === void 0 && (n = !0), n === !1 ? this._rgb.slice(0, 3) : this._rgb.slice(0, 3).map(kn);
    }, jr.prototype.rgba = function(n) {
      return n === void 0 && (n = !0), this._rgb.slice(0, 4).map(function(o, l) {
        return l < 3 ? n === !1 ? o : kn(o) : o;
      });
    }, ll.rgb = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      return new (Function.prototype.bind.apply(jr, [null].concat(n, ["rgb"])))();
    }, Cn.format.rgb = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      var l = Tn(n, "rgba");
      return l[3] === void 0 && (l[3] = 1), l;
    }, Cn.autodetect.push({
      p: 3,
      test: function() {
        for (var n = [], o = arguments.length; o--; )
          n[o] = arguments[o];
        if (n = Tn(n, "rgba"), Sn(n) === "array" && (n.length === 3 || n.length === 4 && Sn(n[3]) == "number" && n[3] >= 0 && n[3] <= 1))
          return "rgb";
      }
    });
    var or = Math.log, hl = function(n) {
      var o = n / 100, l, c, p;
      return o < 66 ? (l = 255, c = o < 6 ? 0 : -155.25485562709179 - 0.44596950469579133 * (c = o - 2) + 104.49216199393888 * or(c), p = o < 20 ? 0 : -254.76935184120902 + 0.8274096064007395 * (p = o - 10) + 115.67994401066147 * or(p)) : (l = 351.97690566805693 + 0.114206453784165 * (l = o - 55) - 40.25366309332127 * or(l), c = 325.4494125711974 + 0.07943456536662342 * (c = o - 50) - 28.0852963507957 * or(c), p = 255), [l, c, p, 1];
    }, Rn = hl, cl = Rn, ul = k.unpack, fl = Math.round, pl = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      for (var l = ul(n, "rgb"), c = l[0], p = l[2], d = 1e3, f = 4e4, v = 0.4, b; f - d > v; ) {
        b = (f + d) * 0.5;
        var w = cl(b);
        w[2] / w[0] >= p / c ? f = b : d = b;
      }
      return fl(b);
    }, dl = pl, Nr = lt, lr = D, Br = rt, gl = dl;
    lr.prototype.temp = lr.prototype.kelvin = lr.prototype.temperature = function() {
      return gl(this._rgb);
    }, Nr.temp = Nr.kelvin = Nr.temperature = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      return new (Function.prototype.bind.apply(lr, [null].concat(n, ["temp"])))();
    }, Br.format.temp = Br.format.kelvin = Br.format.temperature = Rn;
    var vl = k.unpack, Wr = Math.cbrt, ml = Math.pow, bl = Math.sign, yl = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      var l = vl(n, "rgb"), c = l[0], p = l[1], d = l[2], f = [Ur(c / 255), Ur(p / 255), Ur(d / 255)], v = f[0], b = f[1], w = f[2], x = Wr(0.4122214708 * v + 0.5363325363 * b + 0.0514459929 * w), P = Wr(0.2119034982 * v + 0.6806995451 * b + 0.1073969566 * w), C = Wr(0.0883024619 * v + 0.2817188376 * b + 0.6299787005 * w);
      return [
        0.2104542553 * x + 0.793617785 * P - 0.0040720468 * C,
        1.9779984951 * x - 2.428592205 * P + 0.4505937099 * C,
        0.0259040371 * x + 0.7827717662 * P - 0.808675766 * C
      ];
    }, Pn = yl;
    function Ur(n) {
      var o = Math.abs(n);
      return o < 0.04045 ? n / 12.92 : (bl(n) || 1) * ml((o + 0.055) / 1.055, 2.4);
    }
    var wl = k.unpack, hr = Math.pow, xl = Math.sign, Cl = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      n = wl(n, "lab");
      var l = n[0], c = n[1], p = n[2], d = hr(l + 0.3963377774 * c + 0.2158037573 * p, 3), f = hr(l - 0.1055613458 * c - 0.0638541728 * p, 3), v = hr(l - 0.0894841775 * c - 1.291485548 * p, 3);
      return [
        255 * Gr(4.0767416621 * d - 3.3077115913 * f + 0.2309699292 * v),
        255 * Gr(-1.2684380046 * d + 2.6097574011 * f - 0.3413193965 * v),
        255 * Gr(-0.0041960863 * d - 0.7034186147 * f + 1.707614701 * v),
        n.length > 3 ? n[3] : 1
      ];
    }, Mn = Cl;
    function Gr(n) {
      var o = Math.abs(n);
      return o > 31308e-7 ? (xl(n) || 1) * (1.055 * hr(o, 1 / 2.4) - 0.055) : n * 12.92;
    }
    var Tl = k.unpack, Sl = k.type, kl = lt, Ln = D, $n = rt, Rl = Pn;
    Ln.prototype.oklab = function() {
      return Rl(this._rgb);
    }, kl.oklab = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      return new (Function.prototype.bind.apply(Ln, [null].concat(n, ["oklab"])))();
    }, $n.format.oklab = Mn, $n.autodetect.push({
      p: 3,
      test: function() {
        for (var n = [], o = arguments.length; o--; )
          n[o] = arguments[o];
        if (n = Tl(n, "oklab"), Sl(n) === "array" && n.length === 3)
          return "oklab";
      }
    });
    var Pl = k.unpack, Ml = Pn, Ll = pn, $l = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      var l = Pl(n, "rgb"), c = l[0], p = l[1], d = l[2], f = Ml(c, p, d), v = f[0], b = f[1], w = f[2];
      return Ll(v, b, w);
    }, Al = $l, Ol = k.unpack, Il = dn, zl = Mn, El = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      n = Ol(n, "lch");
      var l = n[0], c = n[1], p = n[2], d = Il(l, c, p), f = d[0], v = d[1], b = d[2], w = zl(f, v, b), x = w[0], P = w[1], C = w[2];
      return [x, P, C, n.length > 3 ? n[3] : 1];
    }, Fl = El, _l = k.unpack, Dl = k.type, jl = lt, An = D, On = rt, Nl = Al;
    An.prototype.oklch = function() {
      return Nl(this._rgb);
    }, jl.oklch = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      return new (Function.prototype.bind.apply(An, [null].concat(n, ["oklch"])))();
    }, On.format.oklch = Fl, On.autodetect.push({
      p: 3,
      test: function() {
        for (var n = [], o = arguments.length; o--; )
          n[o] = arguments[o];
        if (n = _l(n, "oklch"), Dl(n) === "array" && n.length === 3)
          return "oklch";
      }
    });
    var In = D, Bl = k.type;
    In.prototype.alpha = function(n, o) {
      return o === void 0 && (o = !1), n !== void 0 && Bl(n) === "number" ? o ? (this._rgb[3] = n, this) : new In([this._rgb[0], this._rgb[1], this._rgb[2], n], "rgb") : this._rgb[3];
    };
    var Wl = D;
    Wl.prototype.clipped = function() {
      return this._rgb._clipped || !1;
    };
    var pe = D, Ul = ir;
    pe.prototype.darken = function(n) {
      n === void 0 && (n = 1);
      var o = this, l = o.lab();
      return l[0] -= Ul.Kn * n, new pe(l, "lab").alpha(o.alpha(), !0);
    }, pe.prototype.brighten = function(n) {
      return n === void 0 && (n = 1), this.darken(-n);
    }, pe.prototype.darker = pe.prototype.darken, pe.prototype.brighter = pe.prototype.brighten;
    var Gl = D;
    Gl.prototype.get = function(n) {
      var o = n.split("."), l = o[0], c = o[1], p = this[l]();
      if (c) {
        var d = l.indexOf(c) - (l.substr(0, 2) === "ok" ? 2 : 0);
        if (d > -1)
          return p[d];
        throw new Error("unknown channel " + c + " in mode " + l);
      } else
        return p;
    };
    var Ae = D, ql = k.type, Xl = Math.pow, Hl = 1e-7, Yl = 20;
    Ae.prototype.luminance = function(n) {
      if (n !== void 0 && ql(n) === "number") {
        if (n === 0)
          return new Ae([0, 0, 0, this._rgb[3]], "rgb");
        if (n === 1)
          return new Ae([255, 255, 255, this._rgb[3]], "rgb");
        var o = this.luminance(), l = "rgb", c = Yl, p = function(f, v) {
          var b = f.interpolate(v, 0.5, l), w = b.luminance();
          return Math.abs(n - w) < Hl || !c-- ? b : w > n ? p(f, b) : p(b, v);
        }, d = (o > n ? p(new Ae([0, 0, 0]), this) : p(this, new Ae([255, 255, 255]))).rgb();
        return new Ae(d.concat([this._rgb[3]]));
      }
      return Zl.apply(void 0, this._rgb.slice(0, 3));
    };
    var Zl = function(n, o, l) {
      return n = qr(n), o = qr(o), l = qr(l), 0.2126 * n + 0.7152 * o + 0.0722 * l;
    }, qr = function(n) {
      return n /= 255, n <= 0.03928 ? n / 12.92 : Xl((n + 0.055) / 1.055, 2.4);
    }, Ct = {}, zn = D, En = k.type, cr = Ct, Fn = function(n, o, l) {
      l === void 0 && (l = 0.5);
      for (var c = [], p = arguments.length - 3; p-- > 0; )
        c[p] = arguments[p + 3];
      var d = c[0] || "lrgb";
      if (!cr[d] && !c.length && (d = Object.keys(cr)[0]), !cr[d])
        throw new Error("interpolation mode " + d + " is not defined");
      return En(n) !== "object" && (n = new zn(n)), En(o) !== "object" && (o = new zn(o)), cr[d](n, o, l).alpha(n.alpha() + l * (o.alpha() - n.alpha()));
    }, _n = D, Vl = Fn;
    _n.prototype.mix = _n.prototype.interpolate = function(n, o) {
      o === void 0 && (o = 0.5);
      for (var l = [], c = arguments.length - 2; c-- > 0; )
        l[c] = arguments[c + 2];
      return Vl.apply(void 0, [this, n, o].concat(l));
    };
    var Dn = D;
    Dn.prototype.premultiply = function(n) {
      n === void 0 && (n = !1);
      var o = this._rgb, l = o[3];
      return n ? (this._rgb = [o[0] * l, o[1] * l, o[2] * l, l], this) : new Dn([o[0] * l, o[1] * l, o[2] * l, l], "rgb");
    };
    var Xr = D, Jl = ir;
    Xr.prototype.saturate = function(n) {
      n === void 0 && (n = 1);
      var o = this, l = o.lch();
      return l[1] += Jl.Kn * n, l[1] < 0 && (l[1] = 0), new Xr(l, "lch").alpha(o.alpha(), !0);
    }, Xr.prototype.desaturate = function(n) {
      return n === void 0 && (n = 1), this.saturate(-n);
    };
    var jn = D, Nn = k.type;
    jn.prototype.set = function(n, o, l) {
      l === void 0 && (l = !1);
      var c = n.split("."), p = c[0], d = c[1], f = this[p]();
      if (d) {
        var v = p.indexOf(d) - (p.substr(0, 2) === "ok" ? 2 : 0);
        if (v > -1) {
          if (Nn(o) == "string")
            switch (o.charAt(0)) {
              case "+":
                f[v] += +o;
                break;
              case "-":
                f[v] += +o;
                break;
              case "*":
                f[v] *= +o.substr(1);
                break;
              case "/":
                f[v] /= +o.substr(1);
                break;
              default:
                f[v] = +o;
            }
          else if (Nn(o) === "number")
            f[v] = o;
          else
            throw new Error("unsupported value for Color.set");
          var b = new jn(f, p);
          return l ? (this._rgb = b._rgb, this) : b;
        }
        throw new Error("unknown channel " + d + " in mode " + p);
      } else
        return f;
    };
    var Ql = D, Kl = function(n, o, l) {
      var c = n._rgb, p = o._rgb;
      return new Ql(
        c[0] + l * (p[0] - c[0]),
        c[1] + l * (p[1] - c[1]),
        c[2] + l * (p[2] - c[2]),
        "rgb"
      );
    };
    Ct.rgb = Kl;
    var th = D, Hr = Math.sqrt, Oe = Math.pow, eh = function(n, o, l) {
      var c = n._rgb, p = c[0], d = c[1], f = c[2], v = o._rgb, b = v[0], w = v[1], x = v[2];
      return new th(
        Hr(Oe(p, 2) * (1 - l) + Oe(b, 2) * l),
        Hr(Oe(d, 2) * (1 - l) + Oe(w, 2) * l),
        Hr(Oe(f, 2) * (1 - l) + Oe(x, 2) * l),
        "rgb"
      );
    };
    Ct.lrgb = eh;
    var rh = D, sh = function(n, o, l) {
      var c = n.lab(), p = o.lab();
      return new rh(
        c[0] + l * (p[0] - c[0]),
        c[1] + l * (p[1] - c[1]),
        c[2] + l * (p[2] - c[2]),
        "lab"
      );
    };
    Ct.lab = sh;
    var Bn = D, Ie = function(n, o, l, c) {
      var p, d, f, v;
      c === "hsl" ? (f = n.hsl(), v = o.hsl()) : c === "hsv" ? (f = n.hsv(), v = o.hsv()) : c === "hcg" ? (f = n.hcg(), v = o.hcg()) : c === "hsi" ? (f = n.hsi(), v = o.hsi()) : c === "lch" || c === "hcl" ? (c = "hcl", f = n.hcl(), v = o.hcl()) : c === "oklch" && (f = n.oklch().reverse(), v = o.oklch().reverse());
      var b, w, x, P, C, L;
      (c.substr(0, 1) === "h" || c === "oklch") && (p = f, b = p[0], x = p[1], C = p[2], d = v, w = d[0], P = d[1], L = d[2]);
      var M, j, W, G;
      return !isNaN(b) && !isNaN(w) ? (w > b && w - b > 180 ? G = w - (b + 360) : w < b && b - w > 180 ? G = w + 360 - b : G = w - b, j = b + l * G) : isNaN(b) ? isNaN(w) ? j = Number.NaN : (j = w, (C == 1 || C == 0) && c != "hsv" && (M = P)) : (j = b, (L == 1 || L == 0) && c != "hsv" && (M = x)), M === void 0 && (M = x + l * (P - x)), W = C + l * (L - C), c === "oklch" ? new Bn([W, M, j], c) : new Bn([j, M, W], c);
    }, nh = Ie, Wn = function(n, o, l) {
      return nh(n, o, l, "lch");
    };
    Ct.lch = Wn, Ct.hcl = Wn;
    var ih = D, ah = function(n, o, l) {
      var c = n.num(), p = o.num();
      return new ih(c + l * (p - c), "num");
    };
    Ct.num = ah;
    var oh = Ie, lh = function(n, o, l) {
      return oh(n, o, l, "hcg");
    };
    Ct.hcg = lh;
    var hh = Ie, ch = function(n, o, l) {
      return hh(n, o, l, "hsi");
    };
    Ct.hsi = ch;
    var uh = Ie, fh = function(n, o, l) {
      return uh(n, o, l, "hsl");
    };
    Ct.hsl = fh;
    var ph = Ie, dh = function(n, o, l) {
      return ph(n, o, l, "hsv");
    };
    Ct.hsv = dh;
    var gh = D, vh = function(n, o, l) {
      var c = n.oklab(), p = o.oklab();
      return new gh(
        c[0] + l * (p[0] - c[0]),
        c[1] + l * (p[1] - c[1]),
        c[2] + l * (p[2] - c[2]),
        "oklab"
      );
    };
    Ct.oklab = vh;
    var mh = Ie, bh = function(n, o, l) {
      return mh(n, o, l, "oklch");
    };
    Ct.oklch = bh;
    var Yr = D, yh = k.clip_rgb, Zr = Math.pow, Vr = Math.sqrt, Jr = Math.PI, Un = Math.cos, Gn = Math.sin, wh = Math.atan2, xh = function(n, o, l) {
      o === void 0 && (o = "lrgb"), l === void 0 && (l = null);
      var c = n.length;
      l || (l = Array.from(new Array(c)).map(function() {
        return 1;
      }));
      var p = c / l.reduce(function(j, W) {
        return j + W;
      });
      if (l.forEach(function(j, W) {
        l[W] *= p;
      }), n = n.map(function(j) {
        return new Yr(j);
      }), o === "lrgb")
        return Ch(n, l);
      for (var d = n.shift(), f = d.get(o), v = [], b = 0, w = 0, x = 0; x < f.length; x++)
        if (f[x] = (f[x] || 0) * l[0], v.push(isNaN(f[x]) ? 0 : l[0]), o.charAt(x) === "h" && !isNaN(f[x])) {
          var P = f[x] / 180 * Jr;
          b += Un(P) * l[0], w += Gn(P) * l[0];
        }
      var C = d.alpha() * l[0];
      n.forEach(function(j, W) {
        var G = j.get(o);
        C += j.alpha() * l[W + 1];
        for (var Y = 0; Y < f.length; Y++)
          if (!isNaN(G[Y]))
            if (v[Y] += l[W + 1], o.charAt(Y) === "h") {
              var dt = G[Y] / 180 * Jr;
              b += Un(dt) * l[W + 1], w += Gn(dt) * l[W + 1];
            } else
              f[Y] += G[Y] * l[W + 1];
      });
      for (var L = 0; L < f.length; L++)
        if (o.charAt(L) === "h") {
          for (var M = wh(w / v[L], b / v[L]) / Jr * 180; M < 0; )
            M += 360;
          for (; M >= 360; )
            M -= 360;
          f[L] = M;
        } else
          f[L] = f[L] / v[L];
      return C /= c, new Yr(f, o).alpha(C > 0.99999 ? 1 : C, !0);
    }, Ch = function(n, o) {
      for (var l = n.length, c = [0, 0, 0, 0], p = 0; p < n.length; p++) {
        var d = n[p], f = o[p] / l, v = d._rgb;
        c[0] += Zr(v[0], 2) * f, c[1] += Zr(v[1], 2) * f, c[2] += Zr(v[2], 2) * f, c[3] += v[3] * f;
      }
      return c[0] = Vr(c[0]), c[1] = Vr(c[1]), c[2] = Vr(c[2]), c[3] > 0.9999999 && (c[3] = 1), new Yr(yh(c));
    }, Mt = lt, ze = k.type, Th = Math.pow, Qr = function(n) {
      var o = "rgb", l = Mt("#ccc"), c = 0, p = [0, 1], d = [], f = [0, 0], v = !1, b = [], w = !1, x = 0, P = 1, C = !1, L = {}, M = !0, j = 1, W = function(T) {
        if (T = T || ["#fff", "#000"], T && ze(T) === "string" && Mt.brewer && Mt.brewer[T.toLowerCase()] && (T = Mt.brewer[T.toLowerCase()]), ze(T) === "array") {
          T.length === 1 && (T = [T[0], T[0]]), T = T.slice(0);
          for (var I = 0; I < T.length; I++)
            T[I] = Mt(T[I]);
          d.length = 0;
          for (var B = 0; B < T.length; B++)
            d.push(B / (T.length - 1));
        }
        return yt(), b = T;
      }, G = function(T) {
        if (v != null) {
          for (var I = v.length - 1, B = 0; B < I && T >= v[B]; )
            B++;
          return B - 1;
        }
        return 0;
      }, Y = function(T) {
        return T;
      }, dt = function(T) {
        return T;
      }, pt = function(T, I) {
        var B, N;
        if (I == null && (I = !1), isNaN(T) || T === null)
          return l;
        if (I)
          N = T;
        else if (v && v.length > 2) {
          var gt = G(T);
          N = gt / (v.length - 2);
        } else
          P !== x ? N = (T - x) / (P - x) : N = 1;
        N = dt(N), I || (N = Y(N)), j !== 1 && (N = Th(N, j)), N = f[0] + N * (1 - f[0] - f[1]), N = Math.min(1, Math.max(0, N));
        var K = Math.floor(N * 1e4);
        if (M && L[K])
          B = L[K];
        else {
          if (ze(b) === "array")
            for (var q = 0; q < d.length; q++) {
              var Z = d[q];
              if (N <= Z) {
                B = b[q];
                break;
              }
              if (N >= Z && q === d.length - 1) {
                B = b[q];
                break;
              }
              if (N > Z && N < d[q + 1]) {
                N = (N - Z) / (d[q + 1] - Z), B = Mt.interpolate(b[q], b[q + 1], N, o);
                break;
              }
            }
          else
            ze(b) === "function" && (B = b(N));
          M && (L[K] = B);
        }
        return B;
      }, yt = function() {
        return L = {};
      };
      W(n);
      var U = function(T) {
        var I = Mt(pt(T));
        return w && I[w] ? I[w]() : I;
      };
      return U.classes = function(T) {
        if (T != null) {
          if (ze(T) === "array")
            v = T, p = [T[0], T[T.length - 1]];
          else {
            var I = Mt.analyze(p);
            T === 0 ? v = [I.min, I.max] : v = Mt.limits(I, "e", T);
          }
          return U;
        }
        return v;
      }, U.domain = function(T) {
        if (!arguments.length)
          return p;
        x = T[0], P = T[T.length - 1], d = [];
        var I = b.length;
        if (T.length === I && x !== P)
          for (var B = 0, N = Array.from(T); B < N.length; B += 1) {
            var gt = N[B];
            d.push((gt - x) / (P - x));
          }
        else {
          for (var K = 0; K < I; K++)
            d.push(K / (I - 1));
          if (T.length > 2) {
            var q = T.map(function(V, J) {
              return J / (T.length - 1);
            }), Z = T.map(function(V) {
              return (V - x) / (P - x);
            });
            Z.every(function(V, J) {
              return q[J] === V;
            }) || (dt = function(V) {
              if (V <= 0 || V >= 1)
                return V;
              for (var J = 0; V >= Z[J + 1]; )
                J++;
              var $t = (V - Z[J]) / (Z[J + 1] - Z[J]), ee = q[J] + $t * (q[J + 1] - q[J]);
              return ee;
            });
          }
        }
        return p = [x, P], U;
      }, U.mode = function(T) {
        return arguments.length ? (o = T, yt(), U) : o;
      }, U.range = function(T, I) {
        return W(T), U;
      }, U.out = function(T) {
        return w = T, U;
      }, U.spread = function(T) {
        return arguments.length ? (c = T, U) : c;
      }, U.correctLightness = function(T) {
        return T == null && (T = !0), C = T, yt(), C ? Y = function(I) {
          for (var B = pt(0, !0).lab()[0], N = pt(1, !0).lab()[0], gt = B > N, K = pt(I, !0).lab()[0], q = B + (N - B) * I, Z = K - q, V = 0, J = 1, $t = 20; Math.abs(Z) > 0.01 && $t-- > 0; )
            (function() {
              return gt && (Z *= -1), Z < 0 ? (V = I, I += (J - I) * 0.5) : (J = I, I += (V - I) * 0.5), K = pt(I, !0).lab()[0], Z = K - q;
            })();
          return I;
        } : Y = function(I) {
          return I;
        }, U;
      }, U.padding = function(T) {
        return T != null ? (ze(T) === "number" && (T = [T, T]), f = T, U) : f;
      }, U.colors = function(T, I) {
        arguments.length < 2 && (I = "hex");
        var B = [];
        if (arguments.length === 0)
          B = b.slice(0);
        else if (T === 1)
          B = [U(0.5)];
        else if (T > 1) {
          var N = p[0], gt = p[1] - N;
          B = Sh(0, T, !1).map(function(J) {
            return U(N + J / (T - 1) * gt);
          });
        } else {
          n = [];
          var K = [];
          if (v && v.length > 2)
            for (var q = 1, Z = v.length, V = 1 <= Z; V ? q < Z : q > Z; V ? q++ : q--)
              K.push((v[q - 1] + v[q]) * 0.5);
          else
            K = p;
          B = K.map(function(J) {
            return U(J);
          });
        }
        return Mt[I] && (B = B.map(function(J) {
          return J[I]();
        })), B;
      }, U.cache = function(T) {
        return T != null ? (M = T, U) : M;
      }, U.gamma = function(T) {
        return T != null ? (j = T, U) : j;
      }, U.nodata = function(T) {
        return T != null ? (l = Mt(T), U) : l;
      }, U;
    };
    function Sh(n, o, l) {
      for (var c = [], p = n < o, d = l ? p ? o + 1 : o - 1 : o, f = n; p ? f < d : f > d; p ? f++ : f--)
        c.push(f);
      return c;
    }
    var Ue = D, kh = Qr, Rh = function(n) {
      for (var o = [1, 1], l = 1; l < n; l++) {
        for (var c = [1], p = 1; p <= o.length; p++)
          c[p] = (o[p] || 0) + o[p - 1];
        o = c;
      }
      return o;
    }, Ph = function(n) {
      var o, l, c, p, d, f, v;
      if (n = n.map(function(C) {
        return new Ue(C);
      }), n.length === 2)
        o = n.map(function(C) {
          return C.lab();
        }), d = o[0], f = o[1], p = function(C) {
          var L = [0, 1, 2].map(function(M) {
            return d[M] + C * (f[M] - d[M]);
          });
          return new Ue(L, "lab");
        };
      else if (n.length === 3)
        l = n.map(function(C) {
          return C.lab();
        }), d = l[0], f = l[1], v = l[2], p = function(C) {
          var L = [0, 1, 2].map(function(M) {
            return (1 - C) * (1 - C) * d[M] + 2 * (1 - C) * C * f[M] + C * C * v[M];
          });
          return new Ue(L, "lab");
        };
      else if (n.length === 4) {
        var b;
        c = n.map(function(C) {
          return C.lab();
        }), d = c[0], f = c[1], v = c[2], b = c[3], p = function(C) {
          var L = [0, 1, 2].map(function(M) {
            return (1 - C) * (1 - C) * (1 - C) * d[M] + 3 * (1 - C) * (1 - C) * C * f[M] + 3 * (1 - C) * C * C * v[M] + C * C * C * b[M];
          });
          return new Ue(L, "lab");
        };
      } else if (n.length >= 5) {
        var w, x, P;
        w = n.map(function(C) {
          return C.lab();
        }), P = n.length - 1, x = Rh(P), p = function(C) {
          var L = 1 - C, M = [0, 1, 2].map(function(j) {
            return w.reduce(function(W, G, Y) {
              return W + x[Y] * Math.pow(L, P - Y) * Math.pow(C, Y) * G[j];
            }, 0);
          });
          return new Ue(M, "lab");
        };
      } else
        throw new RangeError("No point in running bezier with only one color.");
      return p;
    }, Mh = function(n) {
      var o = Ph(n);
      return o.scale = function() {
        return kh(o);
      }, o;
    }, Kr = lt, Lt = function(n, o, l) {
      if (!Lt[l])
        throw new Error("unknown blend mode " + l);
      return Lt[l](n, o);
    }, Kt = function(n) {
      return function(o, l) {
        var c = Kr(l).rgb(), p = Kr(o).rgb();
        return Kr.rgb(n(c, p));
      };
    }, te = function(n) {
      return function(o, l) {
        var c = [];
        return c[0] = n(o[0], l[0]), c[1] = n(o[1], l[1]), c[2] = n(o[2], l[2]), c;
      };
    }, Lh = function(n) {
      return n;
    }, $h = function(n, o) {
      return n * o / 255;
    }, Ah = function(n, o) {
      return n > o ? o : n;
    }, Oh = function(n, o) {
      return n > o ? n : o;
    }, Ih = function(n, o) {
      return 255 * (1 - (1 - n / 255) * (1 - o / 255));
    }, zh = function(n, o) {
      return o < 128 ? 2 * n * o / 255 : 255 * (1 - 2 * (1 - n / 255) * (1 - o / 255));
    }, Eh = function(n, o) {
      return 255 * (1 - (1 - o / 255) / (n / 255));
    }, Fh = function(n, o) {
      return n === 255 ? 255 : (n = 255 * (o / 255) / (1 - n / 255), n > 255 ? 255 : n);
    };
    Lt.normal = Kt(te(Lh)), Lt.multiply = Kt(te($h)), Lt.screen = Kt(te(Ih)), Lt.overlay = Kt(te(zh)), Lt.darken = Kt(te(Ah)), Lt.lighten = Kt(te(Oh)), Lt.dodge = Kt(te(Fh)), Lt.burn = Kt(te(Eh));
    for (var _h = Lt, ts = k.type, Dh = k.clip_rgb, jh = k.TWOPI, Nh = Math.pow, Bh = Math.sin, Wh = Math.cos, qn = lt, Uh = function(n, o, l, c, p) {
      n === void 0 && (n = 300), o === void 0 && (o = -1.5), l === void 0 && (l = 1), c === void 0 && (c = 1), p === void 0 && (p = [0, 1]);
      var d = 0, f;
      ts(p) === "array" ? f = p[1] - p[0] : (f = 0, p = [p, p]);
      var v = function(b) {
        var w = jh * ((n + 120) / 360 + o * b), x = Nh(p[0] + f * b, c), P = d !== 0 ? l[0] + b * d : l, C = P * x * (1 - x) / 2, L = Wh(w), M = Bh(w), j = x + C * (-0.14861 * L + 1.78277 * M), W = x + C * (-0.29227 * L - 0.90649 * M), G = x + C * (1.97294 * L);
        return qn(Dh([j * 255, W * 255, G * 255, 1]));
      };
      return v.start = function(b) {
        return b == null ? n : (n = b, v);
      }, v.rotations = function(b) {
        return b == null ? o : (o = b, v);
      }, v.gamma = function(b) {
        return b == null ? c : (c = b, v);
      }, v.hue = function(b) {
        return b == null ? l : (l = b, ts(l) === "array" ? (d = l[1] - l[0], d === 0 && (l = l[1])) : d = 0, v);
      }, v.lightness = function(b) {
        return b == null ? p : (ts(b) === "array" ? (p = b, f = b[1] - b[0]) : (p = [b, b], f = 0), v);
      }, v.scale = function() {
        return qn.scale(v);
      }, v.hue(l), v;
    }, Gh = D, qh = "0123456789abcdef", Xh = Math.floor, Hh = Math.random, Yh = function() {
      for (var n = "#", o = 0; o < 6; o++)
        n += qh.charAt(Xh(Hh() * 16));
      return new Gh(n, "hex");
    }, es = y, Xn = Math.log, Zh = Math.pow, Vh = Math.floor, Jh = Math.abs, Hn = function(n, o) {
      o === void 0 && (o = null);
      var l = {
        min: Number.MAX_VALUE,
        max: Number.MAX_VALUE * -1,
        sum: 0,
        values: [],
        count: 0
      };
      return es(n) === "object" && (n = Object.values(n)), n.forEach(function(c) {
        o && es(c) === "object" && (c = c[o]), c != null && !isNaN(c) && (l.values.push(c), l.sum += c, c < l.min && (l.min = c), c > l.max && (l.max = c), l.count += 1);
      }), l.domain = [l.min, l.max], l.limits = function(c, p) {
        return Yn(l, c, p);
      }, l;
    }, Yn = function(n, o, l) {
      o === void 0 && (o = "equal"), l === void 0 && (l = 7), es(n) == "array" && (n = Hn(n));
      var c = n.min, p = n.max, d = n.values.sort(function(ss, ns) {
        return ss - ns;
      });
      if (l === 1)
        return [c, p];
      var f = [];
      if (o.substr(0, 1) === "c" && (f.push(c), f.push(p)), o.substr(0, 1) === "e") {
        f.push(c);
        for (var v = 1; v < l; v++)
          f.push(c + v / l * (p - c));
        f.push(p);
      } else if (o.substr(0, 1) === "l") {
        if (c <= 0)
          throw new Error("Logarithmic scales are only possible for values > 0");
        var b = Math.LOG10E * Xn(c), w = Math.LOG10E * Xn(p);
        f.push(c);
        for (var x = 1; x < l; x++)
          f.push(Zh(10, b + x / l * (w - b)));
        f.push(p);
      } else if (o.substr(0, 1) === "q") {
        f.push(c);
        for (var P = 1; P < l; P++) {
          var C = (d.length - 1) * P / l, L = Vh(C);
          if (L === C)
            f.push(d[L]);
          else {
            var M = C - L;
            f.push(d[L] * (1 - M) + d[L + 1] * M);
          }
        }
        f.push(p);
      } else if (o.substr(0, 1) === "k") {
        var j, W = d.length, G = new Array(W), Y = new Array(l), dt = !0, pt = 0, yt = null;
        yt = [], yt.push(c);
        for (var U = 1; U < l; U++)
          yt.push(c + U / l * (p - c));
        for (yt.push(p); dt; ) {
          for (var T = 0; T < l; T++)
            Y[T] = 0;
          for (var I = 0; I < W; I++)
            for (var B = d[I], N = Number.MAX_VALUE, gt = void 0, K = 0; K < l; K++) {
              var q = Jh(yt[K] - B);
              q < N && (N = q, gt = K), Y[gt]++, G[I] = gt;
            }
          for (var Z = new Array(l), V = 0; V < l; V++)
            Z[V] = null;
          for (var J = 0; J < W; J++)
            j = G[J], Z[j] === null ? Z[j] = d[J] : Z[j] += d[J];
          for (var $t = 0; $t < l; $t++)
            Z[$t] *= 1 / Y[$t];
          dt = !1;
          for (var ee = 0; ee < l; ee++)
            if (Z[ee] !== yt[ee]) {
              dt = !0;
              break;
            }
          yt = Z, pt++, pt > 200 && (dt = !1);
        }
        for (var re = {}, Ee = 0; Ee < l; Ee++)
          re[Ee] = [];
        for (var Fe = 0; Fe < W; Fe++)
          j = G[Fe], re[j].push(d[Fe]);
        for (var Ut = [], de = 0; de < l; de++)
          Ut.push(re[de][0]), Ut.push(re[de][re[de].length - 1]);
        Ut = Ut.sort(function(ss, ns) {
          return ss - ns;
        }), f.push(Ut[0]);
        for (var Ge = 1; Ge < Ut.length; Ge += 2) {
          var ge = Ut[Ge];
          !isNaN(ge) && f.indexOf(ge) === -1 && f.push(ge);
        }
      }
      return f;
    }, Zn = { analyze: Hn, limits: Yn }, Vn = D, Qh = function(n, o) {
      n = new Vn(n), o = new Vn(o);
      var l = n.luminance(), c = o.luminance();
      return l > c ? (l + 0.05) / (c + 0.05) : (c + 0.05) / (l + 0.05);
    }, Jn = D, Wt = Math.sqrt, ht = Math.pow, Kh = Math.min, tc = Math.max, Qn = Math.atan2, Kn = Math.abs, ur = Math.cos, ti = Math.sin, ec = Math.exp, ei = Math.PI, rc = function(n, o, l, c, p) {
      l === void 0 && (l = 1), c === void 0 && (c = 1), p === void 0 && (p = 1);
      var d = function(ge) {
        return 360 * ge / (2 * ei);
      }, f = function(ge) {
        return 2 * ei * ge / 360;
      };
      n = new Jn(n), o = new Jn(o);
      var v = Array.from(n.lab()), b = v[0], w = v[1], x = v[2], P = Array.from(o.lab()), C = P[0], L = P[1], M = P[2], j = (b + C) / 2, W = Wt(ht(w, 2) + ht(x, 2)), G = Wt(ht(L, 2) + ht(M, 2)), Y = (W + G) / 2, dt = 0.5 * (1 - Wt(ht(Y, 7) / (ht(Y, 7) + ht(25, 7)))), pt = w * (1 + dt), yt = L * (1 + dt), U = Wt(ht(pt, 2) + ht(x, 2)), T = Wt(ht(yt, 2) + ht(M, 2)), I = (U + T) / 2, B = d(Qn(x, pt)), N = d(Qn(M, yt)), gt = B >= 0 ? B : B + 360, K = N >= 0 ? N : N + 360, q = Kn(gt - K) > 180 ? (gt + K + 360) / 2 : (gt + K) / 2, Z = 1 - 0.17 * ur(f(q - 30)) + 0.24 * ur(f(2 * q)) + 0.32 * ur(f(3 * q + 6)) - 0.2 * ur(f(4 * q - 63)), V = K - gt;
      V = Kn(V) <= 180 ? V : K <= gt ? V + 360 : V - 360, V = 2 * Wt(U * T) * ti(f(V) / 2);
      var J = C - b, $t = T - U, ee = 1 + 0.015 * ht(j - 50, 2) / Wt(20 + ht(j - 50, 2)), re = 1 + 0.045 * I, Ee = 1 + 0.015 * I * Z, Fe = 30 * ec(-ht((q - 275) / 25, 2)), Ut = 2 * Wt(ht(I, 7) / (ht(I, 7) + ht(25, 7))), de = -Ut * ti(2 * f(Fe)), Ge = Wt(ht(J / (l * ee), 2) + ht($t / (c * re), 2) + ht(V / (p * Ee), 2) + de * ($t / (c * re)) * (V / (p * Ee)));
      return tc(0, Kh(100, Ge));
    }, ri = D, sc = function(n, o, l) {
      l === void 0 && (l = "lab"), n = new ri(n), o = new ri(o);
      var c = n.get(l), p = o.get(l), d = 0;
      for (var f in c) {
        var v = (c[f] || 0) - (p[f] || 0);
        d += v * v;
      }
      return Math.sqrt(d);
    }, nc = D, ic = function() {
      for (var n = [], o = arguments.length; o--; )
        n[o] = arguments[o];
      try {
        return new (Function.prototype.bind.apply(nc, [null].concat(n)))(), !0;
      } catch {
        return !1;
      }
    }, si = lt, ni = Qr, ac = {
      cool: function() {
        return ni([si.hsl(180, 1, 0.9), si.hsl(250, 0.7, 0.4)]);
      },
      hot: function() {
        return ni(["#000", "#f00", "#ff0", "#fff"]).mode("rgb");
      }
    }, fr = {
      // sequential
      OrRd: ["#fff7ec", "#fee8c8", "#fdd49e", "#fdbb84", "#fc8d59", "#ef6548", "#d7301f", "#b30000", "#7f0000"],
      PuBu: ["#fff7fb", "#ece7f2", "#d0d1e6", "#a6bddb", "#74a9cf", "#3690c0", "#0570b0", "#045a8d", "#023858"],
      BuPu: ["#f7fcfd", "#e0ecf4", "#bfd3e6", "#9ebcda", "#8c96c6", "#8c6bb1", "#88419d", "#810f7c", "#4d004b"],
      Oranges: ["#fff5eb", "#fee6ce", "#fdd0a2", "#fdae6b", "#fd8d3c", "#f16913", "#d94801", "#a63603", "#7f2704"],
      BuGn: ["#f7fcfd", "#e5f5f9", "#ccece6", "#99d8c9", "#66c2a4", "#41ae76", "#238b45", "#006d2c", "#00441b"],
      YlOrBr: ["#ffffe5", "#fff7bc", "#fee391", "#fec44f", "#fe9929", "#ec7014", "#cc4c02", "#993404", "#662506"],
      YlGn: ["#ffffe5", "#f7fcb9", "#d9f0a3", "#addd8e", "#78c679", "#41ab5d", "#238443", "#006837", "#004529"],
      Reds: ["#fff5f0", "#fee0d2", "#fcbba1", "#fc9272", "#fb6a4a", "#ef3b2c", "#cb181d", "#a50f15", "#67000d"],
      RdPu: ["#fff7f3", "#fde0dd", "#fcc5c0", "#fa9fb5", "#f768a1", "#dd3497", "#ae017e", "#7a0177", "#49006a"],
      Greens: ["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d", "#238b45", "#006d2c", "#00441b"],
      YlGnBu: ["#ffffd9", "#edf8b1", "#c7e9b4", "#7fcdbb", "#41b6c4", "#1d91c0", "#225ea8", "#253494", "#081d58"],
      Purples: ["#fcfbfd", "#efedf5", "#dadaeb", "#bcbddc", "#9e9ac8", "#807dba", "#6a51a3", "#54278f", "#3f007d"],
      GnBu: ["#f7fcf0", "#e0f3db", "#ccebc5", "#a8ddb5", "#7bccc4", "#4eb3d3", "#2b8cbe", "#0868ac", "#084081"],
      Greys: ["#ffffff", "#f0f0f0", "#d9d9d9", "#bdbdbd", "#969696", "#737373", "#525252", "#252525", "#000000"],
      YlOrRd: ["#ffffcc", "#ffeda0", "#fed976", "#feb24c", "#fd8d3c", "#fc4e2a", "#e31a1c", "#bd0026", "#800026"],
      PuRd: ["#f7f4f9", "#e7e1ef", "#d4b9da", "#c994c7", "#df65b0", "#e7298a", "#ce1256", "#980043", "#67001f"],
      Blues: ["#f7fbff", "#deebf7", "#c6dbef", "#9ecae1", "#6baed6", "#4292c6", "#2171b5", "#08519c", "#08306b"],
      PuBuGn: ["#fff7fb", "#ece2f0", "#d0d1e6", "#a6bddb", "#67a9cf", "#3690c0", "#02818a", "#016c59", "#014636"],
      Viridis: ["#440154", "#482777", "#3f4a8a", "#31678e", "#26838f", "#1f9d8a", "#6cce5a", "#b6de2b", "#fee825"],
      // diverging
      Spectral: ["#9e0142", "#d53e4f", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#e6f598", "#abdda4", "#66c2a5", "#3288bd", "#5e4fa2"],
      RdYlGn: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee08b", "#ffffbf", "#d9ef8b", "#a6d96a", "#66bd63", "#1a9850", "#006837"],
      RdBu: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#f7f7f7", "#d1e5f0", "#92c5de", "#4393c3", "#2166ac", "#053061"],
      PiYG: ["#8e0152", "#c51b7d", "#de77ae", "#f1b6da", "#fde0ef", "#f7f7f7", "#e6f5d0", "#b8e186", "#7fbc41", "#4d9221", "#276419"],
      PRGn: ["#40004b", "#762a83", "#9970ab", "#c2a5cf", "#e7d4e8", "#f7f7f7", "#d9f0d3", "#a6dba0", "#5aae61", "#1b7837", "#00441b"],
      RdYlBu: ["#a50026", "#d73027", "#f46d43", "#fdae61", "#fee090", "#ffffbf", "#e0f3f8", "#abd9e9", "#74add1", "#4575b4", "#313695"],
      BrBG: ["#543005", "#8c510a", "#bf812d", "#dfc27d", "#f6e8c3", "#f5f5f5", "#c7eae5", "#80cdc1", "#35978f", "#01665e", "#003c30"],
      RdGy: ["#67001f", "#b2182b", "#d6604d", "#f4a582", "#fddbc7", "#ffffff", "#e0e0e0", "#bababa", "#878787", "#4d4d4d", "#1a1a1a"],
      PuOr: ["#7f3b08", "#b35806", "#e08214", "#fdb863", "#fee0b6", "#f7f7f7", "#d8daeb", "#b2abd2", "#8073ac", "#542788", "#2d004b"],
      // qualitative
      Set2: ["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"],
      Accent: ["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17", "#666666"],
      Set1: ["#e41a1c", "#377eb8", "#4daf4a", "#984ea3", "#ff7f00", "#ffff33", "#a65628", "#f781bf", "#999999"],
      Set3: ["#8dd3c7", "#ffffb3", "#bebada", "#fb8072", "#80b1d3", "#fdb462", "#b3de69", "#fccde5", "#d9d9d9", "#bc80bd", "#ccebc5", "#ffed6f"],
      Dark2: ["#1b9e77", "#d95f02", "#7570b3", "#e7298a", "#66a61e", "#e6ab02", "#a6761d", "#666666"],
      Paired: ["#a6cee3", "#1f78b4", "#b2df8a", "#33a02c", "#fb9a99", "#e31a1c", "#fdbf6f", "#ff7f00", "#cab2d6", "#6a3d9a", "#ffff99", "#b15928"],
      Pastel2: ["#b3e2cd", "#fdcdac", "#cbd5e8", "#f4cae4", "#e6f5c9", "#fff2ae", "#f1e2cc", "#cccccc"],
      Pastel1: ["#fbb4ae", "#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#ffffcc", "#e5d8bd", "#fddaec", "#f2f2f2"]
    }, rs = 0, ii = Object.keys(fr); rs < ii.length; rs += 1) {
      var ai = ii[rs];
      fr[ai.toLowerCase()] = fr[ai];
    }
    var oc = fr, ft = lt;
    ft.average = xh, ft.bezier = Mh, ft.blend = _h, ft.cubehelix = Uh, ft.mix = ft.interpolate = Fn, ft.random = Yh, ft.scale = Qr, ft.analyze = Zn.analyze, ft.contrast = Qh, ft.deltaE = rc, ft.distance = sc, ft.limits = Zn.limits, ft.valid = ic, ft.scales = ac, ft.colors = bn, ft.brewer = oc;
    var lc = ft;
    return lc;
  });
})(Oi);
var et = Oi.exports;
const Yt = (() => (et.Color.symbol = et.Color.prototype.symbol = Symbol.for("@motion-canvas/core/types/Color"), et.Color.lerp = et.Color.prototype.lerp = (s, t, e, r = "lch") => {
  typeof s == "string" && (s = new et.Color(s)), typeof t == "string" && (t = new et.Color(t));
  const i = s instanceof et.Color, a = t instanceof et.Color;
  return i || (s = a ? t.alpha(0) : new et.Color("rgba(0, 0, 0, 0)")), a || (t = i ? s.alpha(0) : new et.Color("rgba(0, 0, 0, 0)")), et.mix(s, t, e, r);
}, et.Color.createLerp = et.Color.prototype.createLerp = (s) => (t, e, r) => et.Color.lerp(t, e, r, s), et.Color.createSignal = (s, t = et.Color.lerp) => new Se(s, t, void 0, (e) => new et.Color(e)).toSignal(), et.Color.prototype.toSymbol = () => et.Color.symbol, et.Color.prototype.toUniform = function(s, t) {
  s.uniform4fv(t, this.gl());
}, et.Color.prototype.serialize = function() {
  return this.css();
}, et.Color.prototype.lerp = function(s, t, e) {
  return et.Color.lerp(this, s, t, e);
}, et.Color))();
function tu(s, t) {
  return g.fromDegrees(s).transform(t).degrees;
}
function ls(s, t) {
  return g.magnitude(t.m11, t.m12) * s;
}
class hs extends Tt {
  constructor() {
    super(...arguments), this.type = Yt.symbol;
  }
  parse(t) {
    return t === null ? null : new Yt(t);
  }
  serialize() {
    var t;
    return ((t = this.value.current) == null ? void 0 : t.serialize()) ?? null;
  }
}
class xe extends Tt {
  constructor(t, e, r = ((i) => (i = e[0]) == null ? void 0 : i.value)()) {
    super(t, r), this.options = e, this.type = xe.symbol;
  }
  set(t) {
    var e;
    super.set((e = this.getOption(t)) == null ? void 0 : e.value);
  }
  parse(t) {
    var e;
    return (e = this.getOption(t)) == null ? void 0 : e.value;
  }
  getOption(t) {
    return this.options.find((e) => e.value === t) ?? this.options[0];
  }
}
xe.symbol = Symbol.for("@motion-canvas/core/meta/EnumMetaField");
class eu extends Tt {
  /**
   * Triggered when the nested fields change.
   *
   * @eventProperty
   */
  get onFieldsChanged() {
    return this.fields.subscribable;
  }
  get options() {
    return this.optionFields[this.current];
  }
  constructor(t, e, r = 0) {
    var u, m;
    const i = e.plugins.flatMap((y) => {
      var S;
      return ((S = y.exporters) == null ? void 0 : S.call(y, e)) ?? [];
    }), a = i.map((y) => y.meta(e)), h = new xe("exporter", i.map((y) => ({
      value: y.id,
      text: y.displayName
    })), (u = i[r]) == null ? void 0 : u.id);
    super(t, {
      name: h.get(),
      options: (m = a[r]) == null ? void 0 : m.get()
    }), this.current = r, this.type = Object, this.handleChange = () => {
      var F, X, tt;
      const y = this.exporterField.get(), S = Math.max(this.exporters.findIndex((at) => at.id === y), 0);
      this.current !== S && ((F = this.options) == null || F.onChanged.unsubscribe(this.handleChange), this.current = S, (X = this.options) == null || X.onChanged.subscribe(this.handleChange, !1), this.fields.current = this.options ? [this.exporterField, this.options] : [this.exporterField]), this.value.current = {
        name: this.exporterField.get(),
        options: ((tt = this.options) == null ? void 0 : tt.get()) ?? null
      };
    }, this.exporters = i, this.exporterField = h, this.exporterField.onChanged.subscribe(this.handleChange, !1), this.exporterField.disable(a.length < 2).space(), this.optionFields = a, this.fields = new Ce([this.exporterField]), this.options && (this.options.onChanged.subscribe(this.handleChange, !1), this.fields.current = [this.exporterField, this.options]);
  }
  set(t) {
    var e;
    this.exporterField.set(t.name), (e = this.options) == null || e.set(t.options ?? {});
  }
  serialize() {
    var t;
    return {
      name: this.exporterField.serialize(),
      options: ((t = this.options) == null ? void 0 : t.serialize()) ?? null
    };
  }
  clone() {
    return new this.constructor(this.name, this.exporters, this.current);
  }
}
var qe;
class ys {
  constructor(t, e = !1) {
    this.name = t, this.source = e, this.lock = new fc(), this.ignoreChange = !1, this.cache = null, this.metaField = null, this.handleChanged = async () => {
    };
  }
  attach(t) {
    var e;
    this.metaField || (this.metaField = t, this.cache && this.metaField.set(this.cache), (e = this.metaField) == null || e.onChanged.subscribe(this.handleChanged));
  }
  async saveData(t) {
    if (this.source === !1)
      return;
    if (!this.source)
      throw new Error(`The meta file for ${this.name} is missing.`);
    if (qe.sourceLookup[this.source])
      throw new Error(`Metadata for ${this.name} is already being updated`);
    const e = this.source;
    await new Promise((r, i) => {
      setTimeout(() => {
        delete qe.sourceLookup[e], i(`Connection timeout when updating metadata for ${this.name}`);
      }, 1e3), qe.sourceLookup[e] = () => {
        delete qe.sourceLookup[e], r();
      }, (void 0).send("motion-canvas:meta", {
        source: e,
        data: t
      });
    });
  }
  /**
   * Load new metadata from a file.
   *
   * @remarks
   * This method is called during hot module replacement.
   *
   * @param data - New metadata.
   */
  loadData(t) {
    var e;
    this.ignoreChange = !0, this.cache = t, (e = this.metaField) == null || e.set(t), this.ignoreChange = !1;
  }
}
qe = ys;
ys.sourceLookup = {};
class as extends Tt {
  constructor() {
    super(...arguments), this.type = Number, this.presets = [];
  }
  parse(t) {
    let e = parseFloat(t);
    return this.min !== void 0 && e < this.min && (e = this.min), this.max !== void 0 && e > this.max && (e = this.max), e;
  }
  getPresets() {
    return this.presets;
  }
  setPresets(t) {
    return this.presets = t, this;
  }
  setRange(t, e) {
    return this.min = t, this.max = e, this;
  }
  getMin() {
    return this.min ?? -1 / 0;
  }
  getMax() {
    return this.max ?? 1 / 0;
  }
}
class Rr extends Tt {
  constructor() {
    super(...arguments), this.type = Rr.symbol;
  }
  parse(t) {
    return this.parseRange(1 / 0, t[0], t[1] ?? 1 / 0);
  }
  /**
   * Convert the given range from frames to seconds and update this field.
   *
   * @remarks
   * This helper method applies additional validation to the range, preventing
   * it from overflowing the timeline.
   *
   * @param startFrame - The beginning of the range.
   * @param endFrame - The end of the range.
   * @param duration - The current duration in frames.
   * @param fps - The current framerate.
   */
  update(t, e, r, i) {
    this.value.current = this.parseRange(r / i - Xe, t / i - Xe, e / i - Xe);
  }
  parseRange(t, e = this.value.current[0], r = this.value.current[1]) {
    return e = wt(0, t, e), r = wt(0, t, r ?? 1 / 0), e > r && ([e, r] = [r, e]), r >= t && (r = 1 / 0), [e, r];
  }
}
Rr.symbol = Symbol.for("@motion-canvas/core/meta/RangeMetaField");
class Ii extends Tt {
  constructor() {
    super(...arguments), this.type = g.symbol;
  }
  parse(t) {
    return new g(t);
  }
  serialize() {
    return this.value.current.serialize();
  }
}
function ru(s) {
  var t;
  return !!((t = s.prototype) != null && t.isClass);
}
const su = Symbol.for("@motion-canvas/2d/fragment");
function Mu(s, t, e) {
  const { ref: r, children: i, ...a } = t, h = Array.isArray(i) ? i.flat() : i;
  if (s === su)
    return h;
  if (ru(s)) {
    const u = new s({ ...a, children: h, key: e });
    return r == null || r(u), u;
  } else
    return s({ ...a, ref: r, children: h, key: e });
}
const mi = {
  invert: {
    name: "invert"
  },
  sepia: {
    name: "sepia"
  },
  grayscale: {
    name: "grayscale"
  },
  brightness: {
    name: "brightness",
    default: 1
  },
  contrast: {
    name: "contrast",
    default: 1
  },
  saturate: {
    name: "saturate",
    default: 1
  },
  hue: {
    name: "hue-rotate",
    unit: "deg",
    scale: 1
  },
  blur: {
    name: "blur",
    transform: !0,
    unit: "px",
    scale: 1
  }
};
class nu {
  get name() {
    return this.props.name;
  }
  get default() {
    return this.props.default;
  }
  constructor(t) {
    this.props = {
      name: "invert",
      default: 0,
      unit: "%",
      scale: 100,
      transform: !1,
      ...t,
      value: t.value ?? t.default ?? 0
    }, this.value = Ne(this.props.value, Q, this);
  }
  isActive() {
    return this.value() !== this.props.default;
  }
  serialize(t) {
    let e = this.value();
    return this.props.transform && (e = ls(e, t)), `${this.props.name}(${e * this.props.scale}${this.props.unit})`;
  }
}
const Gt = Symbol.for("@motion-canvas/2d/decorators/initializers");
function Ve(s, t) {
  if (!s[Gt])
    s[Gt] = [];
  else if (
    // if one of the prototypes has initializers
    s[Gt] && // and it's not the target object itself
    !Object.prototype.hasOwnProperty.call(s, Gt)
  ) {
    const e = Object.getPrototypeOf(s);
    s[Gt] = [...e[Gt]];
  }
  s[Gt].push(t);
}
function iu(s, t) {
  if (s[Gt])
    try {
      s[Gt].forEach((e) => e(s, t));
    } catch (e) {
      throw e.inspect ?? (e.inspect = s.key), e;
    }
}
function z() {
  return (s, t) => {
    Ve(s, (e) => {
      const r = Object.getPrototypeOf(e)[t];
      e[t] = Jc(r.bind(e), e);
    });
  };
}
function cs(s = {}, t, e) {
  const r = {};
  if (e && t) {
    const i = s.setter ?? (t == null ? void 0 : t[`set${be(e)}`]);
    i && (r.setter = i.bind(t));
    const a = s.getter ?? (t == null ? void 0 : t[`get${be(e)}`]);
    a && (r.getter = a.bind(t));
    const h = s.tweener ?? (t == null ? void 0 : t[`tween${be(e)}`]);
    h && (r.tweener = h.bind(t));
  }
  return r;
}
const qt = Symbol.for("@motion-canvas/2d/decorators/properties");
function ke(s, t) {
  var e;
  return ((e = s[qt]) == null ? void 0 : e[t]) ?? null;
}
function ws(s, t) {
  let e;
  return s[qt] ? s[qt] && !Object.prototype.hasOwnProperty.call(s, qt) ? s[qt] = e = Object.fromEntries(Object.entries(s[qt]).map(([r, i]) => [r, { ...i }])) : e = s[qt] : s[qt] = e = {}, e[t] ?? (e[t] = {
    cloneable: !0,
    inspectable: !0,
    compoundEntries: []
  }), e[t];
}
function zi(s) {
  return s && typeof s == "object" ? s[qt] ?? {} : {};
}
function xs(s, t) {
  iu(s);
  for (const [e, r] of Object.entries(zi(s))) {
    const i = s[e];
    if (i.reset(), t[e] !== void 0 && i(t[e]), r.compoundEntries !== void 0)
      for (const [a, h] of r.compoundEntries)
        h in t && i[a](t[h]);
  }
}
function R() {
  return (s, t) => {
    const e = ws(s, t);
    Ve(s, (r) => {
      var u;
      let i = e.default;
      const a = r[`getDefault${be(t)}`];
      a && (i = () => a.call(r, e.default));
      const h = new Se(i, e.interpolationFunction ?? je, r, (u = e.parser) == null ? void 0 : u.bind(r), cs(e, r, t));
      r[t] = h.toSignal();
    });
  };
}
function A(s) {
  return (t, e) => {
    const r = ke(t, e);
    if (!r) {
      ut().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.default = s;
  };
}
function Cs(s) {
  return (t, e) => {
    const r = ke(t, e);
    if (!r) {
      ut().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.interpolationFunction = s;
  };
}
function Ts(s) {
  return (t, e) => {
    const r = ke(t, e);
    if (!r) {
      ut().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.parser = s;
  };
}
function Je(s) {
  return (t, e) => {
    const r = ke(t, e);
    if (!r) {
      ut().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.parser = (i) => new s(i), "lerp" in s && (r.interpolationFunction ?? (r.interpolationFunction = s.lerp));
  };
}
function Re(s = !0) {
  return (t, e) => {
    const r = ke(t, e);
    if (!r) {
      ut().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.cloneable = s;
  };
}
function Ei(s = !0) {
  return (t, e) => {
    const r = ke(t, e);
    if (!r) {
      ut().error(`Missing property decorator for "${e.toString()}"`);
      return;
    }
    r.inspectable = s;
  };
}
function Fi(s, t = kr) {
  return (e, r) => {
    const i = ws(e, r);
    i.compound = !0, i.compoundEntries = Object.entries(s), Ve(e, (a) => {
      if (!i.parser) {
        ut().error(`Missing parser decorator for "${r.toString()}"`);
        return;
      }
      const h = i.default, u = i.parser.bind(a), m = new t(i.compoundEntries.map(([y, S]) => {
        const F = new Se(we(h, (X) => u(X)[y]), Q, a, void 0, cs(void 0, a, S)).toSignal();
        return [y, F];
      }), u, h, i.interpolationFunction ?? je, a, cs(i, a, r));
      a[r] = m.toSignal();
    });
  };
}
function Vt(s) {
  return (t, e) => {
    Fi(typeof s == "object" ? s : {
      x: s ? `${s}X` : "x",
      y: s ? `${s}Y` : "y"
    }, Ai)(t, e), Je(g)(t, e);
  };
}
var he = globalThis && globalThis.__decorate || function(s, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
    a = Reflect.decorate(s, t, e, r);
  else
    for (var u = s.length - 1; u >= 0; u--)
      (h = s[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
class Bt {
  constructor(t) {
    xs(this, t);
  }
  canvasGradient(t) {
    let e;
    switch (this.type()) {
      case "linear":
        e = t.createLinearGradient(this.from.x(), this.from.y(), this.to.x(), this.to.y());
        break;
      case "conic":
        e = t.createConicGradient(this.angle(), this.from.x(), this.from.y());
        break;
      case "radial":
        e = t.createRadialGradient(this.from.x(), this.from.y(), this.fromRadius(), this.to.x(), this.to.y(), this.toRadius());
        break;
    }
    for (const { offset: r, color: i } of this.stops())
      e.addColorStop(Te(r), new Yt(Te(i)).serialize());
    return e;
  }
}
he([
  A("linear"),
  R()
], Bt.prototype, "type", void 0);
he([
  Vt("from")
], Bt.prototype, "from", void 0);
he([
  Vt("to")
], Bt.prototype, "to", void 0);
he([
  A(0),
  R()
], Bt.prototype, "angle", void 0);
he([
  A(0),
  R()
], Bt.prototype, "fromRadius", void 0);
he([
  A(0),
  R()
], Bt.prototype, "toRadius", void 0);
he([
  A([]),
  R()
], Bt.prototype, "stops", void 0);
he([
  z()
], Bt.prototype, "canvasGradient", null);
var Ss = globalThis && globalThis.__decorate || function(s, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
    a = Reflect.decorate(s, t, e, r);
  else
    for (var u = s.length - 1; u >= 0; u--)
      (h = s[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
class Qe {
  constructor(t) {
    xs(this, t);
  }
  canvasPattern(t) {
    return t.createPattern(this.image(), this.repetition());
  }
}
Ss([
  R()
], Qe.prototype, "image", void 0);
Ss([
  A(null),
  R()
], Qe.prototype, "repetition", void 0);
Ss([
  z()
], Qe.prototype, "canvasPattern", null);
function au(s) {
  return s === null ? null : s instanceof Bt || s instanceof Qe ? s : new Yt(s);
}
function us(s, t) {
  return s === null ? "" : s instanceof Yt ? s.serialize() : s instanceof Bt ? s.canvasGradient(t) : s instanceof Qe ? s.canvasPattern(t) ?? "" : "";
}
function bi(s, t, e, r, i) {
  if (e.top === 0 && e.right === 0 && e.bottom === 0 && e.left === 0) {
    ou(s, t);
    return;
  }
  const a = ne(e.top, e.right, e.left, t), h = ne(e.right, e.top, e.bottom, t), u = ne(e.bottom, e.left, e.right, t), m = ne(e.left, e.bottom, e.top, t);
  if (r) {
    const y = (S) => {
      const F = S * i;
      return S - F;
    };
    s.moveTo(t.left + a, t.top), s.lineTo(t.right - h, t.top), s.bezierCurveTo(t.right - y(h), t.top, t.right, t.top + y(h), t.right, t.top + h), s.lineTo(t.right, t.bottom - u), s.bezierCurveTo(t.right, t.bottom - y(u), t.right - y(u), t.bottom, t.right - u, t.bottom), s.lineTo(t.left + m, t.bottom), s.bezierCurveTo(t.left + y(m), t.bottom, t.left, t.bottom - y(m), t.left, t.bottom - m), s.lineTo(t.left, t.top + a), s.bezierCurveTo(t.left, t.top + y(a), t.left + y(a), t.top, t.left + a, t.top);
    return;
  }
  s.moveTo(t.left + a, t.top), s.arcTo(t.right, t.top, t.right, t.bottom, h), s.arcTo(t.right, t.bottom, t.left, t.bottom, u), s.arcTo(t.left, t.bottom, t.left, t.top, m), s.arcTo(t.left, t.top, t.right, t.top, a);
}
function ne(s, t, e, r) {
  const i = s + t > r.width ? r.width * (s / (s + t)) : s, a = s + e > r.height ? r.height * (s / (s + e)) : s;
  return Math.min(i, a);
}
function ou(s, t) {
  s.rect(t.x, t.y, t.width, t.height);
}
function lu(s, t, e, r) {
  r ? s.drawImage(t, e.x, e.y, e.width, e.height, r.x, r.y, r.width, r.height) : s.drawImage(t, e.x, e.y, e.width, e.height);
}
function Pr(s, t) {
  s.moveTo(t.x, t.y);
}
function Xt(s, t) {
  s.lineTo(t.x, t.y);
}
function me(s, t) {
  if (!(t.length < 2)) {
    Pr(s, t[0]);
    for (const e of t.slice(1))
      Xt(s, e);
  }
}
function hu(s, t, e = 8) {
  Xt(s, t.addY(-e)), Xt(s, t.addY(e)), Xt(s, t), Xt(s, t.addX(-e)), cu(s, t, e);
}
function cu(s, t, e, r = 0, i = Math.PI * 2, a = !1) {
  s.arc(t.x, t.y, e, r, i, a);
}
function uu(s, t, e, r) {
  s.bezierCurveTo(t.x, t.y, e.x, e.y, r.x, r.y);
}
function ks(s) {
  return (t) => t instanceof s;
}
function _i() {
  return (s, t) => {
    R()(s, t), Ts(au)(s, t), Cs(Yt.lerp)(s, t), A(null)(s, t);
  };
}
function fu() {
  return (s, t) => {
    R()(s, t), Je(Yt)(s, t);
  };
}
function ce(s, t = (e) => e) {
  return (e, r) => {
    e[`getDefault${be(r)}`] = function() {
      this.requestLayoutUpdate();
      const i = this.element.style[s];
      this.element.style[s] = "";
      const a = t.call(this, this.styles.getPropertyValue(s));
      return this.element.style[s] = i, a;
    };
  };
}
class pu extends Se {
  constructor(t, e) {
    super(t, je, e);
    for (const r in mi) {
      const i = mi[r];
      Object.defineProperty(this.invokable, r, {
        value: (a, h, u = Ft) => {
          var y, S, F;
          if (a === void 0)
            return ((S = (y = this.get()) == null ? void 0 : y.find((X) => X.name === i.name)) == null ? void 0 : S.value()) ?? i.default ?? 0;
          let m = (F = this.get()) == null ? void 0 : F.find((X) => X.name === i.name);
          return m || (m = new nu(i), this.set([...this.get(), m])), h === void 0 ? (m.value(a), this.owner) : m.value(a, h, u);
        }
      });
    }
  }
  *tweener(t, e, r) {
    const i = this.get(), a = Te(t);
    if (gu(i, a)) {
      yield* ye(...i.map((m, y) => m.value(a[y].value(), e, r))), this.set(a);
      return;
    }
    for (const m of a)
      m.value(m.default);
    const h = a.map((m) => m.value.context.raw()), u = i.length > 0 && a.length > 0 ? e / 2 : e;
    i.length > 0 && (yield* ye(...i.map((m) => m.value(m.default, u, r)))), this.set(a), a.length > 0 && (yield* ye(...a.map((m, y) => m.value(h[y], u, r))));
  }
}
function du() {
  return (s, t) => {
    const e = ws(s, t);
    Ve(s, (r) => {
      r[t] = new pu(e.default ?? [], r).toSignal();
    });
  };
}
function gu(s, t) {
  if (s.length !== t.length)
    return !1;
  for (let e = 0; e < s.length; e++)
    if (s[e].name !== t[e].name)
      return !1;
  return !0;
}
const vu = Symbol.for("@motion-canvas/2d/nodeName");
function Jt(s) {
  return function(t) {
    t.prototype[vu] = s;
  };
}
function yi(s, t) {
  const e = wt(0, s.arcLength, t);
  let r = 0;
  for (const i of s.segments) {
    const a = r;
    if (r += i.arcLength, r >= e) {
      const h = (e - a) / i.arcLength;
      return i.getPoint(wt(0, 1, h));
    }
  }
  return { position: g.zero, tangent: g.up, normal: g.up };
}
function Mr(s) {
  return (t, e) => {
    Fi({
      top: s ? `${s}Top` : "top",
      right: s ? `${s}Right` : "right",
      bottom: s ? `${s}Bottom` : "bottom",
      left: s ? `${s}Left` : "left"
    })(t, e), Je(Ot)(t, e);
  };
}
function mu(s) {
  let t;
  return s ? typeof s == "string" ? t = [{ fragment: s }] : Array.isArray(s) ? t = s.map((e) => typeof e == "string" ? { fragment: e } : e) : t = [s] : t = [], !gs().experimentalFeatures && t.length > 0 && (t = [], ut().log({
    ...wc("Node uses experimental shaders."),
    inspect: this.key
  })), t;
}
function vr() {
  return gs();
}
var _ = globalThis && globalThis.__decorate || function(s, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
    a = Reflect.decorate(s, t, e, r);
  else
    for (var u = s.length - 1; u >= 0; u--)
      (h = s[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, mr;
let E = mr = class {
  get x() {
    return this.position.x;
  }
  get y() {
    return this.position.y;
  }
  getAbsolutePosition() {
    return new g(this.parentToWorld().transformPoint(this.position()));
  }
  setAbsolutePosition(t) {
    this.position(we(t, (e) => new g(e).transformAsPoint(this.worldToParent())));
  }
  getAbsoluteRotation() {
    const t = this.localToWorld();
    return g.degrees(t.m11, t.m12);
  }
  setAbsoluteRotation(t) {
    this.rotation(we(t, (e) => tu(e, this.worldToParent())));
  }
  getAbsoluteScale() {
    const t = this.localToWorld();
    return new g(g.magnitude(t.m11, t.m12), g.magnitude(t.m21, t.m22));
  }
  setAbsoluteScale(t) {
    this.scale(we(t, (e) => this.getRelativeScale(new g(e))));
  }
  getRelativeScale(t) {
    var r;
    const e = ((r = this.parent()) == null ? void 0 : r.absoluteScale()) ?? g.one;
    return t.div(e);
  }
  *tweenCompositeOperation(t, e, r) {
    const i = Te(t);
    i === "source-over" ? (yield* this.compositeOverride(1, e, r), this.compositeOverride(0), this.compositeOperation(i)) : (this.compositeOperation(i), this.compositeOverride(1), yield* this.compositeOverride(0, e, r));
  }
  absoluteOpacity() {
    var t;
    return (((t = this.parent()) == null ? void 0 : t.absoluteOpacity()) ?? 1) * this.opacity();
  }
  hasFilters() {
    return !!this.filters().find((t) => t.isActive());
  }
  hasShadow() {
    return !!this.shadowColor() && (this.shadowBlur() > 0 || this.shadowOffset.x() !== 0 || this.shadowOffset.y() !== 0);
  }
  filterString() {
    let t = "";
    const e = this.compositeToWorld();
    for (const r of this.filters())
      r.isActive() && (t += " " + r.serialize(e));
    return t;
  }
  getSpawner() {
    return this.children();
  }
  setSpawner(t) {
    this.children(t);
  }
  setChildren(t) {
    if (this.children.context.raw() !== t) {
      if (this.children.context.setter(t), !Ht(t))
        this.spawnChildren(!1, t);
      else if (!this.hasSpawnedChildren)
        for (const e of this.realChildren)
          e.parent(null);
    }
  }
  getChildren() {
    return this.children.context.getter(), this.spawnedChildren();
  }
  spawnedChildren() {
    const t = this.children.context.getter();
    return Ht(this.children.context.raw()) && this.spawnChildren(!0, t), this.realChildren;
  }
  sortedChildren() {
    return [...this.children()].sort((t, e) => Math.sign(t.zIndex() - e.zIndex()));
  }
  constructor({ children: t, spawner: e, key: r, ...i }) {
    this.compositeOverride = Ne(0), this.stateStack = [], this.realChildren = [], this.hasSpawnedChildren = !1, this.parent = Ne(null), this.properties = zi(this);
    const a = vr();
    [this.key, this.unregister] = a.registerNode(this, r), this.view2D = a.getView(), this.creationStack = new Error().stack, xs(this, i), e && ut().warn({
      message: "Node.spawner() has been deprecated.",
      remarks: "Use <code>Node.children()</code> instead.",
      inspect: this.key,
      stack: new Error().stack
    }), this.children(e ?? t);
  }
  /**
   * Get the local-to-world matrix for this node.
   *
   * @remarks
   * This matrix transforms vectors from local space of this node to world
   * space.
   *
   * @example
   * Calculate the absolute position of a point located 200 pixels to the right
   * of the node:
   * ```ts
   * const local = new Vector2(0, 200);
   * const world = local.transformAsPoint(node.localToWorld());
   * ```
   */
  localToWorld() {
    const t = this.parent();
    return t ? t.localToWorld().multiply(this.localToParent()) : this.localToParent();
  }
  /**
   * Get the world-to-local matrix for this node.
   *
   * @remarks
   * This matrix transforms vectors from world space to local space of this
   * node.
   *
   * @example
   * Calculate the position relative to this node for a point located in the
   * top-left corner of the screen:
   * ```ts
   * const world = new Vector2(0, 0);
   * const local = world.transformAsPoint(node.worldToLocal());
   * ```
   */
  worldToLocal() {
    return this.localToWorld().inverse();
  }
  /**
   * Get the world-to-parent matrix for this node.
   *
   * @remarks
   * This matrix transforms vectors from world space to local space of this
   * node's parent.
   */
  worldToParent() {
    var t;
    return ((t = this.parent()) == null ? void 0 : t.worldToLocal()) ?? new DOMMatrix();
  }
  /**
   * Get the parent-to-world matrix for this node.
   *
   * @remarks
   * This matrix transforms vectors from local space of this node's parent to
   * world space.
   */
  parentToWorld() {
    var t;
    return ((t = this.parent()) == null ? void 0 : t.localToWorld()) ?? new DOMMatrix();
  }
  /**
   * Get the local-to-parent matrix for this node.
   *
   * @remarks
   * This matrix transforms vectors from local space of this node to local space
   * of this node's parent.
   */
  localToParent() {
    const t = new DOMMatrix();
    return t.translateSelf(this.x(), this.y()), t.rotateSelf(0, 0, this.rotation()), t.scaleSelf(this.scale.x(), this.scale.y()), t.skewXSelf(this.skew.x()), t.skewYSelf(this.skew.y()), t;
  }
  /**
   * A matrix mapping composite space to world space.
   *
   * @remarks
   * Certain effects such as blur and shadows ignore the current transformation.
   * This matrix can be used to transform their parameters so that the effect
   * appears relative to the closest composite root.
   */
  compositeToWorld() {
    var t;
    return ((t = this.compositeRoot()) == null ? void 0 : t.localToWorld()) ?? new DOMMatrix();
  }
  compositeRoot() {
    var t;
    return this.composite() ? this : ((t = this.parent()) == null ? void 0 : t.compositeRoot()) ?? null;
  }
  compositeToLocal() {
    const t = this.compositeRoot();
    if (t) {
      const e = this.worldToLocal();
      return e.m44 = 1, t.localToWorld().multiply(e);
    }
    return new DOMMatrix();
  }
  view() {
    return this.view2D;
  }
  /**
   * Add the given node(s) as the children of this node.
   *
   * @remarks
   * The nodes will be appended at the end of the children list.
   *
   * @example
   * ```tsx
   * const node = <Layout />;
   * node.add(<Rect />);
   * node.add(<Circle />);
   * ```
   * Result:
   * ```mermaid
   * graph TD;
   *   layout([Layout])
   *   circle([Circle])
   *   rect([Rect])
   *     layout-->rect;
   *     layout-->circle;
   * ```
   *
   * @param node - A node or an array of nodes to append.
   */
  add(t) {
    return this.insert(t, 1 / 0);
  }
  /**
   * Insert the given node(s) at the specified index in the children list.
   *
   * @example
   * ```tsx
   * const node = (
   *   <Layout>
   *     <Rect />
   *     <Circle />
   *   </Layout>
   * );
   *
   * node.insert(<Txt />, 1);
   * ```
   *
   * Result:
   * ```mermaid
   * graph TD;
   *   layout([Layout])
   *   circle([Circle])
   *   text([Text])
   *   rect([Rect])
   *     layout-->rect;
   *     layout-->text;
   *     layout-->circle;
   * ```
   *
   * @param node - A node or an array of nodes to insert.
   * @param index - An index at which to insert the node(s).
   */
  insert(t, e = 0) {
    const r = Array.isArray(t) ? t : [t];
    if (r.length === 0)
      return this;
    const i = this.children(), a = i.slice(0, e);
    for (const h of r)
      h instanceof mr && (a.push(h), h.remove(), h.parent(this));
    return a.push(...i.slice(e)), this.setParsedChildren(a), this;
  }
  /**
   * Remove this node from the tree.
   */
  remove() {
    const t = this.parent();
    return t === null ? this : (t.removeChild(this), this.parent(null), this);
  }
  /**
   * Rearrange this node in relation to its siblings.
   *
   * @remarks
   * Children are rendered starting from the beginning of the children list.
   * We can change the rendering order by rearranging said list.
   *
   * A positive `by` arguments move the node up (it will be rendered on top of
   * the elements it has passed). Negative values move it down.
   *
   * @param by - Number of places by which the node should be moved.
   */
  move(t = 1) {
    const e = this.parent();
    if (t === 0 || !e)
      return this;
    const r = e.children(), i = [];
    if (t > 0)
      for (let a = 0; a < r.length; a++) {
        const h = r[a];
        if (h === this) {
          const u = a + t;
          for (; a < u && a + 1 < r.length; a++)
            i[a] = r[a + 1];
        }
        i[a] = h;
      }
    else
      for (let a = r.length - 1; a >= 0; a--) {
        const h = r[a];
        if (h === this) {
          const u = a + t;
          for (; a > u && a > 0; a--)
            i[a] = r[a - 1];
        }
        i[a] = h;
      }
    return e.setParsedChildren(i), this;
  }
  /**
   * Move the node up in relation to its siblings.
   *
   * @remarks
   * The node will exchange places with the sibling right above it (if any) and
   * from then on will be rendered on top of it.
   */
  moveUp() {
    return this.move(1);
  }
  /**
   * Move the node down in relation to its siblings.
   *
   * @remarks
   * The node will exchange places with the sibling right below it (if any) and
   * from then on will be rendered under it.
   */
  moveDown() {
    return this.move(-1);
  }
  /**
   * Move the node to the top in relation to its siblings.
   *
   * @remarks
   * The node will be placed at the end of the children list and from then on
   * will be rendered on top of all of its siblings.
   */
  moveToTop() {
    return this.move(1 / 0);
  }
  /**
   * Move the node to the bottom in relation to its siblings.
   *
   * @remarks
   * The node will be placed at the beginning of the children list and from then
   * on will be rendered below all of its siblings.
   */
  moveToBottom() {
    return this.move(-1 / 0);
  }
  /**
   * Move the node to the provided position relative to its siblings.
   *
   * @remarks
   * If the node is getting moved to a lower position, it will be placed below
   * the sibling that's currently at the provided index (if any).
   * If the node is getting moved to a higher position, it will be placed above
   * the sibling that's currently at the provided index (if any).
   *
   * @param index - The index to move the node to.
   */
  moveTo(t) {
    const e = this.parent();
    if (!e)
      return this;
    const r = e.children().indexOf(this), i = t - r;
    return this.move(i);
  }
  /**
   * Move the node below the provided node in the parent's layout.
   *
   * @remarks
   * The node will be moved below the provided node and from then on will be
   * rendered below it. By default, if the node is already positioned lower than
   * the sibling node, it will not get moved.
   *
   * @param node - The sibling node below which to move.
   * @param directlyBelow - Whether the node should be positioned directly below
   *                        the sibling. When true, will move the node even if
   *                        it is already positioned below the sibling.
   */
  moveBelow(t, e = !1) {
    const r = this.parent();
    if (!r)
      return this;
    if (t.parent() !== r)
      return ut().error("Cannot position nodes relative to each other if they don't belong to the same parent."), this;
    const i = r.children(), a = i.indexOf(this), h = i.indexOf(t);
    if (!e && a < h)
      return this;
    const u = h - a - 1;
    return this.move(u);
  }
  /**
   * Move the node above the provided node in the parent's layout.
   *
   * @remarks
   * The node will be moved above the provided node and from then on will be
   * rendered on top of it. By default, if the node is already positioned
   * higher than the sibling node, it will not get moved.
   *
   * @param node - The sibling node below which to move.
   * @param directlyAbove - Whether the node should be positioned directly above the
   *                        sibling. When true, will move the node even if it is
   *                        already positioned above the sibling.
   */
  moveAbove(t, e = !1) {
    const r = this.parent();
    if (!r)
      return this;
    if (t.parent() !== r)
      return ut().error("Cannot position nodes relative to each other if they don't belong to the same parent."), this;
    const i = r.children(), a = i.indexOf(this), h = i.indexOf(t);
    if (!e && a > h)
      return this;
    const u = h - a + 1;
    return this.move(u);
  }
  /**
   * Change the parent of this node while keeping the absolute transform.
   *
   * @remarks
   * After performing this operation, the node will stay in the same place
   * visually, but its parent will be changed.
   *
   * @param newParent - The new parent of this node.
   */
  reparent(t) {
    const e = this.absolutePosition(), r = this.absoluteRotation(), i = this.absoluteScale();
    return t.add(this), this.absolutePosition(e), this.absoluteRotation(r), this.absoluteScale(i), this;
  }
  /**
   * Remove all children of this node.
   */
  removeChildren() {
    for (const t of this.realChildren)
      t.parent(null);
    return this.setParsedChildren([]), this;
  }
  /**
   * Get the current children of this node.
   *
   * @remarks
   * Unlike {@link children}, this method does not have any side effects.
   * It does not register the `children` signal as a dependency, and it does not
   * spawn any children. It can be used to safely retrieve the current state of
   * the scene graph for debugging purposes.
   */
  peekChildren() {
    return this.realChildren;
  }
  findAll(t) {
    const e = [], r = this.reversedChildren();
    for (; r.length > 0; ) {
      const i = r.pop();
      t(i) && e.push(i);
      const a = i.children();
      for (let h = a.length - 1; h >= 0; h--)
        r.push(a[h]);
    }
    return e;
  }
  findFirst(t) {
    const e = this.reversedChildren();
    for (; e.length > 0; ) {
      const r = e.pop();
      if (t(r))
        return r;
      const i = r.children();
      for (let a = i.length - 1; a >= 0; a--)
        e.push(i[a]);
    }
    return null;
  }
  findLast(t) {
    const e = [], r = this.reversedChildren();
    for (; r.length > 0; ) {
      const i = r.pop();
      e.push(i);
      const a = i.children();
      for (let h = a.length - 1; h >= 0; h--)
        r.push(a[h]);
    }
    for (; e.length > 0; ) {
      const i = e.pop();
      if (t(i))
        return i;
    }
    return null;
  }
  findAncestor(t) {
    let e = this.parent();
    for (; e; ) {
      if (t(e))
        return e;
      e = e.parent();
    }
    return null;
  }
  /**
   * Get the nth children cast to the specified type.
   *
   * @param index - The index of the child to retrieve.
   */
  childAs(t) {
    return this.children()[t] ?? null;
  }
  /**
   * Get the children array cast to the specified type.
   */
  childrenAs() {
    return this.children();
  }
  /**
   * Get the parent cast to the specified type.
   */
  parentAs() {
    return this.parent() ?? null;
  }
  /**
   * Prepare this node to be disposed of.
   *
   * @remarks
   * This method is called automatically when a scene is refreshed. It will
   * be called even if the node is not currently attached to the tree.
   *
   * The goal of this method is to clean any external references to allow the
   * node to be garbage collected.
   */
  dispose() {
    if (this.unregister) {
      this.stateStack = [], this.unregister(), this.unregister = null;
      for (const { signal: t } of this)
        t == null || t.context.dispose();
      for (const t of this.realChildren)
        t.dispose();
    }
  }
  /**
   * Create a copy of this node.
   *
   * @param customProps - Properties to override.
   */
  clone(t = {}) {
    const e = { ...t };
    Ht(this.children.context.raw()) ? e.children ?? (e.children = this.children.context.raw()) : this.children().length > 0 && (e.children ?? (e.children = this.children().map((r) => r.clone())));
    for (const { key: r, meta: i, signal: a } of this)
      if (!(!i.cloneable || r in e))
        if (i.compound)
          for (const [h, u] of i.compoundEntries) {
            if (u in e)
              continue;
            const m = a[h];
            m.context.isInitial() || (e[u] = m.context.raw());
          }
        else
          a.context.isInitial() || (e[r] = a.context.raw());
    return this.instantiate(e);
  }
  /**
   * Create a copy of this node.
   *
   * @remarks
   * Unlike {@link clone}, a snapshot clone calculates any reactive properties
   * at the moment of cloning and passes the raw values to the copy.
   *
   * @param customProps - Properties to override.
   */
  snapshotClone(t = {}) {
    const e = {
      ...this.getState(),
      ...t
    };
    return this.children().length > 0 && (e.children ?? (e.children = this.children().map((r) => r.snapshotClone()))), this.instantiate(e);
  }
  /**
   * Create a reactive copy of this node.
   *
   * @remarks
   * A reactive copy has all its properties dynamically updated to match the
   * source node.
   *
   * @param customProps - Properties to override.
   */
  reactiveClone(t = {}) {
    const e = { ...t };
    this.children().length > 0 && (e.children ?? (e.children = this.children().map((r) => r.reactiveClone())));
    for (const { key: r, meta: i, signal: a } of this)
      !i.cloneable || r in e || (e[r] = () => a());
    return this.instantiate(e);
  }
  /**
   * Create an instance of this node's class.
   *
   * @param props - Properties to pass to the constructor.
   */
  instantiate(t = {}) {
    return new this.constructor(t);
  }
  /**
   * Set the children without parsing them.
   *
   * @remarks
   * This method assumes that the caller took care of parsing the children and
   * updating the hierarchy.
   *
   * @param value - The children to set.
   */
  setParsedChildren(t) {
    this.children.context.setter(t), this.realChildren = t;
  }
  spawnChildren(t, e) {
    const r = this.parseChildren(e), i = /* @__PURE__ */ new Set();
    for (const a of r) {
      const h = a.parent.context.raw();
      h && h !== this && h.removeChild(a), i.add(a.key), a.parent(this);
    }
    for (const a of this.realChildren)
      i.has(a.key) || a.parent(null);
    this.hasSpawnedChildren = t, this.realChildren = r;
  }
  /**
   * Parse any `ComponentChildren` into an array of nodes.
   *
   * @param children - The children to parse.
   */
  parseChildren(t) {
    const e = [], r = Array.isArray(t) ? t : [t];
    for (const i of r)
      i instanceof mr && e.push(i);
    return e;
  }
  /**
   * Remove the given child.
   */
  removeChild(t) {
    this.setParsedChildren(this.children().filter((e) => e !== t));
  }
  /**
   * Whether this node should be cached or not.
   */
  requiresCache() {
    return this.cache() || this.opacity() < 1 || this.compositeOperation() !== "source-over" || this.hasFilters() || this.hasShadow() || this.shaders().length > 0;
  }
  cacheCanvas() {
    const t = document.createElement("canvas").getContext("2d");
    if (!t)
      throw new Error("Could not create a cache canvas");
    return t;
  }
  /**
   * Get a cache canvas with the contents of this node rendered onto it.
   */
  cachedCanvas() {
    const t = this.cacheCanvas(), e = this.worldSpaceCacheBBox(), r = this.localToWorld();
    return t.canvas.width = e.width, t.canvas.height = e.height, t.setTransform(r.a, r.b, r.c, r.d, r.e - e.x, r.f - e.y), this.draw(t), t;
  }
  /**
   * Get a bounding box for the contents rendered by this node.
   *
   * @remarks
   * The returned bounding box should be in local space.
   */
  getCacheBBox() {
    return new H();
  }
  /**
   * Get a bounding box for the contents rendered by this node as well
   * as its children.
   */
  cacheBBox() {
    const t = this.getCacheBBox(), e = this.children(), r = this.cachePadding();
    if (e.length === 0)
      return t.addSpacing(r);
    const i = t.corners;
    for (const h of e) {
      const u = h.fullCacheBBox(), m = h.localToParent();
      i.push(...u.corners.map((y) => y.transformAsPoint(m)));
    }
    return H.fromPoints(...i).addSpacing(r);
  }
  /**
   * Get a bounding box for the contents rendered by this node (including
   * effects applied after caching).
   *
   * @remarks
   * The returned bounding box should be in local space.
   */
  fullCacheBBox() {
    const t = this.compositeToLocal(), e = this.shadowOffset().transform(t), r = ls(this.shadowBlur(), t), i = this.cacheBBox().expand(this.filters.blur() * 2 + r);
    return e.x < 0 ? (i.x += e.x, i.width -= e.x) : i.width += e.x, e.y < 0 ? (i.y += e.y, i.height -= e.y) : i.height += e.y, i;
  }
  /**
   * Get a bounding box in world space for the contents rendered by this node as
   * well as its children.
   *
   * @remarks
   * This is the same the bounding box returned by {@link cacheBBox} only
   * transformed to world space.
   */
  worldSpaceCacheBBox() {
    const t = H.fromSizeCentered(this.view().size()).expand(this.view().cachePadding()), e = H.fromPoints(...t.transformCorners(this.view().localToWorld())), r = H.fromPoints(...this.cacheBBox().transformCorners(this.localToWorld()));
    return e.intersection(r).pixelPerfect.expand(2);
  }
  parentWorldSpaceCacheBBox() {
    var t;
    return ((t = this.findAncestor((e) => e.requiresCache())) == null ? void 0 : t.worldSpaceCacheBBox()) ?? new H(g.zero, vr().getRealSize());
  }
  /**
   * Prepare the given context for drawing a cached node onto it.
   *
   * @remarks
   * This method is called before the contents of the cache canvas are drawn
   * on the screen. It can be used to apply effects to the entire node together
   * with its children, instead of applying them individually.
   * Effects such as transparency, shadows, and filters use this technique.
   *
   * Whether the node is cached is decided by the {@link requiresCache} method.
   *
   * @param context - The context using which the cache will be drawn.
   */
  setupDrawFromCache(t) {
    if (t.globalCompositeOperation = this.compositeOperation(), t.globalAlpha *= this.opacity(), this.hasFilters() && (t.filter = this.filterString()), this.hasShadow()) {
      const r = this.compositeToWorld(), i = this.shadowOffset().transform(r), a = ls(this.shadowBlur(), r);
      t.shadowColor = this.shadowColor().serialize(), t.shadowBlur = a, t.shadowOffsetX = i.x, t.shadowOffsetY = i.y;
    }
    const e = this.worldToLocal();
    t.transform(e.a, e.b, e.c, e.d, e.e, e.f);
  }
  renderFromSource(t, e, r, i) {
    this.setupDrawFromCache(t);
    const a = this.compositeOverride();
    t.drawImage(e, r, i), a > 0 && (t.save(), t.globalAlpha *= a, t.globalCompositeOperation = "source-over", t.drawImage(e, r, i), t.restore());
  }
  shaderCanvas(t, e) {
    var F, X;
    const r = this.shaders();
    if (r.length === 0)
      return null;
    const i = vr(), a = i.getRealSize(), h = this.parentWorldSpaceCacheBBox(), u = new DOMMatrix().scaleSelf(a.width / h.width, a.height / -h.height).translateSelf(h.x / -a.width, h.y / a.height - 1), m = this.worldSpaceCacheBBox(), y = new DOMMatrix().scaleSelf(a.width / m.width, a.height / -m.height).translateSelf(m.x / -a.width, m.y / a.height - 1).invertSelf(), S = i.shaders.getGL();
    i.shaders.copyTextures(t, e), i.shaders.clear();
    for (const tt of r) {
      const at = i.shaders.getProgram(tt.fragment);
      if (at) {
        if (tt.uniforms)
          for (const [k, rt] of Object.entries(tt.uniforms)) {
            const Pt = S.getUniformLocation(at, k);
            if (Pt === null)
              continue;
            const st = Te(rt);
            typeof st == "number" ? S.uniform1f(Pt, st) : "toUniform" in st ? st.toUniform(S, Pt) : st.length === 1 ? S.uniform1f(Pt, st[0]) : st.length === 2 ? S.uniform2f(Pt, st[0], st[1]) : st.length === 3 ? S.uniform3f(Pt, st[0], st[1], st[2]) : st.length === 4 && S.uniform4f(Pt, st[0], st[1], st[2], st[3]);
          }
        S.uniform1f(S.getUniformLocation(at, gi), this.view2D.globalTime()), S.uniform1i(S.getUniformLocation(at, gi), i.playback.frame), S.uniformMatrix4fv(S.getUniformLocation(at, _c), !1, y.toFloat32Array()), S.uniformMatrix4fv(S.getUniformLocation(at, Dc), !1, u.toFloat32Array()), (F = tt.setup) == null || F.call(tt, S, at), i.shaders.render(), (X = tt.teardown) == null || X.call(tt, S, at);
      }
    }
    return S.canvas;
  }
  /**
   * Render this node onto the given canvas.
   *
   * @param context - The context to draw with.
   */
  render(t) {
    if (!(this.absoluteOpacity() <= 0)) {
      if (t.save(), this.transformContext(t), this.requiresCache()) {
        const e = this.worldSpaceCacheBBox();
        if (e.width !== 0 && e.height !== 0) {
          const r = this.cachedCanvas().canvas, i = this.shaderCanvas(t.canvas, r);
          i ? this.renderFromSource(t, i, 0, 0) : this.renderFromSource(t, r, e.position.x, e.position.y);
        }
      } else
        this.draw(t);
      t.restore();
    }
  }
  /**
   * Draw this node onto the canvas.
   *
   * @remarks
   * This method is used when drawing directly onto the screen as well as onto
   * the cache canvas.
   * It assumes that the context have already been transformed to local space.
   *
   * @param context - The context to draw with.
   */
  draw(t) {
    this.drawChildren(t);
  }
  drawChildren(t) {
    for (const e of this.sortedChildren())
      e.render(t);
  }
  /**
   * Draw an overlay for this node.
   *
   * @remarks
   * The overlay for the currently inspected node is displayed on top of the
   * canvas.
   *
   * The provided context is in screen space. The local-to-screen matrix can be
   * used to transform all shapes that need to be displayed.
   * This approach allows to keep the line widths and gizmo sizes consistent,
   * no matter how zoomed-in the view is.
   *
   * @param context - The context to draw with.
   * @param matrix - A local-to-screen matrix.
   */
  drawOverlay(t, e) {
    const r = this.cacheBBox().transformCorners(e), i = this.getCacheBBox().transformCorners(e);
    t.strokeStyle = "white", t.lineWidth = 1, t.beginPath(), me(t, r), t.closePath(), t.stroke(), t.strokeStyle = "blue", t.beginPath(), me(t, i), t.closePath(), t.stroke();
  }
  transformContext(t) {
    const e = this.localToParent();
    t.transform(e.a, e.b, e.c, e.d, e.e, e.f);
  }
  /**
   * Try to find a node intersecting the given position.
   *
   * @param position - The searched position.
   */
  hit(t) {
    let e = null;
    const r = t.transformAsPoint(this.localToParent().inverse()), i = this.children();
    for (let a = i.length - 1; a >= 0 && (e = i[a].hit(r), !e); a--)
      ;
    return e;
  }
  /**
   * Collect all asynchronous resources used by this node.
   */
  collectAsyncResources() {
    for (const t of this.children())
      t.collectAsyncResources();
  }
  /**
   * Wait for any asynchronous resources that this node or its children have.
   *
   * @remarks
   * Certain resources like images are always loaded asynchronously.
   * Awaiting this method makes sure that all such resources are done loading
   * before continuing the animation.
   */
  async toPromise() {
    do
      await ot.consumePromises(), this.collectAsyncResources();
    while (ot.hasPromises());
    return this;
  }
  /**
   * Return a snapshot of the node's current signal values.
   *
   * @remarks
   * This method will calculate the values of any reactive properties of the
   * node at the time the method is called.
   */
  getState() {
    const t = {};
    for (const { key: e, meta: r, signal: i } of this)
      !r.cloneable || e in t || (t[e] = i());
    return t;
  }
  applyState(t, e, r = Ft) {
    if (e === void 0)
      for (const a in t) {
        const h = this.signalByKey(a);
        h && h(t[a]);
      }
    const i = [];
    for (const a in t) {
      const h = this.signalByKey(a);
      t[a] !== h.context.raw() && i.push(h(t[a], e, r));
    }
    return ye(...i);
  }
  /**
   * Push a snapshot of the node's current state onto the node's state stack.
   *
   * @remarks
   * This method can be used together with the {@link restore} method to save a
   * node's current state and later restore it. It is possible to store more
   * than one state by calling `save` method multiple times.
   */
  save() {
    this.stateStack.push(this.getState());
  }
  restore(t, e = Ft) {
    const r = this.stateStack.pop();
    if (r !== void 0)
      return this.applyState(r, t, e);
  }
  *[Symbol.iterator]() {
    for (const t in this.properties) {
      const e = this.properties[t], r = this.signalByKey(t);
      yield { meta: e, signal: r, key: t };
    }
  }
  signalByKey(t) {
    return this[t];
  }
  reversedChildren() {
    const t = this.children(), e = [];
    for (let r = t.length - 1; r >= 0; r--)
      e.push(t[r]);
    return e;
  }
};
_([
  Vt()
], E.prototype, "position", void 0);
_([
  Je(g),
  Re(!1),
  R()
], E.prototype, "absolutePosition", void 0);
_([
  A(0),
  R()
], E.prototype, "rotation", void 0);
_([
  Re(!1),
  R()
], E.prototype, "absoluteRotation", void 0);
_([
  A(g.one),
  Vt("scale")
], E.prototype, "scale", void 0);
_([
  A(g.zero),
  Vt("skew")
], E.prototype, "skew", void 0);
_([
  Je(g),
  Re(!1),
  R()
], E.prototype, "absoluteScale", void 0);
_([
  A(0),
  R()
], E.prototype, "zIndex", void 0);
_([
  A(!1),
  R()
], E.prototype, "cache", void 0);
_([
  Mr("cachePadding")
], E.prototype, "cachePadding", void 0);
_([
  A(!1),
  R()
], E.prototype, "composite", void 0);
_([
  A("source-over"),
  R()
], E.prototype, "compositeOperation", void 0);
_([
  ct()
], E.prototype, "tweenCompositeOperation", null);
_([
  A(1),
  Ts((s) => wt(0, 1, s)),
  R()
], E.prototype, "opacity", void 0);
_([
  z()
], E.prototype, "absoluteOpacity", null);
_([
  du()
], E.prototype, "filters", void 0);
_([
  A("#0000"),
  fu()
], E.prototype, "shadowColor", void 0);
_([
  A(0),
  R()
], E.prototype, "shadowBlur", void 0);
_([
  Vt("shadowOffset")
], E.prototype, "shadowOffset", void 0);
_([
  A([]),
  Ts(mu),
  R()
], E.prototype, "shaders", void 0);
_([
  z()
], E.prototype, "hasFilters", null);
_([
  z()
], E.prototype, "hasShadow", null);
_([
  z()
], E.prototype, "filterString", null);
_([
  Ei(!1),
  Re(!1),
  R()
], E.prototype, "spawner", void 0);
_([
  Ei(!1),
  Re(!1),
  R()
], E.prototype, "children", void 0);
_([
  z()
], E.prototype, "spawnedChildren", null);
_([
  z()
], E.prototype, "sortedChildren", null);
_([
  z()
], E.prototype, "localToWorld", null);
_([
  z()
], E.prototype, "worldToLocal", null);
_([
  z()
], E.prototype, "worldToParent", null);
_([
  z()
], E.prototype, "parentToWorld", null);
_([
  z()
], E.prototype, "localToParent", null);
_([
  z()
], E.prototype, "compositeToWorld", null);
_([
  z()
], E.prototype, "compositeRoot", null);
_([
  z()
], E.prototype, "compositeToLocal", null);
_([
  z()
], E.prototype, "cacheCanvas", null);
_([
  z()
], E.prototype, "cachedCanvas", null);
_([
  z()
], E.prototype, "cacheBBox", null);
_([
  z()
], E.prototype, "fullCacheBBox", null);
_([
  z()
], E.prototype, "worldSpaceCacheBBox", null);
_([
  z()
], E.prototype, "parentWorldSpaceCacheBBox", null);
E = mr = _([
  Jt("Node")
], E);
E.prototype.isClass = !0;
var O = globalThis && globalThis.__decorate || function(s, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
    a = Reflect.decorate(s, t, e, r);
  else
    for (var u = s.length - 1; u >= 0; u--)
      (h = s[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, br;
let $ = br = class extends E {
  get columnGap() {
    return this.gap.x;
  }
  get rowGap() {
    return this.gap.y;
  }
  getX() {
    return this.isLayoutRoot() ? this.x.context.getter() : this.computedPosition().x;
  }
  setX(t) {
    this.x.context.setter(t);
  }
  getY() {
    return this.isLayoutRoot() ? this.y.context.getter() : this.computedPosition().y;
  }
  setY(t) {
    this.y.context.setter(t);
  }
  get width() {
    return this.size.x;
  }
  get height() {
    return this.size.y;
  }
  getWidth() {
    return this.computedSize().width;
  }
  setWidth(t) {
    this.width.context.setter(t);
  }
  *tweenWidth(t, e, r, i) {
    const a = this.desiredSize().x, h = typeof a != "number" || typeof t != "number";
    let u;
    h ? u = this.size.x() : u = a;
    let m;
    h ? (this.size.x(t), m = this.size.x()) : m = t, this.size.x(u), h && this.lockSize(), yield* _t(e, (y) => this.size.x(i(u, m, r(y)))), this.size.x(t), h && this.releaseSize();
  }
  getHeight() {
    return this.computedSize().height;
  }
  setHeight(t) {
    this.height.context.setter(t);
  }
  *tweenHeight(t, e, r, i) {
    const a = this.desiredSize().y, h = typeof a != "number" || typeof t != "number";
    let u;
    h ? u = this.size.y() : u = a;
    let m;
    h ? (this.size.y(t), m = this.size.y()) : m = t, this.size.y(u), h && this.lockSize(), yield* _t(e, (y) => this.size.y(i(u, m, r(y)))), this.size.y(t), h && this.releaseSize();
  }
  /**
   * Get the desired size of this node.
   *
   * @remarks
   * This method can be used to control the size using external factors.
   * By default, the returned size is the same as the one declared by the user.
   */
  desiredSize() {
    return {
      x: this.width.context.getter(),
      y: this.height.context.getter()
    };
  }
  *tweenSize(t, e, r, i) {
    const a = this.desiredSize();
    let h;
    typeof a.x != "number" || typeof a.y != "number" ? h = this.size() : h = new g(a);
    let u;
    typeof t == "object" && typeof t.x == "number" && typeof t.y == "number" ? u = new g(t) : (this.size(t), u = this.size()), this.size(h), this.lockSize(), yield* _t(e, (m) => this.size(i(h, u, r(m)))), this.releaseSize(), this.size(t);
  }
  /**
   * Get the cardinal point corresponding to the given origin.
   *
   * @param origin - The origin or direction of the point.
   */
  cardinalPoint(t) {
    switch (t) {
      case it.TopLeft:
        return this.topLeft;
      case it.TopRight:
        return this.topRight;
      case it.BottomLeft:
        return this.bottomLeft;
      case it.BottomRight:
        return this.bottomRight;
      case it.Top:
      case xt.Top:
        return this.top;
      case it.Bottom:
      case xt.Bottom:
        return this.bottom;
      case it.Left:
      case xt.Left:
        return this.left;
      case it.Right:
      case xt.Right:
        return this.right;
      default:
        return this.middle;
    }
  }
  constructor(t) {
    super(t), this.element.dataset.motionCanvasKey = this.key;
  }
  lockSize() {
    this.sizeLockCounter(this.sizeLockCounter() + 1);
  }
  releaseSize() {
    this.sizeLockCounter(this.sizeLockCounter() - 1);
  }
  parentTransform() {
    return this.findAncestor(ks(br));
  }
  anchorPosition() {
    const t = this.computedSize(), e = this.offset();
    return t.scale(0.5).mul(e);
  }
  /**
   * Get the resolved layout mode of this node.
   *
   * @remarks
   * When the mode is `null`, its value will be inherited from the parent.
   *
   * Use {@link layout} to get the raw mode set for this node (without
   * inheritance).
   */
  layoutEnabled() {
    var t;
    return this.layout() ?? ((t = this.parentTransform()) == null ? void 0 : t.layoutEnabled()) ?? !1;
  }
  isLayoutRoot() {
    var t;
    return !this.layoutEnabled() || !((t = this.parentTransform()) != null && t.layoutEnabled());
  }
  localToParent() {
    const t = super.localToParent(), e = this.offset();
    if (!e.exactlyEquals(g.zero)) {
      const r = this.size().mul(e).scale(-0.5);
      t.translateSelf(r.x, r.y);
    }
    return t;
  }
  /**
   * A simplified version of {@link localToParent} matrix used for transforming
   * direction vectors.
   *
   * @internal
   */
  scalingRotationMatrix() {
    const t = new DOMMatrix();
    t.rotateSelf(0, 0, this.rotation()), t.scaleSelf(this.scale.x(), this.scale.y());
    const e = this.offset();
    if (!e.exactlyEquals(g.zero)) {
      const r = this.size().mul(e).scale(-0.5);
      t.translateSelf(r.x, r.y);
    }
    return t;
  }
  getComputedLayout() {
    return new H(this.element.getBoundingClientRect());
  }
  computedPosition() {
    this.requestLayoutUpdate();
    const t = this.getComputedLayout(), e = new g(t.x + t.width / 2 * this.offset.x(), t.y + t.height / 2 * this.offset.y()), r = this.parentTransform();
    if (r) {
      const i = r.getComputedLayout();
      e.x -= i.x + (i.width - t.width) / 2, e.y -= i.y + (i.height - t.height) / 2;
    }
    return e;
  }
  computedSize() {
    return this.requestLayoutUpdate(), this.getComputedLayout().size;
  }
  /**
   * Find the closest layout root and apply any new layout changes.
   */
  requestLayoutUpdate() {
    const t = this.parentTransform();
    this.appendedToView() ? (t == null || t.requestFontUpdate(), this.updateLayout()) : t.requestLayoutUpdate();
  }
  appendedToView() {
    const t = this.isLayoutRoot();
    return t && this.view().element.append(this.element), t;
  }
  /**
   * Apply any new layout changes to this node and its children.
   */
  updateLayout() {
    if (this.applyFont(), this.applyFlex(), this.layoutEnabled()) {
      const t = this.layoutChildren();
      for (const e of t)
        e.updateLayout();
    }
  }
  layoutChildren() {
    const t = [...this.children()], e = [], r = [];
    for (; t.length; ) {
      const i = t.shift();
      i instanceof br ? i.layoutEnabled() && (e.push(i), r.push(i.element)) : i && t.unshift(...i.children());
    }
    return this.element.replaceChildren(...r), e;
  }
  /**
   * Apply any new font changes to this node and all of its ancestors.
   */
  requestFontUpdate() {
    var t;
    this.appendedToView(), (t = this.parentTransform()) == null || t.requestFontUpdate(), this.applyFont();
  }
  getCacheBBox() {
    return H.fromSizeCentered(this.computedSize());
  }
  draw(t) {
    if (this.clip()) {
      const e = this.computedSize();
      if (e.width === 0 || e.height === 0)
        return;
      t.beginPath(), t.rect(e.width / -2, e.height / -2, e.width, e.height), t.closePath(), t.clip();
    }
    this.drawChildren(t);
  }
  drawOverlay(t, e) {
    const r = this.computedSize(), i = r.mul(this.offset()).scale(0.5).transformAsPoint(e), a = H.fromSizeCentered(r), h = a.transformCorners(e), u = a.addSpacing(this.padding().scale(-1)).transformCorners(e), m = a.addSpacing(this.margin()).transformCorners(e);
    t.beginPath(), me(t, m), me(t, h), t.closePath(), t.fillStyle = "rgba(255,193,125,0.6)", t.fill("evenodd"), t.beginPath(), me(t, h), me(t, u), t.closePath(), t.fillStyle = "rgba(180,255,147,0.6)", t.fill("evenodd"), t.beginPath(), me(t, h), t.closePath(), t.lineWidth = 1, t.strokeStyle = "white", t.stroke(), t.beginPath(), hu(t, i), t.stroke();
  }
  getOriginDelta(t) {
    const e = this.computedSize().scale(0.5), r = this.offset().mul(e);
    return t === it.Middle ? r.flipped : Qc(t).mul(e).sub(r);
  }
  /**
   * Update the offset of this node and adjust the position to keep it in the
   * same place.
   *
   * @param offset - The new offset.
   */
  moveOffset(t) {
    const e = this.computedSize().scale(0.5), r = this.offset().mul(e), i = t.mul(e);
    this.offset(t), this.position(this.position().add(i).sub(r));
  }
  parsePixels(t) {
    return t === null ? "" : `${t}px`;
  }
  parseLength(t) {
    return t === null ? "" : typeof t == "string" ? t : `${t}px`;
  }
  applyFlex() {
    this.element.style.position = this.isLayoutRoot() ? "absolute" : "relative";
    const t = this.desiredSize();
    this.element.style.width = this.parseLength(t.x), this.element.style.height = this.parseLength(t.y), this.element.style.maxWidth = this.parseLength(this.maxWidth()), this.element.style.minWidth = this.parseLength(this.minWidth()), this.element.style.maxHeight = this.parseLength(this.maxHeight()), this.element.style.minHeight = this.parseLength(this.minHeight()), this.element.style.aspectRatio = this.ratio() === null ? "" : this.ratio().toString(), this.element.style.marginTop = this.parsePixels(this.margin.top()), this.element.style.marginBottom = this.parsePixels(this.margin.bottom()), this.element.style.marginLeft = this.parsePixels(this.margin.left()), this.element.style.marginRight = this.parsePixels(this.margin.right()), this.element.style.paddingTop = this.parsePixels(this.padding.top()), this.element.style.paddingBottom = this.parsePixels(this.padding.bottom()), this.element.style.paddingLeft = this.parsePixels(this.padding.left()), this.element.style.paddingRight = this.parsePixels(this.padding.right()), this.element.style.flexDirection = this.direction(), this.element.style.flexBasis = this.parseLength(this.basis()), this.element.style.flexWrap = this.wrap(), this.element.style.justifyContent = this.justifyContent(), this.element.style.alignContent = this.alignContent(), this.element.style.alignItems = this.alignItems(), this.element.style.alignSelf = this.alignSelf(), this.element.style.columnGap = this.parseLength(this.gap.x()), this.element.style.rowGap = this.parseLength(this.gap.y()), this.sizeLockCounter() > 0 ? (this.element.style.flexGrow = "0", this.element.style.flexShrink = "0") : (this.element.style.flexGrow = this.grow().toString(), this.element.style.flexShrink = this.shrink().toString());
  }
  applyFont() {
    if (this.element.style.fontFamily = this.fontFamily.isInitial() ? "" : this.fontFamily(), this.element.style.fontSize = this.fontSize.isInitial() ? "" : `${this.fontSize()}px`, this.element.style.fontStyle = this.fontStyle.isInitial() ? "" : this.fontStyle(), this.lineHeight.isInitial())
      this.element.style.lineHeight = "";
    else {
      const t = this.lineHeight();
      this.element.style.lineHeight = typeof t == "string" ? (parseFloat(t) / 100).toString() : `${t}px`;
    }
    if (this.element.style.fontWeight = this.fontWeight.isInitial() ? "" : this.fontWeight().toString(), this.element.style.letterSpacing = this.letterSpacing.isInitial() ? "" : `${this.letterSpacing()}px`, this.element.style.textAlign = this.textAlign.isInitial() ? "" : this.textAlign(), this.textWrap.isInitial())
      this.element.style.whiteSpace = "";
    else {
      const t = this.textWrap();
      typeof t == "boolean" ? this.element.style.whiteSpace = t ? "normal" : "nowrap" : this.element.style.whiteSpace = t;
    }
  }
  dispose() {
    var t;
    super.dispose(), (t = this.sizeLockCounter) == null || t.context.dispose(), this.element && (this.element.remove(), this.element.innerHTML = ""), this.element = null, this.styles = null;
  }
  hit(t) {
    const e = t.transformAsPoint(this.localToParent().inverse());
    return this.cacheBBox().includes(e) ? super.hit(t) ?? this : null;
  }
};
O([
  A(null),
  Cs(qc),
  R()
], $.prototype, "layout", void 0);
O([
  A(null),
  R()
], $.prototype, "maxWidth", void 0);
O([
  A(null),
  R()
], $.prototype, "maxHeight", void 0);
O([
  A(null),
  R()
], $.prototype, "minWidth", void 0);
O([
  A(null),
  R()
], $.prototype, "minHeight", void 0);
O([
  A(null),
  R()
], $.prototype, "ratio", void 0);
O([
  Mr("margin")
], $.prototype, "margin", void 0);
O([
  Mr("padding")
], $.prototype, "padding", void 0);
O([
  A("row"),
  R()
], $.prototype, "direction", void 0);
O([
  A(null),
  R()
], $.prototype, "basis", void 0);
O([
  A(0),
  R()
], $.prototype, "grow", void 0);
O([
  A(1),
  R()
], $.prototype, "shrink", void 0);
O([
  A("nowrap"),
  R()
], $.prototype, "wrap", void 0);
O([
  A("start"),
  R()
], $.prototype, "justifyContent", void 0);
O([
  A("normal"),
  R()
], $.prototype, "alignContent", void 0);
O([
  A("stretch"),
  R()
], $.prototype, "alignItems", void 0);
O([
  A("auto"),
  R()
], $.prototype, "alignSelf", void 0);
O([
  A(0),
  Vt({ x: "columnGap", y: "rowGap" })
], $.prototype, "gap", void 0);
O([
  ce("font-family"),
  R()
], $.prototype, "fontFamily", void 0);
O([
  ce("font-size", parseFloat),
  R()
], $.prototype, "fontSize", void 0);
O([
  ce("font-style"),
  R()
], $.prototype, "fontStyle", void 0);
O([
  ce("font-weight", parseInt),
  R()
], $.prototype, "fontWeight", void 0);
O([
  ce("line-height", parseFloat),
  R()
], $.prototype, "lineHeight", void 0);
O([
  ce("letter-spacing", (s) => s === "normal" ? 0 : parseFloat(s)),
  R()
], $.prototype, "letterSpacing", void 0);
O([
  ce("white-space", (s) => s === "pre" ? "pre" : s === "normal"),
  R()
], $.prototype, "textWrap", void 0);
O([
  A("inherit"),
  R()
], $.prototype, "textDirection", void 0);
O([
  ce("text-align"),
  R()
], $.prototype, "textAlign", void 0);
O([
  A({ x: null, y: null }),
  Vt({ x: "width", y: "height" })
], $.prototype, "size", void 0);
O([
  ct()
], $.prototype, "tweenWidth", null);
O([
  ct()
], $.prototype, "tweenHeight", null);
O([
  z()
], $.prototype, "desiredSize", null);
O([
  ct()
], $.prototype, "tweenSize", null);
O([
  Vt("offset")
], $.prototype, "offset", void 0);
O([
  Qt(it.Middle)
], $.prototype, "middle", void 0);
O([
  Qt(it.Top)
], $.prototype, "top", void 0);
O([
  Qt(it.Bottom)
], $.prototype, "bottom", void 0);
O([
  Qt(it.Left)
], $.prototype, "left", void 0);
O([
  Qt(it.Right)
], $.prototype, "right", void 0);
O([
  Qt(it.TopLeft)
], $.prototype, "topLeft", void 0);
O([
  Qt(it.TopRight)
], $.prototype, "topRight", void 0);
O([
  Qt(it.BottomLeft)
], $.prototype, "bottomLeft", void 0);
O([
  Qt(it.BottomRight)
], $.prototype, "bottomRight", void 0);
O([
  A(!1),
  R()
], $.prototype, "clip", void 0);
O([
  A(0),
  R()
], $.prototype, "sizeLockCounter", void 0);
O([
  z()
], $.prototype, "parentTransform", null);
O([
  z()
], $.prototype, "anchorPosition", null);
O([
  z()
], $.prototype, "layoutEnabled", null);
O([
  z()
], $.prototype, "isLayoutRoot", null);
O([
  z()
], $.prototype, "scalingRotationMatrix", null);
O([
  z()
], $.prototype, "computedPosition", null);
O([
  z()
], $.prototype, "computedSize", null);
O([
  z()
], $.prototype, "requestLayoutUpdate", null);
O([
  z()
], $.prototype, "appendedToView", null);
O([
  z()
], $.prototype, "updateLayout", null);
O([
  z()
], $.prototype, "layoutChildren", null);
O([
  z()
], $.prototype, "requestFontUpdate", null);
O([
  z()
], $.prototype, "applyFlex", null);
O([
  z()
], $.prototype, "applyFont", null);
$ = br = O([
  Jt("Layout")
], $);
function Qt(s) {
  return (t, e) => {
    R()(t, e), Re(!1)(t, e);
    const r = ke(t, e);
    r.parser = (i) => new g(i), r.getter = function() {
      return this.computedSize().getOriginOffset(s).transformAsPoint(this.localToParent());
    }, r.setter = function(i) {
      return this.position(we(i, (a) => this.getOriginDelta(s).transform(this.scalingRotationMatrix()).flipped.add(a))), this;
    };
  };
}
Ve($.prototype, (s) => {
  s.element = document.createElement("div"), s.element.style.display = "flex", s.element.style.boxSizing = "border-box", s.styles = getComputedStyle(s.element);
});
var kt = globalThis && globalThis.__decorate || function(s, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
    a = Reflect.decorate(s, t, e, r);
  else
    for (var u = s.length - 1; u >= 0; u--)
      (h = s[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
let mt = class extends $ {
  rippleSize() {
    return Hc(this.rippleStrength(), 0, 50);
  }
  constructor(t) {
    super(t), this.rippleStrength = Ne(0);
  }
  applyText(t) {
    t.direction = this.textDirection(), this.element.dir = this.textDirection();
  }
  applyStyle(t) {
    t.fillStyle = us(this.fill(), t), t.strokeStyle = us(this.stroke(), t), t.lineWidth = this.lineWidth(), t.lineJoin = this.lineJoin(), t.lineCap = this.lineCap(), t.setLineDash(this.lineDash()), t.lineDashOffset = this.lineDashOffset(), this.antialiased() || (t.filter = "url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxmaWx0ZXIgaWQ9ImZpbHRlciIgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj48ZmVDb21wb25lbnRUcmFuc2Zlcj48ZmVGdW5jUiB0eXBlPSJpZGVudGl0eSIvPjxmZUZ1bmNHIHR5cGU9ImlkZW50aXR5Ii8+PGZlRnVuY0IgdHlwZT0iaWRlbnRpdHkiLz48ZmVGdW5jQSB0eXBlPSJkaXNjcmV0ZSIgdGFibGVWYWx1ZXM9IjAgMSIvPjwvZmVDb21wb25lbnRUcmFuc2Zlcj48L2ZpbHRlcj48L3N2Zz4=#filter)");
  }
  draw(t) {
    this.drawShape(t), this.clip() && t.clip(this.getPath()), this.drawChildren(t);
  }
  drawShape(t) {
    const e = this.getPath(), r = this.lineWidth() > 0 && this.stroke() !== null, i = this.fill() !== null;
    t.save(), this.applyStyle(t), this.drawRipple(t), this.strokeFirst() ? (r && t.stroke(e), i && t.fill(e)) : (i && t.fill(e), r && t.stroke(e)), t.restore();
  }
  getCacheBBox() {
    return super.getCacheBBox().expand(this.lineWidth() / 2);
  }
  getPath() {
    return new Path2D();
  }
  getRipplePath() {
    return new Path2D();
  }
  drawRipple(t) {
    const e = this.rippleStrength();
    if (e > 0) {
      const r = this.getRipplePath();
      t.save(), t.globalAlpha *= Q(0.54, 0, e), t.fill(r), t.restore();
    }
  }
  *ripple(t = 1) {
    this.rippleStrength(0), yield* this.rippleStrength(1, t, Zc), this.rippleStrength(0);
  }
};
kt([
  _i()
], mt.prototype, "fill", void 0);
kt([
  _i()
], mt.prototype, "stroke", void 0);
kt([
  A(!1),
  R()
], mt.prototype, "strokeFirst", void 0);
kt([
  A(0),
  R()
], mt.prototype, "lineWidth", void 0);
kt([
  A("miter"),
  R()
], mt.prototype, "lineJoin", void 0);
kt([
  A("butt"),
  R()
], mt.prototype, "lineCap", void 0);
kt([
  A([]),
  R()
], mt.prototype, "lineDash", void 0);
kt([
  A(0),
  R()
], mt.prototype, "lineDashOffset", void 0);
kt([
  A(!0),
  R()
], mt.prototype, "antialiased", void 0);
kt([
  z()
], mt.prototype, "rippleSize", null);
kt([
  z()
], mt.prototype, "getPath", null);
kt([
  ct()
], mt.prototype, "ripple", null);
mt = kt([
  Jt("Shape")
], mt);
var It = globalThis && globalThis.__decorate || function(s, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
    a = Reflect.decorate(s, t, e, r);
  else
    for (var u = s.length - 1; u >= 0; u--)
      (h = s[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
let St = class extends mt {
  desiredSize() {
    return this.childrenBBox().size;
  }
  constructor(t) {
    super(t), this.canHaveSubpath = !1;
  }
  /**
   * Convert a percentage along the curve to a distance.
   *
   * @remarks
   * The returned distance is given in relation to the full curve, not
   * accounting for {@link startOffset} and {@link endOffset}.
   *
   * @param value - The percentage along the curve.
   */
  percentageToDistance(t) {
    return wt(0, this.baseArcLength(), this.startOffset() + this.offsetArcLength() * t);
  }
  /**
   * Convert a distance along the curve to a percentage.
   *
   * @remarks
   * The distance should be given in relation to the full curve, not
   * accounting for {@link startOffset} and {@link endOffset}.
   *
   * @param value - The distance along the curve.
   */
  distanceToPercentage(t) {
    return (t - this.startOffset()) / this.offsetArcLength();
  }
  /**
   * The base arc length of this curve.
   *
   * @remarks
   * This is the entire length of this curve, not accounting for
   * {@link startOffset | the offsets}.
   */
  baseArcLength() {
    return this.profile().arcLength;
  }
  /**
   * The offset arc length of this curve.
   *
   * @remarks
   * This is the length of the curve that accounts for
   * {@link startOffset | the offsets}.
   */
  offsetArcLength() {
    const t = this.startOffset(), e = this.endOffset(), r = this.baseArcLength();
    return wt(0, r, r - t - e);
  }
  /**
   * The visible arc length of this curve.
   *
   * @remarks
   * This arc length accounts for both the offset and the {@link start} and
   * {@link end} properties.
   */
  arcLength() {
    return this.offsetArcLength() * Math.abs(this.start() - this.end());
  }
  /**
   * The percentage of the curve that's currently visible.
   *
   * @remarks
   * The returned value is the ratio between the visible length (as defined by
   * {@link start} and {@link end}) and the offset length of the curve.
   */
  completion() {
    return Math.abs(this.start() - this.end());
  }
  processSubpath(t, e, r) {
  }
  curveDrawingInfo() {
    const t = new Path2D();
    let e = new Path2D();
    const r = this.profile();
    let i = this.percentageToDistance(this.start()), a = this.percentageToDistance(this.end());
    i > a && ([i, a] = [a, i]);
    const h = a - i, u = Math.min(h / 2, this.arrowSize());
    this.startArrow() && (i += u / 2), this.endArrow() && (a -= u / 2);
    let m = 0, y = null, S = null, F = null, X = null;
    for (const tt of r.segments) {
      const at = m;
      if (m += tt.arcLength, m < i)
        continue;
      const k = (i - at) / tt.arcLength, rt = (a - at) / tt.arcLength, Pt = wt(0, 1, k), st = wt(0, 1, rt);
      this.canHaveSubpath && F && !tt.getPoint(0).position.equals(F) && (t.addPath(e), this.processSubpath(e, y, F), e = new Path2D(), y = null);
      const [Be, Et] = tt.draw(e, Pt, st, y === null);
      if (y === null && (y = Be.position, S = Be.normal.flipped.perpendicular), F = Et.position, X = Et.normal.flipped.perpendicular, m > a)
        break;
    }
    return this.closed() && this.start.isInitial() && this.end.isInitial() && this.startOffset.isInitial() && this.endOffset.isInitial() && e.closePath(), this.processSubpath(e, y, F), t.addPath(e), {
      startPoint: y ?? g.zero,
      startTangent: S ?? g.right,
      endPoint: F ?? g.zero,
      endTangent: X ?? g.right,
      arrowSize: u,
      path: t,
      startOffset: i
    };
  }
  getPointAtDistance(t) {
    return yi(this.profile(), t + this.startOffset());
  }
  getPointAtPercentage(t) {
    return yi(this.profile(), this.percentageToDistance(t));
  }
  getComputedLayout() {
    return this.offsetComputedLayout(super.getComputedLayout());
  }
  offsetComputedLayout(t) {
    return t.position = t.position.sub(this.childrenBBox().center), t;
  }
  getPath() {
    return this.curveDrawingInfo().path;
  }
  getCacheBBox() {
    const t = this.childrenBBox(), e = this.startArrow() || this.endArrow() ? this.arrowSize() : 0, r = this.lineWidth(), i = this.lineWidthCoefficient();
    return t.expand(Math.max(0, e, r * i));
  }
  lineWidthCoefficient() {
    return this.lineCap() === "square" ? 0.5 * 1.4143 : 0.5;
  }
  /**
   * Check if the path requires a profile.
   *
   * @remarks
   * The profile is only required if certain features are used. Otherwise, the
   * profile generation can be skipped, and the curve can be drawn directly
   * using the 2D context.
   */
  requiresProfile() {
    return !this.start.isInitial() || !this.startOffset.isInitial() || !this.startArrow.isInitial() || !this.end.isInitial() || !this.endOffset.isInitial() || !this.endArrow.isInitial();
  }
  drawShape(t) {
    super.drawShape(t), (this.startArrow() || this.endArrow()) && this.drawArrows(t);
  }
  drawArrows(t) {
    const { startPoint: e, startTangent: r, endPoint: i, endTangent: a, arrowSize: h } = this.curveDrawingInfo();
    h < 1e-3 || (t.save(), t.beginPath(), this.endArrow() && this.drawArrow(t, i, a.flipped, h), this.startArrow() && this.drawArrow(t, e, r, h), t.fillStyle = us(this.stroke(), t), t.closePath(), t.fill(), t.restore());
  }
  drawArrow(t, e, r, i) {
    const a = r.perpendicular, h = e.add(r.scale(-i / 2));
    Pr(t, h), Xt(t, h.add(r.add(a).scale(i))), Xt(t, h.add(r.sub(a).scale(i))), Xt(t, h), t.closePath();
  }
};
It([
  A(!1),
  R()
], St.prototype, "closed", void 0);
It([
  A(0),
  R()
], St.prototype, "start", void 0);
It([
  A(0),
  R()
], St.prototype, "startOffset", void 0);
It([
  A(!1),
  R()
], St.prototype, "startArrow", void 0);
It([
  A(1),
  R()
], St.prototype, "end", void 0);
It([
  A(0),
  R()
], St.prototype, "endOffset", void 0);
It([
  A(!1),
  R()
], St.prototype, "endArrow", void 0);
It([
  A(24),
  R()
], St.prototype, "arrowSize", void 0);
It([
  z()
], St.prototype, "arcLength", null);
It([
  z()
], St.prototype, "curveDrawingInfo", null);
St = It([
  Jt("Curve")
], St);
class Rs {
}
class bu extends Rs {
  constructor(t, e, r, i, a) {
    super(), this.center = t, this.radius = e, this.from = r, this.to = i, this.counter = a, this.angle = Math.acos(wt(-1, 1, r.dot(i))), this.length = Math.abs(this.angle * e);
    const h = new g(1, 1).scale(e);
    this.points = [t.sub(h), t.add(h)];
  }
  get arcLength() {
    return this.length;
  }
  draw(t, e, r) {
    const i = this.counter ? -1 : 1, a = this.from.radians + e * this.angle * i, h = this.to.radians - (1 - r) * this.angle * i;
    Math.abs(this.angle) > 1e-4 && t.arc(this.center.x, this.center.y, this.radius, a, h, this.counter);
    const u = g.fromRadians(a), m = g.fromRadians(h);
    return [
      {
        position: this.center.add(u.scale(this.radius)),
        tangent: this.counter ? u : u.flipped,
        normal: this.counter ? u.flipped : u
      },
      {
        position: this.center.add(m.scale(this.radius)),
        tangent: this.counter ? m.flipped : m,
        normal: this.counter ? m.flipped : m
      }
    ];
  }
  getPoint(t) {
    const e = this.counter ? -1 : 1, r = this.from.radians + t * this.angle * e, i = g.fromRadians(r);
    return {
      position: this.center.add(i.scale(this.radius)),
      tangent: this.counter ? i : i.flipped,
      normal: this.counter ? i : i.flipped
    };
  }
}
class bt {
  /**
   * Constructs a constant polynomial
   *
   * @param c0 - The constant coefficient
   */
  static constant(t) {
    return new bt(t);
  }
  /**
   * Constructs a linear polynomial
   *
   * @param c0 - The constant coefficient
   * @param c1 - The linear coefficient
   */
  static linear(t, e) {
    return new bt(t, e);
  }
  /**
   * Constructs a quadratic polynomial
   *
   * @param c0 - The constant coefficient
   * @param c1 - The linear coefficient
   * @param c2 - The quadratic coefficient
   */
  static quadratic(t, e, r) {
    return new bt(t, e, r);
  }
  /**
   * Constructs a cubic polynomial
   *
   * @param c0 - The constant coefficient
   * @param c1 - The linear coefficient
   * @param c2 - The quadratic coefficient
   * @param c3 - The cubic coefficient
   */
  static cubic(t, e, r, i) {
    return new bt(t, e, r, i);
  }
  /**
   * The degree of the polynomial
   */
  get degree() {
    return this.c3 !== 0 ? 3 : this.c2 !== 0 ? 2 : this.c1 !== 0 ? 1 : 0;
  }
  constructor(t, e, r, i) {
    this.c0 = t, this.c1 = e ?? 0, this.c2 = r ?? 0, this.c3 = i ?? 0;
  }
  /**
   * Return the nth derivative of the polynomial.
   *
   * @param n - The number of times to differentiate the polynomial.
   */
  differentiate(t = 1) {
    switch (t) {
      case 0:
        return this;
      case 1:
        return new bt(this.c1, 2 * this.c2, 3 * this.c3, 0);
      case 2:
        return new bt(2 * this.c2, 6 * this.c3, 0, 0);
      case 3:
        return new bt(6 * this.c3, 0, 0, 0);
      default:
        throw new Error("Unsupported derivative");
    }
  }
  eval(t, e = 0) {
    return e !== 0 ? this.differentiate(e).eval(t) : this.c3 * (t * t * t) + this.c2 * (t * t) + this.c1 * t + this.c0;
  }
  /**
   * Split the polynomial into two polynomials of the same overall shape.
   *
   * @param u - The point at which to split the polynomial.
   */
  split(t) {
    const e = 1 - t, r = new bt(this.c0, this.c1 * t, this.c2 * t * t, this.c3 * t * t * t), i = new bt(this.eval(0), e * this.differentiate(1).eval(t), e * e / 2 * this.differentiate(2).eval(t), e * e * e / 6 * this.differentiate(3).eval(t));
    return [r, i];
  }
  /**
   * Calculate the roots (values where this polynomial = 0).
   *
   * @remarks
   * Depending on the degree of the polynomial, returns between 0 and 3 results.
   */
  roots() {
    switch (this.degree) {
      case 3:
        return this.solveCubicRoots();
      case 2:
        return this.solveQuadraticRoots();
      case 1:
        return this.solveLinearRoot();
      case 0:
        return [];
      default:
        throw new Error(`Unsupported polynomial degree: ${this.degree}`);
    }
  }
  /**
   * Calculate the local extrema of the polynomial.
   */
  localExtrema() {
    return this.differentiate().roots();
  }
  /**
   * Calculate the local extrema of the polynomial in the unit interval.
   */
  localExtrema01() {
    const t = this.localExtrema(), e = [];
    for (let r = 0; r < t.length; r++) {
      const i = t[r];
      i >= 0 && i <= 1 && e.push(t[r]);
    }
    return e;
  }
  /**
   * Return the output value range within the unit interval.
   */
  outputRange01() {
    let t = [this.eval(0), this.eval(1)];
    const e = (r) => {
      t[1] > t[0] ? t = [Math.min(t[0], r), Math.max(t[1], r)] : t = [Math.min(t[1], r), Math.max(t[0], r)];
    };
    return this.localExtrema01().forEach((r) => e(this.eval(r))), t;
  }
  solveCubicRoots() {
    const t = this.c0, e = this.c1, r = this.c2, i = this.c3, a = t * t, h = t * r, u = e * e, m = (3 * h - u) / (3 * a), y = (2 * u * e - 9 * h * e + 27 * a * i) / (27 * a * t), S = this.solveDepressedCubicRoots(m, y), F = (X) => X - e / (3 * t);
    switch (S.length) {
      case 1:
        return [F(S[0])];
      case 2:
        return [F(S[0]), F(S[1])];
      case 3:
        return [
          F(S[0]),
          F(S[1]),
          F(S[2])
        ];
      default:
        return [];
    }
  }
  solveDepressedCubicRoots(t, e) {
    if (this.almostZero(t))
      return [Math.cbrt(-e)];
    const r = Math.PI * 2, i = 4 * t * t * t + 27 * e * e;
    if (i < 1e-5) {
      const a = 2 * Math.sqrt(-t / 3), h = 3 * e / (2 * t) * Math.sqrt(-3 / t), u = (m) => a * Math.cos(1 / 3 * Math.acos(wt(-1, 1, h)) - r / 3 * m);
      return h >= 0.9999 ? [u(0), u(2)] : h <= -0.9999 ? [u(1), u(2)] : [u(0), u(1), u(2)];
    }
    if (i > 0 && t < 0) {
      const a = 0.3333333333333333 * Math.acosh(-3 * Math.abs(e) / (2 * t) * Math.sqrt(-3 / t));
      return [-2 * Math.sign(e) * Math.sqrt(-t / 3) * Math.cosh(a)];
    }
    if (t > 0) {
      const a = 0.3333333333333333 * Math.asinh(3 * e / (2 * t) * Math.sqrt(3 / t));
      return [-2 * Math.sqrt(t / 3) * Math.sinh(a)];
    }
    return [];
  }
  solveQuadraticRoots() {
    const t = this.c2, e = this.c1, r = this.c0, i = e * e - 4 * t * r;
    if (this.almostZero(i))
      return [-e / (2 * t)];
    if (i >= 0) {
      const a = Math.sqrt(i), h = (-e - a) / (2 * t), u = (-e + a) / (2 * t);
      return [Math.min(h, u), Math.max(h, u)];
    }
    return [];
  }
  solveLinearRoot() {
    return [-this.c0 / this.c1];
  }
  almostZero(t) {
    return Math.abs(0 - t) <= Number.EPSILON;
  }
}
class He {
  constructor(t, e, r, i) {
    this.c0 = t, this.c1 = e, this.c2 = r, this.c3 = i, t instanceof bt ? (this.x = t, this.y = e) : i !== void 0 ? (this.x = new bt(t.x, e.x, r.x, i.x), this.y = new bt(t.y, e.y, r.y, i.y)) : (this.x = new bt(t.x, e.x, r.x), this.y = new bt(t.y, e.y, r.y));
  }
  eval(t, e = 0) {
    return new g(this.x.differentiate(e).eval(t), this.y.differentiate(e).eval(t));
  }
  split(t) {
    const [e, r] = this.x.split(t), [i, a] = this.y.split(t);
    return [new He(e, i), new He(r, a)];
  }
  differentiate(t = 1) {
    return new He(this.x.differentiate(t), this.y.differentiate(t));
  }
  evalDerivative(t) {
    return this.differentiate().eval(t);
  }
  /**
   * Calculate the tight axis-aligned bounds of the curve in the unit interval.
   */
  getBounds() {
    const t = this.x.outputRange01(), e = this.y.outputRange01();
    return H.fromPoints(new g(Math.min(...t), Math.max(...e)), new g(Math.max(...t), Math.min(...e)));
  }
}
class yu {
  /**
   * @param curve - The curve to sample
   * @param samples - How many points to sample from the provided curve. The
   *                  more points get sampled, the higher the resolution–and
   *                  therefore precision–of the sampler.
   */
  constructor(t, e = 20) {
    this.curve = t, this.sampledDistances = [], this.resample(e);
  }
  /**
   * Discard all previously sampled points and resample the provided number of
   * points from the curve.
   *
   * @param samples - The number of points to sample.
   */
  resample(t) {
    this.sampledDistances = [0];
    let e = 0, r = this.curve.eval(0).position;
    for (let i = 1; i < t; i++) {
      const a = i / (t - 1), h = this.curve.eval(a), u = r.sub(h.position).magnitude;
      e += u, this.sampledDistances.push(e), r = h.position;
    }
    this.sampledDistances[this.sampledDistances.length - 1] = this.curve.arcLength;
  }
  /**
   * Return the point at the provided distance along the sampled curve's
   * arclength.
   *
   * @param distance - The distance along the curve's arclength for which to
   *                   retrieve the point.
   */
  pointAtDistance(t) {
    return this.curve.eval(this.distanceToT(t));
  }
  /**
   * Return the t value for the point at the provided distance along the sampled
   * curve's arc length.
   *
   * @param distance - The distance along the arclength
   */
  distanceToT(t) {
    const e = this.sampledDistances.length;
    t = wt(0, this.curve.arcLength, t);
    for (let r = 0; r < e; r++) {
      const i = this.sampledDistances[r], a = this.sampledDistances[r + 1];
      if (t >= i && t <= a)
        return Xc(i, a, r / (e - 1), (r + 1) / (e - 1), t);
    }
    return 1;
  }
}
class wu extends Rs {
  get arcLength() {
    return this.length;
  }
  constructor(t, e) {
    super(), this.curve = t, this.length = e, this.pointSampler = new yu(this);
  }
  getBBox() {
    return this.curve.getBounds();
  }
  /**
   * Evaluate the polynomial at the given t value.
   *
   * @param t - The t value at which to evaluate the curve.
   */
  eval(t) {
    const e = this.tangent(t);
    return {
      position: this.curve.eval(t),
      tangent: e,
      normal: e.perpendicular
    };
  }
  getPoint(t) {
    const e = this.pointSampler.pointAtDistance(this.arcLength * t);
    return {
      position: e.position,
      tangent: e.tangent,
      normal: e.tangent.perpendicular
    };
  }
  transformPoints(t) {
    return this.points.map((e) => e.transformAsPoint(t));
  }
  /**
   * Return the tangent of the point that sits at the provided t value on the
   * curve.
   *
   * @param t - The t value at which to evaluate the curve.
   */
  tangent(t) {
    return this.curve.evalDerivative(t).normalized;
  }
  draw(t, e = 0, r = 1, i = !0) {
    let a = null, h = e, u = r, m = this.points;
    if (e !== 0 || r !== 1) {
      const F = this.length * e, X = this.length * r;
      h = this.pointSampler.distanceToT(F), u = this.pointSampler.distanceToT(X);
      const tt = (u - h) / (1 - h), [, at] = this.split(h);
      [a] = at.split(tt), m = a.points;
    }
    i && Pr(t, m[0]), (a ?? this).doDraw(t);
    const y = this.tangent(h), S = this.tangent(u);
    return [
      {
        position: m[0],
        tangent: y,
        normal: y.perpendicular
      },
      {
        position: m.at(-1),
        tangent: S,
        normal: S.perpendicular
      }
    ];
  }
}
var xu = globalThis && globalThis.__decorate || function(s, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
    a = Reflect.decorate(s, t, e, r);
  else
    for (var u = s.length - 1; u >= 0; u--)
      (h = s[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
class se extends wu {
  get points() {
    return [this.p0, this.p1, this.p2, this.p3];
  }
  constructor(t, e, r, i) {
    super(new He(
      t,
      // 3*(-p0+p1)
      t.flipped.add(e).scale(3),
      // 3*p0-6*p1+3*p2
      t.scale(3).sub(e.scale(6)).add(r.scale(3)),
      // -p0+3*p1-3*p2+p3
      t.flipped.add(e.scale(3)).sub(r.scale(3)).add(i)
    ), se.getLength(t, e, r, i)), this.p0 = t, this.p1 = e, this.p2 = r, this.p3 = i;
  }
  split(t) {
    const e = new g(this.p0.x + (this.p1.x - this.p0.x) * t, this.p0.y + (this.p1.y - this.p0.y) * t), r = new g(this.p1.x + (this.p2.x - this.p1.x) * t, this.p1.y + (this.p2.y - this.p1.y) * t), i = new g(this.p2.x + (this.p3.x - this.p2.x) * t, this.p2.y + (this.p3.y - this.p2.y) * t), a = new g(e.x + (r.x - e.x) * t, e.y + (r.y - e.y) * t), h = new g(r.x + (i.x - r.x) * t, r.y + (i.y - r.y) * t), u = new g(a.x + (h.x - a.x) * t, a.y + (h.y - a.y) * t), m = new se(this.p0, e, a, u), y = new se(u, h, i, this.p3);
    return [m, y];
  }
  doDraw(t) {
    uu(t, this.p1, this.p2, this.p3);
  }
  static getLength(t, e, r, i) {
    return se.el.setAttribute("d", `M ${t.x} ${t.y} C ${e.x} ${e.y} ${r.x} ${r.y} ${i.x} ${i.y}`), se.el.getTotalLength();
  }
}
xu([
  Sr(() => document.createElementNS("http://www.w3.org/2000/svg", "path"))
], se, "el", void 0);
class dr extends Rs {
  constructor(t, e) {
    super(), this.from = t, this.to = e, this.vector = e.sub(t), this.length = this.vector.magnitude, this.normal = this.vector.perpendicular.normalized.safe, this.points = [t, e];
  }
  get arcLength() {
    return this.length;
  }
  draw(t, e = 0, r = 1, i = !1) {
    const a = this.from.add(this.vector.scale(e)), h = this.from.add(this.vector.scale(r));
    return i && Pr(t, a), Xt(t, h), [
      {
        position: a,
        tangent: this.normal.flipped,
        normal: this.normal
      },
      {
        position: h,
        tangent: this.normal,
        normal: this.normal
      }
    ];
  }
  getPoint(t) {
    return {
      position: this.from.add(this.vector.scale(t)),
      tangent: this.normal.flipped,
      normal: this.normal
    };
  }
}
function Cu(s, t, e, r) {
  const i = {
    arcLength: 0,
    segments: [],
    minSin: 1
  }, a = ne(t.top, t.right, t.left, s), h = ne(t.right, t.top, t.bottom, s), u = ne(t.bottom, t.left, t.right, s), m = ne(t.left, t.bottom, t.top, s);
  let y = new g(s.left + a, s.top), S = new g(s.right - h, s.top);
  return _e(i, new dr(y, S)), y = new g(s.right, s.top + h), S = new g(s.right, s.bottom - u), h > 0 && gr(i, y.addX(-h), h, g.down, g.right, e, r), _e(i, new dr(y, S)), y = new g(s.right - u, s.bottom), S = new g(s.left + m, s.bottom), u > 0 && gr(i, y.addY(-u), u, g.right, g.up, e, r), _e(i, new dr(y, S)), y = new g(s.left, s.bottom - m), S = new g(s.left, s.top + a), m > 0 && gr(i, y.addX(m), m, g.up, g.left, e, r), _e(i, new dr(y, S)), y = new g(s.left + a, s.top), a > 0 && gr(i, y.addY(a), a, g.left, g.down, e, r), i;
}
function _e(s, t) {
  s.segments.push(t), s.arcLength += t.arcLength;
}
function gr(s, t, e, r, i, a, h) {
  const u = t.add(r.scale(e)), m = t.add(i.scale(e));
  a ? _e(s, new se(u, u.add(i.scale(h * e)), m.add(r.scale(h * e)), m)) : _e(s, new bu(t, e, r, i, !1));
}
var Ke = globalThis && globalThis.__decorate || function(s, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
    a = Reflect.decorate(s, t, e, r);
  else
    for (var u = s.length - 1; u >= 0; u--)
      (h = s[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
let Zt = class extends St {
  constructor(t) {
    super(t);
  }
  profile() {
    return Cu(this.childrenBBox(), this.radius(), this.smoothCorners(), this.cornerSharpness());
  }
  desiredSize() {
    return {
      x: this.width.context.getter(),
      y: this.height.context.getter()
    };
  }
  offsetComputedLayout(t) {
    return t;
  }
  childrenBBox() {
    return H.fromSizeCentered(this.computedSize());
  }
  getPath() {
    if (this.requiresProfile())
      return this.curveDrawingInfo().path;
    const t = new Path2D(), e = this.radius(), r = this.smoothCorners(), i = this.cornerSharpness(), a = H.fromSizeCentered(this.size());
    return bi(t, a, e, r, i), t;
  }
  getCacheBBox() {
    return super.getCacheBBox().expand(this.rippleSize());
  }
  getRipplePath() {
    const t = new Path2D(), e = this.rippleSize(), r = this.radius().addScalar(e), i = this.smoothCorners(), a = this.cornerSharpness(), h = H.fromSizeCentered(this.size()).expand(e);
    return bi(t, h, r, i, a), t;
  }
};
Ke([
  Mr("radius")
], Zt.prototype, "radius", void 0);
Ke([
  A(!1),
  R()
], Zt.prototype, "smoothCorners", void 0);
Ke([
  A(0.6),
  R()
], Zt.prototype, "cornerSharpness", void 0);
Ke([
  z()
], Zt.prototype, "profile", null);
Zt = Ke([
  Jt("Rect")
], Zt);
var ue = globalThis && globalThis.__decorate || function(s, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
    a = Reflect.decorate(s, t, e, r);
  else
    for (var u = s.length - 1; u >= 0; u--)
      (h = s[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
};
class zt extends E {
  constructor({ children: t, ...e }) {
    super(e), this.scene() || this.scene(new E({})), t && this.scene().add(t);
  }
  getZoom() {
    return 1 / this.scale.x();
  }
  setZoom(t) {
    this.scale(we(t, (e) => 1 / e));
  }
  getDefaultZoom() {
    return this.scale.x.context.getInitial();
  }
  *tweenZoom(t, e, r, i) {
    const a = this.scale.x();
    yield* _t(e, (h) => {
      this.zoom(1 / i(a, 1 / Te(t), r(h)));
    });
  }
  /**
   * Resets the camera's position, rotation and zoom level to their original
   * values.
   *
   * @param duration - The duration of the tween.
   * @param timingFunction - The timing function to use for the tween.
   */
  *reset(t, e = Ft) {
    yield* ye(this.position(De, t, e), this.zoom(De, t, e), this.rotation(De, t, e));
  }
  *centerOn(t, e, r = Ft, i = g.lerp) {
    const a = t instanceof E ? t.absolutePosition().transformAsPoint(this.scene().worldToLocal()) : t;
    yield* this.position(a, e, r, i);
  }
  /**
   * Makes the camera follow a path specified by the provided curve.
   *
   * @remarks
   * This will not change the orientation of the camera. To make the camera
   * orient itself along the curve, use {@link followCurveWithRotation} or
   * {@link followCurveWithRotationReverse}.
   *
   * If you want to follow the curve in reverse, use {@link followCurveReverse}.
   *
   * @param curve - The curve to follow.
   * @param duration - The duration of the tween.
   * @param timing - The timing function to use for the tween.
   */
  *followCurve(t, e, r = Ft) {
    yield* _t(e, (i) => {
      const a = r(i), h = t.getPointAtPercentage(a).position.transformAsPoint(t.localToWorld());
      this.position(h);
    });
  }
  /**
   * Makes the camera follow a path specified by the provided curve in reverse.
   *
   * @remarks
   * This will not change the orientation of the camera. To make the camera
   * orient itself along the curve, use {@link followCurveWithRotation} or
   * {@link followCurveWithRotationReverse}.
   *
   * If you want to follow the curve forward, use {@link followCurve}.
   *
   * @param curve - The curve to follow.
   * @param duration - The duration of the tween.
   * @param timing - The timing function to use for the tween.
   */
  *followCurveReverse(t, e, r = Ft) {
    yield* _t(e, (i) => {
      const a = 1 - r(i), h = t.getPointAtPercentage(a).position.transformAsPoint(t.localToWorld());
      this.position(h);
    });
  }
  /**
   * Makes the camera follow a path specified by the provided curve while
   * pointing the camera the direction of the tangent.
   *
   * @remarks
   * To make the camera follow the curve without changing its orientation, use
   * {@link followCurve} or {@link followCurveReverse}.
   *
   * If you want to follow the curve in reverse, use
   * {@link followCurveWithRotationReverse}.
   *
   * @param curve - The curve to follow.
   * @param duration - The duration of the tween.
   * @param timing - The timing function to use for the tween.
   */
  *followCurveWithRotation(t, e, r = Ft) {
    yield* _t(e, (i) => {
      const a = r(i), { position: h, normal: u } = t.getPointAtPercentage(a), m = h.transformAsPoint(t.localToWorld()), y = u.flipped.perpendicular.degrees;
      this.position(m), this.rotation(y);
    });
  }
  /**
   * Makes the camera follow a path specified by the provided curve in reverse
   * while pointing the camera the direction of the tangent.
   *
   * @remarks
   * To make the camera follow the curve without changing its orientation, use
   * {@link followCurve} or {@link followCurveReverse}.
   *
   * If you want to follow the curve forward, use
   * {@link followCurveWithRotation}.
   *
   * @param curve - The curve to follow.
   * @param duration - The duration of the tween.
   * @param timing - The timing function to use for the tween.
   */
  *followCurveWithRotationReverse(t, e, r = Ft) {
    yield* _t(e, (i) => {
      const a = 1 - r(i), { position: h, normal: u } = t.getPointAtPercentage(a), m = h.transformAsPoint(t.localToWorld()), y = u.flipped.perpendicular.degrees;
      this.position(m), this.rotation(y);
    });
  }
  transformContext(t) {
    const e = this.localToParent().inverse();
    t.transform(e.a, e.b, e.c, e.d, e.e, e.f);
  }
  hit(t) {
    const e = t.transformAsPoint(this.localToParent());
    return this.scene().hit(e);
  }
  drawChildren(t) {
    this.scene().drawChildren(t);
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  static Stage({ children: t, cameraRef: e, scene: r, ...i }) {
    const a = new zt({ scene: r, children: t });
    return e == null || e(a), new Zt({
      clip: !0,
      ...i,
      children: [a]
    });
  }
}
ue([
  R()
], zt.prototype, "scene", void 0);
ue([
  Re(!1),
  R()
], zt.prototype, "zoom", void 0);
ue([
  ct()
], zt.prototype, "reset", null);
ue([
  ct()
], zt.prototype, "centerOn", null);
ue([
  ct()
], zt.prototype, "followCurve", null);
ue([
  ct()
], zt.prototype, "followCurveReverse", null);
ue([
  ct()
], zt.prototype, "followCurveWithRotation", null);
ue([
  ct()
], zt.prototype, "followCurveWithRotationReverse", null);
var tr = globalThis && globalThis.__decorate || function(s, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
    a = Reflect.decorate(s, t, e, r);
  else
    for (var u = s.length - 1; u >= 0; u--)
      (h = s[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, fs;
let ae = fs = class extends Zt {
  constructor(t) {
    super({
      composite: !0,
      fontFamily: "Roboto",
      fontSize: 48,
      lineHeight: "120%",
      textWrap: !1,
      fontStyle: "normal",
      ...t
    }), this.view2D = this, fs.shadowRoot.append(this.element), this.applyFlex();
  }
  dispose() {
    this.removeChildren(), super.dispose();
  }
  render(t) {
    this.computedSize(), this.computedPosition(), super.render(t);
  }
  /**
   * Find a node by its key.
   *
   * @param key - The key of the node.
   */
  findKey(t) {
    return vr().getNode(t) ?? null;
  }
  requestLayoutUpdate() {
    this.updateLayout();
  }
  requestFontUpdate() {
    this.applyFont();
  }
  view() {
    return this;
  }
};
tr([
  A(Ye.Paused),
  R()
], ae.prototype, "playbackState", void 0);
tr([
  A(0),
  R()
], ae.prototype, "globalTime", void 0);
tr([
  R()
], ae.prototype, "assetHash", void 0);
tr([
  Sr(() => {
    const s = "motion-canvas-2d-frame";
    let t = document.querySelector(`#${s}`);
    return t || (t = document.createElement("div"), t.id = s, t.style.position = "absolute", t.style.pointerEvents = "none", t.style.top = "0", t.style.left = "0", t.style.opacity = "0", t.style.overflow = "hidden", document.body.prepend(t)), t.shadowRoot ?? t.attachShadow({ mode: "open" });
  })
], ae, "shadowRoot", void 0);
ae = fs = tr([
  Jt("View2D")
], ae);
var fe = globalThis && globalThis.__decorate || function(s, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
    a = Reflect.decorate(s, t, e, r);
  else
    for (var u = s.length - 1; u >= 0; u--)
      (h = s[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, yr;
let Nt = yr = class extends Zt {
  constructor(t) {
    super(t), "src" in t || ut().warn({
      message: "No source specified for the image",
      remarks: `<p>The image won&#39;t be visible unless you specify a source:</p>
<pre class=""><code class="language-tsx"><span class="hljs-keyword">import</span> myImage <span class="hljs-keyword">from</span> <span class="hljs-string">&#x27;./example.png&#x27;</span>;
<span class="hljs-comment">// ...</span>
<span class="language-xml"><span class="hljs-tag">&lt;<span class="hljs-name">Img</span> <span class="hljs-attr">src</span>=<span class="hljs-string">{myImage}</span> /&gt;</span></span>;</code></pre><p>If you did this intentionally, and don&#39;t want to see this warning, set the <code>src</code>
property to <code>null</code>:</p>
<pre class=""><code class="language-tsx">&lt;<span class="hljs-title class_">Img</span> src={<span class="hljs-literal">null</span>} /&gt;</code></pre><p><a href='https://motioncanvas.io/docs/media#images' target='_blank'>Learn more</a> about working with
images.</p>
`,
      inspect: this.key
    });
  }
  desiredSize() {
    const t = super.desiredSize();
    if (t.x === null && t.y === null) {
      const e = this.image();
      return {
        x: e.naturalWidth,
        y: e.naturalHeight
      };
    }
    return t;
  }
  image() {
    const t = this.src();
    let e = "", r = "";
    if (t) {
      r = Cc(t);
      const a = new URL(r, window.location.origin);
      if (a.origin === window.location.origin) {
        const h = this.view().assetHash();
        a.searchParams.set("asset-hash", h);
      }
      e = a.toString();
    }
    let i = yr.pool[r];
    return i || (i = document.createElement("img"), i.crossOrigin = "anonymous", i.src = e, yr.pool[r] = i), i.complete || ot.collectPromise(new Promise((a, h) => {
      i.addEventListener("load", a), i.addEventListener("error", () => h(new ds({
        message: "Failed to load an image",
        remarks: `The <code>src</code> property was set to:
<pre><code>${t}</code></pre>
...which resolved to the following url:
<pre><code>${e}</code></pre>
Make sure that source is correct and that the image exists.<br/>
<a target='_blank' href='https://motioncanvas.io/docs/media#images'>Learn more</a>
about working with images.`,
        inspect: this.key
      })));
    })), i;
  }
  imageCanvas() {
    const t = document.createElement("canvas").getContext("2d", { willReadFrequently: !0 });
    if (!t)
      throw new Error("Could not create an image canvas");
    return t;
  }
  filledImageCanvas() {
    const t = this.imageCanvas(), e = this.image();
    return t.canvas.width = e.naturalWidth, t.canvas.height = e.naturalHeight, t.imageSmoothingEnabled = this.smoothing(), t.drawImage(e, 0, 0), t;
  }
  draw(t) {
    this.drawShape(t);
    const e = this.alpha();
    if (e > 0) {
      const r = H.fromSizeCentered(this.computedSize());
      t.save(), t.clip(this.getPath()), e < 1 && (t.globalAlpha *= e), t.imageSmoothingEnabled = this.smoothing(), lu(t, this.image(), r), t.restore();
    }
    this.clip() && t.clip(this.getPath()), this.drawChildren(t);
  }
  applyFlex() {
    super.applyFlex();
    const t = this.image();
    this.element.style.aspectRatio = (this.ratio() ?? t.naturalWidth / t.naturalHeight).toString();
  }
  /**
   * Get color of the image at the given position.
   *
   * @param position - The position in local space at which to sample the color.
   */
  getColorAtPoint(t) {
    const e = this.computedSize(), r = this.naturalSize(), i = new g(t).add(this.computedSize().scale(0.5)).mul(r.div(e).safe);
    return this.getPixelColor(i);
  }
  /**
   * The natural size of this image.
   *
   * @remarks
   * The natural size is the size of the source image unaffected by the size
   * and scale properties.
   */
  naturalSize() {
    const t = this.image();
    return new g(t.naturalWidth, t.naturalHeight);
  }
  /**
   * Get color of the image at the given pixel.
   *
   * @param position - The pixel's position.
   */
  getPixelColor(t) {
    const e = this.filledImageCanvas(), r = new g(t), i = e.getImageData(r.x, r.y, 1, 1).data;
    return new Yt({
      r: i[0],
      g: i[1],
      b: i[2],
      a: i[3] / 255
    });
  }
  collectAsyncResources() {
    super.collectAsyncResources(), this.image();
  }
};
Nt.pool = {};
fe([
  R()
], Nt.prototype, "src", void 0);
fe([
  A(1),
  R()
], Nt.prototype, "alpha", void 0);
fe([
  A(!0),
  R()
], Nt.prototype, "smoothing", void 0);
fe([
  z()
], Nt.prototype, "image", null);
fe([
  z()
], Nt.prototype, "imageCanvas", null);
fe([
  z()
], Nt.prototype, "filledImageCanvas", null);
fe([
  z()
], Nt.prototype, "naturalSize", null);
Nt = yr = fe([
  Jt("Img")
], Nt);
var er = globalThis && globalThis.__decorate || function(s, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
    a = Reflect.decorate(s, t, e, r);
  else
    for (var u = s.length - 1; u >= 0; u--)
      (h = s[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, wr;
let Rt = wr = class extends mt {
  constructor({ children: t, ...e }) {
    super(e), t && this.text(t);
  }
  parentTxt() {
    const t = this.parent();
    return t instanceof oe ? t : null;
  }
  draw(t) {
    this.requestFontUpdate(), this.applyStyle(t), this.applyText(t), t.font = this.styles.font, t.textBaseline = "bottom", "letterSpacing" in t && (t.letterSpacing = `${this.letterSpacing()}px`);
    const e = t.measureText("").fontBoundingBoxAscent, r = this.element.getBoundingClientRect(), { width: i, height: a } = this.size(), h = document.createRange();
    let u = "";
    const m = new H();
    for (const y of this.element.childNodes) {
      if (!y.textContent)
        continue;
      h.selectNodeContents(y);
      const S = h.getBoundingClientRect(), F = i / -2 + S.left - r.left, X = a / -2 + S.top - r.top + e;
      m.y === X ? (m.width += S.width, u += y.textContent) : (this.drawText(t, u, m), m.x = F, m.y = X, m.width = S.width, m.height = S.height, u = y.textContent);
    }
    this.drawText(t, u, m);
  }
  drawText(t, e, r) {
    const i = r.y;
    e = e.replace(/\s+/g, " "), this.lineWidth() <= 0 ? t.fillText(e, r.x, i) : this.strokeFirst() ? (t.strokeText(e, r.x, i), t.fillText(e, r.x, i)) : (t.fillText(e, r.x, i), t.strokeText(e, r.x, i));
  }
  getCacheBBox() {
    const t = this.computedSize(), e = document.createRange();
    e.selectNodeContents(this.element);
    const r = e.getBoundingClientRect(), i = this.lineWidth(), a = this.lineJoin() === "miter" ? 0.5 * 10 : 0.5;
    return new H(-t.width / 2, -t.height / 2, r.width, r.height).expand([0, this.fontSize() * 0.5]).expand(i * a);
  }
  applyFlex() {
    super.applyFlex(), this.element.style.display = "inline";
  }
  updateLayout() {
    if (this.applyFont(), this.applyFlex(), this.justifyContent.isInitial() && (this.element.style.justifyContent = this.styles.getPropertyValue("text-align")), this.styles.whiteSpace !== "nowrap" && this.styles.whiteSpace !== "pre")
      if (this.element.innerText = "", wr.segmenter)
        for (const e of wr.segmenter.segment(this.text()))
          this.element.appendChild(document.createTextNode(e.segment));
      else
        for (const e of this.text().split(""))
          this.element.appendChild(document.createTextNode(e));
    else if (this.styles.whiteSpace === "pre") {
      this.element.innerText = "";
      for (const e of this.text().split(`
`))
        this.element.appendChild(document.createTextNode(e + `
`));
    } else
      this.element.innerText = this.text();
  }
};
er([
  A(""),
  Cs(Li),
  R()
], Rt.prototype, "text", void 0);
er([
  z()
], Rt.prototype, "parentTxt", null);
er([
  Sr(() => {
    const s = document.createElement("span");
    return ae.shadowRoot.append(s), s;
  })
], Rt, "formatter", void 0);
er([
  Sr(() => {
    try {
      return new Intl.Segmenter(void 0, {
        granularity: "grapheme"
      });
    } catch {
      return null;
    }
  })
], Rt, "segmenter", void 0);
Rt = wr = er([
  Jt("TxtLeaf")
], Rt);
[
  "fill",
  "stroke",
  "lineWidth",
  "strokeFirst",
  "lineCap",
  "lineJoin",
  "lineDash",
  "lineDashOffset"
].forEach((s) => {
  Rt.prototype[`get${be(s)}`] = function() {
    var t;
    return ((t = this.parentTxt()) == null ? void 0 : t[s]()) ?? this[s].context.getInitial();
  };
});
var rr = globalThis && globalThis.__decorate || function(s, t, e, r) {
  var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, e) : r, h;
  if (typeof Reflect == "object" && typeof Reflect.decorate == "function")
    a = Reflect.decorate(s, t, e, r);
  else
    for (var u = s.length - 1; u >= 0; u--)
      (h = s[u]) && (a = (i < 3 ? h(a) : i > 3 ? h(t, e, a) : h(t, e)) || a);
  return i > 3 && a && Object.defineProperty(t, e, a), a;
}, ve;
let oe = ve = class extends mt {
  /**
   * Create a bold text node.
   *
   * @remarks
   * This is a shortcut for
   * ```tsx
   * <Txt fontWeight={700} />
   * ```
   *
   * @param props - Additional text properties.
   */
  static b(t) {
    return new ve({ ...t, fontWeight: 700 });
  }
  /**
   * Create an italic text node.
   *
   * @remarks
   * This is a shortcut for
   * ```tsx
   * <Txt fontStyle={'italic'} />
   * ```
   *
   * @param props - Additional text properties.
   */
  static i(t) {
    return new ve({ ...t, fontStyle: "italic" });
  }
  getText() {
    return this.innerText();
  }
  setText(t) {
    const e = this.children();
    let r = null;
    for (let i = 0; i < e.length; i++) {
      const a = e[i];
      r === null && a instanceof Rt ? r = a : a.parent(null);
    }
    r === null ? (r = new Rt({ text: t }), r.parent(this)) : r.text(t), this.setParsedChildren([r]);
  }
  setChildren(t) {
    this.children.context.raw() !== t && (typeof t == "string" ? this.text(t) : super.setChildren(t));
  }
  *tweenText(t, e, r, i) {
    const a = this.children();
    (a.length !== 1 || !(a[0] instanceof Rt)) && this.text.save();
    const h = this.childAs(0), u = h.text.context.raw(), m = this.size.context.raw();
    h.text(t);
    const y = this.size();
    h.text(u ?? De), this.height() === 0 && this.height(y.height), yield* ye(this.size(y, e, r), h.text(t, e, r, i)), this.children.context.setter(t), this.size(m);
  }
  getLayout() {
    return !0;
  }
  constructor({ children: t, text: e, ...r }) {
    super(r), this.children(e ?? t);
  }
  innerText() {
    const t = this.childrenAs();
    let e = "";
    for (const r of t)
      e += r.text();
    return e;
  }
  parentTxt() {
    const t = this.parent();
    return t instanceof ve ? t : null;
  }
  parseChildren(t) {
    const e = [], r = Array.isArray(t) ? t : [t];
    for (const i of r)
      i instanceof ve || i instanceof Rt ? e.push(i) : typeof i == "string" && e.push(new Rt({ text: i }));
    return e;
  }
  applyFlex() {
    super.applyFlex(), this.element.style.display = this.findAncestor(ks(ve)) ? "inline" : "block";
  }
  draw(t) {
    this.drawChildren(t);
  }
};
rr([
  A(""),
  R()
], oe.prototype, "text", void 0);
rr([
  ct()
], oe.prototype, "tweenText", null);
rr([
  z()
], oe.prototype, "innerText", null);
rr([
  z()
], oe.prototype, "parentTxt", null);
oe = ve = rr([
  Jt("Txt")
], oe);
[
  "fill",
  "stroke",
  "lineWidth",
  "strokeFirst",
  "lineCap",
  "lineJoin",
  "lineDash",
  "lineDashOffset"
].forEach((s) => {
  oe.prototype[`getDefault${be(s)}`] = function(t) {
    var e;
    return ((e = this.parentTxt()) == null ? void 0 : e[s]()) ?? t;
  };
});
class Tu extends Uc {
  constructor(t) {
    super(t), this.view = null, this.registeredNodes = /* @__PURE__ */ new Map(), this.nodeCounters = /* @__PURE__ */ new Map(), this.assetHash = Date.now().toString(), this.recreateView();
  }
  getView() {
    return this.view;
  }
  next() {
    var t;
    return (t = this.getView()) == null || t.playbackState(this.playback.state).globalTime(this.playback.time), super.next();
  }
  draw(t) {
    t.save(), this.renderLifecycle.dispatch([jt.BeforeRender, t]), t.save(), this.renderLifecycle.dispatch([jt.BeginRender, t]), this.getView().playbackState(this.playback.state).globalTime(this.playback.time), this.getView().render(t), this.renderLifecycle.dispatch([jt.FinishRender, t]), t.restore(), this.renderLifecycle.dispatch([jt.AfterRender, t]), t.restore();
  }
  reset(t) {
    for (const e of this.registeredNodes.keys())
      try {
        this.registeredNodes.get(e).dispose();
      } catch (r) {
        this.logger.error(r);
      }
    return this.registeredNodes.clear(), this.registeredNodes = /* @__PURE__ */ new Map(), this.nodeCounters.clear(), this.recreateView(), super.reset(t);
  }
  inspectPosition(t, e) {
    return this.execute(() => {
      var r;
      return ((r = this.getView().hit(new g(t, e))) == null ? void 0 : r.key) ?? null;
    });
  }
  validateInspection(t) {
    var e;
    return ((e = this.getNode(t)) == null ? void 0 : e.key) ?? null;
  }
  inspectAttributes(t) {
    const e = this.getNode(t);
    if (!e)
      return null;
    const r = {
      stack: e.creationStack,
      key: e.key
    };
    for (const { key: i, meta: a, signal: h } of e)
      a.inspectable && (r[i] = h());
    return r;
  }
  drawOverlay(t, e, r) {
    const i = this.getNode(t);
    i && this.execute(() => {
      const a = this.getView().findAll(ks(zt)), h = [];
      for (const u of a) {
        const m = u.scene();
        m && (m === i || m.findFirst((y) => y === i)) && h.push(u);
      }
      if (h.length > 0)
        for (const u of h) {
          const m = u.parentToWorld(), y = u.localToParent().inverse(), S = i.localToWorld();
          i.drawOverlay(r, e.multiply(m).multiply(y).multiply(S));
        }
      else
        i.drawOverlay(r, e.multiply(i.localToWorld()));
    });
  }
  transformMousePosition(t, e) {
    return new g(t, e).transformAsPoint(this.getView().localToParent().inverse());
  }
  registerNode(t, e) {
    var h;
    const r = ((h = t.constructor) == null ? void 0 : h.name) ?? "unknown", i = (this.nodeCounters.get(r) ?? 0) + 1;
    this.nodeCounters.set(r, i), e && this.registeredNodes.has(e) && (ut().error({
      message: `Duplicated node key: "${e}".`,
      inspect: e,
      stack: new Error().stack
    }), e = void 0), e ?? (e = `${this.name}/${r}[${i}]`), this.registeredNodes.set(e, t);
    const a = this.registeredNodes;
    return [e, () => a.delete(e)];
  }
  getNode(t) {
    return typeof t != "string" ? null : this.registeredNodes.get(t) ?? null;
  }
  *getDetachedNodes() {
    for (const t of this.registeredNodes.values())
      !t.parent() && t !== this.view && (yield t);
  }
  recreateView() {
    this.execute(() => {
      const t = this.getSize();
      this.view = new ae({
        position: t.scale(this.resolutionScale / 2),
        scale: this.resolutionScale,
        assetHash: this.assetHash,
        size: t
      });
    });
  }
}
function Du(s) {
  return {
    klass: Tu,
    config: s,
    stack: new Error().stack,
    meta: Gc(),
    plugins: ["@motion-canvas/2d/editor"]
  };
}
let Ps;
Ps ?? (Ps = new ys("\0virtual:settings", !1));
Ps.loadData({});
const ju = Ps;
export {
  Ru as A,
  H as B,
  bu as C,
  le as D,
  ki as E,
  Nt as I,
  dr as L,
  ys as M,
  Zt as R,
  oe as T,
  g as V,
  ye as a,
  ku as b,
  Su as c,
  wt as d,
  St as e,
  Ne as f,
  ut as g,
  $ as h,
  Pr as i,
  Mu as j,
  cu as k,
  Xt as l,
  Du as m,
  hu as n,
  me as o,
  A as p,
  R as q,
  ct as r,
  ju as s,
  _t as t,
  Te as u,
  z as v,
  bs as w,
  Jt as x,
  Ft as y,
  Pu as z
};

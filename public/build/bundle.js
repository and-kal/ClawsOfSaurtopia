
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.48.0' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\Main.svelte generated by Svelte v3.48.0 */

    const file = "src\\Main.svelte";

    function create_fragment(ctx) {
    	let div0;
    	let img0;
    	let img0_src_value;
    	let t0;
    	let header;
    	let h1;
    	let t2;
    	let div1;
    	let t3;
    	let em0;
    	let t5;
    	let em1;
    	let t7;
    	let br0;
    	let t8;
    	let br1;
    	let t9;
    	let br2;
    	let t10;
    	let t11;
    	let main;
    	let div21;
    	let div2;
    	let h20;
    	let t12;
    	let br3;
    	let t13;
    	let br4;
    	let t14;
    	let t15;
    	let div5;
    	let div4;
    	let div3;
    	let t17;
    	let a0;
    	let t19;
    	let img1;
    	let img1_src_value;
    	let t20;
    	let div8;
    	let div7;
    	let div6;
    	let t22;
    	let img2;
    	let img2_src_value;
    	let t23;
    	let div11;
    	let div10;
    	let div9;
    	let t25;
    	let a1;
    	let t27;
    	let img3;
    	let img3_src_value;
    	let t28;
    	let div14;
    	let div13;
    	let div12;
    	let t30;
    	let a2;
    	let t32;
    	let img4;
    	let img4_src_value;
    	let t33;
    	let div17;
    	let div16;
    	let div15;
    	let t35;
    	let a3;
    	let t37;
    	let img5;
    	let img5_src_value;
    	let t38;
    	let div20;
    	let div19;
    	let div18;
    	let t40;
    	let img6;
    	let img6_src_value;
    	let t41;
    	let div47;
    	let div22;
    	let h21;
    	let t42;
    	let br5;
    	let t43;
    	let br6;
    	let t44;
    	let t45;
    	let div25;
    	let div24;
    	let div23;
    	let t47;
    	let a4;
    	let t49;
    	let img7;
    	let img7_src_value;
    	let t50;
    	let div28;
    	let div27;
    	let div26;
    	let t52;
    	let a5;
    	let t54;
    	let img8;
    	let img8_src_value;
    	let t55;
    	let div31;
    	let div30;
    	let div29;
    	let t57;
    	let a6;
    	let t59;
    	let img9;
    	let img9_src_value;
    	let t60;
    	let div34;
    	let div33;
    	let div32;
    	let t62;
    	let a7;
    	let t64;
    	let img10;
    	let img10_src_value;
    	let t65;
    	let div37;
    	let div36;
    	let div35;
    	let t67;
    	let a8;
    	let t69;
    	let img11;
    	let img11_src_value;
    	let t70;
    	let div40;
    	let div39;
    	let div38;
    	let t72;
    	let a9;
    	let t74;
    	let img12;
    	let img12_src_value;
    	let t75;
    	let div43;
    	let div42;
    	let div41;
    	let t77;
    	let a10;
    	let t79;
    	let img13;
    	let img13_src_value;
    	let t80;
    	let div46;
    	let div45;
    	let div44;
    	let t82;
    	let a11;
    	let t84;
    	let img14;
    	let img14_src_value;
    	let t85;
    	let footer;
    	let a12;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			img0 = element("img");
    			t0 = space();
    			header = element("header");
    			h1 = element("h1");
    			h1.textContent = "Claws Of Saurtopia #8 ~ May 27 + 28, 2022";
    			t2 = space();
    			div1 = element("div");
    			t3 = text("Hey dear noise heads! After a rather long hiatus, we are happy to be back\r\n    with another edition of the earpiercing, gutwrenching, jurassic ");
    			em0 = element("em");
    			em0.textContent = "Claws of Saurtopia";
    			t5 = text("\r\n    noise festival! Happening\r\n    ");
    			em1 = element("em");
    			em1.textContent = "May 27 and May 28, 2022 at ZXRX Leipzig";
    			t7 = text("!");
    			br0 = element("br");
    			t8 = text("\r\n    No presale!");
    			br1 = element("br");
    			t9 = text("\r\n    Just drop by and make sure to bring an official negative antigen test.");
    			br2 = element("br");
    			t10 = text("\r\n    Looking forward to seeing you all again!");
    			t11 = space();
    			main = element("main");
    			div21 = element("div");
    			div2 = element("div");
    			h20 = element("h2");
    			t12 = text("[Friday]");
    			br3 = element("br");
    			t13 = text("May 27, 2022");
    			br4 = element("br");
    			t14 = text("Doors: 20:00");
    			t15 = space();
    			div5 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			div3.textContent = "21:00";
    			t17 = space();
    			a0 = element("a");
    			a0.textContent = "YT";
    			t19 = space();
    			img1 = element("img");
    			t20 = space();
    			div8 = element("div");
    			div7 = element("div");
    			div6 = element("div");
    			div6.textContent = "22:00";
    			t22 = space();
    			img2 = element("img");
    			t23 = space();
    			div11 = element("div");
    			div10 = element("div");
    			div9 = element("div");
    			div9.textContent = "22:30";
    			t25 = space();
    			a1 = element("a");
    			a1.textContent = "BC";
    			t27 = space();
    			img3 = element("img");
    			t28 = space();
    			div14 = element("div");
    			div13 = element("div");
    			div12 = element("div");
    			div12.textContent = "23:15";
    			t30 = space();
    			a2 = element("a");
    			a2.textContent = "YT";
    			t32 = space();
    			img4 = element("img");
    			t33 = space();
    			div17 = element("div");
    			div16 = element("div");
    			div15 = element("div");
    			div15.textContent = "24:00";
    			t35 = space();
    			a3 = element("a");
    			a3.textContent = "BC";
    			t37 = space();
    			img5 = element("img");
    			t38 = space();
    			div20 = element("div");
    			div19 = element("div");
    			div18 = element("div");
    			div18.textContent = "24:45";
    			t40 = space();
    			img6 = element("img");
    			t41 = space();
    			div47 = element("div");
    			div22 = element("div");
    			h21 = element("h2");
    			t42 = text("[Saturday]");
    			br5 = element("br");
    			t43 = text("May 28, 2022");
    			br6 = element("br");
    			t44 = text("Doors: 20:00");
    			t45 = space();
    			div25 = element("div");
    			div24 = element("div");
    			div23 = element("div");
    			div23.textContent = "21:00";
    			t47 = space();
    			a4 = element("a");
    			a4.textContent = "BC";
    			t49 = space();
    			img7 = element("img");
    			t50 = space();
    			div28 = element("div");
    			div27 = element("div");
    			div26 = element("div");
    			div26.textContent = "22:00";
    			t52 = space();
    			a5 = element("a");
    			a5.textContent = "SC";
    			t54 = space();
    			img8 = element("img");
    			t55 = space();
    			div31 = element("div");
    			div30 = element("div");
    			div29 = element("div");
    			div29.textContent = "22:45";
    			t57 = space();
    			a6 = element("a");
    			a6.textContent = "BC";
    			t59 = space();
    			img9 = element("img");
    			t60 = space();
    			div34 = element("div");
    			div33 = element("div");
    			div32 = element("div");
    			div32.textContent = "23:30";
    			t62 = space();
    			a7 = element("a");
    			a7.textContent = "BC";
    			t64 = space();
    			img10 = element("img");
    			t65 = space();
    			div37 = element("div");
    			div36 = element("div");
    			div35 = element("div");
    			div35.textContent = "24:15";
    			t67 = space();
    			a8 = element("a");
    			a8.textContent = "GH";
    			t69 = space();
    			img11 = element("img");
    			t70 = space();
    			div40 = element("div");
    			div39 = element("div");
    			div38 = element("div");
    			div38.textContent = "24:45";
    			t72 = space();
    			a9 = element("a");
    			a9.textContent = "BC";
    			t74 = space();
    			img12 = element("img");
    			t75 = space();
    			div43 = element("div");
    			div42 = element("div");
    			div41 = element("div");
    			div41.textContent = "25:30";
    			t77 = space();
    			a10 = element("a");
    			a10.textContent = "SC";
    			t79 = space();
    			img13 = element("img");
    			t80 = space();
    			div46 = element("div");
    			div45 = element("div");
    			div44 = element("div");
    			div44.textContent = "27:00";
    			t82 = space();
    			a11 = element("a");
    			a11.textContent = "SC";
    			t84 = space();
    			img14 = element("img");
    			t85 = space();
    			footer = element("footer");
    			a12 = element("a");
    			a12.textContent = "🦖 🖱Archive 🦕";
    			if (!src_url_equal(img0.src, img0_src_value = "./assets/typo-bands-min/clawsofsaurtopianoisefest8.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "Orange-blue poster for Claws Of Saurtopia festival 2022");
    			attr_dev(img0, "class", "svelte-1d7x5bi");
    			add_location(img0, file, 3, 0, 39);
    			attr_dev(div0, "id", "hero");
    			attr_dev(div0, "class", "svelte-1d7x5bi");
    			add_location(div0, file, 2, 0, 21);
    			h1.hidden = true;
    			add_location(h1, file, 9, 2, 198);
    			attr_dev(em0, "class", "svelte-1d7x5bi");
    			add_location(em0, file, 13, 68, 415);
    			attr_dev(em1, "class", "svelte-1d7x5bi");
    			add_location(em1, file, 17, 4, 493);
    			add_location(br0, file, 17, 53, 542);
    			add_location(br1, file, 18, 15, 565);
    			add_location(br2, file, 19, 74, 647);
    			attr_dev(div1, "class", "svelte-1d7x5bi");
    			add_location(div1, file, 11, 2, 261);
    			attr_dev(header, "class", "svelte-1d7x5bi");
    			add_location(header, file, 8, 0, 186);
    			attr_dev(br3, "class", "svelte-1d7x5bi");
    			add_location(br3, file, 26, 18, 814);
    			attr_dev(br4, "class", "svelte-1d7x5bi");
    			add_location(br4, file, 26, 36, 832);
    			attr_dev(h20, "class", "svelte-1d7x5bi");
    			add_location(h20, file, 26, 6, 802);
    			attr_dev(div2, "class", "date-head svelte-1d7x5bi");
    			add_location(div2, file, 25, 4, 771);
    			attr_dev(div3, "class", "svelte-1d7x5bi");
    			add_location(div3, file, 30, 8, 924);
    			attr_dev(a0, "href", "https://youtu.be/RSVMNu6pQw8+");
    			attr_dev(a0, "class", "svelte-1d7x5bi");
    			add_location(a0, file, 31, 8, 950);
    			attr_dev(div4, "class", "svelte-1d7x5bi");
    			add_location(div4, file, 29, 6, 909);
    			if (!src_url_equal(img1.src, img1_src_value = "./assets/typo-bands-min/sttoupet.min.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "band logo of sttoupet");
    			attr_dev(img1, "class", "svelte-1d7x5bi");
    			add_location(img1, file, 33, 6, 1018);
    			attr_dev(div5, "class", "slot-container svelte-1d7x5bi");
    			add_location(div5, file, 28, 4, 873);
    			attr_dev(div6, "class", "svelte-1d7x5bi");
    			add_location(div6, file, 40, 8, 1194);
    			attr_dev(div7, "class", "svelte-1d7x5bi");
    			add_location(div7, file, 39, 6, 1179);
    			if (!src_url_equal(img2.src, img2_src_value = "./assets/typo-bands-min/icmefur.min.png")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "band logo of icmefur");
    			attr_dev(img2, "class", "svelte-1d7x5bi");
    			add_location(img2, file, 43, 6, 1264);
    			attr_dev(div8, "class", "slot-container svelte-1d7x5bi");
    			add_location(div8, file, 38, 4, 1143);
    			attr_dev(div9, "class", "svelte-1d7x5bi");
    			add_location(div9, file, 50, 8, 1438);
    			attr_dev(a1, "href", "https://cesarpalace.bandcamp.com");
    			attr_dev(a1, "class", "svelte-1d7x5bi");
    			add_location(a1, file, 51, 8, 1464);
    			attr_dev(div10, "class", "svelte-1d7x5bi");
    			add_location(div10, file, 49, 6, 1423);
    			if (!src_url_equal(img3.src, img3_src_value = "./assets/typo-bands-min/cesarpalace.min.png")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "band logo of cesarpalace");
    			attr_dev(img3, "class", "svelte-1d7x5bi");
    			add_location(img3, file, 53, 6, 1535);
    			attr_dev(div11, "class", "slot-container svelte-1d7x5bi");
    			add_location(div11, file, 48, 4, 1387);
    			attr_dev(div12, "class", "svelte-1d7x5bi");
    			add_location(div12, file, 60, 8, 1717);
    			attr_dev(a2, "href", "https://youtu.be/ZpbreLDqeTA");
    			attr_dev(a2, "class", "svelte-1d7x5bi");
    			add_location(a2, file, 61, 8, 1743);
    			attr_dev(div13, "class", "svelte-1d7x5bi");
    			add_location(div13, file, 59, 6, 1702);
    			if (!src_url_equal(img4.src, img4_src_value = "./assets/typo-bands-min/genesisvictoria.min.png")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "band logo of genesisvictoria");
    			attr_dev(img4, "class", "svelte-1d7x5bi");
    			add_location(img4, file, 63, 6, 1810);
    			attr_dev(div14, "class", "slot-container svelte-1d7x5bi");
    			add_location(div14, file, 58, 4, 1666);
    			attr_dev(div15, "class", "svelte-1d7x5bi");
    			add_location(div15, file, 70, 8, 2000);
    			attr_dev(a3, "href", "https://duflanduflan.bandcamp.com");
    			attr_dev(a3, "class", "svelte-1d7x5bi");
    			add_location(a3, file, 71, 8, 2026);
    			attr_dev(div16, "class", "svelte-1d7x5bi");
    			add_location(div16, file, 69, 6, 1985);
    			if (!src_url_equal(img5.src, img5_src_value = "./assets/typo-bands-min/duflanduflan.min.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "band logo of duflanduflan");
    			attr_dev(img5, "class", "svelte-1d7x5bi");
    			add_location(img5, file, 73, 6, 2098);
    			attr_dev(div17, "class", "slot-container svelte-1d7x5bi");
    			add_location(div17, file, 68, 4, 1949);
    			attr_dev(div18, "class", "svelte-1d7x5bi");
    			add_location(div18, file, 80, 8, 2282);
    			attr_dev(div19, "class", "svelte-1d7x5bi");
    			add_location(div19, file, 79, 6, 2267);
    			if (!src_url_equal(img6.src, img6_src_value = "./assets/typo-bands-min/steiner+twodots.min.png")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "band logo of steiner+twodots");
    			attr_dev(img6, "class", "svelte-1d7x5bi");
    			add_location(img6, file, 83, 6, 2352);
    			attr_dev(div20, "class", "slot-container svelte-1d7x5bi");
    			add_location(div20, file, 78, 4, 2231);
    			attr_dev(div21, "class", "timetable-container svelte-1d7x5bi");
    			add_location(div21, file, 24, 2, 732);
    			attr_dev(br5, "class", "svelte-1d7x5bi");
    			add_location(br5, file, 97, 20, 2785);
    			attr_dev(br6, "class", "svelte-1d7x5bi");
    			add_location(br6, file, 97, 38, 2803);
    			attr_dev(h21, "class", "svelte-1d7x5bi");
    			add_location(h21, file, 97, 6, 2771);
    			attr_dev(div22, "class", "date-head svelte-1d7x5bi");
    			add_location(div22, file, 96, 4, 2740);
    			attr_dev(div23, "class", "svelte-1d7x5bi");
    			add_location(div23, file, 101, 8, 2895);
    			attr_dev(a4, "href", "https://goldendoomrecords.bandcamp.com/album/hell");
    			attr_dev(a4, "class", "svelte-1d7x5bi");
    			add_location(a4, file, 102, 8, 2921);
    			attr_dev(div24, "class", "svelte-1d7x5bi");
    			add_location(div24, file, 100, 6, 2880);
    			if (!src_url_equal(img7.src, img7_src_value = "./assets/typo-bands-min/rusz.min.png")) attr_dev(img7, "src", img7_src_value);
    			attr_dev(img7, "alt", "band logo of rusz");
    			attr_dev(img7, "class", "svelte-1d7x5bi");
    			add_location(img7, file, 104, 6, 3009);
    			attr_dev(div25, "class", "slot-container svelte-1d7x5bi");
    			add_location(div25, file, 99, 4, 2844);
    			attr_dev(div26, "class", "svelte-1d7x5bi");
    			add_location(div26, file, 108, 8, 3152);
    			attr_dev(a5, "href", "https://soundcloud.com/catarat/c100000000");
    			attr_dev(a5, "class", "svelte-1d7x5bi");
    			add_location(a5, file, 109, 8, 3178);
    			attr_dev(div27, "class", "svelte-1d7x5bi");
    			add_location(div27, file, 107, 6, 3137);
    			if (!src_url_equal(img8.src, img8_src_value = "./assets/typo-bands-min/catarat.min.png")) attr_dev(img8, "src", img8_src_value);
    			attr_dev(img8, "alt", "band logo of catarat");
    			attr_dev(img8, "class", "svelte-1d7x5bi");
    			add_location(img8, file, 111, 6, 3258);
    			attr_dev(div28, "class", "slot-container svelte-1d7x5bi");
    			add_location(div28, file, 106, 4, 3101);
    			attr_dev(div29, "class", "svelte-1d7x5bi");
    			add_location(div29, file, 118, 8, 3432);
    			attr_dev(a6, "href", "https://crippleclerk.bandcamp.com/");
    			attr_dev(a6, "class", "svelte-1d7x5bi");
    			add_location(a6, file, 119, 8, 3458);
    			attr_dev(div30, "class", "svelte-1d7x5bi");
    			add_location(div30, file, 117, 6, 3417);
    			if (!src_url_equal(img9.src, img9_src_value = "./assets/typo-bands-min/eyaltalmor.min.png")) attr_dev(img9, "src", img9_src_value);
    			attr_dev(img9, "alt", "band logo of eyaltalmor");
    			attr_dev(img9, "class", "svelte-1d7x5bi");
    			add_location(img9, file, 121, 6, 3531);
    			attr_dev(div31, "class", "slot-container svelte-1d7x5bi");
    			add_location(div31, file, 116, 4, 3381);
    			attr_dev(div32, "class", "svelte-1d7x5bi");
    			add_location(div32, file, 128, 8, 3711);
    			attr_dev(a7, "href", "https://kurws.bandcamp.com");
    			attr_dev(a7, "class", "svelte-1d7x5bi");
    			add_location(a7, file, 129, 8, 3737);
    			attr_dev(div33, "class", "svelte-1d7x5bi");
    			add_location(div33, file, 127, 6, 3696);
    			if (!src_url_equal(img10.src, img10_src_value = "./assets/typo-bands-min/kurws.min.png")) attr_dev(img10, "src", img10_src_value);
    			attr_dev(img10, "alt", "band logo of kurws");
    			attr_dev(img10, "class", "svelte-1d7x5bi");
    			add_location(img10, file, 131, 6, 3802);
    			attr_dev(div34, "class", "slot-container svelte-1d7x5bi");
    			add_location(div34, file, 126, 4, 3660);
    			attr_dev(div35, "class", "svelte-1d7x5bi");
    			add_location(div35, file, 138, 8, 3972);
    			attr_dev(a8, "href", "https://and-kal.github.io/livecoding");
    			attr_dev(a8, "class", "svelte-1d7x5bi");
    			add_location(a8, file, 139, 8, 3998);
    			attr_dev(div36, "class", "svelte-1d7x5bi");
    			add_location(div36, file, 137, 6, 3957);
    			if (!src_url_equal(img11.src, img11_src_value = "./assets/typo-bands-min/staxl.min.png")) attr_dev(img11, "src", img11_src_value);
    			attr_dev(img11, "alt", "band logo of staxl");
    			attr_dev(img11, "class", "svelte-1d7x5bi");
    			add_location(img11, file, 141, 6, 4073);
    			attr_dev(div37, "class", "slot-container svelte-1d7x5bi");
    			add_location(div37, file, 136, 4, 3921);
    			attr_dev(div38, "class", "svelte-1d7x5bi");
    			add_location(div38, file, 148, 8, 4243);
    			attr_dev(a9, "href", "https://yc-cy.bandcamp.com/");
    			attr_dev(a9, "class", "svelte-1d7x5bi");
    			add_location(a9, file, 149, 8, 4269);
    			attr_dev(div39, "class", "svelte-1d7x5bi");
    			add_location(div39, file, 147, 6, 4228);
    			if (!src_url_equal(img12.src, img12_src_value = "./assets/typo-bands-min/yc-cy.min.png")) attr_dev(img12, "src", img12_src_value);
    			attr_dev(img12, "alt", "band logo of yc-cy");
    			attr_dev(img12, "class", "svelte-1d7x5bi");
    			add_location(img12, file, 151, 6, 4335);
    			attr_dev(div40, "class", "slot-container svelte-1d7x5bi");
    			add_location(div40, file, 146, 4, 4192);
    			attr_dev(div41, "class", "svelte-1d7x5bi");
    			add_location(div41, file, 158, 8, 4505);
    			attr_dev(a10, "href", "https://soundcloud.com/va-les-ka");
    			attr_dev(a10, "class", "svelte-1d7x5bi");
    			add_location(a10, file, 159, 8, 4531);
    			attr_dev(div42, "class", "svelte-1d7x5bi");
    			add_location(div42, file, 157, 6, 4490);
    			if (!src_url_equal(img13.src, img13_src_value = "./assets/typo-bands-min/valeska.min.png")) attr_dev(img13, "src", img13_src_value);
    			attr_dev(img13, "alt", "band logo of valeska");
    			attr_dev(img13, "class", "svelte-1d7x5bi");
    			add_location(img13, file, 161, 6, 4602);
    			attr_dev(div43, "class", "slot-container svelte-1d7x5bi");
    			add_location(div43, file, 156, 4, 4454);
    			attr_dev(div44, "class", "svelte-1d7x5bi");
    			add_location(div44, file, 168, 8, 4776);
    			attr_dev(a11, "href", "https://soundcloud.com/gleeetch");
    			attr_dev(a11, "class", "svelte-1d7x5bi");
    			add_location(a11, file, 169, 8, 4802);
    			attr_dev(div45, "class", "svelte-1d7x5bi");
    			add_location(div45, file, 167, 6, 4761);
    			if (!src_url_equal(img14.src, img14_src_value = "./assets/typo-bands-min/gleeetch.min.png")) attr_dev(img14, "src", img14_src_value);
    			attr_dev(img14, "alt", "band logo of gleeetch");
    			attr_dev(img14, "class", "svelte-1d7x5bi");
    			add_location(img14, file, 171, 6, 4872);
    			attr_dev(div46, "class", "slot-container svelte-1d7x5bi");
    			add_location(div46, file, 166, 4, 4725);
    			attr_dev(div47, "class", "timetable-container svelte-1d7x5bi");
    			add_location(div47, file, 95, 2, 2701);
    			attr_dev(main, "class", "svelte-1d7x5bi");
    			add_location(main, file, 23, 0, 722);
    			attr_dev(a12, "href", "https://clawsofsaurtopia-blog.tumblr.com");
    			attr_dev(a12, "class", "svelte-1d7x5bi");
    			add_location(a12, file, 181, 2, 5086);
    			attr_dev(footer, "class", "svelte-1d7x5bi");
    			add_location(footer, file, 179, 0, 5014);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, img0);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    			append_dev(header, t2);
    			append_dev(header, div1);
    			append_dev(div1, t3);
    			append_dev(div1, em0);
    			append_dev(div1, t5);
    			append_dev(div1, em1);
    			append_dev(div1, t7);
    			append_dev(div1, br0);
    			append_dev(div1, t8);
    			append_dev(div1, br1);
    			append_dev(div1, t9);
    			append_dev(div1, br2);
    			append_dev(div1, t10);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div21);
    			append_dev(div21, div2);
    			append_dev(div2, h20);
    			append_dev(h20, t12);
    			append_dev(h20, br3);
    			append_dev(h20, t13);
    			append_dev(h20, br4);
    			append_dev(h20, t14);
    			append_dev(div21, t15);
    			append_dev(div21, div5);
    			append_dev(div5, div4);
    			append_dev(div4, div3);
    			append_dev(div4, t17);
    			append_dev(div4, a0);
    			append_dev(div5, t19);
    			append_dev(div5, img1);
    			append_dev(div21, t20);
    			append_dev(div21, div8);
    			append_dev(div8, div7);
    			append_dev(div7, div6);
    			append_dev(div8, t22);
    			append_dev(div8, img2);
    			append_dev(div21, t23);
    			append_dev(div21, div11);
    			append_dev(div11, div10);
    			append_dev(div10, div9);
    			append_dev(div10, t25);
    			append_dev(div10, a1);
    			append_dev(div11, t27);
    			append_dev(div11, img3);
    			append_dev(div21, t28);
    			append_dev(div21, div14);
    			append_dev(div14, div13);
    			append_dev(div13, div12);
    			append_dev(div13, t30);
    			append_dev(div13, a2);
    			append_dev(div14, t32);
    			append_dev(div14, img4);
    			append_dev(div21, t33);
    			append_dev(div21, div17);
    			append_dev(div17, div16);
    			append_dev(div16, div15);
    			append_dev(div16, t35);
    			append_dev(div16, a3);
    			append_dev(div17, t37);
    			append_dev(div17, img5);
    			append_dev(div21, t38);
    			append_dev(div21, div20);
    			append_dev(div20, div19);
    			append_dev(div19, div18);
    			append_dev(div20, t40);
    			append_dev(div20, img6);
    			append_dev(main, t41);
    			append_dev(main, div47);
    			append_dev(div47, div22);
    			append_dev(div22, h21);
    			append_dev(h21, t42);
    			append_dev(h21, br5);
    			append_dev(h21, t43);
    			append_dev(h21, br6);
    			append_dev(h21, t44);
    			append_dev(div47, t45);
    			append_dev(div47, div25);
    			append_dev(div25, div24);
    			append_dev(div24, div23);
    			append_dev(div24, t47);
    			append_dev(div24, a4);
    			append_dev(div25, t49);
    			append_dev(div25, img7);
    			append_dev(div47, t50);
    			append_dev(div47, div28);
    			append_dev(div28, div27);
    			append_dev(div27, div26);
    			append_dev(div27, t52);
    			append_dev(div27, a5);
    			append_dev(div28, t54);
    			append_dev(div28, img8);
    			append_dev(div47, t55);
    			append_dev(div47, div31);
    			append_dev(div31, div30);
    			append_dev(div30, div29);
    			append_dev(div30, t57);
    			append_dev(div30, a6);
    			append_dev(div31, t59);
    			append_dev(div31, img9);
    			append_dev(div47, t60);
    			append_dev(div47, div34);
    			append_dev(div34, div33);
    			append_dev(div33, div32);
    			append_dev(div33, t62);
    			append_dev(div33, a7);
    			append_dev(div34, t64);
    			append_dev(div34, img10);
    			append_dev(div47, t65);
    			append_dev(div47, div37);
    			append_dev(div37, div36);
    			append_dev(div36, div35);
    			append_dev(div36, t67);
    			append_dev(div36, a8);
    			append_dev(div37, t69);
    			append_dev(div37, img11);
    			append_dev(div47, t70);
    			append_dev(div47, div40);
    			append_dev(div40, div39);
    			append_dev(div39, div38);
    			append_dev(div39, t72);
    			append_dev(div39, a9);
    			append_dev(div40, t74);
    			append_dev(div40, img12);
    			append_dev(div47, t75);
    			append_dev(div47, div43);
    			append_dev(div43, div42);
    			append_dev(div42, div41);
    			append_dev(div42, t77);
    			append_dev(div42, a10);
    			append_dev(div43, t79);
    			append_dev(div43, img13);
    			append_dev(div47, t80);
    			append_dev(div47, div46);
    			append_dev(div46, div45);
    			append_dev(div45, div44);
    			append_dev(div45, t82);
    			append_dev(div45, a11);
    			append_dev(div46, t84);
    			append_dev(div46, img14);
    			insert_dev(target, t85, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, a12);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(main);
    			if (detaching) detach_dev(t85);
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Main', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Main> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Main extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Main",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new Main({
    	target: document.body,
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map

const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(__dirname + '/../myjdownloader-unuglifier.user.js', 'utf8');
const start = source.indexOf('    function ensureThemeControl() {');
const end = source.indexOf('    function decorateRows()', start);
function element() {
    const classes = new Set();
    return {
        classList: {
            toggle(name, enabled) { if (enabled) classes.add(name); else classes.delete(name); },
            add(name) { classes.add(name); },
            remove(name) { classes.delete(name); },
            contains(name) { return classes.has(name); }
        },
        appendChild(child) { child.parentElement = this; },
        after(child) { child.parentElement = this.parentElement; child.previousElementSibling = this; },
        addEventListener() {}
    };
}
const body = element();
const controls = element();
controls.parentElement = element();
const settings = element();
settings.parentElement = element();
let currentSettings = null;
let currentControls = controls;
let wrapper = null;
const context = vm.createContext({
    document: {
        body,
        querySelector: () => currentSettings,
        getElementById: id => id === 'mjd-theme-control' ? wrapper : currentControls,
        createElement: () => element()
    },
    applyTheme() {},
    Boolean
});
vm.runInContext(source.slice(start, end), context);
controls.after = child => { wrapper = child; child.parentElement = controls.parentElement; child.previousElementSibling = controls; };
context.ensureThemeControl();
assert.equal(wrapper.previousElementSibling, controls);
currentSettings = settings;
context.ensureThemeControl();
assert.equal(wrapper.previousElementSibling, settings);
assert.equal(wrapper.parentElement, settings.parentElement);
assert.equal(wrapper.classList.contains('mjd-theme--settings'), true);
context.ensureThemeControl();
assert.equal(wrapper.previousElementSibling, settings);
currentSettings = null;
context.ensureThemeControl();
assert.equal(wrapper.previousElementSibling, controls);
assert.equal(wrapper.classList.contains('mjd-theme--settings'), false);
currentControls = null;
context.ensureThemeControl();
assert.equal(wrapper.parentElement, body);
assert.equal(wrapper.classList.contains('mjd-theme--floating'), true);
currentSettings = settings;
context.ensureThemeControl();
assert.equal(wrapper.previousElementSibling, settings);
assert.equal(wrapper.classList.contains('mjd-theme--floating'), false);
console.log('Theme button placement, fallback and return checks passed.');

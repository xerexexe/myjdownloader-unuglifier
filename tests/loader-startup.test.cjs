const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(__dirname + '/../myjdownloader-unuglifier.user.js', 'utf8');
const expectedVersion = source.match(/@version\s+(\S+)/)[1];

for (const initiallyMissing of [false, true]) {
    for (const [saved, systemDark, expected] of [
        [null, false, 'dark'], ['light', true, 'light'], ['dark', false, 'dark'],
        ['system', true, 'dark'], ['system', false, 'light'], ['invalid', true, 'dark']
    ]) {
        const root = { dataset: {} };
        let observer;
        const styles = [];
        const listeners = [];
        const document = {
            documentElement: initiallyMissing ? null : root,
            readyState: 'loading',
            getElementById: () => null,
            addEventListener: (name, callback) => listeners.push([name, callback])
        };
        class RootObserver {
            constructor(callback) { this.callback = callback; observer ||= this; }
            observe(target, options) {
                assert.ok(target === document || target === root);
                assert.equal(options.childList, true);
            }
            disconnect() { this.disconnected = true; }
        }
        vm.runInNewContext(source, {
            document,
            window: {
                matchMedia: () => ({ matches: systemDark, addEventListener() {} }),
                addEventListener() {}
            },
            localStorage: { getItem: () => saved },
            sessionStorage: { getItem: () => null },
            GM_addStyle: css => styles.push(css),
            MutationObserver: RootObserver
            ,requestAnimationFrame() {}, setInterval() {}
        });
        if (initiallyMissing) {
            assert.equal(styles.length, 0);
            document.documentElement = root;
            observer.callback();
            assert.equal(observer.disconnected, true);
        }
        assert.equal(root.dataset.mjdTheme, expected);
        assert.equal(root.dataset.mjdUserscriptVersion, expectedVersion);
        assert.equal(styles.length, 4);
        assert.ok(styles[0].includes('#gwtContent .mainLoadingSpinner'));
        assert.equal(listeners.filter(([name]) => name === 'DOMContentLoaded').length, 1);
    }
}
console.log('12 integrated early-start and theme checks passed.');

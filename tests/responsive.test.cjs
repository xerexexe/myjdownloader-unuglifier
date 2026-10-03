const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(__dirname + '/../myjdownloader-unuglifier.user.js', 'utf8');
const scope = vm.createContext({});
vm.runInContext(source.slice(source.indexOf('        const layouts ='), source.indexOf('        const preferences ='))
    + source.slice(source.indexOf('        function normalizeWeights('), source.indexOf('        function setVariable(')), scope);
const layouts = vm.runInContext('layouts', scope);
let checks = 0;
for (const config of Object.values(layouts)) {
    for (const available of [100, 300, 604, 692, 720, 900, 1280, 1920, 3840]) {
        for (const weights of [config.weights, [0, 0, 0, 0, 1], [1, 0, 0, 0, 0], [1, 2, 3, 4, 5]]) {
            const result = scope.fitColumns(available, config, weights);
            assert.equal(result[0], config.minimum[0]);
            assert.ok(Math.abs(result.reduce((a, b) => a + b, 0) - Math.max(available, config.minimum.reduce((a, b) => a + b, 0))) < 0.0001);
            result.forEach((width, index) => assert.ok(width >= config.minimum[index] - 0.0001));
            for (let index = 1; index <= 5; index++) {
                for (const delta of [-10000, -30, 0, 30, 10000]) {
                    const moved = scope.moveBoundary(result, config.minimum, index, delta);
                    moved.forEach((width, column) => assert.ok(width >= config.minimum[column] - 0.0001));
                    const total = moved.reduce((a, b) => a + b, 0);
                    assert.ok(total >= result.reduce((a, b) => a + b, 0) - 0.0001);
                    if (delta > 0 && result[index] < 3000) assert.ok(moved[index] > result[index]);
                    const restored = scope.fitColumns(total, config, scope.weightsFromWidths(moved, config));
                    moved.forEach((width, column) => assert.ok(Math.abs(width - restored[column]) < 0.0001));
                    checks++;
                }
            }
        }
    }
}
for (const invalid of [null, [1, 2], [1, -1, 0, 0, 0], [Infinity, 0, 0, 0, 0], [0, 0, 0, 0, 0]]) {
    assert.equal(JSON.stringify(scope.normalizeWeights(invalid, [1, 1, 1, 1, 1])), '[1,1,1,1,1]');
}
console.log(`${checks} responsive sizing, boundary and persistence round-trip checks passed.`);

const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const source = fs.readFileSync(__dirname + '/../myjdownloader-unuglifier.user.js', 'utf8');
const scope = vm.createContext({});
vm.runInContext(source.slice(source.indexOf('    function cleanEta('), source.indexOf('    function collectStatus('))
    + '\n' + source.match(/const EXTRACT_PATTERN = .*;/)[0]
    + '\n' + source.match(/const EXTRACT_FINISHED_PATTERN = .*;/)[0]
    + '\nfunction isExtracting(s){return EXTRACT_PATTERN.test(s)&&!EXTRACT_FINISHED_PATTERN.test(s)}', scope);
for (const [value, seconds] of [['3m:25s',205],['04m:12s',252],['1 Std 2 Min 3 Sek',3723],['1:02:03',3723],['1d 2h 3m 4s',93784],['unbekannt',null]]) {
    assert.equal(scope.parseDuration(value), seconds, value);
}
for (const status of ['Extracting (ETA: 3m:25s)','Entpacken','ExTrAcTiNg','Extraction in progress']) assert.equal(scope.isExtracting(status),true,status);
for (const status of ['Finished','Extraction OK','Extraction failed','Extracting complete','Entpackt','Erfolgreich entpackt','Entpacken abgeschlossen','Auto Extract disabled']) assert.equal(scope.isExtracting(status),false,status);
assert.equal(scope.formatDuration(205),'3 Min 25 Sek');
console.log('19 ETA and status regression checks passed.');

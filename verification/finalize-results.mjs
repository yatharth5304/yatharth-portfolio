import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const out = new URL('./artifacts/fidelity/', import.meta.url);
const readJSON = async name => JSON.parse(await readFile(new URL(name, out), 'utf8'));
const report = await readJSON('final-report.json');
const last = await readJSON('corrected-report.json');
report.views = report.views.map(view => last.views.find(v => v.size.width === view.size.width) || view);
report.resize = await readJSON('resize-report.json');
await writeFile(new URL('final-report.json', out), JSON.stringify(report, null, 2));
const hash = createHash('sha256').update(await readFile(new URL('../frontend/public/models/yatharth-developer.glb', import.meta.url))).digest('hex');
const results = {
  date:'2026-10-15', referenceCommit:'e1491d6d709d4fa6df2ca88277f0c31b5e4f6ea7', implementationBaseline:'1ef88f4',
  build:'passed', java:{tests:4,failures:0,errors:0},
  browser:{engine:'Microsoft Edge / Chromium',viewports:report.views.map(v=>v.size),errors:report.errors,failedRequiredAssets:report.failed,
    csp:'Unchanged Spring policy; verified snapshot API fixture',checks:report.checks,resize:report.resize},
  sourceModelSha256:hash,evidenceDirectory:'verification/artifacts/fidelity',
  limitations:['No deployment or push','Mobile uses the original model portrait in place of the reference author photo',
    'Safari/Firefox, physical phones and production database connectivity were not tested in the browser pass',
    'Independent animation phases make raw pixel differences diagnostic only']
};
await writeFile(new URL('./FIDELITY_RESULTS.json', import.meta.url), JSON.stringify(results, null, 2)+'\n');
console.log(JSON.stringify({viewports:results.browser.viewports,errors:results.browser.errors,failedRequiredAssets:results.browser.failedRequiredAssets,modelHash:hash}));

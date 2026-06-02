import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const reportDir = join(root, 'reports');
const reportPath = join(reportDir, 'seo-aeo-audit.md');

const checks = [];

function read(path) {
  return readFileSync(join(root, path), 'utf8');
}

function addCheck(name, passed, detail, fix = '') {
  checks.push({ name, passed, detail, fix });
}

function includesAll(filePath, terms) {
  const content = read(filePath).toLowerCase();
  return terms.filter((term) => !content.includes(term.toLowerCase()));
}

const requiredFiles = [
  'index.html',
  'public/robots.txt',
  'public/sitemap.xml',
  'public/llms.txt',
  'public/seo-strategy.md',
  'public/images/og-meeple-sosen.svg',
  'src/components/Seo.tsx',
];

for (const filePath of requiredFiles) {
  addCheck(`Required file: ${filePath}`, existsSync(join(root, filePath)), 'File exists and is available to the build.', `Create or restore ${filePath}.`);
}

const index = read('index.html');
addCheck('Homepage title is locally targeted', index.includes('English Through Board Games In Fukuoka'), 'The static shell has a local search title.', 'Update index.html title.');
addCheck('Homepage meta description exists', /<meta name="description" content="[^"]{80,180}"/.test(index), 'The static shell has a concise description.', 'Add a 80-180 character description in index.html.');
addCheck('Open Graph image is local', index.includes('/images/og-meeple-sosen.svg'), 'Social previews use project-owned artwork.', 'Replace external OG image URLs.');

const seo = read('src/components/Seo.tsx');
addCheck('LocalBusiness schema present', seo.includes("'@type': 'LocalBusiness'"), 'Local business schema helps local and generative engines.', 'Restore LocalBusiness JSON-LD.');
addCheck('FAQ schema present', seo.includes("'@type': 'FAQPage'"), 'FAQ schema supports answer-engine extraction.', 'Restore FAQPage JSON-LD.');
addCheck('Silver Circle medical disclaimer present', seo.includes('not medical care') || seo.includes('not medical'), 'AEO copy avoids unsafe medical claims.', 'Add a clear not-medical-care answer for Silver Circle.');

const llms = read('public/llms.txt');
const llmsMissing = ['Nishi-ku, Fukuoka', 'Beginners welcome', 'Japanese support', 'conversation card', 'not medical care'].filter((term) => !llms.includes(term));
addCheck('llms.txt contains answer-engine facts', llmsMissing.length === 0, llmsMissing.length ? `Missing: ${llmsMissing.join(', ')}` : 'Core facts are present.', 'Update public/llms.txt with stable AEO facts.');

const sitemap = read('public/sitemap.xml');
const currentYear = new Date().getFullYear().toString();
addCheck('Sitemap has current-year freshness', sitemap.includes(currentYear), `Expected year: ${currentYear}.`, 'Update lastmod in public/sitemap.xml.');
addCheck('Robots points to sitemap', read('public/robots.txt').includes('sitemap.xml'), 'Robots file advertises the sitemap.', 'Add Sitemap line to public/robots.txt.');

const publicMissing = includesAll('src/components/Hero.tsx', ['Fukuoka', 'No tests', 'No pressure', 'Japanese support']);
addCheck('Home page keeps soft public promise', publicMissing.length === 0, publicMissing.length ? `Missing: ${publicMissing.join(', ')}` : 'Home keeps the softened onboarding terms.', 'Restore soft onboarding language on Home.');

const boardMissing = includesAll('src/components/Board.tsx', ['Conversation Cards', 'Session Workspace', 'Pick A Focus', 'Record Progress']);
addCheck('How It Works supports session workflow', boardMissing.length === 0, boardMissing.length ? `Missing: ${boardMissing.join(', ')}` : 'Session workflow terms are present.', 'Restore operational session workspace language.');

const silverMissing = includesAll('src/components/SilverCircle.tsx', ['福岡', '無料体験', '医療行為ではありません', '日本語サポート']);
addCheck('Silver Circle keeps local Japanese trust terms', silverMissing.length === 0, silverMissing.length ? `Missing: ${silverMissing.join(', ')}` : 'Silver Circle keeps local, soft, safe terms.', 'Restore local Japanese trust language and medical disclaimer.');

const passed = checks.filter((check) => check.passed).length;
const failed = checks.length - passed;
const status = failed === 0 ? 'PASS' : 'NEEDS ATTENTION';
const date = new Date().toISOString().slice(0, 10);

const report = [
  `# SEO + GEO + AEO Audit`,
  ``,
  `Date: ${date}`,
  `Status: ${status}`,
  `Score: ${passed}/${checks.length}`,
  ``,
  `## Checks`,
  ``,
  ...checks.map((check) => [
    `### ${check.passed ? 'PASS' : 'FAIL'} - ${check.name}`,
    ``,
    check.detail,
    check.passed ? '' : `Recommended fix: ${check.fix}`,
    ``,
  ].join('\n')),
  `## Weekly Maintenance Questions`,
  ``,
  `- Is the homepage still saying the clearest public offer?`,
  `- Are Nishi-ku, Fukuoka, beginner English, Japanese support, and board games still visible?`,
  `- Did any Silver Circle copy drift toward medical certainty?`,
  `- Are there new reviews, photos, events, or games that should be added?`,
  `- Are answer-engine facts in llms.txt still accurate?`,
  ``,
].join('\n');

if (!existsSync(reportDir)) mkdirSync(reportDir);
writeFileSync(reportPath, report);
console.log(report);

if (failed > 0) {
  process.exitCode = 1;
}

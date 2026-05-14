import puppeteer from 'puppeteer-core';

const ROUTES = [
  { route: '/',             file: 'landing.png',         user: null },
  { route: '/login',        file: 'login.png',           user: null },
  { route: '/ar',           file: 'ar.png',              user: null },
  { route: '/cv',           file: 'cv.png',              user: null },
  { route: '/blog',         file: 'blog.png',            user: null },
  { route: '/guide',        file: 'guide.png',           user: null },
  { route: '/student',      file: 'student-home.png',    user: { name: 'Ali Raza', email: 'ali@uni.edu', role: 'student' } },
  { route: '/reading',      file: 'reading.png',         user: { name: 'Ali Raza', email: 'ali@uni.edu', role: 'student' } },
  { route: '/quiz',         file: 'quiz.png',            user: { name: 'Ali Raza', email: 'ali@uni.edu', role: 'student' } },
  { route: '/prompting',    file: 'prompting.png',       user: { name: 'Ali Raza', email: 'ali@uni.edu', role: 'student' } },
  { route: '/results',      file: 'results.png',         user: { name: 'Ali Raza', email: 'ali@uni.edu', role: 'student' } },
  { route: '/faculty',      file: 'faculty-home.png',    user: { name: 'Dr. Sana Tariq', email: 'sana@uni.edu', role: 'faculty' } },
  { route: '/upload',       file: 'faculty-upload.png',  user: { name: 'Dr. Sana Tariq', email: 'sana@uni.edu', role: 'faculty' } },
  { route: '/faculty/blog', file: 'faculty-blog.png',    user: { name: 'Dr. Sana Tariq', email: 'sana@uni.edu', role: 'faculty' } },
  { route: '/reports',      file: 'faculty-reports.png', user: { name: 'Dr. Sana Tariq', email: 'sana@uni.edu', role: 'faculty' } },
  { route: '/settings',     file: 'settings.png',        user: { name: 'Dr. Sana Tariq', email: 'sana@uni.edu', role: 'faculty' } }
];

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu']
});

// Seed some quiz attempts so the dashboards aren't empty
const seedAttempts = [
  { id: 'att_1', userEmail: 'ali@uni.edu',   userName: 'Ali Raza',   role: 'student', quizId: 'okc',              title: 'Odontogenic Keratocyst',     score: 3, total: 4, percent: 75, when: new Date(Date.now()-86400000*2).toISOString() },
  { id: 'att_2', userEmail: 'ali@uni.edu',   userName: 'Ali Raza',   role: 'student', quizId: 'dentigerous-cyst', title: 'Dentigerous Cyst',           score: 4, total: 4, percent:100, when: new Date(Date.now()-86400000  ).toISOString() },
  { id: 'att_3', userEmail: 'ali@uni.edu',   userName: 'Ali Raza',   role: 'student', quizId: 'ameloblastoma',    title: 'Ameloblastoma',              score: 2, total: 4, percent: 50, when: new Date(Date.now()-3600000   ).toISOString() },
  { id: 'att_4', userEmail: 'maira@uni.edu', userName: 'Maira Khan', role: 'student', quizId: 'okc',              title: 'Odontogenic Keratocyst',     score: 4, total: 4, percent:100, when: new Date(Date.now()-7200000   ).toISOString() },
  { id: 'att_5', userEmail: 'umar@uni.edu',  userName: 'Umar Sheikh',role: 'student', quizId: 'sample',           title: 'Sample Quiz — Mixed Topics', score: 7, total:10, percent: 70, when: new Date(Date.now()-1800000  ).toISOString() }
];

// Seed a couple of blog posts so the public + faculty blog pages aren't empty
const seedPosts = [
  {
    id: 'post_demo_1',
    title: 'Reading an OPG · differential diagnosis of multilocular radiolucencies',
    body: 'Multilocular radiolucencies in the posterior mandible have a short but high-yield differential.\n\n' +
          '**Top three to know:**\n' +
          '- Odontogenic keratocyst (OKC)\n' +
          '- Ameloblastoma\n' +
          '- Odontogenic myxoma\n\n' +
          'Always correlate radiograph with patient age, site and any syndromic features. ' +
          'If you suspect Gorlin syndrome on bilateral OKCs, refer for genetic counselling.',
    tags: ['OPG', 'OKC', 'ameloblastoma'],
    coverDataUrl: '',
    pdfDataUrl: '',
    pdfName: '',
    by: 'Dr. Sana Tariq',
    byEmail: 'sana@uni.edu',
    when: new Date(Date.now() - 86400000).toISOString(),
    views: 24
  },
  {
    id: 'post_demo_2',
    title: 'Histology pearls · keratin vs. parakeratin in odontogenic cysts',
    body: 'A quick refresher before next week\'s practical.\n\n' +
          '- **Orthokeratinised** cysts behave less aggressively and have a much lower recurrence rate than parakeratinised OKCs.\n' +
          '- Look for the **palisaded basal layer** and **corrugated luminal surface** to clinch an OKC.\n' +
          '- Rushton bodies, when present, point to an inflammatory radicular lining.',
    tags: ['histology', 'OKC'],
    coverDataUrl: '',
    pdfDataUrl: '',
    pdfName: '',
    by: 'Dr. Sana Tariq',
    byEmail: 'sana@uni.edu',
    when: new Date(Date.now() - 3 * 86400000).toISOString(),
    views: 9
  }
];

for (const { route, file, user } of ROUTES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1800, deviceScaleFactor: 1 });

  await page.evaluateOnNewDocument((u, attempts, posts) => {
    if (u) localStorage.setItem('oralpath:v1:user', JSON.stringify(u));
    localStorage.setItem('oralpath:v1:attempts', JSON.stringify(attempts));
    localStorage.setItem('oralpath:v1:blog_posts', JSON.stringify(posts));
  }, user, seedAttempts, seedPosts);

  await page.goto(`http://127.0.0.1:5173/#${route}`, { waitUntil: 'networkidle2', timeout: 20000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 1600));

  // For the CV page, click the first sample button so the pipeline output is visible.
  if (route === '/cv') {
    await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('OPG mandible'));
      if (btn) btn.click();
    });
    await new Promise(r => setTimeout(r, 1800));
  }

  await page.screenshot({ path: `screenshots/${file}`, fullPage: false });
  console.log('captured', file);
  await page.close();
}

await browser.close();
console.log('done');

import puppeteer from 'puppeteer-core';

const ROUTES = [
  { route: '/',          file: 'landing.png',         user: null },
  { route: '/login',     file: 'login.png',           user: null },
  { route: '/ar',        file: 'ar.png',              user: null },
  { route: '/guide',     file: 'guide.png',           user: null },
  { route: '/student',   file: 'student-home.png',    user: { name: 'Ali Raza', email: 'ali@uni.edu', role: 'student' } },
  { route: '/reading',   file: 'reading.png',         user: { name: 'Ali Raza', email: 'ali@uni.edu', role: 'student' } },
  { route: '/quiz',      file: 'quiz.png',            user: { name: 'Ali Raza', email: 'ali@uni.edu', role: 'student' } },
  { route: '/prompting', file: 'prompting.png',       user: { name: 'Ali Raza', email: 'ali@uni.edu', role: 'student' } },
  { route: '/results',   file: 'results.png',         user: { name: 'Ali Raza', email: 'ali@uni.edu', role: 'student' } },
  { route: '/faculty',   file: 'faculty-home.png',    user: { name: 'Dr. Sana Tariq', email: 'sana@uni.edu', role: 'faculty' } },
  { route: '/upload',    file: 'faculty-upload.png',  user: { name: 'Dr. Sana Tariq', email: 'sana@uni.edu', role: 'faculty' } },
  { route: '/reports',   file: 'faculty-reports.png', user: { name: 'Dr. Sana Tariq', email: 'sana@uni.edu', role: 'faculty' } },
  { route: '/settings',  file: 'settings.png',        user: { name: 'Dr. Sana Tariq', email: 'sana@uni.edu', role: 'faculty' } }
];

const browser = await puppeteer.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: 'new',
  args: ['--no-sandbox', '--disable-gpu']
});

// Seed some quiz attempts so the dashboards aren't empty
const seedAttempts = [
  { id: 'att_1', userEmail: 'ali@uni.edu',   userName: 'Ali Raza',   role: 'student', quizId: 'okc',           title: 'Odontogenic Keratocyst', score: 3, total: 4, percent: 75, when: new Date(Date.now()-86400000*2).toISOString() },
  { id: 'att_2', userEmail: 'ali@uni.edu',   userName: 'Ali Raza',   role: 'student', quizId: 'dentigerous-cyst', title: 'Dentigerous Cyst',    score: 4, total: 4, percent:100, when: new Date(Date.now()-86400000  ).toISOString() },
  { id: 'att_3', userEmail: 'ali@uni.edu',   userName: 'Ali Raza',   role: 'student', quizId: 'ameloblastoma', title: 'Ameloblastoma',          score: 2, total: 4, percent: 50, when: new Date(Date.now()-3600000   ).toISOString() },
  { id: 'att_4', userEmail: 'maira@uni.edu', userName: 'Maira Khan', role: 'student', quizId: 'okc',           title: 'Odontogenic Keratocyst', score: 4, total: 4, percent:100, when: new Date(Date.now()-7200000   ).toISOString() },
  { id: 'att_5', userEmail: 'umar@uni.edu',  userName: 'Umar Sheikh',role: 'student', quizId: 'sample',        title: 'Sample Quiz — Mixed Topics', score: 7, total:10, percent: 70, when: new Date(Date.now()-1800000).toISOString() }
];

for (const { route, file, user } of ROUTES) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1800, deviceScaleFactor: 1 });

  // Seed localStorage before app loads
  await page.evaluateOnNewDocument((u, attempts) => {
    if (u) localStorage.setItem('oralpath:v1:user', JSON.stringify(u));
    localStorage.setItem('oralpath:v1:attempts', JSON.stringify(attempts));
  }, user, seedAttempts);

  await page.goto(`http://127.0.0.1:5174/#${route}`, { waitUntil: 'networkidle2', timeout: 15000 }).catch(() => {});
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: `screenshots/${file}`, fullPage: false });
  console.log('captured', file);
  await page.close();
}

await browser.close();
console.log('done');

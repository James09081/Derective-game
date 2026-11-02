'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const KEY = 'blackarchive_case002_v2';

const DEFAULT_DATA = {
  meta: { status: 'UNRESOLVED', case3: false },
  pname: '',
  st: null
};

let D;

try {
  D = JSON.parse(localStorage.getItem(KEY) || 'null') || DEFAULT_DATA;
} catch {
  D = DEFAULT_DATA;
}

let st = D.st;
let cur = { tab: 'ev', id: 'e1', sus: 'adrian' };

let AC = null;
let G = null;
let muted = false;

const save = () => {
  D.st = st;
  localStorage.setItem(KEY, JSON.stringify(D));
};

const today = () => new Date().toLocaleDateString('en-US', {
  month: 'long',
  day: 'numeric',
  year: 'numeric'
});

const CL = {
  noAdmin: 'Ayaw ipaalam ni Adrian sa administration',
  id2005: 'Student ID: issue date 2005, expiry 2027',
  dupLog: 'Dalawang beses nag-log si Elias sa 9:17 PM',
  sixOut: '5 pumasok, 6 lumabas, walang ibang exit',
  key0: 'Susi na may label na 0',
  faceless: 'Walang mukha ang pang-anim sa litrato',
  room0: 'Room 0 sa lumang floor plan',
  oneTakes: '"It always takes one"',
  clip2005: 'Elias V. Mercer, nawala rin noong Oct 17, 2005',
  oct16: 'Backup CCTV ni Daniel: Elias, timestamp Oct 16',
  adrDead: 'Adrian: enrolled 2005, DECEASED Oct 17, 2005',
  sixthNameless: 'May estudyanteng walang pangalan sa 2005 photo',
  replace: 'Si Sophia ang nag-recruit para palitan si Elias',
  copy: 'Si Elias ay copy na nabuo mula sa alaala'
};

const E = {

  e1: {
    t: '001 Missing Person Report',
    b: `Name: Elias V. Mercer

Age: 21

Last seen: October 17, 2025

Location: Blackwood University Library

Reporting Person: Adrian Cole

(handwritten sa ilalim)

{{noAdmin|"Please do not contact the university administration."}}`
  },

  e2: {
    t: '002 Student ID',
    b: `BLACKWOOD UNIVERSITY

ELIAS V. MERCER   [litrato]

Issue date: {{id2005|2005}}

Expiration: 2027

Dalawang dekada ang pagitan.`
  },

  e3: {
    t: '003 Recovered Chat',
    b: `October 16, 2025

Sophia: You shouldn't be doing this.

Elias: I already found the records.

Sophia: Then destroy them.

Elias: It's too late.

Sophia: Elias, listen to me. If you go there again, it will know.

Elias: It already knows.`
  },

  e4: {
    t: '004 Library Attendance Log',
    b: `8:43 PM  Adrian Cole       Entered

8:44 PM  Sophia Bennett     Entered

8:47 PM  Marcus Reed        Entered

8:51 PM  Daniel Hayes       Entered

{{dupLog|9:17 PM  Elias V. Mercer  Entered

9:17 PM  Elias V. Mercer  Entered}}

Pareho ang handwriting. Iba ang ballpen sa pangalawa.`
  },

  e5: {
    t: '005 CCTV Transcript',
    b: `8:43 PM  Five people enter.

9:17 PM  Lights go out.

10:06 PM Camera interruption.

10:19 PM Camera resumes.

{{sixOut|11:16 PM Six people exit.}}

Huling frame: may nakatingin sa camera, hawak ang papel:

"YOU ARE NOT SUPPOSED TO BE HERE."`
  },

  e6: {
    t: '006 Room Inspection',
    b: `Dorm ni Elias:

- Sirang wristwatch
- Lumang university photograph
- Notebook
- {{key0|Susi na may label na "0"}}
- Litrato ng anim na estudyante

{{faceless|Lima lang ang may mukha. Ang pang-anim ay parang walang mukha mismo, hindi blurred.}}`
  },

  e7: {
    t: '007 Newspaper Clipping, 2005',
    b: `BLACKWOOD STUDENT MISSING

October 17, 2005

{{clip2005|Missing: ELIAS V. MERCER}}

Same birthday. Same university. Same date.

Pero 21 si Elias noong 2025. Paano?`
  },

  e8: {
    t: '008 Audio, Restricted Section',
    b: `Voice 1: "You said it would only take one."

Voice 2: {{oneTakes|"It always takes one."}}

Voice 1: "Then why are there six?"

Voice 2: "Because one of them was never supposed to leave."

*tatlong katok*

Bulong: "Adrian. Don't open the door."`
  },

  e9: {
    t: '009 Backup Recording (Daniel)',
    b: `Library. May taong nakatayo sa harap ng camera. Si Elias.

Timestamp: {{oct16|October 16, 2025}}

Isang araw bago siya "nawala".`
  },

  e10: {
    t: '010 Student Enrollment History',
    b: `ADRIAN COLE, registered 2005

[litrato: kapareho ng mukha ngayon, walang aging]

{{adrDead|STATUS: DECEASED

DATE OF DEATH: OCTOBER 17, 2005}}

Group photo 2005, caption: Adrian, M. Reed, A. Bennett, D. Hayes, Elias Mercer, at {{sixthNameless|______ (napunit ang pangalan)}}.`
  },

  e11: {
    t: '011 Sophia: Hidden Recording',
    b: `"Ako ang nag-recruit sa kanila. Hindi para hanapin si Elias. Para palitan siya.

Para isara ang Room 0, kailangan ng taong kusang magbibigay ng pangalan niya sa ledger. {{replace|Si Elias ang pinili ko.}}

Hindi siya ang nawala noong 2005. {{copy|Isa siyang copy, binuo mula sa alaala ng mga nakalimot sa original.}} Kaya walang records."`
  },

  e12: {
    t: '012 PLAYER ACCESS LOG',
    b: () => `ACCESS DATE: ${today()}

ACCESS USER: ${st?.name || 'UNKNOWN'}

FILE ACCESSED: ELIAS_V_MERCER_FINAL

STATUS: ACTIVE

MISSING PERSON REPORT

NAME: ${st?.name || 'UNKNOWN'}

LAST SEEN: ${today()}

STATUS: MISSING

"The investigation has been active for 21 years."`
  },

  e13: {
    t: '013 Lumang Floor Plan',
    b: `Official map: walang Room 0.

Lumang plano: {{room0|Room 0, sa ilalim ng library, sarado.}}`
  }
};

const SUS = {

  adrian: {
    n: 'Adrian Cole',
    r: 'Roommate, nag-report',
    q: [
      ['Kailan mo huling nakita si Elias?', 'October 17. Sabi niya may kukunin siya sa library.'],
      ['Bakit may message kayo noong Oct 19?', '"I don\'t remember sending that message."']
    ],
    p: [{
      ev: 'e1',
      a: '...Oo, kinuha ko ang mga gamit niya. May notebook: "If they ask about the sixth person, don\'t tell them what you saw." Natakot ako.',
      un: ['e6']
    }]
  },

  sophia: {
    n: 'Sophia Bennett',
    r: 'Classmate, huling kausap',
    q: [
      ['Ano ang pinag-awayan ninyo?', 'Wala akong sasabihin.'],
      ['Ano ang "I need to know if it remembers me"?', 'Hindi ko alam. Tigilan mo na.']
    ],
    p: [
      {
        ev: 'e3',
        a: 'Noong 2005, may estudyanteng nawala rin sa library. Ako ang nagbigay kay Elias ng impormasyon. Anak ako ng dating archivist.',
        un: ['e7']
      },
      {
        ev: 'e10',
        a: '...Sige. Pakinggan mo ang recording ko. Huli na ang lahat.',
        un: ['e11']
      }
    ]
  },

  marcus: {
    n: 'Marcus Reed',
    r: 'Library assistant',
    q: [
      ['May kakaiba bang nangyari?', 'Wala. Normal na gabi.'],
      ['Bakit dalawang Elias sa 9:17 PM?', 'Pagod lang ako. Typo siguro.']
    ],
    p: [{
      ev: 'e6',
      a: 'Susi iyan ng Room 0. Sarado iyon, matagal na. May naririnig akong boses doon. Heto ang recording at ang lumang plano.',
      un: ['e13', 'e8']
    }]
  },

  daniel: {
    n: 'Daniel Hayes',
    r: 'Guard, CCTV operator',
    q: [
      ['Bakit may 13-minute gap?', 'Technical malfunction lang.'],
      ['Sino ang pang-anim na lumabas?', 'Hindi ko makita ang mukha. Hindi ko makita.']
    ],
    p: [{
      ev: 'e5',
      a: 'Ako ang nag-disable, manual. May backup ako na hindi ko isinama. Pasensya na.',
      un: ['e9']
    }]
  }
};

// AUDIO SYSTEM

function drone() {
  if (AC) {
    if (AC.state === 'suspended') AC.resume();
    return;
  }

  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;

  AC = new AudioContextClass();
  G = AC.createGain();
  G.gain.value = muted ? 0 : 0.035;
  G.connect(AC.destination);

  [55, 58.3, 110.7].forEach(freq => {
    const oscillator = AC.createOscillator();
    const filter = AC.createBiquadFilter();

    oscillator.type = 'sawtooth';
    oscillator.frequency.value = freq;

    filter.type = 'lowpass';
    filter.frequency.value = 150;

    oscillator.connect(filter).connect(G);
    oscillator.start();
  });
}

function knock() {
  if (!AC || muted) return;

  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const oscillator = AC.createOscillator();
      const gain = AC.createGain();

      oscillator.frequency.value = 78;
      gain.gain.setValueAtTime(.35, AC.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, AC.currentTime + .22);

      oscillator.connect(gain).connect(AC.destination);
      oscillator.start();
      oscillator.stop(AC.currentTime + .25);
    }, i * 430);
  }
}

// HELPERS

function ensureState() {
  if (!st) return;

  if (!Array.isArray(st.clues)) st.clues = [];
  if (!Array.isArray(st.ev)) st.ev = ['e1', 'e2', 'e3', 'e4', 'e5'];
  if (!st.tr || typeof st.tr !== 'object') st.tr = {};
  if (!Array.isArray(st.done)) st.done = [];
  if (typeof st.seen12 !== 'number') st.seen12 = 0;
}

function toast(message) {
  const element = $('#toast');
  if (!element) return;

  element.textContent = message;
  element.classList.add('on');

  clearTimeout(toast.timer);

  toast.timer = setTimeout(() => {
    element.classList.remove('on');
  }, 3000);
}

async function blackout() {
  document.body.classList.add('dark');
  await wait(950);
  document.body.classList.remove('dark');
}

setInterval(() => {
  if (st && Math.random() < .32) blackout();
}, 52000);

function formatEvidence(body) {
  const raw = typeof body === 'function' ? body() : body;

  return raw.replace(/\{\{(\w+)\|([^}]+)\}\}/g, (match, id, text) => {
    const found = st.clues.includes(id);

    return `<span class="c${found ? ' got' : ''}" data-c="${id}">${text}</span>`;
  });
}

function unlock(id) {
  if (!E[id] || st.ev.includes(id)) return;

  st.ev.push(id);
  toast('Bagong ebidensya: ' + E[id].t);

  if (id === 'e8') knock();
}

function addClue(id) {
  if (!CL[id] || st.clues.includes(id)) return;

  st.clues.push(id);
  toast('Clue: ' + CL[id]);

  if (st.clues.includes('clip2005')) unlock('e10');
  if (st.clues.includes('copy')) unlock('e12');

  save();
  desk();
}

// STORY SEQUENCES

async function sequence(lines, gap = 1900) {
  const overlay = $('#ov');
  if (!overlay) return;

  overlay.className = 'on';
  overlay.innerHTML = '';

  for (const line of lines) {
    const paragraph = document.createElement('p');

    if (typeof line === 'object') {
      paragraph.className = line.c || '';
      paragraph.textContent = line.t;
    } else {
      paragraph.textContent = line;
    }

    overlay.append(paragraph);
    await wait(gap);
  }
}

function continueButton(label) {
  return new Promise(resolve => {
    const button = document.createElement('button');

    button.textContent = label;

    button.onclick = () => {
      $('#ov').className = '';
      resolve();
    };

    $('#ov').append(button);
    button.focus();
  });
}

// TITLE SCREEN

function title() {
  const meta = D.meta;

  $('#app').innerHTML = `
    <section class="title">

      <span class="stamp">CASE FILE 002: ${meta.status}</span>

      <h1>THE BLACK<br>ARCHIVE</h1>

      <p class="q">
        "Five people entered the library.
        Six people left.
        But according to the university,
        nobody was ever missing."
      </p>

      ${meta.status === 'SOLVED' || meta.status === 'REOPENED'
        ? `<p class="warn">
            SUBJECT: ${D.pname || 'PLAYER'}<br>
            STATUS: MISSING
          </p>`
        : ''}

      ${meta.case3
        ? '<p class="warn">BAGONG FILE: CASE 003, THE INVESTIGATOR<br>Sealed pa.</p>'
        : ''}

      <input id="nm" placeholder="Pangalan mo, Investigator" maxlength="24" value="${st?.name || ''}">

      <div>
        <button id="go">${st ? 'Ituloy ang kaso' : 'Buksan ang file'}</button>
        ${st ? '<button id="rs" class="ghost">Magsimula ulit</button>' : ''}
      </div>

      <small>Mas maganda ang laro kung naka-headphones at madilim ang kwarto.</small>

    </section>
  `;

  $('#go').onclick = () => {
    const name = $('#nm').value.trim() || 'Investigator';

    drone();

    if (!st) {
      st = {
        name,
        clues: [],
        ev: ['e1', 'e2', 'e3', 'e4', 'e5'],
        tr: {},
        done: [],
        seen12: 0
      };

      save();
      intro();

    } else {
      st.name = name;
      ensureState();
      save();
      desk();
    }
  };

  if ($('#rs')) {
    $('#rs').onclick = () => {
      if (confirm('Buburahin ang progress. Sigurado ka?')) {
        st = null;
        save();
        title();
      }
    };
  }
}

// INTRODUCTION

function intro() {
  $('#app').innerHTML = `
    <section class="title">

      <div class="paper">

        <h3>BLACKWOOD UNIVERSITY SECURITY, October 18, 2025</h3>

Natanggap ang report ni Adrian Cole: hindi umuwi ang roommate niyang si Elias V. Mercer, 21, noong gabi ng October 17. Huling sinabi raw nito na may kukunin siya sa library.

Pero walang record ng Elias V. Mercer sa Blackwood University. Walang enrollment, walang grades, walang attendance. May student ID siya, may litrato, at may apat na taong nakasama siya.

CCTV, October 17:

8:43 PM  Limang tao ang pumasok.

9:17 PM  Nawalan ng ilaw.

10:06 PM  13-minutong putol sa footage.

11:16 PM  Anim ang lumabas.

Imbestigador ${st.name}, ikaw ang hahawak nito. I-click ang mga may tuldok na salita sa ebidensya para gawing clue. Kausapin ang apat na suspek at ipakita sa kanila ang ebidensya.

      </div>

      <p>
        <button id="st">Simulan ang imbestigasyon</button>
      </p>

    </section>
  `;

  $('#st').onclick = desk;
}

// MAIN INVESTIGATION DESK

function desk() {
  ensureState();

  const tabs = [
    ['ev', 'Ebidensya'],
    ['sus', 'Mga Suspek'],
    ['nb', 'Notebook'],
    ['acc', 'Hatulan']
  ];

  $('#app').innerHTML = `
    <header>
      <b>THE BLACK ARCHIVE / CASE 002</b>
      <span>Clues ${st.clues.length}/${Object.keys(CL).length}</span>
    </header>

    <nav>
      ${tabs.map(tab => `
        <button data-t="${tab[0]}" class="${cur.tab === tab[0] ? 'on' : ''}">
          ${tab[1]}
        </button>
      `).join('')}
    </nav>

    <main id="m"></main>
  `;

  document.querySelectorAll('nav button').forEach(button => {
    button.onclick = () => {
      cur.tab = button.dataset.t;
      desk();
    };
  });

  const screens = {
    ev: evidenceTab,
    sus: suspectTab,
    nb: notebookTab,
    acc: accusationTab
  };

  (screens[cur.tab] || evidenceTab)();
}

// EVIDENCE

function evidenceTab() {
  const main = $('#m');

  if (!st.ev.includes(cur.id)) {
    cur.id = st.ev[0];
  }

  main.innerHTML = `
    <div class="list">
      ${st.ev.map(id => `
        <button data-i="${id}" class="${cur.id === id ? 'on' : ''}">
          ${E[id].t}
        </button>
      `).join('')}
    </div>

    <div id="pp"></div>
  `;

  main.querySelectorAll('.list button').forEach(button => {
    button.onclick = () => openEvidence(button.dataset.i);
  });

  showEvidence(cur.id);
}

function showEvidence(id) {
  $('#pp').innerHTML = `
    <div class="paper">
      <h3>${E[id].t}</h3>
      ${formatEvidence(E[id].b)}
    </div>
  `;
}

async function openEvidence(id) {
  cur.id = id;

  if (id === 'e5') await blackout();
  if (id === 'e8') knock();

  if (id === 'e12' && !st.seen12) {
    st.seen12 = 1;
    save();
    await reveal();
  }

  desk();
}

// PLAYER REVEAL

async function reveal() {
  await sequence([
    'ACCESS DATE: ' + today(),
    'ACCESS USER: ' + st.name,
    'FILE ACCESSED: ELIAS_V_MERCER_FINAL',
    'STATUS: ACTIVE',

    {
      c: 'v',
      t: '"If you\'re listening to this, then you\'ve already found the archive."'
    },

    {
      c: 'v',
      t: '"I need you to understand something."'
    },

    {
      c: 'v',
      t: '"You weren\'t investigating my disappearance."'
    },

    {
      c: 'v',
      t: '"You were investigating how you disappeared."'
    },

    'MISSING PERSON REPORT',
    'NAME: ' + st.name,
    'LAST SEEN: ' + today(),
    'STATUS: MISSING',
    'The investigation has been active for 21 years.'

  ], 1500);

  await continueButton('Bumalik sa desk');
}

// SUSPECT INTERROGATION

function suspectTab() {
  const main = $('#m');
  const suspect = SUS[cur.sus];
  const transcript = st.tr[cur.sus] || [];

  main.innerHTML = `
    <div class="list">

      ${Object.keys(SUS).map(key => `
        <button data-s="${key}" class="${cur.sus === key ? 'on' : ''}">
          ${SUS[key].n}
        </button>
      `).join('')}

    </div>

    <div>

      <div class="paper">
        <h3>${suspect.n}</h3>
        ${suspect.r}
      </div>

      <div class="tr">

        ${transcript.map(line => `
          <p class="${line[0] ? 'me' : ''}">
            ${line[0] ? 'Ikaw' : suspect.n.split(' ')[0]}: ${line[1]}
          </p>
        `).join('')}

      </div>

      <p>
        ${suspect.q.map((question, index) => `
          <button data-q="${index}">${question[0]}</button>
        `).join('')}
      </p>

      <p>

        <select id="pe">
          ${st.ev.map(id => `
            <option value="${id}">${E[id].t}</option>
          `).join('')}
        </select>

        <br>

        <button id="pr">Ipakita ang ebidensya</button>

      </p>

    </div>
  `;

  main.querySelectorAll('[data-s]').forEach(button => {
    button.onclick = () => {
      cur.sus = button.dataset.s;
      desk();
    };
  });

  main.querySelectorAll('[data-q]').forEach(button => {
    button.onclick = () => {
      say(suspect.q[Number(button.dataset.q)]);
    };
  });

  $('#pr').onclick = () => {

    const evidenceId = $('#pe').value;
    const index = suspect.p.findIndex(item => item.ev === evidenceId);
    const key = cur.sus + index;

    const log = st.tr[cur.sus] || (st.tr[cur.sus] = []);

    log.push([1, '(ipinakita) ' + E[evidenceId].t]);

    if (index < 0) {

      log.push([0, 'Hindi ko alam kung bakit mo iyan pinapakita sa akin.']);

    } else if (st.done.includes(key)) {

      log.push([0, 'Nasabi ko na ang lahat tungkol diyan.']);

    } else if (index > 0 && !st.done.includes(cur.sus + (index - 1))) {

      log.push([0, 'Wala akong sasabihin diyan. Hindi pa.']);

    } else {

      st.done.push(key);
      log.push([0, suspect.p[index].a]);

      suspect.p[index].un.forEach(unlock);
    }

    save();
    desk();
  };
}

function say(question) {
  const log = st.tr[cur.sus] || (st.tr[cur.sus] = []);

  log.push(
    [1, question[0]],
    [0, question[1]]
  );

  save();
  desk();
}

// NOTEBOOK

function notebookTab() {
  $('#m').innerHTML = `
    <div class="paper" style="grid-column:1/-1">

      <h3>Investigator's Notebook</h3>

      ${st.clues.length
        ? st.clues.map(clue => '- ' + CL[clue]).join('\n')
        : 'Wala pang clue. Magbasa ng ebidensya at i-click ang mga may tuldok na salita.'}

    </div>
  `;
}

// FINAL ACCUSATION

function accusationTab() {

  const select = (id, question, options) => `
    <p>
      ${question}<br>

      <select id="${id}">
        ${options.map(option => `
          <option value="${option[0]}">${option[1]}</option>
        `).join('')}
      </select>

    </p>
  `;

  $('#m').innerHTML = `

    <div style="grid-column:1/-1">

      <div class="paper">

        <h3>Final Reconstruction</h3>

        Isara ang kaso kapag handa ka na. Hindi ito mababawi.

      </div>

      ${select('a1', 'Sino ang pang-anim na lumabas?', [
        ['x1', 'Si Daniel na nakalabas sa emergency exit'],
        ['copy', 'Ang Elias na naiwan sa Room 0 noong 2005, isang copy mula sa alaala'],
        ['x2', 'Si Adrian na buhay pa']
      ])}

      ${select('a2', 'Sino ang nagplano ng lahat?', [
        ['marcus', 'Marcus'],
        ['sophia', 'Sophia'],
        ['daniel', 'Daniel'],
        ['adrian', 'Adrian']
      ])}

      ${select('a3', 'Sino ang unang taong nawala?', [
        ['adrian', 'Adrian'],
        ['elias', 'Elias Mercer'],
        ['sixth', 'Ang ikaanim na estudyanteng walang pangalan'],
        ['player', 'Walang nawala']
      ])}

      <button id="fl">I-file ang hatol</button>

    </div>
  `;

  $('#fl').onclick = () => {

    if (st.clues.length < 6) {
      toast('Kulang pa ang ebidensya. Kailangan ng hindi bababa sa 6 clues.');
      return;
    }

    const [answer, planner, firstMissing] =
      ['a1', 'a2', 'a3'].map(id => $('#' + id).value);

    const has = clue => st.clues.includes(clue);

    const core = [
      'sixOut',
      'clip2005',
      'adrDead',
      'replace',
      'copy'
    ].every(has);

    const all = Object.keys(CL).every(has);

    const correct = answer === 'copy' && planner === 'sophia';

    if (correct && firstMissing === 'sixth' && all) {
      endC();

    } else if (
      correct &&
      (firstMissing === 'elias' || firstMissing === 'sixth') &&
      core
    ) {
      endB();

    } else {
      endA();
    }
  };
}

// ENDINGS

async function endA() {

  await sequence([
    { c: 'big', t: 'CASE CLOSED.' },
    'You closed the wrong case.'
  ], 2600);

  D.meta.case3 = true;
  save();

  await wait(1800);

  $('#ov').innerHTML = '<p>Isara na ang tab na ito.</p>';
}

async function endB() {

  await sequence([
    { c: 'v', t: '"You found me."' },
    { c: 'v', t: '"But you shouldn\'t have."' }
  ], 2800);

  D.meta.status = 'SOLVED';
  D.pname = st.name;

  st = null;
  save();

  $('#ov').className = '';
  title();
}

async function endC() {

  await sequence([
    'Binuksan mo ang Room 0.',
    'Ang totoong nawawala noong 2005 ay hindi si Elias.',
    'Ito ang ikaanim na estudyanteng walang pangalan sa litrato. Ang unang taong nabura sa archive.',
    'Si Elias ay ginamit lamang na kapalit.',

    {
      c: 'v',
      t: '"You were never looking for the missing person."'
    },

    {
      c: 'v',
      t: '"You were looking for the person who made everyone disappear."'
    },

    {
      c: 'big',
      t: 'CASE STATUS: REOPENED'
    }

  ], 2600);

  await wait(1800);

  D.meta.status = 'REOPENED';
  D.pname = st.name;

  st = null;
  save();

  $('#ov').className = '';
  title();
}

// CLICKABLE CLUES

document.addEventListener('click', event => {
  const clue = event.target.closest('.c');

  if (clue && st) {
    addClue(clue.dataset.c);
  }
});

// START GAME

document.addEventListener('DOMContentLoaded', () => {

  ensureState();
  title();

  const muteButton = $('#mute');

  if (muteButton) {
    muteButton.onclick = () => {

      muted = !muted;

      if (G) {
        G.gain.value = muted ? 0 : .035;
      }

      muteButton.style.opacity = muted ? '.45' : '1';

      if (!muted) drone();
    };
  }

});

'use strict';

(() => {

  // ============================
  // BUSINESS EMPIRE v3.0
  // COMPLETE EDITION
  // ============================

  const $ = id => document.getElementById(id);

  const canvas = $('map');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    alert('Canvas is not supported by your browser.');
    return;
  }

  const SAVE = 'business-empire-complete-v3';

  // ============================
  // INITIAL PLAYER STATE
  // ============================

  const initial = () => ({
    cash: 2500,
    debt: 0,
    rep: 50,
    knowledge: 0,
    customers: 0,
    chapter: 0,
    step: 0,
    finished: false,
    failed: false,
    history: []
  });

  let state;

  try {
    state = {
      ...initial(),
      ...JSON.parse(
        localStorage.getItem(SAVE) || '{}'
      )
    };
  } catch {
    state = initial();
  }

  // ============================
  // SAVE GAME
  // ============================

  const save = () => {
    try {
      localStorage.setItem(
        SAVE,
        JSON.stringify(state)
      );
    } catch {}
  };

  const money = n =>
    '$' + Math.round(n).toLocaleString('en-US');

  // ============================
  // CITY LOCATIONS
  // ============================

  const locations = [
    {
      name: 'COFFEE CO.',
      x: 55, y: 70,
      w: 245, h: 170,
      color: '#bb6c58',
      roof: '#d48c61'
    },
    {
      name: 'CITY BANK',
      x: 355, y: 65,
      w: 210, h: 170,
      color: '#7087aa',
      roof: '#a6b5c9'
    },
    {
      name: 'MARKET',
      x: 625, y: 70,
      w: 220, h: 170,
      color: '#7c9d67',
      roof: '#b8b778'
    },
    {
      name: 'YOUR HOME',
      x: 60, y: 350,
      w: 230, h: 155,
      color: '#9e7a70',
      roof: '#cc9e87'
    },
    {
      name: 'OFFICE',
      x: 360, y: 350,
      w: 205, h: 155,
      color: '#8c8f9c',
      roof: '#b7bbc5'
    },
    {
      name: 'CITY STORE',
      x: 630, y: 350,
      w: 210, h: 155,
      color: '#9b8066',
      roof: '#d5a67e'
    }
  ];

  // ============================
  // DRAWING FUNCTIONS
  // ============================

  function box(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
  }

  function label(
    value,
    x,
    y,
    size = 16,
    color = '#fff'
  ) {
    ctx.fillStyle = color;
    ctx.font = `bold ${size}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillText(value, x, y);
  }

  // ============================
  // DRAW THE CITY
  // ============================

  function draw() {

    // Grass
    box(0, 0, 900, 550, '#567d66');

    // Grass details
    for (let x = 0; x < 900; x += 44) {
      for (let y = 0; y < 550; y += 42) {
        box(x + 9, y + 8, 3, 3, '#638a70');
      }
    }

    // Road
    box(0, 253, 900, 79, '#a7aaa3');
    box(0, 264, 900, 57, '#424e5c');

    // Road markings
    for (let x = 15; x < 900; x += 80) {
      box(x, 290, 38, 4, '#f2d078');
    }

    // Buildings
    locations.forEach((b, i) => {

      // Shadow
      box(
        b.x + 7,
        b.y + 10,
        b.w,
        b.h,
        '#30423f'
      );

      // Walls
      box(
        b.x,
        b.y,
        b.w,
        b.h,
        b.color
      );

      // Roof
      box(
        b.x + 10,
        b.y + 9,
        b.w - 20,
        b.h - 43,
        b.roof
      );

      // Sign
      box(
        b.x + 16,
        b.y + 15,
        b.w - 32,
        32,
        '#243a4b'
      );

      // Windows
      for (let k = 0; k < 3; k++) {
        const wx =
          b.x + 24 + k * (b.w - 70) / 2;

        box(
          wx,
          b.y + 75,
          30,
          27,
          '#b7d8df'
        );

        box(
          wx + 13,
          b.y + 75,
          4,
          27,
          '#58798a'
        );
      }

      // Door
      box(
        b.x + b.w / 2 - 18,
        b.y + b.h - 39,
        36,
        39,
        '#3a4856'
      );

      // Building name
      label(
        b.name,
        b.x + b.w / 2,
        b.y + 37,
        Math.min(17, b.w / 12)
      );

      // Mission star
      if (
        i === state.chapter % 6 &&
        !state.finished &&
        !state.failed
      ) {
        label(
          '★',
          b.x + b.w / 2,
          b.y - 10,
          29,
          '#ffe07a'
        );
      }

    });

    // Player character
    box(438, 284, 10, 20, '#243447');
    box(449, 284, 10, 20, '#243447');
    box(435, 267, 27, 22, '#49a7d5');
    box(440, 254, 17, 17, '#e6b18a');

    label('YOU', 448, 245, 12);

    label(
      'CLICK BUILDINGS TO EXPLORE',
      450,
      28,
      14,
      '#e8f7ec'
    );
  }

  // ============================
  // AP BUSINESS CHAPTERS
  // ============================

  const chapters = [

    // CHAPTER 1
    {
      name: 'UNIT 1 · ENTREPRENEURSHIP',
      title: 'Start Your Coffee Shop',

      intro:
        'You have $2,500. Your goal is to build a coffee shop that solves a real customer need.',

      steps: [
        {
          q: 'What is your first move?',

          options: [
            {
              t: 'Survey potential customers (−$150)',
              e: {
                cash: -150,
                knowledge: 20,
                rep: 5
              },
              f: 'Research helps validate customer needs before investing.'
            },
            {
              t: 'Buy equipment immediately (−$1,800)',
              e: {
                cash: -1800,
                knowledge: 2
              },
              f: 'Equipment may be useful, but you have not validated demand.'
            },
            {
              t: 'Rent the most expensive space (−$2,500)',
              e: {
                cash: -2500
              },
              f: 'Using all available cash creates a liquidity crisis.'
            }
          ]
        },

        {
          q: 'A rival café opens nearby. What is your strategy?',

          options: [
            {
              t: 'Offer a distinctive product customers want (−$200)',
              e: {
                cash: -200,
                rep: 12,
                knowledge: 10
              },
              f: 'Differentiation can create a competitive advantage.'
            },
            {
              t: 'Copy every competitor price (−$300)',
              e: {
                cash: -300,
                rep: -4
              },
              f: 'Price matching alone may not build a lasting advantage.'
            },
            {
              t: 'Ignore your competitors',
              e: {
                rep: -12
              },
              f: 'Ignoring market changes can weaken your business.'
            }
          ]
        }
      ]
    },

    // CHAPTER 2
    {
      name: 'UNIT 2 · MARKETING',
      title: 'Find Your Customers',

      intro:
        'Your café needs a clear target market and a marketing plan.',

      steps: [
        {
          q: 'How will you promote your café?',

          options: [
            {
              t: 'Target local students with a tested campaign (−$250)',
              e: {
                cash: -250,
                customers: 40,
                rep: 8,
                knowledge: 10
              },
              f: 'Segmentation and measurable promotion can improve efficiency.'
            },
            {
              t: 'Buy a giant billboard (−$1,200)',
              e: {
                cash: -1200,
                customers: 15
              },
              f: 'Expensive promotion may not reach the right audience.'
            },
            {
              t: 'Do no marketing',
              e: {
                customers: 3
              },
              f: 'Without awareness, fewer potential customers may visit.'
            }
          ]
        },

        {
          q: 'Customers say your coffee is too expensive. What next?',

          options: [
            {
              t: 'Test prices and customer willingness to pay (−$100)',
              e: {
                cash: -100,
                customers: 20,
                knowledge: 15
              },
              f: 'Price research can help balance demand and margins.'
            },
            {
              t: 'Cut prices without calculating costs',
              e: {
                cash: -450,
                customers: 12
              },
              f: 'Sales can increase while profit falls.'
            },
            {
              t: 'Ignore customer feedback',
              e: {
                rep: -15,
                customers: -8
              },
              f: 'Customer feedback is valuable marketing evidence.'
            }
          ]
        }
      ]
    },

    // CHAPTER 3
    {
      name: 'UNIT 3 · FINANCE & ACCOUNTING',
      title: 'Manage the Money',

      intro:
        'Your business must cover expenses and keep enough cash to operate.',

      steps: [
        {
          q: 'You need $1,000 for inventory. How do you finance it?',

          options: [
            {
              t: 'Use savings if available (−$1,000)',
              e: {
                cash: -1000,
                knowledge: 10
              },
              f: 'Self-financing avoids interest, but reduces available cash.'
            },
            {
              t: 'Take a $1,000 loan (+$1,000 cash and debt)',
              e: {
                cash: 1000,
                debt: 1000
              },
              f: 'A loan increases cash and liabilities; it is not revenue.'
            },
            {
              t: 'Borrow $3,000 unnecessarily',
              e: {
                cash: 3000,
                debt: 3000
              },
              f: 'Excess debt increases future repayment obligations.'
            }
          ]
        },

        {
          q: 'Your café earns $1,800 revenue and pays $1,100 operating costs. What is operating profit?',

          options: [
            {
              t: '$700 — reinvest the profit',
              e: {
                cash: 700,
                knowledge: 20,
                rep: 5
              },
              f: 'Correct: $1,800 − $1,100 = $700 operating profit.'
            },
            {
              t: '$1,800 — revenue equals profit',
              e: {
                cash: -250,
                knowledge: 2
              },
              f: 'Revenue is not profit; expenses must be deducted.'
            },
            {
              t: '$2,900 — add revenue and costs',
              e: {
                cash: -350
              },
              f: 'Expenses reduce profit; they are not added to revenue.'
            }
          ]
        }
      ]
    },

    // CHAPTER 4
    {
      name: 'UNIT 4 · MANAGEMENT',
      title: 'Lead Your Team',

      intro:
        'Your café is growing. You need people, performance measures, and a strategy.',

      steps: [
        {
          q: 'Employees are overwhelmed. What should you do?',

          options: [
            {
              t: 'Define roles and train the team (−$350)',
              e: {
                cash: -350,
                rep: 12,
                customers: 15,
                knowledge: 10
              },
              f: 'Clear responsibilities and training improve coordination.'
            },
            {
              t: 'Demand more work without support',
              e: {
                rep: -18,
                customers: -12
              },
              f: 'Poor leadership can hurt morale and service.'
            },
            {
              t: 'Hire without defining duties (−$600)',
              e: {
                cash: -600,
                rep: -3
              },
              f: 'Hiring without clear roles may not solve the problem.'
            }
          ]
        },

        {
          q: 'What is the best way to decide whether to expand?',

          options: [
            {
              t: 'Review cash flow, KPIs, and market demand (−$150)',
              e: {
                cash: -150,
                knowledge: 20,
                rep: 8
              },
              f: 'Use evidence and decision criteria before expanding.'
            },
            {
              t: 'Open a second shop immediately (−$2,500)',
              e: {
                cash: -2500,
                customers: 15
              },
              f: 'Expansion without sufficient capital can be dangerous.'
            },
            {
              t: 'Follow a competitor without analysis (−$900)',
              e: {
                cash: -900
              },
              f: 'A competitor’s strategy may not fit your business.'
            }
          ]
        }
      ]
    },

    // CHAPTER 5
    {
      name: 'UNIT 5 · PERSONAL FINANCE',
      title: 'Build Your Future',

      intro:
        'Your business is only one part of financial well-being. Plan for personal goals and risks.',

      steps: [
        {
          q: 'What should you do with your personal income?',

          options: [
            {
              t: 'Create a budget and emergency fund (−$300)',
              e: {
                cash: -300,
                knowledge: 15,
                rep: 5
              },
              f: 'Budgeting and emergency savings improve financial resilience.'
            },
            {
              t: 'Spend everything on luxury goods (−$1,500)',
              e: {
                cash: -1500
              },
              f: 'Spending all income leaves no buffer for emergencies.'
            },
            {
              t: 'Ignore taxes and future expenses (−$500)',
              e: {
                cash: -500,
                rep: -10
              },
              f: 'Planning should account for obligations and future costs.'
            }
          ]
        },

        {
          q: 'How should you approach long-term investing?',

          options: [
            {
              t: 'Diversify according to goals and risk tolerance (−$200)',
              e: {
                cash: -200,
                knowledge: 20,
                rep: 5
              },
              f: 'Diversification and time horizon matter when managing risk.'
            },
            {
              t: 'Put all savings in one risky asset (−$1,000)',
              e: {
                cash: -1000
              },
              f: 'Concentration can expose you to major losses.'
            },
            {
              t: 'Never plan for retirement',
              e: {
                knowledge: 0,
                rep: -5
              },
              f: 'Long-term goals benefit from early planning.'
            }
          ]
        }
      ]
    }

  ];

  // ============================
  // UPDATE PLAYER STATISTICS
  // ============================

  function stats() {
    $('stats').innerHTML = `
      <span>💵 ${money(state.cash)}</span>
      <span>🏦 Debt ${money(state.debt)}</span>
      <span>⭐ ${state.rep}/100</span>
      <span>📚 ${state.knowledge}</span>
      <span>👥 ${state.customers}</span>
    `;
  }

  // ============================
  // CREATE DECISION BUTTONS
  // ============================

  function addButton(title, fn) {
    const button = document.createElement('button');

    button.textContent = title;
    button.onclick = fn;

    $('choices').append(button);
  }

  // ============================
  // RENDER CURRENT MISSION
  // ============================

  function render() {

    stats();
    draw();

    $('choices').replaceChildren();
    $('feedback').textContent = '';

    // GAME OVER
    if (state.failed) {

      $('chapter').textContent = 'GAME OVER';

      $('missionTitle').textContent = 'Bankruptcy';

      $('story').textContent =
        'You ran out of available cash. Review the lesson and try a different strategy.';

      addButton(
        'Restart your business',
        reset
      );

      return;
    }

    // FINAL ENDING
    if (state.finished) {

      $('chapter').textContent =
        'THE END · COMPLETE EDITION';

      const success =
        state.cash - state.debt >= 3000 &&
        state.rep >= 60;

      $('missionTitle').textContent = success
        ? 'Business Empire: Successful CEO'
        : 'Business Empire: Lessons Learned';

      $('story').textContent = `
Final cash: ${money(state.cash)}
Debt: ${money(state.debt)}
Net cash after debt: ${money(state.cash - state.debt)}
Reputation: ${state.rep}/100

You completed all five learning chapters!
      `;

      addButton('Play again', reset);

      return;
    }

    // CURRENT CHAPTER
    const chapter = chapters[state.chapter];

    const mission = chapter.steps[state.step];

    $('chapter').textContent =
      `CHAPTER ${state.chapter + 1}/5 · ${chapter.name}`;

    $('missionTitle').textContent = chapter.title;

    $('story').textContent =
      chapter.intro + '\n\n' + mission.q;

    // OPTIONS
    mission.options.forEach(option => {
      addButton(
        option.t,
        () => choose(option)
      );
    });
  }

  // ============================
  // APPLY DECISION
  // ============================

  function choose(option) {

    // Apply economic effects
    for (const [key, value] of Object.entries(option.e)) {
      state[key] = (state[key] || 0) + value;
    }

    state.rep = Math.max(
      0,
      Math.min(100, state.rep)
    );

    state.customers = Math.max(
      0,
      state.customers
    );

    state.knowledge = Math.max(
      0,
      state.knowledge
    );

    // ============================
    // BUSINESS OPERATING SIMULATION
    // ============================

    // Each decision represents one operating period.
    // $15 revenue per customer, capped at $750.
    const revenue = Math.min(
      750,
      state.customers * 15
    );

    // Fixed operating costs
    const cost = 180;

    state.cash += revenue - cost;

    // Loan interest
    if (state.debt > 0) {
      const interest = Math.ceil(
        state.debt * 0.05
      );

      state.cash -= interest;
    }

    // Save decision history
    state.history.push({
      chapter: state.chapter,
      step: state.step,
      choice: option.t
    });

    const result = `
${option.f}

Operating simulation:
+${money(revenue)} sales
−${money(cost)} operating costs
${state.debt > 0
  ? 'Plus 5% interest on outstanding debt.'
  : 'No loan interest.'}
    `;

    // Bankruptcy
    if (state.cash <= 0) {
      state.failed = true;
    } else {

      // Advance to next mission
      state.step++;

      // Advance to next chapter
      if (
        state.step >=
        chapters[state.chapter].steps.length
      ) {
        state.chapter++;
        state.step = 0;

        // Finish game
        if (state.chapter >= chapters.length) {
          state.finished = true;
        }
      }
    }

    save();
    render();

    $('feedback').textContent = result;
  }

  // ============================
  // RESTART GAME
  // ============================

  function reset() {

    if (
      !confirm(
        'Start a new game? Your current progress will be replaced.'
      )
    ) {
      return;
    }

    state = initial();

    save();
    render();
  }

  $('restart').onclick = reset;

  // ============================
  // FULLSCREEN MODE
  // ============================

  $('fullscreen').onclick = async () => {

    try {

      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await $('app').requestFullscreen();
      }

    } catch {

      $('feedback').textContent =
        'Fullscreen is not available in this browser.';
    }
  };

  // ============================
  // CITY BUILDING INTERACTION
  // ============================

  canvas.addEventListener('click', event => {

    const bounds = canvas.getBoundingClientRect();

    const scale = Math.min(
      bounds.width / 900,
      bounds.height / 550
    );

    const offsetX =
      (bounds.width - 900 * scale) / 2;

    const offsetY =
      (bounds.height - 550 * scale) / 2;

    const x =
      (event.clientX - bounds.left - offsetX) / scale;

    const y =
      (event.clientY - bounds.top - offsetY) / scale;

    const building = locations.find(b =>
      x >= b.x &&
      x <= b.x + b.w &&
      y >= b.y &&
      y <= b.y + b.h
    );

    if (building) {
      $('mapHint').textContent =
        `Visiting ${building.name} · Make decisions in the mission panel`;
    }

  });

  // ============================
  // START GAME
  // ============================

  render();

})();

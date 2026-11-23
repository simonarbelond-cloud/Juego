
'use strict';

(function () {

  // =====================================
  // BUSINESS EMPIRE — PLAYABLE EDITION
  // =====================================

  const $ = id => document.getElementById(id);

  const STORAGE = 'business-empire-playable-fixed-v1';

  // =====================================
  // CHAPTERS AND MISSIONS
  // =====================================

  const chapters = [

    // UNIT 1 — ENTREPRENEURSHIP
    {
      name: 'UNIT 1 · ENTREPRENEURSHIP',
      title: 'Start Your Coffee Shop',

      intro:
        'You have $2,500. Maya wants to help you launch a coffee shop.',

      missions: [
        {
          q: 'What should you do before investing?',

          options: [
            [
              'Research customer demand (−$150)',
              -150, 0, 5, 20, 0,
              'Market research reduces uncertainty and helps identify customer needs.'
            ],
            [
              'Buy equipment without research (−$1,800)',
              -1800, 0, 0, 0, 0,
              'You own equipment, but have very little cash left.'
            ],
            [
              'Rent a luxury location (−$2,500)',
              -2500, 0, 0, 0, 0,
              'You spent all your savings. A business needs working capital.'
            ]
          ]
        },

        {
          q: 'A competing café opens. How will you respond?',

          options: [
            [
              'Offer a distinctive product (−$200)',
              -200, 0, 10, 10, 12,
              'Differentiation can create competitive advantage.'
            ],
            [
              'Copy prices without checking costs (−$300)',
              -300, 0, -5, 0, 3,
              'Matching prices can hurt margins.'
            ],
            [
              'Ignore the competition',
              0, 0, -12, 0, -5,
              'Businesses should monitor their competitors.'
            ]
          ]
        }
      ]
    },

    // UNIT 2 — MARKETING
    {
      name: 'UNIT 2 · MARKETING',
      title: 'Win Your Customers',

      intro:
        'Your café needs customers, a target market, and a marketing strategy.',

      missions: [
        {
          q: 'Which promotion is most appropriate for your small budget?',

          options: [
            [
              'Test targeted social ads (−$250)',
              -250, 0, 8, 10, 30,
              'Targeted campaigns can reach likely customers efficiently.'
            ],
            [
              'Buy an expensive billboard (−$1,200)',
              -1200, 0, 1, 0, 12,
              'Broad advertising can be costly and hard to measure.'
            ],
            [
              'Do not promote the café',
              0, 0, -5, 0, 2,
              'Low awareness can limit demand.'
            ]
          ]
        },

        {
          q: 'Customers say your coffee is expensive. What do you do?',

          options: [
            [
              'Research willingness to pay (−$100)',
              -100, 0, 5, 15, 20,
              'Pricing should consider costs, customer value, and demand.'
            ],
            [
              'Cut prices without calculating margins (−$400)',
              -400, 0, 0, 0, 15,
              'More sales do not always mean more profit.'
            ],
            [
              'Ignore customer feedback',
              0, 0, -15, 0, -10,
              'Customer feedback is useful evidence.'
            ]
          ]
        }
      ]
    },

    // UNIT 3 — FINANCE
    {
      name: 'UNIT 3 · FINANCE',
      title: 'Keep Your Business Solvent',

      intro:
        'You need to manage borrowing, profit, and cash flow.',

      missions: [
        {
          q: 'You need inventory. How do you finance it?',

          options: [
            [
              'Buy only $500 of essential inventory',
              -500, 0, 3, 10, 5,
              'Smaller purchases preserve cash for other needs.'
            ],
            [
              'Take a $1,000 loan',
              1000, 1000, 0, 10, 8,
              'Borrowing increases cash AND debt, not revenue.'
            ],
            [
              'Borrow $3,000 without a plan',
              3000, 3000, -5, 0, 8,
              'More debt creates repayment obligations.'
            ]
          ]
        },

        {
          q: 'Revenue is $1,800 and expenses are $1,100. What is operating profit?',

          options: [
            [
              '$700',
              700, 0, 5, 20, 5,
              'Correct: $1,800 − $1,100 = $700.'
            ],
            [
              '$1,800',
              -250, 0, 0, 0, 0,
              'Revenue is not the same as profit.'
            ],
            [
              '$2,900',
              -350, 0, 0, 0, 0,
              'Expenses must be subtracted from revenue.'
            ]
          ]
        }
      ]
    },

    // UNIT 4 — MANAGEMENT
    {
      name: 'UNIT 4 · MANAGEMENT',
      title: 'Lead Your Team',

      intro:
        'The café is growing. You must manage people and decide whether to expand.',

      missions: [
        {
          q: 'Employees are overwhelmed. What should you do?',

          options: [
            [
              'Train staff and clarify responsibilities (−$300)',
              -300, 0, 12, 10, 10,
              'Training and clear roles improve service.'
            ],
            [
              'Demand more work with no support',
              0, 0, -18, 0, -12,
              'Poor leadership damages morale and customer experience.'
            ],
            [
              'Hire without planning roles (−$600)',
              -600, 0, -2, 0, 4,
              'Hiring without a clear plan may not solve bottlenecks.'
            ]
          ]
        },

        {
          q: 'Should you open a second location?',

          options: [
            [
              'Review KPIs and cash flow (−$150)',
              -150, 0, 8, 20, 5,
              'Use financial and market evidence to evaluate expansion.'
            ],
            [
              'Expand immediately (−$2,500)',
              -2500, 0, 0, 0, 20,
              'Rapid expansion can create a cash shortage.'
            ],
            [
              'Copy a competitor (−$900)',
              -900, 0, -5, 0, 4,
              'Another business strategy may not suit yours.'
            ]
          ]
        }
      ]
    },

    // UNIT 5 — PERSONAL FINANCE
    {
      name: 'UNIT 5 · PERSONAL FINANCE',
      title: 'Plan Your Future',

      intro:
        'Your business is only one part of your financial life.',

      missions: [
        {
          q: 'How should you manage your personal income?',

          options: [
            [
              'Build a budget and emergency fund (−$200)',
              -200, 0, 5, 15, 0,
              'A budget and emergency savings help manage uncertainty.'
            ],
            [
              'Spend on luxury goods (−$1,500)',
              -1500, 0, 0, 0, 0,
              'Spending all savings reduces financial resilience.'
            ],
            [
              'Ignore future expenses (−$500)',
              -500, 0, -10, 0, 0,
              'Plan for taxes and unexpected costs.'
            ]
          ]
        },

        {
          q: 'How should you approach long-term investing?',

          options: [
            [
              'Diversify according to your goals (−$200)',
              -200, 0, 5, 20, 0,
              'Diversification can reduce concentration risk, but not eliminate risk.'
            ],
            [
              'Put everything into one risky asset (−$1,000)',
              -1000, 0, 0, 0, 0,
              'Concentrated investments can produce large losses.'
            ],
            [
              'Never plan for retirement',
              0, 0, -5, 0, 0,
              'Long-term financial goals benefit from early planning.'
            ]
          ]
        }
      ]
    }

  ];

  // =====================================
  // PLAYER STATE
  // =====================================

  function fresh() {
    return {
      cash: 2500,
      debt: 0,
      rep: 50,
      knowledge: 0,
      customers: 0,
      chapter: 0,
      mission: 0,
      finished: false,
      failed: false,
      feedback: '',
      history: []
    };
  }

  function read() {
    try {
      const x = JSON.parse(
        localStorage.getItem(STORAGE)
      );

      if (
        x &&
        Number.isFinite(x.cash) &&
        Number.isInteger(x.chapter) &&
        x.chapter >= 0 &&
        x.chapter <= 5 &&
        Number.isInteger(x.mission) &&
        x.mission >= 0 &&
        x.mission <= 2
      ) {
        return { ...fresh(), ...x };
      }

    } catch (e) {
      console.warn('Save unavailable:', e);
    }

    return fresh();
  }

  let state = read();

  function save() {
    try {
      localStorage.setItem(
        STORAGE,
        JSON.stringify(state)
      );
    } catch (e) {
      console.warn('Could not save game:', e);
    }
  }

  // =====================================
  // FORMATTING
  // =====================================

  const fmt = n =>
    '$' + Math.round(n).toLocaleString('en-US');

  // =====================================
  // BUTTON CREATION
  // =====================================

  function button(label, handler) {
    const b = document.createElement('button');

    b.className = 'choice';
    b.textContent = label;

    b.addEventListener('click', handler);

    $('choices').appendChild(b);
  }

  // =====================================
  // RENDER GAME
  // =====================================

  function render() {

    // Update statistics
    $('stats').innerHTML = `
      <span>💵 ${fmt(state.cash)}</span>
      <span>🏦 ${fmt(state.debt)}</span>
      <span>⭐ ${state.rep}/100</span>
      <span>📚 ${state.knowledge}</span>
      <span>👥 ${state.customers}</span>
    `;

    $('choices').replaceChildren();

    const complete =
      state.chapter * 2 + state.mission;

    $('bar').style.width =
      (Math.min(10, complete) * 10) + '%';

    // Highlight current location
    const activePlaces = [0, 0, 2, 1, 4];

    document.querySelectorAll('.place')
      .forEach((b, i) => {
        b.classList.toggle(
          'active',
          !state.finished &&
          !state.failed &&
          i === activePlaces[
            Math.min(state.chapter, 4)
          ]
        );
      });

    // Show previous decision feedback
    $('feedback').textContent =
      state.feedback || '';

    $('feedback').classList.toggle(
      'hidden',
      !state.feedback
    );

    // GAME OVER
    if (state.failed) {
      $('tag').textContent = 'GAME OVER';

      $('title').textContent = 'Bankruptcy';

      $('story').textContent =
        'Your business ran out of cash. Study the feedback and try again.';

      button('↻ Restart game', restart);
      return;
    }

    // FINISHED GAME
    if (state.finished) {

      const net = state.cash - state.debt;

      const win =
        net >= 3000 &&
        state.rep >= 60;

      $('tag').textContent =
        'THE END · 10/10 MISSIONS';

      $('title').textContent = win
        ? '🏆 Successful CEO!'
        : '🎓 Business Graduate';

      $('story').textContent =
        'You completed all five chapters!\n\n' +
        'Cash: ' + fmt(state.cash) + '\n' +
        'Debt: ' + fmt(state.debt) + '\n' +
        'Cash minus debt: ' + fmt(net) + '\n' +
        'Reputation: ' + state.rep + '/100\n\n' +
        (
          win
            ? 'You built a financially strong company.'
            : 'You learned important lessons. Try another strategy for a stronger result.'
        );

      button('Play again', restart);
      return;
    }

    // CURRENT MISSION
    const ch = chapters[state.chapter];
    const m = ch.missions[state.mission];

    $('tag').textContent =
      'CHAPTER ' + (state.chapter + 1) +
      '/5 · ' + ch.name +
      ' · MISSION ' + (complete + 1) + '/10';

    $('title').textContent = ch.title;

    $('story').textContent =
      ch.intro + '\n\n' + m.q;

    // Show choices
    m.options.forEach((o, i) => {
      button(
        String.fromCharCode(65 + i) + '. ' + o[0],
        () => choose(o)
      );
    });
  }

  // =====================================
  // DECISION ENGINE
  // =====================================

  function choose(o) {

    const [
      name,
      cash,
      debt,
      rep,
      knowledge,
      customers,
      lesson
    ] = o;

    // Apply immediate effects
    state.cash += cash;
    state.debt += debt;

    state.rep = Math.max(
      0,
      Math.min(100, state.rep + rep)
    );

    state.knowledge += knowledge;

    state.customers = Math.max(
      0,
      state.customers + customers
    );

    // Simulate business activity
    const revenue = Math.min(
      650,
      state.customers * 12
    );

    const expenses = 120;

    const interest = Math.ceil(
      state.debt * 0.02
    );

    state.cash += revenue - expenses - interest;

    // Educational feedback
    state.feedback =
      lesson + '\n\n' +
      'Business period:\n' +
      '+' + fmt(revenue) + ' sales\n' +
      '−' + fmt(expenses) + ' costs\n' +
      (
        interest
          ? '−' + fmt(interest) + ' loan interest.'
          : 'No loan interest.'
      );

    // Save decision history
    state.history.push({
      chapter: state.chapter,
      mission: state.mission,
      choice: name
    });

    // Bankruptcy
    if (state.cash <= 0) {
      state.failed = true;
    } else {

      // Next mission
      state.mission++;

      // Next chapter
      if (state.mission >= 2) {
        state.mission = 0;
        state.chapter++;
      }

      // Complete game
      if (state.chapter >= 5) {
        state.finished = true;
      }
    }

    save();
    render();
  }

  // =====================================
  // RESTART
  // =====================================

  function restart() {

    if (
      !confirm(
        'Start a new game? Current progress will be replaced.'
      )
    ) {
      return;
    }

    state = fresh();

    save();
    render();
  }

  $('restart').addEventListener(
    'click',
    restart
  );

  // =====================================
  // CITY INTERACTION
  // =====================================

  document.querySelectorAll('.place')
    .forEach(b => {

      b.addEventListener('click', () => {

        const name =
          b.querySelector('.name').textContent;

        $('tip').textContent =
          'Visiting ' + name +
          ' · Choose an answer in the mission panel';

        b.classList.add('active');

        setTimeout(() => {
          render();
        }, 700);
      });
    });

  // =====================================
  // FULLSCREEN
  // =====================================

  $('fullscreen').addEventListener(
    'click',
    async () => {

      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else {
          await $('app').requestFullscreen();
        }
      } catch (e) {
        $('tip').textContent =
          'Fullscreen is not available here.';
      }
    }
  );

  // =====================================
  // START
  // =====================================

  render();

})();

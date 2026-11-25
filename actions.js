
"use strict";

/* =====================================
   BUSINESS EMPIRE - CITY LIFE 2D+
   No external libraries or downloads.
===================================== */

(() => {
  const $ = id => document.getElementById(id);
  const canvas = $("gameCanvas");
  const ctx = canvas.getContext("2d");

  const SAVE = "business-empire-city-2d-v1";
  const money = n => "$" + Math.round(n).toLocaleString("en-US");
  const clamp = (n,min,max) => Math.max(min,Math.min(max,n));

  /* =====================================
     PLAYER DATA
  ===================================== */

  function freshGame() {
    return {
      cash:3500,
      debt:0,
      rep:50,
      customers:0,
      knowledge:0,
      inventory:10,
      staff:0,
      days:0,
      chapter:0,
      step:0,
      hasCar:false,
      driving:false,
      finished:false,
      failed:false,
      x:500,
      y:400
    };
  }

  function loadGame() {
    try {
      const data = JSON.parse(localStorage.getItem(SAVE));

      if (
        data &&
        Number.isFinite(data.cash) &&
        Number.isInteger(data.chapter) &&
        data.chapter >= 0 &&
        data.chapter <= 5 &&
        Number.isInteger(data.step) &&
        data.step >= 0 &&
        data.step <= 2
      ) {
        return {...freshGame(),...data,driving:false};
      }
    } catch(e) {
      console.warn("Save unavailable",e);
    }

    return freshGame();
  }

  let game = loadGame();

  function saveGame() {
    try {
      game.x = player.x;
      game.y = player.y;
      localStorage.setItem(SAVE,JSON.stringify(game));
    } catch(e) {
      console.warn("Could not save game",e);
    }
  }

  /* =====================================
     MISSION DATABASE
  ===================================== */

  const missions = [
    {
      unit:"ENTREPRENEURSHIP",
      title:"Start Your Coffee Shop",
      location:"cafe",
      description:"Visit Coffee Co. and meet Maya to plan your business.",
      question:"You want to open a coffee shop. What should you do first?",
      options:[
        {
          text:"Research customer needs. Cost: $150",
          cash:-150,rep:5,knowledge:20,customers:0,
          lesson:"Market research helps identify customer needs and validate demand."
        },
        {
          text:"Buy equipment immediately. Cost: $1,800",
          cash:-1800,rep:0,knowledge:0,customers:0,
          lesson:"Investing without validating demand increases business risk."
        },
        {
          text:"Rent an expensive location. Cost: $2,500",
          cash:-2500,rep:0,knowledge:0,customers:0,
          lesson:"High fixed costs can create a cash flow problem."
        }
      ]
    },
    {
      unit:"ENTREPRENEURSHIP",
      title:"Competitive Strategy",
      location:"office",
      description:"Visit the office and create your competitive strategy.",
      question:"A competing coffee shop opens nearby. What should you do?",
      options:[
        {
          text:"Differentiate your products. Cost: $200",
          cash:-200,rep:10,knowledge:10,customers:10,
          lesson:"Differentiation helps create competitive advantage."
        },
        {
          text:"Copy every competitor price. Cost: $300",
          cash:-300,rep:-5,knowledge:0,customers:3,
          lesson:"Price competition can reduce profit margins."
        },
        {
          text:"Ignore the competitor.",
          cash:0,rep:-12,knowledge:0,customers:-5,
          lesson:"Businesses should monitor their competitors."
        }
      ]
    },
    {
      unit:"MARKETING",
      title:"Marketing Campaign",
      location:"market",
      description:"Visit the market to plan a customer acquisition campaign.",
      question:"How should you attract your target customers?",
      options:[
        {
          text:"Targeted local advertising. Cost: $250",
          cash:-250,rep:8,knowledge:10,customers:30,
          lesson:"Market segmentation helps businesses reach relevant customers."
        },
        {
          text:"Buy an expensive billboard. Cost: $1,200",
          cash:-1200,rep:1,knowledge:0,customers:12,
          lesson:"Advertising costs should be compared with expected returns."
        },
        {
          text:"Do not advertise.",
          cash:0,rep:-5,knowledge:0,customers:2,
          lesson:"Low brand awareness can limit customer acquisition."
        }
      ]
    },
    {
      unit:"MARKETING",
      title:"Set Your Prices",
      location:"cafe",
      description:"Return to Coffee Co. and review customer feedback.",
      question:"Customers think your prices are too high. What do you do?",
      options:[
        {
          text:"Research willingness to pay. Cost: $100",
          cash:-100,rep:5,knowledge:15,customers:15,
          lesson:"Pricing should balance costs, demand and perceived value."
        },
        {
          text:"Lower prices without analysis. Cost: $400",
          cash:-400,rep:0,knowledge:0,customers:10,
          lesson:"More sales do not necessarily mean more profit."
        },
        {
          text:"Ignore customer feedback.",
          cash:0,rep:-15,knowledge:0,customers:-10,
          lesson:"Customer feedback provides useful market information."
        }
      ]
    },
    {
      unit:"FINANCE",
      title:"Business Financing",
      location:"bank",
      description:"Visit City Bank to discuss financing.",
      question:"You need additional inventory. How should you finance it?",
      options:[
        {
          text:"Buy essential inventory. Cost: $500",
          cash:-500,rep:3,knowledge:10,customers:5,
          lesson:"Careful inventory purchases preserve liquidity."
        },
        {
          text:"Take a $1,000 business loan.",
          cash:1000,debt:1000,rep:0,knowledge:10,customers:5,
          lesson:"Loans increase cash and liabilities, not revenue."
        },
        {
          text:"Borrow $3,000 without a plan.",
          cash:3000,debt:3000,rep:-5,knowledge:0,customers:5,
          lesson:"Debt creates repayment and interest obligations."
        }
      ]
    },
    {
      unit:"FINANCE",
      title:"Understand Profit",
      location:"office",
      description:"Visit the office and analyze the income statement.",
      question:"Revenue is $1,800 and operating expenses are $1,100. What is operating profit?",
      options:[
        {
          text:"$700",
          cash:700,rep:5,knowledge:20,customers:5,
          lesson:"Correct! Operating profit = revenue minus operating expenses."
        },
        {
          text:"$1,800",
          cash:-250,rep:0,knowledge:0,customers:0,
          lesson:"Revenue is not the same as profit."
        },
        {
          text:"$2,900",
          cash:-350,rep:0,knowledge:0,customers:0,
          lesson:"Expenses must be subtracted from revenue."
        }
      ]
    },
    {
      unit:"MANAGEMENT",
      title:"Manage Your Employees",
      location:"cafe",
      description:"Return to your café and improve employee performance.",
      question:"Employees are overwhelmed. What should you do?",
      options:[
        {
          text:"Train employees. Cost: $300",
          cash:-300,rep:12,knowledge:10,customers:10,
          lesson:"Training and clear responsibilities improve productivity."
        },
        {
          text:"Demand more work without support.",
          cash:0,rep:-18,knowledge:0,customers:-12,
          lesson:"Poor leadership can damage employee morale."
        },
        {
          text:"Hire without planning. Cost: $600",
          cash:-600,rep:-2,knowledge:0,customers:4,
          lesson:"Hiring should address specific business needs."
        }
      ]
    },
    {
      unit:"MANAGEMENT",
      title:"Expand Your Company",
      location:"office",
      description:"Visit the office to evaluate your expansion strategy.",
      question:"Should you open a second café?",
      options:[
        {
          text:"Review KPIs and cash flow. Cost: $150",
          cash:-150,rep:8,knowledge:20,customers:5,
          lesson:"Business expansion should be based on evidence and performance."
        },
        {
          text:"Expand immediately. Cost: $2,500",
          cash:-2500,rep:0,knowledge:0,customers:20,
          lesson:"Rapid expansion can create liquidity problems."
        },
        {
          text:"Copy a competitor. Cost: $900",
          cash:-900,rep:-5,knowledge:0,customers:4,
          lesson:"A strategy that works for another company may not suit yours."
        }
      ]
    },
    {
      unit:"PERSONAL FINANCE",
      title:"Personal Budget",
      location:"home",
      description:"Visit your home and organize your personal finances.",
      question:"How should you manage your personal income?",
      options:[
        {
          text:"Build a budget and emergency fund. Cost: $200",
          cash:-200,rep:5,knowledge:15,customers:0,
          lesson:"Budgeting and emergency savings improve financial resilience."
        },
        {
          text:"Spend $1,500 on luxury items.",
          cash:-1500,rep:0,knowledge:0,customers:0,
          lesson:"Excessive spending reduces financial flexibility."
        },
        {
          text:"Ignore future expenses. Cost: $500",
          cash:-500,rep:-10,knowledge:0,customers:0,
          lesson:"Planning should account for taxes and unexpected costs."
        }
      ]
    },
    {
      unit:"PERSONAL FINANCE",
      title:"Invest in Your Future",
      location:"bank",
      description:"Visit City Bank for your final financial decision.",
      question:"How should you approach long-term investing?",
      options:[
        {
          text:"Diversify according to your goals. Cost: $200",
          cash:-200,rep:5,knowledge:20,customers:0,
          lesson:"Diversification reduces concentration risk but cannot eliminate investment risk."
        },
        {
          text:"Put everything into one risky asset. Cost: $1,000",
          cash:-1000,rep:0,knowledge:0,customers:0,
          lesson:"Concentrated investments expose you to larger potential losses."
        },
        {
          text:"Never plan for retirement.",
          cash:0,rep:-5,knowledge:0,customers:0,
          lesson:"Long-term financial goals benefit from early planning."
        }
      ]
    }
  ];

  /* =====================================
     CITY WORLD
  ===================================== */

  const world = {
    width:1200,
    height:900
  };

  const buildings = [
    {
      id:"cafe",name:"COFFEE CO.",
      x:100,y:100,w:190,h:135,
      color:"#b87960",roof:"#874b3c"
    },
    {
      id:"bank",name:"CITY BANK",
      x:500,y:75,w:190,h:150,
      color:"#829ab0",roof:"#456b8d"
    },
    {
      id:"market",name:"MARKET",
      x:900,y:100,w:190,h:135,
      color:"#a5a76c",roof:"#607d50"
    },
    {
      id:"home",name:"YOUR HOME",
      x:100,y:650,w:190,h:135,
      color:"#c6a58a",roof:"#986b61"
    },
    {
      id:"office",name:"OFFICE",
      x:500,y:650,w:190,h:150,
      color:"#98a5ad",roof:"#546b7b"
    },
    {
      id:"dealer",name:"CITY MOTORS",
      x:900,y:650,w:200,h:135,
      color:"#bd9366",roof:"#875b3d"
    }
  ];

  const roads = [
    {x:0,y:410,w:1200,h:100},
    {x:390,y:0,w:100,h:900},
    {x:790,y:0,w:100,h:900}
  ];

  const player = {
    x:game.x,
    y:game.y,
    size:22,
    angle:0,
    moving:false
  };

  const car = {
    x:1000,
    y:540,
    angle:0,
    width:64,
    height:34
  };

  const trees = [
    [35,300],[160,320],[300,330],
    [560,300],[690,300],[970,300],
    [1120,330],[35,570],[300,570],
    [560,570],[700,570],[1120,570],
    [360,50],[850,40],[360,830],[850,830]
  ];

  /* =====================================
     CANVAS RESIZING
  ===================================== */

  let viewWidth=800;
  let viewHeight=600;
  let dpr=1;

  function resize() {
    const rect=canvas.getBoundingClientRect();

    viewWidth=Math.max(1,rect.width);
    viewHeight=Math.max(1,rect.height);
    dpr=Math.min(window.devicePixelRatio||1,1.5);

    canvas.width=Math.round(viewWidth*dpr);
    canvas.height=Math.round(viewHeight*dpr);

    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  window.addEventListener("resize",resize);
  resize();

  /* =====================================
     DRAWING HELPERS
  ===================================== */

  function roundedRect(x,y,w,h,r,fill,stroke) {
    ctx.beginPath();
    ctx.roundRect(x,y,w,h,r);

    if(fill) {
      ctx.fillStyle=fill;
      ctx.fill();
    }

    if(stroke) {
      ctx.strokeStyle=stroke;
      ctx.stroke();
    }
  }

  function text(str,x,y,size,color,align="center") {
    ctx.font="bold "+size+"px Arial";
    ctx.textAlign=align;
    ctx.textBaseline="middle";
    ctx.fillStyle=color;
    ctx.fillText(str,x,y);
  }

  /* =====================================
     DRAW CITY
  ===================================== */

  function drawGround() {
    ctx.fillStyle="#668c65";
    ctx.fillRect(0,0,world.width,world.height);

    // Grass details
    ctx.fillStyle="#739a70";

    for(let x=20;x<1200;x+=80) {
      for(let y=20;y<900;y+=80) {
        if((x+y)%3===0) {
          ctx.fillRect(x,y,13,3);
        }
      }
    }

    // Roads
    roads.forEach(r=>{
      ctx.fillStyle="#48535c";
      ctx.fillRect(r.x,r.y,r.w,r.h);

      ctx.fillStyle="#b3b6aa";

      if(r.h>r.w) {
        ctx.fillRect(r.x,r.y,8,r.h);
        ctx.fillRect(r.x+r.w-8,r.y,8,r.h);

        ctx.fillStyle="#dfc878";
        for(let y=r.y+15;y<r.y+r.h;y+=38) {
          ctx.fillRect(r.x+r.w/2-2,y,4,20);
        }
      } else {
        ctx.fillRect(r.x,r.y,r.w,7);
        ctx.fillRect(r.x,r.y+r.h-7,r.w,7);

        ctx.fillStyle="#dfc878";
        for(let x=r.x+15;x<r.x+r.w;x+=38) {
          ctx.fillRect(x,r.y+r.h/2-2,20,4);
        }
      }
    });
  }

  function drawTree(x,y) {
    ctx.fillStyle="#604c39";
    ctx.fillRect(x-5,y-2,10,25);

    ctx.fillStyle="#326f49";
    ctx.beginPath();
    ctx.arc(x,y-10,21,0,Math.PI*2);
    ctx.fill();

    ctx.fillStyle="#4c915a";
    ctx.beginPath();
    ctx.arc(x-7,y-17,12,0,Math.PI*2);
    ctx.fill();
  }

  function drawBuilding(b) {
    // Shadow
    ctx.fillStyle="#203b3370";
    ctx.fillRect(b.x+10,b.y+12,b.w,b.h);

    // Main building
    ctx.fillStyle=b.color;
    ctx.fillRect(b.x,b.y,b.w,b.h);

    // Roof
    ctx.fillStyle=b.roof;
    ctx.fillRect(b.x-5,b.y-10,b.w+10,24);

    // Windows
    const cols=3;
    const rows=2;

    for(let row=0;row<rows;row++) {
      for(let col=0;col<cols;col++) {
        const wx=b.x+25+col*55;
        const wy=b.y+40+row*39;

        ctx.fillStyle="#8ec7d6";
        ctx.fillRect(wx,wy,30,23);

        ctx.strokeStyle="#425e69";
        ctx.lineWidth=3;
        ctx.strokeRect(wx,wy,30,23);
      }
    }

    // Door
    ctx.fillStyle="#42515c";
    ctx.fillRect(b.x+b.w/2-17,b.y+b.h-48,34,48);

    // Sign
    roundedRect(
      b.x+15,b.y+5,b.w-30,25,3,
      "#193448"
    );

    text(b.name,b.x+b.w/2,b.y+18,12,"#ffffff");
  }

  /* =====================================
     DRAW CAR
  ===================================== */

  function drawCar(x,y,angle,color="#c99a4e") {
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(angle);

    // Shadow
    ctx.fillStyle="#20332c88";
    ctx.fillRect(-29,-12,62,34);

    // Wheels
    ctx.fillStyle="#20252b";
    for(const wx of [-20,20]) {
      for(const wy of [-17,17]) {
        ctx.fillRect(wx-7,wy-4,14,8);
      }
    }

    // Body
    roundedRect(-30,-14,60,28,6,color,"#303c43");

    // Roof
    roundedRect(-15,-11,30,22,4,"#59849c","#263e50");

    // Windows
    ctx.fillStyle="#a8d6df";
    ctx.fillRect(-12,-9,24,18);

    // Lights
    ctx.fillStyle="#f4e7a1";
    ctx.fillRect(26,-9,4,7);
    ctx.fillRect(26,2,4,7);

    ctx.restore();
  }

  /* =====================================
     DRAW PLAYER
  ===================================== */

  function drawPlayer() {
    ctx.save();
    ctx.translate(player.x,player.y);

    // Shadow
    ctx.fillStyle="#24362d77";
    ctx.beginPath();
    ctx.ellipse(0,12,14,7,0,0,Math.PI*2);
    ctx.fill();

    // Legs
    ctx.fillStyle="#253a4b";
    ctx.fillRect(-9,4,7,13);
    ctx.fillRect(2,4,7,13);

    // Body
    ctx.fillStyle="#3589ba";
    roundedRect(-12,-13,24,24,5,"#3589ba");

    // Arms
    ctx.fillStyle="#d8a17e";
    ctx.fillRect(-16,-9,5,15);
    ctx.fillRect(11,-9,5,15);

    // Head
    ctx.fillStyle="#d8a17e";
    ctx.beginPath();
    ctx.arc(0,-20,10,0,Math.PI*2);
    ctx.fill();

    // Hair
    ctx.fillStyle="#27313b";
    ctx.fillRect(-9,-28,18,5);

    // Direction indicator
    ctx.fillStyle="#ffffff";
    ctx.beginPath();
    ctx.arc(0,-20,2,0,Math.PI*2);
    ctx.fill();

    ctx.restore();
  }

  /* =====================================
     WORLD DRAWING
  ===================================== */

  let cameraX=0;
  let cameraY=0;

  function renderWorld() {
    ctx.clearRect(0,0,viewWidth,viewHeight);

    cameraX=clamp(
      player.x-viewWidth/2,
      0,
      Math.max(0,world.width-viewWidth)
    );

    cameraY=clamp(
      player.y-viewHeight/2,
      0,
      Math.max(0,world.height-viewHeight)
    );

    ctx.save();
    ctx.translate(-cameraX,-cameraY);

    drawGround();

    trees.forEach(t=>drawTree(t[0],t[1]));

    buildings.forEach(drawBuilding);

    // Mission marker
    const m=currentMission();

    if(m&&!game.finished&&!game.failed) {
      const b=buildings.find(x=>x.id===m.location);

      if(b) {
        const x=b.x+b.w/2;
        const y=b.y+b.h+17;

        ctx.fillStyle="#ffc05c";
        ctx.beginPath();
        ctx.arc(x,y,9+Math.sin(Date.now()/180)*2,0,Math.PI*2);
        ctx.fill();

        text("!",x,y,12,"#172638");
      }
    }

    if(game.hasCar) {
      drawCar(car.x,car.y,car.angle);
    }

    if(!game.driving) {
      drawPlayer();
    }

    ctx.restore();

    drawMapMarker();
  }

  function drawMapMarker() {
    const m=currentMission();
    if(!m)return;

    const b=buildings.find(x=>x.id===m.location);
    if(!b)return;

    const x=b.x+b.w/2-cameraX;
    const y=b.y+b.h/2-cameraY;

    if(x<0||y<0||x>viewWidth||y>viewHeight)return;

    ctx.fillStyle="#ffc05c";
    ctx.beginPath();
    ctx.arc(x,y,4,0,Math.PI*2);
    ctx.fill();
  }

  /* =====================================
     COLLISIONS
  ===================================== */

  function blocked(x,y,r=12) {
    if(x<r||y<r||x>world.width-r||y>world.height-r) {
      return true;
    }

    return buildings.some(b=>
      x+r>b.x &&
      x-r<b.x+b.w &&
      y+r>b.y &&
      y-r<b.y+b.h
    );
  }

  /* =====================================
     MOVEMENT
  ===================================== */

  const keys=new Set();

  function move(dt) {
    if(phoneOpen||dialogOpen||game.finished||game.failed)return;

    let dx=0;
    let dy=0;

    if(keys.has("w")||keys.has("arrowup"))dy--;
    if(keys.has("s")||keys.has("arrowdown"))dy++;
    if(keys.has("a")||keys.has("arrowleft"))dx--;
    if(keys.has("d")||keys.has("arrowright"))dx++;

    const length=Math.hypot(dx,dy);

    if(!length)return;

    dx/=length;
    dy/=length;

    const speed=game.driving?
      260:
      (keys.has("shift")?205:125);

    const nx=(game.driving?car.x:player.x)+dx*speed*dt;
    const ny=(game.driving?car.y:player.y)+dy*speed*dt;

    const radius=game.driving?29:12;

    if(!blocked(nx,game.driving?car.y:player.y,radius)) {
      if(game.driving)car.x=nx;
      else player.x=nx;
    }

    if(!blocked(game.driving?car.x:player.x,ny,radius)) {
      if(game.driving)car.y=ny;
      else player.y=ny;
    }

    if(game.driving) {
      if(dx||dy)car.angle=Math.atan2(dy,dx);
    } else {
      player.moving=true;
      player.angle=Math.atan2(dy,dx);
    }
  }

  /* =====================================
     NEAREST INTERACTION
  ===================================== */

  function distance(x1,y1,x2,y2) {
    return Math.hypot(x1-x2,y1-y2);
  }

  function nearestTarget() {
    const x=game.driving?car.x:player.x;
    const y=game.driving?car.y:player.y;

    if(game.driving) {
      return {type:"car",distance:0};
    }

    let best=null;
    let bestDistance=Infinity;

    buildings.forEach(b=>{
      const d=distance(
        x,y,
        b.x+b.w/2,
        b.y+b.h+15
      );

      if(d<bestDistance) {
        bestDistance=d;
        best={type:"building",building:b};
      }
    });

    if(game.hasCar) {
      const d=distance(x,y,car.x,car.y);

      if(d<bestDistance) {
        bestDistance=d;
        best={type:"car"};
      }
    }

    return bestDistance<65?best:null;
  }

  function interaction() {
    const target=nearestTarget();

    $("interaction").classList.toggle(
      "hidden",
      !target||phoneOpen||dialogOpen
    );

    if(target) {
      $("interactionText").textContent=
        target.type==="car"?
        (game.driving?"EXIT CAR":"ENTER CAR"):
        "ENTER "+target.building.name;
    }
  }

  /* =====================================
     UI AND HUD
  ===================================== */

  let notificationTimeout;

  function notify(message) {
    const el=$("notification");
    el.textContent=message;
    el.classList.remove("hidden");

    clearTimeout(notificationTimeout);

    notificationTimeout=setTimeout(()=>{
      el.classList.add("hidden");
    },3500);
  }

  function currentMission() {
    if(game.chapter>=5)return null;
    return missions[game.chapter*2+game.step];
  }

  function updateUI() {
    $("cash").textContent=money(game.cash);
    $("debt").textContent=money(game.debt);
    $("rep").textContent=game.rep;
    $("customers").textContent=game.customers;

    $("inventory").textContent=game.inventory+" cups";
    $("staff").textContent=game.staff;
    $("days").textContent=game.days;

    const progress=game.finished?10:game.chapter*2+game.step;

    $("progressBar").style.width=(progress*10)+"%";

    const m=currentMission();

    if(m) {
      $("objective").textContent=m.title;
      const b=buildings.find(x=>x.id===m.location);
      $("destination").textContent=
        "Destination: "+b.name;

      $("missionTitle").textContent=m.title;
      $("missionDescription").textContent=
        m.description+"\n\nGo to "+b.name+
        " and press E to interact.";
    } else if(game.failed) {
      $("objective").textContent="Business bankrupt";
      $("destination").textContent="Start a new game";
      $("missionTitle").textContent="Bankruptcy";
      $("missionDescription").textContent=
        "Your business ran out of cash.";
    } else {
      $("objective").textContent="Campaign complete";
      $("destination").textContent="All 10 missions finished";
      $("missionTitle").textContent="Campaign complete";
      $("missionDescription").textContent=
        "You completed all five AP Business chapters!";
    }
  }

  /* =====================================
     DIALOGS
  ===================================== */

  let dialogOpen=false;
  let phoneOpen=false;
  let activeTab="missions";

  function openDialog(category,title,description,options) {
    closePhone();
    dialogOpen=true;
    keys.clear();

    $("dialogCategory").textContent=category;
    $("dialogTitle").textContent=title;
    $("dialogText").textContent=description;

    const area=$("dialogChoices");
    area.replaceChildren();

    options.forEach(o=>{
      const b=document.createElement("button");
      b.className="decision";
      b.textContent=o.text;
      b.disabled=Boolean(o.disabled);
      b.onclick=o.action;
      area.appendChild(b);
    });

    $("dialog").classList.remove("hidden");
  }

  function closeDialog() {
    dialogOpen=false;
    $("dialog").classList.add("hidden");
  }

  function bankruptcyCheck() {
    if(game.cash<0) {
      game.failed=true;
      game.driving=false;
      saveGame();
      updateUI();
      closeDialog();

      showEnding(true);
      return true;
    }
    return false;
  }

  /* =====================================
     MISSION SYSTEM
  ===================================== */

  function chooseMission(option) {
    game.cash+=option.cash||0;
    game.debt+=option.debt||0;
    game.rep=clamp(game.rep+(option.rep||0),0,100);
    game.knowledge+=option.knowledge||0;
    game.customers=Math.max(
      0,game.customers+(option.customers||0)
    );

    closeDialog();

    notify(option.lesson);

    if(bankruptcyCheck())return;

    game.step++;

    if(game.step>=2) {
      game.step=0;
      game.chapter++;
    }

    if(game.chapter>=5) {
      game.finished=true;
      showEnding(false);
    }

    saveGame();
    updateUI();
  }

  function openMission() {
    const m=currentMission();
    if(!m)return;

    openDialog(
      m.unit,
      m.title,
      m.question,
      m.options.map(o=>({
        text:o.text,
        action:()=>chooseMission(o)
      }))
    );
  }

  /* =====================================
     CAFÉ OPERATIONS
  ===================================== */

  function operateCafe() {
    const demand=Math.max(
      5,
      Math.floor(game.customers*.35)+8+game.staff*6
    );

    const sold=Math.min(game.inventory,demand);
    const revenue=sold*18;
    const expenses=45+game.staff*35;
    const interest=Math.ceil(game.debt*.02);

    game.inventory-=sold;
    game.cash+=revenue-expenses-interest;
    game.days++;

    if(sold>=10)game.customers+=2;

    closeDialog();

    notify(
      "Café results: "+money(revenue)+
      " revenue, "+money(expenses+interest)+
      " expenses. Sold "+sold+" cups."
    );

    if(!bankruptcyCheck()) {
      saveGame();
      updateUI();
    }
  }

  function buyInventory() {
    if(game.cash<100)return;

    game.cash-=100;
    game.inventory+=10;

    closeDialog();
    notify("Purchased 10 cups of inventory.");

    saveGame();
    updateUI();
  }

  function hireEmployee() {
    if(game.cash<350||game.staff>=3)return;

    game.cash-=350;
    game.staff++;

    closeDialog();
    notify("Employee hired. Daily expenses increased.");

    saveGame();
    updateUI();
  }

  /* =====================================
     BANK OPERATIONS
  ===================================== */

  function takeLoan() {
    if(game.debt>=3000)return;

    game.cash+=500;
    game.debt+=500;

    closeDialog();
    notify("Loan approved: $500. Remember your interest obligations.");

    saveGame();
    updateUI();
  }

  function repayLoan() {
    const amount=Math.min(500,game.debt);

    if(amount<=0||game.cash<amount)return;

    game.cash-=amount;
    game.debt-=amount;

    closeDialog();
    notify("Repaid "+money(amount)+" of your debt.");

    saveGame();
    updateUI();
  }

  /* =====================================
     CAR DEALERSHIP
  ===================================== */

  function buyCar() {
    if(game.cash<1800)return;

    game.cash-=1800;
    game.hasCar=true;

    closeDialog();
    notify("Car purchased! Find it in front of City Motors.");

    saveGame();
    updateUI();
  }

  function enterCar() {
    if(!game.hasCar)return;

    game.driving=true;
    closeDialog();
    notify("Driving mode. WASD to drive. Press E to exit.");
  }

  function exitCar() {
    const x=car.x+45;
    const y=car.y;

    if(blocked(x,y,12)) {
      notify("Move your car to an open space first.");
      return;
    }

    player.x=x;
    player.y=y;
    game.driving=false;

    notify("You exited the vehicle.");
    saveGame();
  }

  /* =====================================
     BUILDING INTERACTIONS
  ===================================== */

  function interactBuilding(b) {
    const m=currentMission();

    if(
      m &&
      m.location===b.id &&
      !game.failed &&
      !game.finished
    ) {
      openMission();
      return;
    }

    if(b.id==="cafe") {
      openDialog(
        "YOUR BUSINESS",
        "Coffee Co.",
        "Manage your café and its operations.",
        [
          {
            text:"Open café for one day",
            action:operateCafe
          },
          {
            text:"Buy 10 cups of inventory — $100",
            disabled:game.cash<100,
            action:buyInventory
          },
          {
            text:"Hire an employee — $350",
            disabled:game.cash<350||game.staff>=3,
            action:hireEmployee
          }
        ]
      );
    }

    else if(b.id==="bank") {
      openDialog(
        "FINANCIAL SERVICES",
        "City Bank",
        "Manage loans and financial obligations.",
        [
          {
            text:"Borrow $500",
            disabled:game.debt>=3000,
            action:takeLoan
          },
          {
            text:"Repay up to $500",
            disabled:game.debt<=0||
              game.cash<Math.min(500,game.debt),
            action:repayLoan
          }
        ]
      );
    }

    else if(b.id==="dealer") {
      openDialog(
        "CITY MOTORS",
        "Vehicle Dealership",
        "Purchase your first car for $1,800.",
        [
          {
            text:game.hasCar?
              "You already own a car.":
              "Buy car — $1,800",
            disabled:game.hasCar||game.cash<1800,
            action:buyCar
          }
        ]
      );
    }

    else {
      openDialog(
        "CITY LOCATION",
        b.name,
        "Explore the city and follow your objectives using the phone.",
        [
          {
            text:"Close",
            action:closeDialog
          }
        ]
      );
    }
  }

  function interact() {
    if(phoneOpen||dialogOpen||game.finished||game.failed)return;

    if(game.driving) {
      exitCar();
      return;
    }

    const target=nearestTarget();

    if(!target) {
      notify("Move closer to a building or your car.");
      return;
    }

    if(target.type==="car") {
      enterCar();
    } else {
      interactBuilding(target.building);
    }
  }

  /* =====================================
     PHONE
  ===================================== */

  function openPhone() {
    if(dialogOpen||game.failed||game.finished)return;

    phoneOpen=true;
    keys.clear();

    $("phone").classList.remove("hidden");
    renderPhone();
  }

  function closePhone() {
    phoneOpen=false;
    $("phone").classList.add("hidden");
  }

  function renderPhone() {
    const area=$("phoneContent");
    area.replaceChildren();

    function card(label,title,description,action,buttonText) {
      const c=document.createElement("div");
      c.className="phone-card";

      const small=document.createElement("small");
      small.textContent=label;

      const h=document.createElement("h3");
      h.textContent=title;

      const p=document.createElement("p");
      p.textContent=description;

      c.append(small,h,p);

      if(action) {
        const b=document.createElement("button");
        b.textContent=buttonText||"SELECT";
        b.onclick=action;
        c.appendChild(b);
      }

      area.appendChild(c);
    }

    if(activeTab==="missions") {
      const m=currentMission();

      if(m) {
        const b=buildings.find(x=>x.id===m.location);

        card(
          "ACTIVE MISSION",
          m.title,
          m.description+"\nDestination: "+b.name,
          ()=>{
            closePhone();
            notify("Mission destination: "+b.name);
          },
          "TRACK MISSION"
        );
      } else {
        card(
          "CAMPAIGN",
          game.failed?"BANKRUPTCY":"COMPLETE",
          "You have finished the available missions."
        );
      }

      card(
        "PROGRESS",
        (game.finished?10:game.chapter*2+game.step)+"/10 MISSIONS",
        "Entrepreneurship, Marketing, Finance, Management and Personal Finance."
      );
    }

    if(activeTab==="business") {
      card(
        "FINANCIAL REPORT",
        money(game.cash),
        "Debt: "+money(game.debt)+
        "\nCustomers: "+game.customers+
        "\nInventory: "+game.inventory+
        "\nEmployees: "+game.staff+
        "\nBusiness days: "+game.days
      );

      card(
        "VEHICLE",
        game.hasCar?"CAR OWNED":"NO VEHICLE",
        game.hasCar?
          "Your car is parked at the dealership.":
          "Visit City Motors. Price: $1,800."
      );
    }

    if(activeTab==="profile") {
      card(
        "ENTREPRENEUR",
        "Future CEO",
        "Reputation: "+game.rep+"/100"+
        "\nBusiness knowledge: "+game.knowledge+
        "\nCampaign: "+(game.finished?"Complete":"In progress")
      );

      card(
        "SAVE DATA",
        "Automatic saving",
        "Your progress is saved in this browser."
      );
    }
  }

  /* =====================================
     PHONE EVENTS
  ===================================== */

  $("phoneButton").onclick=openPhone;
  $("mobilePhone").onclick=openPhone;
  $("closePhone").onclick=closePhone;

  document.querySelectorAll(".tab").forEach(tab=>{
    tab.onclick=()=>{
      activeTab=tab.dataset.tab;

      document.querySelectorAll(".tab").forEach(t=>{
        t.classList.toggle("active",t===tab);
      });

      renderPhone();
    };
  });

  $("closeDialog").onclick=closeDialog;

  $("mobileInteract").onclick=interact;

  /* =====================================
     ENDINGS AND RESTART
  ===================================== */

  function showEnding(bankrupt=false) {
    $("ending").classList.remove("hidden");

    const net=game.cash-game.debt;
    const won=net>=3000&&game.rep>=60;

    $("endingTitle").textContent=bankrupt?
      "BANKRUPTCY":
      won?"SUCCESSFUL CEO":"BUSINESS GRADUATE";

    $("endingText").textContent=bankrupt?
      "Your business ran out of cash. Review your decisions and try again.":
      "You completed all 10 missions!\n\n"+
      "Cash: "+money(game.cash)+
      "\nDebt: "+money(game.debt)+
      "\nNet cash: "+money(net)+
      "\nReputation: "+game.rep+"/100"+
      "\nBusiness knowledge: "+game.knowledge+
      "\n\n"+
      (won?
        "You built a financially strong business!":
        "You graduated. Try again for the CEO ending.");
  }

  function restart() {
    if(!confirm("Start a new game? Your current progress will be deleted."))return;

    localStorage.removeItem(SAVE);
    location.reload();
  }

  $("restartButton").onclick=restart;
  $("restartSmall").onclick=restart;

  /* =====================================
     FULLSCREEN
  ===================================== */

  $("fullscreenButton").onclick=async()=>{
    try {
      if(document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await $("app").requestFullscreen();
      }
    } catch(e) {
      notify("Fullscreen is unavailable in this browser.");
    }
  };

  /* =====================================
     KEYBOARD
  ===================================== */

  window.addEventListener("keydown",e=>{
    const k=e.key.toLowerCase();

    if([
      "w","a","s","d",
      "arrowup","arrowdown",
      "arrowleft","arrowright"," "
    ].includes(k)) {
      e.preventDefault();
    }

    if(k==="q"&&!e.repeat) {
      if(phoneOpen)closePhone();
      else openPhone();
    }

    if(k==="e"&&!e.repeat)interact();

    if(k==="escape") {
      if(phoneOpen)closePhone();
      if(dialogOpen)closeDialog();
    }

    keys.add(k);
  });

  window.addEventListener("keyup",e=>{
    keys.delete(e.key.toLowerCase());
  });

  window.addEventListener("blur",()=>keys.clear());

  document.querySelectorAll("[data-key]").forEach(b=>{
    const k=b.dataset.key;

    b.addEventListener("pointerdown",e=>{
      e.preventDefault();
      b.setPointerCapture(e.pointerId);
      keys.add(k);
    });

    ["pointerup","pointercancel","lostpointercapture"]
      .forEach(event=>{
        b.addEventListener(event,()=>keys.delete(k));
      });
  });

  /* =====================================
     RENDER LOOP
  ===================================== */

  let lastTime=0;
  let saveTimer=0;
  let uiTimer=0;

  function loop(now) {
    const dt=Math.min((now-lastTime)/1000,.05);
    lastTime=now;

    move(dt);
    renderWorld();
    interaction();

    saveTimer+=dt;
    uiTimer+=dt;

    if(saveTimer>5) {
      saveTimer=0;
      saveGame();
    }

    if(uiTimer>.2) {
      uiTimer=0;
      updateUI();
    }

    requestAnimationFrame(loop);
  }

  /* =====================================
     INITIALIZATION
  ===================================== */

  updateUI();

  if(game.failed)showEnding(true);
  else if(game.finished)showEnding(false);

  requestAnimationFrame(loop);

})();

/* Utkarsh Batham — portfolio interactions (vanilla, standalone). */
(function () {
  "use strict";

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;")
      .replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  };

  var state = {
    theme: "dark",
    booting: true,
    termLines: [
      { text: "Last login: Tue Jun 24 09:14 2026 on ttys001", color: "oklch(0.5 0.01 260)" },
      { text: "utkarsh-portfolio v3.0 — type 'help' to begin.", color: "oklch(0.6 0.01 260)" },
      { text: "", color: "oklch(0.6 0.01 260)" },
      { text: "\u279C ~ whoami", color: "oklch(0.82 0.13 150)" },
      { text: "Utkarsh Batham \u00B7 Cloud & Distributed-Systems Engineer", color: "oklch(0.78 0.01 260)" }
    ],
    repos: [],
    ghLive: false,
    cmdkOpen: false,
    cmdkQuery: "",
    cmdkIndex: 0,
    matrixOn: false
  };

  /* ---------- theme ---------- */
  function applyTheme(t) {
    document.documentElement.setAttribute("data-theme", t);
    $("nav-theme").textContent = t === "dark" ? "\u2600" : "\u263E";
    state.theme = t;
  }
  function toggleTheme() {
    var next = state.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem("utk_theme", next); } catch (e) {}
  }

  /* ---------- boot ---------- */
  var bootMsgs = [
    { text: "booting utkarsh-portfolio v3.0 \u2026", color: "oklch(0.55 0.01 260)" },
    { text: "[ ok ] mounting /cloud", color: "oklch(0.82 0.13 150)" },
    { text: "[ ok ] distributed-systems daemon started", color: "oklch(0.82 0.13 150)" },
    { text: "[ ok ] loaded 5 shipped services", color: "oklch(0.82 0.13 150)" },
    { text: "[ ok ] observability online — prometheus + grafana", color: "oklch(0.82 0.13 150)" },
    { text: "[ ok ] security posture: CIS v1.5 passing", color: "oklch(0.82 0.13 150)" },
    { text: "[ ok ] availability: OPEN \u00B7 Jul 2026", color: "oklch(0.82 0.13 150)" },
    { text: "rendering interface \u25B8", color: "oklch(0.82 0.13 85)" }
  ];
  var bootShown = 0, bootTimer = null;
  function renderBoot() {
    var c = $("boot-lines");
    if (!c) return;
    c.innerHTML = "";
    for (var i = 0; i < bootShown; i++) {
      var d = document.createElement("div");
      d.style.cssText = "white-space:pre-wrap;color:" + bootMsgs[i].color;
      d.textContent = bootMsgs[i].text;
      c.appendChild(d);
    }
  }
  function endBoot() {
    var b = $("boot");
    if (!b) return;
    b.style.opacity = "0";
    setTimeout(function () { b.style.display = "none"; }, 600);
    state.booting = false;
  }
  function startBoot() {
    renderBoot();
    bootTimer = setInterval(function () {
      bootShown++;
      if (bootShown >= bootMsgs.length) {
        clearInterval(bootTimer);
        renderBoot();
        setTimeout(endBoot, 520);
        return;
      }
      renderBoot();
    }, 250);
  }
  function skipBoot() { clearInterval(bootTimer); endBoot(); }

  /* ---------- live metrics ---------- */
  function tickMetrics() {
    $("m-latency").textContent = 38 + Math.floor(Math.random() * 28);
    $("m-rps").textContent = (1.18 + Math.random() * 0.34).toFixed(2) + "k";
    $("m-uptime").textContent = (99.95 + Math.random() * 0.04).toFixed(2);
    $("load-avg").textContent = [0, 0, 0].map(function () {
      return (0.4 + Math.random() * 0.7).toFixed(2);
    }).join(" ");
  }

  /* ---------- htop procs ---------- */
  var procBase = [
    { pid: "1042", cmd: "aws-iac --apply", color: "oklch(0.7 0.14 230)" },
    { pid: "2071", cmd: "k8s-orchestrator", color: "oklch(0.74 0.14 150)" },
    { pid: "3088", cmd: "otel-collector", color: "oklch(0.76 0.14 85)" },
    { pid: "4120", cmd: "cspm-scan --cis", color: "oklch(0.72 0.14 300)" },
    { pid: "5077", cmd: "python rag.py", color: "oklch(0.74 0.14 150)" },
    { pid: "6310", cmd: "go build ./...", color: "oklch(0.7 0.14 230)" }
  ];
  function refreshProcs() {
    var html = "";
    for (var i = 0; i < procBase.length; i++) {
      var p = procBase[i];
      var cpu = Math.max(2, Math.round((Math.random() * Math.random()) * 96));
      var mem = 8 + Math.round(Math.random() * 54);
      html +=
        '<div class="htop-row" style="display:grid;grid-template-columns:62px 1fr 150px 150px;gap:14px;align-items:center;padding:8px 0;border-bottom:1px solid oklch(0.21 0.012 260)">' +
        '<span style="font:500 12px \'IBM Plex Mono\';color:oklch(0.5 0.01 260)">' + p.pid + '</span>' +
        '<span style="font:500 12px \'IBM Plex Mono\';color:oklch(0.86 0.01 260)">' + esc(p.cmd) + '</span>' +
        '<div style="display:flex;align-items:center;gap:8px"><div style="flex:1;height:6px;border-radius:3px;background:oklch(0.25 0.012 260);overflow:hidden"><div style="width:' + cpu + '%;height:100%;border-radius:3px;background:' + p.color + ';transition:width .8s ease"></div></div><span style="font:500 11px \'IBM Plex Mono\';color:oklch(0.7 0.01 260);width:30px">' + cpu + '%</span></div>' +
        '<div style="display:flex;align-items:center;gap:8px"><div style="flex:1;height:6px;border-radius:3px;background:oklch(0.25 0.012 260);overflow:hidden"><div style="width:' + mem + '%;height:100%;border-radius:3px;background:oklch(0.55 0.04 260);transition:width .8s ease"></div></div><span style="font:500 11px \'IBM Plex Mono\';color:oklch(0.7 0.01 260);width:30px">' + mem + '%</span></div>' +
        '</div>';
    }
    $("procs").innerHTML = html;
  }

  /* ---------- incidents ---------- */
  var incidents = [
    { id: "INC-204", sev: "SEV-2", title: "Recruiter SLA breach", body: "No email received in 14d. Auto-paging the on-call hiring manager.", color: "var(--acc-amber)" },
    { id: "INC-118", sev: "SEV-1", title: "Coffee level critical", body: "Reserves at 3%. Mitigation: brew(). ETA 4 minutes.", color: "oklch(0.7 0.17 30)" },
    { id: "INC-507", sev: "SEV-3", title: "Idea backlog overflow", body: "Too many side-projects queued. Scaling focus horizontally.", color: "var(--acc-blue)" },
    { id: "INC-330", sev: "SEV-2", title: "Availability window open", body: "Engineer marked OPEN for Jul 2026. Notify subscribers.", color: "var(--acc-green)" }
  ];
  var incHide = null;
  function fireIncident() {
    if (state.matrixOn || state.booting) return;
    var inc = incidents[Math.floor(Math.random() * incidents.length)];
    var el = $("incident");
    el.style.borderLeft = "3px solid " + inc.color;
    el.style.animation = "slideIn .35s cubic-bezier(.2,.7,.2,1) both";
    el.innerHTML =
      '<div style="display:flex;align-items:center;gap:9px;padding:12px 15px 0">' +
        '<span style="display:flex;align-items:center;gap:6px;padding:3px 9px;border-radius:6px;background:' + inc.color + ';font:700 10px \'IBM Plex Mono\';color:oklch(0.16 0.02 260)"><span style="width:6px;height:6px;border-radius:50%;background:oklch(0.16 0.02 260);animation:pulse 1.4s infinite"></span>' + inc.sev + '</span>' +
        '<span style="font:600 11px \'IBM Plex Mono\';color:var(--fg3)">' + inc.id + '</span>' +
        '<span style="margin-left:auto;font:500 10px \'IBM Plex Mono\';color:var(--fg3)">PagerDuty</span>' +
      '</div>' +
      '<div style="padding:8px 15px 14px">' +
        '<div style="font:600 15px \'Space Grotesk\';color:var(--fg)">' + inc.title + '</div>' +
        '<div style="font:400 13px/1.45 \'IBM Plex Sans\';color:var(--fg2);margin-top:4px">' + inc.body + '</div>' +
        '<div style="display:flex;gap:8px;margin-top:12px">' +
          '<button data-inc-close style="padding:6px 13px;border-radius:7px;background:' + inc.color + ';border:none;font:600 11px \'IBM Plex Mono\';color:oklch(0.16 0.02 260);cursor:pointer">Acknowledge</button>' +
          '<button data-inc-close style="padding:6px 13px;border-radius:7px;background:var(--chip);border:1px solid var(--bd);font:600 11px \'IBM Plex Mono\';color:var(--fg2);cursor:pointer">Resolve</button>' +
        '</div>' +
      '</div>';
    el.style.display = "block";
    var btns = el.querySelectorAll("[data-inc-close]");
    for (var i = 0; i < btns.length; i++) btns[i].addEventListener("click", closeIncident);
    clearTimeout(incHide);
    incHide = setTimeout(closeIncident, 7000);
  }
  function closeIncident() { clearTimeout(incHide); $("incident").style.display = "none"; }

  /* ---------- terminal ---------- */
  function renderTerm() {
    var c = $("term-lines");
    c.innerHTML = "";
    for (var i = 0; i < state.termLines.length; i++) {
      var ln = state.termLines[i];
      var d = document.createElement("div");
      d.style.cssText = "white-space:pre-wrap;word-break:break-word;color:" + ln.color;
      d.textContent = ln.text;
      c.appendChild(d);
    }
  }
  function push(lines) {
    state.termLines = state.termLines.concat(lines);
    renderTerm();
  }

  function projectDetail(key) {
    var O = "oklch(0.78 0.01 260)", D = "oklch(0.55 0.01 260)", G = "oklch(0.82 0.13 150)", A = "oklch(0.8 0.13 85)";
    var d = {
      cloudflow: [
        { text: "CloudFlow — SAGA-orchestrated order pipeline", color: G },
        { text: "  stack     Step Functions \u00B7 DynamoDB \u00B7 SQS \u00B7 AWS CDK", color: O },
        { text: "  problem   a checkout can fail mid-order and double-charge or oversell", color: D },
        { text: "  approach  SAGA compensation, event-sourced log, idempotent handlers, circuit breaker", color: O },
        { text: "  result    1,100+ req/min \u00B7 p50 47ms \u00B7 p99 120ms \u00B7 48 tests (moto + LocalStack)", color: A }
      ],
      cloudpulse: [
        { text: "CloudPulse — real-time analytics on AWS serverless", color: G },
        { text: "  stack     Kinesis \u00B7 Lambda \u00B7 Athena \u00B7 DynamoDB \u00B7 Terraform", color: O },
        { text: "  problem   the seam between real-time dashboards and 90-day history", color: D },
        { text: "  approach  Lambda Architecture: dual-write fork, batch + speed layers, one stream", color: O },
        { text: "  result    ~12ms realtime p50 \u00B7 ~1.8s Athena \u00B7 ~$0.36/day (one Kinesis shard)", color: A }
      ],
      cspm: [
        { text: "CSPM Agent — cloud security posture auditor", color: G },
        { text: "  stack     Python \u00B7 boto3 \u00B7 CIS v1.5 \u00B7 Terraform", color: O },
        { text: "  problem   public buckets, open SGs, risky IAM drift unnoticed", color: D },
        { text: "  approach  23 CIS checks over S3/IAM/EC2-SG/CloudTrail, DRY_RUN-by-default auto-fix", color: O },
        { text: "  result    first scan 80% compliance \u00B7 scanner <6s \u00B7 71 tests (moto)", color: A }
      ],
      agrifuture: [
        { text: "AgriFuture — six Gemini AI modules behind one Express server", color: G },
        { text: "  stack     React 19 \u00B7 Express 5 \u00B7 PostgreSQL \u00B7 Gemini 2.5/3 Flash", color: O },
        { text: "  problem   the engineering isn't the LLM — it's making it safe to expose", color: D },
        { text: "  approach  one dispatcher, six prompting strategies, auth + rate-limit boundary", color: O },
        { text: "  result    ~12.5K LOC \u00B7 56 TS files \u00B7 JWT+OTP \u00B7 Razorpay HMAC \u00B7 PWA \u00B7 live on Render", color: A }
      ],
      wikiqa: [
        { text: "WikiQA RAG — retrieval-augmented QA, end-to-end", color: G },
        { text: "  stack     FAISS \u00B7 cross-encoder \u00B7 FastAPI \u00B7 multi-LLM", color: O },
        { text: "  problem   answer collapse, silent retrieval drift, no faithfulness signal", color: D },
        { text: "  approach  bi-encoder + cross-encoder re-rank, source-diversity guarantee, LLM judge", color: O },
        { text: "  result    P@5 0.80 \u00B7 MRR 0.85 \u00B7 token-streamed \u00B7 60 pytest \u00B7 fits a t2.micro", color: A }
      ]
    };
    return d[key] || null;
  }
  function openProject(key) {
    var lines = projectDetail(key);
    if (lines) push([{ text: "\u279C ~ open " + key, color: "oklch(0.82 0.13 150)" }].concat(lines));
  }

  function run(raw) {
    var cmd = (raw || "").trim();
    var G = "oklch(0.82 0.13 150)", O = "oklch(0.74 0.01 260)", D = "oklch(0.55 0.01 260)",
        A = "oklch(0.8 0.13 85)", B = "oklch(0.74 0.13 230)", P = "oklch(0.78 0.12 300)", R = "oklch(0.74 0.14 30)";
    var echo = { text: "\u279C ~ " + cmd, color: G };
    if (!cmd) { push([{ text: "\u279C ~", color: G }]); return; }
    var c = cmd.toLowerCase();
    var out = [];
    var aliases = { cloudflow: "cloudflow", cloudpulse: "cloudpulse", cspm: "cspm", "cspm-agent": "cspm", agrifuture: "agrifuture", wikiqa: "wikiqa", "wikiqa-rag": "wikiqa" };
    var m = c.match(/^(?:open|cat)\s+([a-z\-]+)$/);
    var arg = m ? m[1] : (aliases[c] ? c : null);

    if (c === "clear" || c === "cls") { state.termLines = []; renderTerm(); return; }
    else if (arg && aliases[arg] && projectDetail(aliases[arg])) { push([echo].concat(projectDetail(aliases[arg]))); return; }
    else if (c === "help") {
      ["whoami        identity & current focus", "ls            list shipped systems", "open <name>   project detail (cloudflow, cspm\u2026)",
       "cat focus     what I actually do", "skills        the stack, by reflex", "oss           open-source contributions",
       "paper         research preprint", "make resume   compile & download CV (PDF)", "contact       how to reach me",
       "theme         flip light / dark", "matrix        ( \u259A )",
       "coffee        ( \u2615 )", "sl            ( \uD83D\uDE82 )", "sudo hire     ( try it )", "clear         wipe the screen"
      ].forEach(function (t, i) { out.push({ text: (i === 0 ? "Available commands:\n  " : "  ") + t, color: i === 0 ? O : D }); });
    }
    else if (c === "whoami") {
      out.push({ text: "Utkarsh Batham \u00B7 Cloud & Distributed-Systems Engineer", color: O });
      out.push({ text: "Vadodara, IN — CSE final-year, GATE AIR 6,271. Open Jul 2026.", color: D });
    }
    else if (c === "ls" || c === "ls -la" || c === "ls projects") {
      out.push({ text: "CloudFlow      SAGA-orchestrated order pipeline \u00B7 Step Functions", color: O });
      out.push({ text: "CloudPulse     real-time analytics \u00B7 Lambda Architecture \u00B7 Kinesis", color: O });
      out.push({ text: "CSPM-Agent     posture auditor \u00B7 23 CIS v1.5 checks", color: O });
      out.push({ text: "AgriFuture     six Gemini AI modules \u00B7 Express \u00B7 live on Render", color: O });
      out.push({ text: "WikiQA-RAG     retrieval-augmented QA \u00B7 FAISS + cross-encoder", color: O });
      out.push({ text: "invariants.tla TLA+ proof \u00B7 Zenodo DOI", color: P });
      out.push({ text: "\u2192 tip: 'open cloudflow' for detail.", color: D });
    }
    else if (c === "cat focus" || c === "cat focus.txt" || c === "about") {
      out.push({ text: "I build infrastructure for the moment it has to keep working —", color: O });
      out.push({ text: "when traffic spikes, a region drops, or a payment errors at 3am.", color: O });
    }
    else if (c === "skills") {
      out.push({ text: "cloud/iac    AWS \u00B7 Terraform \u00B7 CDK \u00B7 CloudFormation", color: B });
      out.push({ text: "orchestrate  Kubernetes \u00B7 Docker \u00B7 Step Functions", color: G });
      out.push({ text: "observe      Prometheus \u00B7 Grafana \u00B7 OpenTelemetry", color: A });
      out.push({ text: "security     CIS \u00B7 IAM \u00B7 KMS \u00B7 posture auditing", color: P });
      out.push({ text: "languages    Python \u00B7 Go \u00B7 TypeScript \u00B7 Bash", color: O });
    }
    else if (c === "oss") {
      out.push({ text: "grafana/alloy-scenarios #147  \u2713 merged — CloudWatch scenario", color: G });
      out.push({ text: "kube-coder #124               \u2713 merged — HA replicas + PDB", color: G });
      out.push({ text: "prowler #11577                \u2713 merged — Entra CA exclusion-gap check", color: G });
      out.push({ text: "checkov \u00B7 moto \u00B7 otel \u00B7 aws-cdk \u00B7 aws-cdk-cli   \u25D0 under review", color: A });
    }
    else if (c === "paper" || c === "research") {
      out.push({ text: "Security Invariants in Distributed Cloud Systems", color: P });
      out.push({ text: "TLA+-style model: 3 RBAC invariants break under concurrency.", color: O });
      out.push({ text: "\u2192 archived on Zenodo (DOI). M.Sc research track \u2192 2027.", color: D });
    }
    else if (c === "make resume" || c === "resume" || c === "cv" || c === "make cv") {
      out.push({ text: "compiling resume.pdf \u2026", color: D });
      out.push({ text: "\u2713 done — downloading Utkarsh-Batham-Resume.pdf", color: G });
      setTimeout(makeResume, 200);
    }
    else if (c === "theme") { var was = state.theme; toggleTheme(); out.push({ text: "flipped theme \u2192 " + (was === "dark" ? "light" : "dark"), color: A }); }
    else if (c === "matrix") { out.push({ text: "Wake up, Neo\u2026", color: G }); startMatrix(); }
    else if (c === "coffee" || c === "make coffee") {
      ["      ( (", "       ) )", "    ........", "    |      |]", "    \\      /", "     `----'   fresh brew. back to building."
      ].forEach(function (t) { out.push({ text: t, color: A }); });
    }
    else if (c === "sl") {
      ["      ====        ________                ___________", "  _D _|  |_______/        \\__I_I_____===__|_________|",
       "   |(_)---  |   H\\________/ |   |        =|___ ___|", "   /     |  |   H  |  |     |   |         ||_| |_||",
       "  |      |  |   H  |__--------------------| [___] |", "  | ________|___H__/__|_____/[][]~\\_______|       |", "  |/ |   |-----------I_____I [][] []  D   |=======|__"
      ].forEach(function (t) { out.push({ text: t, color: O }); });
      out.push({ text: "you typed 'sl' instead of 'ls'. enjoy the train. \uD83D\uDE82", color: D });
    }
    else if (c === "contact") {
      out.push({ text: "email     udaydeepak1928@gmail.com   (reply < 24h)", color: O });
      out.push({ text: "github    github.com/utkarsh698", color: O });
      out.push({ text: "linkedin  linkedin.com/in/utkarsh-batham", color: O });
      out.push({ text: "doi       doi.org/10.5281/zenodo.20686317", color: O });
      out.push({ text: "status    \u25CF AVAILABLE — July 2026 \u00B7 remote / global", color: G });
    }
    else if (c === "sudo hire" || c === "sudo hire me") {
      out.push({ text: "[sudo] password for recruiter: ********", color: D });
      out.push({ text: "Access granted. \u2713", color: G });
      out.push({ text: "Excellent decision. Scroll to Contact — I reply within 24h.", color: G });
    }
    else if (c === "sudo" || c.indexOf("sudo ") === 0) { out.push({ text: cmd.replace(/^sudo\s*/i, "") + ": permission granted to good ideas only.", color: A }); }
    else { out.push({ text: "zsh: command not found: " + cmd + "  — try 'help'", color: R }); }
    push([echo].concat(out));
  }

  /* ---------- command palette ---------- */
  function go(h) { return function () { try { window.location.hash = h; } catch (e) {} }; }
  function actionList() {
    return [
      { label: "Go to Dashboard", hint: "section", icon: "\u25B8", act: go("#dashboard") },
      { label: "Go to System Map", hint: "section", icon: "\u25B8", act: go("#systemmap") },
      { label: "Go to Projects", hint: "section", icon: "\u25B8", act: go("#projects") },
      { label: "Go to the Shell", hint: "section", icon: "\u25B8", act: go("#shell") },
      { label: "Go to GitHub feed", hint: "section", icon: "\u25B8", act: go("#github") },
      { label: "Go to Writing", hint: "section", icon: "\u25B8", act: go("#writing") },
      { label: "Go to Contact", hint: "section", icon: "\u25B8", act: go("#contact") },
      { label: "Open CloudFlow in shell", hint: "project", icon: "$", act: function () { openProject("cloudflow"); go("#shell")(); } },
      { label: "Open CloudPulse in shell", hint: "project", icon: "$", act: function () { openProject("cloudpulse"); go("#shell")(); } },
      { label: "Open CSPM Agent in shell", hint: "project", icon: "$", act: function () { openProject("cspm"); go("#shell")(); } },
      { label: "Open WikiQA RAG in shell", hint: "project", icon: "$", act: function () { openProject("wikiqa"); go("#shell")(); } },
      { label: "Download r\u00e9sum\u00e9 (PDF)", hint: "action", icon: "\u2193", act: function () { makeResume(); } },
      { label: "Open LinkedIn profile", hint: "link", icon: "in", act: function () { window.open("https://www.linkedin.com/in/utkarsh-batham", "_blank"); } },
      { label: "Open Zenodo paper (DOI)", hint: "link", icon: "doi", act: function () { window.open("https://doi.org/10.5281/zenodo.20686317", "_blank"); } },
      { label: "Email Utkarsh", hint: "link", icon: "@", act: function () { window.location.href = "mailto:udaydeepak1928@gmail.com"; } },
      { label: "Toggle light / dark theme", hint: "\u2318", icon: "\u25D0", act: function () { toggleTheme(); } },
      { label: "Enter the matrix", hint: "easter egg", icon: "\u259A", act: function () { startMatrix(); } },
      { label: "Help (run in shell)", hint: "command", icon: "?", act: function () { run("help"); go("#shell")(); } }
    ];
  }
  function cmdkResultsRaw() {
    var q = state.cmdkQuery.toLowerCase().trim();
    var all = actionList();
    if (!q) return all;
    return all.filter(function (a) { return (a.label + " " + (a.hint || "")).toLowerCase().indexOf(q) !== -1; });
  }
  function renderCmdk() {
    var res = cmdkResultsRaw();
    var box = $("cmdk-results");
    if (!res.length) {
      box.innerHTML = '<div style="padding:24px;text-align:center;font:400 13px \'IBM Plex Mono\';color:var(--fg3)">no matches — try \u201Cprojects\u201D or \u201Ctheme\u201D</div>';
      return;
    }
    box.innerHTML = "";
    res.forEach(function (a, i) {
      var sel = i === state.cmdkIndex;
      var row = document.createElement("div");
      row.style.cssText = "display:flex;align-items:center;gap:13px;padding:11px 13px;border-radius:9px;cursor:pointer;background:" + (sel ? "var(--chip)" : "transparent");
      row.innerHTML =
        '<span style="width:26px;height:26px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border-radius:7px;background:var(--chip);font:600 12px \'IBM Plex Mono\';color:' + (sel ? "var(--acc-green)" : "var(--fg3)") + '">' + esc(a.icon) + '</span>' +
        '<span style="flex:1;font:500 14px \'IBM Plex Sans\';color:var(--fg)">' + esc(a.label) + '</span>' +
        '<span style="font:500 11px \'IBM Plex Mono\';color:var(--fg3)">' + esc(a.hint) + '</span>';
      row.addEventListener("mouseenter", function () { state.cmdkIndex = i; renderCmdk(); });
      row.addEventListener("click", function () { runAction(a); });
      box.appendChild(row);
    });
  }
  function openCmdk() { state.cmdkOpen = true; state.cmdkQuery = ""; state.cmdkIndex = 0; $("cmdk-input").value = ""; $("cmdk").style.display = "flex"; renderCmdk(); setTimeout(function () { $("cmdk-input").focus(); }, 0); }
  function closeCmdk() { state.cmdkOpen = false; $("cmdk").style.display = "none"; }
  function runAction(a) { closeCmdk(); setTimeout(a.act, 0); }

  /* ---------- matrix ---------- */
  var mxTimer = null, mxTimeout = null;
  function startMatrix() {
    if (state.matrixOn) return;
    state.matrixOn = true;
    closeCmdk();
    $("matrix").style.display = "block";
    var c = $("matrix-canvas");
    c.width = window.innerWidth; c.height = window.innerHeight;
    var ctx = c.getContext("2d"); var fs = 16;
    var cols = Math.floor(c.width / fs); var yp = new Array(cols).fill(1);
    var chars = "01<>{}[]/\\=+*ABCDEF$#@\u30A2\u30AB\u30B5\u30BF\u30CA\u30CF\u30DEabcdef".split("");
    mxTimer = setInterval(function () {
      ctx.fillStyle = "rgba(0,0,0,0.07)"; ctx.fillRect(0, 0, c.width, c.height);
      ctx.fillStyle = "#39ff7a"; ctx.font = fs + "px monospace";
      for (var i = 0; i < cols; i++) {
        var ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(ch, i * fs, yp[i] * fs);
        if (yp[i] * fs > c.height && Math.random() > 0.975) yp[i] = 0;
        yp[i]++;
      }
    }, 50);
    mxTimeout = setTimeout(stopMatrix, 7000);
  }
  function stopMatrix() {
    clearInterval(mxTimer); mxTimer = null; clearTimeout(mxTimeout);
    state.matrixOn = false;
    $("matrix").style.display = "none";
  }

  /* ---------- GitHub feed ---------- */
  function langColor(l) {
    var m = { Python: "oklch(0.7 0.13 230)", Go: "oklch(0.72 0.13 200)", JavaScript: "oklch(0.82 0.14 95)", TypeScript: "oklch(0.65 0.14 250)", HCL: "oklch(0.6 0.16 300)", Shell: "oklch(0.74 0.14 150)", HTML: "oklch(0.66 0.16 35)", Jupyter: "oklch(0.74 0.15 60)" };
    return m[l] || "oklch(0.6 0.02 260)";
  }
  function fallbackRepos() {
    return [
      { name: "CloudFlow", desc: "SAGA-orchestrated order pipeline on AWS Step Functions with compensation and a circuit breaker.", lang: "Python", stars: 0, updated: "recent", url: "https://github.com/UTKARSH698/CloudFlow" },
      { name: "Cloud_Pulse", desc: "Lambda-architecture real-time analytics — Kinesis dual-write, Athena history, DynamoDB live view.", lang: "Python", stars: 0, updated: "recent", url: "https://github.com/UTKARSH698/Cloud_Pulse" },
      { name: "CSPM", desc: "Serverless cloud-security posture auditor — 23 CIS-v1.5 checks with safe auto-remediation.", lang: "Python", stars: 0, updated: "recent", url: "https://github.com/UTKARSH698/CSPM" },
      { name: "agrifuture-platform", desc: "Six Gemini AI modules behind one Express server — JWT+OTP, Razorpay HMAC, offline PWA.", lang: "TypeScript", stars: 0, updated: "recent", url: "https://github.com/UTKARSH698/agrifuture-platform" },
      { name: "wikiqa-rag-system", desc: "End-to-end retrieval-augmented QA over Wikipedia — FAISS, cross-encoder re-rank, LLM judge.", lang: "Python", stars: 0, updated: "recent", url: "https://github.com/UTKARSH698/wikiqa-rag-system" },
      { name: "security-invariants-rbac", desc: "TLA+-style model checker for distributed RBAC invariants that break under concurrency.", lang: "Python", stars: 0, updated: "recent", url: "https://github.com/UTKARSH698/security-invariants-rbac" }
    ];
  }
  function ago(iso) {
    try {
      var d = (Date.now() - new Date(iso).getTime()) / 86400000;
      if (d < 1) return "today"; if (d < 30) return Math.round(d) + "d ago";
      if (d < 365) return Math.round(d / 30) + "mo ago"; return Math.round(d / 365) + "y ago";
    } catch (e) { return "recent"; }
  }
  function renderRepos() {
    var box = $("repos");
    box.innerHTML = "";
    state.repos.forEach(function (r) {
      var url = r.url || "https://github.com/utkarsh698";
      var a = document.createElement("a");
      a.href = url;
      if (/^https?:/.test(url)) a.target = "_blank";
      a.className = "repo-card";
      a.style.cssText = "display:flex;flex-direction:column;background:var(--card);border:1px solid var(--bd);border-radius:13px;padding:20px 22px;min-height:150px;transition:all .2s";
      a.innerHTML =
        '<div style="display:flex;align-items:center;gap:8px"><span style="font:500 13px \'IBM Plex Mono\';color:var(--fg3)">\u203A</span><span style="font:600 15px \'IBM Plex Mono\';color:var(--fg)">' + esc(r.name) + '</span></div>' +
        '<p style="font:400 13px/1.5 \'IBM Plex Sans\';color:var(--fg2);margin-top:9px;flex:1">' + esc(r.desc) + '</p>' +
        '<div style="display:flex;align-items:center;gap:16px;margin-top:14px;padding-top:13px;border-top:1px solid var(--bd)">' +
          '<span style="display:flex;align-items:center;gap:6px;font:500 12px \'IBM Plex Mono\';color:var(--fg3)"><span style="width:9px;height:9px;border-radius:50%;background:' + langColor(r.lang) + '"></span>' + esc(r.lang) + '</span>' +
          '<span style="font:500 12px \'IBM Plex Mono\';color:var(--fg3)">\u2605 ' + r.stars + '</span>' +
          '<span style="margin-left:auto;font:500 11px \'IBM Plex Mono\';color:var(--fg3)">' + esc(r.updated) + '</span>' +
        '</div>';
      box.appendChild(a);
    });
  }
  function setGh(live, status, meta) {
    state.ghLive = live;
    var col = live ? "var(--acc-green)" : "var(--acc-amber)";
    $("gh-dot").style.background = col;
    $("gh-dot").parentNode.style.color = col;
    $("gh-status").textContent = status;
    $("gh-meta").textContent = meta;
  }
  function fetchGitHub() {
    fetch("https://api.github.com/users/utkarsh698/repos?sort=updated&per_page=100")
      .then(function (r) { if (!r.ok) throw new Error("status " + r.status); return r.json(); })
      .then(function (list) {
        if (!Array.isArray(list) || !list.length) throw new Error("empty");
        state.repos = list.filter(function (r) { return !r.fork; })
          .sort(function (a, b) { return (b.stargazers_count - a.stargazers_count) || (new Date(b.updated_at) - new Date(a.updated_at)); })
          .slice(0, 6)
          .map(function (r) { return { name: r.name, desc: r.description || "\u2014", lang: r.language || "\u2014", stars: r.stargazers_count, updated: ago(r.updated_at), url: r.html_url }; });
        renderRepos();
        setGh(true, "LIVE", "top repositories by stars \u00B7 fetched just now");
      })
      .catch(function () {
        state.repos = fallbackRepos();
        renderRepos();
        setGh(false, "CACHED", "showing a cached snapshot — live API unreachable");
      });
  }

  /* ---------- résumé PDF (client-side) ---------- */
  function pdfEsc(s) { return String(s).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)"); }
  function buildPDF(ops) {
    var stream = "";
    for (var k = 0; k < ops.length; k++) {
      var o = ops[k];
      if (o.t === "text") {
        var py = (792 - o.y).toFixed(2); var g = o.gray != null ? o.gray : 0;
        stream += "BT /" + (o.bold ? "F2" : "F1") + " " + o.size + " Tf " + g + " " + g + " " + g + " rg " + o.x.toFixed(2) + " " + py + " Td (" + pdfEsc(o.str) + ") Tj ET\n";
      } else if (o.t === "rule") {
        stream += (o.w || 0.6) + " w 0.8 0.8 0.8 RG " + o.x1.toFixed(2) + " " + (792 - o.y1).toFixed(2) + " m " + o.x2.toFixed(2) + " " + (792 - o.y2).toFixed(2) + " l S\n";
      }
    }
    var objs = [
      "<< /Type /Catalog /Pages 2 0 R >>",
      "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
      "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> /Contents 4 0 R >>",
      "<< /Length " + stream.length + " >>\nstream\n" + stream + "endstream",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
      "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>"
    ];
    var pdf = "%PDF-1.4\n"; var off = [];
    for (var i = 0; i < objs.length; i++) { off.push(pdf.length); pdf += (i + 1) + " 0 obj\n" + objs[i] + "\nendobj\n"; }
    var xs = pdf.length;
    pdf += "xref\n0 " + (objs.length + 1) + "\n0000000000 65535 f \n";
    for (var j = 0; j < off.length; j++) pdf += String(off[j]).padStart(10, "0") + " 00000 n \n";
    pdf += "trailer\n<< /Size " + (objs.length + 1) + " /Root 1 0 R >>\nstartxref\n" + xs + "\n%%EOF";
    return pdf;
  }
  function layoutResume() {
    var ops = []; var x = 54, W = 504; var y = 66;
    var wrap = function (str, cpl) { var words = str.split(" "); var ls = []; var cur = ""; for (var i = 0; i < words.length; i++) { var w = words[i]; if ((cur + " " + w).trim().length > cpl) { ls.push(cur.trim()); cur = w; } else cur += " " + w; } if (cur.trim()) ls.push(cur.trim()); return ls; };
    var text = function (str, size, bold, gray) { ops.push({ t: "text", x: x, y: y, size: size, bold: bold, gray: gray, str: str }); };
    var heading = function (h) { y += 6; ops.push({ t: "text", x: x, y: y, size: 10.5, bold: true, gray: 0.1, str: h }); y += 5; ops.push({ t: "rule", x1: x, y1: y, x2: x + W, y2: y }); y += 14; };
    var para = function (str, size, gray) { var lines = wrap(str, Math.floor(W / (size * 0.49))); for (var i = 0; i < lines.length; i++) { ops.push({ t: "text", x: x, y: y, size: size, gray: gray, str: lines[i] }); y += size + 3.5; } };
    var row = function (label, val) { ops.push({ t: "text", x: x, y: y, size: 9.5, bold: true, gray: 0.15, str: label }); var lines = wrap(val, 88); for (var i = 0; i < lines.length; i++) { ops.push({ t: "text", x: x + 96, y: y, size: 9.5, gray: 0.2, str: lines[i] }); y += 13; } y += 3; };

    text("Utkarsh Batham", 21, true, 0); y += 17;
    text("Cloud & Distributed-Systems Engineer", 11.5, false, 0.32); y += 16;
    text("udaydeepak1928@gmail.com  |  github.com/utkarsh698  |  linkedin.com/in/utkarsh-batham  |  Vadodara, IN", 8.6, false, 0.35); y += 12;
    text("GATE AIR 6,271 (97th pct)  |  CGPA 9.44/10  |  Zenodo DOI: 10.5281/zenodo.20686317", 8.6, false, 0.35); y += 9;
    ops.push({ t: "rule", x1: x, y1: y, x2: x + W, y2: y }); y += 20;

    heading("SUMMARY");
    para("Final-year CSE engineer focused on cloud infrastructure and distributed systems. I build services for the failure case - traffic spikes, regional outages, and partial failures - using AWS, Kubernetes, and strong observability. GATE AIR 6,271.", 9.6, 0.2); y += 6;

    heading("SELECTED PROJECTS");
    row("CloudFlow", "SAGA-orchestrated checkout on AWS Step Functions; compensation, event-sourced DynamoDB log, idempotent handlers, cold-start-safe circuit breaker. 1,100+ req/min at p50 47ms; 48 tests (moto + LocalStack).  [Step Functions, DynamoDB, AWS CDK]");
    row("CloudPulse", "Lambda-architecture real-time analytics: dashboards update in ~12ms while the same Kinesis stream answers 90-day Athena queries (~1.8s). Dual-write at ingest; runs for ~$0.36/day, one Kinesis shard the only non-free piece.  [Kinesis, Athena, DynamoDB, Terraform]");
    row("CSPM Agent", "Serverless cloud-security posture auditor; 23 CIS-v1.5 checks across S3, IAM, EC2 Security Groups, and CloudTrail with DRY_RUN-by-default auto-remediation. First scan 80% compliance; 71 tests.  [Python, boto3, CIS v1.5, Terraform]");
    row("AgriFuture", "AI agricultural platform: six Gemini modules behind one Express server, JWT+OTP auth, Razorpay HMAC commerce, offline PWA. ~12.5K LOC across 56 TS files; live on Render.  [Gemini, React 19, Express 5, PostgreSQL]");
    row("WikiQA RAG", "End-to-end retrieval-augmented QA over Wikipedia: FAISS retrieval, cross-encoder re-rank, source-diversity guarantee, multi-LLM token streaming, LLM faithfulness judge. P@5 0.80, MRR 0.85.  [FAISS, Cross-Encoder, FastAPI]");

    heading("OPEN SOURCE");
    para("grafana/alloy-scenarios #147 - merged a CloudWatch scenario.   kube-coder #124 - merged HA replicas + PodDisruptionBudget.", 9.6, 0.2);
    para("prowler #11577 - merged a new Entra Conditional Access exclusion-gap check.", 9.6, 0.2);
    para("Under review: checkov, moto, opentelemetry-contrib, aws-cdk, aws-cdk-cli.", 9.6, 0.2); y += 6;

    heading("RESEARCH");
    para("Security Invariants in Distributed Cloud Systems - a TLA+-style model showing three RBAC authorization invariants that break under cross-service concurrency, with a counterexample trace and a proposed fix. Archived on Zenodo (DOI). M.Sc research track to 2027.", 9.6, 0.2); y += 6;

    heading("SKILLS");
    row("Cloud / IaC", "AWS, Terraform, CDK, CloudFormation");
    row("Orchestration", "Kubernetes, Docker, AWS Step Functions");
    row("Observability", "Prometheus, Grafana, OpenTelemetry");
    row("Security", "CIS benchmarks, IAM, KMS, posture auditing");
    row("Languages", "Python, Go, TypeScript, Bash");

    heading("EDUCATION");
    row("B.Tech CSE", "Computer Science & Engineering - CGPA 9.44 / 10 - final year, 2022-2026");
    return ops;
  }
  function makeResume() {
    try {
      var pdf = buildPDF(layoutResume());
      var bytes = new Uint8Array(pdf.length);
      for (var i = 0; i < pdf.length; i++) bytes[i] = pdf.charCodeAt(i) & 0xff;
      var blob = new Blob([bytes], { type: "application/pdf" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a"); a.href = url; a.download = "Utkarsh-Batham-Resume.pdf";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    } catch (e) { console.error("resume gen failed", e); }
  }

  /* ---------- static lists ---------- */
  function renderProjects() {
    var projects = [
      { key: "cloudflow", name: "CloudFlow", kind: "Distributed Systems", status: "shipped", tagColor: "var(--acc-green)",
        desc: "A SAGA-orchestrated checkout that never double-charges or oversells — Step Functions compensation, an event-sourced DynamoDB order log, idempotent handlers, and a circuit breaker that survives cold starts.",
        metric: "47ms", metricLabel: "p50 \u00B7 1,100+ req/min", tags: ["Step Functions", "DynamoDB", "Event Sourcing", "AWS CDK"] },
      { key: "cloudpulse", name: "CloudPulse", kind: "Real-time Analytics", status: "shipped", tagColor: "var(--acc-amber)",
        desc: "A Lambda-architecture analytics platform: live dashboards update in ~12 ms while the same Kinesis stream still answers 90-day Athena queries (~1.8 s). Dual-write at ingest; runs for ~$0.36/day — one Kinesis shard is the only piece outside the free tier.",
        metric: "~12ms", metricLabel: "realtime p50 \u00B7 ~1.8s Athena", tags: ["Kinesis", "Athena", "DynamoDB", "Terraform"] },
      { key: "cspm", name: "CSPM Agent", kind: "Cloud Security", status: "shipped", tagColor: "var(--acc-purple)",
        desc: "A serverless posture auditor running 23 CIS-v1.5 checks across S3, IAM, EC2 Security Groups, and CloudTrail — scores compliance, alerts on critical findings, and auto-fixes safe ones (DRY_RUN by default).",
        metric: "23", metricLabel: "CIS v1.5 checks \u00B7 4 services", tags: ["CIS v1.5", "IAM", "EC2 / SG", "Terraform"] },
      { key: "agrifuture", name: "AgriFuture", kind: "AI Platform", status: "live", tagColor: "var(--acc-green)",
        desc: "Six Gemini AI modules behind one Express server — crop recommendation, disease detection, drone terrain analysis, forecasting, digital twin, and AgriBot — with JWT + OTP auth, Razorpay HMAC commerce, and an offline PWA.",
        metric: "6", metricLabel: "AI modules \u00B7 ~12.5K LOC", tags: ["Gemini", "React 19", "Express 5", "PostgreSQL"] },
      { key: "wikiqa", name: "WikiQA RAG", kind: "Applied ML", status: "shipped", tagColor: "var(--acc-blue)",
        desc: "End-to-end retrieval-augmented QA over live Wikipedia — FAISS retrieval, a cross-encoder re-rank, a source-diversity guarantee, token-streamed answers from multiple LLMs, and an LLM faithfulness judge.",
        metric: "0.80", metricLabel: "P@5 \u00B7 MRR 0.85", tags: ["FAISS", "Cross-Encoder", "FastAPI", "RAG"] }
    ];
    var grid = $("projects-grid");
    grid.innerHTML = "";
    projects.forEach(function (p) {
      var a = document.createElement("a");
      a.href = "#shell";
      a.className = "proj-card";
      a.style.cssText = "display:block;background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:24px 26px;transition:transform .2s,border-color .2s;cursor:pointer";
      var tags = p.tags.map(function (t) { return '<span style="padding:4px 9px;border-radius:6px;background:var(--chip);font:500 11px \'IBM Plex Mono\';color:var(--fg2)">' + esc(t) + '</span>'; }).join("");
      a.innerHTML =
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:14px">' +
          '<div><div style="font:600 10px \'IBM Plex Mono\';letter-spacing:.14em;text-transform:uppercase;color:' + p.tagColor + '">' + esc(p.kind) + '</div>' +
          '<div style="font:600 22px \'Space Grotesk\';color:var(--fg);margin-top:7px">' + esc(p.name) + '</div></div>' +
          '<span style="font:500 11px \'IBM Plex Mono\';color:var(--fg3);flex-shrink:0">' + esc(p.status) + '</span>' +
        '</div>' +
        '<p style="font:400 14px/1.55 \'IBM Plex Sans\';color:var(--fg2);margin-top:12px">' + esc(p.desc) + '</p>' +
        '<div style="display:flex;align-items:center;gap:14px;margin-top:16px">' +
          '<span style="font:600 18px \'Space Grotesk\';color:' + p.tagColor + '">' + esc(p.metric) + '</span>' +
          '<span style="font:400 12px \'IBM Plex Sans\';color:var(--fg3)">' + esc(p.metricLabel) + '</span>' +
        '</div>' +
        '<div style="display:flex;flex-wrap:wrap;gap:7px;margin-top:16px;padding-top:16px;border-top:1px solid var(--bd)">' + tags + '</div>';
      a.addEventListener("click", function () { openProject(p.key); });
      grid.appendChild(a);
    });
  }
  function renderTimeline() {
    var timeline = [
      { when: "2026", color: "var(--acc-amber)", title: "GATE 2026 — AIR 6,271 (97th percentile)", body: "Cleared the national CS exam in the top 3% — a clean signal on algorithms, OS, networks, and DBMS fundamentals." },
      { when: "2025\u201326", color: "var(--acc-green)", title: "Open source + research preprint", body: "Merged contributions into Grafana Alloy and kube-coder; archived a TLA+-style paper on cloud security invariants to Zenodo." },
      { when: "2024\u201325", color: "var(--acc-blue)", title: "Shipped CloudFlow, CloudPulse & CSPM Agent", body: "Designed and built three production-shaped cloud systems spanning orchestration, real-time data, and security posture." },
      { when: "2022\u201326", color: "var(--acc-purple)", title: "B.Tech Computer Science — CGPA 9.44 / 10", body: "Final-year undergraduate, consistently top-decile, focused on distributed systems and cloud infrastructure." }
    ];
    $("timeline").innerHTML = timeline.map(function (ev) {
      return '<div style="display:grid;grid-template-columns:120px 1fr;gap:24px;padding:20px 0;border-top:1px solid var(--bd)">' +
        '<div style="font:600 14px \'IBM Plex Mono\';color:' + ev.color + '">' + esc(ev.when) + '</div>' +
        '<div><div style="font:600 17px \'Space Grotesk\';color:var(--fg)">' + esc(ev.title) + '</div>' +
        '<div style="font:400 14px/1.55 \'IBM Plex Sans\';color:var(--fg2);margin-top:5px;max-width:680px">' + esc(ev.body) + '</div></div></div>';
    }).join("");
  }
  function renderPosts() {
    var posts = [
      { title: "Why SAGA beats two-phase commit for serverless payments", blurb: "Compensating transactions, idempotency keys, and the failure modes 2PC quietly ignores.", read: "8 min", host: "linkedin \u2197", href: "https://www.linkedin.com/in/utkarsh-batham" },
      { title: "Three RBAC invariants that break under concurrency", blurb: "A walkthrough of the counterexample trace from my cloud-security preprint.", read: "12 min", host: "zenodo \u2197", href: "https://doi.org/10.5281/zenodo.20686317" },
      { title: "Contributing CloudWatch scenarios to Grafana Alloy", blurb: "What I learned shipping into a large observability codebase.", read: "6 min", host: "github \u2197", href: "https://github.com/grafana/alloy-scenarios" }
    ];
    $("posts").innerHTML = posts.map(function (post) {
      return '<a href="' + post.href + '" target="_blank" class="post-row" style="display:grid;grid-template-columns:1fr auto;gap:20px;align-items:center;padding:22px 12px;border-top:1px solid var(--bd);border-radius:8px;transition:background .2s">' +
        '<div><div style="font:600 19px \'Space Grotesk\';color:var(--fg)">' + esc(post.title) + '</div>' +
        '<div style="font:400 13px \'IBM Plex Sans\';color:var(--fg3);margin-top:5px">' + esc(post.blurb) + '</div></div>' +
        '<div style="display:flex;align-items:center;gap:16px"><span style="font:500 11px \'IBM Plex Mono\';color:var(--fg3)">' + esc(post.host) + '</span>' +
        '<span style="font:500 12px \'IBM Plex Mono\';color:var(--fg3)">' + esc(post.read) + '</span>' +
        '<span style="font:500 13px \'IBM Plex Mono\';color:var(--acc-amber)">\u2192</span></div></a>';
    }).join("");
  }
  function renderQuickCmds() {
    var labels = ["help", "open cloudflow", "skills", "matrix", "make resume", "sudo hire", "clear"];
    var box = $("quick-cmds");
    box.innerHTML = "";
    labels.forEach(function (label) {
      var b = document.createElement("button");
      b.className = "quick-cmd";
      b.style.cssText = "padding:7px 13px;border-radius:8px;background:var(--card);border:1px solid var(--bd);font:500 12px 'IBM Plex Mono';color:var(--fg2);cursor:pointer;transition:all .2s";
      b.textContent = label;
      b.addEventListener("click", function () { run(label); });
      box.appendChild(b);
    });
  }

  /* ---------- wiring ---------- */
  function init() {
    try {
      var t = localStorage.getItem("utk_theme");
      applyTheme(t || "dark");
    } catch (e) { applyTheme("dark"); }

    renderProjects();
    renderTimeline();
    renderPosts();
    renderQuickCmds();
    renderTerm();
    refreshProcs();
    fetchGitHub();

    $("nav-theme").addEventListener("click", toggleTheme);
    $("nav-search").addEventListener("click", openCmdk);
    $("nav-resume").addEventListener("click", function (e) { e.preventDefault(); makeResume(); window.location.hash = "#contact"; });
    $("cta-resume").addEventListener("click", function (e) { e.preventDefault(); makeResume(); });
    $("boot-skip").addEventListener("click", skipBoot);

    $("cmdk").addEventListener("click", function (e) { if (e.target === $("cmdk")) closeCmdk(); });
    $("cmdk-input").addEventListener("input", function (e) { state.cmdkQuery = e.target.value; state.cmdkIndex = 0; renderCmdk(); });
    $("cmdk-input").addEventListener("keydown", function (e) {
      var res = cmdkResultsRaw();
      if (e.key === "ArrowDown") { e.preventDefault(); state.cmdkIndex = Math.min(state.cmdkIndex + 1, res.length - 1); renderCmdk(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); state.cmdkIndex = Math.max(state.cmdkIndex - 1, 0); renderCmdk(); }
      else if (e.key === "Enter") { e.preventDefault(); var a = res[state.cmdkIndex]; if (a) runAction(a); }
      else if (e.key === "Escape") { closeCmdk(); }
    });

    $("matrix-canvas").addEventListener("click", stopMatrix);
    $("matrix-hint").addEventListener("click", stopMatrix);

    $("term-shell").addEventListener("click", function () { $("term-input").focus(); });
    $("term-input").addEventListener("keydown", function (e) {
      if (e.key === "Enter") { var v = e.target.value; e.target.value = ""; run(v); }
    });

    window.addEventListener("keydown", function (e) {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        if (state.cmdkOpen) closeCmdk(); else openCmdk();
      } else if (e.key === "Escape") {
        if (state.matrixOn) stopMatrix();
        if (state.cmdkOpen) closeCmdk();
      }
    });

    /* deep link ?cmd= */
    var deep = null;
    try { deep = new URLSearchParams(window.location.search).get("cmd"); } catch (e) {}
    if (deep) {
      endBoot();
      setTimeout(function () { run(deep.replace(/\+/g, " ")); try { window.location.hash = "#shell"; } catch (e) {} }, 120);
    } else {
      startBoot();
    }

    setInterval(tickMetrics, 2200);
    setInterval(refreshProcs, 1600);
    setInterval(fireIncident, 23000);
    setTimeout(fireIncident, 11000);
  }

  if (document.readyState !== "loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();

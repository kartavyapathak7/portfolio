(function () {
  'use strict';

  const KNOWLEDGE = [
    {
      keywords: ['who are you', 'who is kartavya', 'about you', 'about kartavya', 'introduce', 'tell me about'],
      answer: "I'm Kartavya's portfolio assistant. Kartavya Pathak is a CSE freshman at MSRIT (Class of 2030), a Python developer, AI automation enthusiast, and 120 WPM typist. He builds with Python, web tech, and AI tools — and he's actively looking for internships and collaborations."
    },
    {
      keywords: ['skills', 'stack', 'technologies', 'tech stack', 'what can he', 'what does he know', 'programming'],
      answer: "Kartavya's main stack: Python (backend, scripting, automation), Web Development (HTML, CSS, JavaScript), AI Automation (LLMs, agents, workflows), and 10-finger touch typing at 120 WPM. He's also working on DSA and machine learning."
    },
    {
      keywords: ['education', 'college', 'university', 'msrit', 'degree', 'studying', 'student'],
      answer: "Kartavya is pursuing B.E. Computer Science & Engineering (Core) at MS Ramaiah Institute of Technology (MSRIT), Bangalore. He's currently a freshman, Class of 2030."
    },
    {
      keywords: ['typing', 'wpm', 'monkeytype', 'keyboard', 'speed'],
      answer: "Kartavya types at 120 WPM using 10-finger touch typing. You can check his Monkeytype profile — there's a link in the WPM section on this site."
    },
    {
      keywords: ['project', 'projects', 'built', 'portfolio work', 'github'],
      answer: "Projects are coming soon — Kartavya is in his first year and building in public. Check the Projects section for upcoming slots, and his GitHub for anything he pushes."
    },
    {
      keywords: ['certification', 'certificate', 'certified', 'cybersecurity', 'techhacker'],
      answer: "Kartavya holds certificates in Introduction to Cybersecurity for Business and the Techhacker Exploitation Course. View them in the Certifications section — more are on the way."
    },
    {
      keywords: ['contact', 'email', 'reach', 'hire', 'internship', 'collaborate', 'linkedin'],
      answer: "You can reach Kartavya via email at kartavyapathak40@gmail.com, or connect on LinkedIn and GitHub — links are in the Contact section. He's open to internships and collaborations."
    },
    {
      keywords: ['ai', 'automation', 'llm', 'agent'],
      answer: "AI automation is one of Kartavya's strengths. He uses LLMs and agents to automate workflows and ship faster — treating AI as a force multiplier for development work."
    },
    {
      keywords: ['python', 'javascript', 'html', 'css', 'web dev'],
      answer: "Kartavya works primarily in Python for backend logic and automation, and HTML/CSS/JavaScript for web interfaces. He's continuously leveling up both."
    },
    {
      keywords: ['blog', 'gym', 'fitness', 'gym24', 'workout'],
      answer: "On the side, Kartavya runs a fitness blog at gym24-7.blogspot.com — it's a personal hobby, separate from his CS work. Discipline from fitness carries over, but his focus here is software engineering."
    },
    {
      keywords: ['location', 'where', 'bangalore', 'india'],
      answer: "Kartavya studies at MSRIT in Bangalore, India."
    },
    {
      keywords: ['hello', 'hi', 'hey', 'good morning', 'good evening'],
      answer: "Hey! 👋 I'm Kartavya's AI assistant. Ask me about his skills, education, projects, certifications, or how to get in touch."
    },
    {
      keywords: ['help', 'what can you', 'what do you'],
      answer: "I can answer questions about Kartavya — his background, skills, education, certifications, typing speed, and contact info. I also handle general tech questions. Try: \"What are his skills?\" or \"How can I contact him?\""
    },
    {
      keywords: ['dsa', 'data structure', 'algorithm', 'leetcode'],
      answer: "Kartavya is actively building his DSA skills — it's on his learning roadmap alongside machine learning. He's a freshman putting in the reps early."
    },
    {
      keywords: ['machine learning', 'ml', 'deep learning', 'ai ml'],
      answer: "Machine learning is on Kartavya's upcoming PR board — he's planning to add it to his skill set soon. Right now his AI focus is more on automation and LLM workflows."
    }
  ];

  const GENERAL = [
    {
      keywords: ['what is python', 'python language'],
      answer: "Python is a versatile programming language great for web backends, data science, automation, and scripting. It's one of Kartavya's primary languages."
    },
    {
      keywords: ['what is javascript', 'js language'],
      answer: "JavaScript runs in browsers and on servers (Node.js). It's the language of the web — HTML/CSS/JS is how most sites you visit are built."
    },
    {
      keywords: ['what is ai', 'artificial intelligence'],
      answer: "Artificial Intelligence refers to systems that can perform tasks requiring human-like intelligence — from chatbots like me to image recognition and code generation."
    },
    {
      keywords: ['what is react', 'what is node'],
      answer: "React is a JavaScript library for building user interfaces. Node.js lets you run JavaScript on the server. Kartavya is focused on core web fundamentals first — HTML, CSS, and vanilla JS."
    },
    {
      keywords: ['how to learn programming', 'learn to code', 'start coding'],
      answer: "Start with one language (Python is beginner-friendly), build small projects, and stay consistent. Kartavya's approach: automate boring tasks, type fast, and use AI as a learning accelerator."
    },
    {
      keywords: ['resume', 'cv'],
      answer: "This portfolio site is Kartavya's online presence. For a formal resume, reach out via the Contact section — he'll share it directly."
    }
  ];

  const FALLBACKS = [
    "I'm not sure about that one. Try asking about Kartavya's skills, education, projects, or how to contact him.",
    "Good question! I don't have a specific answer, but I can tell you about Kartavya's background, tech stack, or certifications.",
    "Hmm, I didn't catch that. Ask me something like \"What are his skills?\" or \"Tell me about Kartavya.\""
  ];

  function scoreMatch(message, entry) {
    const lower = message.toLowerCase();
    let score = 0;
    entry.keywords.forEach((kw) => {
      if (lower.includes(kw)) score += kw.split(' ').length;
    });
    return score;
  }

  function findAnswer(message) {
    let best = null;
    let bestScore = 0;

    [...KNOWLEDGE, ...GENERAL].forEach((entry) => {
      const score = scoreMatch(message, entry);
      if (score > bestScore) {
        bestScore = score;
        best = entry;
      }
    });

    if (bestScore > 0) return best.answer;

    const lower = message.toLowerCase();
    if (lower.includes('kartavya') || lower.includes('pathak')) {
      return KNOWLEDGE[0].answer;
    }

    return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
  }

  const widget = document.getElementById('chatbot');
  if (!widget) return;

  const toggle = document.getElementById('chatToggle');
  const panel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('chatClose');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');
  const messages = document.getElementById('chatMessages');
  const suggestions = document.querySelectorAll('.chat-suggestion');

  let isOpen = false;

  function openChat() {
    isOpen = true;
    panel.classList.add('open');
    toggle.classList.add('active');
    toggle.setAttribute('aria-expanded', 'true');
    input.focus();
  }

  function closeChat() {
    isOpen = false;
    panel.classList.remove('open');
    toggle.classList.remove('active');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    isOpen ? closeChat() : openChat();
  });

  closeBtn.addEventListener('click', closeChat);

  function appendMessage(text, role) {
    const div = document.createElement('div');
    div.className = `chat-msg chat-msg-${role}`;
    div.innerHTML = role === 'bot'
      ? `<div class="chat-avatar" aria-hidden="true">AI</div><div class="chat-bubble">${text}</div>`
      : `<div class="chat-bubble">${escapeHtml(text)}</div>`;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function showTyping() {
    const typing = document.createElement('div');
    typing.className = 'chat-msg chat-msg-bot chat-typing';
    typing.id = 'chatTyping';
    typing.innerHTML = `
      <div class="chat-avatar" aria-hidden="true">AI</div>
      <div class="chat-bubble"><span></span><span></span><span></span></div>
    `;
    messages.appendChild(typing);
    messages.scrollTop = messages.scrollHeight;
  }

  function hideTyping() {
    const typing = document.getElementById('chatTyping');
    if (typing) typing.remove();
  }

  function respond(text) {
    appendMessage(text, 'user');
    input.value = '';
    input.disabled = true;
    showTyping();

    const delay = 600 + Math.min(text.length * 8, 800);
    setTimeout(() => {
      hideTyping();
      appendMessage(findAnswer(text), 'bot');
      input.disabled = false;
      input.focus();
    }, delay);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    respond(text);
  });

  suggestions.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!isOpen) openChat();
      respond(btn.textContent);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isOpen) closeChat();
  });
})();

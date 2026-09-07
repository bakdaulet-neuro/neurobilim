(() => {
  const items = [
    {
      key: "gpt",
      label: "GPT",
      mark: "✦",
      right: "8%",
      drift: "18px",
      spin: "-8deg",
      life: "5.4s",
      delay: "-0.15s"
    },
    {
      key: "gemini",
      label: "Gemini",
      mark: "✦",
      right: "41%",
      drift: "-12px",
      spin: "8deg",
      life: "5.4s",
      delay: "-1.23s"
    },
    {
      key: "claude",
      label: "Claude",
      mark: "✺",
      right: "18%",
      drift: "11px",
      spin: "-6deg",
      life: "5.4s",
      delay: "-2.31s"
    },
    {
      key: "midjourney",
      label: "Midjourney",
      mark: "◇",
      right: "36%",
      drift: "-15px",
      spin: "7deg",
      life: "5.4s",
      delay: "-3.39s"
    },
    {
      key: "perplexity",
      label: "Perplexity",
      mark: "⌘",
      right: "4%",
      drift: "14px",
      spin: "-9deg",
      life: "5.4s",
      delay: "-4.47s"
    }
  ];

  function decorateHero() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const portrait = hero.querySelector(".hero-portrait");
    if (portrait && portrait.dataset.heroV2 !== "1") {
      portrait.src = "./portrait.png?v=hero-2";
      portrait.fetchPriority = "high";
      portrait.decoding = "async";
      portrait.dataset.heroV2 = "1";
    }

    if (hero.querySelector(".hero-ai-stream")) return;

    const stream = document.createElement("div");
    stream.className = "hero-ai-stream";
    stream.setAttribute("aria-hidden", "true");

    items.forEach((item) => {
      const chip = document.createElement("span");
      chip.className = "ai-chip";
      chip.dataset.ai = item.key;
      chip.style.setProperty("--right", item.right);
      chip.style.setProperty("--drift", item.drift);
      chip.style.setProperty("--spin", item.spin);
      chip.style.setProperty("--life", item.life);
      chip.style.setProperty("--delay", item.delay);

      const mark = document.createElement("span");
      mark.className = "ai-chip-mark";
      mark.textContent = item.mark;

      const label = document.createElement("span");
      label.textContent = item.label;

      chip.append(mark, label);
      stream.appendChild(chip);
    });

    hero.appendChild(stream);
  }

  const app = document.getElementById("app");
  if (!app) return;

  decorateHero();

  const observer = new MutationObserver(() => {
    decorateHero();
  });

  observer.observe(app, {
    childList: true,
    subtree: true
  });
})();

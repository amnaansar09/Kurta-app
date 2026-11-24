/* Aasani – product data: modular options, variations and copy. */
window.AASANI = (function () {
  const OPTIONS = {
    opening: {
      label: "Front opening",
      help: "How far the kurta opens down the front.",
      choices: {
        partial: { name: "Partial front opening", desc: "Opens to the waist. The kurta goes over the head through a much wider opening." },
        full: { name: "Full front opening", desc: "Opens from neck to hem like a coat. No lifting over the head at all." }
      }
    },
    closure: {
      label: "Fastening",
      help: "What holds the front closed.",
      choices: {
        magnetic: { name: "Concealed magnets", desc: "Magnets sewn inside fabric pockets. Panels snap together when brought close.", magnetic: true },
        snaps: { name: "Large snap buttons", desc: "Extra-large 20 mm snaps. No magnets, but need a firm press." },
        hookloop: { name: "Soft hook-and-loop", desc: "Low-profile soft tape. Press to close, peel to open. No magnets." },
        zip: { name: "Zip with ring pull", desc: "Self-locking zip with a large ring you can hook a finger through. No magnets." }
      }
    },
    sleeve: {
      label: "Sleeve length",
      help: "Shorter sleeves are easier to slide an arm into.",
      choices: {
        full: { name: "Full sleeve", desc: "Wrist length, for cooler weather and occasions." },
        threequarter: { name: "Three-quarter sleeve", desc: "Ends below the elbow. Easy to put on, still modest." },
        short: { name: "Short sleeve", desc: "Elbow-free. The easiest for stiff elbows and shoulders." }
      }
    },
    sleeveWidth: {
      label: "Sleeve fit",
      help: "Wider armholes need less shoulder rotation.",
      choices: {
        relaxed: { name: "Relaxed", desc: "Roomier than a regular kurta sleeve." },
        wide: { name: "Wide with deep armhole", desc: "Extra-deep armhole and wide cuff. The arm slides in with almost no shoulder movement." }
      }
    },
    sleeveDetachable: {
      label: "Detachable sleeves",
      help: "Sleeves that fasten on at the shoulder with large snaps.",
      choices: {
        no: { name: "Sewn-in sleeves", desc: "Classic construction, nothing to attach." },
        yes: { name: "Detachable sleeves", desc: "Put the body on first, then attach each sleeve. Helpful after shoulder surgery." }
      }
    },
    sidePanels: {
      label: "Side panels",
      help: "Panels along each side seam.",
      choices: {
        fixed: { name: "Fixed side seams", desc: "A clean, traditional silhouette." },
        adjustable: { name: "Adjustable side panels", desc: "Three width settings on each side. Changes with swelling, weight or sitting comfort." }
      }
    },
    neckline: {
      label: "Neckline",
      help: "Interchangeable neckline styles.",
      choices: {
        round: { name: "Round neck", desc: "Soft and simple for everyday." },
        v: { name: "V-neck", desc: "A little more room around the throat." },
        band: { name: "Band collar", desc: "Smart, upright collar, good for occasions." }
      }
    },
    length: {
      label: "Length",
      help: "A detachable lower extension changes the length.",
      choices: {
        standard: { name: "Standard (knee)", desc: "Knee length. Won't bunch up when seated." },
        long: { name: "Long (with extension)", desc: "Adds a detachable 15 cm band at the hem for a longer, formal look." }
      }
    },
    fabric: {
      label: "Fabric",
      help: "All fabrics are soft, breathable and machine washable.",
      choices: {
        lawn: { name: "Cotton lawn", desc: "Light and cool, ideal for summer." },
        cottonlinen: { name: "Cotton-linen", desc: "Breathable with a little more body." },
        khaddar: { name: "Soft khaddar", desc: "Warm, brushed cotton for winter." },
        cambric: { name: "Lined cambric", desc: "Smooth cotton with a soft lining, good for occasions." }
      }
    },
    print: {
      label: "Print",
      help: "Traditional prints keep it looking like everyday wear, not medical clothing.",
      choices: {
        plain: { name: "Plain" },
        block: { name: "Block print" },
        floral: { name: "Floral" },
        stripe: { name: "Fine stripe" }
      }
    },
    embroidery: {
      label: "Embroidery",
      help: "Embroidery is placed away from closures and pressure points.",
      choices: {
        no: { name: "None" },
        yes: { name: "Neckline and hem embroidery" }
      }
    }
  };

  const COLORS = {
    firozi: { name: "Firozi", hex: "#2f8f9d", accent: "#f4e3c1" },
    mehndi: { name: "Mehndi green", hex: "#6b7a3a", accent: "#f1e6c8" },
    rose: { name: "Dusty rose", hex: "#c0767b", accent: "#fbeee6" },
    ivory: { name: "Ivory", hex: "#efe6d2", accent: "#9a6b3f" },
    indigo: { name: "Indigo", hex: "#34497a", accent: "#e8dcc0" },
    mustard: { name: "Mustard", hex: "#c99a2e", accent: "#5a3b1c" },
    maroon: { name: "Maroon", hex: "#7a2433", accent: "#e9c97c" }
  };

  const VARIANTS = {
    classic: {
      name: "Aasani Classic",
      tagline: "Everyday straight-cut kurta",
      desc: "A traditional straight-cut kurta with a discreet front opening and relaxed sleeves. Looks like any kurta in your wardrobe and is much easier to put on.",
      bestFor: "Mild stiffness, everyday wear",
      config: { opening: "partial", closure: "magnetic", sleeve: "threequarter", sleeveWidth: "relaxed", sleeveDetachable: "no", sidePanels: "fixed", neckline: "round", length: "standard", fabric: "lawn", color: "firozi", print: "block", embroidery: "no" }
    },
    flex: {
      name: "Aasani Flex",
      tagline: "Adjusts as comfort needs change",
      desc: "Adjustable side panels and a more relaxed silhouette. Each side has three width settings for swelling, weight changes, or long hours sitting.",
      bestFor: "Changing body shape, sitting for long periods",
      config: { opening: "partial", closure: "snaps", sleeve: "threequarter", sleeveWidth: "relaxed", sleeveDetachable: "no", sidePanels: "adjustable", neckline: "v", length: "standard", fabric: "cottonlinen", color: "mehndi", print: "floral", embroidery: "no" }
    },
    ease: {
      name: "Aasani Ease",
      tagline: "Opens fully – no arms overhead",
      desc: "A fully opening front, wide sleeves with deep armholes, and simple closures. Can be put on like a coat while seated, with or without help.",
      bestFor: "Significant shoulder or upper-body limitation",
      config: { opening: "full", closure: "magnetic", sleeve: "threequarter", sleeveWidth: "wide", sleeveDetachable: "no", sidePanels: "fixed", neckline: "round", length: "standard", fabric: "lawn", color: "rose", print: "plain", embroidery: "no" }
    },
    occasion: {
      name: "Aasani Occasion",
      tagline: "For weddings, dawats and Eid",
      desc: "A decorative version with embroidery and richer colours. Keeps every adaptive feature hidden inside the design, so nothing looks clinical.",
      bestFor: "Social gatherings and family events",
      config: { opening: "partial", closure: "magnetic", sleeve: "full", sleeveWidth: "relaxed", sleeveDetachable: "no", sidePanels: "fixed", neckline: "band", length: "long", fabric: "cambric", color: "maroon", print: "plain", embroidery: "yes" }
    }
  };

  const PRINCIPLES = [
    { title: "Front-opening construction", text: "Opens at the front, so you don't have to lift your arms overhead or stretch your shoulders.", icon: "front" },
    { title: "Easy fastenings", text: "Concealed magnets, large snaps or soft tape instead of small buttons. They work even when fingers are stiff.", icon: "magnet" },
    { title: "Modular side panels", text: "Side panels you can adjust for different body shapes, sitting positions and comfort needs.", icon: "panel" },
    { title: "Ergonomic sleeves", text: "Wider armholes and relaxed sleeves, for shoulders that don't move the way they used to.", icon: "sleeve" },
    { title: "Comfortable fabrics", text: "Soft, breathable cotton with room at the shoulders, chest, waist and hips.", icon: "fabric" }
  ];

  const QUIZ = [
    {
      id: "difficulty",
      q: "What makes getting dressed hardest?",
      sub: "Choose the one that matters most.",
      options: [
        { v: "shoulders", label: "Raising my arms or moving my shoulders" },
        { v: "hands", label: "Using my fingers – buttons, hooks, gripping" },
        { v: "both", label: "Both shoulders and hands" },
        { v: "general", label: "Nothing specific – I just want more comfort" }
      ]
    },
    {
      id: "seated",
      q: "Do you usually get dressed sitting down?",
      options: [
        { v: "yes", label: "Yes, I sit down to dress" },
        { v: "no", label: "No, I usually stand" }
      ]
    },
    {
      id: "device",
      q: "Do you have a pacemaker or other implanted medical device?",
      sub: "Magnets can affect some devices, so we ask to choose a safe fastening.",
      options: [
        { v: "yes", label: "Yes" },
        { v: "unsure", label: "I'm not sure" },
        { v: "no", label: "No" }
      ]
    },
    {
      id: "help",
      q: "How much help do you need when dressing?",
      options: [
        { v: "none", label: "I dress on my own" },
        { v: "sometimes", label: "Sometimes I need a hand" },
        { v: "always", label: "A family member or caregiver helps me" }
      ]
    },
    {
      id: "shape",
      q: "Does your comfort or fit change from day to day?",
      sub: "For example swelling, weight changes, or recovering from surgery.",
      options: [
        { v: "yes", label: "Yes, it changes" },
        { v: "no", label: "No, it stays about the same" }
      ]
    },
    {
      id: "occasion",
      q: "Where will you wear it most?",
      options: [
        { v: "everyday", label: "At home, every day" },
        { v: "gatherings", label: "Gatherings, weddings, Eid" }
      ]
    }
  ];

  const DRESSING_STEPS = {
    full: [
      "Sit on a firm chair with your feet flat. Open the kurta completely and lay it over your lap, inside facing up.",
      "Slide your stiffer or weaker arm into its sleeve first. Use the other hand to pull the sleeve up to the shoulder.",
      "Lean forward a little and bring the kurta around your back, the way you would put on a shawl.",
      "Slide your stronger arm into the second sleeve. Wide armholes mean you don't need to reach backwards.",
      "Bring the two front panels together, starting at the bottom. The fastenings line up on their own.",
      "Stand up when you're ready and let the kurta fall straight. Adjust the side panels if needed."
    ],
    partial: [
      "Sit on a firm chair. Undo the front opening all the way to the waist so the neck opening is as wide as possible.",
      "Gather the kurta from the hem up to the neckline, so you are holding just the neck opening.",
      "Slide your stiffer or weaker arm into its sleeve first, while the kurta rests on your lap.",
      "Lower your head forward into the opening. Don't lift the garment over your head with your arms.",
      "Slide your stronger arm into the second sleeve, then let the kurta fall down your back.",
      "Close the front from the bottom of the opening up to the neck."
    ],
    undress: [
      "Sit down. Undo the front fastenings. Magnets and soft tape pull apart, no need to pinch.",
      "Slip the kurta off your stronger shoulder first, then pull your stronger arm out.",
      "Let the kurta slide down your back. Take your stiffer arm out last, keeping it relaxed."
    ],
    caregiver: [
      "Stand on her weaker side. This is where she will need the most support.",
      "Dress the weaker arm first and undress it last.",
      "Let her do every step she can manage on her own. Independence is the goal.",
      "Never pull an arm through a sleeve. Gather the sleeve and guide it over her hand instead.",
      "With detachable sleeves, put the body on first and then attach each sleeve at the shoulder."
    ]
  };

  return { OPTIONS, COLORS, VARIANTS, PRINCIPLES, QUIZ, DRESSING_STEPS };
})();

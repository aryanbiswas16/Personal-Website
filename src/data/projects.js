import horrorGame from '../assets/horror-game.webp'
import skip from '../assets/skip.webp'
import leetcode from '../assets/leetcode.webp'
import paperPreview from '../assets/deepfakeguard-paper.webp'
import paperThumb from '../assets/deepfakeguard-paper-thumb.webp'
import deepfakeGuardApp from '../assets/deepfakeguard-app.webp'
import thermalMp4 from '../assets/thermal-froth.mp4'
import thermalWebm from '../assets/thermal-froth.webm'
import thermalPoster from '../assets/thermal-froth-poster.webp'
import frothQuality from '../assets/froth-quality.webp'

export const projects = [
  // Projects with an empty `links` list live in private repositories (client work, Motive, pokedrop).
  {
    id: 'deepfake-guard',
    featured: true,
    title: 'DeepfakeGuard',
    kind: 'Research · CUCAI 2026 spotlight',
    desc: 'An open-source toolkit for catching AI-generated video and audio. Three specialist detectors, a DINOv3 vision transformer for face swaps (0.88 AUROC cross-dataset), the training-free D3 temporal-volatility check, and the audio-visual LipFD lip-sync model, are fused with trust-weighted scoring, applicability gating, and an outlier veto. An optional vision-language model writes a plain-English forensic explanation. Pip-installable, with a Streamlit demo.',
    tags: ['Python', 'PyTorch', 'DINOv3', 'Vision-language models', 'Streamlit'],
    image: deepfakeGuardApp,
    imageAlt:
      'DeepfakeGuard’s Streamlit results panel for an AI-generated video: ensemble verdict FAKE at 62.3%, two of three detectors voting fake, and a vision-language model’s written explanation of the visual artifacts.',
    imagePosition: 'center top',
    paper: {
      title: 'DeepfakeGuard: An Open-Source Multi-Modal Toolkit for Detecting AI-Generated Video and Audio',
      venue: 'CUCAI 2026',
      venueLong: 'Canadian Undergraduate Conference on AI, 2026',
      authors: ['Aryan Biswas', 'Kevin Hu', 'Eitan Zur', 'Muhammad Hamza Khan', 'Emmanuel Davidson'],
      affiliation: 'Queen’s University, School of Computing',
      pages: 6,
      abstract:
        'AI-generated video and audio are now good enough for large-scale fraud, harassment, and political manipulation, but few tools exist to catch them. DeepfakeGuard is an open-source Python toolkit that runs three complementary detectors, a parameter-efficient DINOv3 visual detector, a rebuilt LipFD audio-visual lip-sync detector, and a training-free D3 temporal detector, then fuses their verdicts with trust-weighted scoring and applicability gating. An optional vision-language model turns the result into a written forensic judgment. The DINOv3 detector reaches an AUROC of 0.88 on Celeb-DF v2 and LipFD reaches 91.2% accuracy on lip-synced FakeAVCeleb videos.',
      // The PDF is served from public/ so its URL stays stable and shareable.
      file: 'papers/deepfakeguard-cucai-2026.pdf',
      thumb: paperThumb,
      preview: paperPreview,
    },
    links: [
      { label: 'Source', href: 'https://github.com/aryanbiswas16/DeepFakeGuard', primary: true },
      { label: 'Paper', href: 'https://cucai.ca/papers/42' },
    ],
  },
  {
    id: 'thermal-froth',
    featured: true,
    flip: true,
    title: 'Thermal froth imaging',
    kind: 'Client work · via TCS',
    desc: 'Tested whether thermal cameras can spot froth bubbles for one of the world’s largest mining companies. I built a U-Net segmentation model, trained it on boiling simulations and synthetic thermal froth I generated with a camera model, and compared it against a watershed baseline.',
    tags: ['Python', 'PyTorch', 'U-Net', 'Watershed', 'Synthetic data'],
    video: { webm: thermalWebm, mp4: thermalMp4, poster: thermalPoster },
    imageAlt:
      'Synthetic thermal froth moving past the camera at two contrasts, 0.3 °C and 0.1 °C, with the bubbles the U-Net found beside each.',
    credit: 'Clip: synthetic thermal froth from the demo, not a plant recording.',
    links: [],
  },
  {
    id: 'froth-quality',
    featured: true,
    title: 'Froth quality from camera images',
    kind: 'Client work · via TCS',
    desc: 'Rates flotation froth as OK, CHECK, or POOR from camera images. I fine-tuned Cellpose-SAM and used watershed segmentation to outline and measure every bubble, then trained a gradient-boosting model on the image features to give the verdict.',
    tags: ['Python', 'PyTorch', 'Cellpose-SAM', 'Watershed', 'Gradient boosting'],
    image: frothQuality,
    imageAlt:
      'A lab froth photo with every bubble outlined and coloured by size: large merged bubbles in red and yellow among small green ones, the kind of froth the model rates POOR.',
    imagePosition: 'center',
    credit: 'Photo: Yantén & Kracht, Magotteaux froth images (CC BY 4.0), annotated by the model.',
    links: [],
  },
  {
    id: 'agents',
    title: 'My always-on AI assistant',
    kind: 'Home lab · Mac mini M4',
    desc: 'My own assistant, running 24/7 on an M4 Mac mini with an open model, Ternary Bonsai 2 27B, served locally. OpenClaw and Hermes agents have tools they can call and long-term memory through Vectorize’s Hindsight, so they remember context across conversations. I also built Mission Control, a dashboard for its sessions, tasks, and channels.',
    tags: ['Local LLM', 'OpenClaw', 'Hermes', 'Hindsight', 'Next.js'],
    figure: 'agents',
    links: [{ label: 'Dashboard source', href: 'https://github.com/aryanbiswas16/openclaw-dashboard' }],
  },
  {
    id: 'ace-step',
    title: 'ACE-Step 1.5',
    kind: 'Open source · Contributor',
    desc: 'An open-source music foundation model: a language model plans the song, a diffusion transformer synthesizes it, and a full track renders in seconds on one GPU. I fixed a Windows bug where Gradio uploads landed outside the project’s safe root, so the Extract and Lego tools silently fell back to text-to-music. Shipped with four regression tests and adopted upstream.',
    tags: ['Python', 'PyTorch', 'Gradio', 'Diffusion transformers'],
    figure: 'pullRequest',
    links: [
      { label: 'Project', href: 'https://github.com/ace-step/ACE-Step-1.5', primary: true },
      { label: 'My pull request', href: 'https://github.com/ace-step/ACE-Step-1.5/pull/1148' },
    ],
  },
  {
    id: 'motive',
    featured: true,
    flip: true,
    title: 'Motive',
    kind: 'Mobile app · React Native',
    desc: 'A social map for finding something to do with your friends: see what’s happening around you, take on weekly crew quests, and check in when you get there. I integrated Mapbox and designed a custom dark 3D map style, then layered on a crowd heatmap, pulsing live pins, and lighting that follows the time of day.',
    tags: ['React Native', 'Expo', 'Mapbox', 'TypeScript', 'Zustand'],
    figure: 'motiveMap',
    links: [],
  },
  {
    id: 'pokedrop',
    title: 'pokedrop',
    kind: 'Go · Runs on the Mac mini',
    desc: 'A small Go service that watches Canadian retailers for Pokémon TCG restocks at MSRP, filters out marketplace scalpers, and pings my phone within seconds. Runs 24/7 on the same Mac mini in about 20 MB of RAM.',
    tags: ['Go', 'Web scraping', 'launchd', 'Notifications'],
    figure: 'dropAlerts',
    links: [],
  },
  {
    id: 'asl',
    title: 'Real-time Sign Language Recognition',
    kind: 'Computer vision',
    desc: 'American Sign Language recognition from a webcam feed. MediaPipe tracks 21 hand landmarks, a Keras model classifies the pose, and OpenCV runs the whole thing live. Includes the data collection and training scripts.',
    tags: ['Python', 'TensorFlow', 'Keras', 'MediaPipe', 'OpenCV', 'scikit-learn'],
    figure: 'sign',
    links: [{ label: 'Source', href: 'https://github.com/aryanbiswas16/SignLanguageRecognition' }],
  },
  {
    id: 'horror-game',
    featured: true,
    title: 'My Mom Needs Me Home For Dinner But There’s Monsters In The Office!',
    kind: 'Game · Unity',
    desc: 'A third-person comedy-horror game. You are an office worker, the building is full of monsters, and your mom needs you home for dinner. Manage your phone battery, dodge what lurks in the dark, and make it out before the food gets cold.',
    tags: ['C#', 'Unity', 'Game design'],
    image: horrorGame,
    imageAlt: 'A screenshot from the game: a dark office corridor, an incoming call from “Wife” on a phone at 77% battery, and two pixel hearts.',
    imagePosition: 'center',
    imageFit: 'contain',
    links: [
      {
        label: 'Play on itch.io',
        href: 'https://kamisama165.itch.io/my-mom-needs-me-home-for-dinner-but-theres-monsters-in-the-office',
        primary: true,
      },
      { label: 'Source', href: 'https://github.com/aryanbiswas16/HorrorGame' },
    ],
  },
  {
    id: 'leetcode-coach',
    title: 'LeetCode Coach',
    kind: 'Chrome extension · LLM',
    desc: 'A coach that reads the code in your LeetCode editor and gives you nudges instead of answers, then writes up notes on every problem for later review. Built before LeetCode shipped their own version of the idea.',
    tags: ['JavaScript', 'React', 'Chrome extensions', 'LLMs'],
    image: leetcode,
    imageAlt: 'LeetCode’s Palindrome Number problem with the coach’s hint panel docked on the right.',
    imagePosition: 'right top',
    links: [{ label: 'Source', href: 'https://github.com/aryanbiswas16/AI-leetcode-coach-extention' }],
  },
  {
    id: 'skip-scraper',
    title: 'Skip the Dishes Coupon Scraper',
    kind: 'Chrome extension',
    desc: 'A browser extension that hunts down working Skip the Dishes promo codes and tests them at checkout so you don’t have to. Finds the codes, tries them, keeps the ones that work.',
    tags: ['JavaScript', 'React', 'Chrome extensions'],
    image: skip,
    imageAlt: 'The extension popup over a Skip the Dishes checkout page, listing three working promo codes it found.',
    imagePosition: 'right top',
    links: [{ label: 'Source', href: 'https://github.com/aryanbiswas16/Skip-The-Dishes-Promo-Scrapper' }],
  },
]

// Smaller things without screenshots. Listed under the grid.
export const more = [
  {
    title: 'Beacon AI Meeting Intelligence',
    where: 'KingHacks 2026',
    desc: 'A Manifest V3 Chrome extension that streams live Google Meet captions into a low-latency RAG pipeline (FastAPI, Next.js, server-sent events) for grounded summaries, live decision tracking, and action items.',
  },
  {
    title: 'Agentic RAG chatbot for business banking',
    where: 'BMO Hackwave · Top 10 of 40+ teams',
    desc: 'A GPT-4 multi-agent banking assistant built with LangChain and AutoGen for loan qualification, scheduling, account retrieval, and policy questions.',
  },
  {
    title: 'ROS 2 autonomous wheelchair',
    where: 'TCS Pace Port',
    desc: 'A* and RRT* path planning with YOLO obstacle detection, built during the research internship.',
  },
  {
    title: 'CISC 101 autograder',
    where: 'Queen’s University',
    desc: 'Cut instructor grading time by 36% across two intro programming courses.',
  },
]

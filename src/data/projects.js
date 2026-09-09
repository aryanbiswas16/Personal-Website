import horrorGame from '../assets/horror-game.webp'
import skip from '../assets/skip.webp'
import leetcode from '../assets/leetcode.webp'
import paperPreview from '../assets/deepfakeguard-paper.webp'
import paperThumb from '../assets/deepfakeguard-paper-thumb.webp'

export const projects = [
  {
    id: 'deepfake-guard',
    featured: true,
    title: 'DeepfakeGuard',
    kind: 'Research · CUCAI 2026 spotlight',
    desc: 'An open-source toolkit for catching AI-generated video and audio. Three specialist detectors, a DINOv3 vision transformer for face swaps (0.88 AUROC cross-dataset), the training-free D3 temporal-volatility check, and the audio-visual LipFD lip-sync model, are fused with trust-weighted scoring, applicability gating, and an outlier veto. An optional vision-language model writes a plain-English forensic explanation. Pip-installable, with a Streamlit demo.',
    tags: ['Python', 'PyTorch', 'DINOv3', 'Vision-language models', 'Streamlit'],
    figure: 'detector',
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
    id: 'ace-step',
    title: 'ACE-Step 1.5',
    kind: 'Open source · Contributor',
    desc: 'An open-source music foundation model: a language model plans the song, a diffusion transformer synthesizes it, and a full track renders in seconds on one GPU. I fixed a Windows bug where Gradio uploads landed outside the project’s safe root, so the Extract and Lego tools silently fell back to text-to-music. Shipped with four regression tests and adopted upstream.',
    tags: ['Python', 'PyTorch', 'Gradio', 'Diffusion transformers'],
    figure: 'wave',
    links: [
      { label: 'Project', href: 'https://github.com/ace-step/ACE-Step-1.5', primary: true },
      { label: 'My pull request', href: 'https://github.com/ace-step/ACE-Step-1.5/pull/1148' },
    ],
  },
  {
    id: 'asl',
    title: 'Real-time Sign Language Recognition',
    kind: 'Computer vision',
    desc: 'American Sign Language recognition from a webcam feed. MediaPipe tracks 21 hand landmarks, a Keras model classifies the pose, and OpenCV runs the whole thing live. Includes the data collection and training scripts.',
    tags: ['Python', 'TensorFlow', 'Keras', 'MediaPipe', 'OpenCV', 'scikit-learn'],
    figure: 'hand',
    links: [{ label: 'Source', href: 'https://github.com/aryanbiswas16/SignLanguageRecognition' }],
  },
  {
    id: 'horror-game',
    featured: true,
    flip: true,
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

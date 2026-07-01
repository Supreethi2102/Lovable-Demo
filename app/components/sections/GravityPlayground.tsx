import React, { useState, useEffect, useRef } from 'react';
import Matter from 'matter-js';
import { 
  Heart,
  Star,
  Sparkle,
  Palette,
  PaintBrush,
  Ruler,
  Compass,
  PencilSimple
} from '@phosphor-icons/react';
import { SwatchCard, type SwatchCardMood } from './SwatchCard';
import './GravityPlayground.css';

type SwatchMood = SwatchCardMood;

// Swatch cards with front + back (colour mood) data
const swatchCards: Array<{
  id: string;
  name: string;
  hex: string;
  color: string;
  mood: SwatchMood;
}> = [
  {
    id: 'swatch-nympheas',
    name: 'Nymphéas Blue',
    hex: '#B3CDE2',
    color: '#B3CDE2',
    mood: {
      description: "Monet's Water Lilies at the Musée de l'Orangerie unveiled a blue in motion, designed to shift with light, space, and calm reflection.",
      contrastColor: '#4f5421',
      idealMatchHex: '#4f5421',
      idealMatchName: 'Sydney Eve Indigo',
      contrastRatio: '4.86:1',
      contrastRating: 'AA',
    },
  },
  {
    id: 'swatch-gaudi',
    name: 'Gaudí Cathedral Blue',
    hex: '#060591',
    color: '#060591',
    mood: {
      description: "At the Basilica Sagrada Família, blue light from stained-glass windows bathed me in awe, the blue dancing across stonework.",
      contrastColor: '#FC95B1',
      idealMatchHex: '#FC95B1',
      idealMatchName: 'Sunlit Flamingo Pink',
      contrastRatio: '7:1',
      contrastRating: 'AAA',
    },
  },
  {
    id: 'swatch-flamingo',
    name: 'Sunlit Flamingo Pink',
    hex: '#FC95B1',
    color: '#FC95B1',
    mood: {
      description: "The San Diego Zoo brought a pop of joy. Sunlight, the flamingos' feathers, and a vivid, bright pink that knew how to make an entrance.",
      contrastColor: '#060591',
      idealMatchHex: '#060591',
      idealMatchName: 'Gaudí Cathedral Blue',
      contrastRatio: '7',
      contrastRating: 'AAA',
    },
  },
  {
    id: 'swatch-orange',
    name: 'Studio Orange',
    hex: '#C25A35',
    color: '#C25A35',
    mood: {
      description: "At Warner Bros. Studio, the Friends sofa's burnt orange wrapped me in warmth and memory. A hue of laughter, comfort, and endless reruns.",
      contrastColor: '#0E0213',
      idealMatchHex: '#0E0213',
      idealMatchName: 'Nightfall Onyx Eve',
      contrastRatio: '4.63:1',
      contrastRating: 'AA',
    },
  },
  {
    id: 'swatch-black',
    name: 'Nightfall Onyx Eve',
    hex: '#0E0213',
    color: '#0E0213',
    mood: {
      description: "On Sydney Harbour, deep onyx blanketed the sky. City lights flickered, clock ticking, and I felt the night hum with excitement.",
      contrastColor: '#C25A35',
      idealMatchHex: '#C25A35',
      idealMatchName: 'Studio Orange',
      contrastRatio: '4.63:1',
      contrastRating: 'AA',
    },
  },
  {
    id: 'swatch-green',
    name: 'Island Grove Green',
    hex: '#4f5421',
    color: '#4f5421',
    mood: {
      description: "At Dole Plantation in Hawaii, green pineapple leaves swayed in the sun. Warm soil, steady heat, and that green note said snack time.",
      contrastColor: '#B3CDE2',
      idealMatchHex: '#B3CDE2',
      idealMatchName: 'Nymphéas Blue',
      contrastRatio: '4.52:1',
      contrastRating: 'AA',
    },
  },
  {
    id: 'swatch-red',
    name: 'Royal Red',
    hex: '#C91435',
    color: '#C91435',
    mood: {
      description: "Eating fresh strawberries at Buckingham Palace gardens, this vivid red captures their sweetness, joy, and the irresistible burst of colour.",
      contrastColor: '#F1E1F7',
      idealMatchHex: '#F1E1F7',
      idealMatchName: 'Boardwalk Amethyst',
      contrastRatio: '4.63:1',
      contrastRating: 'AA',
    },
  },
  {
    id: 'swatch-teal',
    name: 'Boardwalk Amethyst',
    hex: '#F1E1F7',
    color: '#F1E1F7',
    mood: {
      description: "At Venice Beach, LA's crystal stalls glowed in soft pastels. A haze of amethyst trinkets, easy surf charm, and that laid-back bohemian drift.",
      contrastColor: '#C91435',
      idealMatchHex: '#C91435',
      idealMatchName: 'Royal Red',
      contrastRatio: '4.63:1',
      contrastRating: 'AA',
    },
  },
];

// Skill pills
const skillPills = [
  { id: 'pill-ux', content: 'UX Design', width: 130, height: 48 },
  { id: 'pill-ui', content: 'UI Design', width: 132, height: 48 },
  { id: 'pill-figma', content: 'Figma', width: 100, height: 48 },
  { id: 'pill-creative', content: 'Creative', width: 120, height: 48 },
  { id: 'pill-branding', content: 'Branding', width: 120, height: 48 },
  { id: 'pill-indesign', content: 'InDesign', width: 120, height: 48 },
];

// Icon elements
const iconElements = [
  { id: 'icon-heart', icon: 'heart' },
  { id: 'icon-star', icon: 'star' },
  { id: 'icon-sparkle', icon: 'sparkle' },
  { id: 'icon-palette', icon: 'palette' },
  { id: 'icon-brush', icon: 'brush' },
  { id: 'icon-ruler', icon: 'ruler' },
  { id: 'icon-compass', icon: 'compass' },
  { id: 'icon-pencil', icon: 'pencil' },
];

// Text cards
const textCards = [
  { id: 'text-nz', content: 'NZ Based', width: 122, height: 50 },
  { id: 'text-pixels', content: 'Pixels & Places', width: 176, height: 50 },
  { id: 'text-bold', content: 'Bold', width: 80, height: 50 },
  { id: 'text-human', content: 'Human-Centred', width: 176, height: 50 },
];

// Component types
type ElementType = 'pill' | 'color' | 'icon' | 'text' | 'swatch';

interface PhysicsElement {
  id: string;
  type: ElementType;
  width: number;
  height: number;
  content?: string;
  color?: string;
  hex?: string;
  name?: string;
  icon?: string;
}

// Swatch card dimensions (scaled up from 160×280)
const SWATCH_WIDTH = 176;
const SWATCH_HEIGHT = 308;

// Combine all elements
const allElements: PhysicsElement[] = [
  ...swatchCards.map(s => ({ 
    id: s.id, 
    type: 'swatch' as ElementType, 
    width: SWATCH_WIDTH, 
    height: SWATCH_HEIGHT, 
    color: s.color, 
    hex: s.hex,
    name: s.name 
  })),
  ...skillPills.map(p => ({ ...p, type: 'pill' as ElementType })),
  ...iconElements.map(i => ({ id: i.id, type: 'icon' as ElementType, width: 56, height: 56, icon: i.icon })),
  ...textCards.map(t => ({ ...t, type: 'text' as ElementType })),
];

const swatchMoodById = new Map(swatchCards.map(s => [s.id, s.mood]));

type LayoutConfig = {
  scale: number;
  sceneHeight: number;
  elements: PhysicsElement[];
  spawnCols: number;
  compact: boolean;
  composedLayout: boolean;
  portraitTablet: boolean;
  spawnRowGap: number;
  maxSpawnAngle: number;
  maxRestAngle: number | null;
  edgePad: number;
  colGap: number;
  rowGap: number;
};

type ComposedSlot = { x: number; y: number; angle: number };

function computeComposedSlots(
  viewportWidth: number,
  sceneHeight: number,
  swatchIds: string[],
  scale: number,
  cols: number,
  edgePad: number,
): Map<string, ComposedSlot> {
  const slots = new Map<string, ComposedSlot>();
  const count = swatchIds.length;
  const columnCount = Math.max(1, Math.min(cols, count));
  const usableWidth = viewportWidth - edgePad * 2;
  const colWidth = usableWidth / columnCount;
  const cardH = SWATCH_HEIGHT * scale;
  const cardW = SWATCH_WIDTH * scale;
  const rowGap = 14;
  const bottomPad = 28;
  const tiltPattern = [-0.05, 0.045, -0.035, 0.055, -0.04, 0.04, -0.05, 0.035];

  swatchIds.forEach((id, index) => {
    const col = index % columnCount;
    const row = Math.floor(index / columnCount);
    const xOffset = col % 2 === 0 ? cardW * 0.03 : -cardW * 0.03;
    const x = edgePad + col * colWidth + colWidth / 2 + xOffset;
    const y = sceneHeight - bottomPad - cardH / 2 - row * (cardH + rowGap);

    slots.set(id, {
      x,
      y,
      angle: tiltPattern[index % tiltPattern.length],
    });
  });

  return slots;
}

function getComposedSceneHeight(
  swatchCount: number,
  cols: number,
  scale: number,
  edgePad: number,
): number {
  const columnCount = Math.max(1, Math.min(cols, swatchCount));
  const rows = Math.ceil(swatchCount / columnCount);
  const cardH = SWATCH_HEIGHT * scale;
  const rowGap = 14;
  return Math.ceil(24 + rows * cardH + Math.max(0, rows - 1) * rowGap + edgePad);
}

function getLayoutConfig(viewportWidth: number): LayoutConfig {
  const compact = viewportWidth <= 1024;
  const composedLayout = compact;
  const phone = viewportWidth <= 480;
  const tablet = viewportWidth <= 768;
  const portraitTablet = viewportWidth > 768 && viewportWidth <= 900;

  let spawnCols: number;
  if (phone) {
    spawnCols = 2;
  } else if (portraitTablet) {
    spawnCols = 3;
  } else if (compact) {
    spawnCols = 4;
  } else {
    spawnCols = 7;
  }

  const edgePad = phone ? 14 : portraitTablet ? 32 : compact ? 24 : 80;
  const colGap = phone ? 12 : compact ? 14 : 20;
  const rowGap = 14;
  const elements = compact
    ? allElements.filter((el) => el.type === 'swatch')
    : allElements;

  const swatchCount = elements.filter((el) => el.type === 'swatch').length;
  const availableWidth = Math.max(viewportWidth - edgePad * 2, 220);
  const targetSwatchWidth = (availableWidth - colGap * (spawnCols - 1)) / spawnCols;

  let scale: number;
  if (compact) {
    scale = targetSwatchWidth / SWATCH_WIDTH;
    if (phone) {
      scale = Math.min(scale, 0.48);
      scale = Math.max(scale, 0.4);
    } else if (tablet) {
      scale = Math.min(scale, 0.54);
      scale = Math.max(scale, 0.44);
    } else {
      scale = Math.min(scale, 0.6);
      scale = Math.max(scale, 0.48);
    }
  } else {
    scale = 1;
    if (viewportWidth < 1400) scale = 0.92;
    if (viewportWidth < 1200) scale = 0.85;
  }

  let sceneHeight: number;
  if (composedLayout) {
    sceneHeight = getComposedSceneHeight(swatchCount, spawnCols, scale, edgePad);
  } else {
    sceneHeight = viewportWidth < 1200 ? 780 : 840;
  }

  const spawnRowGap = phone ? 130 : portraitTablet ? 160 : compact ? 110 : 70;
  const maxSpawnAngle = composedLayout ? 0 : phone ? 0.1 : portraitTablet ? 0.08 : compact ? 0.15 : 0.3;
  const maxRestAngle = composedLayout ? null : null;

  return {
    scale,
    sceneHeight,
    elements,
    spawnCols,
    compact,
    composedLayout,
    portraitTablet,
    spawnRowGap,
    maxSpawnAngle,
    maxRestAngle,
    edgePad,
    colGap,
    rowGap,
  };
}

const PillElement: React.FC<{ content: string; style: React.CSSProperties }> = ({ content, style }) => (
  <div className="gp-pill" style={style}>
    <span>{content}</span>
  </div>
);

const IconElement: React.FC<{ icon: string; style: React.CSSProperties }> = ({ icon, style }) => {
  const iconMap: Record<string, React.ReactNode> = {
    heart: <Heart size={24} weight="fill" color="#7150E5" />,
    star: <Star size={24} weight="fill" color="#F6E067" />,
    sparkle: <Sparkle size={22} weight="fill" color="#FC95B1" />,
    palette: <Palette size={24} weight="fill" color="#5ED0BF" />,
    brush: <PaintBrush size={24} weight="fill" color="#618eb6" />,
    ruler: <Ruler size={24} weight="fill" color="#c25a35" />,
    compass: <Compass size={24} weight="fill" color="#060591" />,
    pencil: <PencilSimple size={24} weight="fill" color="#d7263d" />,
  };

  return (
    <div className="gp-icon" style={style}>
      {iconMap[icon]}
    </div>
  );
};

const TextElement: React.FC<{ content: string; style: React.CSSProperties }> = ({ content, style }) => (
  <div className="gp-text" style={style}>
    <span>{content}</span>
  </div>
);

/** Scale factor so swatch cards and small elements fit smaller viewports */
function getInitialLayoutConfig(): LayoutConfig {
  if (typeof window === 'undefined') {
    return getLayoutConfig(1200);
  }
  return getLayoutConfig(window.innerWidth);
}

export const GravityPlayground: React.FC = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const bodiesRef = useRef<Map<string, Matter.Body>>(new Map());
  const elementNodesRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const rafRef = useRef<number>();
  const initializedRef = useRef(false);
  const dragConstraintRef = useRef<Matter.Constraint | null>(null);
  const dragBodyRef = useRef<Matter.Body | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasStartedRef = useRef(false);
  const [layoutConfig, setLayoutConfig] = useState<LayoutConfig>(() => getInitialLayoutConfig());
  const [layoutRevision, setLayoutRevision] = useState(0);
  const layoutConfigRef = useRef(layoutConfig);
  layoutConfigRef.current = layoutConfig;
  const [flippedSwatchIds, setFlippedSwatchIds] = useState<Set<string>>(new Set());
  const [activeSwatchId, setActiveSwatchId] = useState<string | null>(null);
  const activeSwatchIdRef = useRef<string | null>(null);
  activeSwatchIdRef.current = activeSwatchId;
  const elementByIdRef = useRef<Map<string, PhysicsElement>>(new Map());
  const composedSlotsRef = useRef<Map<string, ComposedSlot>>(new Map());
  const composedSettlingRef = useRef(false);

  const updateElementNode = (id: string, body: Matter.Body, scale: number) => {
    const node = elementNodesRef.current.get(id);
    const el = elementByIdRef.current.get(id);
    if (!node || !el) return;

    const isDragging = dragBodyRef.current === body;
    const isActive = activeSwatchIdRef.current === id;
    const snap = body.isSleeping && !isDragging;
    const x = snap ? Math.round(body.position.x) : body.position.x;
    const y = snap ? Math.round(body.position.y) : body.position.y;
    const renderWidth = el.width * scale;
    const renderHeight = el.height * scale;
    const visualAngle = isActive && el.type === 'swatch' ? 0 : snap ? Math.round(body.angle * 1000) / 1000 : body.angle;
    const liftY = isActive && el.type === 'swatch' ? 24 * scale : 0;

    node.style.width = `${renderWidth}px`;
    node.style.height = `${renderHeight}px`;
    node.style.zIndex = isActive ? '220' : '';
    node.style.opacity = '1';
    node.style.transform = `translate(${x - renderWidth / 2}px, ${y - renderHeight / 2 - liftY}px) rotate(${visualAngle}rad)`;
  };

  const setSwatchStatic = (swatchId: string, shouldBeStatic: boolean) => {
    const body = bodiesRef.current.get(swatchId);
    if (!body) return;
    Matter.Body.setStatic(body, shouldBeStatic);
    if (shouldBeStatic) {
      Matter.Body.setVelocity(body, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(body, 0);
      Matter.Body.setAngle(body, 0);
    }
  };

  const focusAndFlipSwatch = (swatchId: string) => {
    setActiveSwatchId((prevActive) => {
      const isClosingCurrent = prevActive === swatchId;

      if (prevActive && prevActive !== swatchId) {
        setSwatchStatic(prevActive, false);
      }

      if (isClosingCurrent) {
        setSwatchStatic(swatchId, false);
        setFlippedSwatchIds(new Set());
        return null;
      }

      setSwatchStatic(swatchId, true);
      setFlippedSwatchIds(new Set([swatchId]));
      return swatchId;
    });
  };

  // Recompute layout on resize/orientation and reinit physics when it changes materially
  useEffect(() => {
    let timeoutId: number | undefined;

    const handleLayoutChange = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        const sceneWidth = sceneRef.current?.offsetWidth ?? window.innerWidth;
        const next = getLayoutConfig(sceneWidth);
        const prev = layoutConfigRef.current;

        const layoutChanged =
          Math.abs(next.scale - prev.scale) > 0.03 ||
          next.sceneHeight !== prev.sceneHeight ||
          next.elements.length !== prev.elements.length ||
          next.spawnCols !== prev.spawnCols ||
          next.compact !== prev.compact ||
          next.composedLayout !== prev.composedLayout ||
          next.portraitTablet !== prev.portraitTablet;

        if (!layoutChanged) return;

        layoutConfigRef.current = next;
        setLayoutConfig(next);
        setLayoutRevision((revision) => revision + 1);
        setActiveSwatchId(null);
        setFlippedSwatchIds(new Set());
      }, 200);
    };

    window.addEventListener('resize', handleLayoutChange);
    window.addEventListener('orientationchange', handleLayoutChange);
    return () => {
      window.clearTimeout(timeoutId);
      window.removeEventListener('resize', handleLayoutChange);
      window.removeEventListener('orientationchange', handleLayoutChange);
    };
  }, []);

  // Intersection Observer for visibility detection
  useEffect(() => {
    if (!sceneRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStartedRef.current) {
            hasStartedRef.current = true;
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(sceneRef.current);
    return () => observer.disconnect();
  }, []);

  // Initialize physics ONLY when visible (re-runs when layout changes on resize)
  useEffect(() => {
    if (!sceneRef.current || !isVisible || initializedRef.current) return;
    initializedRef.current = true;

    const scene = sceneRef.current;
    const {
      scale,
      sceneHeight,
      elements,
      spawnCols,
      compact,
      composedLayout,
      portraitTablet,
      spawnRowGap,
      maxSpawnAngle,
      maxRestAngle,
      edgePad,
    } = layoutConfigRef.current;
    scene.style.height = `${sceneHeight}px`;

    const width = scene.offsetWidth || window.innerWidth;
    const height = sceneHeight;
    const phone = width <= 480;

    elementByIdRef.current = new Map(elements.map((el) => [el.id, el]));

    const swatchIds = elements.filter((el) => el.type === 'swatch').map((el) => el.id);
    const composedSlots = composedLayout
      ? computeComposedSlots(width, height, swatchIds, scale, spawnCols, edgePad)
      : new Map<string, ComposedSlot>();
    composedSlotsRef.current = composedSlots;
    composedSettlingRef.current = composedLayout;

    // Create engine with gravity
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: composedLayout ? 0 : phone ? 0.52 : portraitTablet ? 0.58 : compact ? 0.66 : 0.85, scale: 0.001 },
      enableSleeping: true,
    });
    engineRef.current = engine;

    // Create walls - NO top wall so elements fall from above
    const wallThickness = 100;
    const wallOpts = { isStatic: true, render: { visible: false }, friction: 0.6, restitution: 0.1 };
    const walls = [
      // Bottom wall
      Matter.Bodies.rectangle(width / 2, height + wallThickness / 2, width * 2, wallThickness, wallOpts),
      // Left wall - extended high
      Matter.Bodies.rectangle(-wallThickness / 2, 0, wallThickness, height * 6, wallOpts),
      // Right wall - extended high
      Matter.Bodies.rectangle(width + wallThickness / 2, 0, wallThickness, height * 6, wallOpts),
      // NO top wall
    ];

    const allBodies: Matter.Body[] = [...walls];
    const bodiesMap = new Map<string, Matter.Body>();

    const swatchCount = elements.filter((el) => el.type === 'swatch').length;
    const swatchCols = Math.max(2, Math.min(spawnCols, swatchCount));
    const usableWidth = width - edgePad * 2;
    const swatchColWidth = usableWidth / swatchCols;
    let swatchIndex = 0;
    const dropDistance = composedLayout ? 220 : 0;

    elements.forEach((el) => {
      let x: number;
      let y: number;
      let angle: number;

      if (composedLayout && el.type === 'swatch') {
        const slot = composedSlots.get(el.id);
        const slotIndex = swatchIds.indexOf(el.id);
        x = slot?.x ?? width / 2;
        y = (slot?.y ?? height / 2) - dropDistance - (slotIndex % spawnCols) * 34;
        angle = 0;
        swatchIndex += 1;
      } else if (el.type === 'swatch') {
        const col = swatchIndex % swatchCols;
        const row = Math.floor(swatchIndex / swatchCols);
        swatchIndex += 1;
        const rowStagger = portraitTablet && row % 2 === 1 ? swatchColWidth * 0.5 : 0;
        x =
          edgePad +
          col * swatchColWidth +
          swatchColWidth / 2 +
          rowStagger +
          (Math.random() - 0.5) * swatchColWidth * 0.12;
        y = -140 - row * spawnRowGap - Math.random() * (compact ? 70 : 180);
        angle = maxSpawnAngle === 0 ? 0 : (Math.random() - 0.5) * maxSpawnAngle * 2;
      } else {
        x = edgePad + Math.random() * usableWidth;
        y = -80 - Math.random() * (compact ? 420 : 620);
        angle = maxSpawnAngle === 0 ? 0 : (Math.random() - 0.5) * maxSpawnAngle * 2;
      }

      const bodyWidth = el.width * scale;
      const bodyHeight = el.height * scale;

      // Different chamfer radius based on element type
      let radius = 12 * scale;
      if (el.type === 'pill') radius = bodyHeight / 2;
      else if (el.type === 'swatch') radius = 10 * scale;
      else if (el.type === 'icon') radius = 14 * scale;

      const body = Matter.Bodies.rectangle(x, y, bodyWidth, bodyHeight, {
        chamfer: { radius },
        friction: compact ? 0.72 : 0.65,
        frictionAir: phone ? 0.058 : portraitTablet ? 0.048 : compact ? 0.044 : 0.032,
        restitution: phone ? 0.04 : portraitTablet ? 0.06 : compact ? 0.08 : 0.14,
        angle,
        label: el.id,
        sleepThreshold: phone ? 28 : 40,
        collisionFilter: composedLayout && el.type === 'swatch'
          ? { group: -1 }
          : undefined,
      });

      if (composedLayout && el.type === 'swatch') {
        Matter.Body.setInertia(body, Infinity);
      }

      allBodies.push(body);
      bodiesMap.set(el.id, body);
    });

    bodiesRef.current = bodiesMap;

    Matter.Composite.add(engine.world, allBodies);

    // Custom mouse/touch handling
    const getMousePos = (e: MouseEvent | Touch): { x: number; y: number } => {
      const rect = scene.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const findBodyAtPoint = (point: { x: number; y: number }): Matter.Body | null => {
      const bodies = Matter.Composite.allBodies(engine.world);
      for (const body of bodies) {
        if (body.isStatic) continue;
        if (Matter.Bounds.contains(body.bounds, point)) {
          if (Matter.Vertices.contains(body.vertices, point)) {
            return body;
          }
        }
      }
      return null;
    };

    /** Footer / info buttons — must not run preventDefault or drag or clicks break (flip only via these controls). */
    const isSwatchControlTarget = (target: EventTarget | null): boolean => {
      if (!(target instanceof Element)) return false;
      return Boolean(
        target.closest('.gp-swatch button') || target.closest('.gp-swatch__back-scroll'),
      );
    };

    // Create a static point body for dragging
    const dragPoint = Matter.Bodies.circle(0, 0, 1, { isStatic: true, render: { visible: false } });
    Matter.Composite.add(engine.world, dragPoint);

    const handleStart = (e: MouseEvent | TouchEvent) => {
      const rawTarget =
        'touches' in e && e.touches.length > 0 ? e.touches[0].target : (e as MouseEvent).target;
      if (isSwatchControlTarget(rawTarget)) {
        return;
      }

      e.preventDefault();
      const point = e instanceof MouseEvent ? getMousePos(e) : getMousePos(e.touches[0]);
      const body = findBodyAtPoint(point);

      if (body) {
        dragBodyRef.current = body;
        Matter.Body.setPosition(dragPoint, point);

        const constraint = Matter.Constraint.create({
          bodyA: dragPoint,
          bodyB: body,
          pointB: {
            x: point.x - body.position.x,
            y: point.y - body.position.y
          },
          stiffness: 0.18,
          damping: 0.22,
          length: 0,
        });

        dragConstraintRef.current = constraint;
        Matter.Composite.add(engine.world, constraint);
        scene.style.cursor = 'grabbing';
      }
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!dragConstraintRef.current) return;
      e.preventDefault();
      const point = e instanceof MouseEvent ? getMousePos(e) : getMousePos(e.touches[0]);
      Matter.Body.setPosition(dragPoint, point);
    };

    const handleEnd = () => {
      if (dragConstraintRef.current) {
        Matter.Composite.remove(engine.world, dragConstraintRef.current);
        dragConstraintRef.current = null;
        dragBodyRef.current = null;
        scene.style.cursor = 'grab';
      }
    };

    scene.addEventListener('mousedown', handleStart);
    scene.addEventListener('mousemove', handleMove);
    scene.addEventListener('mouseup', () => handleEnd());
    scene.addEventListener('mouseleave', () => handleEnd());
    scene.addEventListener('touchstart', handleStart, { passive: false });
    scene.addEventListener('touchmove', handleMove, { passive: false });
    scene.addEventListener('touchend', () => handleEnd());

    // Keep a small visual safe zone so rotated cards/shadows do not appear clipped.
    const EDGE_PADDING = compact ? 28 : 20;

    const clampBodyToScene = (body: Matter.Body) => {
      if (body.isStatic || body.isSleeping) return;

      const boundsWidth = body.bounds.max.x - body.bounds.min.x;
      const boundsHeight = body.bounds.max.y - body.bounds.min.y;
      const halfBoundsWidth = boundsWidth / 2;
      const halfBoundsHeight = boundsHeight / 2;

      const minX = halfBoundsWidth + EDGE_PADDING;
      const maxX = width - halfBoundsWidth - EDGE_PADDING;
      const minY = halfBoundsHeight + EDGE_PADDING;
      const maxY = height - halfBoundsHeight - EDGE_PADDING;

      let nextX = body.position.x;
      let nextY = body.position.y;
      let nextVx = body.velocity.x;
      let nextVy = body.velocity.y;

      if (nextX < minX) {
        nextX = minX;
        nextVx = Math.abs(nextVx) * 0.2;
      } else if (nextX > maxX) {
        nextX = maxX;
        nextVx = -Math.abs(nextVx) * 0.2;
      }

      // Allow natural entry from above; once a body reaches the scene, keep it fully in view.
      if (nextY > -halfBoundsHeight && nextY < minY) {
        nextY = minY;
        nextVy = Math.abs(nextVy) * 0.2;
      } else if (nextY > maxY) {
        nextY = maxY;
        nextVy = -Math.abs(nextVy) * 0.2;
      }

      const movedEnough = Math.abs(nextX - body.position.x) > 0.5 || Math.abs(nextY - body.position.y) > 0.5;
      if (movedEnough) {
        Matter.Body.setPosition(body, { x: nextX, y: nextY });
        Matter.Body.setVelocity(body, { x: nextVx, y: nextVy });
      }
    };

    // Run engine
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    const settleComposedBody = (body: Matter.Body, slot: ComposedSlot) => {
      const dx = slot.x - body.position.x;
      const dy = slot.y - body.position.y;
      const distance = Math.hypot(dx, dy);
      const angleDelta = slot.angle - body.angle;

      if (distance < 0.75 && Math.abs(angleDelta) < 0.01) {
        Matter.Body.setPosition(body, { x: slot.x, y: slot.y });
        Matter.Body.setAngle(body, slot.angle);
        Matter.Body.setVelocity(body, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(body, 0);
        Matter.Sleeping.set(body, true);
        return true;
      }

      const ease = distance > 80 ? 0.14 : 0.1;
      Matter.Body.setPosition(body, {
        x: body.position.x + dx * ease,
        y: body.position.y + dy * ease,
      });
      Matter.Body.setAngle(body, body.angle + angleDelta * ease);
      Matter.Body.setVelocity(body, { x: 0, y: 0 });
      Matter.Body.setAngularVelocity(body, 0);
      return false;
    };

    // Update transforms directly on DOM nodes (avoids React re-render jank on mobile)
    const tick = () => {
      let allSettled = true;

      bodiesRef.current.forEach((body, id) => {
        const el = elementByIdRef.current.get(id);
        const isDragging = dragBodyRef.current === body;
        const slot = composedSlotsRef.current.get(id);

        if (composedSettlingRef.current && slot && !isDragging && !body.isStatic) {
          const settled = settleComposedBody(body, slot);
          if (!settled) allSettled = false;
        } else if (!composedLayout) {
          clampBodyToScene(body);

          if (
            maxRestAngle &&
            el?.type === 'swatch' &&
            body.isSleeping &&
            !isDragging &&
            Math.abs(body.angle) > maxRestAngle
          ) {
            Matter.Body.setAngle(body, Math.sign(body.angle) * maxRestAngle);
            Matter.Body.setAngularVelocity(body, 0);
          }
        } else if (composedLayout && !isDragging && !body.isStatic) {
          clampBodyToScene(body);
        }

        updateElementNode(id, body, scale);
      });

      if (composedSettlingRef.current && allSettled) {
        composedSettlingRef.current = false;
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      scene.removeEventListener('mousedown', handleStart);
      scene.removeEventListener('mousemove', handleMove);
      scene.removeEventListener('mouseup', handleEnd);
      scene.removeEventListener('mouseleave', handleEnd);
      scene.removeEventListener('touchstart', handleStart);
      scene.removeEventListener('touchmove', handleMove);
      scene.removeEventListener('touchend', handleEnd);
      if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      if (engineRef.current) Matter.Engine.clear(engineRef.current);
      initializedRef.current = false;
    };
  }, [isVisible, layoutRevision]);

  // Re-sync active swatch lift / rotation when flip state changes
  useEffect(() => {
    const { scale } = layoutConfigRef.current;
    bodiesRef.current.forEach((body, id) => {
      updateElementNode(id, body, scale);
    });
  }, [activeSwatchId, flippedSwatchIds]);

  const { scale: layoutScale, elements: visibleElements, sceneHeight } = layoutConfig;

  const registerElementNode = (id: string, node: HTMLDivElement | null) => {
    if (node) {
      elementNodesRef.current.set(id, node);
    } else {
      elementNodesRef.current.delete(id);
    }
  };

  const renderElement = (el: PhysicsElement) => {
    const renderWidth = el.width * layoutScale;
    const renderHeight = el.height * layoutScale;
    const isActive = activeSwatchId === el.id;
    const isFlipped = el.type === 'swatch' && flippedSwatchIds.has(el.id);

    const wrapperStyle: React.CSSProperties = {
      width: renderWidth,
      height: renderHeight,
      zIndex: isActive ? 220 : undefined,
    };

    const innerContent = (() => {
      switch (el.type) {
        case 'swatch': {
          const mood = swatchMoodById.get(el.id);
          if (!mood) return null;
          return (
            <SwatchCard
              id={el.id}
              color={el.color!}
              hex={el.hex!}
              name={el.name!}
              mood={mood}
              isFlipped={isFlipped}
              onToggle={() => focusAndFlipSwatch(el.id)}
              className={isActive ? 'gp-swatch--active' : undefined}
              style={{ position: 'relative', width: '100%', height: '100%', top: 'auto', left: 'auto', transform: 'none' }}
            />
          );
        }
        case 'pill':
          return <PillElement content={el.content!} style={{ position: 'relative', width: '100%', height: '100%', top: 'auto', left: 'auto', transform: 'none' }} />;
        case 'icon':
          return <IconElement icon={el.icon!} style={{ position: 'relative', width: '100%', height: '100%', top: 'auto', left: 'auto', transform: 'none' }} />;
        case 'text':
          return <TextElement content={el.content!} style={{ position: 'relative', width: '100%', height: '100%', top: 'auto', left: 'auto', transform: 'none' }} />;
        default:
          return null;
      }
    })();

    if (!innerContent) return null;

    return (
      <div
        key={el.id}
        ref={(node) => registerElementNode(el.id, node)}
        className="gp-element"
        data-gp-id={el.id}
        style={wrapperStyle}
      >
        {innerContent}
      </div>
    );
  };

  return (
    <div
      className={`gravity-playground__scene${layoutConfig.composedLayout ? ' gravity-playground__scene--composed' : ''}`}
      ref={sceneRef}
      style={{ height: sceneHeight }}
    >
      <div
        className="gravity-playground__scene-inner"
        style={{ '--gp-scale': layoutScale } as React.CSSProperties}
      >
        {visibleElements.map(renderElement)}
      </div>
    </div>
  );
};


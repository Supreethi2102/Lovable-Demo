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
};

function getLayoutConfig(viewportWidth: number): LayoutConfig {
  const compact = viewportWidth <= 1024;
  const phone = viewportWidth <= 480;
  const tablet = viewportWidth <= 768;

  let scale = 1;
  if (viewportWidth < 1400) scale = 0.92;
  if (viewportWidth < 1200) scale = 0.85;
  if (compact) scale = Math.max(0.56, viewportWidth / 1280);
  if (tablet) scale = Math.max(0.5, viewportWidth / 1180);
  if (phone) scale = Math.max(0.44, viewportWidth / 960);

  const elements = compact
    ? allElements.filter((el) => el.type === 'swatch')
    : allElements;

  const sceneHeight = phone
    ? 620
    : tablet
      ? 680
      : compact
        ? 740
        : viewportWidth < 1200
          ? 780
          : 840;

  const spawnCols = phone ? 4 : compact ? 5 : 7;

  return { scale, sceneHeight, elements, spawnCols, compact };
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
  const [positions, setPositions] = useState<Map<string, { x: number; y: number; angle: number }>>(new Map());
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
  const positionsRef = useRef<Map<string, { x: number; y: number; angle: number }>>(new Map());

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
        const next = getLayoutConfig(window.innerWidth);
        const prev = layoutConfigRef.current;

        const layoutChanged =
          Math.abs(next.scale - prev.scale) > 0.035 ||
          next.sceneHeight !== prev.sceneHeight ||
          next.elements.length !== prev.elements.length ||
          next.spawnCols !== prev.spawnCols ||
          next.compact !== prev.compact;

        if (!layoutChanged) return;

        layoutConfigRef.current = next;
        setLayoutConfig(next);
        setLayoutRevision((revision) => revision + 1);
        setActiveSwatchId(null);
        setFlippedSwatchIds(new Set());
      }, 160);
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
    const { scale, sceneHeight, elements, spawnCols, compact } = layoutConfigRef.current;
    scene.style.height = `${sceneHeight}px`;

    const width = scene.offsetWidth || 1000;
    const height = sceneHeight;

    // Create engine with gravity
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: compact ? 0.72 : 0.85, scale: 0.001 },
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
    const initialPos = new Map<string, { x: number; y: number; angle: number }>();

    const edgePad = compact ? 48 : 80;

    // Position elements above the scene - spread by column so they don't land in one pile
    elements.forEach((el, i) => {
      const cols = Math.max(2, Math.min(spawnCols, elements.length));
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x =
        edgePad +
        col * ((width - edgePad * 2) / Math.max(cols - 1, 1)) +
        (Math.random() - 0.5) * (compact ? 24 : 60);
      const y = -120 - row * (compact ? 90 : 70) - Math.random() * (compact ? 180 : 600);
      const angle = compact ? (Math.random() - 0.5) * 0.12 : (Math.random() - 0.5) * 0.3;

      const bodyWidth = el.width * scale;
      const bodyHeight = el.height * scale;

      // Different chamfer radius based on element type
      let radius = 12 * scale;
      if (el.type === 'pill') radius = bodyHeight / 2;
      else if (el.type === 'swatch') radius = 10 * scale;
      else if (el.type === 'icon') radius = 14 * scale;

      const body = Matter.Bodies.rectangle(x, y, bodyWidth, bodyHeight, {
        chamfer: { radius },
        friction: 0.65,
        frictionAir: compact ? 0.038 : 0.032,
        restitution: compact ? 0.1 : 0.14,
        angle,
        label: el.id,
        sleepThreshold: 40,
      });

      allBodies.push(body);
      bodiesMap.set(el.id, body);
      initialPos.set(el.id, { x, y, angle });
    });

    bodiesRef.current = bodiesMap;
    positionsRef.current = initialPos;
    setPositions(initialPos);

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

    // Update positions
    const tick = () => {
      let changed = false;
      const nextPos = new Map<string, { x: number; y: number; angle: number }>(positionsRef.current);

      bodiesRef.current.forEach((body, id) => {
        clampBodyToScene(body);

        const isDragging = dragBodyRef.current === body;
        const snap = body.isSleeping && !isDragging;
        const x = snap ? Math.round(body.position.x) : body.position.x;
        const y = snap ? Math.round(body.position.y) : body.position.y;
        const angle = snap ? Math.round(body.angle * 1000) / 1000 : body.angle;

        const prev = nextPos.get(id);
        if (!prev || prev.x !== x || prev.y !== y || prev.angle !== angle) {
          nextPos.set(id, { x, y, angle });
          changed = true;
        }
      });

      if (changed) {
        positionsRef.current = nextPos;
        setPositions(new Map(nextPos));
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

  const { scale: layoutScale, elements: visibleElements, sceneHeight } = layoutConfig;

  const renderElement = (el: PhysicsElement) => {
    const pos = positions.get(el.id);
    const x = pos?.x ?? 100;
    const y = pos?.y ?? 100;
    const angle = pos?.angle ?? 0;
    const isActive = activeSwatchId === el.id;
    const isFlipped = el.type === 'swatch' && flippedSwatchIds.has(el.id);
    const visualAngle = isActive && el.type === 'swatch' ? 0 : angle;
    const liftY = isActive && el.type === 'swatch' ? 24 * layoutScale : 0;
    const renderWidth = el.width * layoutScale;
    const renderHeight = el.height * layoutScale;

    const style: React.CSSProperties = {
      transform: `translate(${x - renderWidth / 2}px, ${y - renderHeight / 2 - liftY}px) rotate(${visualAngle}rad)`,
      width: renderWidth,
      height: renderHeight,
      zIndex: isActive ? 220 : undefined,
    };

    switch (el.type) {
      case 'swatch': {
        const mood = swatchMoodById.get(el.id);
        if (!mood) return null;
        return (
          <SwatchCard
            key={el.id}
            id={el.id}
            color={el.color!}
            hex={el.hex!}
            name={el.name!}
            mood={mood}
            isFlipped={isFlipped}
            onToggle={() => focusAndFlipSwatch(el.id)}
            style={style}
            className={isActive ? 'gp-swatch--active' : undefined}
          />
        );
      }
      case 'pill':
        return <PillElement key={el.id} content={el.content!} style={style} />;
      case 'icon':
        return <IconElement key={el.id} icon={el.icon!} style={style} />;
      case 'text':
        return <TextElement key={el.id} content={el.content!} style={style} />;
      default:
        return null;
    }
  };

  return (
    <div
      className="gravity-playground__scene"
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


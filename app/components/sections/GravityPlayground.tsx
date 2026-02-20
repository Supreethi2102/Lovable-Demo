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
  PencilSimple,
  Info
} from '@phosphor-icons/react';
import './GravityPlayground.css';

// Swatch cards (exact same as original, scaled to 90%)
const swatchCards = [
  { id: 'swatch-nympheas', name: 'Nymphéas Blue', hex: '#5A87E8', color: '#618eb6' },
  { id: 'swatch-gaudi', name: 'Gaudí Cathedral Blue', hex: '#060591', color: '#060591' },
  { id: 'swatch-flamingo', name: 'Sunlit Flamingo Pink', hex: '#FC95B1', color: '#fc95b1' },
  { id: 'swatch-orange', name: 'Studio Orange', hex: '#C25A35', color: '#c25a35' },
  { id: 'swatch-turquoise', name: 'Gilded Turquoise', hex: '#5ED0BF', color: '#5ed0bf' },
  { id: 'swatch-yellow', name: 'Paradise Tipani Yellow', hex: '#F6E067', color: '#f6e067' },
  { id: 'swatch-red', name: 'Royal Red', hex: '#D7263D', color: '#d7263d' },
  { id: 'swatch-teal', name: 'Sunshade Teal', hex: '#188974', color: '#188974' },
];

// Skill pills
const skillPills = [
  { id: 'pill-ux', content: 'UX Design', width: 130, height: 48 },
  { id: 'pill-ui', content: 'UI Design', width: 120, height: 48 },
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
  { id: 'text-nz', content: 'NZ Based', width: 110, height: 50 },
  { id: 'text-pixels', content: 'Pixels & Places', width: 150, height: 50 },
  { id: 'text-bold', content: 'Bold', width: 80, height: 50 },
  { id: 'text-human', content: 'Human-Centred', width: 160, height: 50 },
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

// Render components - Swatch card matching original design (100% size)
const SwatchElement: React.FC<{ color: string; hex: string; name: string; style: React.CSSProperties }> = ({ color, hex, name, style }) => (
  <div className="gp-swatch" style={style}>
    <div className="gp-swatch__inner">
      <div className="gp-swatch__color" style={{ backgroundColor: color }} />
      <div className="gp-swatch__content">
        <div className="gp-swatch__text">
          <p className="gp-swatch__name">{name}</p>
          <div className="gp-swatch__hex-row">
            <span className="gp-swatch__hex">{hex}</span>
            <Info size={16} weight="regular" color="#7150E5" className="gp-swatch__info-icon" />
          </div>
        </div>
        <span className="gp-swatch__link">View colour mood</span>
      </div>
    </div>
  </div>
);

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

  // Initialize physics ONLY when visible
  useEffect(() => {
    if (!sceneRef.current || !isVisible || initializedRef.current) return;
    initializedRef.current = true;

    const scene = sceneRef.current;
    const width = scene.offsetWidth || 1000;
    const height = scene.offsetHeight || 500;

    // Create engine with gravity
    const engine = Matter.Engine.create({
      gravity: { x: 0, y: 0.8, scale: 0.001 }
    });
    engineRef.current = engine;

    // Create walls - NO top wall so elements fall from above
    const wallThickness = 100;
    const wallOpts = { isStatic: true, render: { visible: false }, friction: 0.3, restitution: 0.6 };
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

    // Position elements ABOVE the scene - they will fall down in mixed order
    allElements.forEach((el, i) => {
      const cols = 7;
      const col = i % cols;
      
      // Spread across width
      const x = 100 + col * (width - 200) / (cols - 1) + (Math.random() - 0.5) * 60;
      // RANDOM starting height for ALL elements - creates mixed falling order
      const y = -150 - Math.random() * 600;
      const angle = (Math.random() - 0.5) * 0.3;

      // Different chamfer radius based on element type
      let radius = 12;
      if (el.type === 'pill') radius = el.height / 2;
      else if (el.type === 'swatch') radius = 10;
      else if (el.type === 'icon') radius = 14;
      
      const body = Matter.Bodies.rectangle(x, y, el.width, el.height, {
        chamfer: { radius },
        friction: 0.4,
        frictionAir: 0.015,
        restitution: 0.5,
        angle,
        label: el.id,
      });

      allBodies.push(body);
      bodiesMap.set(el.id, body);
      initialPos.set(el.id, { x, y, angle });
    });

    bodiesRef.current = bodiesMap;
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

    // Create a static point body for dragging
    const dragPoint = Matter.Bodies.circle(0, 0, 1, { isStatic: true, render: { visible: false } });
    Matter.Composite.add(engine.world, dragPoint);

    const handleStart = (e: MouseEvent | TouchEvent) => {
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
          stiffness: 0.1,
          damping: 0.3,
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
    scene.addEventListener('mouseup', handleEnd);
    scene.addEventListener('mouseleave', handleEnd);
    scene.addEventListener('touchstart', handleStart, { passive: false });
    scene.addEventListener('touchmove', handleMove, { passive: false });
    scene.addEventListener('touchend', handleEnd);

    // Run engine
    const runner = Matter.Runner.create();
    runnerRef.current = runner;
    Matter.Runner.run(runner, engine);

    // Update positions
    const tick = () => {
      const newPos = new Map<string, { x: number; y: number; angle: number }>();
      bodiesRef.current.forEach((body, id) => {
        newPos.set(id, { x: body.position.x, y: body.position.y, angle: body.angle });
      });
      setPositions(newPos);
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
  }, [isVisible]);

  const renderElement = (el: PhysicsElement) => {
    const pos = positions.get(el.id);
    const x = pos?.x ?? 100;
    const y = pos?.y ?? 100;
    const angle = pos?.angle ?? 0;

    const style: React.CSSProperties = {
      transform: `translate(${x - el.width / 2}px, ${y - el.height / 2}px) rotate(${angle}rad)`,
      width: el.width,
      height: el.height,
    };

    switch (el.type) {
      case 'swatch':
        return <SwatchElement key={el.id} color={el.color!} hex={el.hex!} name={el.name!} style={style} />;
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
    <div className="gravity-playground__scene" ref={sceneRef}>
      {allElements.map(renderElement)}
    </div>
  );
};


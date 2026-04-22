import React, { useState, useId, useRef, useEffect } from 'react';
import { PaperPlaneTilt, CheckCircle, WarningCircle } from '@phosphor-icons/react';
import { gsap } from 'gsap';
// import { toPng } from 'html-to-image'; // Legacy snapshot-fold experiment (kept for future)
import emailjs from '@emailjs/browser';
import { emailjsConfig } from '../../config/emailjs';
import './Contact.css';

// Character limit for message field
const MESSAGE_MAX_LENGTH = 2000;
// Submission mode:
// - Validation ON: require user to fill fields before sending
// - EmailJS ON: actually send the email
const ENABLE_FORM_VALIDATION = true;
const ENABLE_EMAILJS = true;

/** Figma tablet / phone composites – use BASE_URL for correct absolute paths in production */
const CONTACT_ART_TABLET = `${import.meta.env.BASE_URL}contact/tablet-composite.png`;
const CONTACT_ART_PHONE = `${import.meta.env.BASE_URL}contact/phone-composite.png`;

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSendHovered, setIsSendHovered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [cardKey, setCardKey] = useState(0); // Track which card is active
  const [activeSlot, setActiveSlot] = useState<0 | 1>(0);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  // Postcard animation: which of the two postcards is currently "front"
  const [postcardFrontSlot, setPostcardFrontSlot] = useState<0 | 1>(0);
  
  // Refs for GSAP animations
  const wrapperRef = useRef<HTMLElement>(null);
  const cardARef = useRef<HTMLDivElement>(null);
  const cardBRef = useRef<HTMLDivElement>(null);
  const sentOverlayRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  
  // Generate unique IDs for form fields
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const nameErrorId = useId();
  const emailErrorId = useId();
  const messageErrorId = useId();
  const messageCharCountId = useId();
  const statusAnnouncementRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' && 
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ensure initial state is correct on mount
  useEffect(() => {
    const a = cardARef.current;
    const b = cardBRef.current;
    if (!a || !b) return;

    // Initial: A is active, B is hidden (next)
    gsap.set(a, {
      clearProps: 'all',
      x: 0,
      y: 0,
      opacity: 1,
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      skewX: 0,
      rotateZ: 0,
      filter: 'none',
      boxShadow: 'none',
      zIndex: 1,
    });
    a.style.display = 'block';
    a.style.pointerEvents = '';

    gsap.set(b, {
      clearProps: 'all',
      x: '-100%',
      y: 0,
      opacity: 1,
      scale: 1,
      scaleX: 1,
      scaleY: 1,
      skewX: 0,
      rotateZ: 0,
      filter: 'none',
      boxShadow: 'none',
      zIndex: 2,
    });
    b.style.display = 'none';

    if (sentOverlayRef.current) {
      gsap.set(sentOverlayRef.current, { autoAlpha: 0, y: 8, scale: 0.98, pointerEvents: 'none' });
    }
  }, []);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateField = (name: string, value: string) => {
    switch (name) {
      case 'name':
        return value.trim().length < 2 ? 'Name must be at least 2 characters' : '';
      case 'email':
        return !validateEmail(value) ? 'Please enter a valid email' : '';
      case 'message':
        if (value.trim().length < 10) {
          return 'Message must be at least 10 characters';
        }
        if (value.length > MESSAGE_MAX_LENGTH) {
          return `Message exceeds the maximum length of ${MESSAGE_MAX_LENGTH} characters`;
        }
        return '';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (showValidationErrors) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    // Do NOT show validation errors on blur.
    // Errors should appear only after the user tries to submit.
  };

  // Render contact card content (reusable)
  const renderContactCard = (
    cardFormData: typeof formData,
    cardErrors: typeof errors,
    cardTouched: typeof touched,
    cardIsSubmitting: boolean,
    cardSubmitStatus: typeof submitStatus,
    cardKey: string,
    formDomId: string,
    isActive: boolean
  ) => (
    <div className="contact__card">
      {/* Left Side - Form */}
      <div className="contact__form-side">
        <span className="contact__label">Contact</span>
        <h2 className="contact__title">Say hello from anywhere</h2>
        
        <form 
          id={formDomId}
          className="contact__form" 
          onSubmit={(e) => {
            if (!isActive) {
              e.preventDefault();
              return;
            }
            handleSubmit(e);
          }}
          aria-label="Contact form"
          noValidate
        >
            <div className={`contact__field ${cardErrors.name && cardTouched.name ? 'contact__field--error' : ''}`}>
              <label className="contact__field-label" htmlFor={`${nameId}-${cardKey}`}>
                Name
                <span className="sr-only"> (required)</span>
              </label>
              <input
                type="text"
                id={`${nameId}-${cardKey}`}
                name="name"
                className="contact__input"
                placeholder="e.g. Jane Doe"
                value={cardFormData.name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={cardIsSubmitting}
                aria-required="true"
                aria-invalid={cardErrors.name && cardTouched.name ? 'true' : 'false'}
                aria-describedby={cardErrors.name && cardTouched.name ? `${nameErrorId}-${cardKey}` : undefined}
                autoComplete="name"
              />
              {cardErrors.name && showValidationErrors && (
                <span id={`${nameErrorId}-${cardKey}`} className="contact__error" role="alert">
                  {cardErrors.name}
                </span>
              )}
            </div>

            <div className={`contact__field ${cardErrors.email && cardTouched.email ? 'contact__field--error' : ''}`}>
              <label className="contact__field-label" htmlFor={`${emailId}-${cardKey}`}>
                Email
                <span className="sr-only"> (required)</span>
              </label>
              <input
                type="email"
                id={`${emailId}-${cardKey}`}
                name="email"
                className="contact__input"
                placeholder="e.g. jane@example.com"
                value={cardFormData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={cardIsSubmitting}
                aria-required="true"
                aria-invalid={cardErrors.email && cardTouched.email ? 'true' : 'false'}
                aria-describedby={cardErrors.email && cardTouched.email ? `${emailErrorId}-${cardKey}` : undefined}
                autoComplete="email"
              />
              {cardErrors.email && showValidationErrors && (
                <span id={`${emailErrorId}-${cardKey}`} className="contact__error" role="alert">
                  {cardErrors.email}
                </span>
              )}
            </div>

            <div className={`contact__field ${cardErrors.message && cardTouched.message ? 'contact__field--error' : ''}`}>
              <label className="contact__field-label" htmlFor={`${messageId}-${cardKey}`}>
                Message
                <span className="sr-only"> (required)</span>
              </label>
              <div className="contact__textarea-wrapper">
                <textarea
                  id={`${messageId}-${cardKey}`}
                  name="message"
                  className="contact__textarea"
                  placeholder="e.g. Hi, I'd like to get in touch about..."
                  value={cardFormData.message}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={cardIsSubmitting}
                  maxLength={MESSAGE_MAX_LENGTH}
                  aria-required="true"
                  aria-invalid={cardErrors.message && cardTouched.message ? 'true' : 'false'}
                  aria-describedby={[`${messageCharCountId}-${cardKey}`, cardErrors.message && cardTouched.message ? `${messageErrorId}-${cardKey}` : null].filter(Boolean).join(' ') || undefined}
                />
              </div>
              <div id={`${messageCharCountId}-${cardKey}`} className="contact__char-count-wrapper" aria-live="polite">
                <span
                  className={`contact__char-count ${
                    cardFormData.message.length > MESSAGE_MAX_LENGTH
                      ? 'contact__char-count--error'
                      : cardFormData.message.length > MESSAGE_MAX_LENGTH * 0.9
                        ? 'contact__char-count--warning'
                        : ''
                  }`}
                >
                  {cardFormData.message.length} / {MESSAGE_MAX_LENGTH}
                  {cardFormData.message.length > MESSAGE_MAX_LENGTH && (
                    <span className="contact__char-count-over"> (over limit)</span>
                  )}
                </span>
              </div>
              {cardErrors.message && showValidationErrors && (
                <span id={`${messageErrorId}-${cardKey}`} className="contact__error" role="alert">
                  {cardErrors.message}
                </span>
              )}
            </div>
          </form>

          {/* Mobile/tablet button - shown only on ≤1024px, sits right below form */}
          <button
            type="submit"
            form={isActive ? formDomId : undefined}
            className={`contact__submit-btn contact__submit-btn--mobile send-message ${cardIsSubmitting ? 'contact__submit-btn--loading' : ''} ${cardSubmitStatus === 'success' ? 'contact__submit-btn--success' : ''}`}
            onMouseEnter={() => setIsSendHovered(true)}
            onMouseLeave={() => setIsSendHovered(false)}
            disabled={!isActive || cardIsSubmitting || isAnimatingRef.current}
            aria-busy={cardIsSubmitting}
            aria-label={
              cardIsSubmitting
                ? 'Sending message...'
                : cardSubmitStatus === 'success'
                  ? 'Message sent successfully'
                  : 'Send message'
            }
          >
            {cardIsSubmitting ? (
              <>
                <span className="contact__spinner" aria-hidden="true" />
                <span>Sending...</span>
              </>
            ) : cardSubmitStatus === 'success' ? (
              <>
                <CheckCircle size={24} weight="fill" color="#F6F7F8" aria-hidden="true" />
                <span>Message sent!</span>
              </>
            ) : (
              <>
                <PaperPlaneTilt size={24} weight={isSendHovered ? 'fill' : 'regular'} color={isSendHovered ? '#F6F7F8' : '#7150E5'} aria-hidden="true" />
                <span>Send message</span>
              </>
            )}
          </button>
      </div>

      {/* Divider */}
      <div className="contact__divider" aria-hidden="true" />

      {/* Right Side - Postcard */}
      <aside className="contact__postcard-side" aria-label="Postcard decoration">
        <div className="contact__postcard-slot">
          <div className="contact__postcard-stack">
            {[0, 1].map((slot) => {
              const isFront = postcardFrontSlot === slot;
              const postcardClass = `contact__postcard ${isFront ? 'contact__postcard--front' : 'contact__postcard--back'}`;

              return (
                <div
                  key={slot}
                  className={postcardClass}
                  data-postcard-slot={slot}
                  aria-hidden={isFront ? 'false' : 'true'}
                >
                  {/* Desktop: separate stamp + address (Figma desktop) */}
                  <div className="contact__postcard-split">
                    <div className="contact__stamp-area">
                      <img
                        src="/about/postage-stamp-textured 2.png"
                        alt=""
                        className="contact__stamp"
                        role="presentation"
                      />
                    </div>
                    <address className="contact__address-area">
                      <img
                        src="/about/postal address 6.png"
                        alt="Contact address: Samantha Smith, 123 Pixel Parade, Design District, Imagination NZ"
                        className="contact__address"
                      />
                    </address>
                  </div>
                  {/* Tablet (≤1024, >480): single composite from Figma / public/contact */}
                  <div className="contact__postcard-composite contact__postcard-composite--tablet">
                    <img
                      src={CONTACT_ART_TABLET}
                      alt="Postage stamp and postal address"
                      className="contact__postcard-composite-img"
                      decoding="async"
                    />
                  </div>
                  {/* Phone (≤480): composite from public/contact */}
                  <div className="contact__postcard-composite contact__postcard-composite--phone">
                    <img
                      src={CONTACT_ART_PHONE}
                      alt="Postage stamp and postal address"
                      className="contact__postcard-composite-img"
                      decoding="async"
                    />
                  </div>
                  {/* Desktop button - hidden on mobile/tablet */}
                  <button
                    type="submit"
                    form={isFront && isActive ? formDomId : undefined}
                    className={`contact__submit-btn contact__submit-btn--desktop send-message ${cardIsSubmitting ? 'contact__submit-btn--loading' : ''} ${cardSubmitStatus === 'success' ? 'contact__submit-btn--success' : ''}`}
                    onMouseEnter={() => setIsSendHovered(true)}
                    onMouseLeave={() => setIsSendHovered(false)}
                    disabled={!isFront || !isActive || cardIsSubmitting || isAnimatingRef.current}
                    tabIndex={!isFront ? -1 : 0}
                    aria-hidden={!isFront}
                    aria-busy={cardIsSubmitting}
                    aria-label={
                      cardIsSubmitting
                        ? 'Sending message...'
                        : cardSubmitStatus === 'success'
                          ? 'Message sent successfully'
                          : 'Send message'
                    }
                  >
                    {cardIsSubmitting ? (
                      <>
                        <span className="contact__spinner" aria-hidden="true" />
                        <span>Sending...</span>
                      </>
                    ) : cardSubmitStatus === 'success' ? (
                      <>
                        <CheckCircle size={24} weight="fill" color="#F6F7F8" aria-hidden="true" />
                        <span>Message sent!</span>
                      </>
                    ) : (
                      <>
                        <PaperPlaneTilt size={24} weight={isSendHovered ? 'fill' : 'regular'} color={isSendHovered ? '#F6F7F8' : '#7150E5'} aria-hidden="true" />
                        <span>Send message</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}

            <div className="contact__sent-box" aria-hidden="true">
              <h3 className="contact__sent-box-title">It’s been sent</h3>
              <p className="contact__sent-box-subtitle">Thanks for reaching out. I’ll get back to you soon.</p>
            </div>
          </div>
        </div>

        {cardSubmitStatus === 'error' && (
          <p className="contact__submit-error" role="alert">
            <WarningCircle size={16} weight="fill" aria-hidden="true" />
            {errorMessage || 'Something went wrong. Please try again.'}
          </p>
        )}
      </aside>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isAnimatingRef.current) return;

    if (ENABLE_FORM_VALIDATION) {
      // Validate all fields
      setShowValidationErrors(true);
      const newErrors: Record<string, string> = {};
      Object.entries(formData).forEach(([key, value]) => {
        const error = validateField(key, String(value));
        if (error) newErrors[key] = error;
      });

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        setTouched({ name: true, email: true, message: true });
        return;
      }
    } else {
      // Testing mode: allow empty submit so we can review animation.
      setShowValidationErrors(false);
      setErrors({});
      setTouched({});
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');
    isAnimatingRef.current = true;

    // Disable pointer events on active card
    const active = activeSlot === 0 ? cardARef.current : cardBRef.current;
    if (active) active.style.pointerEvents = 'none';

    try {
      if (ENABLE_EMAILJS) {
        if (!emailjsConfig.publicKey || !emailjsConfig.serviceId || !emailjsConfig.templateId) {
          console.error('EmailJS is not configured.');
          setSubmitStatus('error');
          setErrorMessage('Email service is not configured.');
          isAnimatingRef.current = false;
          if (active) active.style.pointerEvents = '';
          return;
        }

        if (emailjsConfig.publicKey && emailjsConfig.publicKey !== 'YOUR_PUBLIC_KEY_HERE') {
          emailjs.init(emailjsConfig.publicKey);
        }

        const templateParams = {
          from_name: formData.name.trim(),
          from_email: formData.email.trim(),
          message: formData.message.trim(),
          date: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
        };

        const response = await emailjs.send(
          emailjsConfig.serviceId,
          emailjsConfig.templateId,
          templateParams
        );
        console.log('Email sent successfully:', response);
      } else {
        // Simulate a small delay so the button shows "Sending..." briefly.
        await new Promise((r) => window.setTimeout(r, 250));
      }

      setSubmitStatus('success');
      setErrorMessage('');
      
      // Start GSAP animation
      void animateSectionSlideTransition();
      
    } catch (error: any) {
      console.error('Failed:', error);
      setSubmitStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
      isAnimatingRef.current = false;
      if (active) active.style.pointerEvents = '';
      
      /*
      setSubmitStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
      isAnimatingRef.current = false;
      // If needed: re-enable pointer events on the active card wrapper here.
      */
    } finally {
      setIsSubmitting(false);
    }
  };

  const animateSectionSlideTransition = () => {
    const a = cardARef.current;
    const b = cardBRef.current;
    const overlay = sentOverlayRef.current;
    if (!a || !b || !overlay) return;

    const active = activeSlot === 0 ? a : b;
    const next = activeSlot === 0 ? b : a;

    const activeRect = active.getBoundingClientRect();
    const offscreenX = Math.ceil(window.innerWidth + activeRect.width + 120);

    // Ensure baseline
    gsap.set(overlay, { autoAlpha: 0, y: 8, scale: 0.98, pointerEvents: 'none' });

    next.style.display = 'none';
    gsap.set(next, { x: -offscreenX, opacity: 1 });
    gsap.set(active, { x: 0, opacity: 1 });

    const finalizeSwap = () => {
      // Hide overlay
      gsap.set(overlay, { clearProps: 'all' });

      // Reset old active
      gsap.set(active, { clearProps: 'all', x: 0, opacity: 1 });
      active.style.pointerEvents = '';
      active.style.display = 'none';

      // Clean next
      gsap.set(next, { clearProps: 'all', x: 0, opacity: 1 });
      next.style.display = 'block';
      next.style.pointerEvents = '';

      // Fresh form state + reset statuses
      setFormData({ name: '', email: '', message: '' });
      setTouched({});
      setErrors({});
      setShowValidationErrors(false);
      setSubmitStatus('idle');
      setErrorMessage('');
      setCardKey((k) => k + 1);

      // Promote next to active via state
      setActiveSlot((s) => (s === 0 ? 1 : 0));
      isAnimatingRef.current = false;
    };

    if (prefersReducedMotion) {
      const tl = gsap.timeline({ onComplete: finalizeSwap });
      tl.to(active, { opacity: 0, duration: 0.18, ease: 'power2.out' })
        .to(overlay, { autoAlpha: 1, y: 0, scale: 1, duration: 0.18, ease: 'power2.out' }, 0)
        .set(next, { display: 'block' }, 0.1)
        .fromTo(next, { x: '-12px', opacity: 0 }, { x: 0, opacity: 1, duration: 0.22, ease: 'power2.out' }, 0.1)
        .to(overlay, { autoAlpha: 0, y: 8, scale: 0.98, duration: 0.14, ease: 'power2.out' }, 2.2);
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, onComplete: finalizeSwap });

    // Continuous flow (no pause):
    // - Active card slides out right
    // - Popup fades in quickly and stays readable while the new card comes in
    // - New card slides in from left (overlapping with slide-out)
    tl.to(active, { duration: 0.52, x: offscreenX, opacity: 0.98, ease: 'power2.inOut', force3D: true }, 0);

    tl.to(overlay, { duration: 0.2, autoAlpha: 1, y: 0, scale: 1, ease: 'power2.out' }, 0.06);

    tl.set(next, { display: 'block' }, 0.18);
    tl.fromTo(
      next,
      { x: -offscreenX, opacity: 1 },
      { duration: 0.58, x: 0, opacity: 1, ease: 'power3.out', force3D: true },
      0.18
    );

    // Keep popup visible for reading, but do not block card motion
    tl.to(overlay, { duration: 0.18, autoAlpha: 0, y: 8, scale: 0.98, ease: 'power2.out' }, 3.5);
  };

  // LEGACY (kept for future): postcard-only animation (postcard shoots right, message, new postcard slides in).
  // NOTE: Currently unused; we now animate the entire contact card section.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const animatePostcardTransition = () => {
    const a = cardARef.current;
    const b = cardBRef.current;
    if (!a || !b) return;

    const active = activeSlot === 0 ? a : b;
    const front = active.querySelector<HTMLElement>('.contact__postcard--front');
    const back = active.querySelector<HTMLElement>('.contact__postcard--back');
    const sentBox = active.querySelector<HTMLElement>('.contact__sent-box');
    if (!front || !back || !sentBox) {
      isAnimatingRef.current = false;
      active.style.pointerEvents = '';
      return;
    }

    // Baseline
    gsap.set(front, { x: '0%', rotateZ: 0, opacity: 1, zIndex: 2, clearProps: 'filter' });
    gsap.set(back, { x: '-120%', rotateZ: 0, opacity: 1, zIndex: 1 });
    gsap.set(sentBox, { opacity: 0, y: 8, scale: 0.98 });
    sentBox.setAttribute('aria-hidden', 'true');

    const finalize = () => {
      // Clear inline transform/opacity so class-based layout stays consistent after swap
      gsap.set(front, { clearProps: 'transform,opacity,filter' });
      gsap.set(back, { clearProps: 'transform,opacity,filter' });
      gsap.set(sentBox, { clearProps: 'transform,opacity' });

      // Flip which postcard is in front for the next send
      setPostcardFrontSlot((s) => (s === 0 ? 1 : 0));

      // Fresh form state + reset statuses
      setFormData({ name: '', email: '', message: '' });
      setTouched({});
      setErrors({});
      setShowValidationErrors(false);
      setSubmitStatus('idle');
      setErrorMessage('');
      setCardKey((k) => k + 1);

      isAnimatingRef.current = false;
      active.style.pointerEvents = '';
    };

    if (prefersReducedMotion) {
      const tl = gsap.timeline({ onComplete: finalize });
      tl.to(front, { opacity: 0, duration: 0.2, ease: 'power2.out' })
        .to(back, { x: '0%', duration: 0.25, ease: 'power2.out' }, '<')
        .to(
          sentBox,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.2,
            ease: 'power2.out',
            onStart: () => sentBox.setAttribute('aria-hidden', 'false'),
          },
          '<'
        )
        .to(sentBox, { opacity: 0, duration: 0.15, onComplete: () => sentBox.setAttribute('aria-hidden', 'true') }, '+=0.6');
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: finalize,
    });

    // Postcard shoots/slides off to the right
    tl.to(front, {
      duration: 0.45,
      x: '120%',
      rotateZ: 6,
      opacity: 0,
      force3D: true,
    });

    // Fresh postcard slides in from the left (behind)
    tl.to(
      back,
      {
        duration: 0.5,
        x: '0%',
        ease: 'power3.out',
        force3D: true,
      },
      0.12
    );

    // "Sent" box appears
    tl.to(
      sentBox,
      {
        duration: 0.25,
        opacity: 1,
        y: 0,
        scale: 1,
        onStart: () => sentBox.setAttribute('aria-hidden', 'false'),
      },
      '>-0.18'
    );

    // Brief hold, then fade it away
    tl.to(sentBox, { duration: 0.2, opacity: 0, onComplete: () => sentBox.setAttribute('aria-hidden', 'true') }, '+=0.65');
  };

  // LEGACY ANIMATION (kept for future): paper-fold "rocket" throw of the entire contact card.
  // NOTE: This is intentionally unused while the simpler postcard shoot animation is active.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const animateCardTransition = () => {
    const a = cardARef.current;
    const b = cardBRef.current;
    if (!a || !b) return;

    const active = activeSlot === 0 ? a : b;
    const next = activeSlot === 0 ? b : a;

    // Promote the active card to a viewport-layer element so the "shoot" can
    // fly OUT of the section (not get clipped by `.contact-wrapper` overflow).
    const activeRect = active.getBoundingClientRect();
    active.style.display = 'block';
    active.style.position = 'fixed';
    active.style.top = `${activeRect.top}px`;
    active.style.left = `${activeRect.left}px`;
    active.style.right = 'auto';
    active.style.bottom = 'auto';
    active.style.width = `${activeRect.width}px`;
    active.style.height = `${activeRect.height}px`;
    active.style.margin = '0';
    active.style.maxWidth = 'none';
    active.style.zIndex = '9999';

    // Keep next fully hidden until the "shoot/throw" starts
    next.style.display = 'none';
    gsap.set(next, { x: '-120vw', y: 0, opacity: 1, zIndex: 1, filter: 'none' });
    gsap.set(active, { x: 0, y: 0, opacity: 1, zIndex: 2, filter: 'none' });

    const finalizeSwap = () => {
      // reset old active
      gsap.set(active, {
        clearProps: 'all',
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        rotateZ: 0,
        filter: 'none',
        boxShadow: 'none',
        zIndex: 1,
      });
      // Restore positioning back to CSS-controlled state
      active.style.position = '';
      active.style.top = '';
      active.style.left = '';
      active.style.right = '';
      active.style.bottom = '';
      active.style.width = '';
      active.style.height = '';
      active.style.margin = '';
      active.style.maxWidth = '';
      active.style.zIndex = '';
      active.style.filter = '';
      active.style.pointerEvents = '';
      active.style.display = 'none';

      // keep next visible and clean
      gsap.set(next, {
        clearProps: 'filter,boxShadow',
        x: 0,
        y: 0,
        opacity: 1,
        scale: 1,
        scaleX: 1,
        scaleY: 1,
        skewX: 0,
        rotateZ: 0,
        filter: 'none',
        boxShadow: 'none',
        zIndex: 1,
      });
      next.style.display = 'block';
      next.style.pointerEvents = '';
      // No layout reflow: cards stay absolute within `.contact-stage`.
      gsap.set(next, { x: 0, y: 0 });

      // reset form + statuses for a "fresh" card
      setFormData({ name: '', email: '', message: '' });
      setTouched({});
      setErrors({});
      setShowValidationErrors(false);
      setSubmitStatus('idle');
      setErrorMessage('');
      setCardKey((k) => k + 1);

      // promote next to active via state
      setActiveSlot((s) => (s === 0 ? 1 : 0));
      isAnimatingRef.current = false;
    };

    if (prefersReducedMotion) {
      const tl = gsap.timeline({ onComplete: finalizeSwap });
      tl.to(active, { opacity: 0, duration: 0.25, ease: 'power2.out' })
        .set(next, { display: 'block' })
        .fromTo(next, { x: '-20px', opacity: 0 }, { x: 0, opacity: 1, duration: 0.25, ease: 'power2.out' }, '-=0.1');
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: finalizeSwap,
    });

    /* -------- PAPER FOLD (PINCH EFFECT) -------- */
    tl.to(active, {
      duration: 0.25,
      scaleX: 0.85,
      scaleY: 0.9,
      skewX: -8,
      rotateZ: -6,
      transformOrigin: 'center center',
      boxShadow: '0 10px 18px rgba(0, 0, 0, 0.12), 0 6px 12px rgba(0, 0, 0, 0.08)', // reduced shadow stretch
      force3D: true,
    });

    /* -------- ROCKET SHAPE COMPRESSION -------- */
    tl.to(active, {
      duration: 0.2,
      scaleX: 0.35,
      rotateZ: -18,
      skewX: -18,
      ease: 'power3.in',
      force3D: true,
    });

    /* -------- THROW ROCKET -------- */
    tl.addLabel('throwStart')
    .to(active, {
      duration: 0.7,
      x: '140vw',
      y: '-140vh',
      rotateZ: 35,
      scale: 0.15,
      opacity: 0,
      ease: 'power4.in',
      force3D: true,
      onStart: () => {
        // Add motion blur during rocket throw
        active.style.filter = 'blur(0.6px)';
      },
    }, 'throwStart');

    /* -------- NEW CARD SWIPE IN -------- */
    // Start the swipe-in near the END of the throw so it doesn't appear early.
    // (Throw duration is 0.7s; this delay means swipe begins when the rocket is ~85% done.)
    const swipeDelay = 0.6;
    tl.set(next, { display: 'block' }, `throwStart+=${swipeDelay}`)
      .to(
        next,
        {
          duration: 0.55,
          x: 0,
          y: 0,
          ease: 'power3.out',
          force3D: true,
        },
        `throwStart+=${swipeDelay}` // begin after most of the throw is complete
      );
  };

  return (
    <section 
      ref={wrapperRef}
      className="contact-wrapper" 
      id="contact"
      aria-labelledby="contact-title"
      tabIndex={-1}
    >
      {/* Screen reader announcements */}
      <div 
        ref={statusAnnouncementRef}
        className="sr-only" 
        role="status" 
        aria-live="polite"
        aria-atomic="true"
      >
        {submitStatus === 'success' && 'Message sent successfully!'}
        {submitStatus === 'error' && 'Failed to send message. Please try again.'}
        {isSubmitting && 'Sending message...'}
      </div>

      <div className="contact-stage">
        <div ref={sentOverlayRef} className="contact-sent-overlay" aria-hidden="true">
          <div className="contact-sent-overlay__panel" role="status" aria-live="polite" aria-atomic="true">
            <h3 className="contact-sent-overlay__title">It’s been sent</h3>
            <p className="contact-sent-overlay__subtitle">Thanks for reaching out. I’ll get back to you soon.</p>
          </div>
        </div>
        {/* Active card */}
        <div ref={cardARef} className={`contact-card ${activeSlot === 0 ? 'is-active' : 'is-next'}`}>
          {renderContactCard(
            activeSlot === 0 ? formData : { name: '', email: '', message: '' },
            activeSlot === 0 ? errors : {},
            activeSlot === 0 ? touched : {},
            activeSlot === 0 ? isSubmitting : false,
            activeSlot === 0 ? submitStatus : 'idle',
            `a-${cardKey}`,
            `contact-form-a-${cardKey}`,
            activeSlot === 0
          )}
        </div>

        {/* Next card */}
        <div ref={cardBRef} className={`contact-card ${activeSlot === 1 ? 'is-active' : 'is-next'}`}>
          {renderContactCard(
            activeSlot === 1 ? formData : { name: '', email: '', message: '' },
            activeSlot === 1 ? errors : {},
            activeSlot === 1 ? touched : {},
            activeSlot === 1 ? isSubmitting : false,
            activeSlot === 1 ? submitStatus : 'idle',
            `b-${cardKey}`,
            `contact-form-b-${cardKey}`,
            activeSlot === 1
          )}
        </div>
      </div>
    </section>
  );
};
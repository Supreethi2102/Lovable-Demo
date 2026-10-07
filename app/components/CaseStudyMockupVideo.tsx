import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import Player from '@vimeo/player';
import {
  ClosedCaptioning,
  CornersIn,
  CornersOut,
  DotsThreeVertical,
  Pause,
  Play,
  SpeakerHigh,
  SpeakerLow,
  SpeakerSlash,
} from '@phosphor-icons/react';

type TranscriptCue = {
  start: number;
  text: string;
};

type CaseStudyMockupVideoProps = {
  src?: string;
  vimeoId?: string;
  mockupSrc?: string;
  label: string;
  captionsSrc?: string;
  transcript?: TranscriptCue[];
};

type CaptionSize = 's' | 'm' | 'l';

type PlayerPrefs = {
  captionsOn: boolean;
  captionSize: CaptionSize;
  descriptionsOn: boolean;
  keyboardOn: boolean;
  highlightTranscript: boolean;
};

const PREFS_KEY = 'portfolio-player-prefs';
const CHROME_HIDE_MS = 2400;
const DEFAULT_PREFS: PlayerPrefs = {
  captionsOn: true,
  captionSize: 'm',
  descriptionsOn: false,
  keyboardOn: true,
  highlightTranscript: true,
};

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const whole = Math.floor(seconds);
  const mins = Math.floor(whole / 60);
  const secs = whole % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function loadPrefs(): PlayerPrefs {
  try {
    const raw = sessionStorage.getItem(PREFS_KEY);
    if (!raw) return DEFAULT_PREFS;
    return { ...DEFAULT_PREFS, ...(JSON.parse(raw) as Partial<PlayerPrefs>) };
  } catch {
    return DEFAULT_PREFS;
  }
}

function savePrefs(prefs: PlayerPrefs) {
  try {
    sessionStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  } catch {
    /* private mode */
  }
}

function buildVimeoSrc(vimeoId: string) {
  const params = new URLSearchParams({
    autoplay: '1',
    loop: '0',
    muted: '0',
    autopause: '0',
    controls: '0',
    api: '1',
    texttrack: 'en',
    title: '0',
    byline: '0',
    portrait: '0',
    dnt: '1',
    transparent: '0',
    pip: '0',
    airplay: '0',
    chromecast: '0',
    keyboard: '0',
    vimeo_logo: '0',
    quality_selector: '0',
  });
  return `https://player.vimeo.com/video/${vimeoId}?${params.toString()}`;
}

function blockMediaMenu(event: React.MouseEvent) {
  event.preventDefault();
}

function ChromeTooltip({ label }: { label: string }) {
  return <span className="case-study-mockup-video__tooltip">{label}</span>;
}

export const CaseStudyMockupVideo: React.FC<CaseStudyMockupVideoProps> = ({
  src,
  vimeoId,
  label,
  captionsSrc,
  transcript = [],
}) => {
  const screenRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const vimeoRef = useRef<Player | null>(null);
  const hideTimerRef = useRef(0);
  const volumeLeaveRef = useRef(0);
  const fillRef = useRef<HTMLSpanElement>(null);
  const clockRef = useRef({ seconds: 0, stamp: 0, playing: false, duration: 0, scrubbing: false });
  const prefsId = useId();
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [panel, setPanel] = useState<'none' | 'volume' | 'settings' | 'transcript'>('none');
  const [settingsTab, setSettingsTab] = useState<'captions' | 'descriptions' | 'keyboard' | 'transcript'>('captions');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [chromeVisible, setChromeVisible] = useState(true);
  const [scrubHint, setScrubHint] = useState<number | null>(null);
  const [prefs, setPrefs] = useState<PlayerPrefs>(loadPrefs);
  const usesFile = Boolean(src);
  const hasCaptions = Boolean(captionsSrc);
  const hasTranscript = transcript.length > 0;
  const volumePercent = Math.round((isMuted ? 0 : volume) * 100);

  const updatePrefs = (patch: Partial<PlayerPrefs>) => {
    setPrefs((current) => {
      const next = { ...current, ...patch };
      savePrefs(next);
      return next;
    });
  };

  const startPlayback = useCallback(() => {
    if (!src && !vimeoId) return;
    setHasStarted(true);
    setIsPlaying(true);
    setChromeVisible(true);
  }, [src, vimeoId]);

  const scheduleChromeHide = useCallback(() => {
    window.clearTimeout(hideTimerRef.current);
    if (!isPlaying || panel !== 'none') return;
    hideTimerRef.current = window.setTimeout(() => {
      setPanel('none');
      setChromeVisible(false);
    }, CHROME_HIDE_MS);
  }, [isPlaying, panel]);

  const revealChrome = useCallback(() => {
    setChromeVisible(true);
    scheduleChromeHide();
  }, [scheduleChromeHide]);

  useEffect(() => {
    if (isPlaying && panel === 'none') scheduleChromeHide();
    else {
      window.clearTimeout(hideTimerRef.current);
      setChromeVisible(true);
    }
    return () => {
      window.clearTimeout(hideTimerRef.current);
      window.clearTimeout(volumeLeaveRef.current);
    };
  }, [isPlaying, panel, scheduleChromeHide]);

  useEffect(() => {
    if (!hasStarted || !src) return;
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
    video.muted = isMuted;
    void video.play().catch(() => setIsPlaying(false));
  }, [hasStarted, src]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
      videoRef.current.muted = isMuted;
    }
    void vimeoRef.current?.setVolume(isMuted ? 0 : volume).catch(() => undefined);
  }, [isMuted, volume]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const track = video.textTracks[0];
    if (!track) return;
    track.mode = prefs.captionsOn ? 'showing' : 'hidden';
    if (prefs.captionsOn) void vimeoRef.current?.enableTextTrack('en').catch(() => undefined);
    else void vimeoRef.current?.disableTextTrack().catch(() => undefined);
  }, [hasStarted, prefs.captionsOn, captionsSrc]);

  useEffect(() => {
    if (!hasStarted || src || !vimeoId) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const player = new Player(iframe, {
      controls: false,
      pip: false,
      keyboard: false,
    });
    vimeoRef.current = player;

    const onTime = (event: { seconds: number; duration: number }) => {
      if (clockRef.current.scrubbing) return;
      clockRef.current.seconds = event.seconds;
      clockRef.current.stamp = performance.now();
      if (event.duration > 0) {
        clockRef.current.duration = event.duration;
        setDuration(event.duration);
      }
      setCurrentTime(event.seconds);
    };

    void player.ready().then(async () => {
      const [length, seconds] = await Promise.all([player.getDuration(), player.getCurrentTime()]);
      if (length > 0) setDuration(length);
      setCurrentTime(seconds);
      await player.setVolume(isMuted ? 0 : volume).catch(() => undefined);
      if (prefs.captionsOn) await player.enableTextTrack('en').catch(() => undefined);
      else await player.disableTextTrack().catch(() => undefined);
    });

    player.on('play', () => {
      clockRef.current.playing = true;
      clockRef.current.stamp = performance.now();
      setIsPlaying(true);
    });
    player.on('pause', () => {
      clockRef.current.playing = false;
      setIsPlaying(false);
    });
    player.on('ended', () => {
      clockRef.current.playing = false;
      setIsPlaying(false);
    });
    player.on('timeupdate', onTime);
    player.on('seeked', onTime);

    const poll = window.setInterval(() => {
      void player.getCurrentTime().then((seconds) => {
        if (clockRef.current.scrubbing) return;
        clockRef.current.seconds = seconds;
        clockRef.current.stamp = performance.now();
      }).catch(() => undefined);
      void player.getDuration().then((length) => {
        if (length > 0) {
          clockRef.current.duration = length;
          setDuration(length);
        }
      }).catch(() => undefined);
    }, 1000);

    return () => {
      window.clearInterval(poll);
      player.off('play');
      player.off('pause');
      player.off('ended');
      player.off('timeupdate');
      player.off('seeked');
      vimeoRef.current = null;
    };
  }, [hasStarted, src, vimeoId]);

  useEffect(() => {
    const onFullscreen = () => {
      const node = screenRef.current;
      setIsFullscreen(Boolean(node && document.fullscreenElement === node));
    };
    document.addEventListener('fullscreenchange', onFullscreen);
    return () => document.removeEventListener('fullscreenchange', onFullscreen);
  }, []);

  const togglePlayback = useCallback(() => {
    if (!hasStarted) {
      startPlayback();
      return;
    }
    if (usesFile) {
      const video = videoRef.current;
      if (!video) return;
      if (video.paused) void video.play();
      else video.pause();
      return;
    }
    if (isPlaying) void vimeoRef.current?.pause().catch(() => undefined);
    else void vimeoRef.current?.play().catch(() => undefined);
  }, [hasStarted, isPlaying, startPlayback, usesFile]);

  const seekTo = (nextTime: number) => {
    const clamped = Math.min(Math.max(nextTime, 0), duration || nextTime);
    clockRef.current.seconds = clamped;
    clockRef.current.stamp = performance.now();
    clockRef.current.scrubbing = true;
    setCurrentTime(clamped);
    if (fillRef.current && (duration || clockRef.current.duration)) {
      const length = duration || clockRef.current.duration;
      fillRef.current.style.transform = `scaleX(${length ? clamped / length : 0})`;
    }
    if (usesFile && videoRef.current) videoRef.current.currentTime = clamped;
    else void vimeoRef.current?.setCurrentTime(clamped).catch(() => undefined);
    window.setTimeout(() => {
      clockRef.current.scrubbing = false;
    }, 180);
  };

  const toggleMute = useCallback(() => {
    setIsMuted((current) => !current);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const node = screenRef.current;
    if (!node) return;
    revealChrome();
    try {
      if (document.fullscreenElement === node) {
        await document.exitFullscreen();
        return;
      }
      const video = videoRef.current as HTMLVideoElement & { webkitEnterFullscreen?: () => void };
      if (video && !node.requestFullscreen && video.webkitEnterFullscreen) {
        video.webkitEnterFullscreen();
        return;
      }
      await node.requestFullscreen();
    } catch {
      /* fullscreen can be denied */
    }
  }, [revealChrome]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!prefs.keyboardOn) return;
      if (!screenRef.current?.contains(document.activeElement) && document.fullscreenElement !== screenRef.current) {
        return;
      }
      if (event.key === ' ' || event.key === 'k' || event.key === 'K') {
        event.preventDefault();
        togglePlayback();
      }
      if (event.key === 'm' || event.key === 'M') toggleMute();
      if (event.key === 'f' || event.key === 'F') void toggleFullscreen();
      if (event.key === 'c' || event.key === 'C') updatePrefs({ captionsOn: !prefs.captionsOn });
      if (event.key === 'ArrowRight') seekTo(currentTime + 5);
      if (event.key === 'ArrowLeft') seekTo(currentTime - 5);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [currentTime, prefs.captionsOn, prefs.keyboardOn, toggleFullscreen, toggleMute, togglePlayback]);

  useEffect(() => {
    clockRef.current.playing = isPlaying;
    clockRef.current.duration = duration;
    if (!isPlaying) {
      clockRef.current.seconds = currentTime;
      clockRef.current.stamp = performance.now();
    }
  }, [isPlaying, currentTime, duration]);

  useEffect(() => {
    let raf = 0;
    let lastShownSecond = Math.floor(currentTime);

    const paint = (seconds: number) => {
      const length = clockRef.current.duration || duration;
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${length > 0 ? Math.min(seconds / length, 1) : 0})`;
      }
      const whole = Math.floor(seconds);
      if (whole !== lastShownSecond) {
        lastShownSecond = whole;
        setCurrentTime(seconds);
      }
    };

    const tick = () => {
      const clock = clockRef.current;
      const elapsed = clock.playing && !clock.scrubbing ? (performance.now() - clock.stamp) / 1000 : 0;
      const next = Math.min(clock.seconds + elapsed, clock.duration || Infinity);
      paint(Number.isFinite(next) ? next : clock.seconds);
      raf = window.requestAnimationFrame(tick);
    };

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [duration]);

  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;
  const hintTime = scrubHint ?? currentTime;
  const activeCue = transcript.findLast
    ? transcript.findLast((cue) => currentTime >= cue.start)
    : [...transcript].reverse().find((cue) => currentTime >= cue.start);

  const VolumeIcon = isMuted || volumePercent === 0 ? SpeakerSlash : volumePercent < 40 ? SpeakerLow : SpeakerHigh;

  return (
    <div className="case-study-mockup-video" aria-label={`${label} mockup video`}>
      <div className="case-study-mockup-video__stage">
        <div
          ref={screenRef}
          className={`case-study-mockup-video__screen${hasStarted ? ' is-started' : ' is-idle'}`}
          onMouseMove={revealChrome}
          onPointerDown={revealChrome}
          onContextMenu={blockMediaMenu}
          onClick={(event) => {
            const target = event.target as HTMLElement;
            if (target === event.currentTarget || target.classList.contains('case-study-mockup-video__player')) {
              togglePlayback();
            }
          }}
        >
          {hasStarted && src ? (
            <video
              ref={videoRef}
              className="case-study-mockup-video__player"
              src={src}
              playsInline
              preload="metadata"
              controls={false}
              controlsList="nodownload noplaybackrate noremoteplayback"
              disablePictureInPicture
              disableRemotePlayback
              onContextMenu={blockMediaMenu}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={() => {
                const video = videoRef.current;
                if (!video) return;
                setCurrentTime(video.currentTime);
                if (video.duration && video.duration !== duration) setDuration(video.duration);
              }}
              onLoadedMetadata={() => {
                if (videoRef.current) setDuration(videoRef.current.duration);
              }}
              onEnded={() => setIsPlaying(false)}
              onVolumeChange={() => {
                if (!videoRef.current) return;
                setVolume(videoRef.current.volume);
                setIsMuted(videoRef.current.muted);
              }}
            >
              {captionsSrc ? (
                <track kind="captions" src={captionsSrc} srcLang="en" label="English" default={prefs.captionsOn} />
              ) : null}
            </video>
          ) : null}
          {hasStarted && !src && vimeoId ? (
            <iframe
              ref={iframeRef}
              className="case-study-mockup-video__player"
              src={buildVimeoSrc(vimeoId)}
              title={`${label} interface demonstration`}
              allow="autoplay"
              tabIndex={-1}
              onContextMenu={blockMediaMenu}
            />
          ) : null}

          {prefs.captionsOn && hasCaptions && activeCue ? (
            <p className={`case-study-mockup-video__caption case-study-mockup-video__caption--${prefs.captionSize}`}>
              {activeCue.text}
            </p>
          ) : null}

          {!isPlaying ? (
            <button
              type="button"
              className="case-study-mockup-video__play"
              onClick={togglePlayback}
              aria-label={`Play ${label} video`}
            >
              <Play size={22} weight="fill" aria-hidden="true" />
              <ChromeTooltip label="Play" />
            </button>
          ) : null}

          {hasStarted ? (
            <div
              className={`case-study-mockup-video__chrome${chromeVisible ? '' : ' is-hidden'}`}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="case-study-mockup-video__chrome-row">
                <div className="case-study-mockup-video__chrome-cluster">
                  <button
                    type="button"
                    className="case-study-mockup-video__chrome-btn"
                    onClick={togglePlayback}
                    aria-label={isPlaying ? `Pause ${label} video` : `Play ${label} video`}
                  >
                    {isPlaying ? <Pause size={16} weight="fill" aria-hidden="true" /> : <Play size={16} weight="fill" aria-hidden="true" />}
                    <ChromeTooltip label={isPlaying ? 'Pause' : 'Play'} />
                  </button>
                  <span className="case-study-mockup-video__time">{formatTime(currentTime)}</span>
                </div>

                <label className="case-study-mockup-video__scrubber-label">
                  <span className="sr-only">Seek</span>
                  <span className="case-study-mockup-video__scrubber-track" aria-hidden="true">
                    <span
                      ref={fillRef}
                      className="case-study-mockup-video__scrubber-fill"
                      style={{ transform: `scaleX(${progress})` }}
                    />
                  </span>
                  <input
                    type="range"
                    className="case-study-mockup-video__scrubber"
                    min={0}
                    max={duration > 0 ? duration : 1}
                    step={0.1}
                    value={duration > 0 ? Math.min(currentTime, duration) : 0}
                    disabled={duration <= 0}
                    onChange={(event) => {
                      const next = Number(event.target.value);
                      setScrubHint(next);
                      seekTo(next);
                    }}
                    onPointerMove={(event) => {
                      if (duration <= 0) return;
                      const slider = event.currentTarget;
                      const rect = slider.getBoundingClientRect();
                      const ratio = rect.width ? Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1) : 0;
                      setScrubHint(ratio * duration);
                    }}
                    onPointerLeave={() => setScrubHint(null)}
                    aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                  />
                  {scrubHint != null && duration > 0 && !isPlaying ? (
                    <span className="case-study-mockup-video__scrub-preview" style={{ left: `${(hintTime / duration) * 100}%` }}>
                      <span className="case-study-mockup-video__scrub-thumb" aria-hidden="true">
                        {formatTime(hintTime)}
                      </span>
                    </span>
                  ) : null}
                </label>

                <div className="case-study-mockup-video__chrome-cluster">
                  <span className="case-study-mockup-video__time">{formatTime(duration)}</span>
                  <div
                    className={`case-study-mockup-video__flyout${panel === 'volume' ? ' is-open' : ''}`}
                    onMouseEnter={() => {
                      window.clearTimeout(volumeLeaveRef.current);
                      setPanel('volume');
                    }}
                    onMouseLeave={() => {
                      window.clearTimeout(volumeLeaveRef.current);
                      volumeLeaveRef.current = window.setTimeout(() => {
                        setPanel((current) => (current === 'volume' ? 'none' : current));
                      }, 120);
                    }}
                  >
                    <button
                      type="button"
                      className="case-study-mockup-video__chrome-btn"
                      onClick={toggleMute}
                      onFocus={() => setPanel('volume')}
                      onBlur={(event) => {
                        if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node)) {
                          setPanel((current) => (current === 'volume' ? 'none' : current));
                        }
                      }}
                      aria-label={isMuted ? 'Unmute' : 'Mute'}
                    >
                      <VolumeIcon size={16} weight="regular" aria-hidden="true" />
                      <ChromeTooltip label={`Volume ${volumePercent}%`} />
                    </button>
                    {panel === 'volume' ? (
                      <div className="case-study-mockup-video__volume">
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.05}
                          value={isMuted ? 0 : volume}
                          aria-label="Volume"
                          onChange={(event) => {
                            const next = Number(event.target.value);
                            setVolume(next);
                            setIsMuted(next === 0);
                          }}
                        />
                      </div>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    className={`case-study-mockup-video__chrome-btn${prefs.captionsOn ? ' is-on' : ''}`}
                    onClick={() => updatePrefs({ captionsOn: !prefs.captionsOn })}
                    aria-pressed={prefs.captionsOn}
                    aria-label={hasCaptions ? 'Closed captions' : 'Closed captions unavailable'}
                  >
                    <ClosedCaptioning size={16} weight={prefs.captionsOn ? 'fill' : 'regular'} aria-hidden="true" />
                    <ChromeTooltip label={hasCaptions ? (prefs.captionsOn ? 'Captions on' : 'Captions off') : 'Captions coming'} />
                  </button>

                  <button
                    type="button"
                    className="case-study-mockup-video__chrome-btn"
                    onClick={() => void toggleFullscreen()}
                    aria-label={isFullscreen ? 'Exit fullscreen' : 'Enlarge'}
                  >
                    {isFullscreen ? <CornersIn size={16} weight="regular" aria-hidden="true" /> : <CornersOut size={16} weight="regular" aria-hidden="true" />}
                    <ChromeTooltip label={isFullscreen ? 'Exit fullscreen' : 'Enlarge'} />
                  </button>

                  <div className="case-study-mockup-video__menu">
                    <button
                      type="button"
                      className="case-study-mockup-video__chrome-btn"
                      onClick={() => setPanel((current) => (current === 'settings' ? 'none' : 'settings'))}
                      aria-expanded={panel === 'settings'}
                      aria-controls={prefsId}
                      aria-label="Settings and preferences"
                    >
                      <DotsThreeVertical size={16} weight="bold" aria-hidden="true" />
                      <ChromeTooltip label="Settings" />
                    </button>
                    {panel === 'settings' ? (
                      <div id={prefsId} className="case-study-mockup-video__prefs" role="dialog" aria-label="Player preferences">
                        <div className="case-study-mockup-video__prefs-tabs" role="tablist" aria-label="Preference groups">
                          {(['captions', 'descriptions', 'keyboard', 'transcript'] as const).map((tab) => (
                            <button
                              key={tab}
                              type="button"
                              role="tab"
                              aria-selected={settingsTab === tab}
                              className={`case-study-mockup-video__prefs-tab${settingsTab === tab ? ' is-active' : ''}`}
                              onClick={() => setSettingsTab(tab)}
                            >
                              {tab === 'captions' ? 'Captions' : tab === 'descriptions' ? 'Descriptions' : tab === 'keyboard' ? 'Keyboard' : 'Transcript'}
                            </button>
                          ))}
                        </div>

                        {settingsTab === 'captions' ? (
                          <div className="case-study-mockup-video__prefs-body">
                            <label className="case-study-mockup-video__pref">
                              <input
                                type="checkbox"
                                checked={prefs.captionsOn}
                                onChange={(event) => updatePrefs({ captionsOn: event.target.checked })}
                              />
                              Show captions
                            </label>
                            <p className="case-study-mockup-video__pref-note">
                              {hasCaptions ? 'English captions are available for this film.' : 'Caption file not added yet. The control is ready for a WebVTT track.'}
                            </p>
                            <fieldset className="case-study-mockup-video__pref-set">
                              <legend>Caption size</legend>
                              {(['s', 'm', 'l'] as const).map((size) => (
                                <label key={size}>
                                  <input
                                    type="radio"
                                    name={`${prefsId}-cap-size`}
                                    checked={prefs.captionSize === size}
                                    onChange={() => updatePrefs({ captionSize: size })}
                                  />
                                  {size.toUpperCase()}
                                </label>
                              ))}
                            </fieldset>
                          </div>
                        ) : null}

                        {settingsTab === 'descriptions' ? (
                          <div className="case-study-mockup-video__prefs-body">
                            <label className="case-study-mockup-video__pref">
                              <input
                                type="checkbox"
                                checked={prefs.descriptionsOn}
                                onChange={(event) => updatePrefs({ descriptionsOn: event.target.checked })}
                              />
                              Audio description
                            </label>
                            <p className="case-study-mockup-video__pref-note">
                              No description track is attached yet. When one is, this toggle will play it and can pause the film on each cue.
                            </p>
                          </div>
                        ) : null}

                        {settingsTab === 'keyboard' ? (
                          <div className="case-study-mockup-video__prefs-body">
                            <label className="case-study-mockup-video__pref">
                              <input
                                type="checkbox"
                                checked={prefs.keyboardOn}
                                onChange={(event) => updatePrefs({ keyboardOn: event.target.checked })}
                              />
                              Enable shortcuts
                            </label>
                            <ul className="case-study-mockup-video__keys">
                              <li><kbd>Space</kbd> Play or pause</li>
                              <li><kbd>M</kbd> Mute</li>
                              <li><kbd>F</kbd> Enlarge</li>
                              <li><kbd>C</kbd> Captions</li>
                              <li><kbd>←</kbd> <kbd>→</kbd> Seek 5 seconds</li>
                            </ul>
                          </div>
                        ) : null}

                        {settingsTab === 'transcript' ? (
                          <div className="case-study-mockup-video__prefs-body">
                            <button
                              type="button"
                              className="case-study-mockup-video__transcript-open"
                              onClick={() => setPanel('transcript')}
                            >
                              Show transcript
                            </button>
                            <label className="case-study-mockup-video__pref">
                              <input
                                type="checkbox"
                                checked={prefs.highlightTranscript}
                                onChange={(event) => updatePrefs({ highlightTranscript: event.target.checked })}
                              />
                              Highlight as the video plays
                            </label>
                            <p className="case-study-mockup-video__pref-note">
                              {hasTranscript
                                ? 'Open the transcript to read along or jump to a line.'
                                : 'No transcript file yet. This is the place to open it once one is written.'}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {panel === 'transcript' ? (
            <aside className="case-study-mockup-video__transcript" aria-label="Transcript">
              <div className="case-study-mockup-video__transcript-head">
                <p>Transcript</p>
                <button type="button" className="case-study-mockup-video__chrome-btn" onClick={() => setPanel('none')} aria-label="Close transcript">
                  <CornersIn size={14} weight="bold" aria-hidden="true" />
                </button>
              </div>
              {hasTranscript ? (
                <ol className="case-study-mockup-video__transcript-list">
                  {transcript.map((cue) => (
                    <li key={`${cue.start}-${cue.text}`}>
                      <button
                        type="button"
                        className={`case-study-mockup-video__transcript-line${
                          prefs.highlightTranscript && activeCue?.start === cue.start ? ' is-active' : ''
                        }`}
                        onClick={() => {
                          seekTo(cue.start);
                          setPanel('none');
                        }}
                      >
                        <span>{formatTime(cue.start)}</span>
                        {cue.text}
                      </button>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="case-study-mockup-video__pref-note">A written transcript will show here as soon as one is added for this film.</p>
              )}
            </aside>
          ) : null}
        </div>
      </div>
    </div>
  );
};

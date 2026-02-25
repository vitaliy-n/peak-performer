import { useRef, useState, useCallback, useEffect } from 'react';

type SoundType = 'white' | 'pink' | 'brown' | 'binaural_alpha' | 'binaural_beta' | 'binaural_theta';

export const useFocusSound = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [type, setType] = useState<SoundType>('brown');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const oscillatorNodesRef = useRef<OscillatorNode[]>([]);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
  };

  const createNoiseBuffer = (ctx: AudioContext, type: 'white' | 'pink' | 'brown') => {
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'pink') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.11; // (roughly) compensate for gain
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5; // (roughly) compensate for gain
      }
    }
    return buffer;
  };

  const playBinaural = (ctx: AudioContext, carrierFreq: number, beatFreq: number) => {
    // Left ear
    const oscLeft = ctx.createOscillator();
    const pannerLeft = ctx.createStereoPanner();
    oscLeft.frequency.value = carrierFreq;
    pannerLeft.pan.value = -1;
    oscLeft.connect(pannerLeft);
    pannerLeft.connect(gainNodeRef.current!);
    
    // Right ear
    const oscRight = ctx.createOscillator();
    const pannerRight = ctx.createStereoPanner();
    oscRight.frequency.value = carrierFreq + beatFreq;
    pannerRight.pan.value = 1;
    oscRight.connect(pannerRight);
    pannerRight.connect(gainNodeRef.current!);

    oscLeft.start();
    oscRight.start();
    
    oscillatorNodesRef.current = [oscLeft, oscRight];
  };

  const play = useCallback(() => {
    initAudioContext();
    const ctx = audioContextRef.current!;
    
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    // Stop current sound
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    oscillatorNodesRef.current.forEach(osc => osc.stop());
    oscillatorNodesRef.current = [];

    gainNodeRef.current!.gain.value = volume;

    if (type === 'white' || type === 'pink' || type === 'brown') {
      const buffer = createNoiseBuffer(ctx, type);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gainNodeRef.current!);
      source.start();
      sourceNodeRef.current = source;
    } else if (type === 'binaural_alpha') {
      // Alpha waves (8-13 Hz) - Relaxation, Reflection
      playBinaural(ctx, 200, 10); 
    } else if (type === 'binaural_beta') {
      // Beta waves (13-30 Hz) - Focus, Analytical thinking
      playBinaural(ctx, 200, 20); 
    } else if (type === 'binaural_theta') {
      // Theta waves (4-8 Hz) - Deep meditation, Creativity
      playBinaural(ctx, 200, 6); 
    }

    setIsPlaying(true);
  }, [type, volume]);

  const stop = useCallback(() => {
    if (sourceNodeRef.current) {
      sourceNodeRef.current.stop();
      sourceNodeRef.current = null;
    }
    oscillatorNodesRef.current.forEach(osc => osc.stop());
    oscillatorNodesRef.current = [];
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
    } else {
      play();
    }
  }, [isPlaying, play, stop]);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      play(); // Restart with new type
    }
  }, [type]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return {
    isPlaying,
    volume,
    type,
    toggle,
    setVolume,
    setType,
  };
};

/**
 * Hook pour gérer les sons du jeu
 */
import { useRef, useEffect, useCallback } from 'react';

export const useSound = (src, options = {}) => {
    const audioRef = useRef(null);
    const { loop = false, volume = 1.0 } = options;

    useEffect(() => {
        audioRef.current = new Audio(src);
        audioRef.current.loop = loop;
        audioRef.current.volume = volume;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [src, loop, volume]);

    const play = useCallback(() => {
        if (audioRef.current) {
            // Ne pas remettre à zéro si déjà en lecture
            if (audioRef.current.paused) {
                audioRef.current.currentTime = 0;
            }
            audioRef.current.play().catch(err => {
                console.warn('Audio play failed:', err);
            });
        }
    }, []);

    const pause = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
    }, []);

    const stop = useCallback(() => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
    }, []);

    const setVolume = useCallback((newVolume) => {
        if (audioRef.current) {
            audioRef.current.volume = Math.max(0, Math.min(1, newVolume));
        }
    }, []);

    return { play, pause, stop, setVolume };
};

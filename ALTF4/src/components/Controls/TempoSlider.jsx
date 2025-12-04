import React, { useState, useEffect, useRef } from 'react';
import './TempoSlider.css';

const BpmSelector = ({ initialBpm = 120, onBpmChange }) => {
  const [bpm, setBpm] = useState(initialBpm);


  useEffect(() => {
    if (onBpmChange) {
      onBpmChange(bpm);
    }
  }, [bpm, onBpmChange]);

  const handleMouseDown = (e) => {
    // lock le pointer sur l'element
    e.target.requestPointerLock();
  };

  const handleMouseMove = (e) => {

    if (document.pointerLockElement) {
      const delta = -e.movementY;

      const sensitivity = 4;
      const change = Math.round(delta / sensitivity);

      setBpm((prevBpm) => Math.min(Math.max(prevBpm + change, 40), 220));
    }
  };

  const handleMouseUp = () => {
    // sortir du lock quand lache le click
    document.exitPointerLock();
  };

  //listener attaché au document pour scroller en étant lock dans le button
  useEffect(() => {
    const onMove = (e) => handleMouseMove(e);
    const onUp = () => handleMouseUp();

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
  }, []);

  return (
    <div className="bpm-selector">
      <div
        onMouseDown={handleMouseDown}
        className="bpm-drag-area"
        title="Click and drag up/down to change BPM"
      >
        <div className="bpm-display">
          <div className="bpm-value">{bpm}</div>
        </div>
      </div>
    </div>
  );
};

export default BpmSelector;

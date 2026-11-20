import React from 'react';
import s from './index.module.css';

const ten = Array.from(Array(10).keys());

function NumberDisplay({ value: v }) {
  return (
    <div className={s.value}>
      <div className={s.numbercontainer} style={{ transform: `translateY(-${v * 100}px)` }}>
        {ten.map(t => (
          <div className={s.number} style={{ top: `${t * 100}px` }} key={t}>{t}</div>
        ))}
      </div>
    </div>
  );
}

export default NumberDisplay;

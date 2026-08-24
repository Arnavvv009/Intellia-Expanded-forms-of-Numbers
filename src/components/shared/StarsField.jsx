import { useMemo } from 'react';

export default function StarsField() {
  const stars = useMemo(() => Array.from({length:55},(_,i)=>({
    id:i, x:Math.random()*100, y:Math.random()*100,
    s:Math.random()*2+0.5, d:Math.random()*4+2, del:Math.random()*6
  })),[]);
  return (
    <div className="stars-bg" aria-hidden="true">
      {stars.map(s=>(
        <div key={s.id} className="star-dot" style={{
          left:`${s.x}%`, top:`${s.y}%`,
          width:`${s.s}px`, height:`${s.s}px`,
          '--d':`${s.d}s`, '--del':`${s.del}s`
        }}/>
      ))}
    </div>
  );
}

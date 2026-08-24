import './PlaceValueBlock.css';

/**
 * PlaceValueBlock — renders SVG representations of:
 *   type='hundred' → 10×10 flat grid
 *   type='ten'     → 1×10 rod
 *   type='one'     → single cube
 */
export default function PlaceValueBlock({ type = 'one', size = 1, onClick, dragging = false, className = '' }) {
  const cls = `pvblock pvblock--${type} ${dragging ? 'pvblock--dragging' : ''} ${className}`;

  if (type === 'hundred') {
    return (
      <div className={cls} onClick={onClick} role={onClick ? 'button' : undefined} aria-label="100 block">
        <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
          {/* 10x10 grid */}
          {Array.from({ length: 10 }).map((_, row) =>
            Array.from({ length: 10 }).map((_, col) => (
              <rect
                key={`${row}-${col}`}
                x={col * 5.5 + 1}
                y={row * 5.5 + 1}
                width={4.5}
                height={4.5}
                rx={0.5}
                className="pvblock-cell pvblock-cell--hundred"
              />
            ))
          )}
        </svg>
        <span className="pvblock-label">100</span>
      </div>
    );
  }

  if (type === 'ten') {
    return (
      <div className={cls} onClick={onClick} role={onClick ? 'button' : undefined} aria-label="10 block">
        <svg viewBox="0 0 12 60" xmlns="http://www.w3.org/2000/svg">
          {Array.from({ length: 10 }).map((_, i) => (
            <rect
              key={i}
              x={1}
              y={i * 5.5 + 1}
              width={10}
              height={4.5}
              rx={0.5}
              className="pvblock-cell pvblock-cell--ten"
            />
          ))}
        </svg>
        <span className="pvblock-label">10</span>
      </div>
    );
  }

  // one
  return (
    <div className={cls} onClick={onClick} role={onClick ? 'button' : undefined} aria-label="1 block">
      <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <rect x={1} y={1} width={14} height={14} rx={2} className="pvblock-cell pvblock-cell--one" />
      </svg>
      <span className="pvblock-label">1</span>
    </div>
  );
}

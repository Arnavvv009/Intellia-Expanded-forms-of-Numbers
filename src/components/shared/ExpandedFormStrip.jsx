import './ExpandedFormStrip.css';

/**
 * ExpandedFormStrip — displays [ H*100 ] + [ T*10 ] + [ O ] = total
 * Animates each tile as the value fills in.
 */
export default function ExpandedFormStrip({ hundreds = 0, tens = 0, ones = 0, total = null }) {
  const H = hundreds * 100;
  const T = tens * 10;
  const O = ones;
  const computedTotal = H + T + O;
  const displayTotal = total !== null ? total : computedTotal;

  return (
    <div className="expanded-strip" aria-label={`Expanded form: ${H} plus ${T} plus ${O} equals ${displayTotal}`}>
      <Tile value={H} type="hundred" />
      <span className="strip-op">+</span>
      <Tile value={T} type="ten" />
      <span className="strip-op">+</span>
      <Tile value={O} type="one" />
      <span className="strip-op">=</span>
      <Tile value={displayTotal} type="total" />
    </div>
  );
}

function Tile({ value, type }) {
  const hasValue = value !== null && value !== undefined;
  return (
    <div className={`strip-tile strip-tile--${type} ${hasValue ? 'filled' : ''}`}>
      <span className="tile-value">{hasValue ? value : '___'}</span>
    </div>
  );
}

import { Link } from 'react-router-dom';
import kino from './podracing.mp4';

export function HomePage() {
  return (
    <div>
      now this is podrac.ing
      <br />
      <Link to="chuss">Chuss</Link>
      <br />
      <video
        style={{ width: '90vw' }}
        ref={(e) => e?.play(0)}
        src={kino}
        autoPlay
        loop
        controls
        playsInline
        muted
      />
    </div>
  );
}

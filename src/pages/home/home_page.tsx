import { Link } from 'react-router-dom';
import kino from './podracing.mp4';

export function HomePage() {
  return (
    <div>
      <h1>now THIS is podrac.ing!!</h1>
      <br />
      <Link to="chuss">Chuss</Link>
      <br /> <br />
      <video
        style={{ width: '90vw' }}
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

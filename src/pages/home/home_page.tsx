import { Link } from 'react-router-dom';
import kino from './podracing.mp4';

export function HomePage() {
  return (
    <div>
      <h1>now THIS is podrac.ing!!</h1>
      <br />
      <div>
        Created by Glup Shitto in the year 420 BBY (Before Blungus Yungus),
        podrac.ing has become the second most popular sport in the Jizzadian
        system, behind <Link to="chuss">Chuss</Link>. Whether you are a humble
        initiate, or a master podrac.er, this is the perfect site for you!{' '}
      </div>
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

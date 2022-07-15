import Introduce from 'src/apps/pawn/views/home/introduce';
import LatestLoans from 'src/apps/pawn/views/home/latestLoans';
import News from 'src/apps/pawn/views/home/news';

const Discover = () => {
  return (<>
    <Introduce />
    <News />
    <LatestLoans />
  </>
  );
};

export default Discover;

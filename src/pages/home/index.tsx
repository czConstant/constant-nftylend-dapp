import Introduce from 'src/views/home/introduce';
import News from 'src/views/home/news';
import LatestLoans from 'src/views/home/latestLoans';
import HomePartner from './Home.Partner';

const Discover = () => {
  return (<>
    <Introduce />
    {/* <News /> */}
    <LatestLoans />
    <HomePartner />
  </>
  );
};

export default Discover;

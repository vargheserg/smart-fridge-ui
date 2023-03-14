import './Fridges.css';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import FridgeList from '../../components/fridgelist/FridgeList';
import NavigatorComponent from '../../components/navigator/NavigatorComponent';
function Fridges() {
  return (
    <div className="Dashboard">
        <Header />   
        <FridgeList />
        <NavigatorComponent/>   
        <Footer />    
      </div>
  );
}

export default Fridges;
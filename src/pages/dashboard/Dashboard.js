import './Dashboard.css';
import Header from '../../components/header/Header';
import Card from '../../components/card/CardComponent';
import Footer from '../../components/footer/Footer';
import NavigatorComponent from '../../components/navigator/NavigatorComponent';
function Dashboard() {
  return (
    <div className="Dashboard">
        <Header />   
        <Card />
        <NavigatorComponent/>   
        <Footer />    
      </div>
  );
}

export default Dashboard;
import './Dashboard.css';
import Header from '../../components/header/Header';
import Card from '../../components/card/CardComponent';
import Footer from '../../components/footer/Footer';
function Dashboard() {
  return (
    <div className="Dashboard">
        <Header />   
        <Card />   
        <Footer />    
      </div>
  );
}

export default Dashboard;
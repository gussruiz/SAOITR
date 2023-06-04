import Header from '../../components/Header/Header';
import OccurrencesDisplay from '../../components/OccurrencesDisplay/OccurrencesDisplay';
import OccurrencesForm from '../../components/OccurrencesForm/OccurrencesForm';
import './Home.css';


const Home = () => {
  const authData = JSON.parse(localStorage.getItem('authData'));
  const isLoggedIn = !!authData?.token;

  return (
    <>
      <Header/>
      {isLoggedIn ? (
          <OccurrencesForm/>
      ) : (
        <>
        </>
      )}
      <OccurrencesDisplay/>
    </>
  );
};

export default Home;
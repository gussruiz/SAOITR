import Header from '../../components/Header/Header';
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
    </>
  );
};

export default Home;
import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import img404 from "../../assets/404.svg";
import "./_error.scss";

const Error = () => {
  return (
    <>
      <Header />
      <main>
        <div className="error-content">
          <div className="error-img-box">
            <img src={img404} alt="img404" />
          </div>
          <div className="shameonyougm">
            <div className="speech-box left speech1">
              <p>Le serveur est pété ? &#x1F92F;</p>
            </div>
            <div className="speech-box right speech2">
              <p>Ouais !</p>
            </div>
            <div className="speech-box left speech3">
              <p>Surement la faute du MJ encore !</p>
            </div>
            <div className="speech-box right speech4">
              <p>Ouais ... &#x1F611;</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Error;

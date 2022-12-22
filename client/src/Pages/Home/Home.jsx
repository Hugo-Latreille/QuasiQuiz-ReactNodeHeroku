/* eslint-disable react/no-unescaped-entities */
import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import "./_home.scss";
import logoQ from "../../assets/logo-q.svg";
import { Outlet } from "react-router-dom";

const Home = () => {
	return (
		<>
			<Header />
			<main>
				<div className="home-content">
					<div className="home-title">
						<h1>Bienvenue !</h1>

						<img src={logoQ} alt="logoQ" />
					</div>
					<div className="rules">
						<h4>Règles du jeu :</h4>
						<p>
							Après vous être connecté, vous arriverez dans un salon où vous
							pourrez apprécier la présence de vos amis. Une fois que tout le
							monde est prêt vous pourrez lancer la partie. Le premier joueur
							entrant dans le salon devient{" "}
							<span className="gm">Maître du Jeu</span>, avec tout ce que cela
							implique, ça va de soi.
						</p>
						<p>Le jeu se déroule en 2 étapes :</p>
						<ul>
							<li>La première consiste à jouer !</li>
							<li>
								La deuxième consiste à corriger les réponses et c'est le{" "}
								<span className="gm">MJ</span> qui aura cette dure
								responsabilité.
							</li>
						</ul>
						<p>
							Une fois la correction terminée vous trouverez alors le tableau
							des scores afin de constater l'inébranlable issue de votre partie.
						</p>
						<p>Alors qu'attendez-vous ? connectez-vous !</p>
					</div>
				</div>
			</main>
			<Footer />
			<Outlet />
		</>
	);
};

export default Home;

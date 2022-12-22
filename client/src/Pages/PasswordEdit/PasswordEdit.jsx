import "./../Connexion/Connexion.scss";
import "./../Connexion/Register.scss";
import ReactDOM from "react-dom";
import { useNavigate, useParams } from "react-router-dom";
//? React Toastify
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import usePasswordValidation from "../../utils/usePasswordValidation";
import Input from "../../Components/Input/Input";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { axiosJWT, usersRoute } from "../../utils/axios";

const PasswordEdit = () => {
	const { userId } = useParams();
	const navigate = useNavigate();
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");
	const [passwordVisibility, setPasswordVisibility] = useState(false);
	const [passwordValidity, passwordValidationWidth, checkPasswordValidity] =
		usePasswordValidation();

	const handlePassword = async (e) => {
		e.preventDefault();
		try {
			if (handleValidation()) {
				const { data } = await axiosJWT.patch(
					`${usersRoute}/${userId}`,
					{
						plainPassword: password,
					},
					{ headers: { "Content-Type": "application/merge-patch+json" } }
				);
				if (data) {
					toast.success("Votre mot de passe a bien été modifié", toastOptions);
					setTimeout(() => {
						navigate(-1);
					}, 6000);
				}
			}
		} catch (error) {
			console.log(error);
			if (error.response.status === 401) {
				return toast.error("Vos identifiants sont incorrects", toastOptions);
			}
			return toast.error(`${error.response.data.detail}`, toastOptions);
		}
	};

	const handleValidation = () => {
		if (password !== passwordConfirm) {
			toast.error("Les mots de passe ne correspondent pas", toastOptions);
			return false;
		}
		const validatePassword = new RegExp(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*"'()+,-./:;<=>?[\]^_`{|}~])(?=.{8,})/
		);
		if (!validatePassword.test(password)) {
			toast.error(
				"Votre password doit avoir au moins 8 caractères, dont une majuscule, un chiffre et un caractère spécial",
				toastOptions
			);
			return false;
		}

		return true;
	};

	const toastOptions = {
		position: "top-right",
		autoClose: 6000,
		pauseOnHover: true,
		draggable: true,
		theme: "light",
	};

	return ReactDOM.createPortal(
		<div className="connexion">
			<div className="connexion-container">
				<div className="connexion-container-navigation">
					<div className="navigation-links">
						<span className={"link-is-active"}>Nouveau mot de passe</span>
					</div>
				</div>
				<div className="connexion-container-form">
					<button
						className="close-modal"
						onClick={() => {
							navigate(-1);
						}}
					>
						<i className="fas fa-times-circle"></i>
					</button>

					<div className="register-container">
						<div className="content ">
							<form className="form" onSubmit={handlePassword}>
								<Input
									name="password"
									value={password}
									label="Mot de passe"
									type={passwordVisibility ? "text" : "password"}
									required={true}
									checkPasswordValidity={checkPasswordValidity}
									setValue={setPassword}
								/>
								<Input
									name="passwordConfirm"
									value={passwordConfirm}
									setValue={setPasswordConfirm}
									label="Confirmez mot de passe"
									type={passwordVisibility ? "text" : "password"}
									required={true}
								/>
								<div
									className="eye_register_pass"
									onClick={() => setPasswordVisibility(!passwordVisibility)}
								>
									{passwordVisibility ? (
										<MdOutlineVisibility />
									) : (
										<MdOutlineVisibilityOff />
									)}
								</div>
								<div
									className="eye_register_confirm"
									onClick={() => setPasswordVisibility(!passwordVisibility)}
								>
									{passwordVisibility ? (
										<MdOutlineVisibility />
									) : (
										<MdOutlineVisibilityOff />
									)}
								</div>

								<div>
									<div className="password-safety">
										Niveau de sécurité du mot de passe :
										<div className="password-safety-container">
											{passwordValidationWidth === 25 && (
												<div className="password-safety-quart"></div>
											)}
											{passwordValidationWidth === 50 && (
												<div className="password-safety-middle"></div>
											)}
											{passwordValidationWidth === 75 && (
												<div className="password-safety-3quart"></div>
											)}
											{passwordValidationWidth === 100 && (
												<div className="password-safety-full"></div>
											)}
										</div>
										<span>
											Au moins{" "}
											<span
												className={
													passwordValidity.minChar ? "success" : "warning"
												}
											>
												8 caractères
											</span>
											, dont une{" "}
											<span
												className={
													passwordValidity.uppercase ? "success" : "warning"
												}
											>
												{" "}
												majuscule
											</span>
											, un{" "}
											<span
												className={
													passwordValidity.number ? "success" : "warning"
												}
											>
												{" "}
												chiffre
											</span>
											, et un
											<span
												className={
													passwordValidity.specialChar ? "success" : "warning"
												}
											>
												{" "}
												caractère spécial
											</span>
											.
										</span>
									</div>
								</div>

								<button type="submit" className="main-button-colored">
									Modifier le mot de passe
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
			<ToastContainer />
		</div>,
		document.getElementById("modale")
	);
};

export default PasswordEdit;

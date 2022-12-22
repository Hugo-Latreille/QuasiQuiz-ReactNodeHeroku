/* eslint-disable react/no-unescaped-entities */
import Input from "../../Components/Input/Input";
import "./Register.scss";
import { useEffect, useState } from "react";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import usePasswordValidation from "../../utils/usePasswordValidation";
import axios from "axios";
import { multiAvatarAPIKey, multiAvatarRoute } from "../../utils/axios";
import { Buffer } from "buffer";
import Loader from "../../assets/avatarLoader.gif";

const Register = ({
  setIsLoggingActive,
  email,
  setEmail,
  password,
  setPassword,
  passwordConfirm,
  setPasswordConfirm,
  pseudo,
  setPseudo,
  handleRegister,
  avatars,
  setAvatars,
  setSelectedAvatar,
  selectedAvatar,
}) => {
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [passwordValidity, passwordValidationWidth, checkPasswordValidity] =
    usePasswordValidation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getAvatars = async () => {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const image = await axios.get(
          `${multiAvatarRoute}/${Math.round(
            Math.random() * 1000
          )}?apikey=${multiAvatarAPIKey}`
        );
        const buffer = Buffer.from(image.data);
        data.push(buffer.toString("base64"));
      }
      setAvatars(data);
      setIsLoading(false);
    };
    getAvatars();
  }, []);

  return (
    <div className="register-container">
      <div className="content ">
        <form className="form" onSubmit={handleRegister}>
          <Input
            name="pseudo"
            value={pseudo}
            label="Pseudo"
            type="text"
            required={true}
            setValue={setPseudo}
          />

          <Input
            name="email"
            value={email}
            label="Email"
            type="email"
            required={true}
            setValue={setEmail}
          />
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
                  className={passwordValidity.minChar ? "success" : "warning"}
                >
                  8 caractères
                </span>
                , dont une{" "}
                <span
                  className={passwordValidity.uppercase ? "success" : "warning"}
                >
                  {" "}
                  majuscule
                </span>
                , un{" "}
                <span
                  className={passwordValidity.number ? "success" : "warning"}
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
          {/* AVATAR ***********/}
          {isLoading ? (
            <div className="avatarContainer">
              <img src={Loader} alt="loading" className="loader" />
            </div>
          ) : (
            <div className="avatarContainer">
              <div className="title-container">
                <h1>Choisissez votre avatar</h1>
              </div>
              <div className="avatars">
                {avatars.map((avatar, index) => {
                  return (
                    <div
                      key={index}
                      className={`avatar ${
                        selectedAvatar === index ? "selected" : ""
                      }`}
                    >
                      <img
                        src={`data:image/svg+xml;base64,${avatar}`}
                        alt="avatar"
                        key={avatar}
                        onClick={() => setSelectedAvatar(index)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <button type="submit" className="main-button-colored">
            S'inscrire
          </button>
          <span
            className="third-button-colored width-100"
            onClick={() => setIsLoggingActive(true)}
          >
            Déjà inscrit ?
          </span>
        </form>
      </div>
    </div>
  );
};

export default Register;

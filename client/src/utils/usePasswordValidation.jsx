import { useEffect, useState } from "react";

const usePasswordValidation = () => {
	const [passwordValidity, setPasswordValidity] = useState({});
	const [passwordValidationWidth, setPasswordValidationWidth] = useState(0);

	const isNumberRegex = /\d/;
	const specialCharacterRegex = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
	const oneUppercase = /[A-Z]/;

	const checkPasswordValidity = (inputValue) => {
		setPasswordValidity({
			minChar: inputValue.length >= 8 ? true : false,
			number: isNumberRegex.test(inputValue) ? true : false,
			uppercase: oneUppercase.test(inputValue) ? true : false,
			specialChar: specialCharacterRegex.test(inputValue) ? true : false,
		});
	};

	useEffect(() => {
		countPasswordValidationWidth();
	}, [passwordValidity]);

	const countPasswordValidationWidth = () => {
		setPasswordValidationWidth(0);

		if (
			passwordValidity.uppercase ||
			passwordValidity.number ||
			passwordValidity.specialChar ||
			passwordValidity.minChar
		) {
			setPasswordValidationWidth(25);
		}
		if (
			(passwordValidity.uppercase && passwordValidity.number) ||
			(passwordValidity.uppercase && passwordValidity.specialChar) ||
			(passwordValidity.uppercase && passwordValidity.minChar) ||
			(passwordValidity.number && passwordValidity.specialChar) ||
			(passwordValidity.number && passwordValidity.minChar) ||
			(passwordValidity.specialChar && passwordValidity.minChar)
		) {
			setPasswordValidationWidth(50);
		}
		if (
			(passwordValidity.uppercase &&
				passwordValidity.number &&
				passwordValidity.specialChar) ||
			(passwordValidity.uppercase &&
				passwordValidity.specialChar &&
				passwordValidity.minChar) ||
			(passwordValidity.uppercase &&
				passwordValidity.number &&
				passwordValidity.minChar) ||
			(passwordValidity.specialChar &&
				passwordValidity.number &&
				passwordValidity.minChar)
		) {
			setPasswordValidationWidth(75);
		}
		if (
			passwordValidity.uppercase &&
			passwordValidity.number &&
			passwordValidity.specialChar &&
			passwordValidity.minChar
		) {
			setPasswordValidationWidth(100);
		}
	};

	return [passwordValidity, passwordValidationWidth, checkPasswordValidity];
};

export default usePasswordValidation;

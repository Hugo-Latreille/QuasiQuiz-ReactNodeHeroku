import inMemoryJWT from "./inMemoryJwt";

const authProvider = {
	login: ({ username, password }) => {
		const request = new Request(
			"https://quasiquizback.herokuapp.com/api/login",
			{
				method: "POST",
				body: JSON.stringify({ email: username, password: password }),
				headers: new Headers({ "Content-Type": "application/json" }),
				withCredentials: true,
			}
		);
		return fetch(request)
			.then((response) => {
				if (response.status < 200 || response.status >= 300) {
					throw new Error(response.statusText);
				}
				return response.json();
			})
			.then(({ token }) => inMemoryJWT.setToken(token));
	},
	logout: () => {
		inMemoryJWT.eraseToken();
		return Promise.resolve();
	},

	checkAuth: () => {
		return inMemoryJWT.getToken() ? Promise.resolve() : Promise.reject();
	},

	checkError: (error) => {
		const status = error.status;
		if (status === 401 || status === 403) {
			inMemoryJWT.eraseToken();
			return Promise.reject();
		}
		return Promise.resolve();
	},

	getPermissions: () => {
		return inMemoryJWT.getToken() ? Promise.resolve() : Promise.reject();
	},
};

export default authProvider;

import {
	FormEventHandler,
	PropsWithChildren,
	useContext,
	useState,
} from "react";
import "./App.scss";
import * as Auth from "./Authentication";

function App() {
	console.log("App started");

	const [auth, updateUserAuth] = useState<Auth.UserAuthentication>();

	console.log(auth);

	if (!auth) {
		console.log("User auth  undefined");

		try {
			const storedAuth = Auth.loadUserAuthFromStorage();

			updateUserAuth(storedAuth);
			console.log("User auth loaded from storage");
		} catch (err) {
			if (err instanceof Auth.UserAuthNotStoredError) {
				console.log("User Auth not stored, creating new one");
			} else if (err instanceof Auth.UserAuthNotParceableError) {
				console.log("stored User is unparceable");
			}

			const newAuth = Auth.newAuth();
			Auth.saveUserAuthToStorage(newAuth);
			updateUserAuth(newAuth);
		}
	} else console.log("User auth exists ");

	return (
		<main>
			<Auth.UserAuthContext.Provider value={auth ? auth : Auth.newAuth()}>
				<ScreensManager />
			</Auth.UserAuthContext.Provider>
		</main>
	);
}

function ScreensManager() {
	const userAuth = useContext(Auth.UserAuthContext);

	if (userAuth) console.log("screen manager loads game");
	else console.log("screen manager loads login screen");
	return (
		<>{!Auth.isLoggedIn(userAuth) ? <LoginScreen /> : <CookieClicker />}</>
	);
}

function LoginScreen() {
	const [loginValidation, setLoginValidation] = useState(
		Auth.validateLoginInputs({
			username: "",
			password: "",
		})
	);

	const login: FormEventHandler = (event) => {
		event.preventDefault();
		const form = event.target as HTMLFormElement;

		const usernameInputView = form.querySelector(
			"#form-login__email"
		) as HTMLInputElement;

		const passwordInputView = form.querySelector(
			"#form-login__password"
		) as HTMLInputElement;

		const username = usernameInputView.value;
		const password = passwordInputView.value;
		const validationResult = Auth.validateLoginInputs({
			username: username,
			password: password,
		});

		setLoginValidation(validationResult);
	};

	return (
		<div className="login-screen">
			<h1 className="login-screen__title">Login Screen</h1>

			<form className="form" name="form-login" onSubmit={login}>
				<fieldset>
					{loginValidation.isUsernameValidated ? (
						""
					) : (
						<div className="form-login__input-error">⚠️</div>
					)}

					<label htmlFor="form-login__email">Email: </label>
					<input type="email" name="form-login__email" id="form-login__email" />
				</fieldset>

				<fieldset>
					{loginValidation.isUsernameValidated ? (
						""
					) : (
						<div className="form-login__input-error">⚠️</div>
					)}
					<label htmlFor="form-login__password">Password: </label>
					<input
						type="password"
						name="form-login__password"
						id="form-login__password"
					/>
				</fieldset>
				<input type="submit" value="Login" />

				<div className="input-errors">
					<ol className="errors">
						{loginValidation.errors.length === 0
							? ""
							: loginValidation.errors.map((error) => (
									<li className="errors__item">⚠️ {error}</li>
							  ))}
					</ol>
				</div>
			</form>
		</div>
	);
}

function CookieClicker() {
	return (
		<div className="game-screen">
			<h2>Cookie Clicker</h2>
			<menu className="side-bar">
				<SkillToolBar />
				<Companions />
			</menu>
			<CookieTrey />
		</div>
	);
}

function SkillToolBar() {
	return (
		<ul className="skill-toolbar">
			<li>
				<SkillButton>A</SkillButton>
			</li>
			<li>
				<SkillButton>B</SkillButton>
			</li>
			<li>
				<SkillButton>C</SkillButton>
			</li>
			<li>
				<SkillButton>D</SkillButton>
			</li>
			<li>
				<SkillButton>E</SkillButton>
			</li>
		</ul>
	);
}

function SkillButton({ children }: PropsWithChildren) {
	return <button className="skill-button">{children}</button>;
}

function Companions() {
	return (
		<ul>
			<li>Cursor</li>
			<li>Grandma</li>
			<li>Wolf</li>
		</ul>
	);
}

function CookieTrey() {
	const [cookies, setCookies] = useState(0);

	function addCookie() {
		setCookies(cookies + 1);
	}

	return (
		<div className="cookie-trey">
			<div>Cookies: {cookies}</div>
			<button onClick={addCookie}>🍪</button>
		</div>
	);
}

export default App;

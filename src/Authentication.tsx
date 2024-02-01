import * as React from "react";

const STORAGE_USERAUTH = "auth";

export type UserAuthentication = {
	isLogged: boolean;
	username: string | undefined;
};

export const UserAuthContext = React.createContext<UserAuthentication>(
	newAuth()
);

export function newAuth(): UserAuthentication {
	return {
		isLogged: false,
		username: undefined,
	};
}

export class UserAuthNotStoredError extends Error {}
export class UserAuthNotParceableError extends Error {}

export function loadUserAuthFromStorage() {
	const storedUserAuth = localStorage.getItem(STORAGE_USERAUTH);

	if (!storedUserAuth) throw new UserAuthNotStoredError("UserAuth not found");

	try {
		const parsedUserAuth = JSON.parse(storedUserAuth) as UserAuthentication;
		return parsedUserAuth;
	} catch (err) {
		throw new UserAuthNotParceableError(
			"Couldnt parse UserAuth from storage\n" + err
		);
	}
}

export function saveUserAuthToStorage(auth: UserAuthentication) {
	if (!auth)
		throw new Error("Unabele to save an undefined user authentication");

	const rawAuth = JSON.stringify(auth);

	localStorage.setItem(STORAGE_USERAUTH, rawAuth);
}

export function isLoggedIn(userAuth: UserAuthentication) {
	if (!userAuth) throw new Error("Can't validate undefined user auth object");

	return userAuth.isLogged;
}

export type RawLoginInputs = {
	username: string;
	password: string;
};

export type ValidationResult = {
	value: string;
	isValidated: boolean;
	errorMessages: string[];
};

export type LoginValidationResult = {
	isUsernameValidated: boolean;
	isPasswordValidated: boolean;
	errors: string[];
};

export class InvalidValuesError extends Error {}

function validateUsername(username: string) {
	const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	const errorMessages = [];
	if (username === "") errorMessages.push("Email can't be empty!");

	const regexResult = emailRegex.test(username);
	if (!regexResult)
		errorMessages.push("Email must contain domain @ and top-level domain!");

	return {
		value: username,
		isValidated: regexResult,
		errorMessages: errorMessages,
	} as ValidationResult;
}

function validatePassword(password: string) {
	const passowrdRegex =
		/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
	const errorMessages = [];
	if (password === "") errorMessages.push("Password can't be empty!");

	const regexResult = passowrdRegex.test(password);
	if (!regexResult)
		errorMessages.push(
			"Password must contain at least 1 number and a special characters"
		);

	return {
		value: password,
		isValidated: regexResult,
		errorMessages: errorMessages,
	} as ValidationResult;
}

export function validateLoginInputs(rawInputs: RawLoginInputs) {
	const usernameValidation = validateUsername(rawInputs.username);
	const passwordValidation = validatePassword(rawInputs.password);
	const errors = [
		...usernameValidation.errorMessages,
		...passwordValidation.errorMessages,
	];

	return {
		isUsernameValidated: usernameValidation.isValidated,
		isPasswordValidated: passwordValidation.isValidated,
		errors: errors,
	} as LoginValidationResult;
}

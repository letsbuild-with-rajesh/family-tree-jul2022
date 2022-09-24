import React, { useState } from 'react'
import { signIn, signUp, sendPasswordResetUrl } from './utils';
import styles from '../../styles/LoginAndSignUp.module.scss';

const LoginAndSignUp = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const signInHandler = (e) => {
		e.preventDefault();
		signIn(email, password, () => {
			window.location.href = "/familytree";
		});
	};

	const signUpHandler = (e) => {
		e.preventDefault();
		if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email))) {
			alert('Please provide a valid email id');
			return;
		} else if (password.length <= 8) {
			alert('Password must be of length more than 8');
			return;
		}
		signUp(email, password, () => {
			window.location.href = "/familytree";
		});
	};

	const resetPasswordHandler = (e) => {
		e.preventDefault();
		if (!(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email))) {
			alert('Please provide a valid email id');
			return;
		}
		sendPasswordResetUrl(email, () => {
			alert('Password reset email sent! Please reset password and come back')
		});
	}
	
	return (
		<div className={styles.container}>
		<form>
			<h3>Sign In</h3>
			<div>
				<label>Email address:</label>
				<input type="email" onChange={(e)=> setEmail(e.target.value)} value={email}/>
			</div>
			<div>
				<label>Password:</label>
				<input type="password" onChange={(e)=> setPassword(e.target.value)} value={password}/>
			</div>
			<div className={styles.submitBtns}>
				<button type="submit" onClick={signInHandler}>Sign In</button>
				<button type="submit" onClick={signUpHandler}>Sign Up</button>
				<button type="submit" onClick={resetPasswordHandler}>Reset Password</button>
			</div>
		</form>
		</div>
	)
}

export default LoginAndSignUp
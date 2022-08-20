import React, { useState } from 'react';
import styles from '../../styles/DetailsPopper.module.scss';

const DetailsPopper = (props) => {
	const [name, setName] = useState('');
	const [gender, setGender] = useState(null);
	const [dob, setDob] = useState('');
	const [photo, setPhoto] = useState('');

	const { open } = props;

	const submitHandler = (e) => {
		const isValid = name && gender && dob;
		if (isValid) {
			const dobArr = dob.split('-');
			e.preventDefault();
			const payload = {
				name,
				gender,
				dob: `${dobArr[2]}-${dobArr[1]}-${dobArr[0]}`,
				photo,
			};
		}
	}

	if (!open) {
		return null;
	}

	return (
		<div className={styles.overlayContainer}>
			<div className={styles.popperContainer}>
				<h3>Add member details here:</h3>
				<form>
					<div>
						<label>Name:</label>
						<input type="text" value={name} onChange={(e)=>{ setName(e.target.value)}} required/>
					</div>
					<div className={styles.genderRow}>
						<label>Gender:</label>
						<span>
							<span><input type="radio" name="gender" value="male" onClick={()=>setGender('m')} required/>Male</span>
							<span><input type="radio" name="gender" value="female" onClick={()=>setGender('f')} />Female</span>
							<span><input type="radio" name="gender" value="others" onClick={()=>setGender('o')} />Others</span>
						</span>
					</div>
					<div>
						<label>Date of birth:</label>
  					<input type="date" onChange={(e)=>{setDob(e.target.value)}} required/>
					</div>
					<div>
						<label>Photo:</label>
  					<input type="file" accept="image/*" onChange={(e)=>{setPhoto(e.target.files[0])}}/>
					</div>
					<div>
						<button type="submit" onClick={submitHandler}>Save</button>
					</div>
				</form>
			</div>
		</div>
	);
}

export default DetailsPopper;
import React, { useEffect, useRef, useState } from 'react';
import styles from '../../styles/OptionsMenu.module.scss';

const OptionsMenu = () => {
	const [optionsOpen, setOptionsOpen] = useState(false);
	const ref = useRef(null);

	const handleOutsideClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
			setOptionsOpen(false);
    }
  };

	useEffect(()=>{
		document.addEventListener('click', handleOutsideClick, true);
		return () => document.removeEventListener('click', handleOutsideClick, true);
	}, []);

	return (
		<span ref={ref}>
			<button className={styles.moreBtn} onClick={() => { setOptionsOpen(open => !open) }}>More</button>
			{optionsOpen && (
				<div onClick={() => { setOptionsOpen(false) }} className={styles.moreBtnContent}>
					<div>Add</div>
					<div>Edit</div>
					<div>Delete</div>
				</div>
			)}
		</span>
	);
}

export default OptionsMenu;
const Input = ({
	name,
	value,
	label,
	type,
	required,
	setValue,
	checkPasswordValidity,
}) => {
	return (
		<div className="form-group">
			{name === "password" ? (
				<>
					<input
						type={type}
						name={name}
						value={value}
						required={required}
						onChange={(e) => {
							setValue(e.target.value);
							checkPasswordValidity(e.target.value);
						}}
					/>
					<div className="label">{label}</div>
				</>
			) : (
				<>
					<input
						type={type}
						name={name}
						value={value}
						required={required}
						onChange={(e) => setValue(e.target.value)}
					/>
					<div className="label">{label}</div>{" "}
				</>
			)}
		</div>
	);
};

export default Input;

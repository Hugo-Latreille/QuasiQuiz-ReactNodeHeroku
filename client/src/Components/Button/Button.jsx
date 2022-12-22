import "./_button.scss";

const Button = ({ label, onClick, forwardRef }) => {
	return (
		<button onClick={onClick} className="btn" ref={forwardRef}>
			{label}
		</button>
	);
};
export default Button;

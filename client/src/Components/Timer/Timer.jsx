import "./timer.scss";

const Timer = ({ remainingTime, time, forwardRef }) => {
	return (
		<div className="timer-container">
			<div className="circular-timer">
				<svg>
					<circle
						ref={forwardRef}
						key={time}
						className="svgCircle"
						id="circle"
						r="40"
						cx="50"
						cy="50"
					></circle>
				</svg>
				<div className="thin-circle"></div>
			</div>
			<div className="timer-text">{remainingTime} s</div>
		</div>
	);
};

export default Timer;

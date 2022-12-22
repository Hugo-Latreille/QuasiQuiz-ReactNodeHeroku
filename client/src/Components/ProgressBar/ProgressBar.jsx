import { useEffect, useState } from "react";
import "./progressBar.scss";

const ProgressBar = ({ level, progress }) => {
	const [style, setStyle] = useState({});

	useEffect(() => {
		setTimeout(() => {
			// const newStyle = { ...style, opacity: 1, width: `${progress}%` };

			setStyle((prev) => ({ ...prev, opacity: 1, width: `${progress}%` }));
		}, 200);
	}, [progress]);

	const questionLevel = () => {
		if (level === 1) {
			return `levelOne`;
		} else if (level === 2) {
			return `levelTwo`;
		} else {
			return `levelThree`;
		}
	};

	return (
		<div id="progress">
			<div className="progress-bar">
				<div className="progress-bar__bar">
					<div
						className={`progress-bar__progress ${questionLevel()}`}
						key={progress}
						style={style}
					></div>
				</div>
			</div>
		</div>
	);
};

export default ProgressBar;

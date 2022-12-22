import { Skeleton } from "@mui/material";

const Gameskel = () => {
	return (
		<main>
			<div className="game-content">
				<Skeleton variant="circular" animation="wave" width={80} height={80} />
				<div className="game-box">
					<div className="media">
						<Skeleton
							variant="rectangular"
							animation="wave"
							width={250}
							height={150}
						/>
					</div>
					<div className="question">
						<Skeleton
							variant="text"
							animation="wave"
							width={230}
							sx={{ fontSize: "2rem" }}
						/>
					</div>
					<div className="answer">
						<form>
							<Skeleton variant="rectangular" animation="wave" width={200} />
						</form>
					</div>
				</div>
				{/* <Skeleton variant="rectangular" animation="wave" width={80} /> */}
			</div>
			<Skeleton variant="rectangular" animation="wave" />
		</main>
	);
};

export default Gameskel;

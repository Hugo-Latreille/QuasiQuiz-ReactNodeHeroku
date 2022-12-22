import { Skeleton } from "@mui/material";

const Lobbyskel = () => {
	return (
		<main>
			<div className="lobby-content">
				<div className="lobby-title">
					<Skeleton
						variant="text"
						animation="wave"
						width={210}
						sx={{ fontSize: "3rem" }}
					/>
				</div>
				<div className="lobby-gamer">
					<div className="gm-box">
						<Skeleton
							variant="text"
							animation="wave"
							sx={{ fontSize: "2rem" }}
							width={210}
						/>

						<div className="gm-card">
							{/* <div className="gamer-img"> */}
							<Skeleton
								variant="rectangular"
								animation="wave"
								width={80}
								height={80}
							/>
							<Skeleton variant="text" animation="wave" width={80} />
							{/* </div> */}
						</div>
					</div>
					<div className="gamer-box">
						<Skeleton
							variant="text"
							animation="wave"
							width={210}
							sx={{ fontSize: "2rem" }}
						/>
						<div className="gc-grid">
							<div className="gamer-card">
								{/* <div className="gamer-img"> */}
								<Skeleton
									variant="rectangular"
									animation="wave"
									width={60}
									height={60}
								/>
								{/* </div> */}
								<Skeleton variant="text" animation="wave" width={80} />
							</div>
						</div>
					</div>
					<div className="legend">
						<ul>
							<li id="gm-color">
								<Skeleton variant="text" animation="wave" width={80} />
							</li>
							<li id="g-color">
								<Skeleton variant="text" animation="wave" width={80} />
							</li>
							<li id="user-color">
								<Skeleton variant="text" animation="wave" width={80} />
							</li>
						</ul>
					</div>
				</div>

				<Skeleton
					variant="rectangular"
					animation="wave"
					width={90}
					height={30}
				/>
			</div>
		</main>
	);
};

export default Lobbyskel;

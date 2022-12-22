import { Stack, Skeleton } from "@mui/material";

const Palmaskel = () => {
	return (
		<main>
			<div className="palmares-content">
				<div className="title">
					<Skeleton
						variant="text"
						animation="wave"
						width={100}
						sx={{ fontSize: "3rem" }}
					/>
				</div>
				<div className="results-box">
					{/* <div key={user.position} className={cssPosition(user.position)}> */}
					<Skeleton
						variant="rectangular"
						animation="wave"
						width={250}
						height={40}
					/>
					<Skeleton
						variant="rectangular"
						animation="wave"
						width={250}
						height={40}
					/>
					<Skeleton
						variant="rectangular"
						animation="wave"
						width={250}
						height={40}
					/>
					<Skeleton
						variant="rectangular"
						animation="wave"
						width={250}
						height={40}
					/>
					{/* <div className="gamer">
            <Skeleton
              variant="circular"
              animation="wave"
              width={40}
              height={40}
            />
            <Skeleton variant="text" animation="wave" width={80} />
          </div>
          <Skeleton variant="text" animation="wave" width={20} />
          <Skeleton variant="text" animation="wave" width={20} /> */}
				</div>
				<Skeleton variant="rectangular" animation="wave" width={80} />
			</div>
		</main>
	);
};

export default Palmaskel;

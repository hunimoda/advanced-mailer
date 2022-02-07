import classes from "./index.module.css";

const New = () => {
	return (
		<>
			<header className={classes.topHeader}>
				<button>
					<i className="fas fa-times" />
				</button>
				<div className={classes.controls}>
					<button>저장</button>
					<button>완료</button>
				</div>
			</header>
			<main className={classes.workspace}>Letter sheet</main>
			<footer className={classes.toolboxFooter}>
				<div className={classes.toolbox}>
					<button>
						<i className="fas fa-times" />
					</button>
					<button>
						<i className="fas fa-times" />
					</button>
					<button>
						<i className="fas fa-times" />
					</button>
					<button>
						<i className="fas fa-times" />
					</button>
					<button>
						<i className="fas fa-times" />
					</button>
					<button>
						<i className="fas fa-times" />
					</button>
					<button>
						<i className="fas fa-times" />
					</button>
				</div>
			</footer>
		</>
	);
};

export default New;

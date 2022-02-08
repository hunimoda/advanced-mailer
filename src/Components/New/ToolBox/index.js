import classes from "./index.module.css";

const ToolBox = () => {
	return (
		<footer className={classes.footer}>
			<div className={classes.toolbox}>
				<button>%</button>
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
	);
};

export default ToolBox;

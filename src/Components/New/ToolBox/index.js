import classes from "./index.module.css";

const ToolBox = ({ onAspectRatioChange, onSheetColorChange }) => {
	const onChangeAspectRatioClick = () => {
		onAspectRatioChange(Number(window.prompt("종횡비")));
	};

	return (
		<footer className={classes.footer}>
			<div className={classes.toolbox}>
				<button className={classes.button} onClick={onChangeAspectRatioClick}>
					AR
				</button>
				<label className={classes.button} htmlFor="changeSheetColor">
					C
				</label>
				<input
					id="changeSheetColor"
					type="color"
					onChange={(event) => onSheetColorChange(event.target.value)}
				/>
				<button className={classes.button}>
					<i className="fas fa-times" />
				</button>
				<button className={classes.button}>
					<i className="fas fa-times" />
				</button>
				<button className={classes.button}>
					<i className="fas fa-times" />
				</button>
				<button className={classes.button}>
					<i className="fas fa-times" />
				</button>
				<button className={classes.button}>
					<i className="fas fa-times" />
				</button>
			</div>
		</footer>
	);
};

export default ToolBox;

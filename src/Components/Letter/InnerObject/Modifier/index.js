import classes from "./index.module.css";

const Modifier = ({ onTouchMove, isFixed, onDelete, scale, isAligned }) => {
	return (
		<>
			<div
				className={`${classes.border} ${
					isAligned ? classes["border--aligned"] : ""
				}`}
				style={{
					borderWidth: `${1 / scale}px`,
					transform: `translate(-${1 / scale}px, -${1 / scale}px)`,
				}}
			/>
			<button
				className={classes.delete}
				style={{
					transform: `scale(${1 / scale}) translate(-50%, -50%)`,
				}}
				onClick={onDelete}
				onTouchMove={(event) => event.stopPropagation()}
			>
				<i className="fas fa-times" />
			</button>
			{isFixed ? (
				<span
					data-action="resize-fixed-ratio"
					className={classes.resize}
					style={{ transform: `scale(${1 / scale}) translate(50%, 50%)` }}
					onTouchMove={onTouchMove}
				>
					<i className="fas fa-arrows-alt-h" />
				</span>
			) : (
				<>
					<button
						data-action="resize-width"
						className={classes.resizeWidthBtn}
						style={{ transform: `scale(${1 / scale}) translate(50%, -50%)` }}
						onTouchMove={onTouchMove}
					>
						<i className="fas fa-arrows-alt-h" />
					</button>
					<button
						data-action="resize-height"
						className={classes.resizeHeightBtn}
						style={{ transform: `scale(${1 / scale}) translate(50%, 50%)` }}
						onTouchMove={onTouchMove}
					>
						<i className="fas fa-arrows-alt-v" />
					</button>
				</>
			)}
		</>
	);
};

export default Modifier;

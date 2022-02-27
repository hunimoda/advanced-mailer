import classes from "./index.module.css";

const Modifier = ({
	onTouchMove,
	isFixed,
	onDelete,
	onEdit,
	scale,
	isAligned,
	isSquare,
	borderRadius,
}) => {
	return (
		<>
			<div
				className={`${classes.border} ${
					isAligned ? classes["border--aligned"] : ""
				}`}
				style={{
					borderWidth: `${1 / scale}px`,
					transform: `translate(-${1 / scale}px, -${1 / scale}px)`,
					borderRadius: `${borderRadius}px`,
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
			{onEdit && (
				<button
					className={classes.edit}
					style={{
						transform: `scale(${1 / scale}) translate(0, -100%)`,
					}}
					onClick={onEdit}
					onTouchMove={(event) => event.stopPropagation()}
				>
					<i className="fas fa-edit" />
				</button>
			)}
			{isSquare && (
				<>
					<div
						className={classes.topIndicator}
						style={{ transform: `scale(${1 / scale}) translate(-50%, -50%)` }}
					/>
					<div
						className={classes.leftIndicator}
						style={{ transform: `scale(${1 / scale}) translate(-50%, -50%)` }}
					/>
				</>
			)}
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

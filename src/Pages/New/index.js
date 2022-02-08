import { useState } from "react";
import SheetContainer from "../../Components/SheetContainer";
import classes from "./index.module.css";

const ratios = [3 / 4, 1, 4 / 3];

const New = () => {
	const [sheetRatioIdx, setSheetRatioIdx] = useState(0);

	const onChangeRatioClick = () => {
		let newSheetRatioIdx = sheetRatioIdx + 1;

		if (newSheetRatioIdx >= ratios.length) {
			newSheetRatioIdx = 0;
		}

		setSheetRatioIdx(newSheetRatioIdx);
	};

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
			<main className={classes.workspace}>
				<SheetContainer sheetRatio={ratios[sheetRatioIdx]}>Wow</SheetContainer>
			</main>
			<footer className={classes.toolboxFooter}>
				<div className={classes.toolbox}>
					<button onClick={onChangeRatioClick}>%</button>
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

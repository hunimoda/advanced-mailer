import { useState } from "react";
import SheetContainer from "../../Components/SheetContainer";
import classes from "./index.module.css";

const New = () => {
	const [sheetRatio, setSheetRatio] = useState(1);

	const { width: screenWidth, height: screenHeight } = window.screen;

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
				<SheetContainer sheetRatio={0.75}>Wow</SheetContainer>
			</main>
			<footer className={classes.toolboxFooter}>
				<div className={classes.toolbox}>
					<button>1:1</button>
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

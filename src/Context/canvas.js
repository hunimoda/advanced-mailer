import { createContext, useState } from "react";

export const CANVAS_SCALE_FACTOR = 2;

export const CanvasContext = createContext({
	context: null,
	setContext: (context) => {},
	setPen: (size, color) => {},
});

export const CanvasContextProvider = ({ children }) => {
	const [context, _setContext] = useState(null);

	const setContext = (context) => {
		context.strokeStyle = "black";
		context.lineCap = "round";
		context.lineJoin = "round";

		_setContext(context);
	};

	const setPen = (size, color) =>
		_setContext((prev) => {
			return { ...prev, lineWidth: size, strokeStyle: color };
		});

	return (
		<CanvasContext.Provider value={{ context, setContext, setPen }}>
			{children}
		</CanvasContext.Provider>
	);
};

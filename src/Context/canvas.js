import { createContext, useCallback, useState } from "react";

export const CANVAS_SCALE_FACTOR = 2;

export const CanvasContext = createContext({
	canvas: null,
	context: null,
	setContext: (context) => {},
	setPen: (size, color) => {},
});

export const CanvasContextProvider = ({ children }) => {
	const [canvas, setCanvas] = useState(null);
	const [context, _setContext] = useState(null);

	const setContext = useCallback((context) => {
		// context.strokeStyle = "black";
		context.lineCap = "round";
		context.lineJoin = "round";

		_setContext(context);
	}, []);

	const setPen = useCallback(
		(size, color) => {
			context.lineWidth = CANVAS_SCALE_FACTOR * size;
			context.strokeStyle = color;
		},
		[context]
	);

	return (
		<CanvasContext.Provider
			value={{ canvas, setCanvas, context, setContext, setPen }}
		>
			{children}
		</CanvasContext.Provider>
	);
};

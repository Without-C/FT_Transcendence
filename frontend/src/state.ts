const state = {
	username: "somilee",
	profileImg: "https://play-lh.googleusercontent.com/38AGKCqmbjZ9OuWx4YjssAz3Y0DTWbiM5HB0ove1pNBq_o9mtWfGszjZNxZdwt_vgHo=w240-h480-rw",
};

export function getState() {
	return state;
}

export function setState(newState: Partial<typeof state>) {
	Object.assign(state, newState);
}
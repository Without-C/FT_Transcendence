import { getEngine, getScene } from "../core/engineCore";
import { hasGameStarted, getGameState } from "./stateManager";
import { updateGameObjects } from "../game/gameObjects";
import { updateCurrentScreen, renderCurrentScreen } from "../screens/screenManager";

export function startRenderLoop(): void {
	const engine = getEngine();
	const scene = getScene();

	engine.runRenderLoop(() => {
		const delta = engine.getDeltaTime();

		updateCurrentScreen(delta);
		renderCurrentScreen();

		if (hasGameStarted() && getGameState()) {
			updateGameObjects(getGameState()!);
		}

		scene.render();
	});
}

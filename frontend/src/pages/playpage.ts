export function renderPlayPage() {
	const template = `
		<nav class="flex flex-col items-end justify-center min-h-screen text-center gap-6">
			<h2 class="text-3xl font-bold text-white bg-blue-700 py-4 px-10 w-full max-w-3xl">
				CHOOSE PLAY MODE
			</h2>
			<a href="#/play/1p1" data-link class="w-full max-w-3xl bg-[#6C233D] text-left text-white rounded-lg p-6 cursor-pointer">
				<div class="flex items-center gap-4">
					<span class="text-5xl font-bold text-pink-300">1P1</span>
					<div>
					<h3 class="text-2xl font-bold">ONE-ON-ONE</h3>
					<p class="text-sm text-gray-300">CHALLENGE A SINGLE OPPONENT IN A HEAD-TO-HEAD BATTLE</p>
					</div>
				</div>
			</a>
			<a href="#/play/tp" data-link class="w-full max-w-3xl bg-green-800 text-left text-white rounded-lg p-6 cursor-pointer">
				<div class="flex items-center gap-4">
					<span class="text-5xl font-bold text-green-300">T P</span>
					<div>
						<h3 class="text-2xl font-bold">TOURNAMENT PLAYER</h3>
						<p class="text-sm text-gray-300">COMPETE IN A STRUCTURED COMPETITION TO BECOME THE CHAMPION</p>
					</div>
				</div>
			</a>
		</nav>
	`;
  
	return template;
}
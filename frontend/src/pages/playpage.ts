export function renderPlayPage() {
	const template = `
	<div class="flex flex-col items-end min-h-screen justify-center">
		<nav class="h-[60vh] flex flex-col items-end justify-center w-4/5 gap-6 lg:gap-7 xl:gap-8 2xl:gap-9">
			<h2 class="text-3xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold text-white bg-blue-700 rounded-l-lg p-4 lg:p-5 xl:p-6 2xl:p-7 w-full translate-x-[30px]">
			CHOOSE PLAY MODE
			</h2>
		
			<a href="#/play/1p1" data-link class="w-full bg-[#6C233D] text-left text-white rounded-l-lg xl:rounded-l-lg p-6 lg:p-7 xl:p-8 2xl:p-9 cursor-pointer transition-transform duration-300  translate-x-[30px] hover:translate-x-[0px]">
			<div class="flex items-center gap-4">
				<span class="text-5xl lg:text-8xl xl:text-13xl 2xl:text-17xl font-bold text-pink-300">1P1</span>
				<div>
				<h3 class="text-2xl lg:text-3xl xl:text-5xl 2xl:text-7xl font-bold">ONE-ON-ONE</h3>
				<p class="text-sm lg:text-lg xl:text-xl 2xl:text-2xl text-gray-300">CHALLENGE A SINGLE OPPONENT IN A HEAD-TO-HEAD BATTLE</p>
				</div>
			</div>
			</a>
		
			<a href="#/play/tp" data-link class="w-full bg-green-800 text-left text-white rounded-l-lg xl:rounded-l-lg p-6 lg:p-7 xl:p-8 2xl:p-9 cursor-pointer transition-transform duration-300  translate-x-[30px] hover:translate-x-[0px]">
			<div class="flex items-center gap-4">
				<span class="text-5xl lg:text-8xl xl:text-13xl 2xl:text-17xl font-bold text-green-300">TP</span>
				<div>
				<h3 class="text-2xl lg:text-3xl xl:text-5xl 2xl:text-7xl font-bold">TOURNAMENT PLAYER</h3>
				<p class="text-sm lg:text-lg xl:text-xl 2xl:text-2xl text-gray-300">COMPETE IN A STRUCTURED COMPETITION TO BECOME THE CHAMPION</p>
				</div>
			</div>
			</a>
		</nav>
	</div>
	`;
  
	return template;
}
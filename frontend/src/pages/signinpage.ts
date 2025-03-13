export function renderSignInPage() {
  const template = `
	<div class="bg-black text-gray-200 flex justify-center items-center min-h-screen">
	<div class="bg-[#162113] flex flex-col justify-center items-center border border-[#9CCA95] text-[#9CCA95]
				p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 2xl:p-16 
				gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14
				w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl 2xl:max-w-4xl">

		<p class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">Welcome back</p>

		<button onclick="window.location.href='/api/auth/login/42'" 
			class="flex items-center border border-[#9CCA95]
					p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 
					rounded-3xl lg:rounded-[40px] w-full">
			<img src="src/images/42.svg" alt="42" 
				class="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 lg:w-11 lg:h-11">
			<span class="flex-1 text-center text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
				Sign in with 42
			</span>
		</button>
		
		<button onclick="window.location.href='/api/auth/login/github'" 
			class="flex items-center border border-[#9CCA95]
					p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 
					rounded-3xl lg:rounded-[40px] w-full">
			<img src="src/images/git.svg" alt="Github" 
				class="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 lg:w-11 lg:h-11 rounded-full">
			<span class="flex-1 text-center text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
				Sign in with Git
			</span>
		</button>

		<button onclick="window.location.href='/api/auth/login/google'" 
			class="flex items-center border border-[#9CCA95]
					p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 
					rounded-3xl lg:rounded-[40px] w-full">
			<img src="src/images/google.svg" alt="Google" 
				class="w-5 h-5 sm:w-7 sm:h-7 md:w-9 md:h-9 lg:w-11 lg:h-11 rounded-full">
			<span class="flex-1 text-center text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl">
				Sign in with Google
			</span>
		</button>

	</div>
	</div>
  `;

  return template;
}

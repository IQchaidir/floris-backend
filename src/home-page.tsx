export const HomePage = () => (
    <div class="p-4 w-full h-screen justify-center items-center flex bg-gray-200">
        <div class="p-4 bg-white rounded-md shadow-md border border-gray-300 md:w-[40%] flex flex-col">
            <p class="text-black text-center text-3xl font-bold">Welcome to Floris API</p>
            <div class="flex mt-10 flex-col md:flex-row gap-4 md:gap-0 md:justify-around">
                <a
                    href="/docs"
                    target="_blank"
                    class="text-black border border-1 border-gray-300 py-2 px-4 rounded hover:border-cyan-500 hover:text-cyan-500 text-center md:w-[45%]"
                >
                    API Docs
                </a>
                <a
                    href="/ui"
                    target="_blank"
                    class="text-black border border-1 border-gray-300 py-2 px-4 rounded hover:border-cyan-500 hover:text-cyan-500 text-center md:w-[45%]"
                >
                    Swagger UI
                </a>
            </div>
        </div>
    </div>
)

import React from "react";

const News = () => {
  return (
    <div className="bg-[#111111]">
      <div className="h-fit w-screen flex flex-col md:flex-row bg-[#111111] text-white">
        <div className="md:w-[45%] p-4 overflow-y-hidden">
          <div className="text-white pt-4 px-8 max-md:text-center">
            <h1 className="text-[#F6F7FD] text-4xl md:text-7xl lg:text-8xl 2xl:text-9xl pr-1 z-30 max-w-5xl bg-gradient-to-br from-white from-30% via-[#d5d8f6] via-80% to-[#fdf7fe] bg-clip-text text-transparent tracking-tighter pb-2 font-bold hidden md:block">
              Observe.
              <br /> React. <br /> Profit.
            </h1>
            <h1 className="text-[#F6F7FD] text-5xl pr-1 z-30 max-w-5xl bg-gradient-to-br from-white from-30% via-[#d5d8f6] via-80% to-[#fdf7fe] bg-clip-text text-transparent tracking-tighter pb-2 font-bold md:hidden">
              Observe. React. Profit.
            </h1>
            <p className="max-w-screen-md text-slate-300 text-balance pt-2 pb-12 text-sm md:text-base lg:text-lg">
              Keep up with the latest stock trends, breaking market news, and
              expert analysis — all in one place. Stay informed and make smarter
              decisions to maximize your investments with FinSmart.
            </p>
            {/* <div className="flex md:flex-col gap-4 items-start bg-neutral-600 p-3 rounded-md mb-3">
              <div className="w-12 h-12 inline-flex bg-neutral-900 p-2 rounded-md">
                <svg
                  viewBox="0 -18 256 256"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMinYMin meet"
                >
                  <path
                    d="M245.97 168.943c-13.662 7.121-84.434 36.22-99.501 44.075-15.067 7.856-23.437 7.78-35.34 2.09-11.902-5.69-87.216-36.112-100.783-42.597C3.566 169.271 0 166.535 0 163.951v-25.876s98.05-21.345 113.879-27.024c15.828-5.679 21.32-5.884 34.79-.95 13.472 4.936 94.018 19.468 107.331 24.344l-.006 25.51c.002 2.558-3.07 5.364-10.024 8.988"
                    fill="#912626"
                  />
                  <path
                    d="M245.965 143.22c-13.661 7.118-84.431 36.218-99.498 44.072-15.066 7.857-23.436 7.78-35.338 2.09-11.903-5.686-87.214-36.113-100.78-42.594-13.566-6.485-13.85-10.948-.524-16.166 13.326-5.22 88.224-34.605 104.055-40.284 15.828-5.677 21.319-5.884 34.789-.948 13.471 4.934 83.819 32.935 97.13 37.81 13.316 4.881 13.827 8.9.166 16.02"
                    fill="#C6302B"
                  />
                  <path
                    d="M245.97 127.074c-13.662 7.122-84.434 36.22-99.501 44.078-15.067 7.853-23.437 7.777-35.34 2.087-11.903-5.687-87.216-36.112-100.783-42.597C3.566 127.402 0 124.67 0 122.085V96.206s98.05-21.344 113.879-27.023c15.828-5.679 21.32-5.885 34.79-.95C162.142 73.168 242.688 87.697 256 92.574l-.006 25.513c.002 2.557-3.07 5.363-10.024 8.987"
                    fill="#912626"
                  />
                  <path
                    d="M245.965 101.351c-13.661 7.12-84.431 36.218-99.498 44.075-15.066 7.854-23.436 7.777-35.338 2.087-11.903-5.686-87.214-36.112-100.78-42.594-13.566-6.483-13.85-10.947-.524-16.167C23.151 83.535 98.05 54.148 113.88 48.47c15.828-5.678 21.319-5.884 34.789-.949 13.471 4.934 83.819 32.933 97.13 37.81 13.316 4.88 13.827 8.9.166 16.02"
                    fill="#C6302B"
                  />
                  <path
                    d="M245.97 83.653c-13.662 7.12-84.434 36.22-99.501 44.078-15.067 7.854-23.437 7.777-35.34 2.087-11.903-5.687-87.216-36.113-100.783-42.595C3.566 83.98 0 81.247 0 78.665v-25.88s98.05-21.343 113.879-27.021c15.828-5.68 21.32-5.884 34.79-.95C162.142 29.749 242.688 44.278 256 49.155l-.006 25.512c.002 2.555-3.07 5.361-10.024 8.986"
                    fill="#912626"
                  />
                  <path
                    d="M245.965 57.93c-13.661 7.12-84.431 36.22-99.498 44.074-15.066 7.854-23.436 7.777-35.338 2.09C99.227 98.404 23.915 67.98 10.35 61.497-3.217 55.015-3.5 50.55 9.825 45.331 23.151 40.113 98.05 10.73 113.88 5.05c15.828-5.679 21.319-5.883 34.789-.948 13.471 4.935 83.819 32.934 97.13 37.811 13.316 4.876 13.827 8.897.166 16.017"
                    fill="#C6302B"
                  />
                  <path
                    d="M159.283 32.757l-22.01 2.285-4.927 11.856-7.958-13.23-25.415-2.284 18.964-6.839-5.69-10.498 17.755 6.944 16.738-5.48-4.524 10.855 17.067 6.391M131.032 90.275L89.955 73.238l58.86-9.035-17.783 26.072M74.082 39.347c17.375 0 31.46 5.46 31.46 12.194 0 6.736-14.085 12.195-31.46 12.195s-31.46-5.46-31.46-12.195c0-6.734 14.085-12.194 31.46-12.194"
                    fill="#FFF"
                  />
                  <path
                    d="M185.295 35.998l34.836 13.766-34.806 13.753-.03-27.52"
                    fill="#621B1C"
                  />
                  <path
                    d="M146.755 51.243l38.54-15.245.03 27.519-3.779 1.478-34.791-13.752"
                    fill="#9A2928"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-sm">
                  Thanks to Redis for powering our advanced caching of stock
                  news and historical data, enabling real-time, fast access to
                  crucial market insights.
                </h2>
              </div>
            </div> */}
          </div>
        </div>
        <div className="h-full mx-auto xl:mb-0 w-[60%] md:w-[45%] overflow-hidden flex justify-end items-center  xl:left-10 relative my-auto">
          <div className="absolute inset-0 z-10">
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#111111] to-transparent w-[10%]" />
            <div className="absolute inset-y-0 right-0 bg-gradient-to-l from-[#111111] to-transparent w-[10%]" />
          </div>
          <video
            autoPlay
            muted
            loop
            className="w-full object-cover object-center z-0"
          >
            <source src="/videos/news.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
};

export default News;

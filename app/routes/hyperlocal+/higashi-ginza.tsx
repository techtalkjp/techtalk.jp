export default function HigashiGinzaGuide() {
  return (
    <div className="bg-gray-100 text-gray-800">
      <header className="bg-gray-800 p-4 text-center text-white">
        <h1>
          Like a HyperLocal: Your Guide to Making the Most of Higashi-Ginza
        </h1>
      </header>
      <nav className="fixed bottom-0 w-full bg-gray-700">
        <ul className="flex justify-around">
          <li className="flex-1">
            <a
              href="#morning"
              className="block py-2 text-center text-white hover:bg-gray-600"
            >
              Morning
            </a>
          </li>
          <li className="flex-1">
            <a
              href="#late-morning"
              className="block py-2 text-center text-white hover:bg-gray-600"
            >
              Late Morning
            </a>
          </li>
          <li className="flex-1">
            <a
              href="#afternoon"
              className="block py-2 text-center text-white hover:bg-gray-600"
            >
              Afternoon
            </a>
          </li>
          <li className="flex-1">
            <a
              href="#evening"
              className="block py-2 text-center text-white hover:bg-gray-600"
            >
              Evening
            </a>
          </li>
          <li className="flex-1">
            <a
              href="#late-evening"
              className="block py-2 text-center text-white hover:bg-gray-600"
            >
              Late Evening
            </a>
          </li>
          <li className="flex-1">
            <a
              href="#stores"
              className="block py-2 text-center text-white hover:bg-gray-600"
            >
              Stores
            </a>
          </li>
        </ul>
      </nav>
      <main className="mb-16 p-5">
        <section id="morning" className="mb-5 rounded bg-white p-4 shadow">
          <h2 className="mb-3 border-b-2 border-gray-200 pb-2">
            Morning Activities
          </h2>
          <img
            src="https://images.unsplash.com/photo-1490974764272-9f2b89eb0a6c?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dpath/to/your/image.jpg"
            alt="Tsukiji Market"
            className="mb-3 h-48 w-full rounded object-cover"
          />
          <p>Start your day with a visit to Tsukiji Market...</p>
        </section>
        <section id="late-morning" className="mb-5 rounded bg-white p-4 shadow">
          <h2 className="mb-3 border-b-2 border-gray-200 pb-2">
            Late Morning and Early Afternoon
          </h2>
          <img
            src="https://images.unsplash.com/photo-1708166768807-3eaef5bbedc4?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Kabukiza Theatre"
            className="mb-3 h-48 w-full rounded object-cover"
          />
          <p>After breakfast, head to the Kabukiza Theatre...</p>
        </section>
        <section id="afternoon" className="mb-5 rounded bg-white p-4 shadow">
          <h2 className="mb-3 border-b-2 border-gray-200 pb-2">Afternoon</h2>
          <img
            src="https://plus.unsplash.com/premium_photo-1665669263840-6da4bf7fc974?q=80&w=2371&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Ginza Café"
            className="mb-3 h-48 w-full rounded object-cover"
          />
          <p>Take a break at one of Ginza’s historic cafés...</p>
        </section>
        <section id="evening" className="mb-5 rounded bg-white p-4 shadow">
          <h2 className="mb-3 border-b-2 border-gray-200 pb-2">Evening</h2>
          <img
            src="https://images.unsplash.com/photo-1617870314635-fc819547ec11?q=80&w=2370&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Local Izakaya"
            className="mb-3 h-48 w-full rounded object-cover"
          />
          <p>Experience Tokyo’s nightlife by dining at a local izakaya...</p>
        </section>
        <section id="late-evening" className="mb-5 rounded bg-white p-4 shadow">
          <h2 className="mb-3 border-b-2 border-gray-200 pb-2">Late Evening</h2>
          <img
            src="https://images.unsplash.com/photo-1509035215080-6bee8a3d357a?q=80&w=2385&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Night Stroll in Ginza"
            className="mb-3 h-48 w-full rounded object-cover"
          />
          <p>End your day with a leisurely night stroll through Ginza...</p>
        </section>
        <section id="stores" className="mb-5 rounded bg-white p-4 shadow">
          <h2 className="mb-3 border-b-2 border-gray-200 pb-2">
            Convenience Stores and Drugstores
          </h2>
          <img
            src="https://images.unsplash.com/photo-1680721647782-2991e63e14a9?q=80&w=2487&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Convenience Stores"
            className="mb-3 h-48 w-full rounded object-cover"
          />
          <p>Find 24-hour convenience stores like 7-Eleven, Lawson...</p>
        </section>
      </main>
      <footer className="bg-gray-800 py-4 text-center text-white">
        <p>Explore Higashi-Ginza like a hyperlocal and enjoy your stay!</p>
      </footer>
    </div>
  )
}

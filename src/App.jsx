// src/App.jsx
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect,
} from "react";
import TinderCard from "react-tinder-card";
import {
  FaHeart,
  FaTimes,
  FaCat,
  FaDownload,
  FaShareAlt,
  FaSpinner,
  FaRedo,
} from "react-icons/fa";

const CAT_COUNT = 10;

export default function App() {
  /* cats state */
  const [cats, setCats] = useState([]);
  const [likedCats, setLikedCats] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isFinished, setIsFinished] = useState(false);
  const [lastDirection, setLastDirection] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const currentIndexRef = useRef(currentIndex);

  /* preload cats */
  useEffect(() => {
    const loadCats = async () => {
      try {
        const list = await Promise.all(
          Array.from({ length: CAT_COUNT }).map(async (_, i) => {
            const url = `https://cataas.com/cat?width=400&height=500&rand=${Math.random()}`;
            const res = await fetch(url, { cache: "no-store" });
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);

            return {
              id: i,
              originalUrl: url,
              blob,
              blobUrl,
            };
          })
        );

        setCats(list);
        setCurrentIndex(list.length - 1);
        currentIndexRef.current = list.length - 1;
        
        // ensure a small delay before setting isReady to true
        setTimeout(() => setIsReady(true), 500);
      } catch (err) {
        console.error("Failed to load cats", err);
      }
    };

    loadCats();

    return () => {
      cats.forEach((c) => URL.revokeObjectURL(c.blobUrl));
    };
  }, []);

  const updateCurrentIndex = useCallback((val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  }, []);

  /* refs */
  const childRefs = useMemo(
    () => new Array(cats.length).fill(0).map(() => React.createRef()),
    [cats.length]
  );

  /* swipe logic */
  const swiped = useCallback(
    (direction, cat, index) => {
      // only proceed if the swiped card is the current one
      if (index !== currentIndexRef.current) return;

      setLastDirection(direction);

      if (direction === "right") {
        setLikedCats((prev) => [...prev, cat]);
      }

      if (currentIndexRef.current === 0) {
        setTimeout(() => setIsFinished(true), 300);
      }

      updateCurrentIndex(index - 1);
    },
    [updateCurrentIndex]
  );

  const swipe = useCallback(
    async (dir) => {
      if (isReady && currentIndexRef.current >= 0 && childRefs[currentIndexRef.current].current) {
        await childRefs[currentIndexRef.current].current.swipe(dir);
      }
    },
    [childRefs, isReady]
  );

  /* keyboard */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isFinished || !isReady) return;
      if (e.key === "ArrowLeft") swipe("left");
      if (e.key === "ArrowRight") swipe("right");
    };
    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, [isFinished, swipe, isReady]);

  /* download */
  const handleSaveImage = (cat) => {
    const link = document.createElement("a");
    link.href = cat.blobUrl;
    link.download = `kitty_${cat.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* styles injection */
  const globalStyles = `
    @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in-up {
        animation: fadeInUp 0.4s ease-out forwards;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: #ddd;
      border-radius: 3px;
    }
  `;

  /* Loading View */
  if (cats.length === 0 || !isReady) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500">
        <FaSpinner className="animate-spin text-4xl mb-4 text-pink-500" />
        <p className="font-medium tracking-wide">Summoning Kittens...</p>
        <style>{globalStyles}</style>
      </div>
    );
  }

  /* Finished View */
  if (isFinished) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6">
        <h1 className="text-3xl font-extrabold mb-8 text-gray-800 flex items-center gap-3">
          <FaCat className="text-pink-500" /> Collection
        </h1>

        <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
          <p className="text-center text-gray-600 mb-6 font-medium">
            You adopted <span className="text-pink-500 font-bold">{likedCats.length}</span> cats today!
          </p>

          {likedCats.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-gray-400">
              <FaCat className="text-6xl mb-4 opacity-20" />
              <p>Maybe next time? 😿</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 max-h-[55vh] overflow-y-auto pr-2 custom-scrollbar">
              {likedCats.map((cat) => (
                <div
                  key={cat.id}
                  className="group relative rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-gray-100"
                >
                  <img
                    src={cat.blobUrl}
                    alt="Liked cat"
                    className="w-full aspect-square object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 backdrop-blur-[2px]">
                    <button
                      onClick={() => handleSaveImage(cat)}
                      className="p-2 bg-white/20 rounded-full text-white hover:bg-white/40 transition-colors"
                      title="Download"
                    >
                      <FaDownload />
                    </button>
                    <button
                      onClick={() => {
                          if (navigator.share) {
                            navigator.share({ title: "Cat", url: cat.originalUrl });
                          } else {
                            navigator.clipboard.writeText(cat.originalUrl);
                            alert("Link copied!");
                          }
                      }}
                      className="p-2 bg-white/20 rounded-full text-white hover:bg-white/40 transition-colors"
                      title="Share"
                    >
                      <FaShareAlt />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <button
            onClick={() => location.reload()}
            className="mt-8 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <FaRedo /> Play Again
          </button>
        </div>
        <style>{globalStyles}</style>
      </div>
    );
  }

  /* Main View */
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
      
      <div className="absolute top-6 flex flex-col items-center z-0">
        <h1 className="text-2xl font-black text-gray-800 tracking-tight flex items-center gap-2">
           Purrfect Match
        </h1>
        <div className="mt-2 h-1.5 w-32 bg-gray-200 rounded-full overflow-hidden">
            <div 
                className="h-full bg-pink-500 transition-all duration-300 ease-out"
                style={{ width: `${((currentIndex + 1) / CAT_COUNT) * 100}%` }}
            />
        </div>
      </div>

      <div className="relative w-full max-w-sm h-[480px] flex items-center justify-center mt-8">
        {cats.map((cat, index) =>
          index > currentIndex ? null : (
            <TinderCard
              key={cat.id}
              ref={childRefs[index]}
              onSwipe={(dir) => swiped(dir, cat, index)}
              swipeRequirementType="position"
              swipeThreshold={100} 
              preventSwipe={["up", "down"]}
              className="absolute w-[90%] max-w-[340px] h-[440px] cursor-grab active:cursor-grabbing"
              style={{ 
                  zIndex: cats.length - index,
                  pointerEvents: index === currentIndex ? 'auto' : 'none'
              }}
            >
              <div 
                className="w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white relative select-none"
                style={{
                    transform: index === currentIndex ? 'scale(1)' : 'scale(0.96) translateY(10px)',
                    transition: 'transform 0.3s ease',
                    opacity: index === currentIndex ? 1 : 0.5,
                }}
              >
                <img
                  src={cat.blobUrl}
                  alt="Cat"
                  draggable={false}
                  className="w-full h-full object-cover pointer-events-none"
                />
                
                <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>
            </TinderCard>
          )
        )}
      </div>

      <div className="flex gap-8 mt-10 items-center justify-center z-10">
        <button
          onClick={() => swipe("left")}
          className="group relative w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-100 
                     transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-xl"
        >
          <FaTimes className="text-3xl text-red-400 group-hover:text-red-500 transition-colors" />
        </button>

        <button
          onClick={() => swipe("right")}
          className="group relative w-16 h-16 flex items-center justify-center bg-white rounded-full shadow-lg border border-gray-100 
                     transition-all duration-200 hover:scale-110 active:scale-95 hover:shadow-xl"
        >
          <FaHeart className="text-3xl text-green-400 group-hover:text-green-500 transition-colors" />
        </button>
      </div>

      <div className="h-8 mt-4"> 
        {lastDirection && (
            <span
            key={lastDirection + currentIndex} 
            className={`inline-block px-4 py-1 rounded-full text-sm font-bold shadow-sm animate-fade-in-up ${
                lastDirection === "right" 
                ? "bg-green-100 text-green-600 border border-green-200" 
                : "bg-red-100 text-red-600 border border-red-200"
            }`}
            >
            {lastDirection === "right" ? "Like! 😻" : "Nope 😿"}
            </span>
        )}
      </div>
      
      <style>{globalStyles}</style>
    </div>
  );
}
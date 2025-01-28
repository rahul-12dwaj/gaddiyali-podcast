import { useState, useEffect, useRef } from "react";
import { EpisodeCard } from "../components/EpisodeCard";
import { Episode } from "../types";
import { useAuthStore } from "../store/useAuthStore";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "./style.css";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

export const Home = () => {
  const { user } = useAuthStore();
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null); // Store the selected season
  const scrollRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      setLoading(true);
      try {
        const episodesCollection = collection(db, "episodes");
        const episodeSnapshot = await getDocs(episodesCollection);
        const episodeList = episodeSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          seasonNumber: Number(doc.data().seasonNumber),
        }));
        episodeList.sort(
          (a, b) =>
            b.seasonNumber - a.seasonNumber || b.episodeNumber - a.episodeNumber
        );
        setEpisodes(episodeList);
      } catch (error) {
        console.error("Error fetching episodes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEpisodes();
  }, []);

  const handleWatchLater = async (episodeId: string) => {
    if (!user) {
      alert("Please log in to add to Watch Later.");
      return;
    }
    console.log(`Added episode ${episodeId} to Watch Later`);
  };

  // Function to handle season filter change
  const handleSeasonChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSeason(Number(event.target.value));
  };

  // Filter episodes by selected season
  const filteredEpisodes = selectedSeason
    ? episodes.filter((episode) => episode.seasonNumber === selectedSeason)
    : episodes;

  const renderPlaylist = (
    title: string,
    episodes: Episode[],
    index: number
  ) => (
    <div className="relative mb-8">
      <h2 className="text-2xl font-bold mb-4 dark:text-white">{title}</h2>

      {/* Season selection dropdown */}
      <div className="mb-4">
        <label
          htmlFor="season-select"
          className="mr-2 text-lg font-semibold dark:text-white"
        >
          Select Season:
        </label>
        <select
          id="season-select"
          value={selectedSeason ?? ""}
          onChange={handleSeasonChange}
          className="p-2 border-gray-300 rounded-md dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Seasons</option>
          {/* Dynamically generate options from unique seasons */}
          {[...new Set(episodes.map((episode) => episode.seasonNumber))].map(
            (season) => (
              <option key={season} value={season}>
                Season {season}
              </option>
            )
          )}
        </select>
      </div>

      <div
        ref={(el) => (scrollRefs.current[index] = el)}
        className="scroll-container"
      >
        {episodes.length > 0 ? (
          episodes.map((episode) => (
            <div key={episode.id} className="min-w-[14%] flex-shrink-0">
              <EpisodeCard
                episode={episode}
                onWatchLater={() => handleWatchLater(episode.id)}
              />
            </div>
          ))
        ) : (
          <div className="text-gray-500 dark:text-gray-300">
            Coming Soon....
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {loading && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
          <div className="spinner-border text-white" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="relative overflow-hidden mb-12 rounded-lg">
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          modules={[Pagination, Autoplay]}
          className="h-64 sm:h-72 md:h-80 lg:h-96"
        >
          <SwiperSlide>
            <div className="relative w-full h-full">
              <LazyLoadImage
                src="https://i.pinimg.com/originals/3d/d9/39/3dd93961a25fc617c3b023da0440739d.jpg"
                alt="Image 1"
                className="w-full h-full object-cover rounded-md"
                effect="blur"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-white">
                  Welcome To Gaddiyali Podcast!
                </h1>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="relative w-full h-full">
              <LazyLoadImage
                src="https://images.pexels.com/photos/755401/pexels-photo-755401.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Image 2"
                className="w-full h-full object-cover rounded-lg"
                effect="blur"
                wrapperClassName="w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-white">
                  Exclusively Podcasts!
                </h1>
              </div>
            </div>
          </SwiperSlide>
          {/* Slide 3 */}
          <SwiperSlide>
            <div className="relative w-full h-full">
              <LazyLoadImage
                src="https://images.pexels.com/photos/1312464/pexels-photo-1312464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Image 3"
                className="w-full h-full object-cover rounded-lg"
                effect="blur"
                wrapperClassName="w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-white">
                  POWERED BY <i>"CHOLA DORA"</i>
                </h1>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>

      {/* Playlist Section */}
      {renderPlaylist("Recent Podcasts", filteredEpisodes, 0)}
      {renderPlaylist(
        "Podcasts with Artists",
        filteredEpisodes.filter((ep) => ep.category === "Artist"),
        1
      )}
      {renderPlaylist(
        "Podcasts with Politicians",
        filteredEpisodes.filter((ep) => ep.category === "Politician"),
        2
      )}
    </div>
  );
};

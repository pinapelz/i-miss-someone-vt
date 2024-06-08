"use client";
import { useEffect, useState } from "react";
import VideoCard from "@/components/VideoCard";
import Navbar from "@/components/Navbar";

export default function SchedulePage() {
  const [upcomingVideoData, setUpcomingVideoData] = useState<
    UpcomingVideoData[] | null
  >(null);

  useEffect(() => {
    const getUpcomingVideoData = async () => {
      const response = await fetch("/api/upcoming", {});
      if (!response.ok) {
        console.log(response.statusText);
      }
      const data = await response.json();
      setUpcomingVideoData(data.scheduled_videos);
    };
    getUpcomingVideoData();
  }, []);

  return (
    <div className="container mx-auto text-center">
      <h1 className="text-5xl font-bold mt-8">Schedule</h1>
      <p className="text-2xl mt-2">
        Lets hope that the schedule is up to date...
      </p>
      <div className="mt-8">
        <img
          src={`https://img.youtube.com/vi/${process.env.NEXT_PUBLIC_SCHEDULE_THUMBNAIL}/maxresdefault.jpg`}
          alt="Schedule Thumbnail"
          className="mx-auto rounded-lg shadow-lg w-screen"
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 px-2">
        {upcomingVideoData
          ?.sort(
            (a, b) =>
              new Date(a.scheduled_time).getTime() -
              new Date(b.scheduled_time).getTime()
          )
          .map((video) => (
            <div
              className="transform transition duration-500 ease-in-out hover:scale-105"
              key={video.video_id}
            >
              <VideoCard
                thumbnail={`https://img.youtube.com/vi/${video.video_id}/maxresdefault.jpg`}
                title={video.title}
                startTime={new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                  timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                }).format(new Date(video.scheduled_time))}
              />
            </div>
          ))}
      </div>
      <div className="mt-4 text-lg">
        <p>{Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
        <Navbar />
      </div>
    </div>
  );
}

interface UpcomingVideoData {
  title: string;
  type: string;
  scheduled_time: string;
  channel_name: string;
  video_id: string;
}
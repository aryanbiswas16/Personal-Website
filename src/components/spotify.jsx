import React, { useEffect, useState } from 'react';
import { Spotify } from "react-spotify-embed"
import { Fade } from "react-awesome-reveal"
import { getNowPlaying, getRecentlyPlayed, getTopTracks } from '../utils/spotify';
import "../styles/spotify.css";

const SpotifyDisplay = () => {
    const [nowPlaying, setNowPlaying] = useState(null);
    const [recentlyPlayed, setRecentlyPlayed] = useState(null);
    const [topTracks, setTopTracks] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [nowPlayingData, recentlyPlayedData, topTracksData] = await Promise.all([
                    getNowPlaying(),
                    getRecentlyPlayed(),
                    getTopTracks()
                ]);

                setNowPlaying(nowPlayingData);
                setRecentlyPlayed(recentlyPlayedData);
                setTopTracks(topTracksData);
            } catch (error) {
                console.error('Error fetching Spotify data:', error);
            }
        };

        fetchData();
        // Refresh data every minute
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div id="spotify">
            <div className="section-header">
                <span className="section-title">/ now playing</span>
            </div>
            
            {nowPlaying ? (
                <div className="now-playing-container">
                    <Fade duration={1000} delay={1000} triggerOnce>
                        <div className="now-playing-header">
                            <p>Currently Playing</p>
                            <div className="center">
                                <div className="wave"></div>
                                <div className="wave"></div>
                                <div className="wave"></div>
                                <div className="wave"></div>
                                <div className="wave"></div>
                                <div className="wave"></div>
                                <div className="wave"></div>
                                <div className="wave"></div>
                                <div className="wave"></div>
                                <div className="wave"></div>
                            </div>
                        </div>
                    </Fade>
                    <Fade direction="up" duration={1000} delay={1000} triggerOnce>
                        <Spotify 
                            className="now-playing-track"
                            link={`https://open.spotify.com/track/${nowPlaying.id}`} 
                            wide
                        />
                    </Fade>
                </div>
            ) : null}

            {recentlyPlayed ? ( 
                <div className="recently-played-container">
                    <Fade duration={1000} delay={1000} triggerOnce>
                        <p>Recently Played</p>
                    </Fade>
                    {recentlyPlayed.map((track, i) => (
                        <Fade key={track.songID} direction="up" duration={1000} delay={1000 + (i*100)} triggerOnce>
                            <Spotify 
                                className="track" 
                                wide 
                                link={`https://open.spotify.com/track/${track.songID}`} 
                            />
                        </Fade>
                    ))}
                </div>
            ) : null}
            
            {topTracks ? (
                <div className="top-tracks-container">
                    <Fade duration={1000} delay={1000} triggerOnce>
                        <p>Top Tracks This Month</p>
                    </Fade>
                    {topTracks.map((track, i) => (
                        <Fade key={track.songID} direction="up" duration={1000} delay={1000 + (i*100)} triggerOnce>
                            <Spotify 
                                className="track" 
                                wide 
                                link={`https://open.spotify.com/track/${track.songID}`} 
                            />
                        </Fade>
                    ))}
                </div>
            ) : null}
        </div>
    ) 
}

export default SpotifyDisplay
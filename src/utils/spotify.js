import {
    refreshToken,
    basic,
    NOW_PLAYING_ENDPOINT,
    TOP_TRACKS_ENDPOINT,
    RECENTLY_PLAYED_ENDPOINT,
    TOKEN_ENDPOINT
} from '../config/spotify';

const getAccessToken = async () => {
    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        }),
    });

    return response.json();
};

export const getNowPlaying = async () => {
    const { access_token } = await getAccessToken();

    const response = await fetch(NOW_PLAYING_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (response.status === 204 || response.status > 400) {
        return null;
    }

    const song = await response.json();
    return {
        id: song.item.id,
        title: song.item.name,
        artist: song.item.artists.map((_artist) => _artist.name).join(', '),
        album: song.item.album.name,
        albumImageUrl: song.item.album.images[0].url,
        isPlaying: song.is_playing,
    };
};

export const getRecentlyPlayed = async () => {
    const { access_token } = await getAccessToken();

    const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (response.status === 204 || response.status > 400) {
        return null;
    }

    const { items } = await response.json();
    return items.slice(0, 5).map((track) => ({
        songID: track.track.id,
        title: track.track.name,
        artist: track.track.artists.map((_artist) => _artist.name).join(', '),
    }));
};

export const getTopTracks = async () => {
    const { access_token } = await getAccessToken();

    const response = await fetch(TOP_TRACKS_ENDPOINT, {
        headers: {
            Authorization: `Bearer ${access_token}`,
        },
    });

    if (response.status === 204 || response.status > 400) {
        return null;
    }

    const { items } = await response.json();
    return items.slice(0, 5).map((track) => ({
        songID: track.id,
        title: track.name,
        artist: track.artists.map((_artist) => _artist.name).join(', '),
    }));
}; 
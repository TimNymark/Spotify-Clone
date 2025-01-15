import { Box, List, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import PlaylistItem from '../components/PlaylistItem/PlaylistItem';

const Library = ({ token, spotifyApi }) => {

        const [playlists, setPlaylists] = useState([]);
        const [loading, setLoading] = useState(true);
    
        useEffect(() => {
            async function getPlaylist() {
                if (!spotifyApi) return;
    
                const data = await spotifyApi.getUserPlaylists();
                setPlaylists(data.body.items);
                setLoading(false);
            }
    
            getPlaylist();
        }, [spotifyApi, token]);

        const renderPlaylistItems = () => {
            if (loading) {
                return [1,2,3,4,5,6,7].map((e, i) => <PlaylistItem loading={loading} key={i}/>)
            }

            return playlists.map((playlist, i) => <PlaylistItem key={i} loading={loading} {...playlist}/>)
        }

	return (
		<Box
			id="Library"
			px={3}
			sx={{
				display: { xs: 'flex', md: 'none' },
				backgroundColor: 'background.default',
				flex: 1,
				flexDirection: 'column',
				owerflowY: 'auto'
			}}
		>
            <Typography py={3} sx={{ color: "text.primary", fontSize: 30 }}>
                Ditt Bibliotek
            </Typography>
            <List>
            {renderPlaylistItems()}
            </List>
        </Box>
	);
};

export default Library;

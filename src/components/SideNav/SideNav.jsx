import { useEffect, useState } from 'react';
import { Box, Divider } from '@mui/material';
import NavItem from '../NavItem/NavItem';
import HomeIcon from '@mui/icons-material/Home';
import NavPlaylist from '../NavPlaylist/NavPlaylist';

const SideNav = ({ spotifyApi, token }) => {
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

	const renderPlaylist = () => {
		if (loading) {
			return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((_, i) => <NavPlaylist key={i} loading={loading} />);
		}
		return playlists
		.filter(playlist => playlist && playlist.name && playlist.id) 
		.map((playlist, i) => {
			console.log(playlist.name);
			return <NavPlaylist name={playlist.name} id={playlist.id} loading={loading} key={i} />;
		});
	};

	return (
		<Box
			sx={{
				backgroundColor: 'background.default',
				width: 230,
				height: '100%',
				display: {xs:"none", md: "flex"},
				flexDirection: 'column',
			}}
		>
			<Box p={3}>
				<img src="/Spotify_Logo.png" alt="Spotify Logo" width={'75%'} />
			</Box>
			<NavItem name="home" Icon={HomeIcon} target="/" />
			<Box px={3} py={1}>
				<Divider sq={{ backgroundColor: '#ffffff40' }} />
			</Box>
			<Box sz={{ overflowY: 'auto', flex: 1 }}>{renderPlaylist()}</Box>
		</Box>
	);
};

export default SideNav;

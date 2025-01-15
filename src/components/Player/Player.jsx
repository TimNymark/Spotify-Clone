import { Box, Grid, Typography, Avatar } from '@mui/material';
import { useEffect, useState } from 'react';
import PlayerControls from '../PlayerControls/PlayerControls';
import VolumeControls from '../VolumeControls/VolumeControls';
import PlayerOverlay from '../PlayerOverlay/PlayerOverlay';

const Player = ({ spotifyApi, token }) => {
	const [localPlayer, setLoacalPlayer] = useState();
	const [isPaused, setIsPaused] = useState(false);
	const [currentTrack, setCurrentTrack] = useState();
	const [device, setDevice] = useState();
	const [duration, setDuration] = useState();
	const [progress, setProgress] = useState();
	const [active, setActive] = useState();
	const [playerOverlayIsOpen, setPlayerOverlayIsOpen] = useState(false);

	useEffect(() => {
		const script = document.createElement('script');
		script.src = 'https://sdk.scdn.co/spotify-player.js';
		script.async = true;

		document.body.appendChild(script);

		window.onSpotifyWebPlaybackSDKReady = () => {
			const player = new window.Spotify.Player({
				name: 'Webbpage Player',
				getOAuthToken: (cb) => {
					cb(token);
				},
				volume: 0.5
			});

			player.addListener('ready', ({ device_id }) => {
				console.log('Ready with Device ID', device_id);
				setDevice(device_id);
				setLoacalPlayer(player);
			});

			player.addListener('not_ready', ({ device_id }) => {
				console.log('Device ID has gone offline', device_id);
			});

			player.addListener('player_state_changed', (state) => {
				console.log(state);
				if (!state || !state.track_window?.current_track) {
					return;
				}
				console.log(state.track_window.current_track);

				const duration = state.track_window.current_track.duration_ms / 1000;
				const progress = state.position / 1000;
				setDuration(duration);
				setProgress(progress);
				setIsPaused(state.paused);
				setCurrentTrack(state.track_window.current_track);

				player.getCurrentState().then((state) => {
					!state ? setActive(false) : setActive(true);
				});
			});

			player.connect();
		};
	}, []);

	useEffect(() => {
		if (!localPlayer) return;
		async function connect() {
			await localPlayer.connect();
		}

		connect();
		return () => {
			localPlayer.disconnect();
		};
	}, [localPlayer]);

	// useEffect(( ) => {
	// 	const transferPlayback = async () => {
	// 		if (device) {
	// 			const res= await spotifyApi.getMyDevices();
	// 			console.log(res);
	// 			await spotifyApi.transferMyPlayback([device], false);
	// 		}
	// 	}
	// 	transferPlayback();
	// }, [device, spotifyApi]);

	return (
		<Box>
			<Grid
				onClick={() => {
					setPlayerOverlayIsOpen((prevstate) => !prevstate);
				}}
				container
				px={3}
				sx={{
					backgroundColor: 'background.paper',
					height: 100,
					cursor: { xs: 'pointer', md: 'auto' },
					width: '100%',
					borderTop: '1px solid #292929'
				}}
			>
				<Grid xs={12} md={4} item sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
					<Avatar
						src={currentTrack?.album.images[0].url}
						alt={currentTrack?.album.name}
						variant="square"
						sx={{ width: 56, height: 56, marginRight: 2 }}
					/>
					<Box>
						<Typography sx={{ color: 'text.primary', fontsize: 14 }}>{currentTrack?.name}</Typography>
						<Typography sx={{ color: 'text.secondary', fontsize: 10 }}>
							{currentTrack?.artists[0].name}
						</Typography>
					</Box>
				</Grid>
				<Grid
					sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'center', alignItems: 'center' }}
					md={4}
					item
				>
					{active ? (
						<PlayerControls
							isPaused={isPaused}
							duration={duration}
							progress={progress}
							player={localPlayer}
						/>
					) : (
						<Box>Please transfer Playback</Box>
					)}
				</Grid>
				<Grid
					xs={6}
					md={4}
					item
					sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', justifyContent: 'flex-end' }}
				>
					<VolumeControls player={localPlayer} />
				</Grid>
			</Grid>
			<PlayerOverlay
				playerOverlayIsOpen={playerOverlayIsOpen}
				closeOverlay={() => setPlayerOverlayIsOpen(false)}
				progress={progress}
				isPaused={isPaused}
				duration={duration}
				player={localPlayer}
				currentTrack={currentTrack}
				active={active}
			/>
		</Box>
	);
};

export default Player;

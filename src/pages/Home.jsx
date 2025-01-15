import { Box, Button } from "@mui/material";

const Home = () => {
    return <Box sx ={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 5
    }}>
        <img src="/profilbild.jpg" alt="Techover" style = {{maxWidth: "50%", maxHeight: "50%", borderRadius: "50%"}}/>
        <Button size="large" variant= "contained" href =  "https://www.linkedin.com/in/tim-erik-nymark-5a009b2b6/">
            Contact Me
        </Button>
    </Box>
}

export default Home;
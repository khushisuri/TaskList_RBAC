import { Box, Button, Typography, useTheme } from "@mui/material";
import Flexbetween from "../components/Flexbetween.tsx";
import SunnyIcon from "@mui/icons-material/Sunny";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "../../state.tsx";
import { useNavigate } from "react-router-dom";
import { type RootState } from "../../types.tsx";
const Navbar = () => {
  const mode = useSelector((state: RootState) => state.app.mode);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Box
      sx={{ backgroundColor: theme.palette.primary.light }}
      padding="0.5rem 2rem"
      color={theme.palette.text.primary}
    >
      <Flexbetween>
        <Typography variant="h2" sx={{ fontWeight: "600" }}>
          Tasklist
        </Typography>
        <Box display={"flex"} alignItems={"center"}>
          {mode === "light" ? (
            <DarkModeIcon
              onClick={() => dispatch(setMode("dark"))}
              sx={{ cursor: "pointer" }}
            />
          ) : (
            <SunnyIcon
              onClick={() => dispatch(setMode("light"))}
              sx={{ cursor: "pointer" }}
            />
          )}
          <Button
            sx={{ color: theme.palette.text.primary }}
            onClick={() => {
              dispatch(setLogout());
              navigate("/");
            }}
          >
            Logout
          </Button>
        </Box>
      </Flexbetween>
    </Box>
  );
};

export default Navbar;

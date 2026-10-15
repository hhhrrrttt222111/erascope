import type SvgIcon from "@mui/material/SvgIcon";
type SvgIconComponent = typeof SvgIcon;
import Alarm from "@mui/icons-material/Alarm";
import AutoAwesome from "@mui/icons-material/AutoAwesome";
import Bed from "@mui/icons-material/Bed";
import BreakfastDining from "@mui/icons-material/BreakfastDining";
import Coffee from "@mui/icons-material/Coffee";
import Commute from "@mui/icons-material/Commute";
import Computer from "@mui/icons-material/Computer";
import DirectionsBus from "@mui/icons-material/DirectionsBus";
import DirectionsCar from "@mui/icons-material/DirectionsCar";
import DirectionsWalk from "@mui/icons-material/DirectionsWalk";
import ElectricCar from "@mui/icons-material/ElectricCar";
import Email from "@mui/icons-material/Email";
import Face from "@mui/icons-material/Face";
import Forum from "@mui/icons-material/Forum";
import Headphones from "@mui/icons-material/Headphones";
import Home from "@mui/icons-material/Home";
import Laptop from "@mui/icons-material/Laptop";
import LocalFireDepartment from "@mui/icons-material/LocalFireDepartment";
import MusicNote from "@mui/icons-material/MusicNote";
import Navigation from "@mui/icons-material/Navigation";
import Newspaper from "@mui/icons-material/Newspaper";
import Phone from "@mui/icons-material/Phone";
import Place from "@mui/icons-material/Place";
import Print from "@mui/icons-material/Print";
import Radio from "@mui/icons-material/Radio";
import Restaurant from "@mui/icons-material/Restaurant";
import Schedule from "@mui/icons-material/Schedule";
import Shower from "@mui/icons-material/Shower";
import Smartphone from "@mui/icons-material/Smartphone";
import SolarPower from "@mui/icons-material/SolarPower";
import Theaters from "@mui/icons-material/Theaters";
import ThumbUp from "@mui/icons-material/ThumbUp";
import Train from "@mui/icons-material/Train";
import Tram from "@mui/icons-material/Tram";
import Tv from "@mui/icons-material/Tv";
import WbTwilight from "@mui/icons-material/WbTwilight";
import Work from "@mui/icons-material/Work";
import type { TechCategory } from "../../data/types";

/**
 * Icons available to the `icon` field in era JSON. Importing all MUI icons would
 * bloat the bundle, so add the name to the import and the map when JSON needs a new icon.
 */
export const iconMap: Record<string, SvgIconComponent> = {
  Alarm, AutoAwesome, Bed, BreakfastDining, Coffee, Commute, Computer, DirectionsBus, DirectionsCar,
  DirectionsWalk, ElectricCar, Email, Face, Forum, Headphones, Home, Laptop, LocalFireDepartment,
  MusicNote, Navigation, Newspaper, Phone, Place, Print, Radio, Restaurant, Schedule, Shower,
  Smartphone, SolarPower, Theaters, ThumbUp, Train, Tram, Tv, WbTwilight, Work,
};

export const getIcon = (name?: string): SvgIconComponent => (name && iconMap[name]) || Schedule;

export const categoryIcon: Record<TechCategory, SvgIconComponent> = {
  communication: Forum,
  entertainment: Theaters,
  home: Home,
  transport: Commute,
  work: Work,
};

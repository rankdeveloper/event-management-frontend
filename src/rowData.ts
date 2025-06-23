import music from "./assets/music.avif";
import sports from "./assets/sports.avif";
import meetup from "./assets/meetup.avif";
import conference from "./assets/conference.jpg";

import { faTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

export const categories = [
  "Sports",
  "Music",
  "Conference",
  "Workshop",
  "Meetup",
  "Sports",
  "Social",
  "Other",
];

export const EVENTS_GALLERY = [
  { id: 1, url: music, name: "Music" },
  { id: 2, url: sports, name: "Sports" },
  { id: 3, url: meetup, name: "Meetup" },
  { id: 4, url: conference, name: "Conference" },
] as const;

export const SOCIAL_ICONS = [
  { name: "Twitter", icon: faTwitter },
  { name: "Linkedin", icon: faLinkedin },
  { name: "Email", icon: faEnvelope },
] as const;

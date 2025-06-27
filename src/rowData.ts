import music from "./assets/music.avif";
import sports from "./assets/sports.avif";
import meetup from "./assets/meetup.avif";
import conference from "./assets/conference.jpg";

import { faTwitter, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faGoogle,
  faAirbnb,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";

import { Calendar, Users, MapPin } from "lucide-react";
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
  { name: "Twitter", icon: faTwitter, link: "https://twitter.com/" },
  { name: "Linkedin", icon: faLinkedin, link: "https://www.linkedin.com/" },
  { name: "Email", icon: faEnvelope, link: "mailto:iamrankush@gmail.com" },
] as const;

export const faq = [
  {
    question: "What is the purpose of this website?",
    answer:
      "This website is designed to help you manage and plan events, including conferences, weddings, and other gatherings.",
  },
  {
    question: "How do I create an account on this website?",
    answer:
      "To create an account, simply click on the 'Sign Up' button and follow the prompts to enter your email address, password, and other details.",
  },
  {
    question: "What types of events can I plan on this website?",
    answer:
      "You can plan a wide range of events on this website, including conferences, weddings, birthday parties, and more.",
  },
  {
    question: "How do I create a new event on this website?",
    answer:
      "To create a new event, click on the 'Create Event' button and follow the prompts to enter details such as the event name, date, time, and location.",
  },
  {
    question: "Can I invite guests to my event through this website?",
    answer:
      "Yes, you can invite guests to your event by creating a guest list and sending out invitations through the website.",
  },

  {
    question: "What if I encounter technical issues while using this website?",
    answer:
      "If you encounter technical issues, please contact our customer support team for assistance.",
  },

  {
    question: "Can I access this website on my mobile device?",
    answer:
      "Yes, our website is mobile-friendly and can be accessed on a variety of devices.",
  },
  {
    question: "How do I contact the event organizer or customer support team?",
    answer:
      "You can contact us through the website's contact form, or by emailing [insert email address].",
  },
];

export const trustedBy_icons = [
  {
    name: "Github",
    icon: faGithub,
    className: "hover:text-black transition-all duration-300",
  },
  {
    name: "Linkedin",
    icon: faLinkedin,
    className: "hover:text-blue-500 transition-all duration-300",
  },
  {
    name: "Google",
    icon: faGoogle,
    className: "hover:text-red-500 transition-all duration-300",
  },
  {
    name: "Airbnb",
    icon: faAirbnb,
    className: "hover:text-red-500 transition-all duration-300",
  },
  {
    name: "Facebook",
    icon: faFacebook,
    className: "hover:text-blue-500 transition-all duration-300",
  },
];

export const EventHome = [
  {
    title: "Create Events",
    icon: Calendar,
    desc: " Easily create and manage your event with our intuitive interface.",
  },

  {
    title: "Connect with Others",
    icon: Users,
    desc: "Join events and connect with people who share your interests.",
  },

  {
    title: "Find Local Events",
    icon: MapPin,
    desc: "Discover events happening in your area and get involved.",
  },
];

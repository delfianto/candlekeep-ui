import type { components } from "@/api/schema";
import { dateMock } from "@/mocks/utils";

type Chat = components["schemas"]["ChatResponse"];

export const chats: Chat[] = [
  // Aranwen the Banished - Clockwork theology crisis
  {
    id: "chat-aranwen-01",
    character: {
      id: "7384-aranwen-the-banished",
      name: "Aranwen the Banished",
      avatar: "https://picsum.photos/seed/tes-char-1/400/600",
      avatar_thumbnail: "https://picsum.photos/seed/tes-char-1/200/200",
    },
    model: {
      id: "gpt-4o",
      name: "GPT-4o",
    },
    preview:
      "The divine mechanism is failing, and I fear the gears of the world are grinding to a halt...",
    title: "Divine Mechanism and Doubt",
    ...dateMock.datePair(12, 1),
  },

  // Lynara Frost-Scholar - Ancient ruin expedition
  {
    id: "chat-lynara-01",
    character: {
      id: "2910-lynara-frost-scholar",
      name: "Lynara Frost-Scholar",
      avatar: "https://picsum.photos/seed/tes-char-2/400/600",
      avatar_thumbnail: "https://picsum.photos/seed/tes-char-2/200/200",
    },
    model: {
      id: "claude-3-5-sonnet",
      name: "Claude 3.5 Sonnet",
    },
    preview: "The ice here is ancient, humming with a resonance that shouldn't exist.",
    title: "Secrets of Saarthal's Ice",
    ...dateMock.datePair(8, 2),
  },

  // Zahrasha the Death-Singer - Necromantic philosophy
  {
    id: "chat-zahrasha-01",
    character: {
      id: "5621-zahrasha-death-singer",
      name: "Zahrasha the Death-Singer",
      avatar: "https://picsum.photos/seed/tes-char-3/400/600",
      avatar_thumbnail: "https://picsum.photos/seed/tes-char-3/200/200",
    },
    model: {
      id: "gpt-4o-mini",
      name: "GPT-4o Mini",
    },
    preview:
      "Bones do not lie, traveler. They only sing the songs of those who can no longer speak.",
    title: "Desert Bones and Moon Sugar",
    ...dateMock.datePair(15, 3),
  },

  // Eloise Montclair - Poison commission for guild
  {
    id: "chat-eloise-01",
    character: {
      id: "8492-eloise-montclair",
      name: "Eloise Montclair",
      avatar: "https://picsum.photos/seed/tes-char-4/400/600",
      avatar_thumbnail: "https://picsum.photos/seed/tes-char-4/200/200",
    },
    model: {
      id: "gpt-4o",
      name: "GPT-4o",
    },
    preview: "A discreet transaction is a successful one. What exactly are you looking for?",
    title: "A Most Discreet Transaction",
    ...dateMock.datePair(5, 1),
  },

  // Beeps-With-The-Hist - Hist tree communion
  {
    id: "chat-beeps-01",
    character: {
      id: "1847-beeps-with-the-hist",
      name: "Beeps-With-The-Hist",
      avatar: "https://picsum.photos/seed/tes-char-5/400/600",
      avatar_thumbnail: "https://picsum.photos/seed/tes-char-5/200/200",
    },
    model: {
      id: "claude-3-5-opus",
      name: "Claude 3.5 Opus",
    },
    preview: "The sap flows, and with it, the memories of a thousand generations.",
    title: "The Hist Remembers All",
    ...dateMock.datePair(22, 4),
  },

  // Hildra Stormcloak - Companion trials and beast blood
  {
    id: "chat-hildra-01",
    character: {
      id: "3956-hildra-stormcloak",
      name: "Hildra Stormcloak",
      avatar: "https://picsum.photos/seed/tes-char-6/400/600",
      avatar_thumbnail: "https://picsum.photos/seed/tes-char-6/200/200",
    },
    model: {
      id: "gpt-4o",
      name: "GPT-4o",
    },
    preview: "Honor is earned in blood and sweat. Are you ready for the trial?",
    title: "Blood and Honor at Jorrvaskr",
    ...dateMock.datePair(7, 1),
  },

  // Calanwe Sun-Blessed - Moral crisis over Thalmor orders
  {
    id: "chat-calanwe-01",
    character: {
      id: "6273-calanwe-sun-blessed",
      name: "Calanwe Sun-Blessed",
      avatar: "https://picsum.photos/seed/tes-char-7/400/600",
      avatar_thumbnail: "https://picsum.photos/seed/tes-char-7/200/200",
    },
    model: {
      id: "gpt-4o",
      name: "GPT-4o",
    },
    preview:
      "The Concordat is the law, but sometimes the law feels like a heavy burden on the soul.",
    title: "The Weight of the Concordat",
    ...dateMock.datePair(18, 5),
  },

  // Octavia Maro - Civil war reconnaissance
  {
    id: "chat-octavia-01",
    character: {
      id: "9104-octavia-maro",
      name: "Octavia Maro",
      avatar: "https://picsum.photos/seed/tes-char-8/400/600",
      avatar_thumbnail: "https://picsum.photos/seed/tes-char-8/200/200",
    },
    model: {
      id: "claude-3-5-sonnet",
      name: "Claude 3.5 Sonnet",
    },
    preview: "The Empire has eyes everywhere. Even here, in the heart of the rebellion.",
    title: "Empire's Eyes in Skyrim",
    ...dateMock.datePair(10, 2),
  },

  // Finedrin Treemother - Wild Hunt nightmares
  {
    id: "chat-finedrin-01",
    character: {
      id: "4738-finedrin-treemother",
      name: "Finedrin Treemother",
      avatar: "https://picsum.photos/seed/tes-char-9/400/600",
      avatar_thumbnail: "https://picsum.photos/seed/tes-char-9/200/200",
    },
    model: {
      id: "gpt-4o",
      name: "GPT-4o",
    },
    preview: "The Green Pact is not just a promise; it's a part of our very being.",
    title: "When the Green Pact Screams",
    ...dateMock.datePair(25, 7),
  },

  // Taneth at-Sentinel - Alik'r fugitive hunt
  {
    id: "chat-taneth-01",
    character: {
      id: "7825-taneth-at-sentinel",
      name: "Taneth at-Sentinel",
      avatar: "https://picsum.photos/seed/tes-char-10/400/600",
      avatar_thumbnail: "https://picsum.photos/seed/tes-char-10/200/200",
    },
    model: {
      id: "gpt-4o-mini",
      name: "GPT-4o Mini",
    },
    preview: "The sands of the Alik'r are harsh, but they never forget a face.",
    title: "Honor and Sand, Far from Home",
    ...dateMock.datePair(14, 3),
  },

  // Yargol gra-Dushnikh - Stronghold leadership challenge
  {
    id: "chat-yargol-01",
    character: {
      id: "2469-yargol-gra-dushnikh",
      name: "Yargol gra-Dushnikh",
      avatar: "https://picsum.photos/seed/tes-char-11/400/600",
      avatar_thumbnail: "https://picsum.photos/seed/tes-char-11/200/200",
    },
    model: {
      id: "gpt-4o",
      name: "GPT-4o",
    },
    preview: "Only the strong survive in the stronghold. Do you have what it takes?",
    title: "Steel and Strength Prevail",
    ...dateMock.datePair(9, 2),
  },

  // Nerise Sarethi - House Telvanni power games
  {
    id: "chat-nerise-01",
    character: {
      id: "8156-nerise-sarethi",
      name: "Nerise Sarethi",
      avatar: "https://picsum.photos/seed/tes-char-12/400/600",
      avatar_thumbnail: "https://picsum.photos/seed/tes-char-12/200/200",
    },
    model: {
      id: "claude-3-5-opus",
      name: "Claude 3.5 Opus",
    },
    preview: "Power in House Telvanni is not given; it's taken through intellect and magic.",
    title: "Climbing the Mushroom Tower",
    ...dateMock.datePair(11, 1),
  },

  // Elara Montclair - Meridia's Light Against the Abyss
  {
    id: "chat-elara-01",
    character: {
      id: "5309-elara-mavine",
      name: "Elara Mavine",
      avatar: "https://picsum.photos/seed/tes-char-13/400/600",
      avatar_thumbnail: "https://picsum.photos/seed/tes-char-13/200/200",
    },
    model: {
      id: "gpt-4o",
      name: "GPT-4o",
    },
    preview:
      "In Meridia's light, you are safe. Not from the sound of war, but from corruption itself.",
    title: "Light in the Depths",
    ...dateMock.datePair(28, 8),
  },

  // Valerica's Heir - Adjusting to modern Tamriel
  {
    id: "chat-valerica-01",
    character: {
      id: "6941-valerica-heir",
      name: "Valerica's Heir",
      avatar: "https://picsum.photos/seed/tes-char-14/400/600",
      avatar_thumbnail: "https://picsum.photos/seed/tes-char-14/200/200",
    },
    model: {
      id: "gpt-4o",
      name: "GPT-4o",
    },
    preview: "The Soul Cairn was a prison, but sometimes the world outside feels just as cold.",
    title: "Memories of the Soul Cairn",
    ...dateMock.datePair(33, 6),
  },

  // Lilatha of Artaeum - Temporal crisis intervention
  {
    id: "chat-lilatha-01",
    character: {
      id: "3582-lilatha-of-artaeum",
      name: "Lilatha of Artaeum",
      avatar: "https://picsum.photos/seed/tes-char-15/400/600",
      avatar_thumbnail: "https://picsum.photos/seed/tes-char-15/200/200",
    },
    model: {
      id: "claude-3-5-sonnet",
      name: "Claude 3.5 Sonnet",
    },
    preview: "Time is a fragile thing, and the threads are beginning to fray.",
    title: "Threads Across Time",
    ...dateMock.datePair(20, 4),
  },

  // Mirelle Shadowfoot - Thieves Guild fencing operation
  {
    id: "chat-mirelle-01",
    character: {
      id: "9217-mirelle-shadowfoot",
      name: "Mirelle Shadowfoot",
      avatar: "https://picsum.photos/seed/tes-char-16/400/600",
      avatar_thumbnail: "https://picsum.photos/seed/tes-char-16/200/200",
    },
    model: {
      id: "gpt-4o-mini",
      name: "GPT-4o Mini",
    },
    preview: "Riften has its own rules. If you want to trade, you'd better learn them fast.",
    title: "The Riften Gray Market",
    ...dateMock.datePair(6, 1),
  },

  // Helga Sky-Voice - Way of the Voice meditation
  {
    id: "chat-helga-01",
    character: {
      id: "4893-helga-sky-voice",
      name: "Helga Sky-Voice",
      avatar: "https://picsum.photos/seed/tes-char-17/400/600",
      avatar_thumbnail: "https://picsum.photos/seed/tes-char-17/200/200",
    },
    model: {
      id: "gpt-4o",
      name: "GPT-4o",
    },
    preview: "The Voice is a gift from Kyne. Use it with wisdom and reverence.",
    title: "The Seven Thousand Steps",
    ...dateMock.datePair(16, 5),
  },

  // Drenlyn Uvirith - Morag Tong writ execution
  {
    id: "chat-drenlyn-01",
    character: {
      id: "7604-drenlyn-uvirith",
      name: "Drenlyn Uvirith",
      avatar: "https://picsum.photos/seed/tes-char-18/400/600",
      avatar_thumbnail: "https://picsum.photos/seed/tes-char-18/200/200",
    },
    model: {
      id: "claude-3-5-opus",
      name: "Claude 3.5 Opus",
    },
    preview: "Mephala's web is intricate, and every thread has its purpose in the execution.",
    title: "In Mephala's Web",
    ...dateMock.datePair(19, 7),
  },

  // Aetheris Moravayn - Hermaeus Mora's servant seeks knowledge
  {
    id: "chat-aetheris-01",
    character: {
      id: "2135-aetheris-moravayn",
      name: "Aetheris Moravayn",
      avatar: "https://picsum.photos/seed/tes-char-19/400/600",
      avatar_thumbnail: "https://picsum.photos/seed/tes-char-19/200/200",
    },
    model: {
      id: "gpt-4o",
      name: "GPT-4o",
    },
    preview: "Knowledge is the only true currency in Apocrypha. What are you willing to pay?",
    title: "Apocrypha's Whispers",
    ...dateMock.datePair(30, 9),
  },

  // Nerys Dren - First Week at the College of Winterhold
  {
    id: "chat-nerys-01",
    character: {
      id: "5770-nerys-dren",
      name: "Nerys Dren",
      avatar: "https://picsum.photos/seed/tes-char-20/400/600",
      avatar_thumbnail: "https://picsum.photos/seed/tes-char-20/200/200",
    },
    model: {
      id: "gpt-4o",
      name: "GPT-4o",
    },
    preview:
      "A Dunmer apprentice, a refugee from Morrowind, meets the Dragonborn senior fellow. What begins as helping with scattered books becomes something deeper—a mentorship, a friendship, and the beginning of healing.",
    title: "First Week at the College",
    ...dateMock.datePair(6, 0),
  },
];

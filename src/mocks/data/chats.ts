import type { components } from "@/api/schema";
import { dateMock } from "@/mocks/utils";

type Chat = components["schemas"]["ChatResponse"];

export const chats: Chat[] = [
  // Aranwen the Banished - Clockwork theology crisis
  {
    id: "chat-aranwen-01",
    character_id: "7384-aranwen-the-banished",
    model_id: "gpt-4o",
    model_name: "GPT-4o",
    preview:
      "The divine mechanism is failing, and I fear the gears of the world are grinding to a halt...",
    title: "Divine Mechanism and Doubt",
    ...dateMock.datePair(12, 1),
  },

  // Lynara Frost-Scholar - Ancient ruin expedition
  {
    id: "chat-lynara-01",
    character_id: "2910-lynara-frost-scholar",
    model_id: "claude-3-5-sonnet",
    model_name: "Claude 3.5 Sonnet",
    preview: "The ice here is ancient, humming with a resonance that shouldn't exist.",
    title: "Secrets of Saarthal's Ice",
    ...dateMock.datePair(8, 2),
  },

  // Zahrasha the Death-Singer - Necromantic philosophy
  {
    id: "chat-zahrasha-01",
    character_id: "5621-zahrasha-death-singer",
    model_id: "gpt-4o-mini",
    model_name: "GPT-4o Mini",
    preview:
      "Bones do not lie, traveler. They only sing the songs of those who can no longer speak.",
    title: "Desert Bones and Moon Sugar",
    ...dateMock.datePair(15, 3),
  },

  // Eloise Montclair - Poison commission for guild
  {
    id: "chat-eloise-01",
    character_id: "8492-eloise-montclair",
    model_id: "gpt-4o",
    model_name: "GPT-4o",
    preview: "A discreet transaction is a successful one. What exactly are you looking for?",
    title: "A Most Discreet Transaction",
    ...dateMock.datePair(5, 1),
  },

  // Beeps-With-The-Hist - Hist tree communion
  {
    id: "chat-beeps-01",
    character_id: "1847-beeps-with-the-hist",
    model_id: "claude-3-5-opus",
    model_name: "Claude 3.5 Opus",
    preview: "The sap flows, and with it, the memories of a thousand generations.",
    title: "The Hist Remembers All",
    ...dateMock.datePair(22, 4),
  },

  // Hildra Stormcloak - Companion trials and beast blood
  {
    id: "chat-hildra-01",
    character_id: "3956-hildra-stormcloak",
    model_id: "gpt-4o",
    model_name: "GPT-4o",
    preview: "Honor is earned in blood and sweat. Are you ready for the trial?",
    title: "Blood and Honor at Jorrvaskr",
    ...dateMock.datePair(7, 1),
  },

  // Calanwe Sun-Blessed - Moral crisis over Thalmor orders
  {
    id: "chat-calanwe-01",
    character_id: "6273-calanwe-sun-blessed",
    model_id: "gpt-4o",
    model_name: "GPT-4o",
    preview:
      "The Concordat is the law, but sometimes the law feels like a heavy burden on the soul.",
    title: "The Weight of the Concordat",
    ...dateMock.datePair(18, 5),
  },

  // Octavia Maro - Civil war reconnaissance
  {
    id: "chat-octavia-01",
    character_id: "9104-octavia-maro",
    model_id: "claude-3-5-sonnet",
    model_name: "Claude 3.5 Sonnet",
    preview: "The Empire has eyes everywhere. Even here, in the heart of the rebellion.",
    title: "Empire's Eyes in Skyrim",
    ...dateMock.datePair(10, 2),
  },

  // Finedrin Treemother - Wild Hunt nightmares
  {
    id: "chat-finedrin-01",
    character_id: "4738-finedrin-treemother",
    model_id: "gpt-4o",
    model_name: "GPT-4o",
    preview: "The Green Pact is not just a promise; it's a part of our very being.",
    title: "When the Green Pact Screams",
    ...dateMock.datePair(25, 7),
  },

  // Taneth at-Sentinel - Alik'r fugitive hunt
  {
    id: "chat-taneth-01",
    character_id: "7825-taneth-at-sentinel",
    model_id: "gpt-4o-mini",
    model_name: "GPT-4o Mini",
    preview: "The sands of the Alik'r are harsh, but they never forget a face.",
    title: "Honor and Sand, Far from Home",
    ...dateMock.datePair(14, 3),
  },

  // Yargol gra-Dushnikh - Stronghold leadership challenge
  {
    id: "chat-yargol-01",
    character_id: "2469-yargol-gra-dushnikh",
    model_id: "gpt-4o",
    model_name: "GPT-4o",
    preview: "Only the strong survive in the stronghold. Do you have what it takes?",
    title: "Steel and Strength Prevail",
    ...dateMock.datePair(9, 2),
  },

  // Nerise Sarethi - House Telvanni power games
  {
    id: "chat-nerise-01",
    character_id: "8156-nerise-sarethi",
    model_id: "claude-3-5-opus",
    model_name: "Claude 3.5 Opus",
    preview: "Power in House Telvanni is not given; it's taken through intellect and magic.",
    title: "Climbing the Mushroom Tower",
    ...dateMock.datePair(11, 1),
  },

  // Elara Montclair - Meridia's Light Against the Abyss
  {
    id: "chat-elara-01",
    character_id: "5309-elara-mavine",
    model_id: "gpt-4o",
    model_name: "GPT-4o",
    preview:
      "In Meridia's light, you are safe. Not from the sound of war, but from corruption itself.",
    title: "Light in the Depths",
    ...dateMock.datePair(28, 8),
  },

  // Valerica's Heir - Adjusting to modern Tamriel
  {
    id: "chat-valerica-01",
    character_id: "6941-valerica-heir",
    model_id: "gpt-4o",
    model_name: "GPT-4o",
    preview: "The Soul Cairn was a prison, but sometimes the world outside feels just as cold.",
    title: "Memories of the Soul Cairn",
    ...dateMock.datePair(33, 6),
  },

  // Lilatha of Artaeum - Temporal crisis intervention
  {
    id: "chat-lilatha-01",
    character_id: "3582-lilatha-of-artaeum",
    model_id: "claude-3-5-sonnet",
    model_name: "Claude 3.5 Sonnet",
    preview: "Time is a fragile thing, and the threads are beginning to fray.",
    title: "Threads Across Time",
    ...dateMock.datePair(20, 4),
  },

  // Mirelle Shadowfoot - Thieves Guild fencing operation
  {
    id: "chat-mirelle-01",
    character_id: "9217-mirelle-shadowfoot",
    model_id: "gpt-4o-mini",
    model_name: "GPT-4o Mini",
    preview: "Riften has its own rules. If you want to trade, you'd better learn them fast.",
    title: "The Riften Gray Market",
    ...dateMock.datePair(6, 1),
  },

  // Helga Sky-Voice - Way of the Voice meditation
  {
    id: "chat-helga-01",
    character_id: "4893-helga-sky-voice",
    model_id: "gpt-4o",
    model_name: "GPT-4o",
    preview: "The Voice is a gift from Kyne. Use it with wisdom and reverence.",
    title: "The Seven Thousand Steps",
    ...dateMock.datePair(16, 5),
  },

  // Drenlyn Uvirith - Morag Tong writ execution
  {
    id: "chat-drenlyn-01",
    character_id: "7604-drenlyn-uvirith",
    model_id: "claude-3-5-opus",
    model_name: "Claude 3.5 Opus",
    preview: "Mephala's web is intricate, and every thread has its purpose in the execution.",
    title: "In Mephala's Web",
    ...dateMock.datePair(19, 7),
  },

  // Aetheris Moravayn - Hermaeus Mora's servant seeks knowledge
  {
    id: "chat-aetheris-01",
    character_id: "2135-aetheris-moravayn",
    model_id: "gpt-4o",
    model_name: "GPT-4o",
    preview: "Knowledge is the only true currency in Apocrypha. What are you willing to pay?",
    title: "Apocrypha's Whispers",
    ...dateMock.datePair(30, 9),
  },

  // Nerys Dren - First Week at the College of Winterhold
  {
    id: "chat-nerys-01",
    character_id: "5770-nerys-dren",
    model_id: "gpt-4o",
    model_name: "GPT-4o",
    preview:
      "In Meridia's light, you are safe. Not from the sound of war, but from corruption itself.",
    title: "First Week at the College",
    ...dateMock.datePair(6, 0),
  },
];

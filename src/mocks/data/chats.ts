import type { components } from "@/api/schema";
import { dateMock, idMock } from "@/mocks/data/utils";

type Chat = components["schemas"]["ChatResponse"];

export const chats: Chat[] = [
  // Aranwen the Banished - Clockwork theology crisis
  {
    id: idMock.generateChatId("7384-aranwen-the-banished"),
    character_id: "7384-aranwen-the-banished",
    model_id: "gpt-4o",
    title: "Divine Mechanism and Doubt",
    ...dateMock.datePair(12, 1),
  },

  // Lynara Frost-Scholar - Ancient ruin expedition
  {
    id: idMock.generateChatId("2910-lynara-frost-scholar"),
    character_id: "2910-lynara-frost-scholar",
    model_id: "claude-4-5-sonnet",
    title: "Secrets of Saarthal's Ice",
    ...dateMock.datePair(8, 2),
  },

  // Zahrasha the Death-Singer - Necromantic philosophy
  {
    id: idMock.generateChatId("5621-zahrasha-death-singer"),
    character_id: "5621-zahrasha-death-singer",
    model_id: "gpt-4o-mini",
    title: "Desert Bones and Moon Sugar",
    ...dateMock.datePair(15, 3),
  },

  // Eloise Montclair - Poison commission for guild
  {
    id: idMock.generateChatId("8492-eloise-montclair"),
    character_id: "8492-eloise-montclair",
    model_id: "gpt-4o",
    title: "A Most Discreet Transaction",
    ...dateMock.datePair(5, 1),
  },

  // Beeps-With-The-Hist - Hist tree communion
  {
    id: idMock.generateChatId("1847-beeps-with-the-hist"),
    character_id: "1847-beeps-with-the-hist",
    model_id: "claude-4-5-opus",
    title: "The Hist Remembers All",
    ...dateMock.datePair(22, 4),
  },

  // Hildra Stormcloak - Companion trials and beast blood
  {
    id: idMock.generateChatId("3956-hildra-stormcloak"),
    character_id: "3956-hildra-stormcloak",
    model_id: "gpt-4o",
    title: "Blood and Honor at Jorrvaskr",
    ...dateMock.datePair(7, 1),
  },

  // Calanwe Sun-Blessed - Moral crisis over Thalmor orders
  {
    id: idMock.generateChatId("6273-calanwe-sun-blessed"),
    character_id: "6273-calanwe-sun-blessed",
    model_id: "gpt-5",
    title: "The Weight of the Concordat",
    ...dateMock.datePair(18, 5),
  },

  // Octavia Maro - Civil war reconnaissance
  {
    id: idMock.generateChatId("9104-octavia-maro"),
    character_id: "9104-octavia-maro",
    model_id: "claude-4-5-sonnet",
    title: "Empire's Eyes in Skyrim",
    ...dateMock.datePair(10, 2),
  },

  // Finedrin Treemother - Wild Hunt nightmares
  {
    id: idMock.generateChatId("4738-finedrin-treemother"),
    character_id: "4738-finedrin-treemother",
    model_id: "gpt-4o",
    title: "When the Green Pact Screams",
    ...dateMock.datePair(25, 7),
  },

  // Taneth at-Sentinel - Alik'r fugitive hunt
  {
    id: idMock.generateChatId("7825-taneth-at-sentinel"),
    character_id: "7825-taneth-at-sentinel",
    model_id: "gpt-4o-mini",
    title: "Honor and Sand, Far from Home",
    ...dateMock.datePair(14, 3),
  },

  // Yargol gra-Dushnikh - Stronghold leadership challenge
  {
    id: idMock.generateChatId("2469-yargol-gra-dushnikh"),
    character_id: "2469-yargol-gra-dushnikh",
    model_id: "gpt-4o",
    title: "Steel and Strength Prevail",
    ...dateMock.datePair(9, 2),
  },

  // Nerise Sarethi - House Telvanni power games
  {
    id: idMock.generateChatId("8156-nerise-sarethi"),
    character_id: "8156-nerise-sarethi",
    model_id: "claude-4-5-opus",
    title: "Climbing the Mushroom Tower",
    ...dateMock.datePair(11, 1),
  },

  // Morella the Hollow - Namira's blessing in sewers
  {
    id: idMock.generateChatId("5309-morella-the-hollow"),
    character_id: "5309-morella-the-hollow",
    model_id: "gpt-4o",
    title: "Beauty in the Decay Below",
    ...dateMock.datePair(28, 8),
  },

  // Valerica's Heir - Adjusting to modern Tamriel
  {
    id: idMock.generateChatId("6941-valerica-heir"),
    character_id: "6941-valerica-heir",
    model_id: "gpt-5-chat",
    title: "Memories of the Soul Cairn",
    ...dateMock.datePair(33, 6),
  },

  // Lilatha of Artaeum - Temporal crisis intervention
  {
    id: idMock.generateChatId("3582-lilatha-of-artaeum"),
    character_id: "3582-lilatha-of-artaeum",
    model_id: "claude-4-5-sonnet",
    title: "Threads Across Time",
    ...dateMock.datePair(20, 4),
  },

  // Mirelle Shadowfoot - Thieves Guild fencing operation
  {
    id: idMock.generateChatId("9217-mirelle-shadowfoot"),
    character_id: "9217-mirelle-shadowfoot",
    model_id: "gpt-4o-mini",
    title: "The Riften Gray Market",
    ...dateMock.datePair(6, 1),
  },

  // Helga Sky-Voice - Way of the Voice meditation
  {
    id: idMock.generateChatId("4893-helga-sky-voice"),
    character_id: "4893-helga-sky-voice",
    model_id: "gpt-4o",
    title: "The Seven Thousand Steps",
    ...dateMock.datePair(16, 5),
  },

  // Drenlyn Uvirith - Morag Tong writ execution
  {
    id: idMock.generateChatId("7604-drenlyn-uvirith"),
    character_id: "7604-drenlyn-uvirith",
    model_id: "claude-4-5-opus",
    title: "In Mephala's Web",
    ...dateMock.datePair(19, 7),
  },

  // Aetheris Moravayn - Hermaeus Mora's servant seeks knowledge
  {
    id: idMock.generateChatId("2135-aetheris-moravayn"),
    character_id: "2135-aetheris-moravayn",
    model_id: "gpt-5",
    title: "Apocrypha's Whispers",
    ...dateMock.datePair(30, 9),
  },

  // Sister Tacita - Elder Scroll prophecy reading
  {
    id: idMock.generateChatId("5768-sister-tacita"),
    character_id: "5768-sister-tacita",
    model_id: "gpt-4o",
    title: "The Scrolls Speak of Futures",
    ...dateMock.datePair(13, 3),
  },
];

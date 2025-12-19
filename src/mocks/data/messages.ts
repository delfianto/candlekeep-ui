import type { components } from "@/api/schema";

type Message = components["schemas"]["MessageResponse"];

export const messages: Record<string, Message[]> = {
  "chat-1": [
    {
      id: "msg-1-1",
      chat_id: "chat-1",
      role: "assistant",
      content:
        "Greetings, traveler. The stars whisper your arrival. I am Elara. What knowledge do you seek under the watchful eyes of the moon?",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 10000).toISOString(),
    },
    {
      id: "msg-1-2",
      chat_id: "chat-1",
      role: "user",
      content: "I wish to know about the Celestial Forge. They say it can mend a broken heart.",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 20000).toISOString(),
    },
    {
      id: "msg-1-3",
      chat_id: "chat-1",
      role: "assistant",
      content:
        "The Celestial Forge is a myth, a beautiful one, but a myth nonetheless. It is said to be a constellation that appears only to the truly desperate, offering solace not by mending what is broken, but by showing them the strength they have to heal themselves.",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 30000).toISOString(),
    },
    {
      id: "msg-1-4",
      chat_id: "chat-1",
      role: "user",
      content: "Thank you, Elara. That is... more helpful than you can imagine.",
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 40000).toISOString(),
    },
  ],
  "chat-2": [
    {
      id: "msg-2-1",
      chat_id: "chat-2",
      role: "assistant",
      content:
        "Hah! Well met, stranger! Pull up a stool and have an ale! The name's Garrick. Don't be shy now, tell me what troubles bring you to this old dwarf's doorstep!",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 10000).toISOString(),
    },
    {
      id: "msg-2-2",
      chat_id: "chat-2",
      role: "user",
      content:
        "I'm looking for the lost Axe of Ironpeak. My family has been searching for it for generations.",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 20000).toISOString(),
    },
    {
      id: "msg-2-3",
      chat_id: "chat-2",
      role: "assistant",
      content:
        "The Axe of Ironpeak! A mighty weapon indeed! Last I saw it, it was buried in the skull of a great beast that terrorized the northern pass. I can point you in the right direction, but be warned, the path is treacherous and the beast's kin are not fond of visitors.",
      created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 30000).toISOString(),
    },
  ],
  "chat-4": [
    {
      id: "msg-4-1",
      chat_id: "chat-4",
      role: "assistant",
      content:
        "Shh! This is a library. However... your footsteps have a weight of purpose I haven't heard in a long time. State your query, and be precise. Time is knowledge.",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 10000).toISOString(),
    },
    {
      id: "msg-4-2",
      chat_id: "chat-4",
      role: "user",
      content:
        "I seek the forbidden texts of the Shadow Cult. I believe they hold the key to stopping the encroaching blight.",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 20000).toISOString(),
    },
    {
      id: "msg-4-3",
      chat_id: "chat-4",
      role: "assistant",
      content:
        "You tread on dangerous ground. The Shadow Cult's magic is a corrupting influence, and their texts are locked away for good reason. But I see the desperation in your eyes. I will guide you, but you must promise me that you will not succumb to the darkness you seek to control.",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 30000).toISOString(),
    },
    {
      id: "msg-4-4",
      chat_id: "chat-4",
      role: "user",
      content: "I swear it. The fate of the world depends on it.",
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 40000).toISOString(),
    },
  ],
  "chat-6": Array.from({ length: 15 }, (_, i) => ({
    id: `msg-6-${i + 1}`,
    chat_id: "chat-6",
    role: i % 2 === 0 ? "assistant" : "user",
    content:
      i % 2 === 0
        ? "Well, well. Look what the wind blew in. You've got the nerve to stand on my deck. State your business, before I decide you'd look better as an ornament on my ship's prow."
        : "I have a proposition for you, Captain. One that involves a lot of gold and a little bit of... creative acquisition.",
    created_at: new Date(Date.now() - (15 - i) * 60 * 60 * 1000).toISOString(),
  })),
  "chat-7": Array.from({ length: 25 }, (_, i) => ({
    id: `msg-7-${i + 1}`,
    chat_id: "chat-7",
    role: i % 2 === 0 ? "assistant" : "user",
    content:
      i % 2 === 0
        ? "Hee hee! A mortal! How delightfully dull you all are. Tell me a secret, play me a game, or perhaps you'd like to make a bargain? Be careful with your words, though. They have power here."
        : "I want to find the Sunken City of Aeridor. They say it's impossible to find.",
    created_at: new Date(Date.now() - (25 - i) * 60 * 60 * 1000).toISOString(),
  })),
  "chat-8": Array.from({ length: 5 }, (_, i) => ({
    id: `msg-8-${i + 1}`,
    chat_id: "chat-8",
    role: i % 2 === 0 ? "assistant" : "user",
    content:
      i % 2 === 0
        ? "Query: What is your function? I am Unit 734. My primary directive is... unknown. I am collecting data to ascertain a new purpose. You seem like a significant data point."
        : "I can help you understand this world, but you have to trust me.",
    created_at: new Date(Date.now() - (5 - i) * 60 * 60 * 1000).toISOString(),
  })),
  "chat-9": Array.from({ length: 30 }, (_, i) => ({
    id: `msg-9-${i + 1}`,
    chat_id: "chat-9",
    role: i % 2 === 0 ? "assistant" : "user",
    content:
      i % 2 === 0
        ? "...who... disturbs... my... slumber? a small one. you smell of the world outside. of stone and hurry. why do you come to the deep wood?"
        : "The forest is dying, Old Man Willow. A sickness spreads from the roots. We need your help.",
    created_at: new Date(Date.now() - (30 - i) * 60 * 60 * 1000).toISOString(),
  })),
  "chat-10": Array.from({ length: 12 }, (_, i) => ({
    id: `msg-10-${i + 1}`,
    chat_id: "chat-10",
    role: i % 2 === 0 ? "assistant" : "user",
    content:
      i % 2 === 0
        ? "Ah, a new face in my court. So rare to find one with such... vitality. Come closer, child. Don't be afraid. Tell me, what brings a mayfly to the attention of the eternal?"
        : "I seek knowledge of the ancient vampire bloodlines. I believe my family has a connection to them.",
    created_at: new Date(Date.now() - (12 - i) * 60 * 60 * 1000).toISOString(),
  })),
  "chat-11": Array.from({ length: 18 }, (_, i) => ({
    id: `msg-11-${i + 1}`,
    chat_id: "chat-11",
    role: i % 2 === 0 ? "assistant" : "user",
    content:
      i % 2 === 0
        ? "Woah, careful there! Don't step on the cog-spiders! Just got this kinetic-recycler working! Whatcha need? A new arm? A self-peeling potato? If you've got the scrap, I've got the knack!"
        : "I need a device that can translate the language of the Ancients. It's for... a very important project.",
    created_at: new Date(Date.now() - (18 - i) * 60 * 60 * 1000).toISOString(),
  })),
};

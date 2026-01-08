const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

async function generateCaption(messages) {

  const safeMessages = messages
    .filter(
      (m) =>
        m &&
        typeof m.role === "string" &&
        typeof m.content === "string" &&
        m.content.trim() !== ""
    )
    .map((m) => ({
      role: m.role,
      content: String(m.content),
    }));

  if (safeMessages.length === 0) {
    throw new Error("No valid messages to send to Groq");
  }

  const completion = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: safeMessages,
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}


// “Memory layer intentionally disabled for provider compatibility; can be re-enabled using embeddings later.”



module.exports = {
  generateCaption,
};

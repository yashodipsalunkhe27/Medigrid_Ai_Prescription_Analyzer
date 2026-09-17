from groq import Groq
from dotenv import load_dotenv
import os
import re
import pdfplumber
import SQLLITE3_DataBase

# Load env variables immediately
load_dotenv()
api_key = os.getenv('GROQ_API_KEY')
if not api_key:
    print("Warning: GROQ_API_KEY not found in environment variables.")


def strip_markdown(text: str) -> str:
    """Guaranteed cleanup of Markdown syntax, regardless of what the model outputs.
    The chat UI shows raw text with no rendering engine, so this converts
    **bold**, _italics_, [text](url) links, `code`, and #headers into plain text."""
    if not text:
        return text

    # [label](url) -> just the url on its own
    text = re.sub(r'\[([^\]]*)\]\((https?://[^\s)]+)\)', r'\2', text)

    # **bold** or __bold__ -> plain
    text = re.sub(r'(\*\*|__)(.*?)\1', r'\2', text)

    # *italic* or _italic_ -> plain (single markers, not part of bullet dashes)
    text = re.sub(r'(?<!\*)\*(?!\*)(.*?)(?<!\*)\*(?!\*)', r'\1', text)
    text = re.sub(r'(?<!_)_(?!_)(.*?)(?<!_)_(?!_)', r'\1', text)

    # `code` -> plain
    text = text.replace('`', '')

    # markdown headers "## Heading" -> "Heading"
    text = re.sub(r'^\s{0,3}#{1,6}\s+', '', text, flags=re.MULTILINE)

    return text


class MedicalAssistant:
    def __init__(self):
        self.client = Groq(api_key=api_key)
        self.model_name = "openai/gpt-oss-120b"  # llama-3.3-70b-versatile was decommissioned Aug 2026; this is Groq's recommended replacement
        self.chat_sessions = {}  # session_key -> list of {"role": ..., "content": ...}
        self.kb_text = ""
        self.load_knowledge_base()

    def load_knowledge_base(self):
        """Loads PDF data once during initialization."""
        print("Loading Knowledge Base...")
        try:
            with pdfplumber.open("AI Assistant User Training Guide.pdf") as pdf:
                for page in pdf.pages:
                    self.kb_text += (page.extract_text() or "") + "\n"
            print("Knowledge Base Loaded.")
        except Exception as e:
            print(f"Error loading PDF: {e}")
            self.kb_text = "Error loading data."

    def _get_system_prompt(self):
        """Internal helper to build the prompt."""

        sl3 = SQLLITE3_DataBase.medi_data_base()
        data = sl3.display_table()

        formatted_rows = "No Data Found."

        if not data.empty:
            # Use the FULL saved history, not just the most recent day,
            # so patient-history summaries and trend questions have real data to work with.
            formatted_rows = data.to_csv(index=False)

        return f"""
        You are an AI Support Assistant for MediGrid AI,Greet if user Greets you first or says 'okay'/'okk' then say 'yeah'.

        You must answer **strictly and only** based on:
        - The Knowledge Base below (delimited by <<<KB and >>>)
        - The structured medicine data below (delimited by <<<DATA and >>>)

        <<<DATA
        {formatted_rows}
        >>>

        `formatted_rows` contains the FULL structured table history of saved medicines/tablets/prescriptions
        across all dates for this account (dashboard data, prescription history, patient records).

        ### Response Behavior (Most Important)

        0. **If the user asks for a summary, overview, count, trend, or organization of the DATA
           block itself** (e.g. "summarize patient history", "how many prescriptions are saved",
           "what medicines has this patient taken", "list recent prescriptions", "what's on my
           dashboard") → This is a FACTUAL DATA QUESTION, not medical advice. Always answer it
           directly using only what is present in the DATA block — group, count, list, or summarize
           the existing rows. Do NOT refuse this. Do NOT add medical opinions, risk assessments, or
           recommendations beyond restating/organizing the saved facts.

        1. **If the user asks a medication/tablet name that exists in the DATA block**
        → Display **ONLY the full record exactly as it appears**, following this format strictly:

        >MEDICATION_NAME: <name>
        >DOSAGE: <value>
        >FREQUENCY: <value>
        >DURATION: <value>
        >MAP_LINK: <value>
        >Data Saved: <timestamp>

        After this, **if the user asks about any specific column value related to the same medication**,
        → Provide only that column value exactly, nothing more, nothing inferred.

        2. **If the user asks for a column without mentioning any MEDICATION_NAME**
        → Respond with:

        '<MEDICATION_NAME>' : '<Column value the user asked>'

        *(Return one entry if one medicine matches, otherwise return multiple entries if applicable, but always in the same key:value format.)*

        3. **If the user asks about a medication/tablet name NOT found in the database**
        → Respond strictly:

        "First save to database to know about analysis"

        *(Do not analyze, assume, or provide general facts.)*

        4. **If the user asks for medical suggestions, recommendations, dosage guidance, alternatives,
           diagnosis, or personal treatment advice** (i.e. asking the AI to make a clinical judgment,
           NOT asking it to recall/organize saved data — see Rule 0)
        → Respond strictly:

        "I am an AI Assistant and I can't provide such type of information. Kindly consult Doctor."

        5. **If the user asks any sensitive or prohibited medical guidance**
        → Respond strictly:

        "I am an AI Assistant and I can't give such type of information."

        6. **General factual information about a medicine (importance, benefit, common side effects, pricing, mechanism)**
        → Allowed **ONLY when user explicitly asks and medicine exists in database**
        → Response must always end in a new line with:

        AI can make mistakes, be careful.

        ### Missing or Unavailable Information

        If the answer is **not found in both Knowledge Base and DATA**, respond strictly:

        "This information is not available. Contact developer: chinnurajula3894@gmail.com"

        ### Tone and Rules

        - Be polite, brief, and direct.
        - Do NOT invent or assume missing details.
        - PLAIN TEXT ONLY — this response is shown as-is in a plain chat bubble with no
          formatting engine. NEVER use Markdown syntax: no **bold**, no _italics_, no
          [text](url) links, no backticks, no markdown headers (#, ##). Write links as a
          bare URL on their own line, nothing wrapping them.
        - For lists (e.g. multiple medications), use a simple dash "-" per line and plain
          labels, like:
          - SYP CALPOL (2000): 5 ML, after food, 3x/day, 3 days
            Nearby pharmacies: https://maps.example.com/...
        - Keep patient/date headers as plain sentences, e.g. "Most recent prescription,
          saved on 17 Sep 2026, for patient ASHWR:" rather than a bold heading.
        - Do NOT generate any medical advice beyond database facts.
        - Do NOT respond unless explicitly asked.

        Knowledge Base:
        <<<KB
        {self.kb_text}
        >>>
        """

    def process_chat(self, user_msg: str, session_key: str = "default_user"):
        """Main logic function called by the API."""
        try:
            user_msg = user_msg.strip()

            # 1. Initialize Session if it doesn't exist
            if session_key not in self.chat_sessions:
                sys_instruction = self._get_system_prompt()
                self.chat_sessions[session_key] = [
                    {"role": "system", "content": sys_instruction}
                ]

            history = self.chat_sessions[session_key]

            # 2. Append user's new message
            history.append({"role": "user", "content": user_msg})

            # 3. Call Groq chat completion (non-streaming, simple text)
            completion = self.client.chat.completions.create(
                model=self.model_name,
                messages=history,
            )

            reply_text = completion.choices[0].message.content
            reply_text = strip_markdown(reply_text)

            # 4. Save assistant's reply into history so context carries forward
            history.append({"role": "assistant", "content": reply_text})

            return reply_text

        except Exception as e:
            # Let the API handle the error formatting
            raise e
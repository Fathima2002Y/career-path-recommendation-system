"""
Shared AI utility module using Groq API (with fallback models).
Provides generate_json() and generate_content() used across all apps.
"""

import os
import json
import re
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / '.env')

GROQ_API_KEY = os.environ.get('GROQ_API_KEY', '')

# Groq models to try in order (fallback chain)
GROQ_MODELS = [
    "llama-3.3-70b-versatile",
    "llama-3.1-8b-instant",
    "mixtral-8x7b-32768",
]


def _get_groq_client():
    """Create and return a Groq client."""
    if not GROQ_API_KEY:
        raise ValueError("GROQ_API_KEY is not set. Add it to your Prediction/.env file.")
    from groq import Groq
    return Groq(api_key=GROQ_API_KEY)


def generate_content(prompt, temperature=0.3, max_output_tokens=1024):
    """
    Generate text content using Groq API with model fallback.
    Returns the generated text as a string.
    """
    client = _get_groq_client()

    for model in GROQ_MODELS:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are a helpful career guidance assistant."},
                    {"role": "user", "content": prompt},
                ],
                temperature=temperature,
                max_tokens=max_output_tokens,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Groq model {model} failed: {e}")
            continue

    raise Exception("All Groq models failed. Please try again later.")


def generate_json(prompt, temperature=0.3, max_output_tokens=2048):
    """
    Generate JSON content using Groq API with model fallback.
    Parses the response and returns a Python dict/list.
    """
    client = _get_groq_client()

    for model in GROQ_MODELS:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant. Always respond with valid JSON only. No markdown, no code blocks, no extra text."
                    },
                    {"role": "user", "content": prompt},
                ],
                temperature=temperature,
                max_tokens=max_output_tokens,
            )
            raw = response.choices[0].message.content.strip()
            return _parse_json_response(raw)
        except json.JSONDecodeError as e:
            print(f"JSON parse error with {model}: {e}")
            continue
        except Exception as e:
            print(f"Groq model {model} failed: {e}")
            continue

    raise Exception("All Groq models failed to generate valid JSON. Please try again later.")


def _parse_json_response(raw_text):
    """
    Parse JSON from an LLM response, handling common formatting issues
    like markdown code blocks.
    """
    text = raw_text.strip()

    # Remove markdown code blocks if present
    if text.startswith("```"):
        # Remove opening ```json or ```
        text = re.sub(r'^```(?:json)?\s*\n?', '', text)
        # Remove closing ```
        text = re.sub(r'\n?```\s*$', '', text)
        text = text.strip()

    # Try parsing directly
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Try to find JSON array or object in the text
    json_match = re.search(r'(\[[\s\S]*\]|\{[\s\S]*\})', text)
    if json_match:
        try:
            return json.loads(json_match.group(1))
        except json.JSONDecodeError:
            pass

    raise json.JSONDecodeError("Could not parse JSON from response", text, 0)

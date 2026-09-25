# Lofi radio shortlist

Researched September 24, 2026. These are source-backed station candidates, not installed replacements for the current Jamendo searches. Live status and permission to embed must be checked on each selected stream during integration.

| Candidate | Focus | Official source |
| --- | --- | --- |
| Lofi Girl — Study Radio | Lofi hip-hop for studying | https://www.lofigirl.com/ |
| Lofi Girl — Sleep Radio | Sleep/chill lofi hip-hop | https://www.lofigirl.com/ |
| Lofi Girl — Jazz Lofi Radio | Jazz lofi | https://www.lofigirl.com/ |
| Chillhop Radio | Jazzy and lofi hip-hop | https://chillhop.com/ |
| Chill with Taiki — Chill Lofi Hip Hop Radio | Sleep, relaxation, and study lofi | https://www.youtube.com/watch?v=qH3fETPsqXU |
| College Music — Lofi Radio | Lofi hip-hop study radio | https://collegemusic.co.uk/about-us/ |

## Integration implications

Use official YouTube embeds where the publisher enables embedding, with an external listening link as fallback. These links are not MP3 endpoints and cannot be passed into Howler. A listing or publicly viewable stream does not grant rebroadcast or audio-extraction rights.

YouTube's IFrame API supports playback and volume controls. Its player must remain visible and meet minimum dimensions; do not hide it behind Mochi's artwork or extract its audio. A live radio does not offer the current track-by-track next/previous/shuffle behavior, so those controls would need to become station navigation or be removed for radio mode. Local ambience can continue using Howler.

Official technical references:
- https://developers.google.com/youtube/iframe_api_reference
- https://developers.google.com/youtube/terms/developer-policies

No direct Howler-compatible stream endpoints or commercial rebroadcast permissions have been verified for these candidates. Station availability can change. If retaining the existing audio-only player is essential, use explicitly licensed lofi tracks through Jamendo and curate six track collections instead.

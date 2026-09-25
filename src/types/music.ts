export interface Track {
  id: string;
  name: string;
  artist_name: string;
  audio: string;
  image: string;
  shareurl: string;
  license_ccurl: string;
}
export interface Station {
  id: string;
  name: string;
  icon: string;
  description: string;
  trackIds: string[];
  color: string;
}
export interface MusicProvider {
  getTracks(station: Station, signal?: AbortSignal): Promise<Track[]>;
}

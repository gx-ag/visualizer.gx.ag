class YouTubeInfo {
  progress: number;
  youtubeUrl: string;
  videoTitle: string;
  artist: string;
  title: string;
  thumbnail: string;
  error: string;
};
type ProgressCallback = (progress: number) => void;

export function ytmp3(id: string, progressCb: ProgressCallback) {
  let promise = new Promise<YouTubeInfo>(async (resolve, reject) => {
    while (true) {
      try {
        let data = await fetch(`https://ytmp3.gx.ag/${id}.json`, {
          method: 'get'
        });
        let json = await data.json();
        if (json.status === 'complete') {
          resolve(json);
          break;
        } else if (json.status === 'error') {
          reject(json.message);
          break;
        } else if (json.status === 'downloading') {
          progressCb(json.progress * 0.5);
        } else if (json.status === 'converting') {
          progressCb(0.5 + json.progress * 0.5);
        }
      } catch (err) {
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  });
  return {
    url: `https://ytmp3.gx.ag/${id}.mp3`,
    thumb: `https://ytmp3.gx.ag/${id}.jpg`,
    promise
  };
}
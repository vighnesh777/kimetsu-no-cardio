import { useState, useEffect, useRef } from 'react';
import { HUNTERS } from './hunters';

// v3 — stores { thumb, large } per character
const CACHE_KEY   = 'ds_hunter_images_v3';
const JIKAN_BASE  = 'https://api.jikan.moe/v4/characters';
const REQUEST_GAP = 420; // ms — Jikan allows ~3 req/sec

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveCache(data) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(data)); } catch {}
}

export function useHunterImages() {
  const [images, setImages]         = useState(loadCache);
  const [loadingIds, setLoadingIds] = useState([]);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    const cached  = loadCache();
    // Refetch if any entry is missing the new { thumb, large } shape
    const toFetch = HUNTERS.filter(h => !cached[h.id]?.thumb);

    if (!toFetch.length) { setImages(cached); return; }
    setLoadingIds(toFetch.map(h => h.id));

    (async () => {
      const current = { ...cached };

      for (const hunter of toFetch) {
        try {
          let res = await fetch(`${JIKAN_BASE}/${hunter.malId}`);
          if (res.status === 429) {
            await new Promise(r => setTimeout(r, 1200));
            res = await fetch(`${JIKAN_BASE}/${hunter.malId}`);
          }
          const data = await res.json();
          const jpg  = data?.data?.images?.jpg;
          current[hunter.id] = {
            thumb: jpg?.image_url       || null,
            large: jpg?.large_image_url || jpg?.image_url || null,
          };
        } catch {
          current[hunter.id] = { thumb: null, large: null };
        }

        setImages({ ...current });
        setLoadingIds(prev => prev.filter(id => id !== hunter.id));
        await new Promise(r => setTimeout(r, REQUEST_GAP));
      }

      saveCache(current);
    })();
  }, []);

  const imageForId      = (id) => images[id]?.thumb ?? null;
  const largeImageForId = (id) => images[id]?.large ?? images[id]?.thumb ?? null;
  const isLoading       = (id) => loadingIds.includes(id);

  return { images, imageForId, largeImageForId, isLoading, loadingIds };
}

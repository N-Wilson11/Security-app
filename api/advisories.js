'use strict';

const { fetchAdvisories, FEED_URL } = require('../src/feed');

const REFRESH_MINUTES = Number(process.env.REFRESH_MINUTES) || 15;

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const advisories = await fetchAdvisories();
    res.setHeader('Cache-Control', `public, s-maxage=${REFRESH_MINUTES * 60}, stale-while-revalidate=60`);
    return res.status(200).json({
      source: FEED_URL,
      refreshMinutes: REFRESH_MINUTES,
      advisories,
      updatedAt: new Date().toISOString(),
      error: null,
    });
  } catch (error) {
    console.error('Verversen mislukt:', error.message);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      source: FEED_URL,
      refreshMinutes: REFRESH_MINUTES,
      advisories: [],
      updatedAt: null,
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

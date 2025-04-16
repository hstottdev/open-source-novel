const axios = require('axios');

module.exports = async (req, res) => {
  const { story } = req.body;
  const token = process.env.GITHUB_TOKEN;
  const repo = 'hstottdev/open-source-novel';
  const path = 'data/story-data.json';

  try {
    const response = await axios.put(
      `https://api.github.com/repos/${repo}/contents/${path}`,
      {
        message: 'Update story data',
        content: Buffer.from(JSON.stringify(story, null, 2)).toString('base64'),
        sha: (await axios.get(`https://api.github.com/repos/${repo}/contents/${path}`, {
          headers: { Authorization: `token ${token}` }
        })).data.sha
      },
      {
        headers: { Authorization: `token ${token}` }
      }
    );

    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
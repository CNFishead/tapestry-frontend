const quickstartFileId = '1SKBSzPQiSGeMonIjlrZMs6NTbOQTM1Wf';
const playersGuideFileId = '1StakxqmJSl9Hakdf2zLIN27WhZO5B7GT';

export const quickstartResource = {
  title: 'Tapestry Quickstart Guide',
  eyebrow: '01 — Learn the game',
  description: 'Start playing in about ten minutes with the core roll, Threads, fast character creation, combat basics, and a starter encounter.',
  coverSrc: 'https://res.cloudinary.com/wulfdev/image/upload/v1780602174/ChatGPT_Image_Jan_11_2026_08_41_40_PM_-_Copy_shborj.png',
  previewHref: `https://drive.google.com/file/d/${quickstartFileId}/view`,
  downloadHref: `https://drive.google.com/uc?export=download&id=${quickstartFileId}`,
  facts: ['2–5 players', '1 Storyweaver', '3d6', 'About 10 minutes', 'Free PDF'],
} as const;

export const characterBuilderResource = {
  eyebrow: 'Build online',
  title: 'Create a digital character',
  description: 'Build and manage your character in the Tapestry player app, then keep their sheet available as the campaign grows.',
  href: 'https://app.tapestry-ttrpg.com',
  actionLabel: 'Open the character builder',
  accessNote: 'Free account required.',
} as const;

export const printableSheetResource = {
  eyebrow: 'Play on paper',
  title: 'Use a printable character sheet',
  description: 'Bring pencil, paper, and dice to the table with a standalone sheet that does not require an account.',
  accessNote: 'Standalone PDF in preparation.',
} as const;

export const playersGuideResource = {
  title: 'Tapestry Player’s Guide',
  eyebrow: '03 — Go deeper',
  description: 'The Quickstart gets the table moving. The Player’s Guide expands character creation, Aspects, Skills, Threads, Conditions, equipment, and growth through Weaves.',
  coverSrc: 'https://res.cloudinary.com/wulfdev/image/upload/v1780602174/ChatGPT_Image_Jan_11_2026_08_39_20_PM_-_Copy_mgah5q.png',
  previewHref: `https://drive.google.com/file/d/${playersGuideFileId}/view`,
  downloadHref: `https://drive.google.com/uc?export=download&id=${playersGuideFileId}`,
} as const;

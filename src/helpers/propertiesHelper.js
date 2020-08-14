export const getAnnotations = (value) => {
  const annotations = [];
  const keys = [];
  const lines = value.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    if (!(trimmed.length === 0 || trimmed.startsWith('#'))) {
      if (trimmed.indexOf('=') < 0) {
        annotations.push({ row: i, column: 0, type: 'error', text: '未包含等号' });
      }
      const [key, val] = trimmed.split('=');
      if (keys.indexOf(key.trim()) > 0) {
        annotations.push({ row: i, column: 0, type: 'error', text: '重复的Key' });
      }
      if (val === undefined || val.trim().length === 0) {
        annotations.push({ row: i, column: 0, type: 'error', text: '值不能为空' });
      }
    }
  }
  return annotations;
}
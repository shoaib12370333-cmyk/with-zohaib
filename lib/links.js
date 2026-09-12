export function waLink(number, text) {
  if (!number) return '#';
  const base = `https://wa.me/${number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export function messengerLink(username, text) {
  if (!username) return null;
  const base = `https://m.me/${username}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
